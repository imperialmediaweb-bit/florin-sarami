import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin';
import { brandEmail, nl2br } from '@/lib/email';
import { recordSent, sendViaResend } from '@/lib/sendmail';

/** Trimite un răspuns (ofertă) către client, direct din panoul de admin. */
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

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return NextResponse.json({ error: 'Adresă de email invalidă.' }, { status: 400 });
  }
  if (!subject || !text) {
    return NextResponse.json({ error: 'Subiectul și mesajul sunt obligatorii.' }, { status: 400 });
  }

  const result = await sendViaResend({
    to,
    subject,
    text: `${text}\n\n—\nSarami Media • sarami.ro • contact@sarami.ro`,
    html: brandEmail({
      heading: subject,
      preheader: text.slice(0, 90),
      bodyHtml: `
        <div style="margin:0 0 18px;">${nl2br(text)}</div>
        <table cellpadding="0" cellspacing="0"><tr><td style="background:linear-gradient(135deg,#1d4ed8,#2563eb);background-color:#2563eb;border-radius:999px;">
          <a href="https://sarami.ro" style="display:inline-block;padding:11px 26px;color:#ffffff;font-weight:700;font-size:13.5px;text-decoration:none;">Vizitează sarami.ro</a>
        </td></tr></table>
      `,
    }),
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  // ofertele apar și ele în istoricul „Trimise" din secțiunea Email
  recordSent(to, subject, text);
  return NextResponse.json({ ok: true });
}
