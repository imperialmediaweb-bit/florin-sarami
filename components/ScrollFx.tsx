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

    // 3D tilt + spotlight: cardurile se înclină subtil după cursor
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const TILT_SELECTOR = '.card, .media-card, .folio-item, .step, .value-pill, .stat';

    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const card = target?.closest?.('.card') as HTMLElement | null;
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
      if (reducedMotion) return;
      const tiltEl = target?.closest?.(TILT_SELECTOR) as HTMLElement | null;
      if (!tiltEl) return;
      const r = tiltEl.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tiltEl.style.transform =
        `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-6px)`;
    };

    const onOut = (e: PointerEvent) => {
      const tiltEl = (e.target as Element | null)?.closest?.(TILT_SELECTOR) as HTMLElement | null;
      if (!tiltEl) return;
      const to = e.relatedTarget as Element | null;
      if (to && tiltEl.contains(to)) return; // încă în interiorul cardului
      tiltEl.style.transform = '';
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerout', onOut, { passive: true });

    return () => {
      io.disconnect();
      cio.disconnect();
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerout', onOut);
    };
  }, [pathname]);

  return null;
}
