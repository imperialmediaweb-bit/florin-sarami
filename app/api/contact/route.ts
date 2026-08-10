import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { brandEmail, fieldsTable, nl2br } from '@/lib/email';
import { dataDir } from '@/lib/storage';
import { cloudPut } from '@/lib/cloudstore';

/**
 * Trimite mesajele din formularul de contact prin Resend (https://resend.com).
 * Configurare (Railway → Variables sau .env local):
 *   RESEND_API_KEY  — cheia API (obligatoriu; NU se pune niciodată în cod)
 *   RESEND_FROM     — expeditorul, ex: "Sarami Media <contact@sarami.ro>"
 *                     (domeniul trebuie verificat în Resend; până atunci
 *                     funcționează implicitul onboarding@resend.dev)
 *   CONTACT_TO      — destinatarul (implicit contact@sarami.ro)
 */
export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 });
  }

  const nume = String(data.nume || '').trim();
  const email = String(data.email || '').trim();
  const telefon = String(data.telefon || '').trim();
  const serviciu = String(data.serviciu || '').trim();
  const mesaj = String(data.mesaj || '').trim();
  const consent = Boolean(data.consent);
  // formularele de brief trimit câmpuri suplimentare ca perechi etichetă → valoare
  const formular = String(data.formular || 'Contact').trim();
  const extra = (typeof data.extra === 'object' && data.extra !== null ? data.extra : {}) as Record<string, unknown>;

  if (!consent) {
    return NextResponse.json({ error: 'Bifează acordul pentru prelucrarea datelor personale.' }, { status: 400 });
  }
  if (!nume || !email || !mesaj) {
    return NextResponse.json({ error: 'Completează numele, emailul și mesajul.' }, { status: 400 });
  }

  // salvează mesajul pe disc — apare în panoul de admin (tab-ul Mesaje),
  // indiferent dacă emailul prin Resend reușește sau nu
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    const json = JSON.stringify(
      { id, date: new Date().toISOString(), formular, serviciu, nume, email, telefon, mesaj, extra },
      null,
      2
    );
    fs.writeFileSync(path.join(dataDir('mesaje'), `${id}.json`), json);
    // și în seiful Cloudinary, fără să ținem vizitatorul în așteptare —
    // briefurile supraviețuiesc redeploy-urilor
    void cloudPut('mesaje', `${id}.json`, json);
  } catch (err) {
    console.error('Nu am putut salva mesajul pe disc:', err);
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // fără cheie Resend mesajul rămâne disponibil în panoul de admin
    return NextResponse.json({ ok: true, emailSent: false });
  }

  let res: Response;
  try {
    res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || 'Sarami Media <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO || 'contact@sarami.ro'],
      reply_to: email,
      subject: `[${formular}] ${serviciu || 'general'} — ${nume}`,
      text: [
        `Formular: ${formular}`,
        `Nume: ${nume}`,
        `Email: ${email}`,
        `Telefon: ${telefon || '—'}`,
        `Serviciu: ${serviciu || '—'}`,
        ...Object.entries(extra)
          .filter(([, v]) => String(v || '').trim())
          .map(([k, v]) => `${k}: ${String(v).trim()}`),
        '',
        mesaj,
        '',
        '— trimis de pe sarami.ro (consimțământ GDPR bifat)',
      ].join('\n'),
      html: brandEmail({
        heading: `${formular === 'Contact' ? '💬 Mesaj nou' : '📋 Brief nou'} — ${serviciu || 'general'}`,
        preheader: `${nume}: ${mesaj.slice(0, 80)}`,
        bodyHtml: `
          ${fieldsTable([
            ['Nume', nume],
            ['Email', email],
            ['Telefon', telefon || '—'],
            ['Serviciu', serviciu || '—'],
            ...Object.entries(extra).map(([k, v]) => [k, String(v).trim()] as [string, string]),
          ])}
          <p style="margin:16px 0 6px;font-weight:700;color:#16307a;">Mesajul:</p>
          <div style="background:#f7faff;border-left:3px solid #2563eb;border-radius:8px;padding:14px 18px;">${nl2br(mesaj)}</div>
          <p style="margin:18px 0 0;font-size:12px;color:#7d8fb0;">Trimis de pe sarami.ro • consimțământ GDPR bifat • poți răspunde direct la acest email.</p>
        `,
      }),
    }),
    });
  } catch (err) {
    console.error('Conexiunea către Resend a eșuat:', err);
    // mesajul e salvat în panou — nu îl considerăm pierdut
    return NextResponse.json({ ok: true, emailSent: false });
  }

  if (!res.ok) {
    console.error('Resend a răspuns cu', res.status, await res.text());
    return NextResponse.json({ ok: true, emailSent: false });
  }

  // confirmare automată către client (dacă eșuează, nu blocăm nimic)
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'Sarami Media <onboarding@resend.dev>',
        to: [email],
        reply_to: process.env.CONTACT_TO || 'contact@sarami.ro',
        subject: `${nume.split(' ')[0]}, am primit ${formular === 'Contact' ? 'mesajul' : 'brief-ul'} tău! 🎉 — Sarami Media`,
        text: [
          `Bună, ${nume.split(' ')[0]}! 👋`,
          '',
          formular === 'Contact'
            ? 'Mesajul tău a ajuns cu bine la noi — mulțumim că ne-ai scris!'
            : `Brief-ul tău pentru ${serviciu.toLowerCase()} a ajuns cu bine la noi — mulțumim pentru toate detaliile, ne ușurează mult treaba!`,
          'Îl citim cu atenție și revenim cu răspunsul nostru de obicei în aceeași zi lucrătoare. Dacă ne-ai scris seara sau în weekend, ne auzim în prima zi lucrătoare, la prima oră. ☕',
          '',
          'Între timp, dacă îți mai vine ceva în minte — linkuri, materiale, idei — răspunde direct la acest email și ajunge la noi.',
          '',
          'Cu drag,',
          'Echipa Sarami Media',
          'sarami.ro • contact@sarami.ro',
        ].join('\n'),
        html: brandEmail({
          heading: `Bună, ${nume.split(' ')[0]}! 👋 ${formular === 'Contact' ? 'Mesajul' : 'Brief-ul'} tău a ajuns la noi`,
          preheader: 'Mulțumim că ne-ai scris! Revenim de obicei în aceeași zi lucrătoare.',
          bodyHtml: `
            <p style="margin:0 0 14px;">${
              formular === 'Contact'
                ? 'Mesajul tău a ajuns cu bine la noi — <strong style="color:#16307a;">mulțumim că ne-ai scris!</strong>'
                : `Brief-ul tău pentru <strong style="color:#16307a;">${serviciu.toLowerCase()}</strong> a ajuns cu bine la noi — mulțumim pentru toate detaliile, ne ușurează mult treaba!`
            }</p>
            <p style="margin:0 0 14px;">Îl citim cu atenție și revenim cu răspunsul nostru <strong style="color:#16307a;">de obicei în aceeași zi lucrătoare</strong>. Dacă ne-ai scris seara sau în weekend, ne auzim în prima zi lucrătoare, la prima oră. ☕</p>
            <p style="margin:0 0 20px;">Între timp, dacă îți mai vine ceva în minte — linkuri, materiale, idei — răspunde direct la acest email și ajunge la noi.</p>
            <table cellpadding="0" cellspacing="0"><tr><td style="background:linear-gradient(135deg,#1d4ed8,#2563eb);background-color:#2563eb;border-radius:999px;">
              <a href="https://sarami.ro/portofoliu/" style="display:inline-block;padding:11px 26px;color:#ffffff;font-weight:700;font-size:13.5px;text-decoration:none;">▶ Aruncă un ochi pe portofoliul nostru</a>
            </td></tr></table>
            <p style="margin:20px 0 0;color:#43587f;">Cu drag,<br><strong style="color:#16307a;">Echipa Sarami Media</strong></p>
          `,
        }),
      }),
    });
  } catch (err) {
    console.error('Confirmarea către client a eșuat:', err);
  }

  return NextResponse.json({ ok: true, emailSent: true });
}
