import type { Metadata } from 'next';
import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import PortfolioGrid from '@/components/PortfolioGrid';
import { getPortfolio } from '@/lib/portfolio';

export const metadata: Metadata = {
  alternates: { canonical: '/portofoliu/' },
  title: 'Portofoliu',
  description:
    'Portofoliu Sarami Media: clipuri social media, videoclipuri promoționale, podcasturi, evenimente și interviuri editate profesional.',
};

// clipurile adăugate din /admin apar instant
export const dynamic = 'force-dynamic';

export default function PortofoliuPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs reveal in">
            <Link href="/">Home</Link>
            <span><Link href="/editare-video">Editare video</Link></span>
            <span>Portofoliu</span>
          </div>
          <span className="eyebrow">Lucrările noastre</span>
          <h1 className="h-xl">Portofoliu <span className="grad-text">video</span></h1>
          <p className="lead">Fiecare proiect spune o poveste. Iată câteva dintre cele pe care le-am spus noi — apasă play și convinge-te.</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          {/* clipurile se administrează din /admin → Portofoliu */}
          <PortfolioGrid items={getPortfolio()} />
          <p className="center mt-3" style={{ color: 'var(--text-faint)', fontSize: '.92rem' }}>
            🎬 Galeria se actualizează constant cu cele mai noi proiecte.
          </p>
        </div>
      </section>

      <CtaBand
        title="Vrei ca următorul proiect de aici să fie al tău?"
        text="Completează brief-ul cu detaliile proiectului tău și primești oferta — de obicei în aceeași zi."
        label="Completează brief-ul video"
        href="/brief-video"
      />
    </>
  );
}
