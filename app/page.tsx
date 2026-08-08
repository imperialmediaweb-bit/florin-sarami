import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import Testimonials from '@/components/Testimonials';
import CtaBand from '@/components/CtaBand';
import Faq from '@/components/Faq';
import { ArrowIcon, MockDoc } from '@/components/Visuals';

const VIDEO_SERVICES = [
  {
    title: 'Clipuri pentru Social Media',
    desc: 'Clipuri scurte și dinamice pentru Facebook, Instagram, TikTok și YouTube — formate verticale sau orizontale, cu subtitrări și hook-uri care opresc scroll-ul.',
    icon: <><rect x="2" y="5" width="14" height="14" rx="2" /><path d="m22 8-6 4 6 4V8Z" /></>,
  },
  {
    title: 'Videoclipuri promoționale',
    desc: 'Video-uri de prezentare pentru afacerea, produsul sau serviciul tău. Mesaj clar, ritm alert și imagine care vinde.',
    icon: <path d="m3 11 18-8-8 18-2-8-8-2Z" />,
  },
  {
    title: 'Podcasturi',
    desc: 'Editare completă pentru podcasturi video și audio: curățare sunet, montaj multi-cameră, clipuri scurte pentru promovare.',
    icon: <><path d="M12 2a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></>,
  },
  {
    title: 'Clipuri de lungă durată',
    desc: 'Documentare, vloguri, cursuri și materiale ample — structurate și editate ca să mențină atenția de la început până la final.',
    icon: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 8h20M2 16h20M6 4v16M18 4v16" /></>,
  },
  {
    title: 'Interviuri & evenimente',
    desc: 'Montaj pentru interviuri, conferințe, nunți și evenimente corporate — surprindem esența și emoția fiecărui moment.',
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  },
  {
    title: 'Color grading & efecte',
    desc: 'Corecții de culoare cinematice, efecte vizuale, motion graphics și titluri animate care dau un aer premium fiecărui cadru.',
    icon: <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />,
  },
];

const MARQUEE = ['Montaj video', 'Subtitrări', 'Tranziții', 'Corecții de culoare', 'Efecte vizuale', 'Reels & TikTok', 'Podcasturi', 'Articole de blog', 'Descrieri de produse', 'Advertoriale'];

const WHY_US = [
  {
    title: 'Livrare rapidă',
    desc: 'Respectăm termenele. Timp mediu de livrare: 48 de ore pentru proiectele standard.',
    icon: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  },
  {
    title: 'Prețuri corecte',
    desc: 'Adaptate fiecărui proiect. Plătești exact pentru ce ai nevoie, nimic în plus.',
    icon: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  },
  {
    title: 'Revizii incluse',
    desc: 'Lucrăm până ești mulțumit. Feedback-ul tău face parte din proces.',
    icon: <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />,
  },
  {
    title: 'Experiență din 2020',
    desc: 'Peste 5 ani în crearea de conținut pentru branduri din toate domeniile.',
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  },
];

const FAQ_ITEMS = [
  {
    q: 'Cât costă editarea unui videoclip?',
    a: <>Prețul depinde de durata materialului brut, complexitatea montajului și termenul de livrare. Fiecare proiect primește o ofertă personalizată — prețuri corecte, adaptate fiecărui proiect. Trimite-ne detaliile prin <Link href="/contact" style={{ color: 'var(--sky-300)' }}>formularul de contact</Link> și revenim rapid cu o estimare.</>,
  },
  {
    q: 'În cât timp primesc videoclipul finalizat?',
    a: 'Pentru proiectele standard (clipuri social media, promo-uri scurte), timpul mediu de livrare este de 48 de ore. Proiectele complexe — podcasturi lungi, filme de eveniment — pot dura 3–7 zile lucrătoare. Stabilim termenul exact înainte de a începe.',
  },
  {
    q: 'Cum vă trimit filmările?',
    a: 'Simplu: prin WeTransfer, Google Drive, Dropbox sau orice altă platformă de transfer preferi. După ce ne contactezi, îți trimitem toate instrucțiunile pas cu pas.',
  },
  {
    q: 'Pot cere modificări după livrare?',
    a: 'Da! Fiecare proiect include revizii, pentru că vrem să fii 100% mulțumit de rezultat. Feedback-ul tău face parte din procesul nostru de lucru.',
  },
  {
    q: 'Faceți și conținut scris, nu doar video?',
    a: <>Da — redactăm articole de blog, descrieri de produse, pagini de prezentare, comunicate și advertoriale. La cerere, toate materialele sunt scrise integral de oameni reali (100% Human Written), fără AI. Detalii pe pagina <Link href="/redactare-continut" style={{ color: 'var(--sky-300)' }}>Redactare conținut</Link>.</>,
  },
  {
    q: 'Pentru ce platforme optimizați clipurile?',
    a: 'Facebook, Instagram (Reels, Stories, feed), TikTok, YouTube (video lung și Shorts) — livrăm în formatul și rezoluția ideală pentru fiecare platformă, cu subtitrări și thumbnail-uri la cerere.',
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSlider />

      {/* Marquee servicii */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((s, i) => <span key={i}>{s}</span>)}
        </div>
      </div>

      {/* Servicii editare video */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Ce facem cel mai bine</span>
            <h2 className="h-lg">Servicii de <span className="grad-text">editare video</span></h2>
            <p className="lead">De la filmări brute la videoclipuri finisate, gata de publicat. Ne ocupăm de tot procesul de post-producție.</p>
          </div>
          <div className="cards-3 mt-3">
            {VIDEO_SERVICES.map((s, i) => (
              <article className={`card reveal d${(i % 3) + 1}`} key={s.title}>
                <div className="card-icon"><svg viewBox="0 0 24 24">{s.icon}</svg></div>
                <h3 className="h-md">{s.title}</h3>
                <p>{s.desc}</p>
                <Link href="/editare-video" className="card-link">Află mai mult →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Statistici */}
      <section className="section-tight">
        <div className="container">
          <div className="stats reveal">
            <div className="stat"><b data-count="2020">0</b><span>Pe piață din</span></div>
            <div className="stat"><b data-count="500" data-suffix="+">0</b><span>Proiecte finalizate</span></div>
            <div className="stat"><b data-count="100" data-suffix="+">0</b><span>Clienți mulțumiți</span></div>
            <div className="stat"><b data-count="48" data-suffix="h">0</b><span>Timp mediu de livrare</span></div>
          </div>
        </div>
      </section>

      {/* Proces */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Simplu și transparent</span>
            <h2 className="h-lg">Cum <span className="grad-text">lucrăm</span></h2>
            <p className="lead">Un proces clar, fără bătăi de cap, de la prima discuție până la livrare.</p>
          </div>
          <div className="steps mt-3">
            <div className="step reveal d1">
              <h3>Ne trimiți materialele</h3>
              <p>Filmările brute, ideile și obiectivele tale. Stabilim împreună direcția și stilul.</p>
            </div>
            <div className="step reveal d2">
              <h3>Primești oferta</h3>
              <p>Prețuri corecte, adaptate fiecărui proiect. Fără costuri ascunse, fără surprize.</p>
            </div>
            <div className="step reveal d3">
              <h3>Lucrăm la proiect</h3>
              <p>Montaj, subtitrări, culoare, efecte — și te ținem la curent pe tot parcursul.</p>
            </div>
            <div className="step reveal d4">
              <h3>Livrare &amp; revizii</h3>
              <p>Primești materialul final optimizat pentru platforma dorită, cu revizii incluse.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Redactare conținut */}
      <section className="section">
        <div className="container">
          <div className="split">
            <div className="reveal-left">
              <span className="eyebrow">Redactare conținut</span>
              <h2 className="h-lg">Cuvinte care <span className="grad-text">vând</span>, scrise de oameni reali</h2>
              <p className="lead mb-2">Pe lângă video, echipa noastră creează conținut scris care aduce trafic, construiește încredere și convinge. La cerere, totul 100% Human Written — fără AI.</p>
              <ul className="check-list">
                <li><span className="tick">✓</span><span><strong>Articole de blog</strong> — optimizate SEO, documentate temeinic</span></li>
                <li><span className="tick">✓</span><span><strong>Descrieri de produse</strong> — care transformă vizitatori în clienți</span></li>
                <li><span className="tick">✓</span><span><strong>Pagini de prezentare</strong> — texte clare pentru site-ul tău</span></li>
                <li><span className="tick">✓</span><span><strong>Comunicate &amp; advertoriale</strong> — mesaje care ajung la public</span></li>
              </ul>
              <div className="btn-row mt-3">
                <Link href="/redactare-continut" className="btn btn-primary">Vezi serviciile de redactare <ArrowIcon /></Link>
              </div>
            </div>
            <div className="reveal-right hero-visual">
              <MockDoc />
              <div className="float-chip p1">📝 SEO friendly</div>
            </div>
          </div>
        </div>
      </section>

      {/* De ce noi */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">De ce Sarami Media</span>
            <h2 className="h-lg">Parteneri, nu doar <span className="grad-text">furnizori</span></h2>
          </div>
          <div className="cards-4 mt-3">
            {WHY_US.map((w, i) => (
              <div className={`card reveal d${i + 1}`} key={w.title}>
                <div className="card-icon"><svg viewBox="0 0 24 24">{w.icon}</svg></div>
                <h3 className="h-md">{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimoniale */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Testimoniale</span>
            <h2 className="h-lg">Ce spun <span className="grad-text">clienții noștri</span></h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">FAQ</span>
            <h2 className="h-lg">Întrebări <span className="grad-text">frecvente</span></h2>
          </div>
          <Faq items={FAQ_ITEMS} />
        </div>
      </section>

      <CtaBand
        title="Ai un proiect? Contactează-ne!"
        text="Suntem gata să transformăm materialele tale într-un conținut care face diferența. Prețuri corecte, adaptate fiecărui proiect."
        label="Hai să vorbim"
      />
    </>
  );
}
