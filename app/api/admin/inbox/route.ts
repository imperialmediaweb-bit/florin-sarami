import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin';
import { listInbox, mailboxConfigured, readMessage } from '@/lib/mailbox';

export const dynamic = 'force-dynamic';
// citirea prin IMAP poate dura câteva secunde
export const maxDuration = 60;

/**
 * GET /api/admin/inbox/          → lista ultimelor mesaje primite
 * GET /api/admin/inbox/?uid=123  → conținutul complet al unui mesaj
 */
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
  }
  if (!mailboxConfigured()) {
    return NextResponse.json(
      {
        error:
          'Cutia poștală nu e conectată încă. Adaugă în Railway → Variables parola căsuței: IMAP_PASSWORD (și opțional IMAP_USER, implicit contact@sarami.ro).',
        needsSetup: true,
      },
      { status: 503 }
    );
  }

  const uidParam = new URL(req.url).searchParams.get('uid');
  try {
    if (uidParam) {
      const uid = Number(uidParam);
      if (!Number.isInteger(uid) || uid <= 0) {
        return NextResponse.json({ error: 'Mesaj invalid.' }, { status: 400 });
      }
      return NextResponse.json({ message: await readMessage(uid) });
    }
    return NextResponse.json({ messages: await listInbox() });
  } catch (err) {
    console.error('Citirea cutiei poștale a eșuat:', err);
    const msg = err instanceof Error ? err.message : 'Eroare necunoscută.';
    return NextResponse.json(
      {
        error: /auth|login|credential/i.test(msg)
          ? 'Utilizator sau parolă greșită pentru cutia poștală — verifică IMAP_USER și IMAP_PASSWORD.'
          : `Nu am putut citi cutia poștală: ${msg}`,
      },
      { status: 502 }
    );
  }
}
