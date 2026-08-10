'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Extra-urile activate din /admin → Setări:
 *  - bara de anunț/promoție (câmpul „anunt" — gol = ascunsă)
 *  - butonul plutitor de WhatsApp (câmpul „whatsapp" — gol = ascuns)
 */
export default function SiteExtras() {
  const pathname = usePathname();
  const [info, setInfo] = useState<{ whatsapp?: string; anunt?: string; ga?: string }>({});

  useEffect(() => {
    fetch('/api/site-info/')
      .then(r => r.json())
      .then(setInfo)
      .catch(() => { /* fără extra-uri dacă cererea pică */ });
  }, []);

  // Google Analytics 4 — pornit din /admin → Setări (Measurement ID)
  useEffect(() => {
    const ga = info.ga;
    if (!ga || !/^G-[A-Z0-9]{4,20}$/.test(ga) || document.getElementById('ga-loader')) return;
    const s = document.createElement('script');
    s.id = 'ga-loader';
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${ga}`;
    document.head.appendChild(s);
    const init = document.createElement('script');
    init.id = 'ga-init';
    init.textContent =
      `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
      `gtag('js',new Date());gtag('config','${ga}');`;
    document.head.appendChild(init);
  }, [info.ga]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {info.anunt && (
        <div className="announce-bar">
          <span>{info.anunt}</span>
        </div>
      )}
      {info.whatsapp && (
        <a
          className="wa-btn"
          href={`https://wa.me/${info.whatsapp}?text=${encodeURIComponent('Bună! Am o întrebare despre serviciile Sarami Media.')}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Scrie-ne pe WhatsApp"
          title="Scrie-ne pe WhatsApp"
        >
          <svg viewBox="0 0 32 32" width="30" height="30" fill="#fff" aria-hidden="true">
            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.25.622 4.354 1.7 6.152L4 29l8.05-1.66A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 21.9c-1.86 0-3.6-.51-5.09-1.4l-.36-.21-4.78.99 1-4.66-.23-.38A9.86 9.86 0 0 1 6.1 15c0-5.46 4.44-9.9 9.9-9.9s9.9 4.44 9.9 9.9-4.44 9.9-9.9 9.9zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/>
          </svg>
        </a>
      )}
    </>
  );
}
