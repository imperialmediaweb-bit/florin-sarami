import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { dataDir } from './storage';
import { getBlogDir } from './blog';

/**
 * „Seif" de date în Cloudinary (fișiere raw JSON sub sarami-data/).
 * Orice salvare din admin sau brief primit se urcă și în Cloudinary, iar la
 * pornirea serverului totul se descarcă înapoi — datele supraviețuiesc
 * redeploy-urilor de pe Railway chiar și fără Volume montat la /data.
 * Toate operațiunile sunt fail-safe: dacă rețeaua pică, site-ul merge normal.
 */

const PREFIX = 'sarami-data/';
const SAFE = /^[a-zA-Z0-9._-]+$/;
/** limită pe fiecare cerere spre Cloudinary — o pană de rețea nu blochează site-ul */
const TIMEOUT = 10_000;

/** Credențialele Cloudinary din variabilele de mediu (null dacă lipsesc). */
export function cloudinaryConfig() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) return null;
  return { cloud, key, secret };
}
const cfg = cloudinaryConfig;

/** Semnătura cerută de Cloudinary: sha1 peste parametrii sortați alfabetic + secretul. */
export function signCloudinaryParams(params: Record<string, string | number>, secret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&');
  return crypto.createHash('sha1').update(toSign + secret).digest('hex');
}

export function cloudEnabled(): boolean {
  return cfg() !== null;
}

function basicAuth(key: string, secret: string): string {
  return 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64');
}

/** Urcă (sau suprascrie) un fișier JSON în Cloudinary. */
export async function cloudPut(sub: string, name: string, content: string): Promise<void> {
  const c = cfg();
  if (!c || !SAFE.test(sub) || !SAFE.test(name)) return;
  try {
    const publicId = `${PREFIX}${sub}/${name}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const params = { invalidate: 'true', overwrite: 'true', public_id: publicId, timestamp };
    const body = new FormData();
    body.append('file', `data:application/octet-stream;base64,${Buffer.from(content).toString('base64')}`);
    body.append('api_key', c.key);
    body.append('timestamp', String(timestamp));
    body.append('public_id', publicId);
    body.append('overwrite', 'true');
    body.append('invalidate', 'true');
    body.append('signature', signCloudinaryParams(params, c.secret));
    const res = await fetch(`https://api.cloudinary.com/v1_1/${c.cloud}/raw/upload`, {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  } catch (err) {
    console.error(`Backup Cloudinary eșuat (${sub}/${name}):`, err);
  }
}

/** Șterge un fișier din seiful Cloudinary. */
export async function cloudDelete(sub: string, name: string): Promise<void> {
  const c = cfg();
  if (!c || !SAFE.test(sub) || !SAFE.test(name)) return;
  try {
    const pid = encodeURIComponent(`${PREFIX}${sub}/${name}`);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${c.cloud}/resources/raw/upload?public_ids[]=${pid}`,
      { method: 'DELETE', headers: { Authorization: basicAuth(c.key, c.secret) }, signal: AbortSignal.timeout(TIMEOUT) }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    console.error(`Ștergere din backup Cloudinary eșuată (${sub}/${name}):`, err);
  }
}

/* ---- articole șterse: listă „pietre funerare" ca articolele din repo
        șterse din admin să nu reapară la următorul redeploy ---- */

function tombFile(): string {
  return path.join(dataDir('meta'), 'blog-sterse.json');
}

function readTombstones(): string[] {
  try {
    const t = JSON.parse(fs.readFileSync(tombFile(), 'utf8'));
    return Array.isArray(t) ? t.filter(s => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

function writeTombstones(slugs: string[]): void {
  const json = JSON.stringify(slugs, null, 2) + '\n';
  fs.writeFileSync(tombFile(), json);
  void cloudPut('meta', 'blog-sterse.json', json);
}

export function markBlogDeleted(slug: string): void {
  const t = readTombstones();
  if (!t.includes(slug)) writeTombstones([...t, slug]);
}

export function unmarkBlogDeleted(slug: string): void {
  const t = readTombstones();
  if (t.includes(slug)) writeTombstones(t.filter(s => s !== slug));
}

/* ---- hidratare la pornirea serverului ---- */

type RawResource = { public_id: string; secure_url: string };

async function listAll(c: { cloud: string; key: string; secret: string }): Promise<RawResource[]> {
  const out: RawResource[] = [];
  let cursor = '';
  do {
    const url =
      `https://api.cloudinary.com/v1_1/${c.cloud}/resources/raw/upload` +
      `?prefix=${encodeURIComponent(PREFIX)}&max_results=500` +
      (cursor ? `&next_cursor=${cursor}` : '');
    const res = await fetch(url, {
      headers: { Authorization: basicAuth(c.key, c.secret) },
      signal: AbortSignal.timeout(TIMEOUT),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const data = await res.json();
    out.push(...(data.resources || []));
    cursor = data.next_cursor || '';
  } while (cursor);
  return out;
}

/**
 * Descarcă tot seiful în folderul de date local. Rulează o dată, la boot.
 *  - fără Volume (disc efemer): versiunea din Cloudinary e adevărul → suprascrie
 *  - cu Volume la /data: discul e persistent și poate fi mai nou → doar completează
 */
export async function cloudHydrate(): Promise<void> {
  const c = cfg();
  if (!c) return;
  try {
    // întâi articolele din repo (seed), ca hidratarea să nu blocheze copierea lor
    const blogDir = getBlogDir();
    const persistent = Boolean(process.env.DATA_DIR) || fs.existsSync('/data');
    const resources = await listAll(c);
    let restored = 0;
    // descărcăm în loturi de 10 în paralel — pornirea rămâne rapidă
    // chiar și cu sute de briefuri/articole în seif
    for (let i = 0; i < resources.length; i += 10) {
      await Promise.all(
        resources.slice(i, i + 10).map(async r => {
          const rel = r.public_id.slice(PREFIX.length);
          const parts = rel.split('/');
          if (parts.length !== 2) return;
          const [sub, name] = parts;
          if (!SAFE.test(sub) || !SAFE.test(name)) return;
          const target = sub === 'blog' ? path.join(blogDir, name) : path.join(dataDir(sub), name);
          if (persistent && fs.existsSync(target)) return;
          try {
            const res = await fetch(r.secure_url, { signal: AbortSignal.timeout(TIMEOUT) });
            if (!res.ok) return;
            fs.writeFileSync(target, Buffer.from(await res.arrayBuffer()));
            restored++;
          } catch { /* fișier sărit — rămâne varianta locală */ }
        })
      );
    }
    // aplică ștergerile de articole făcute din admin
    for (const slug of readTombstones()) {
      if (!SAFE.test(slug)) continue;
      const f = path.join(blogDir, `${slug}.json`);
      if (fs.existsSync(f)) fs.unlinkSync(f);
    }
    if (restored) console.log(`Seif Cloudinary: ${restored} fișiere restaurate.`);
  } catch (err) {
    console.error('Hidratarea din seiful Cloudinary a eșuat:', err);
  }
}
