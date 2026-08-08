#!/usr/bin/env node
/**
 * Import articole din WordPress în content/blog/ (fișiere JSON).
 *
 * Două moduri de folosire:
 *
 *  A) Prin API-ul WordPress (site-ul trebuie să fie funcțional):
 *       npm run import:wp                          → importă de pe https://sarami.ro
 *       npm run import:wp -- https://alt-site.ro   → alt site WordPress
 *
 *  B) Din fișierul XML de export WordPress (merge chiar dacă API-ul e stricat):
 *       1. Intră în wp-admin → Instrumente (Tools) → Export → „Tot conținutul"
 *          → Descarcă fișierul de export (un .xml).
 *       2. Copiază fișierul în folderul proiectului (poți să-l redenumești export.xml).
 *       3. Rulează:  npm run import:wp -- export.xml
 *
 * Imagini pe Cloudinary (opțional, recomandat):
 *   Creează fișierul .env (vezi .env.example) cu cheile din Cloudinary → Dashboard.
 *   Cu .env completat, imaginile sunt urcate în Cloudinary (folderul sarami-blog/);
 *   fără el, se descarcă local în public/blog/.
 *
 * Protecție SEO (automat):
 *   Scriptul reține URL-ul vechi al fiecărui articol și scrie redirect-uri 301
 *   în public/.htaccess către noile adrese (/blog/slug/), ca Google să nu
 *   găsească pagini lipsă (404) după mutare.
 *
 * După import: npm run build (articolele apar automat pe /blog).
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const ARG = process.argv[2] || 'https://sarami.ro';
const IS_XML = ARG.toLowerCase().endsWith('.xml');
const BASE = IS_XML ? 'https://sarami.ro' : ARG.replace(/\/+$/, '');
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
  return (await res.json()).secure_url;
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

const stripTags = html =>
  html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

/* ============================================================
   MOD A — import prin API-ul WordPress
   ============================================================ */

async function fetchAllPostsFromApi() {
  // Unele instalări dau 500 la _embed, la pagini mari sau chiar pe /wp-json.
  // Încercăm variante tot mai conservatoare, inclusiv ruta ?rest_route=.
  const roots = [
    q => `${BASE}/wp-json/wp/v2/${q.endpoint}?${q.params}`,
    q => `${BASE}/?rest_route=/wp/v2/${q.endpoint}&${q.params}`,
  ];
  const variants = [
    { perPage: 100, embed: true },
    { perPage: 20, embed: true },
    { perPage: 20, embed: false },
    { perPage: 5, embed: false },
  ];
  let lastError = null;
  for (const root of roots) {
    for (const v of variants) {
      try {
        const posts = [];
        for (let page = 1; ; page++) {
          const url = root({
            endpoint: 'posts',
            params: `per_page=${v.perPage}&page=${page}${v.embed ? '&_embed' : ''}`,
          });
          const res = await fetch(url);
          if (res.status === 400) break; // pagină inexistentă → am terminat
          if (!res.ok) throw new Error(`HTTP ${res.status} la ${url}`);
          const batch = await res.json();
          posts.push(...batch);
          const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10);
          if (page >= totalPages) break;
        }
        return { posts, embedded: v.embed, root };
      } catch (err) {
        lastError = err;
        console.warn(`  ⚠ variantă eșuată (${err.message}) — încerc altfel...`);
      }
    }
  }
  throw new Error(
    `Nu am putut citi articolele din ${BASE} prin API.\n` +
    `Ultima eroare: ${lastError?.message}\n\n` +
    `SOLUȚIE SIGURĂ — importă din fișierul de export WordPress:\n` +
    `  1. Intră pe ${BASE}/wp-admin → Instrumente (Tools) → Export → „Tot conținutul" → Descarcă.\n` +
    `  2. Copiază fișierul .xml descărcat în folderul proiectului (redenumește-l export.xml).\n` +
    `  3. Rulează:  npm run import:wp -- export.xml`
  );
}

async function fetchCategoryMap(root) {
  const map = new Map();
  try {
    for (let page = 1; ; page++) {
      const res = await fetch(root({ endpoint: 'categories', params: `per_page=100&page=${page}` }));
      if (!res.ok) break;
      const batch = await res.json();
      batch.forEach(c => map.set(c.id, c.name));
      const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10);
      if (page >= totalPages) break;
    }
  } catch { /* fără categorii — nu blocăm importul */ }
  return map;
}

async function fetchFeaturedMediaUrl(root, mediaId) {
  try {
    const res = await fetch(root({ endpoint: `media/${mediaId}`, params: '' }));
    if (!res.ok) return null;
    return (await res.json()).source_url || null;
  } catch {
    return null;
  }
}

async function importFromApi() {
  console.log(`\nImport articole din ${BASE} (prin API) ...`);
  const { posts, embedded, root } = await fetchAllPostsFromApi();
  console.log(`Găsite: ${posts.length} articole publicate.\n`);
  const categoryMap = embedded ? null : await fetchCategoryMap(root);

  const normalized = [];
  for (const p of posts) {
    let category;
    if (embedded) {
      const terms = p._embedded?.['wp:term']?.flat() || [];
      category = terms.find(t => t.taxonomy === 'category' && t.name !== 'Uncategorized')?.name;
    } else {
      category = (p.categories || []).map(id => categoryMap.get(id)).find(n => n && n !== 'Uncategorized');
    }
    const featuredUrl = embedded
      ? p._embedded?.['wp:featuredmedia']?.[0]?.source_url
      : p.featured_media ? await fetchFeaturedMediaUrl(root, p.featured_media) : null;

    normalized.push({
      slug: p.slug,
      title: stripTags(p.title?.rendered || p.slug),
      date: p.date,
      category,
      excerpt: stripTags(p.excerpt?.rendered || '').slice(0, 220),
      contentHtml: p.content?.rendered || '',
      featuredUrl: featuredUrl || null,
      oldLink: p.link || null,
    });
  }
  return normalized;
}

/* ============================================================
   MOD B — import din fișierul XML de export WordPress (WXR)
   ============================================================ */

const unCdata = v => {
  const m = v.match(/^\s*<!\[CDATA\[([\s\S]*)\]\]>\s*$/);
  return m ? m[1] : v;
};
const decodeEntities = s =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
   .replace(/&#0?39;/g, "'").replace(/&#8217;/g, '’').replace(/&amp;/g, '&');
const xmlTag = (tag, xml) => {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? unCdata(m[1]).trim() : '';
};

function importFromXml(file) {
  console.log(`\nImport articole din fișierul ${file} ...`);
  if (!fs.existsSync(file)) {
    throw new Error(`Nu găsesc fișierul ${file}. Pune-l în folderul proiectului și rulează din nou.`);
  }
  const xml = fs.readFileSync(file, 'utf8');
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);

  // atașamentele (imaginile) din export: id → URL
  const attachments = new Map();
  for (const item of items) {
    if (xmlTag('wp:post_type', item) === 'attachment') {
      const id = xmlTag('wp:post_id', item);
      const url = xmlTag('wp:attachment_url', item);
      if (id && url) attachments.set(id, url);
    }
  }

  const normalized = [];
  for (const item of items) {
    if (xmlTag('wp:post_type', item) !== 'post') continue;
    if (xmlTag('wp:status', item) !== 'publish') continue;

    const slug = xmlTag('wp:post_name', item) || xmlTag('title', item).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const catMatch = [...item.matchAll(/<category domain="category"[^>]*>([\s\S]*?)<\/category>/g)]
      .map(m => unCdata(m[1]).trim())
      .find(n => n && n !== 'Uncategorized');

    // imaginea reprezentativă: postmeta _thumbnail_id → attachment URL
    let featuredUrl = null;
    const thumbMeta = item.match(/<wp:meta_key>(?:<!\[CDATA\[)?_thumbnail_id(?:\]\]>)?<\/wp:meta_key>\s*<wp:meta_value>(?:<!\[CDATA\[)?(\d+)(?:\]\]>)?<\/wp:meta_value>/);
    if (thumbMeta) featuredUrl = attachments.get(thumbMeta[1]) || null;

    const rawDate = xmlTag('wp:post_date', item); // "2023-05-10 09:00:00"
    normalized.push({
      slug,
      title: decodeEntities(xmlTag('title', item)) || slug,
      date: rawDate ? rawDate.replace(' ', 'T') : new Date().toISOString(),
      category: catMatch,
      excerpt: stripTags(decodeEntities(xmlTag('excerpt:encoded', item) || xmlTag('content:encoded', item))).slice(0, 220),
      contentHtml: xmlTag('content:encoded', item),
      featuredUrl,
      oldLink: xmlTag('link', item) || null,
    });
  }
  console.log(`Găsite: ${normalized.length} articole publicate în export.\n`);
  return normalized;
}

/* ============================================================
   Procesare comună: imagini, salvare JSON, redirecturi 301
   ============================================================ */

const rawPosts = IS_XML ? importFromXml(ARG) : await importFromApi();
const redirects = [];

for (const p of rawPosts) {
  console.log(`→ ${p.slug}`);

  let image;
  if (p.featuredUrl) image = (await processImage(p.featuredUrl, p.slug)) || undefined;

  // imaginile din conținut
  let contentHtml = p.contentHtml;
  const imgUrls = [...contentHtml.matchAll(/<img[^>]+src="([^"]+)"/g)]
    .map(m => m[1])
    .filter(u => u.startsWith(BASE) || u.includes('/wp-content/'));
  for (const u of new Set(imgUrls)) {
    const newUrl = await processImage(u, p.slug);
    if (newUrl) contentHtml = contentHtml.split(u).join(newUrl);
  }

  // redirect 301: vechiul URL WordPress → noul URL /blog/slug/
  if (p.oldLink) {
    try {
      const oldPath = new URL(p.oldLink).pathname;
      const newPath = `/blog/${p.slug}/`;
      if (oldPath !== newPath && oldPath !== '/') redirects.push({ from: oldPath, to: newPath });
    } catch { /* link invalid — sărim */ }
  }

  fs.writeFileSync(
    path.join(CONTENT_DIR, `${p.slug}.json`),
    JSON.stringify(
      {
        slug: p.slug,
        title: p.title,
        date: p.date,
        category: p.category,
        excerpt: p.excerpt,
        contentHtml,
        image,
      },
      null,
      2
    )
  );
}

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

console.log(`\n✔ Gata! ${rawPosts.length} articole salvate în content/blog/.`);
console.log('Rulează acum `npm run build` — articolele apar pe pagina /blog.');
