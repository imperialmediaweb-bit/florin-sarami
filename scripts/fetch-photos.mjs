#!/usr/bin/env node
/**
 * Descarcă poze și clipuri tematice de pe Pexels și/sau Pixabay
 * în public/photos/ și public/videos/.
 *
 * Folosire:
 *   1. Ia o cheie API gratuită de la https://www.pexels.com/api/
 *      și/sau de la https://pixabay.com/api/docs/
 *   2. Pune-le în .env (sau în variabilele de mediu de pe Railway):
 *        PEXELS_API_KEY="cheia-pexels"
 *        PIXABAY_API_KEY="cheia-pixabay"
 *   3. Rulează:  npm run fetch:photos
 *      (sau `npm run fetch:photos -- --force` ca să înlocuiești pozele existente)
 *
 * Se încearcă întâi Pexels; dacă nu găsește (sau nu are cheie), se încearcă
 * Pixabay. Rulează automat și la `npm run build` (deci și la deploy pe Railway).
 * Ambele surse sunt gratuite pentru uz comercial, fără atribuire obligatorie.
 */

import fs from 'fs';
import path from 'path';

const OUT = path.join(process.cwd(), 'public', 'photos');
const VID_OUT = path.join(process.cwd(), 'public', 'videos');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VID_OUT, { recursive: true });

// încarcă .env (fără dependențe)
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const PEXELS = process.env.PEXELS_API_KEY;
const PIXABAY = process.env.PIXABAY_API_KEY;

/* ---------- logo: descărcat la build din Cloudinary (nu cere cheie API) ----------
   Întâi varianta cu fundal transparent + margini tăiate; dacă transformarea nu
   e disponibilă, cade pe imaginea originală (multiply în CSS ascunde fundalul alb).
   Dacă pui manual public/assets/logo.png, fișierul tău are prioritate și nu e atins. */
/* Pasărea din logo: site-ul folosește pasărea vectorială (SVG) din
   public/assets/favicon.svg — mereu curată și clară. Dacă vrei pasărea
   EXACTĂ din logo-ul original, decupează-o manual (doar pasărea, fără text,
   fundal transparent) și urc-o în repository ca public/assets/logo-bird.png —
   componenta Logo o preia automat, cu prioritate. */

if (!PEXELS && !PIXABAY) {
  // fără chei nu oprim build-ul — site-ul funcționează și fără poze (are fallback-uri)
  console.warn('Nicio cheie API setată (PEXELS_API_KEY / PIXABAY_API_KEY) — sar peste descărcarea pozelor.');
  process.exit(0);
}

/* nu re-descărcăm dacă pozele există deja (build-uri repetate rapide);
   `npm run fetch:photos -- --force` forțează descărcarea din nou */
const FORCE = process.argv.includes('--force');
if (!FORCE && fs.existsSync(path.join(OUT, 'video-editing.jpg')) && fs.existsSync(path.join(VID_OUT, 'editare.mp4'))) {
  console.log('Pozele și clipurile există deja — sar peste descărcare.');
  console.log('(rulează `npm run fetch:photos -- --force` dacă vrei variante noi)');
  process.exit(0);
}

/* ---------- surse: poze ---------- */

async function pexelsPhoto(query) {
  if (!PEXELS) return null;
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
    { headers: { Authorization: PEXELS } }
  );
  if (!res.ok) throw new Error(`Pexels HTTP ${res.status}`);
  const data = await res.json();
  const photo = (data.photos || []).sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
  return photo ? { url: photo.src.large2x || photo.src.large, credit: `${photo.photographer} / Pexels` } : null;
}

async function pixabayPhoto(query) {
  if (!PIXABAY) return null;
  const res = await fetch(
    `https://pixabay.com/api/?key=${PIXABAY}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=5&safesearch=true`
  );
  if (!res.ok) throw new Error(`Pixabay HTTP ${res.status}`);
  const data = await res.json();
  const hit = (data.hits || []).sort((a, b) => (b.imageWidth * b.imageHeight) - (a.imageWidth * a.imageHeight))[0];
  return hit ? { url: hit.largeImageURL, credit: `${hit.user} / Pixabay` } : null;
}

/* ---------- surse: video ---------- */

async function pexelsVideo(query) {
  if (!PEXELS) return null;
  const res = await fetch(
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    { headers: { Authorization: PEXELS } }
  );
  if (!res.ok) throw new Error(`Pexels HTTP ${res.status}`);
  const data = await res.json();
  const video = data.videos?.[0];
  if (!video) return null;
  const files = (video.video_files || [])
    .filter(f => f.file_type === 'video/mp4' && f.width)
    .sort((a, b) => a.width - b.width);
  const file = files.find(f => f.width >= 960 && f.width <= 1400) || files[files.length - 1];
  return file ? { url: file.link, credit: `${video.user?.name} / Pexels` } : null;
}

async function pixabayVideo(query) {
  if (!PIXABAY) return null;
  const res = await fetch(
    `https://pixabay.com/api/videos/?key=${PIXABAY}&q=${encodeURIComponent(query)}&per_page=3&safesearch=true`
  );
  if (!res.ok) throw new Error(`Pixabay HTTP ${res.status}`);
  const data = await res.json();
  const hit = data.hits?.[0];
  const file = hit?.videos?.medium || hit?.videos?.large || hit?.videos?.small;
  return file?.url ? { url: file.url, credit: `${hit.user} / Pixabay` } : null;
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`descărcare HTTP ${res.status}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

async function firstOf(query, sources) {
  let lastErr = null;
  for (const source of sources) {
    try {
      const found = await source(query);
      if (found) return found;
    } catch (err) { lastErr = err; }
  }
  if (lastErr) throw lastErr;
  return null;
}

/* ---------- ce descărcăm ---------- */

const PHOTOS = [
  { name: 'video-editing', query: 'video editor working editing software monitor timeline' },
  { name: 'studio-camera', query: 'cinema camera film set videographer' },
  { name: 'podcast', query: 'podcast host speaking microphone headphones studio' },
  { name: 'social-media', query: 'content creator filming video ring light phone' },
  { name: 'writing', query: 'copywriter typing laptop notebook workspace' },
  { name: 'team', query: 'creative agency team meeting brainstorming office' },
];

const VIDEOS = [
  { name: 'editare', query: 'video editing timeline computer' },
  { name: 'filmare', query: 'camera filming behind the scenes' },
];

for (const p of PHOTOS) {
  try {
    const found = await firstOf(p.query, [pexelsPhoto, pixabayPhoto]);
    if (!found) throw new Error('niciun rezultat pe Pexels/Pixabay');
    await download(found.url, path.join(OUT, `${p.name}.jpg`));
    console.log(`✔ ${p.name}.jpg  (foto: ${found.credit})`);
  } catch (err) {
    console.warn(`⚠ ${p.name}: ${err.message}`);
  }
}

for (const v of VIDEOS) {
  try {
    const found = await firstOf(v.query, [pexelsVideo, pixabayVideo]);
    if (!found) throw new Error('niciun rezultat pe Pexels/Pixabay');
    await download(found.url, path.join(VID_OUT, `${v.name}.mp4`));
    console.log(`✔ videos/${v.name}.mp4  (de: ${found.credit})`);
  } catch (err) {
    console.warn(`⚠ video ${v.name}: ${err.message}`);
  }
}

console.log('\nGata! Rulează `npm run build` ca pozele și clipurile să intre în site.');
