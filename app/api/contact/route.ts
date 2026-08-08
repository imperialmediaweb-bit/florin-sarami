import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { dataDir } from '@/lib/storage';

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
    fs.writeFileSync(
      path.join(dataDir('mesaje'), `${id}.json`),
      JSON.stringify(
        { id, date: new Date().toISOString(), formular, serviciu, nume, email, telefon, mesaj, extra },
        null,
        2
      )
    );
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

  return NextResponse.json({ ok: true, emailSent: true });
}
