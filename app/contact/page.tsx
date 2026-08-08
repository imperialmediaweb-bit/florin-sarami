import type { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import Faq from '@/components/Faq';
import { getSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contactează Sarami Media pentru editare video și redactare de conținut. Trimite-ne un mesaj și primești rapid o ofertă personalizată.',
};

// datele de contact se administrează din /admin → Setări și apar instant
export const dynamic = 'force-dynamic';

const INFO_FAQ = [
  {
    q: 'Ce să includ în mesaj ca să primesc o ofertă rapidă?',
    a: 'Spune-ne pe scurt: ce tip de proiect ai (video sau conținut scris), ce materiale existente ai (durata filmărilor brute, subiectele articolelor), pentru ce platformă și care e termenul dorit. Cu aceste detalii, îți putem trimite o ofertă precisă din primul răspuns.',
  },
  {
    q: 'Cât de repede răspundeți?',
    a: 'De obicei în aceeași zi lucrătoare, de multe ori în câteva ore. Mesajele trimise în weekend primesc răspuns cel târziu luni dimineața.',
  },
  {
    q: 'Cum plătesc?',
    a: 'Emitem factură și acceptăm plata prin transfer bancar. Pentru proiecte mari, se poate lucra cu avans și rest la livrare — detaliile le stabilim împreună în ofertă.',
  },
];

export default function ContactPage() {
  const s = getSettings();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs reveal in">
            <Link href="/">Home</Link>
            <span>Contact</span>
          </div>
          <span className="eyebrow">Hai să vorbim</span>
          <h1 className="h-xl">Ai un proiect? <span className="grad-text">Contactează-ne!</span></h1>
          <p className="lead">Suntem gata să transformăm materialele tale într-un conținut care face diferența. Scrie-ne și revenim cu un răspuns cât mai rapid.</p>
          <div className="btn-row mt-2" style={{ justifyContent: 'center' }}>
            <Link href="/brief-video" className="btn btn-ghost">🎬 Brief proiect video</Link>
            <Link href="/brief-continut" className="btn btn-ghost">✍️ Brief conținut scris</Link>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="split" style={{ alignItems: 'start' }}>
            <div className="form-card reveal-left">
              <h2 className="h-md mb-2">Trimite-ne un mesaj</h2>
              <ContactForm />
            </div>

            <div className="reveal-right">
              <div className="contact-info">
                <div className="card" style={{ padding: 28 }}>
                  <div className="contact-line">
                    <div className="card-icon">
                      <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
                    </div>
                    <div>
                      <b>Email</b>
                      <a href={`mailto:${s.email}`}>{s.email}</a>
                    </div>
                  </div>
                </div>
                <div className="card" style={{ padding: 28 }}>
                  <div className="contact-line">
                    <div className="card-icon">
                      <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </div>
                    <div>
                      <b>Telefon</b>
                      <a href={`tel:${s.telefon.replace(/\s/g, '')}`}>{s.telefon}</a>
                    </div>
                  </div>
                </div>
                <div className="card" style={{ padding: 28 }}>
                  <div className="contact-line">
                    <div className="card-icon">
                      <svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M9 13h1M9 17h1M14 9h1M14 13h1M14 17h1" /></svg>
                    </div>
                    <div>
                      <b>Date firmă</b>
                      <span>
                        {s.firma}<br />
                        CUI: {s.cui}<br />
                        Reg. Com.: {s.regcom}<br />
                        Sediu: {s.adresa}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card" style={{ padding: 28 }}>
                  <div className="contact-line">
                    <div className="card-icon">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    </div>
                    <div>
                      <b>Program</b>
                      <span>{s.program}<br />Răspundem rapid și în weekend la mesaje.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Înainte să ne scrii</span>
            <h2 className="h-lg">Bine de <span className="grad-text">știut</span></h2>
          </div>
          <Faq items={INFO_FAQ} />
        </div>
      </section>
    </>
  );
}
