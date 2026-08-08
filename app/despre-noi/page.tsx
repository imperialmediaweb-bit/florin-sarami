import type { Metadata } from 'next';
import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import MediaCard from '@/components/MediaCard';
import Photo from '@/components/Photo';
import { ArrowIcon } from '@/components/Visuals';

export const metadata: Metadata = {
  alternates: { canonical: '/despre-noi/' },
  title: 'Despre noi',
  description:
    'Sarami Media — din 2020 în domeniul creării de conținut. Editare video profesională și redactare de conținut pentru branduri care vor să iasă în evidență.',
};

const TIMELINE = [
  { year: '2020', title: 'Începutul', desc: 'Primele proiecte de editare video pentru clienți locali. Pasiunea devine meserie.' },
  { year: '2021', title: 'Creștem echipa', desc: 'Se alătură primii colaboratori și extindem serviciile spre podcasturi și clipuri social media.' },
  { year: '2022', title: 'Conținut scris', desc: 'Lansăm serviciile de redactare: articole de blog, descrieri de produse și texte de site.' },
  { year: '2024', title: '100+ clienți', desc: 'Depășim pragul de 100 de clienți mulțumiți și sute de proiecte livrate.' },
  { year: 'Azi', title: 'Povestea continuă', desc: 'Creăm zilnic conținut care atrage atenția — poate următorul proiect e chiar al tău.' },
];

const VALUES = [
  {
    title: 'Calitate fără compromis',
    desc: 'Nu livrăm nimic ce nu am publica cu mândrie sub numele nostru. Fiecare proiect trece prin verificări atente înainte să ajungă la tine.',
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
  {
    title: 'Prețuri corecte',
    desc: 'Adaptate fiecărui proiect. Fără costuri ascunse, fără pachete umflate — plătești exact pentru ce ai nevoie.',
    icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  },
  {
    title: 'Respect pentru termene',
    desc: 'Când promitem o dată de livrare, ne ținem de ea. Timpul tău e la fel de valoros ca al nostru.',
    icon: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  },
  {
    title: 'Parteneriat real',
    desc: 'Nu suntem doar un furnizor — ne pasă de rezultatele tale. Succesul clienților noștri este cea mai bună reclamă a noastră.',
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  },
];

export default function DespreNoiPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs reveal in">
            <Link href="/">Home</Link>
            <span>Despre noi</span>
          </div>
          <span className="eyebrow">Povestea noastră</span>
          <h1 className="h-xl">Creăm conținut <span className="grad-text">din 2020</span></h1>
          <p className="lead">Sarami Media a pornit dintr-o pasiune simplă: aceea de a spune povești care prind viață pe ecran și pe hârtie. Astăzi, ajutăm branduri din toată România să comunice mai bine.</p>
        </div>
      </section>

      {/* Poza echipei (apare după `npm run fetch:photos`) */}
      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="reveal in">
            <MediaCard photo="team" tag="Din 2020" title="Echipa Sarami Media, la lucru" ratio="21 / 8" />
          </div>
        </div>
      </section>

      {/* Poveste + timeline */}
      <section className="section-tight">
        <div className="container">
          <div className="split">
            <div className="reveal-left">
              <h2 className="h-lg">Cine <span className="grad-text">suntem</span></h2>
              <p style={{ color: 'var(--text-dim)', marginBottom: 16 }}>Suntem o echipă de editori video și redactori care cred că un conținut bun nu se întâmplă din întâmplare. Din 2020, lucrăm cu antreprenori, creatori de conținut și companii care înțeleg că atenția publicului se câștigă — nu se cumpără.</p>
              <p style={{ color: 'var(--text-dim)', marginBottom: 16 }}>Am început cu montaj video pentru câțiva clienți locali. Rezultatele au adus recomandări, recomandările au adus proiecte tot mai diverse: podcasturi, campanii social media, evenimente, iar apoi și partea de conținut scris — articole, descrieri de produse, texte de site.</p>
              <p style={{ color: 'var(--text-dim)' }}>Astăzi acoperim tot ce înseamnă creare de conținut: de la primul cadru filmat până la ultimul cuvânt scris. Iar principiul a rămas același din prima zi: <strong style={{ color: 'var(--text-main)' }}>prețuri corecte, adaptate fiecărui proiect, și lucru făcut ca la carte.</strong></p>
              <div className="btn-row mt-3">
                <Link href="/portofoliu" className="btn btn-primary">Vezi ce am creat <ArrowIcon /></Link>
                <Link href="/contact" className="btn btn-ghost">Hai să ne cunoaștem</Link>
              </div>
            </div>
            <div className="reveal-right">
              <div className="timeline">
                {TIMELINE.map(t => (
                  <div className="tl-item" key={t.year}>
                    <span className="tl-year">{t.year}</span>
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fondatorul */}
      <section className="section-tight">
        <div className="container">
          <div className="card reveal" style={{ padding: 'clamp(28px, 4vw, 48px)' }}>
            <div className="split" style={{ gridTemplateColumns: 'auto 1fr', gap: 'clamp(24px, 4vw, 48px)' }}>
              <div style={{ width: 'min(220px, 40vw)' }}>
                <Photo
                  name="fondator"
                  alt="Fondatorul Sarami Media"
                  ratio="1 / 1"
                  style={{ borderRadius: '50%' }}
                  fallback={
                    <div
                      className="testi-avatar"
                      style={{ width: 'min(180px, 36vw)', height: 'min(180px, 36vw)', fontSize: '3rem' }}
                    >
                      SM
                    </div>
                  }
                />
              </div>
              <div>
                <span className="eyebrow">Omul din spatele Sarami Media</span>
                <h2 className="h-md">Experiență, nu promisiuni</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: 12 }}>
                  În spatele Sarami Media stă o experiență de <strong style={{ color: 'var(--text-main)' }}>peste 17 ani în copywriting</strong> și
                  ani buni de <strong style={{ color: 'var(--text-main)' }}>editare video</strong> — mii de articole scrise, sute de clipuri montate
                  și o pasiune care nu s-a stins din prima zi.
                </p>
                <p style={{ color: 'var(--text-dim)' }}>
                  Fiecare proiect care iese pe ușa noastră trece prin ochii cuiva care face meseria asta de aproape două decenii.
                  De aceea ne permitem să punem calitatea pe primul loc — la fel ca originalitatea fiecărui material.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistici */}
      <section className="section-tight">
        <div className="container">
          <div className="stats reveal">
            <div className="stat"><b data-count="17" data-suffix="+">0</b><span>Ani de experiență în copywriting</span></div>
            <div className="stat"><b data-count="500" data-suffix="+">0</b><span>Proiecte livrate</span></div>
            <div className="stat"><b data-count="100" data-suffix="+">0</b><span>Clienți mulțumiți</span></div>
            <div className="stat"><b data-count="10" data-suffix="+">0</b><span>Domenii acoperite</span></div>
          </div>
        </div>
      </section>

      {/* Valori */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Valorile noastre</span>
            <h2 className="h-lg">În ce <span className="grad-text">credem</span></h2>
          </div>
          <div className="cards-2 mt-3">
            {VALUES.map((v, i) => (
              <div className={`value-pill reveal d${i + 1}`} key={v.title}>
                <div className="card-icon"><svg viewBox="0 0 24 24">{v.icon}</svg></div>
                <div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Hai să lucrăm împreună"
        text="Ai un proiect video sau ai nevoie de conținut scris? Povestește-ne despre el — răspundem rapid."
      />
    </>
  );
}
