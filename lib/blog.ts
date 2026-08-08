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
  /** cale către imaginea de copertă, ex: /blog/slug.jpg */
  image?: string;
};

const DIR = path.join(process.cwd(), 'content', 'blog');

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) as BlogPost)
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
