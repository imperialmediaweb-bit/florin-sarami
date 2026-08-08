import type { Metadata } from 'next';
import Link from 'next/link';
import BriefForm from '@/components/BriefForm';

export const metadata: Metadata = {
  title: 'Brief proiect video',
  description: 'Completează brief-ul pentru proiectul tău de editare video și primești rapid o ofertă personalizată de la Sarami Media.',
};

export default function BriefVideoPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs reveal in">
            <Link href="/">Home</Link>
            <span><Link href="/editare-video">Editare video</Link></span>
            <span>Brief</span>
          </div>
          <span className="eyebrow">🎬 Brief proiect video</span>
          <h1 className="h-xl">Spune-ne despre <span className="grad-text">proiectul tău video</span></h1>
          <p className="lead">Cu cât știm mai multe, cu atât oferta e mai precisă — durează 2 minute. Primești răspuns de obicei în aceeași zi.</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="form-card reveal in">
            <BriefForm
              formular="Brief video"
              serviciu="Editare video"
              mesajLabel="Obiectivul proiectului *"
              mesajPlaceholder="Ce vrei să obții cu acest clip? Cui i se adresează? Există exemple de clipuri care îți plac?"
              fields={[
                {
                  name: 'tip', label: 'Tipul proiectului *', type: 'select', required: true,
                  options: ['Clipuri social media (Reels/TikTok/Shorts)', 'Videoclip promoțional / prezentare', 'Podcast', 'Interviu / eveniment', 'Clip de lungă durată (vlog, curs, documentar)', 'Altceva'],
                },
                {
                  name: 'platforme', label: 'Pe ce platforme publici?', type: 'checkboxes',
                  options: ['Facebook', 'Instagram', 'TikTok', 'YouTube', 'Site propriu', 'Altele'],
                },
                { name: 'durata_brut', label: 'Durata materialului brut (aprox.)', type: 'text', placeholder: 'ex: 2 ore de filmare' },
                { name: 'durata_final', label: 'Durata dorită a clipului final', type: 'text', placeholder: 'ex: 60 secunde / 15 minute' },
                {
                  name: 'termen', label: 'Termenul dorit', type: 'select',
                  options: ['Urgent (1-2 zile)', 'Săptămâna aceasta', '1-2 săptămâni', 'Flexibil'],
                },
                {
                  name: 'buget', label: 'Buget estimativ', type: 'select',
                  options: ['Sub 500 lei', '500 – 1.500 lei', '1.500 – 5.000 lei', 'Peste 5.000 lei', 'Nu știu încă — vreau ofertă'],
                },
                { name: 'materiale', label: 'Link către materiale (Drive/WeTransfer, dacă ai)', type: 'text', placeholder: 'https://...', full: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
