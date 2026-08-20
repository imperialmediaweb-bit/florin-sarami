import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin';
import { brandEmail, nl2br } from '@/lib/email';
import { dataDir } from '@/lib/storage';
import { cloudPut } from '@/lib/cloudstore';

export const dynamic = 'force-dynamic';

/**
 * Trimite un email din panoul de admin, prin Resend (reputație bună la Gmail,
 * deci ajunge în Inbox, nu în spam). Răspunsurile clientului vin înapoi în
 * cutia contact@sarami.ro, care se citește tot din panou.
 *
 * Body: { to, subject, text, inReplyTo?, references?, simplu? }
 *   simplu = true → email text curat, fără antetul grafic (răspuns personal)
 */
export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 });
  }

  const to = String(data.to || '').trim();
  const subject = String(data.subject || '').trim();
  const text = String(data.text || '').trim();
  const simplu = Boolean(data.simplu);
  const inReplyTo = String(data.inReplyTo || '').trim();
  const references = String(data.references || '').trim();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return NextResponse.json({ error: 'Adresă de email invalidă.' }, { status: 400 });
  }
  if (!subject || !text) {
    return NextResponse.json({ error: 'Subiectul și mesajul sunt obligatorii.' }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY nu este configurat — nu pot trimite emailuri.' },
      { status: 500 }
    );
  }

  const semnatura = '\n\n—\nSarami Media\nsarami.ro • contact@sarami.ro';
  // la răspunsuri personale trimitem text simplu + HTML minimal:
  // arată ca un email scris de om, nu ca un newsletter (și trece mai ușor de filtre)
  const html = simplu
    ? `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f2937;">${nl2br(text)}<br><br>—<br><strong>Sarami Media</strong><br><a href="https://sarami.ro" style="color:#2563eb;">sarami.ro</a> • contact@sarami.ro</div>`
    : brandEmail({
        heading: subject,
        preheader: text.slice(0, 90),
        bodyHtml: `<div style="margin:0 0 18px;">${nl2br(text)}</div>`,
      });

  // antetele de „conversație" — răspunsul se lipește de firul original în Gmail
  const headers: Record<string, string> = {};
  if (inReplyTo) headers['In-Reply-To'] = inReplyTo;
  if (references || inReplyTo) headers['References'] = references || inReplyTo;

  let res: Response;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'Sarami Media <onboarding@resend.dev>',
        to: [to],
        reply_to: process.env.CONTACT_TO || 'contact@sarami.ro',
        subject,
        text: text + semnatura,
        html,
        ...(Object.keys(headers).length ? { headers } : {}),
      }),
    });
  } catch (err) {
    console.error('Conexiunea către Resend a eșuat:', err);
    return NextResponse.json({ error: 'Trimiterea a eșuat — verifică conexiunea.' }, { status: 502 });
  }

  if (!res.ok) {
    const detail = await res.text();
    console.error('Resend a răspuns cu', res.status, detail);
    return NextResponse.json({ error: `Trimiterea a eșuat (Resend ${res.status}).` }, { status: 502 });
  }

  // păstrăm o copie în „Trimise", ca să existe istoric în panou
  try {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const json = JSON.stringify({ id, date: new Date().toISOString(), to, subject, text }, null, 2);
    fs.writeFileSync(path.join(dataDir('trimise'), `${id}.json`), json);
    void cloudPut('trimise', `${id}.json`, json);
  } catch (err) {
    console.error('Nu am putut salva copia emailului trimis:', err);
  }

  return NextResponse.json({ ok: true });
}
