import type { Metadata } from 'next';
import Link from 'next/link';
import BriefForm from '@/components/BriefForm';
import Testimonials from '@/components/Testimonials';
import { getTestimonials } from '@/lib/testimonials';
import { ArrowIcon } from '@/components/Visuals';

// testimonialele vin din admin — pagina se generează la cerere
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: { canonical: '/oferta-video/' },
  title: 'Primul tău Reel editat GRATUIT — Editare video Sarami Media',
  description:
    'Trimite-ne o filmare brută și primești înapoi un Reel editat complet, gratuit — subtitrări dinamice, montaj alert, gata de postat. Vezi calitatea înainte să plătești un leu.',
};

const BENEFITS = [
  { icon: '✂️', title: 'Montaj care ține atenția', desc: 'Tăiem tot ce plictisește. Ritm alert, hook puternic în primele 2 secunde — exact ce cere algoritmul.' },
  { icon: '💬', title: 'Subtitrări dinamice', desc: '85% din clipuri rulează pe mut. Subtitrările animate îți păstrează privitorii până la final.' },
  { icon: '🎨', title: 'Culoare premium', desc: 'Color grading care transformă filmarea „de telefon" într-un clip cu aspect profesionist.' },
  { icon: '🔊', title: 'Sunet curat + muzică', desc: 'Zgomot eliminat, voce clară, muzică licențiată aleasă pe tonul brandului tău.' },
  { icon: '📱', title: 'Format perfect per platformă', desc: '9:16 pentru Reels & TikTok, 1:1 sau 4:5 pentru feed — export la calitate maximă.' },
  { icon: '♻️', title: 'Revizii incluse', desc: 'Nu e bine din prima? Ajustăm până ești mulțumit. Lucrăm până iese exact cum vrei.' },
];

const STEPS = [
  { n: '1', title: 'Completezi formularul', desc: '2 minute, aici mai jos. Ne spui ce afacere ai și ce filmări există.' },
  { n: '2', title: 'Primești răspuns azi', desc: 'Îți scriem în aceeași zi lucrătoare și stabilim ce clip edităm de probă.' },
  { n: '3', title: 'Primești Reel-ul gratuit', desc: 'În 48h ai clipul editat, gata de postat. Îți place? Lucrăm împreună. Nu? Rămâi cu clipul.' },
];

const FAQ = [
  { q: 'Chiar e gratuit clipul de probă?', a: 'Da, 100%. Fără card, fără abonament, fără obligații. E felul nostru de a-ți arăta calitatea înainte să ne dai un leu. Clipul rămâne al tău orice ai decide.' },
  { q: 'Cât costă după, dacă vreau să continui?', a: 'Depinde de câte clipuri vrei pe lună și de complexitate — de aceea primești o ofertă personalizată, nu un preț de-a gata. Pachetele lunare au prețuri avantajoase.' },
  { q: 'Nu am filmări. Mă puteți ajuta?', a: 'Da — îți spunem exact ce și cum să filmezi cu telefonul (e mai simplu decât crezi), iar noi facem restul: montaj, subtitrări, culoare, sunet.' },
];

export default function OfertaVideoPage() {
  return (
    <>
      {/* HERO */}
      <section className="page-hero" style={{ paddingBottom: 30 }}>
        <div className="container">
          <span className="eyebrow">🎬 Pentru afaceri și creatori care vor clienți din social media</span>
          <h1 className="h-xl">
            Reels-uri care <span className="grad-text">opresc scroll-ul</span><br />— editate de profesioniști
          </h1>
          <p className="lead">
            Tu filmezi cu telefonul. Noi transformăm filmarea în clipuri care atrag urmăritori și aduc
            clienți: montaj alert, subtitrări dinamice, culoare premium — gata de postat.
          </p>
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 26 }}>
            <a href="#brief" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '16px 34px' }}>
              🎁 Vreau clipul meu de probă GRATUIT <ArrowIcon />
            </a>
          </div>
          <p style={{ color: 'var(--text-faint)', fontSize: '.88rem', marginTop: 12 }}>
            Fără plată. Fără obligații. Răspundem în aceeași zi lucrătoare.
          </p>
          <div className="stats" style={{ marginTop: 44 }}>
            <div className="stat"><b>17+</b><span>ani de experiență în conținut</span></div>
            <div className="stat"><b>500+</b><span>proiecte livrate</span></div>
            <div className="stat"><b>100+</b><span>clienți mulțumiți</span></div>
            <div className="stat"><b>48h</b><span>livrarea clipului de probă</span></div>
          </div>
        </div>
      </section>

      {/* OFERTA */}
      <section className="section-tight" id="oferta">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="card reveal in" style={{ padding: 'clamp(30px, 5vw, 52px)', textAlign: 'center', border: '2px solid var(--blue-600)' }}>
            <span className="eyebrow">Oferta de lansare</span>
            <h2 className="h-lg" style={{ marginBottom: 14 }}>
              Primul tău Reel — <span className="grad-text">editat GRATUIT</span>
            </h2>
            <p style={{ color: 'var(--text-dim)', maxWidth: 620, margin: '0 auto 22px' }}>
              Ne trimiți o filmare brută (chiar și de pe telefon), iar noi ți-o transformăm într-un clip
              editat complet — subtitrări, montaj, culoare, sunet — <strong style={{ color: 'var(--text-main)' }}>cadou</strong>.
              Așa vezi exact ce primești, înainte să plătești ceva.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 26 }}>
              {['✅ 0 lei — fără card, fără abonament', '✅ Livrat în 48 de ore', '✅ Clipul rămâne al tău, orice ai decide'].map(t => (
                <span key={t} style={{ background: 'rgba(37,99,235,.08)', color: 'var(--blue-700)', fontWeight: 600, fontSize: '.9rem', padding: '9px 18px', borderRadius: 999 }}>{t}</span>
              ))}
            </div>
            <a href="#brief" className="btn btn-primary" style={{ fontSize: '1rem', padding: '15px 32px' }}>
              Îmi rezerv clipul de probă <ArrowIcon />
            </a>
            <p style={{ color: 'var(--text-faint)', fontSize: '.84rem', marginTop: 14 }}>
              ⏳ Ca să livrăm rapid, luăm un număr limitat de clipuri de probă în fiecare lună.
            </p>
          </div>
        </div>
      </section>

      {/* CE PRIMEȘTI */}
      <section className="section-tight">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Ce primești în fiecare clip</span>
            <h2 className="h-lg">Editare completă, <span className="grad-text">nu doar „tăiat cadre"</span></h2>
          </div>
          <div className="cards-3 mt-3">
            {BENEFITS.map((b, i) => (
              <div className={`card reveal d${(i % 3) + 1}`} key={b.title}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>{b.icon}</div>
                <h3 style={{ fontSize: '1.08rem', marginBottom: 8 }}>{b.title}</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '.94rem' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAȘI */}
      <section className="section-tight">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Cum funcționează</span>
            <h2 className="h-lg">De la formular la clip, în <span className="grad-text">3 pași</span></h2>
          </div>
          <div className="steps three mt-3">
            {STEPS.map((s, i) => (
              <div className={`step reveal d${i + 1}`} key={s.n}>
                <span className="step-num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALE */}
      <section className="section-tight">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Ce spun clienții</span>
            <h2 className="h-lg">Rezultate, <span className="grad-text">nu promisiuni</span></h2>
          </div>
          <Testimonials items={getTestimonials()} />
          <p className="center" style={{ marginTop: 18 }}>
            <Link href="/portofoliu" target="_blank" style={{ color: 'var(--blue-600)', fontWeight: 600 }}>
              ▶ Vezi exemple din portofoliu (se deschide separat)
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-tight">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="center reveal">
            <span className="eyebrow">Întrebări frecvente</span>
            <h2 className="h-lg">Pe scurt, <span className="grad-text">fără ocolișuri</span></h2>
          </div>
          <div style={{ display: 'grid', gap: 14, marginTop: 30 }}>
            {FAQ.map(f => (
              <div className="card reveal" key={f.q} style={{ padding: '22px 26px' }}>
                <h3 style={{ fontSize: '1.04rem', marginBottom: 8 }}>{f.q}</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '.95rem' }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULARUL — direct pe pagină, nimeni nu pleacă nicăieri */}
      <section className="section" id="brief">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="center reveal in">
            <span className="eyebrow">🎁 Pasul 1 din 3</span>
            <h2 className="h-lg">Rezervă-ți clipul de probă <span className="grad-text">gratuit</span></h2>
            <p className="lead" style={{ marginBottom: 30 }}>
              Durează 2 minute. Primești răspuns în aceeași zi lucrătoare — fără spam, fără telefoane insistente.
            </p>
          </div>
          <div className="form-card reveal in">
            <BriefForm
              formular="Ofertă Reel gratuit"
              serviciu="Editare video"
              mesajLabel="Despre afacerea ta *"
              mesajPlaceholder="Ce vinzi / ce faci? Pentru cine? Ai deja filmări sau începem de la zero?"
              fields={[
                {
                  name: 'tip', label: 'Ce fel de clipuri vrei? *', type: 'select', required: true,
                  options: ['Reels / TikTok pentru afacerea mea', 'Clipuri pentru contul meu de creator', 'Clipuri din podcast / interviuri', 'Altceva — vă zic în mesaj'],
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* bară fixă jos pe mobil — butonul e mereu la un deget distanță */}
      <a href="#brief" className="lp-sticky">🎁 Vreau clipul gratuit →</a>
    </>
  );
}
