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
  console.error('Lipsește PEXELS_API_KEY. Adaugă în .env un rând:  PEXELS_API_KEY="cheia-ta"');
  console.error('Cheia se obține gratuit de la https://www.pexels.com/api/');
  process.exit(1);
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

console.log('\nGata! Rulează `npm run build` ca pozele să intre în site.');
