import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';

export const dynamic = 'force-static';

const BASE = 'https://sarami.ro';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: '', priority: 1 },
    { path: '/despre-noi', priority: 0.7 },
    { path: '/editare-video', priority: 0.9 },
    { path: '/portofoliu', priority: 0.8 },
    { path: '/redactare-continut', priority: 0.9 },
    { path: '/blog', priority: 0.8 },
    { path: '/contact', priority: 0.7 },
    { path: '/termeni-si-conditii', priority: 0.2 },
    { path: '/politica-confidentialitate', priority: 0.2 },
    { path: '/politica-cookies', priority: 0.2 },
  ];

  return [
    ...pages.map(p => ({
      url: `${BASE}${p.path}/`,
      changeFrequency: 'monthly' as const,
      priority: p.priority,
    })),
    ...getAllPosts().map(p => ({
      url: `${BASE}/blog/${p.slug}/`,
      lastModified: new Date(p.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
