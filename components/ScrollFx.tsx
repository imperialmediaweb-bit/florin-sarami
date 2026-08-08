'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Efecte globale re-atașate la fiecare navigare:
 * - animații reveal la scroll
 * - contoare animate ([data-count])
 * - spotlight pe .card la mișcarea cursorului
 */
export default function ScrollFx() {
  const pathname = usePathname();

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => io.observe(el));

    const counters = document.querySelectorAll<HTMLElement>('[data-count]');
    const cio = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          cio.unobserve(entry.target);
          const el = entry.target as HTMLElement;
          const target = parseInt(el.dataset.count || '0', 10);
          const suffix = el.dataset.suffix || '';
          const DUR = 1600;
          let t0: number | null = null;
          const tick = (ts: number) => {
            if (t0 === null) t0 = ts;
            const p = Math.min((ts - t0) / DUR, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(el => cio.observe(el));

    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.('.card') as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      io.disconnect();
      cio.disconnect();
      document.removeEventListener('pointermove', onMove);
    };
  }, [pathname]);

  return null;
}
