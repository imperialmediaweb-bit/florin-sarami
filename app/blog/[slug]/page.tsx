import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CtaBand from '@/components/CtaBand';
import { formatDate, getAllPosts, getPost } from '@/lib/blog';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <section className="section" style={{ paddingTop: 70 }}>
        <div className="container">
          <div className="article">
            <Link href="/blog" className="article-back">← Înapoi la blog</Link>
            <div className="article-head">
              {post.category && <span className="folio-tag">{post.category}</span>}
              <h1 className="h-lg" style={{ marginTop: 14 }}>{post.title}</h1>
              <div className="article-meta">
                <span>📅 {formatDate(post.date)}</span>
                <span>✍️ Sarami Media</span>
              </div>
            </div>
            {post.image && (
              <div className="article-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt={post.title} />
              </div>
            )}
            <div className="article-body" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          </div>
        </div>
      </section>

      <CtaBand
        title="Ai nevoie de conținut pentru afacerea ta?"
        text="Articole, descrieri de produse, texte de site — scrise de oameni reali, optimizate pentru Google."
        label="Hai să vorbim"
      />
    </>
  );
}
