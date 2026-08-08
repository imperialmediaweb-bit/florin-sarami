'use client';

import { useState } from 'react';

type Category = 'social' | 'promo' | 'podcast' | 'eveniment';

type FolioItem = {
  cat: Category;
  tag: string;
  title: string;
  desc: string;
  gradient?: string;
  /**
   * ID-ul clipului de pe YouTube (ex: pentru youtube.com/watch?v=abc123XYZ
   * pune videoId: 'abc123XYZ'). Cât timp lipsește, se afișează un placeholder.
   */
  videoId?: string;
};

const ITEMS: FolioItem[] = [
  { cat: 'social', tag: 'Social Media', title: 'Campanie Reels — brand fashion', desc: 'Clipuri verticale cu subtitrări dinamice și hook-uri puternice' },
  { cat: 'promo', tag: 'Promoțional', title: 'Video prezentare firmă', desc: 'Spot de brand cu motion graphics și voce profesională', gradient: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)' },
  { cat: 'podcast', tag: 'Podcast', title: 'Podcast business — episod complet', desc: 'Montaj multi-cameră, curățare audio, clipuri de promovare', gradient: 'linear-gradient(135deg,#0f2050,#2563eb)' },
  { cat: 'eveniment', tag: 'Eveniment', title: 'Aftermovie conferință', desc: 'Highlight-uri cinematic cu color grading premium', gradient: 'linear-gradient(135deg,#16307a,#38bdf8)' },
  { cat: 'social', tag: 'Social Media', title: 'Serie TikTok — produs cosmetic', desc: 'Clipuri scurte optimizate pentru conversie', gradient: 'linear-gradient(135deg,#2563eb,#7dd3fc)' },
  { cat: 'promo', tag: 'Promoțional', title: 'Lansare produs — e-commerce', desc: 'Video de produs cu efecte vizuale și call-to-action', gradient: 'linear-gradient(135deg,#10245a,#0ea5e9)' },
];

const FILTERS: { key: 'toate' | Category; label: string }[] = [
  { key: 'toate', label: 'Toate' },
  { key: 'social', label: 'Social Media' },
  { key: 'promo', label: 'Promoționale' },
  { key: 'podcast', label: 'Podcasturi' },
  { key: 'eveniment', label: 'Evenimente' },
];

export default function PortfolioGrid() {
  const [filter, setFilter] = useState<'toate' | Category>('toate');
  const visible = ITEMS.filter(i => filter === 'toate' || i.cat === filter);

  return (
    <>
      <div className="folio-filters reveal in">
        {FILTERS.map(f => (
          <button key={f.key} className={filter === f.key ? 'active' : ''} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="folio-grid">
        {visible.map(item => (
          <article className="folio-item reveal in" key={item.title}>
            {item.videoId ? (
              <div className="folio-media">
                <iframe
                  src={`https://www.youtube.com/embed/${item.videoId}`}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="folio-media placeholder" style={item.gradient ? { background: item.gradient } : undefined}>
                <div className="mock-play"></div>
              </div>
            )}
            <div className="folio-body">
              <span className="folio-tag">{item.tag}</span>
              <h3>{item.title}</h3>
              <span>{item.desc}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
