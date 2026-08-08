import crypto from 'crypto';

/**
 * Utilitare pentru panoul de administrare.
 * Config (Railway → Variables sau .env local):
 *   ADMIN_PASSWORD — parola de intrare în /admin (obligatoriu)
 *   GITHUB_TOKEN   — token GitHub cu drept de scriere pe repository
 *                    (fine-grained PAT, Contents: Read & write)
 *   GITHUB_REPO    — implicit imperialmediaweb-bit/florin-sarami
 *   GITHUB_BRANCH  — implicit claude/video-editing-content-site-l42gtu
 */

const REPO = process.env.GITHUB_REPO || 'imperialmediaweb-bit/florin-sarami';
const BRANCH = process.env.GITHUB_BRANCH || 'claude/video-editing-content-site-l42gtu';

export function adminToken(): string | null {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return null;
  return crypto.createHash('sha256').update(`sarami-admin:${pass}`).digest('hex');
}

/** Verifică cookie-ul de sesiune al adminului. */
export function isAuthorized(req: Request): boolean {
  const token = adminToken();
  if (!token) return false;
  const cookies = req.headers.get('cookie') || '';
  const match = cookies.match(/(?:^|;\s*)sm_admin=([a-f0-9]+)/);
  return match?.[1] === token;
}

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'sarami-admin',
  };
}

async function getFileSha(path: string): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${encodeURIComponent(BRANCH)}`,
    { headers: ghHeaders(), cache: 'no-store' }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status} la citirea ${path}`);
  const data = await res.json();
  return data.sha || null;
}

/** Creează sau actualizează un fișier în repository (declanșează redeploy). */
export async function saveFileToGitHub(path: string, content: string, message: string) {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN nu este configurat în variabilele de mediu.');
  }
  const sha = await getFileSha(path);
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: ghHeaders(),
    body: JSON.stringify({
      message,
      branch: BRANCH,
      content: Buffer.from(content, 'utf8').toString('base64'),
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status} la salvarea ${path}: ${await res.text()}`);
}

/** Șterge un fișier din repository (declanșează redeploy). */
export async function deleteFileFromGitHub(path: string, message: string) {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN nu este configurat în variabilele de mediu.');
  }
  const sha = await getFileSha(path);
  if (!sha) throw new Error(`Fișierul ${path} nu există în repository.`);
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'DELETE',
    headers: ghHeaders(),
    body: JSON.stringify({ message, branch: BRANCH, sha }),
  });
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status} la ștergerea ${path}: ${await res.text()}`);
}
