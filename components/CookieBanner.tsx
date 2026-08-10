'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const KEY = 'sarami-cookie-consent';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch { /* storage indisponibil */ }
  }, []);

  const choose = (value: string) => {
    try { localStorage.setItem(KEY, value); } catch { /* ignoră */ }
    // anunță restul site-ului (ex: Google Analytics pornește doar după „Accept")
    window.dispatchEvent(new CustomEvent('sm-consent', { detail: value }));
    setShow(false);
  };

  if (!show) return null;

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
