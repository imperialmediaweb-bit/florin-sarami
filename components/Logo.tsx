'use client';

import { useEffect, useState } from 'react';

/**
 * Logo-ul original Sarami Media.
 * Ordinea de încărcare:
 *   1. public/assets/logo.png (dacă pui fișierul local — are prioritate)
 *   2. logo-ul original de pe Cloudinary (linkul de mai jos)
 *   3. recrearea SVG (public/assets/logo.svg) — doar ca ultimă plasă de siguranță
 * Fundalul alb al PNG-ului se topește în pastila albă prin mix-blend-mode.
 */
// e_trim taie marginile goale, e_make_transparent face fundalul alb transparent
// (transformări făcute de Cloudinary direct din URL, imaginea originală rămâne neatinsă)
const CLOUDINARY_LOGO =
  'https://res.cloudinary.com/kaz6teok/image/upload/e_trim:10/e_make_transparent:20/v1786184469/Screenshot_1049_mdo29q.png';

const SOURCES = ['/assets/logo.png', CLOUDINARY_LOGO];

export default function Logo({ height = 40 }: { height?: number }) {
  const [src, setSrc] = useState('/assets/logo.svg');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const candidate of SOURCES) {
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
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="Sarami Media" style={{ height, width: 'auto' }} />
  );
}
