'use client';

import { useEffect, useState } from 'react';

/**
 * Butonul fix de jos de pe mobil. Apare DOAR la mijlocul paginii:
 *  - sus, cât timp se văd butoanele din hero → ascuns (nu dublăm butoane
 *    și nu acoperim WhatsApp-ul)
 *  - jos, cât timp formularul e pe ecran → ascuns (nu fură apăsările)
 * Cât e vizibil, ridică și butonul plutitor de WhatsApp deasupra lui.
 */
export default function LpSticky({ label }: { label: string }) {
  const [heroVisible, setHeroVisible] = useState(true);
  const [briefVisible, setBriefVisible] = useState(false);
  const show = !heroVisible && !briefVisible;

  useEffect(() => {
    const hero = document.getElementById('cta-hero');
    const brief = document.getElementById('brief');
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.target === hero) setHeroVisible(e.isIntersecting);
          if (e.target === brief) setBriefVisible(e.isIntersecting);
        });
      },
      { threshold: 0.05 }
    );
    if (hero) io.observe(hero);
    if (brief) io.observe(brief);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('has-lp-sticky', show);
    return () => document.body.classList.remove('has-lp-sticky');
  }, [show]);

  if (!show) return null;
  return (
    <a href="#brief" className="lp-sticky">{label}</a>
  );
}
