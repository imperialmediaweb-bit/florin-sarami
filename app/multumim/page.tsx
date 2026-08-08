import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mulțumim!',
  robots: { index: false },
};

export default function MultumimPage() {
  return (
    <section className="page-hero" style={{ padding: '130px 0 90px' }}>
      <div className="container center">
        <span className="eyebrow">Mesaj trimis cu succes</span>
        <h1 className="h-xl">Mulțumim! 🎉</h1>
        <p className="lead">Am primit mesajul tău și revenim cu un răspuns cât mai curând — de obicei în aceeași zi lucrătoare.</p>
        <div className="btn-row mt-3" style={{ justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary">Înapoi la pagina principală</Link>
          <Link href="/portofoliu" className="btn btn-ghost">Vezi portofoliul între timp</Link>
        </div>
      </div>
    </section>
  );
}
