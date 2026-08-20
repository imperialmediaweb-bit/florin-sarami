import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

/**
 * Cutia poștală contact@sarami.ro citită prin IMAP, ca să apară direct
 * în panoul de admin. Configurare (Railway → Variables):
 *   IMAP_HOST      — implicit cloud330.mxserver.ro
 *   IMAP_PORT      — implicit 993 (SSL)
 *   IMAP_USER      — implicit CONTACT_TO (contact@sarami.ro)
 *   IMAP_PASSWORD  — parola căsuței (obligatoriu; doar pe server, niciodată în cod)
 */

export type InboxMessage = {
  uid: number;
  from: string;
  fromEmail: string;
  subject: string;
  date: string;
  seen: boolean;
  messageId?: string;
};

export type InboxBody = {
  uid: number;
  from: string;
  fromEmail: string;
  to: string;
  subject: string;
  date: string;
  html?: string;
  text?: string;
  messageId?: string;
  references?: string;
  attachments: { filename: string; size: number }[];
};

function config() {
  const pass = process.env.IMAP_PASSWORD;
  if (!pass) return null;
  return {
    host: process.env.IMAP_HOST || 'cloud330.mxserver.ro',
    port: Number(process.env.IMAP_PORT || 993),
    user: process.env.IMAP_USER || process.env.CONTACT_TO || 'contact@sarami.ro',
    pass,
  };
}

export function mailboxConfigured(): boolean {
  return config() !== null;
}

async function withClient<T>(fn: (client: ImapFlow) => Promise<T>): Promise<T> {
  const c = config();
  if (!c) throw new Error('IMAP_PASSWORD nu e setat — adaugă-l în Railway → Variables.');
  const client = new ImapFlow({
    host: c.host,
    port: c.port,
    secure: c.port === 993,
    auth: { user: c.user, pass: c.pass },
    logger: false,
    // dacă serverul nu răspunde, nu ținem panoul blocat
    socketTimeout: 20_000,
    greetingTimeout: 10_000,
    connectionTimeout: 10_000,
  });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    try { await client.logout(); } catch { /* conexiunea se închide oricum */ }
  }
}

const addrText = (a: unknown): { name: string; email: string } => {
  const first = (a as { name?: string; address?: string }[] | undefined)?.[0];
  const email = first?.address || '';
  return { name: first?.name?.trim() || email, email };
};

/** Ultimele mesaje din Inbox, cele mai noi primele. */
export async function listInbox(limit = 40): Promise<InboxMessage[]> {
  return withClient(async client => {
    const lock = await client.getMailboxLock('INBOX');
    try {
      const box = client.mailbox;
      const total = typeof box === 'object' && box ? box.exists : 0;
      if (!total) return [];
      const from = Math.max(1, total - limit + 1);
      const out: InboxMessage[] = [];
      for await (const msg of client.fetch(`${from}:*`, { envelope: true, flags: true, uid: true })) {
        const f = addrText(msg.envelope?.from);
        out.push({
          uid: msg.uid,
          from: f.name,
          fromEmail: f.email,
          subject: msg.envelope?.subject || '(fără subiect)',
          date: (msg.envelope?.date || new Date()).toISOString(),
          seen: msg.flags?.has('\\Seen') ?? false,
          messageId: msg.envelope?.messageId,
        });
      }
      return out.sort((a, b) => (a.date < b.date ? 1 : -1));
    } finally {
      lock.release();
    }
  });
}

/** Conținutul complet al unui mesaj (îl marchează și ca citit). */
export async function readMessage(uid: number): Promise<InboxBody> {
  return withClient(async client => {
    const lock = await client.getMailboxLock('INBOX');
    try {
      const dl = await client.download(String(uid), undefined, { uid: true });
      if (!dl?.content) throw new Error('Mesajul nu a fost găsit.');
      const parsed = await simpleParser(dl.content);
      await client.messageFlagsAdd(String(uid), ['\\Seen'], { uid: true }).catch(() => {});
      const f = addrText(parsed.from?.value);
      return {
        uid,
        from: f.name,
        fromEmail: f.email,
        to: parsed.to && 'text' in parsed.to ? parsed.to.text : '',
        subject: parsed.subject || '(fără subiect)',
        date: (parsed.date || new Date()).toISOString(),
        html: typeof parsed.html === 'string' ? parsed.html : undefined,
        text: parsed.text || undefined,
        messageId: parsed.messageId,
        references: Array.isArray(parsed.references) ? parsed.references.join(' ') : parsed.references,
        attachments: (parsed.attachments || []).map(a => ({
          filename: a.filename || 'atașament',
          size: a.size || 0,
        })),
      };
    } finally {
      lock.release();
    }
  });
}
