'use client';

import { useState } from 'react';
import type { FolioItem } from '@/lib/portfolio';

const CATS: { key: 'toate' | FolioItem['cat']; label: string }[] = [
  { key: 'toate', label: 'Toate' },
  { key: 'shorts', label: 'Shorts' },
  { key: 'longform', label: 'Long Form' },
  { key: 'redactare', label: 'Redactare conținut' },
  // categorii mai vechi — apar doar dacă există elemente salvate cu ele
  { key: 'social', label: 'Social Media' },
  { key: 'promo', label: 'Promoționale' },
  { key: 'podcast', label: 'Podcasturi' },
  { key: 'eveniment', label: 'Evenimente' },
];

const GRADIENTS = [
  'linear-gradient(135deg,#10245a,#1d4ed8)',
  'linear-gradient(135deg,#1d4ed8,#0ea5e9)',
  'linear-gradient(135deg,#0f2050,#2563eb)',
  'linear-gradient(135deg,#16307a,#38bdf8)',
  'linear-gradient(135deg,#2563eb,#7dd3fc)',
  'linear-gradient(135deg,#10245a,#0ea5e9)',
];

/** Grila de portofoliu — clipurile se administrează din /admin → Portofoliu. */
export default function PortfolioGrid({ items }: { items: FolioItem[] }) {
  const [filter, setFilter] = useState<'toate' | FolioItem['cat']>('toate');
  const visible = items.filter(i => filter === 'toate' || i.cat === filter);
  const activeCats = CATS.filter(c => c.key === 'toate' || items.some(i => i.cat === c.key));

  return (
    <>
      <div className="folio-filters reveal in">
        {activeCats.map(f => (
          <button key={f.key} className={filter === f.key ? 'active' : ''} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="folio-grid">
        {visible.map((item, i) => {
          // zona media: clip YouTube, imagine sau placeholder cu gradient;
          // învelită în link extern când există (lucrările de redactare)
          const vertical = item.cat === 'shorts';
          const media = item.video ? (
            <div className={`folio-media${vertical ? ' vert' : ''}`}>
              <video
                src={item.video}
                controls
                playsInline
                preload="metadata"
                poster={item.image || undefined}
              />
            </div>
          ) : item.videoId ? (
            <div className={`folio-media${vertical ? ' vert' : ''}`}>
              <iframe
                src={`https://www.youtube.com/embed/${item.videoId}`}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : item.image ? (
            <div className="blog-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} loading="lazy" />
            </div>
          ) : (
            <div className="folio-media placeholder" style={{ background: GRADIENTS[i % GRADIENTS.length] }}>
              {item.link ? <span style={{ fontSize: '2.6rem' }}>📝</span> : <div className="mock-play"></div>}
            </div>
          );

          return (
          <article className="folio-item reveal in" key={item.id}>
            {item.link && !item.videoId ? (
              <a href={item.link} target="_blank" rel="noopener noreferrer">{media}</a>
            ) : (
              media
            )}
            <div className="folio-body">
              <span className="folio-tag">{CATS.find(c => c.key === item.cat)?.label || item.cat}</span>
              <h3>{item.link ? <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title} ↗</a> : item.title}</h3>
              <span>{item.desc}</span>
            </div>
          </article>
          );
        })}
        {visible.length === 0 && (
          <p style={{ color: 'var(--text-faint)', gridColumn: '1 / -1', textAlign: 'center' }}>
            Niciun clip în această categorie încă.
          </p>
        )}
      </div>
    </>
  );
}
