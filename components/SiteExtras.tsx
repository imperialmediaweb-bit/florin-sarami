'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Extra-urile activate din /admin → Setări:
 *  - bara de anunț/promoție (câmpul „anunt" — gol = ascunsă)
 *  - butonul plutitor de WhatsApp (câmpul „whatsapp" — gol = ascuns)
 *  - Google Analytics 4 (câmpul „ga" — pornește DOAR după „Accept" la cookies)
 */
export default function SiteExtras() {
  const pathname = usePathname();
  const [info, setInfo] = useState<{ whatsapp?: string; anunt?: string; ga?: string; fbpixel?: string }>({});
  const [consent, setConsent] = useState('');
  // pixelul trimite singur un PageView la init — efectul de rută îl sare
  // exact o dată, imediat după init, ca pagina de intrare să nu se numere dublu
  const fbqJustInit = useRef(false);
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    fetch('/api/site-info/')
      .then(r => r.json())
      .then(setInfo)
      .catch(() => { /* fără extra-uri dacă cererea pică */ });
  }, []);

  // consimțământul de cookies: citit la pornire + actualizat live când
  // vizitatorul apasă Accept/Refuz în banner (evenimentul „sm-consent")
  useEffect(() => {
    try {
      setConsent(localStorage.getItem('sarami-cookie-consent') || '');
    } catch { /* storage indisponibil */ }
    const onConsent = (e: Event) => setConsent(String((e as CustomEvent).detail || ''));
    window.addEventListener('sm-consent', onConsent);
    return () => window.removeEventListener('sm-consent', onConsent);
  }, []);

  // Google Analytics 4 — doar cu consimțământ, niciodată în panoul de admin
  useEffect(() => {
    const ga = info.ga;
    if (!ga || !/^G-[A-Z0-9]{4,20}$/.test(ga)) return;
    if (isAdmin || consent !== 'accepted') return;
    if (document.getElementById('ga-loader')) return;
    const s = document.createElement('script');
    s.id = 'ga-loader';
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${ga}`;
    document.head.appendChild(s);
    const init = document.createElement('script');
    init.id = 'ga-init';
    // send_page_view:false — page_view-urile le trimitem noi, la fiecare rută,
    // altfel prima pagină s-ar număra de două ori
    init.textContent =
      `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}` +
      `gtag('js',new Date());gtag('config','${ga}',{send_page_view:false});`;
    document.head.appendChild(init);
  }, [info.ga, consent, isAdmin]);

  // Meta/Facebook Pixel — la fel: doar cu consimțământ, niciodată în admin
  useEffect(() => {
    const px = info.fbpixel;
    if (!px || !/^[0-9]{5,20}$/.test(px)) return;
    if (isAdmin || consent !== 'accepted') return;
    if (document.getElementById('fb-pixel')) return;
    const s = document.createElement('script');
    s.id = 'fb-pixel';
    // scriptul oficial Meta Pixel; PageView-urile le trimitem noi, per rută
    s.textContent =
      `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?` +
      `n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;` +
      `n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;` +
      `t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}` +
      `(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');` +
      `fbq('init','${px}');fbq('track','PageView');`;
    document.head.appendChild(s);
    fbqJustInit.current = true;
  }, [info.fbpixel, consent, isAdmin]);

  // navigările din site sunt fără reîncărcare de pagină — trimitem manual
  // câte un page_view la fiecare schimbare de rută (Google + Meta)
  useEffect(() => {
    if (isAdmin || consent !== 'accepted') return;
    const w = window as unknown as { gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void };
    if (info.ga && w.gtag) {
      w.gtag('event', 'page_view', { page_path: pathname });
    }
    if (info.fbpixel && w.fbq) {
      if (fbqJustInit.current) fbqJustInit.current = false; // init-ul tocmai a trimis PageView
      else w.fbq('track', 'PageView');
    }
  }, [pathname, info.ga, info.fbpixel, consent, isAdmin]);

  // fallback pentru browserele fără suport CSS :has() — clasa de pe <body>
  // împinge meniul și conținutul sub bara de anunț
  const showAnnounce = Boolean(info.anunt) && !isAdmin;
  useEffect(() => {
    document.body.classList.toggle('has-announce', showAnnounce);
    return () => document.body.classList.remove('has-announce');
  }, [showAnnounce]);

  if (isAdmin) return null;

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
