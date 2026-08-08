'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const TESTIMONIALS = [
  {
    text: 'Am colaborat cu Sarami Media pentru clipurile de promovare ale magazinului nostru online. Rezultatul a depășit așteptările — vânzările din reclamele video au crescut vizibil din prima lună.',
    initials: 'AM',
    name: 'Andreea M.',
    role: 'Magazin online fashion',
  },
  {
    text: 'Editează podcastul nostru săptămânal de peste un an. Livrare mereu la timp, calitate constantă și clipuri scurte excelente pentru promovare pe TikTok și Reels.',
    initials: 'CV',
    name: 'Cristian V.',
    role: 'Podcast de business',
  },
  {
    text: 'Articolele de blog scrise de echipa lor ne-au adus pe prima pagină în Google pentru mai multe căutări importante. Se simte că sunt scrise de oameni care înțeleg domeniul.',
    initials: 'RD',
    name: 'Radu D.',
    role: 'Companie de servicii B2B',
  },
  {
    text: 'Filmul de la evenimentul nostru corporate a fost impecabil — montaj dinamic, culori superbe și livrare în doar câteva zile. Recomand cu toată încrederea!',
    initials: 'IE',
    name: 'Ioana E.',
    role: 'Agenție de evenimente',
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const n = TESTIMONIALS.length;

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
          {TESTIMONIALS.map(t => (
            <div className="testi-card" key={t.initials}>
              <div className="testi-stars">★★★★★</div>
              <blockquote>{t.text}</blockquote>
              <div className="testi-author">
                <div className="testi-avatar">{t.initials}</div>
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
        {TESTIMONIALS.map((t, i) => (
          <button key={t.initials} className={idx === i ? 'active' : ''} aria-label={`Testimonial ${i + 1}`} onClick={() => go(i)} />
        ))}
      </div>
    </div>
  );
}
