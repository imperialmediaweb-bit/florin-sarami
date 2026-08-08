'use client';

import { useEffect, useState } from 'react';

/**
 * Logo-ul Sarami Media, ca ansamblu de calitate:
 *  - pasărea = grafica reală, decupată automat din logo la build
 *    (public/assets/logo-bird.png; fallback: pasărea SVG din favicon)
 *  - textul „Sarami Media" = HTML cu fontul site-ului → perfect clar
 *    la orice dimensiune, pe orice ecran
 * Dacă vrei altă decupare a păsării, înlocuiește public/assets/logo-bird.png.
 */
export default function Logo() {
  const [src, setSrc] = useState('/assets/favicon.svg');

  useEffect(() => {
    const img = new Image();
    img.onload = () => setSrc('/assets/logo-bird.png');
    img.src = '/assets/logo-bird.png';
  }, []);

  return (
    <span className="logo-lockup">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" aria-hidden="true" />
      <span className="logo-word">
        Sarami <b>Media</b>
      </span>
    </span>
  );
}
