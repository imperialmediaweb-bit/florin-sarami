import type { Metadata } from 'next';
import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import { formatDate, getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articole despre editare video, content marketing și creare de conținut, scrise de echipa Sarami Media.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs reveal in">
            <Link href="/">Home</Link>
            <span>Blog</span>
          </div>
          <span className="eyebrow">Blog</span>
          <h1 className="h-xl">Idei &amp; <span className="grad-text">resurse</span></h1>
          <p className="lead">Articole despre video, conținut și tot ce te ajută să comunici mai bine online — scrise de echipa noastră.</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          {posts.length === 0 ? (
            <p className="center" style={{ color: 'var(--text-faint)' }}>
              📝 În curând publicăm primele articole. Revino curând!
            </p>
          ) : (
            <div className="folio-grid">
              {posts.map((p, i) => (
                <article className={`folio-item reveal d${(i % 3) + 1}`} key={p.slug}>
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
                    <span>{p.excerpt}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="Vrei conținut ca acesta pentru site-ul tău?"
        text="Scriem articole de blog optimizate SEO, 100% Human Written, pentru orice domeniu."
        label="Cere ofertă"
      />
    </>
  );
}
