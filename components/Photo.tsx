'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

/**
 * Afișează o poză din public/photos/ (descărcată cu `npm run fetch:photos`).
 * Dacă fișierul nu există încă, componenta nu afișează nimic — secțiunile
 * arată bine și fără poze.
 */
export default function Photo({
  name,
  alt,
  ratio = '16 / 10',
  style,
}: {
  name: string;
  alt: string;
  ratio?: string;
  style?: CSSProperties;
}) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setOk(true);
    img.src = `/photos/${name}.jpg`;
  }, [name]);

  if (!ok) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/photos/${name}.jpg`}
      alt={alt}
      loading="lazy"
      style={{
        width: '100%',
        aspectRatio: ratio,
        objectFit: 'cover',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow-soft)',
        ...style,
      }}
    />
  );
}
