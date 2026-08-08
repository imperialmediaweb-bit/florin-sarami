'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/despre-noi', label: 'Despre noi' },
  { href: '/editare-video', label: 'Editare video', dropdown: true },
  { href: '/redactare-continut', label: 'Redactare conținut' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // închide meniul mobil la navigare
  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <Link href="/" className="nav-logo logo-pill" aria-label="Sarami Media — Acasă">
          <Logo />
        </Link>
        <button
          className={`nav-burger${open ? ' open' : ''}`}
          aria-label="Meniu"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span></span><span></span><span></span>
        </button>
        <nav className={`nav-links${open ? ' open' : ''}`}>
          {LINKS.map(l =>
            l.dropdown ? (
              <div className="nav-drop" key={l.href}>
                <Link href={l.href} className={isActive(l.href) || pathname.startsWith('/portofoliu') ? 'active' : ''}>
                  {l.label}
                </Link>
                <div className="nav-drop-menu">
                  <Link href="/editare-video">Servicii editare video</Link>
                  <Link href="/portofoliu">Portofoliu</Link>
                </div>
              </div>
            ) : (
              <Link key={l.href} href={l.href} className={isActive(l.href) ? 'active' : ''}>
                {l.label}
              </Link>
            )
          )}
          <Link href="/contact" className="nav-cta">Cere ofertă</Link>
        </nav>
      </div>
    </header>
  );
}
