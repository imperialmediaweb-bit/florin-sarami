import fs from 'fs';
import path from 'path';
import { dataDir } from './storage';
import { cloudPut } from './cloudstore';

/**
 * Trimiterea emailurilor din panoul de admin, printr-un singur drum:
 * Resend (reputație bună la Gmail → Inbox, nu spam) + copie în „Trimise".
 */

export type SendResult = { ok: true } | { ok: false; status: number; error: string };

export async function sendViaResend(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
  /** antete de conversație (In-Reply-To / References) pentru răspunsuri */
  headers?: Record<string, string>;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return { ok: false, status: 500, error: 'RESEND_API_KEY nu este configurat — nu pot trimite emailuri.' };
  }

  let res: Response;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'Sarami Media <onboarding@resend.dev>',
        to: [opts.to],
        reply_to: process.env.CONTACT_TO || 'contact@sarami.ro',
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
        ...(opts.headers && Object.keys(opts.headers).length ? { headers: opts.headers } : {}),
      }),
    });
  } catch (err) {
    console.error('Conexiunea către Resend a eșuat:', err);
    return { ok: false, status: 502, error: 'Trimiterea a eșuat — verifică conexiunea.' };
  }

  if (!res.ok) {
    console.error('Resend a răspuns cu', res.status, await res.text());
    return { ok: false, status: 502, error: `Trimiterea a eșuat (Resend ${res.status}).` };
  }
  return { ok: true };
}

/** Copie în istoricul „Trimise" din panou (disc + seiful Cloudinary). */
export function recordSent(to: string, subject: string, text: string): void {
  try {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const json = JSON.stringify({ id, date: new Date().toISOString(), to, subject, text }, null, 2);
    fs.writeFileSync(path.join(dataDir('trimise'), `${id}.json`), json);
    void cloudPut('trimise', `${id}.json`, json);
  } catch (err) {
    console.error('Nu am putut salva copia emailului trimis:', err);
  }
}
