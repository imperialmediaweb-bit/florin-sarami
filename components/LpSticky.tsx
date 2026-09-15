'use client';

import { useEffect, useState } from 'react';

/**
 * Butonul fix de jos de pe mobil. Se ASCUNDE automat cât timp formularul
 * e pe ecran — altfel stătea peste câmpuri și fura apăsările (omul dădea
 * click pe un câmp și pagina sărea la începutul secțiunii).
 */
export default function LpSticky({ label }: { label: string }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById('brief');
    if (!target) return;
    const io = new IntersectionObserver(
      entries => setHidden(entries[0]?.isIntersecting ?? false),
      { threshold: 0.05 }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  if (hidden) return null;
  return (
    <a href="#brief" className="lp-sticky">{label}</a>
  );
}
