import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CtaBand from '@/components/CtaBand';
import JsonLd, { breadcrumbSchema } from '@/components/JsonLd';
import { formatDate, getAllPosts, getPost } from '@/lib/blog';

// randare la fiecare cerere — articolele salvate din /admin apar instant
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}/`,
      publishedTime: new Date(post.date).toISOString(),
      ...(post.image ? { images: [{ url: post.image, alt: post.title }] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  // articole similare (aceeași categorie) — interlinking bun pentru SEO
  const related = getAllPosts()
    .filter(p => p.slug !== post.slug && (!post.category || p.category === post.category))
    .slice(0, 3);

  // JSON-LD cere URL-uri absolute pentru imagini (pozele locale sunt relative)
  const absImage = post.image
    ? post.image.startsWith('http') ? post.image : `https://sarami.ro${post.image}`
    : undefined;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: new Date(post.date).toISOString(),
    inLanguage: 'ro-RO',
    mainEntityOfPage: `https://sarami.ro/blog/${post.slug}/`,
    ...(absImage ? { image: [absImage] } : {}),
    author: { '@type': 'Organization', name: 'Sarami Media', url: 'https://sarami.ro' },
    publisher: {
      '@type': 'Organization',
      name: 'Sarami Media',
      logo: { '@type': 'ImageObject', url: 'https://sarami.ro/assets/logo.png' },
    },
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blog/' },
          { name: post.title, url: `/blog/${post.slug}/` },
        ])}
      />

      <section className="section" style={{ paddingTop: 70 }}>
        <div className="container">
          <article className="article">
            <Link href="/blog" className="article-back">← Înapoi la blog</Link>
            <header className="article-head">
              {post.category && <span className="folio-tag">{post.category}</span>}
              <h1 className="h-lg" style={{ marginTop: 14 }}>{post.title}</h1>
              <div className="article-meta">
                <span>📅 {formatDate(post.date)}</span>
                <span>✍️ Sarami Media</span>
              </div>
            </header>
            {post.image && (
              <div className="article-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt={post.title} />
              </div>
            )}
            <div className="article-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          </article>

          {related.length > 0 && (
            <div style={{ maxWidth: 800, margin: '60px auto 0' }}>
              <h2 className="h-md" style={{ marginBottom: 20 }}>Articole similare</h2>
              <div style={{ display: 'grid', gap: 12 }}>
                {related.map(r => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="admin-row"
                    style={{ display: 'flex' }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <b style={{ display: 'block', fontSize: '.96rem', color: 'var(--text-main)' }}>{r.title}</b>
                      <span style={{ color: 'var(--text-faint)', fontSize: '.82rem' }}>{formatDate(r.date)}</span>
                    </div>
                    <span style={{ color: 'var(--blue-600)', fontWeight: 700 }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="Ai nevoie de conținut pentru afacerea ta?"
        text="Articole, descrieri de produse, texte de site — scrise de oameni reali, optimizate pentru Google."
        label="Completează brief-ul de conținut"
        href="/brief-continut"
      />
    </>
  );
}
