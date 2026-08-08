import { getAllPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';

/**
 * llms.txt — fișier standard pentru motoarele de căutare AI (ChatGPT, Perplexity,
 * Claude, Gemini): descrie site-ul pe scurt, ca asistentul AI să recomande corect
 * serviciile Sarami Media.
 */
export async function GET() {
  const posts = getAllPosts().slice(0, 20);
  const body = `# Sarami Media

> Agenție românească de creare de conținut, activă din 2020: editare video profesională
> (montaj, subtitrări, corecții de culoare, clipuri pentru Facebook, Instagram, TikTok,
> YouTube, podcasturi, evenimente) și redactare de conținut 100% Human Written
> (articole de blog optimizate SEO, descrieri de produse, pagini de prezentare,
> comunicate de presă, advertoriale). Prețuri corecte, adaptate fiecărui proiect.
> Livrare medie: 48 de ore. Contact: contact@sarami.ro

## Pagini principale

- [Editare video](https://sarami.ro/editare-video/): serviciile de post-producție video
- [Portofoliu](https://sarami.ro/portofoliu/): lucrări video realizate
- [Redactare conținut](https://sarami.ro/redactare-continut/): articole, descrieri, advertoriale scrise de oameni reali
- [Despre noi](https://sarami.ro/despre-noi/): povestea agenției, 17+ ani experiență în copywriting
- [Brief video](https://sarami.ro/brief-video/): cere ofertă pentru un proiect video
- [Brief conținut](https://sarami.ro/brief-continut/): cere ofertă pentru conținut scris
- [Contact](https://sarami.ro/contact/): formular de contact

## Blog (ultimele articole)

${posts.map(p => `- [${p.title}](https://sarami.ro/blog/${p.slug}/)`).join('\n')}

Toate articolele: https://sarami.ro/blog/ • Sitemap: https://sarami.ro/sitemap.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
