import type { Metadata } from 'next';
import { getSettings } from '@/lib/settings';
import { ArrowIcon } from '@/components/Visuals';

// clipul exemplu se schimbă din admin → Setări
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: { canonical: '/editare-video/podcast-ai/' },
  title: 'Podcast AI — episoade video cu prezentatori și voci AI',
  description:
    'Episoade de podcast video cu doi prezentatori virtuali, voci naturale generate cu AI și decor de studio. Trimiți o poză și un scurt audio, noi facem tot. Pachete de la 1.799 lei.',
};

const INCLUDE = [
  { icon: '👥', text: 'Doi prezentatori virtuali (gazdă + invitat)' },
  { icon: '🎙️', text: 'Voci naturale și expresive, generate cu AI' },
  { icon: '🪑', text: 'Decor vizual de studio, modern și personalizat' },
  { icon: '📄', text: 'Scenariul și conceptul discuției, incluse' },
  { icon: '🎬', text: 'Montaj profesionist și editare completă' },
  { icon: '✨', text: 'Tranziții, efecte vizuale și corecții de pronunție' },
  { icon: '🖥️', text: 'Export final în Full HD (1080p)' },
];

const PASI = [
  { n: '1', t: 'Ne trimiți materialele', d: 'O poză și un scurt clip audio pentru fiecare dintre cele două persoane care apar în podcast.' },
  { n: '2', t: 'Construim studioul', d: 'Facem avatarele realiste, vocile naturale, decorul de studio și scenariul discuției.' },
  { n: '3', t: 'Primești episodul', d: 'Montat complet, cu efecte și corecții, exportat în Full HD, gata de publicat.' },
];

const PACHETE = [
  {
    nume: 'ESSENTIAL',
    pret: '1.799',
    durata: 'până la 15 minute',
    sub: 'Tot ce ai nevoie pentru un episod de podcast profesional.',
    lista: [
      'Doi prezentatori virtuali (gazdă + invitat)',
      'Avatar realist după persoana reală (imagine și voce)',
      'Voci naturale și expresive, generate cu AI',
      'Decor vizual de studio, modern și personalizat',
      'Scenariu și concept al discuției inclus',
      'Montaj profesionist și editare completă',
      'Tranziții și efecte vizuale',
      'Corectarea erorilor de pronunție și sincronizare',
      'Export final în Full HD (1080p)',
      'O rundă de corecturi inclusă',
      'Suport pentru mici ajustări după livrare',
    ],
  },
  {
    nume: 'PREMIUM',
    pret: '2.999',
    durata: 'până la 30 de minute',
    sub: 'Un episod complet, cu mai multă valoare și impact.',
    hot: true,
    lista: [
      'Toate serviciile din pachetul Essential',
      'Dialog mai lung, cu doi prezentatori',
      'Montaj extins și verificări suplimentare',
      'Tranziții, efecte vizuale și dinamizare conținut',
      'Corectarea erorilor de pronunție și sincronizare',
      'Export final în Full HD (1080p)',
      'O rundă de corecturi inclusă',
      'Consultanță pentru structurarea episodului',
      'Suport pentru mici ajustări după livrare',
    ],
  },
];

export default function PodcastAiPage() {
  const { whatsapp, podcastVideo } = getSettings();
  // clipul livrat cu site-ul; dacă se încarcă altul din admin → Setări, acela câștigă
  const clip = podcastVideo || '/video/podcast-ai.mp4';
  const waHref = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(
        'Bună ziua! Am văzut oferta Podcast AI și vreau să încep un episod.'
      )}`
    : '/contact/';

  return (
    <>
      {/* 1. CE OFERIM */}
      <section className="page-hero lp-top" style={{ paddingBottom: 26 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <span className="eyebrow">🎙️ Podcast AI</span>
          <h1 className="h-xl" style={{ marginBottom: 16 }}>
            Conversații care inspiră, <span className="grad-text">într-un studio virtual</span>
          </h1>
          <p className="lead">
            Episoade de podcast video cu <strong>doi prezentatori virtuali</strong>, voci naturale și
            aspect profesional — pentru companii, profesioniști și creatori de conținut.
            Tu trimiți o poză și un scurt audio pentru fiecare persoană, noi facem tot restul.
          </p>

          <div className="pod-grid mt-3">
            {INCLUDE.map(i => (
              <div className="pod-item" key={i.text}>
                <span aria-hidden="true">{i.icon}</span>
                <span>{i.text}</span>
              </div>
            ))}
          </div>

          <div className="pod-steps mt-3">
            {PASI.map(p => (
              <div className="pod-step" key={p.n}>
                <b>{p.n}</b>
                <div>
                  <strong>{p.t}</strong>
                  <span>{p.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CLIPUL EXEMPLU */}
      <section className="section-tight" style={{ paddingTop: 10 }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="center" style={{ marginBottom: 18 }}>
            <span className="eyebrow">Exemplu</span>
            <h2 className="h-lg">Așa arată <span className="grad-text">un episod</span></h2>
          </div>
          <div className="pod-video">
            <video
              src={clip}
              poster={podcastVideo ? undefined : '/video/podcast-ai-poster.jpg'}
              controls
              playsInline
              preload="none"
            />
          </div>
        </div>
      </section>

      {/* 3. PACHETE */}
      <section className="section-tight">
        <div className="container" style={{ maxWidth: 1000 }}>
          <div className="center" style={{ marginBottom: 24 }}>
            <span className="eyebrow">Pachete</span>
            <h2 className="h-lg">Alege <span className="grad-text">episodul tău</span></h2>
          </div>
          <div className="cards-2">
            {PACHETE.map(p => (
              <div
                className="card"
                key={p.nume}
                style={p.hot ? { border: '2px solid var(--blue-600)', position: 'relative' } : undefined}
              >
                {p.hot && (
                  <span style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'var(--grad-brand)', color: '#fff', fontWeight: 700, fontSize: '.78rem', padding: '5px 16px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                    ⭐ Cel mai ales
                  </span>
                )}
                <div className="pod-pret">
                  <div>
                    <h3>Podcast AI <strong>{p.nume}</strong></h3>
                    <span>{p.sub}</span>
                  </div>
                  <div className="pod-pret-val">
                    <b>{p.pret} lei</b>
                    <span>{p.durata}</span>
                  </div>
                </div>
                <ul className="pod-lista">
                  {p.lista.map(l => <li key={l}>{l}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. BUTON MARE WHATSAPP */}
      <section className="section-tight" style={{ paddingTop: 10, paddingBottom: 70 }}>
        <div className="container center" style={{ maxWidth: 760 }}>
          <h2 className="h-md" style={{ marginBottom: 8 }}>Începem episodul tău?</h2>
          <p style={{ color: 'var(--text-dim)', marginBottom: 24 }}>
            Scrie-ne pe WhatsApp — îți spunem exact ce materiale să trimiți și cât durează.
          </p>
          <a className="pod-cta" href={waHref} target="_blank" rel="noopener noreferrer">
            💬 Începe pe WhatsApp <ArrowIcon />
          </a>
          <p style={{ color: 'var(--text-faint)', fontSize: '.86rem', marginTop: 14 }}>
            Răspundem de obicei în aceeași zi lucrătoare.
          </p>
        </div>
      </section>
    </>
  );
}
