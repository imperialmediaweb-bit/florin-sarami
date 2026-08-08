import fs from 'fs';
import path from 'path';
import { dataDir } from './storage';

export type SiteSettings = {
  telefon: string;
  email: string;
  firma: string;
  cui: string;
  regcom: string;
  adresa: string;
  program: string;
};

const DEFAULTS: SiteSettings = {
  telefon: '+40 7xx xxx xxx',
  email: 'contact@sarami.ro',
  firma: 'SARAMI MEDIA S.R.L.',
  cui: 'ROxxxxxxxx',
  regcom: 'Jxx/xxxx/20xx',
  adresa: 'Str. Exemplu nr. 1, Oraș, România',
  program: 'Luni – Vineri: 09:00 – 18:00',
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
  fs.writeFileSync(fileFor(), JSON.stringify(s, null, 2) + '\n');
}
