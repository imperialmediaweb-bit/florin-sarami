import Link from 'next/link';
import { formatDate, getAllPosts } from '@/lib/blog';

/** Ultimele articole de pe blog — secțiune reutilizabilă (server component). */
export default function LatestPosts({ count = 3 }: { count?: number }) {
  const posts = getAllPosts().slice(0, count);
  if (posts.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="center reveal">
          <span className="eyebrow">Blog</span>
          <h2 className="h-lg">Ultimele <span className="grad-text">articole</span></h2>
          <p className="lead">Idei, sfaturi și noutăți despre conținut și video — scrise de echipa noastră.</p>
        </div>
        <div className="folio-grid mt-3">
          {posts.map((p, i) => (
            <article className={`folio-item reveal d${i + 1}`} key={p.slug}>
              <Link href={`/blog/${p.slug}`}>
                <div className="blog-media">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} loading="lazy" />
                  ) : (
                    <span className="blog-fallback">📝</span>
                  )}
                </div>
              </Link>
              <div className="folio-body">
                {p.category && <span className="folio-tag">{p.category}</span>}
                <span className="blog-date">{formatDate(p.date)}</span>
                <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
              </div>
            </article>
          ))}
        </div>
        <div className="center mt-3 reveal">
          <Link href="/blog" className="btn btn-ghost">Vezi toate articolele →</Link>
        </div>
      </div>
    </section>
  );
}
