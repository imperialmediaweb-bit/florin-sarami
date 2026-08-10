import fs from 'fs';
import path from 'path';
import { dataDir } from './storage';
import { cloudPut } from './cloudstore';

export type FolioItem = {
  id: string;
  cat: 'shorts' | 'longform' | 'social' | 'promo' | 'podcast' | 'eveniment' | 'redactare';
  title: string;
  desc: string;
  /** ID-ul clipului YouTube (ex: abc123XYZ). Gol = placeholder cu gradient. */
  videoId?: string;
  /** Clip încărcat direct pe site (URL Cloudinary .mp4) — are prioritate față de YouTube. */
  video?: string;
  /** Link extern (ex: articolul publicat) — folosit la lucrările de redactare. */
  link?: string;
  /** Imagine de copertă (thumbnail) — afișată când nu există clip YouTube. */
  image?: string;
};

/** Categoriile oferite la adăugare: video = Shorts / Long Form, plus lucrările scrise. */
export const FOLIO_CATS: { key: FolioItem['cat']; label: string }[] = [
  { key: 'shorts', label: 'Shorts' },
  { key: 'longform', label: 'Long Form' },
  { key: 'redactare', label: 'Redactare conținut' },
];

/** Etichete și pentru categoriile vechi — elementele salvate cu ele se afișează în continuare. */
export const ALL_CAT_LABELS: Record<FolioItem['cat'], string> = {
  shorts: 'Shorts',
  longform: 'Long Form',
  redactare: 'Redactare conținut',
  social: 'Social Media',
  promo: 'Promoționale',
  podcast: 'Podcasturi',
  eveniment: 'Evenimente',
};

export const folioCatLabel = (key: string) =>
  ALL_CAT_LABELS[key as FolioItem['cat']] || key;

/** Exemplele afișate până când adaugi clipurile tale din panoul de admin. */
const DEFAULTS: FolioItem[] = [
  { id: 'demo-1', cat: 'shorts', title: 'Serie Reels — brand fashion', desc: 'Clipuri verticale cu subtitrări dinamice și hook-uri puternice' },
  { id: 'demo-2', cat: 'shorts', title: 'TikTok — produs cosmetic', desc: 'Clipuri scurte optimizate pentru conversie' },
  { id: 'demo-3', cat: 'shorts', title: 'Shorts — clip din podcast', desc: 'Momentele tari, decupate și subtitrate pentru viralizare' },
  { id: 'demo-4', cat: 'longform', title: 'Podcast business — episod complet', desc: 'Montaj multi-cameră, curățare audio, intro & outro' },
  { id: 'demo-5', cat: 'longform', title: 'Video prezentare firmă', desc: 'Spot de brand cu motion graphics și voce profesională' },
  { id: 'demo-6', cat: 'longform', title: 'Aftermovie conferință', desc: 'Highlight-uri cinematic cu color grading premium' },
];

function fileFor(): string {
  return path.join(dataDir('portofoliu'), 'items.json');
}

export function getPortfolio(): FolioItem[] {
  const f = fileFor();
  if (!fs.existsSync(f)) return DEFAULTS;
  try {
    const items = JSON.parse(fs.readFileSync(f, 'utf8'));
    return Array.isArray(items) ? items : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function savePortfolio(items: FolioItem[]) {
  const json = JSON.stringify(items, null, 2) + '\n';
  fs.writeFileSync(fileFor(), json);
  void cloudPut('portofoliu', 'items.json', json);
}
