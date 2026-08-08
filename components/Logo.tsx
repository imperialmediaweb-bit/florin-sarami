'use client';

import { useEffect, useState } from 'react';

/**
 * Logo-ul original Sarami Media.
 * Urcă fișierul PNG original ca `public/assets/logo.png` — este detectat și
 * folosit automat. Până atunci se afișează recrearea SVG (public/assets/logo.svg).
 */
export default function Logo({ height = 40 }: { height?: number }) {
  const [src, setSrc] = useState('/assets/logo.svg');

  useEffect(() => {
    const img = new Image();
    img.onload = () => setSrc('/assets/logo.png');
    img.src = '/assets/logo.png';
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="Sarami Media" style={{ height, width: 'auto' }} />
  );
}
