'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Vitrină media: poză sau clip video din public/photos | public/videos,
 * încadrată cu overlay în gradient, etichetă și titlu — nimic „aruncat".
 * Dacă fișierul nu există încă, se afișează `fallback` (mockup-urile animate).
 */
export default function MediaCard({
  photo,
  video,
  tag,
  title,
  alt,
  ratio = '16 / 10',
  style,
  fallback = null,
}: {
  photo?: string;
  video?: string;
  tag?: string;
  title: string;
  alt?: string;
  ratio?: string;
  style?: CSSProperties;
  fallback?: ReactNode;
}) {
  const [src, setSrc] = useState<{ kind: 'video' | 'photo'; url: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (video) {
        try {
          const r = await fetch(`/videos/${video}.mp4`, { method: 'HEAD' });
          if (!cancelled && r.ok) { setSrc({ kind: 'video', url: `/videos/${video}.mp4` }); return; }
        } catch { /* continuă cu poza */ }
      }
      if (photo) {
        const ok = await new Promise<boolean>(resolve => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = `/photos/${photo}.jpg`;
        });
        if (!cancelled && ok) setSrc({ kind: 'photo', url: `/photos/${photo}.jpg` });
      }
    })();
    return () => { cancelled = true; };
  }, [photo, video]);

  if (!src) return <>{fallback}</>;

  return (
    <figure className="media-card" style={{ aspectRatio: ratio, ...style }}>
      {src.kind === 'video' ? (
        <video src={src.url} autoPlay muted loop playsInline />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src.url} alt={alt || title} loading="lazy" />
      )}
      <figcaption className="media-caption">
        {tag && <span className="media-tag">{tag}</span>}
        <span className="media-title" style={{ display: 'block' }}>{title}</span>
      </figcaption>
    </figure>
  );
}
