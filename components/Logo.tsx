'use client';

import { useEffect, useState } from 'react';

/**
 * Logo-ul Sarami Media — ORIGINALUL, în această ordine:
 *  1. public/assets/logo.png (fișier local, dacă există în repository)
 *  2. logo-ul original de pe Cloudinary (încărcat direct în browser)
 *  3. doar dacă ambele pică: ansamblul pasăre vectorială + text HTML
 */
const CLOUDINARY_LOGO =
  'https://res.cloudinary.com/kaz6teok/image/upload/v1786184469/Screenshot_1049_mdo29q.png';

export default function Logo() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const candidate of ['/assets/logo.png', CLOUDINARY_LOGO]) {
        const ok = await new Promise<boolean>(resolve => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = candidate;
        });
        if (cancelled) return;
        if (ok) {
          setSrc(candidate);
          return;
        }
      }
      setSrc(''); // nimic disponibil → fallback vectorial
    })();
    return () => { cancelled = true; };
  }, []);

  if (src === null) return <span style={{ display: 'inline-block', width: 220, height: 74 }} />;

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="Sarami Media" className="logo-full" />
    );
  }

  return (
    <span className="logo-lockup">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/favicon.svg" alt="" aria-hidden="true" />
      <span className="logo-word">
        Sarami <b>Media</b>
      </span>
    </span>
  );
}
