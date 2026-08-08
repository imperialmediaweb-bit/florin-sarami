import fs from 'fs';
import path from 'path';

export type BlogPost = {
  slug: string;
  title: string;
  /** dată ISO, ex: 2024-05-10T09:00:00 */
  date: string;
  category?: string;
  excerpt: string;
  contentHtml: string;
  /** cale/URL către imaginea de copertă */
  image?: string;
};

/** Articolele livrate odată cu codul (importate din WordPress). */
const REPO_DIR = path.join(process.cwd(), 'content', 'blog');

/**
 * Folderul „viu" al articolelor:
 *  - pe Railway cu Volume montat la /data → /data/blog (persistent între
 *    redeploy-uri; panoul de admin scrie aici, modificările apar instant)
 *  - altfel → content/blog din proiect
 * La prima folosire, folderul persistent se populează cu articolele din repo.
 */
export function getBlogDir(): string {
  const base = process.env.DATA_DIR || (fs.existsSync('/data') ? '/data' : null);
  if (!base) return REPO_DIR;
  const dir = path.join(base, 'blog');
  fs.mkdirSync(dir, { recursive: true });
  const hasPosts = fs.readdirSync(dir).some(f => f.endsWith('.json'));
  if (!hasPosts && fs.existsSync(REPO_DIR)) {
    for (const f of fs.readdirSync(REPO_DIR).filter(f => f.endsWith('.json'))) {
      fs.copyFileSync(path.join(REPO_DIR, f), path.join(dir, f));
    }
  }
  return dir;
}

export function getAllPosts(): BlogPost[] {
  const dir = getBlogDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as BlogPost)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): BlogPost | undefined {
  return getAllPosts().find(p => p.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
