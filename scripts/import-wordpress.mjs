#!/usr/bin/env node
/**
 * Import articole din WordPress în content/blog/ (fișiere JSON).
 *
 * Folosire (de pe calculatorul tău, cu acces la site):
 *   npm run import:wp                          → importă de pe https://sarami.ro
 *   npm run import:wp -- https://alt-site.ro   → importă de pe alt site WordPress
 *
 * Imagini pe Cloudinary (opțional, recomandat):
 *   Setează variabila de mediu CLOUDINARY_URL înainte de rulare — o găsești în
 *   Cloudinary → Dashboard → "API environment variable", are forma:
 *     cloudinary://API_KEY:API_SECRET@NUME_CLOUD
 *   Exemplu:
 *     CLOUDINARY_URL="cloudinary://123:abc@sarami" npm run import:wp
 *   Cu variabila setată, imaginile sunt urcate în Cloudinary (folderul
 *   sarami-blog/) și articolele folosesc link-urile de acolo. Fără ea,
 *   imaginile se descarcă local în public/blog/.
 *
 * Protecție SEO (automat):
 *   Scriptul reține URL-ul vechi al fiecărui articol (ex: sarami.ro/titlu-articol/)
 *   și scrie redirect-uri 301 în public/.htaccess către noile adrese
 *   (sarami.ro/blog/titlu-articol/). Astfel Google nu găsește pagini lipsă (404),
 *   ci urmează redirectul și transferă autoritatea vechilor pagini către cele noi.
 *
 * După import: npm run build (articolele apar automat pe /blog).
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const BASE = (process.argv[2] || 'https://sarami.ro').replace(/\/+$/, '');
const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');
const IMG_DIR = path.join(process.cwd(), 'public', 'blog');
const HTACCESS = path.join(process.cwd(), 'public', '.htaccess');

fs.mkdirSync(CONTENT_DIR, { recursive: true });
fs.mkdirSync(IMG_DIR, { recursive: true });

/* ---------- Încarcă .env din rădăcina proiectului (fără dependențe) ---------- */
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

/* ---------- Cloudinary (opțional) ---------- */
let cloudinary = null;
{
  // acceptă fie CLOUDINARY_URL, fie cele 3 variabile separate din dashboard
  const cldMatch = (process.env.CLOUDINARY_URL || '').match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (cldMatch) {
    cloudinary = { key: cldMatch[1], secret: cldMatch[2], cloud: cldMatch[3] };
  } else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary = {
      key: process.env.CLOUDINARY_API_KEY,
      secret: process.env.CLOUDINARY_API_SECRET,
      cloud: process.env.CLOUDINARY_CLOUD_NAME,
    };
  }
}
if (cloudinary) {
  console.log(`Cloudinary activ (cloud: ${cloudinary.cloud}) — imaginile se urcă acolo.`);
} else {
  console.log('Cloudinary neconfigurat — imaginile se descarcă local în public/blog/.');
}

async function uploadToCloudinary(url, slugHint) {
  const timestamp = Math.floor(Date.now() / 1000);
  const baseName = path.basename(new URL(url).pathname).replace(/\.[^.]+$/, '').slice(0, 60);
  const publicId = `sarami-blog/${slugHint}-${baseName}`.toLowerCase();
  const signature = crypto
    .createHash('sha1')
    .update(`public_id=${publicId}&timestamp=${timestamp}${cloudinary.secret}`)
    .digest('hex');
  const body = new FormData();
  body.append('file', url); // Cloudinary descarcă singur URL-ul remote
  body.append('api_key', cloudinary.key);
  body.append('timestamp', String(timestamp));
  body.append('public_id', publicId);
  body.append('signature', signature);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.cloud}/image/upload`, {
    method: 'POST',
    body,
  });
  if (!res.ok) throw new Error(`Cloudinary HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.secure_url;
}

async function downloadLocally(url, slugHint) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ext = (new URL(url).pathname.match(/\.(jpe?g|png|gif|webp|avif|svg)$/i) || ['.jpg'])[0];
  const name = `${slugHint}-${path.basename(new URL(url).pathname, ext).slice(0, 40)}${ext}`.toLowerCase();
  fs.writeFileSync(path.join(IMG_DIR, name), Buffer.from(await res.arrayBuffer()));
  return `/blog/${name}`;
}

async function processImage(url, slugHint) {
  try {
    return cloudinary ? await uploadToCloudinary(url, slugHint) : await downloadLocally(url, slugHint);
  } catch (err) {
    console.warn(`  ⚠ imagine eșuată (${url}): ${err.message}`);
    return null;
  }
}

/* ---------- Import articole ---------- */
const stripTags = html =>
  html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Unele instalări WordPress (mai vechi sau cu pluginuri stricate) dau eroare 500
 * la parametrul _embed sau la pagini mari. Încercăm pe rând variante tot mai
 * conservatoare până când una funcționează.
 */
async function fetchAllPosts() {
  const variants = [
    { perPage: 100, embed: true },
    { perPage: 20, embed: true },
    { perPage: 20, embed: false },
    { perPage: 5, embed: false },
  ];
  let lastError = null;
  for (const v of variants) {
    try {
      const posts = [];
      for (let page = 1; ; page++) {
        const url = `${BASE}/wp-json/wp/v2/posts?per_page=${v.perPage}&page=${page}${v.embed ? '&_embed' : ''}`;
        const res = await fetch(url);
        if (res.status === 400) break; // pagină inexistentă → am terminat
        if (!res.ok) throw new Error(`HTTP ${res.status} la ${url}`);
        const batch = await res.json();
        posts.push(...batch);
        const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10);
        if (page >= totalPages) break;
      }
      return { posts, embedded: v.embed };
    } catch (err) {
      lastError = err;
      console.warn(`  ⚠ varianta per_page=${v.perPage}${v.embed ? ' + _embed' : ''} a eșuat (${err.message}) — încerc altfel...`);
    }
  }
  throw new Error(
    `Nu am putut citi articolele din ${BASE}.\n` +
    `Ultima eroare: ${lastError?.message}\n` +
    `Verifică în browser dacă ${BASE}/wp-json/wp/v2/posts se deschide și afișează date JSON.\n` +
    `Dacă dă eroare, API-ul REST al WordPress-ului e stricat sau blocat de un plugin de securitate.`
  );
}

/** Categoriile, luate separat când _embed nu funcționează. */
async function fetchCategoryMap() {
  const map = new Map();
  try {
    for (let page = 1; ; page++) {
      const res = await fetch(`${BASE}/wp-json/wp/v2/categories?per_page=100&page=${page}`);
      if (!res.ok) break;
      const batch = await res.json();
      batch.forEach(c => map.set(c.id, c.name));
      const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10);
      if (page >= totalPages) break;
    }
  } catch { /* fără categorii — nu blocăm importul */ }
  return map;
}

/** Imaginea reprezentativă, luată separat când _embed nu funcționează. */
async function fetchFeaturedMediaUrl(mediaId) {
  try {
    const res = await fetch(`${BASE}/wp-json/wp/v2/media/${mediaId}`);
    if (!res.ok) return null;
    return (await res.json()).source_url || null;
  } catch {
    return null;
  }
}

console.log(`\nImport articole din ${BASE} ...`);
const { posts, embedded } = await fetchAllPosts();
console.log(`Găsite: ${posts.length} articole publicate.\n`);
const categoryMap = embedded ? null : await fetchCategoryMap();

const redirects = [];

for (const p of posts) {
  const slug = p.slug;
  console.log(`→ ${slug}`);

  // categoria principală
  let category;
  if (embedded) {
    const terms = p._embedded?.['wp:term']?.flat() || [];
    category = terms.find(t => t.taxonomy === 'category' && t.name !== 'Uncategorized')?.name;
  } else {
    category = (p.categories || []).map(id => categoryMap.get(id)).find(n => n && n !== 'Uncategorized');
  }

  // imaginea reprezentativă
  let image;
  const media = embedded
    ? p._embedded?.['wp:featuredmedia']?.[0]?.source_url
    : p.featured_media ? await fetchFeaturedMediaUrl(p.featured_media) : null;
  if (media) image = (await processImage(media, slug)) || undefined;

  // imaginile din conținut
  let contentHtml = p.content?.rendered || '';
  const imgUrls = [...contentHtml.matchAll(/<img[^>]+src="([^"]+)"/g)]
    .map(m => m[1])
    .filter(u => u.startsWith(BASE) || u.includes('/wp-content/'));
  for (const u of new Set(imgUrls)) {
    const newUrl = await processImage(u, slug);
    if (newUrl) contentHtml = contentHtml.split(u).join(newUrl);
  }

  // redirect 301: vechiul URL WordPress → noul URL /blog/slug/
  try {
    const oldPath = new URL(p.link).pathname;
    const newPath = `/blog/${slug}/`;
    if (oldPath !== newPath && oldPath !== '/') redirects.push({ from: oldPath, to: newPath });
  } catch { /* link invalid — sărim */ }

  const post = {
    slug,
    title: stripTags(p.title?.rendered || slug),
    date: p.date,
    category,
    excerpt: stripTags(p.excerpt?.rendered || '').slice(0, 220),
    contentHtml,
    image,
  };
  fs.writeFileSync(path.join(CONTENT_DIR, `${slug}.json`), JSON.stringify(post, null, 2));
}

/* ---------- Scrie redirecturile 301 (.htaccess) ---------- */
if (redirects.length) {
  const lines = [
    '# ============================================================',
    '# Redirecturi 301: vechile URL-uri WordPress → noile pagini /blog/',
    '# Generat de scripts/import-wordpress.mjs — NU șterge (protejează SEO).',
    '# Google urmează redirectul și transferă autoritatea paginilor vechi.',
    '# ============================================================',
    ...redirects.map(r => `Redirect 301 ${r.from} https://sarami.ro${r.to}`),
    '',
  ];
  fs.writeFileSync(HTACCESS, lines.join('\n'));
  console.log(`\n✔ ${redirects.length} redirecturi 301 scrise în public/.htaccess`);
  console.log('  (fișierul ajunge automat în out/ la build și e citit de serverul Apache/cPanel)');
}

console.log(`\n✔ Gata! ${posts.length} articole salvate în content/blog/.`);
console.log('Rulează acum `npm run build` — articolele apar pe pagina /blog.');
