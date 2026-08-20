import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin';
import { nl2br } from '@/lib/email';
import { recordSent, sendViaResend } from '@/lib/sendmail';

export const dynamic = 'force-dynamic';

/**
 * Trimite un email personal din panoul de admin (secțiunea Email), prin Resend.
 * Textul arată ca un email scris de om — nu ca un newsletter — și trece mai
 * ușor de filtrele de spam. Body: { to, subject, text, inReplyTo?, references? }
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
  const inReplyTo = String(data.inReplyTo || '').trim();
  const references = String(data.references || '').trim();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return NextResponse.json({ error: 'Adresă de email invalidă.' }, { status: 400 });
  }
  if (!subject || !text) {
    return NextResponse.json({ error: 'Subiectul și mesajul sunt obligatorii.' }, { status: 400 });
  }

  // antetele de conversație — RFC 5322: References = ale părintelui + Message-ID-ul lui
  const headers: Record<string, string> = {};
  if (inReplyTo) headers['In-Reply-To'] = inReplyTo;
  const refs = [references, inReplyTo].filter(Boolean).join(' ');
  if (refs) headers['References'] = refs;

  const result = await sendViaResend({
    to,
    subject,
    text: `${text}\n\n—\nSarami Media\nsarami.ro • contact@sarami.ro`,
    html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f2937;">${nl2br(text)}<br><br>—<br><strong>Sarami Media</strong><br><a href="https://sarami.ro" style="color:#2563eb;">sarami.ro</a> • contact@sarami.ro</div>`,
    headers,
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  recordSent(to, subject, text);
  return NextResponse.json({ ok: true });
}
