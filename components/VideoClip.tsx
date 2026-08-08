'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Afișează un clip video din public/videos/ (descărcat cu `npm run fetch:photos`).
 * Rulează pe mut, în buclă, fără controale — ca fundal viu de secțiune.
 * Dacă fișierul nu există încă, se afișează `fallback`.
 */
export default function VideoClip({
  name,
  ratio = '16 / 10',
  style,
  fallback = null,
}: {
  name: string;
  ratio?: string;
  style?: CSSProperties;
  fallback?: ReactNode;
}) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    fetch(`/videos/${name}.mp4`, { method: 'HEAD' })
      .then(r => setOk(r.ok))
      .catch(() => { /* fișier absent — rămâne fallback-ul */ });
  }, [name]);

  if (!ok) return <>{fallback}</>;

  return (
    <video
      src={`/videos/${name}.mp4`}
      autoPlay
      muted
      loop
      playsInline
      style={{
        width: '100%',
        aspectRatio: ratio,
        objectFit: 'cover',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow-glow)',
        ...style,
      }}
    />
  );
}
