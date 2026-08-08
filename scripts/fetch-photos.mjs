#!/usr/bin/env node
/**
 * Descarcă poze tematice de pe Pexels în public/photos/.
 *
 * Folosire:
 *   1. Ia o cheie API gratuită de la https://www.pexels.com/api/
 *   2. Adaug-o în fișierul .env din proiect, pe un rând nou:
 *        PEXELS_API_KEY="cheia-ta"
 *   3. Rulează:  npm run fetch:photos
 *
 * Site-ul folosește pozele automat dacă există (componenta Photo);
 * fără ele, secțiunile arată în continuare bine (gradiente/mockup-uri).
 * Pozele Pexels sunt gratuite pentru uz comercial, fără atribuire obligatorie.
 */

import fs from 'fs';
import path from 'path';

const OUT = path.join(process.cwd(), 'public', 'photos');
fs.mkdirSync(OUT, { recursive: true });

// încarcă .env (fără dependențe)
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*"?([^"\r\n]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const KEY = process.env.PEXELS_API_KEY;
if (!KEY) {
  // fără cheie nu oprim build-ul — site-ul funcționează și fără poze (are fallback-uri)
  console.warn('PEXELS_API_KEY nu este setat — sar peste descărcarea pozelor.');
  console.warn('Cheia se obține gratuit de la https://www.pexels.com/api/ și se pune în .env sau în variabilele de mediu (Railway).');
  process.exit(0);
}

/* nu re-descărcăm dacă pozele există deja (build-uri repetate rapide) */
if (fs.existsSync(path.join(OUT, 'video-editing.jpg')) && fs.existsSync(path.join(process.cwd(), 'public', 'videos', 'editare.mp4'))) {
  console.log('Pozele și clipurile există deja în public/photos și public/videos — sar peste descărcare.');
  console.log('(șterge folderele dacă vrei poze noi și rulează din nou)');
  process.exit(0);
}

/* Pozele căutate — nume fix (folosit de site) + căutare Pexels */
const PHOTOS = [
  { name: 'video-editing', query: 'video editing timeline computer screen' },
  { name: 'studio-camera', query: 'professional video camera studio' },
  { name: 'podcast', query: 'podcast microphone studio' },
  { name: 'social-media', query: 'filming smartphone video vertical' },
  { name: 'writing', query: 'writing laptop desk coffee' },
  { name: 'team', query: 'creative team office collaboration' },
];

for (const p of PHOTOS) {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(p.query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: KEY } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const photo = data.photos?.[0];
    if (!photo) throw new Error('niciun rezultat');
    const imgRes = await fetch(photo.src.large2x || photo.src.large);
    if (!imgRes.ok) throw new Error(`descărcare HTTP ${imgRes.status}`);
    fs.writeFileSync(path.join(OUT, `${p.name}.jpg`), Buffer.from(await imgRes.arrayBuffer()));
    console.log(`✔ ${p.name}.jpg  (foto: ${photo.photographer} / Pexels)`);
  } catch (err) {
    console.warn(`⚠ ${p.name}: ${err.message}`);
  }
}

/* Clipuri video de fundal (rulează pe mut, în buclă, în secțiunile-cheie) */
const VID_OUT = path.join(process.cwd(), 'public', 'videos');
fs.mkdirSync(VID_OUT, { recursive: true });

const VIDEOS = [
  { name: 'editare', query: 'video editing timeline computer' },
  { name: 'filmare', query: 'camera filming behind the scenes' },
];

for (const v of VIDEOS) {
  try {
    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(v.query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: KEY } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const video = data.videos?.[0];
    if (!video) throw new Error('niciun rezultat');
    // alegem un fișier mp4 de dimensiune moderată (site-ul să rămână rapid)
    const files = (video.video_files || [])
      .filter(f => f.file_type === 'video/mp4' && f.width)
      .sort((a, b) => a.width - b.width);
    const file = files.find(f => f.width >= 960 && f.width <= 1400) || files[files.length - 1];
    if (!file) throw new Error('fără fișier mp4');
    const vidRes = await fetch(file.link);
    if (!vidRes.ok) throw new Error(`descărcare HTTP ${vidRes.status}`);
    fs.writeFileSync(path.join(VID_OUT, `${v.name}.mp4`), Buffer.from(await vidRes.arrayBuffer()));
    console.log(`✔ videos/${v.name}.mp4  (${file.width}x${file.height}, de: ${video.user?.name} / Pexels)`);
  } catch (err) {
    console.warn(`⚠ video ${v.name}: ${err.message}`);
  }
}

console.log('\nGata! Rulează `npm run build` ca pozele și clipurile să intre în site.');
