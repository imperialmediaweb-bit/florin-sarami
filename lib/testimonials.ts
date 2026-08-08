import fs from 'fs';
import path from 'path';
import { dataDir } from './storage';
import { cloudPut } from './cloudstore';

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  text: string;
};

/** Exemplele afișate până când adaugi testimonialele reale din /admin. */
const DEFAULTS: Testimonial[] = [
  {
    id: 'demo-1',
    name: 'Andreea M.',
    role: 'Magazin online fashion',
    text: 'Am colaborat cu Sarami Media pentru clipurile de promovare ale magazinului nostru online. Rezultatul a depășit așteptările — vânzările din reclamele video au crescut vizibil din prima lună.',
  },
  {
    id: 'demo-2',
    name: 'Cristian V.',
    role: 'Podcast de business',
    text: 'Editează podcastul nostru săptămânal de peste un an. Livrare mereu la timp, calitate constantă și clipuri scurte excelente pentru promovare pe TikTok și Reels.',
  },
  {
    id: 'demo-3',
    name: 'Radu D.',
    role: 'Companie de servicii B2B',
    text: 'Articolele de blog scrise de echipa lor ne-au adus pe prima pagină în Google pentru mai multe căutări importante. Se simte că sunt scrise de oameni care înțeleg domeniul.',
  },
  {
    id: 'demo-4',
    name: 'Ioana E.',
    role: 'Agenție de evenimente',
    text: 'Filmul de la evenimentul nostru corporate a fost impecabil — montaj dinamic, culori superbe și livrare în doar câteva zile. Recomand cu toată încrederea!',
  },
];

function fileFor(): string {
  return path.join(dataDir('testimoniale'), 'items.json');
}

export function getTestimonials(): Testimonial[] {
  const f = fileFor();
  if (!fs.existsSync(f)) return DEFAULTS;
  try {
    const items = JSON.parse(fs.readFileSync(f, 'utf8'));
    return Array.isArray(items) && items.length ? items : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function saveTestimonials(items: Testimonial[]) {
  const json = JSON.stringify(items, null, 2) + '\n';
  fs.writeFileSync(fileFor(), json);
  void cloudPut('testimoniale', 'items.json', json);
}
