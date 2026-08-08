import type { Metadata } from 'next';
import Link from 'next/link';
import BriefForm from '@/components/BriefForm';

export const metadata: Metadata = {
  title: 'Brief conținut scris',
  description: 'Completează brief-ul pentru articole de blog, descrieri de produse sau alte materiale scrise — 100% Human Written la cerere — și primești rapid o ofertă.',
};

export default function BriefContinutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs reveal in">
            <Link href="/">Home</Link>
            <span><Link href="/redactare-continut">Redactare conținut</Link></span>
            <span>Brief</span>
          </div>
          <span className="eyebrow">✍️ Brief conținut scris</span>
          <h1 className="h-xl">Spune-ne despre <span className="grad-text">conținutul de care ai nevoie</span></h1>
          <p className="lead">Câteva detalii ne ajută să-ți trimitem o ofertă exactă — durează 2 minute. Primești răspuns de obicei în aceeași zi.</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="form-card reveal in">
            <BriefForm
              formular="Brief conținut"
              serviciu="Redactare conținut"
              mesajLabel="Detalii despre proiect *"
              mesajPlaceholder="Despre ce e afacerea ta? Ce subiecte vrei acoperite? Există site-uri/concurenți de referință?"
              fields={[
                {
                  name: 'tip', label: 'Tipul de conținut *', type: 'checkboxes',
                  options: ['Articole de blog', 'Descrieri de produse', 'Pagini de prezentare', 'Comunicate de presă', 'Advertoriale', 'Altceva'],
                },
                { name: 'domeniu', label: 'Domeniul / nișa afacerii *', type: 'text', required: true, placeholder: 'ex: e-commerce fashion, stomatologie, construcții' },
                { name: 'volum', label: 'Volum estimat', type: 'text', placeholder: 'ex: 4 articole/lună sau 50 descrieri produse' },
                { name: 'lungime', label: 'Lungime dorită per material', type: 'text', placeholder: 'ex: ~800 cuvinte / nu știu' },
                {
                  name: 'uman', label: 'Vrei conținut scris integral de oameni (100% Human Written)?', type: 'select',
                  options: ['Da, exclusiv de oameni reali', 'Nu am preferință'],
                },
                {
                  name: 'termen', label: 'Termenul dorit', type: 'select',
                  options: ['Urgent (2-3 zile)', 'Săptămâna aceasta', '1-2 săptămâni', 'Colaborare lunară, pe termen lung'],
                },
                {
                  name: 'buget', label: 'Buget estimativ', type: 'select',
                  options: ['Sub 500 lei', '500 – 1.500 lei', '1.500 – 5.000 lei', 'Peste 5.000 lei', 'Nu știu încă — vreau ofertă'],
                },
                { name: 'cuvinte', label: 'Cuvinte-cheie vizate (dacă le știi)', type: 'text', placeholder: 'ex: servicii contabilitate București', full: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
