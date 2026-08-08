import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin';
import { brandEmail, nl2br } from '@/lib/email';

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

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY nu este configurat în variabilele de mediu — nu pot trimite emailuri.' },
      { status: 500 }
    );
  }

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
      }),
    });
  } catch (err) {
    console.error('Conexiunea către Resend a eșuat:', err);
    return NextResponse.json({ error: 'Trimiterea a eșuat — verifică conexiunea.' }, { status: 502 });
  }

  if (!res.ok) {
    console.error('Resend a răspuns cu', res.status, await res.text());
    return NextResponse.json({ error: `Trimiterea a eșuat (Resend ${res.status}).` }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
