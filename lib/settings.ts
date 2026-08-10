import fs from 'fs';
import path from 'path';
import { dataDir } from './storage';
import { cloudPut } from './cloudstore';

export type SiteSettings = {
  telefon: string;
  email: string;
  firma: string;
  cui: string;
  regcom: string;
  adresa: string;
  program: string;
  /** număr WhatsApp (ex: 40723111222, fără +) — completat → apare butonul plutitor */
  whatsapp: string;
  /** text promoțional — completat → apare bara de anunț sus pe site */
  anunt: string;
  /** ID Google Analytics 4 (ex: G-XXXXXXXXXX) — completat → măsurare activă */
  ga: string;
  /** ID Meta/Facebook Pixel (numeric) — completat → pixelul e activ */
  fbpixel: string;
};

const DEFAULTS: SiteSettings = {
  telefon: '+40 7xx xxx xxx',
  email: 'contact@sarami.ro',
  firma: 'SARAMI MEDIA S.R.L.',
  cui: 'ROxxxxxxxx',
  regcom: 'Jxx/xxxx/20xx',
  adresa: 'Str. Exemplu nr. 1, Oraș, România',
  program: 'Luni – Vineri: 09:00 – 18:00',
  whatsapp: '',
  anunt: '',
  ga: '',
  fbpixel: '2108829569729584',
};

function fileFor(): string {
  return path.join(dataDir('setari'), 'site.json');
}

export function getSettings(): SiteSettings {
  const f = fileFor();
  if (!fs.existsSync(f)) return DEFAULTS;
  try {
    return { ...DEFAULTS, ...JSON.parse(fs.readFileSync(f, 'utf8')) };
  } catch {
    return DEFAULTS;
  }
}

export function saveSettings(s: SiteSettings) {
  const json = JSON.stringify(s, null, 2) + '\n';
  fs.writeFileSync(fileFor(), json);
  void cloudPut('setari', 'site.json', json);
}
