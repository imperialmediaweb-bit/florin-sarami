'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const KEY = 'sarami-cookie-consent';

// 18.10.2026 — pe paginile cu formularul de brief bannerul stătea peste
// formular. Acolo nu-l mai afișăm: acordul se dă doar prin bifa opțională
// de sub formular (BriefForm), iar fără ea nu pornește niciun cookie.
const FARA_BANNER = ['/oferta-video', '/brief-video', '/brief-continut'];

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const pathname = usePathname() || '';
  const ascuns = FARA_BANNER.some(p => pathname.startsWith(p));

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch { /* storage indisponibil */ }
    // acordul poate veni și din bifa de sub formularul de brief — bannerul dispare
    const onConsent = () => setShow(false);
    window.addEventListener('sm-consent', onConsent);
    return () => window.removeEventListener('sm-consent', onConsent);
  }, []);

  const choose = (value: string) => {
    try { localStorage.setItem(KEY, value); } catch { /* ignoră */ }
    // anunță restul site-ului (ex: Google Analytics pornește doar după „Accept")
    window.dispatchEvent(new CustomEvent('sm-consent', { detail: value }));
    setShow(false);
  };

  // pe telefon, bannerul fix stătea peste butonul „Trimite brief-ul" de la
  // finalul formularului — cât e afișat, lăsăm loc dedesubt ca pagina să se
  // poată derula până deasupra lui
  useEffect(() => {
    if (!show || ascuns) return;
    const prev = document.body.style.paddingBottom;
    document.body.style.paddingBottom = '180px';
    return () => { document.body.style.paddingBottom = prev; };
  }, [show, ascuns]);

  if (!show || ascuns) return null;

  return (
    <div className="cookie-banner show" role="dialog" aria-label="Consimțământ cookies">
      <p>
        🍪 Folosim cookies pentru a-ți oferi cea mai bună experiență pe site. Poți afla mai
        multe în <Link href="/politica-cookies">Politica de cookies</Link>.
      </p>
      <div className="cookie-actions">
        <button className="btn btn-primary" onClick={() => choose('accepted')}>Accept</button>
        <button className="btn btn-ghost" onClick={() => choose('rejected')}>Refuz</button>
      </div>
    </div>
  );
}
