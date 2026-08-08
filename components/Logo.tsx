'use client';

import { useEffect, useState } from 'react';

/**
 * Logo-ul Sarami Media.
 *  1. public/assets/logo.png — logo-ul ORIGINAL complet (descărcat la build
 *     de pe Cloudinary sau urcat manual în repository) → folosit întreg.
 *  2. Dacă lipsește: ansamblu pasăre vectorială + text HTML.
 */
export default function Logo() {
  const [hasPng, setHasPng] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setHasPng(true);
    img.src = '/assets/logo.png';
  }, []);

  if (hasPng) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/assets/logo.png" alt="Sarami Media" className="logo-full" />
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
