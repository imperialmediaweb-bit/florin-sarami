import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowIcon } from '@/components/Visuals';

export const metadata: Metadata = {
  alternates: { canonical: '/cere-oferta/' },
  title: 'Cere ofertă — răspuns în aceeași zi',
  description:
    'Cere o ofertă personalizată pentru editare video sau redactare de conținut. Completezi un brief scurt și primești oferta de obicei în aceeași zi lucrătoare.',
};

const STEPS = [
  { n: '1', title: 'Completezi brief-ul', desc: 'Alegi serviciul și ne spui în 2 minute ce ai nevoie — cu cât știm mai multe, cu atât oferta e mai precisă.' },
  { n: '2', title: 'Primești oferta', desc: 'Analizăm brief-ul și îți trimitem o ofertă personalizată pe email, de obicei în aceeași zi lucrătoare.' },
  { n: '3', title: 'Începem lucrul', desc: 'Dacă oferta îți convine, stabilim detaliile finale și ne apucăm de treabă. Simplu, fără bătăi de cap.' },
];

export default function CereOfertaPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs reveal in">
            <Link href="/">Home</Link>
            <span>Cere ofertă</span>
          </div>
          <span className="eyebrow">💬 Ofertă personalizată, fără obligații</span>
          <h1 className="h-xl">Cere o <span className="grad-text">ofertă</span> — durează 2 minute</h1>
          <p className="lead">
            Fiecare proiect e diferit, așa că nu lucrăm cu prețuri de-a gata. Completezi un brief scurt,
            iar noi îți trimitem o ofertă croită exact pe nevoile tale — de obicei în aceeași zi lucrătoare.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="cards-2">
            <div className="card reveal d1" style={{ textAlign: 'center', padding: 'clamp(28px, 4vw, 44px)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 10 }}>🎬</div>
              <h2 className="h-md">Editare video</h2>
              <p style={{ color: 'var(--text-dim)', marginBottom: 22 }}>
                Shorts, Reels & TikTok, videoclipuri promoționale, podcasturi, evenimente sau clipuri de lungă
                durată — montaj, subtitrări, culoare și sunet, gata de publicat.
              </p>
              <Link href="/brief-video" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%' }}>
                Completează brief-ul video <ArrowIcon />
              </Link>
            </div>
            <div className="card reveal d2" style={{ textAlign: 'center', padding: 'clamp(28px, 4vw, 44px)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 10 }}>✍️</div>
              <h2 className="h-md">Redactare conținut</h2>
              <p style={{ color: 'var(--text-dim)', marginBottom: 22 }}>
                Articole de blog, texte de site, descrieri de produse — 100% scrise de oameni,
                optimizate pentru Google și pentru cititorii tăi.
              </p>
              <Link href="/brief-continut" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%' }}>
                Completează brief-ul de conținut <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Cum funcționează</span>
            <h2 className="h-lg">Trei pași <span className="grad-text">simpli</span></h2>
          </div>
          <div className="steps three mt-3">
            {STEPS.map((s, i) => (
              <div className={`step reveal d${i + 1}`} key={s.n}>
                <span className="step-num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
          <p className="center reveal" style={{ color: 'var(--text-dim)', marginTop: 34 }}>
            Ai doar o întrebare rapidă? <Link href="/contact" style={{ color: 'var(--blue-600)', fontWeight: 600 }}>Scrie-ne pe pagina de contact</Link> — răspundem cu drag.
          </p>
        </div>
      </section>
    </>
  );
}
