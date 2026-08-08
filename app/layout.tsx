import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import ScrollFx from '@/components/ScrollFx';

export const metadata: Metadata = {
  title: {
    default: 'Sarami Media — Editare Video & Redactare Conținut',
    template: '%s — Sarami Media',
  },
  description:
    'Transformăm filmările tale în videoclipuri care atrag atenția! Editare video profesională pentru Facebook, Instagram, TikTok și YouTube + redactare de conținut scrisă de oameni reali.',
  icons: { icon: '/assets/favicon.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="bg-scene"></div>
        <div className="bg-grid"></div>
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
        <ScrollFx />
      </body>
    </html>
  );
}
