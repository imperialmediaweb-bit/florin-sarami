import type { Metadata } from 'next';
import Link from 'next/link';
import BriefForm from '@/components/BriefForm';
import LpSticky from '@/components/LpSticky';
import Testimonials from '@/components/Testimonials';
import { getTestimonials } from '@/lib/testimonials';
import { getPortfolio } from '@/lib/portfolio';
import { ArrowIcon } from '@/components/Visuals';

// testimonialele vin din admin — pagina se generează la cerere
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: { canonical: '/oferta-video/' },
  title: 'Editare video Reels & TikTok — ofertă gratuită în 24h | Sarami Media',
  description:
    'Editare video profesională pentru Reels, TikTok și Shorts. Completezi formularul și primești în 24h oferta personalizată + 3 idei de clipuri pentru afacerea ta, cadou.',
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
  { n: '1', title: 'Completezi formularul', desc: '2 minute, aici mai jos. Ne spui ce afacere ai, ce vrei să obții și ce filmări există.' },
  { n: '2', title: 'Primești oferta în 24h', desc: 'Ofertă personalizată la prețuri corecte + 3 idei de Reels pentru afacerea ta — și stabilim clipul de probă.' },
  { n: '3', title: 'Primești Short-ul gratuit', desc: 'Îți edităm un Short de probă din materialul tău — vezi exact ce facem. Îți place? Continuăm cu pachetul.' },
];

const FAQ = [
  { q: 'Chiar primesc un Short editat gratuit?', a: 'Da. După ce completezi brief-ul, edităm un clip Short de probă din materialul tău — complet, cu subtitrări, culoare și sunet — ca să vezi exact cum lucrăm. Dacă îți place, continuăm cu pachetul ales. Dacă nu, rămâi cu clipul.' },
  { q: 'Cât costă editarea unui clip?', a: 'Depinde de câte clipuri vrei pe lună și de complexitate — de aceea primești o ofertă personalizată, nu un preț umflat de-a gata. Pachetele lunare au prețuri avantajoase, iar oferta nu te obligă la nimic.' },
  { q: 'Nu am filmări. Mă puteți ajuta?', a: 'Da — pe lângă ofertă primești 3 idei de Reels gândite pentru afacerea ta și îți spunem exact ce și cum să filmezi cu telefonul (e mai simplu decât crezi), iar noi facem restul: montaj, subtitrări, culoare, sunet.' },
];

export default function OfertaVideoPage() {
  // când există un Short încărcat în admin → Portofoliu, rulează automat
  // în telefonul din hero; până atunci se vede animația demo
  const items = getPortfolio();
  const demo = items.find(i => i.video && i.cat === 'shorts') || items.find(i => i.video);

  return (
    <>
      {/* HERO — text + telefon cu Reel „viu" */}
      <section className="page-hero" style={{ paddingBottom: 34 }}>
        <div className="container">
          <div className="lp-hero">
            <div>
              <span className="eyebrow">🎬 Pentru afaceri și creatori care vor clienți din social media</span>
              <h1 className="h-xl" style={{ marginBottom: 18 }}>
                Reels-uri care <span className="grad-text">opresc scroll-ul</span> — editate de profesioniști
              </h1>
              <p className="lead">
                Tu filmezi cu telefonul. Noi transformăm filmarea în clipuri care atrag urmăritori și aduc
                clienți: montaj alert, subtitrări dinamice, culoare premium — gata de postat.
              </p>
              <div className="btn-row" id="cta-hero" style={{ marginTop: 26 }}>
                <a href="/oferta-video/brief/" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '16px 34px' }}>
                  🎁 Vreau Short-ul meu de probă GRATUIT <ArrowIcon />
                </a>
                <a
                  href="https://wa.me/40743361684?text=Bun%C4%83!%20Vreau%20o%20ofert%C4%83%20pentru%20editare%20video%20(Reels%2FTikTok)."
                  className="btn-wa"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💬 Întreabă-ne pe WhatsApp
                </a>
              </div>
              <p style={{ color: 'var(--text-faint)', fontSize: '.88rem', marginTop: 12 }}>
                Completezi brief-ul → îți edităm un Short de probă gratuit, să vezi exact ce facem.
                Fără plată, fără obligații.
              </p>
            </div>
            <div className="reveal-right in">
              <div className="phone">
                <div className="phone-screen"></div>
                {demo ? (
                  <video className="phone-video" src={demo.video} autoPlay muted loop playsInline preload="metadata" />
                ) : (
                  <div className="phone-cap">
                    <span>❌ Nimeni nu-ți vede clipurile?</span>
                    <span>✨ Subtitrări. Ritm. Culoare.</span>
                    <span>📈 Așa arată un Reel care vinde</span>
                  </div>
                )}
                <div className="phone-progress"></div>
                <div className="phone-user">{demo ? '@sarami.media' : '@afacerea_ta'}<i>♫ trending sound · Reels</i></div>
                <div className="phone-icons">
                  <span>❤️<b>12.4K</b></span>
                  <span>💬<b>347</b></span>
                  <span>↗️<b>1.2K</b></span>
                </div>
              </div>
            </div>
          </div>
          <div className="stats" style={{ marginTop: 46 }}>
            <div className="stat"><b data-count="17" data-suffix="+">0</b><span>ani de experiență în conținut</span></div>
            <div className="stat"><b data-count="500" data-suffix="+">0</b><span>proiecte livrate</span></div>
            <div className="stat"><b data-count="100" data-suffix="+">0</b><span>clienți mulțumiți</span></div>
            <div className="stat"><b data-count="24" data-suffix="h">0</b><span>primești oferta personalizată</span></div>
          </div>
        </div>
      </section>

      {/* banda cu servicii — mișcare continuă, senzație de „studio viu" */}
      <div className="lp-marquee" aria-hidden="true">
        <div className="lp-marquee-track">
          {[0, 1].map(i => (
            <span key={i}>
              HOOK ÎN 2 SECUNDE ✦ SUBTITRĂRI DINAMICE ✦ COLOR GRADING ✦ MONTAJ ALERT ✦ SUNET CURAT ✦
              REELS ✦ TIKTOK ✦ SHORTS ✦ LIVRARE 48H ✦ REVIZII INCLUSE ✦&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ÎNAINTE / DUPĂ — de ce contează editarea */}
      <section className="section-tight">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Diferența se vede în 2 secunde</span>
            <h2 className="h-lg">Aceeași filmare. <span className="grad-text">Alt rezultat.</span></h2>
          </div>
          <div className="lp-compare mt-3">
            <div className="reveal-left in">
              <div className="phone raw">
                <div className="phone-screen"></div>
                <div className="phone-user">@afacerea_ta<i>fără sunet · fără subtitrări</i></div>
                <div className="phone-icons"><span>❤️<b>23</b></span><span>💬<b>1</b></span><span>↗️<b>0</b></span></div>
              </div>
              <p className="phone-tag">Filmarea brută<small>postată așa cum e — trecută cu vederea</small></p>
            </div>
            <div className="lp-vs">VS</div>
            <div className="reveal-right in">
              <div className="phone">
                <div className="phone-screen"></div>
                <div className="phone-progress"></div>
                <div className="phone-cap">
                  <span>🔥 Hook care oprește scroll-ul</span>
                  <span>💬 Subtitrări care țin atenția</span>
                  <span>🎨 Culoare ca de cinema</span>
                </div>
                <div className="phone-user">@afacerea_ta<i>♫ trending sound · Reels</i></div>
                <div className="phone-icons"><span>❤️<b>12.4K</b></span><span>💬<b>347</b></span><span>↗️<b>1.2K</b></span></div>
              </div>
              <p className="phone-tag">După Sarami Media<small>montaj, subtitrări, culoare, sunet — în 48h</small></p>
            </div>
          </div>
          <p className="center" style={{ marginTop: 26 }}>
            <a href="/oferta-video/brief/" className="btn btn-primary">Vreau să arate așa și clipurile mele <ArrowIcon /></a>
          </p>
        </div>
      </section>

      {/* OFERTA */}
      <section className="section-tight" id="oferta">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="card reveal in" style={{ padding: 'clamp(30px, 5vw, 52px)', textAlign: 'center', border: '2px solid var(--blue-600)' }}>
            <span className="eyebrow">Ce primești gratuit după brief</span>
            <h2 className="h-lg" style={{ marginBottom: 14 }}>
              Un <span className="grad-text">Short editat GRATUIT</span> + ofertă personalizată
            </h2>
            <p style={{ color: 'var(--text-dim)', maxWidth: 660, margin: '0 auto 22px' }}>
              Completezi brief-ul, iar noi îți edităm <strong style={{ color: 'var(--text-main)' }}>un clip Short de probă, gratuit</strong> —
              ca să vezi exact ce facem, pe materialul tău, nu pe promisiuni. Pe lângă clip primești în{' '}
              <strong style={{ color: 'var(--text-main)' }}>24 de ore</strong> oferta exactă pe nevoile tale +{' '}
              <strong style={{ color: 'var(--text-main)' }}>3 idei de Reels</strong> gândite pentru afacerea ta.
              Îți place? <strong style={{ color: 'var(--text-main)' }}>Continuăm.</strong> Nu? Rămâi cu clipul și cu ideile.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 26 }}>
              {['✅ Short de probă editat gratuit', '✅ 0 lei — fără card, fără obligații', '✅ Ofertă în 24h, la prețuri corecte'].map(t => (
                <span key={t} style={{ background: 'rgba(37,99,235,.08)', color: 'var(--blue-700)', fontWeight: 600, fontSize: '.9rem', padding: '9px 18px', borderRadius: 999 }}>{t}</span>
              ))}
            </div>
            <a href="/oferta-video/brief/" className="btn btn-primary" style={{ fontSize: '1rem', padding: '15px 32px' }}>
              Vreau Short-ul meu gratuit <ArrowIcon />
            </a>
            <p style={{ color: 'var(--text-faint)', fontSize: '.84rem', marginTop: 14 }}>
              ⏳ Răspundem în ordinea cererilor — de obicei chiar în aceeași zi.
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

      {/* PACHETE LUNARE */}
      <section className="section-tight">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Pachete lunare de clipuri</span>
            <h2 className="h-lg">Postezi constant, <span className="grad-text">plătești corect</span></h2>
            <p className="lead" style={{ marginTop: 10 }}>
              Algoritmul iubește constanța — de-aia lucrăm pe pachete lunare, la prețuri mult mai bune decât clipurile la bucată.
            </p>
          </div>
          <div className="cards-3 mt-3">
            {[
              { name: 'START', clips: '10 clipuri / lună', desc: '2-3 clipuri pe săptămână — prezență constantă, fără efort din partea ta.', d: 'd1' },
              { name: 'CREȘTERE', clips: '25 clipuri / lună', desc: 'Un clip în fiecare zi lucrătoare — ritmul cu care conturile cresc vizibil.', d: 'd2', hot: true },
              { name: 'PRO', clips: '50 clipuri / lună', desc: 'Prezență masivă, pe toate platformele — pentru branduri care vor să domine nișa.', d: 'd3' },
            ].map(p => (
              <div className={`card reveal ${p.d}`} key={p.name} style={p.hot ? { border: '2px solid var(--blue-600)', position: 'relative' } : undefined}>
                {p.hot && (
                  <span style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'var(--grad-brand)', color: '#fff', fontWeight: 700, fontSize: '.78rem', padding: '5px 16px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                    ⭐ Cel mai ales
                  </span>
                )}
                <h3 style={{ fontSize: '.95rem', letterSpacing: '.08em', color: 'var(--blue-700)', marginBottom: 6 }}>{p.name}</h3>
                <p style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.5rem', marginBottom: 10 }}>{p.clips}</p>
                <p style={{ color: 'var(--text-dim)', fontSize: '.93rem', marginBottom: 14 }}>{p.desc}</p>
                <ul style={{ listStyle: 'none', color: 'var(--text-dim)', fontSize: '.9rem', display: 'grid', gap: 7, marginBottom: 18 }}>
                  <li>✅ Subtitrări dinamice incluse</li>
                  <li>✅ Culoare + sunet profesionist</li>
                  <li>✅ Formate pentru toate platformele</li>
                  <li>✅ Revizii incluse</li>
                </ul>
                <a href="/oferta-video/brief/" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                  Cere prețul exact — gratuit
                </a>
              </div>
            ))}
          </div>
          <p className="center" style={{ marginTop: 28 }}>
            <a href="/oferta-video/brief/" className="btn btn-primary" style={{ fontSize: '1rem', padding: '15px 30px' }}>
              Vrei mai multe clipuri lunar? Completează brief-ul și primești ofertă personalizată! <ArrowIcon />
            </a>
          </p>
          <p className="center" style={{ color: 'var(--text-faint)', fontSize: '.88rem', marginTop: 14 }}>
            Prețul exact depinde de complexitate — de-aia îl calculăm pe afacerea ta, nu-ți dăm o listă umflată. Răspuns în 24h.
          </p>
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
            <span className="eyebrow">🎁 Durează 2 minute</span>
            <h2 className="h-lg">Cere oferta <span className="grad-text">gratuită</span> — prețuri corecte, fără surprize</h2>
            <p className="lead" style={{ marginBottom: 14 }}>
              Durează 2 minute. Completezi, iar noi îți trimitem <strong style={{ color: 'var(--text-main)' }}>oferta personalizată</strong> în
              aceeași zi lucrătoare și stabilim <strong style={{ color: 'var(--text-main)' }}>Short-ul tău de probă gratuit</strong> —
              fără spam, fără telefoane insistente.
            </p>
            <p style={{ color: 'var(--text-dim)', marginBottom: 30 }}>
              Preferi să vorbim direct? Scrie-ne pe{' '}
              <a
                href="https://wa.me/40743361684?text=Bun%C4%83!%20Vreau%20o%20ofert%C4%83%20pentru%20editare%20video."
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#128c46', fontWeight: 700 }}
              >
                WhatsApp: +40 743 361 684
              </a>
            </p>
          </div>
          <div className="form-card reveal in">
            <BriefForm
              formular="Ofertă video"
              serviciu="Editare video"
              mesajLabel="Despre afacerea ta *"
              mesajPlaceholder="Ce vinzi / ce faci? Pentru cine? Ai deja filmări sau începem de la zero?"
              fields={[
                {
                  name: 'tip', label: 'Ce fel de clipuri vrei? *', type: 'select', required: true,
                  options: ['Reels / TikTok pentru afacerea mea', 'Clipuri pentru contul meu de creator', 'Clipuri din podcast / interviuri', 'Altceva — vă zic în mesaj'],
                },
                {
                  name: 'clipuri', label: 'Câte clipuri ai vrea pe lună? *', type: 'select', required: true,
                  options: ['10 clipuri / lună', '25 clipuri / lună', '50 clipuri / lună', 'Mai multe de 50', 'Nu știu încă — stabilim împreună'],
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* bară fixă jos pe mobil — dispare când formularul e pe ecran */}
      <LpSticky label="🎁 Vreau Short-ul gratuit →" />
    </>
  );
}
