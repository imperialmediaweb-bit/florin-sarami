#!/usr/bin/env node
/**
 * Import articole din WordPress în content/blog/ (fișiere JSON).
 *
 * Folosire (de pe calculatorul tău, cu acces la site):
 *   npm run import:wp                          → importă de pe https://sarami.ro
 *   npm run import:wp -- https://alt-site.ro   → importă de pe alt site WordPress
 *
 * Ce face:
 *   1. Citește articolele publicate prin API-ul WordPress (wp-json/wp/v2/posts).
 *   2. Descarcă imaginea reprezentativă + imaginile din articole în public/blog/.
 *   3. Salvează fiecare articol ca content/blog/<slug>.json.
 * După import: npm run build (articolele apar automat pe /blog).
 */

import fs from 'fs';
import path from 'path';

const BASE = (process.argv[2] || 'https://sarami.ro').replace(/\/+$/, '');
const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');
const IMG_DIR = path.join(process.cwd(), 'public', 'blog');

fs.mkdirSync(CONTENT_DIR, { recursive: true });
fs.mkdirSync(IMG_DIR, { recursive: true });

const stripTags = html =>
  html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

async function downloadImage(url, slugHint) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ext = (new URL(url).pathname.match(/\.(jpe?g|png|gif|webp|avif|svg)$/i) || ['.jpg'])[0];
    const name = `${slugHint}-${path.basename(new URL(url).pathname, ext).slice(0, 40)}${ext}`.toLowerCase();
    fs.writeFileSync(path.join(IMG_DIR, name), Buffer.from(await res.arrayBuffer()));
    return `/blog/${name}`;
  } catch (err) {
    console.warn(`  ⚠ nu am putut descărca ${url}: ${err.message}`);
    return null;
  }
}

async function fetchAllPosts() {
  const posts = [];
  for (let page = 1; ; page++) {
    const url = `${BASE}/wp-json/wp/v2/posts?per_page=100&page=${page}&_embed&status=publish`;
    const res = await fetch(url);
    if (res.status === 400) break; // pagină inexistentă → am terminat
    if (!res.ok) throw new Error(`Eroare API (${res.status}) la ${url}`);
    const batch = await res.json();
    posts.push(...batch);
    const totalPages = parseInt(res.headers.get('x-wp-totalpages') || '1', 10);
    if (page >= totalPages) break;
  }
  return posts;
}

console.log(`Import articole din ${BASE} ...`);
const posts = await fetchAllPosts();
console.log(`Găsite: ${posts.length} articole publicate.\n`);

for (const p of posts) {
  const slug = p.slug;
  console.log(`→ ${slug}`);

  // categoria principală
  const terms = p._embedded?.['wp:term']?.flat() || [];
  const category = terms.find(t => t.taxonomy === 'category' && t.name !== 'Uncategorized')?.name;

  // imaginea reprezentativă
  let image;
  const media = p._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  if (media) image = (await downloadImage(media, slug)) || undefined;

  // descarcă imaginile din conținut și rescrie căile
  let contentHtml = p.content?.rendered || '';
  const imgUrls = [...contentHtml.matchAll(/<img[^>]+src="([^"]+)"/g)]
    .map(m => m[1])
    .filter(u => u.startsWith(BASE) || u.includes('/wp-content/'));
  for (const u of new Set(imgUrls)) {
    const local = await downloadImage(u, slug);
    if (local) contentHtml = contentHtml.split(u).join(local);
  }

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

console.log(`\n✔ Gata! ${posts.length} articole salvate în content/blog/.`);
console.log('Rulează acum `npm run build` — articolele apar pe pagina /blog.');
