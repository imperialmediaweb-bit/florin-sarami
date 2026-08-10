'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Testimonial } from '@/lib/testimonials';

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

/**
 * Poza unui testimonial: dacă e lată (captură de ecran cu recenzia), o afișăm
 * mare în card; dacă e portret/pătrată (poza clientului), devine avatar rotund.
 */
function TestiImage({ src, name }: { src: string; name: string }) {
  const [wide, setWide] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={wide ? 'testi-capture' : 'testi-avatar'}
      src={src}
      alt={name}
      loading="lazy"
      onLoad={e => {
        const img = e.currentTarget;
        if (img.naturalWidth > img.naturalHeight * 1.4) setWide(true);
      }}
    />
  );
}

/** Slider de testimoniale — elementele se administrează din /admin → Testimoniale. */
export default function Testimonials({ items }: { items: Testimonial[] }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = items.length;

  const restart = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setIdx(i => (i + 1) % n), 7000);
  }, [n]);

  useEffect(() => {
    restart();
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [restart]);

  const go = (i: number) => {
    setIdx(((i % n) + n) % n);
    restart();
  };

  return (
    <div className="testi-wrap mt-3 reveal">
      <button className="testi-arrow prev" aria-label="Testimonial anterior" onClick={() => go(idx - 1)}>‹</button>
      <button className="testi-arrow next" aria-label="Testimonial următor" onClick={() => go(idx + 1)}>›</button>
      <div className="testi-viewport">
        <div className="testi-track" style={{ transform: `translateX(-${idx * 100}%)` }}>
          {items.map(t => (
            <div className="testi-card" key={t.id}>
              <div className="testi-stars">★★★★★</div>
              <blockquote>{t.text}</blockquote>
              <div className="testi-author">
                {t.image ? (
                  <TestiImage src={t.image} name={t.name} />
                ) : (
                  <div className="testi-avatar">{initialsOf(t.name)}</div>
                )}
                <div>
                  <b>{t.name}</b>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="testi-nav" role="tablist" aria-label="Selectează testimonial">
        {items.map((t, i) => (
          <button key={t.id} className={idx === i ? 'active' : ''} aria-label={`Testimonial ${i + 1}`} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  );
}
