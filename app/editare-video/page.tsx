import type { Metadata } from 'next';
import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import Faq from '@/components/Faq';
import MediaCard from '@/components/MediaCard';
import { ArrowIcon, MockPlayer } from '@/components/Visuals';

export const metadata: Metadata = {
  title: 'Editare Video Profesională',
  description:
    'Servicii profesionale de editare video: montaj, subtitrări, tranziții, corecții de culoare și efecte vizuale. Clipuri pentru Facebook, Instagram, TikTok, YouTube, podcasturi și evenimente.',
};

const INCLUDES = [
  {
    title: 'Montaj profesional',
    desc: 'Selectăm cele mai bune cadre, tăiem tot ce nu aduce valoare și construim o poveste cu ritm, care ține privitorul lipit de ecran.',
    icon: <path d="M7 2h10M7 22h10M5 2v20M19 2v20M5 7h3M5 12h3M5 17h3M16 7h3M16 12h3M16 17h3" />,
  },
  {
    title: 'Subtitrări dinamice',
    desc: '85% din clipurile pe social media rulează fără sunet. Subtitrările animate, sincronizate perfect, îți păstrează audiența.',
    icon: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M6 15h8M6 11h12" /></>,
  },
  {
    title: 'Corecții de culoare',
    desc: 'Color grading cinematic care transformă imaginea „de telefon" într-una cu aspect premium, consecventă de la primul la ultimul cadru.',
    icon: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.2 2.2M16.9 16.9l2.2 2.2M4.9 19.1l2.2-2.2M16.9 7.1l2.2-2.2" /></>,
  },
  {
    title: 'Tranziții & efecte vizuale',
    desc: 'Tranziții fluide, zoom-uri dinamice, motion graphics și titluri animate — exact cât trebuie ca să impresioneze, fără să obosească.',
    icon: <path d="m13 2-2 9h4l-2 9M5 12l-3 3 3 3M19 12l3 3-3 3" />,
  },
  {
    title: 'Sunet curat',
    desc: 'Eliminăm zgomotul de fundal, echilibrăm nivelurile audio și adăugăm muzică licențiată potrivită cu tonul clipului tău.',
    icon: <path d="M11 5 6 9H2v6h4l5 4V5ZM15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />,
  },
  {
    title: 'Optimizare per platformă',
    desc: 'Livrăm fiecare clip în formatul ideal: 9:16 pentru Reels și TikTok, 16:9 pentru YouTube, 1:1 sau 4:5 pentru feed — cu export la calitate maximă.',
    icon: <><rect x="3" y="3" width="7" height="18" rx="1" /><rect x="14" y="3" width="7" height="10" rx="1" /></>,
  },
];

const MARQUEE = ['YouTube', 'Instagram Reels', 'TikTok', 'Facebook', 'YouTube Shorts', 'Podcasturi', 'Evenimente', 'Interviuri', 'Cursuri online', 'Prezentări'];

const FAQ_ITEMS = [
  {
    q: 'Ce program folosiți pentru editare?',
    a: 'Lucrăm cu software profesional de post-producție (Adobe Premiere Pro, After Effects, DaVinci Resolve). Tu nu trebuie să instalezi sau să știi nimic tehnic — primești direct fișierele finale.',
  },
  {
    q: 'Filmările mele sunt de pe telefon. Se poate face ceva cu ele?',
    a: 'Absolut! Marea majoritate a clipurilor virale de pe TikTok și Reels sunt filmate cu telefonul. Prin montaj, corecții de culoare și sunet curat, un material filmat cu telefonul poate arăta surprinzător de profesionist.',
  },
  {
    q: 'Puneți voi muzică pe clipuri?',
    a: 'Da, folosim muzică licențiată pe care o alegem potrivit cu tonul și ritmul clipului. Dacă ai preferințe muzicale, le respectăm.',
  },
  {
    q: 'Câte revizii sunt incluse?',
    a: 'Fiecare proiect include revizii — numărul exact îl stabilim în ofertă, în funcție de complexitate. Scopul nostru este să fii 100% mulțumit de rezultatul final.',
  },
  {
    q: 'Lucrați cu abonament lunar pentru conținut constant?',
    a: <>Da! Pentru creatorii și firmele care publică regulat, oferim pachete lunare cu preț avantajos și prioritate la livrare. Întreabă-ne despre ele în <Link href="/contact" style={{ color: 'var(--sky-300)' }}>formularul de contact</Link>.</>,
  },
];

const FOLIO_TEASER = [
  { tag: 'Social Media', title: 'Campanie Reels — fashion', desc: 'Serie de clipuri verticale cu subtitrări dinamice' },
  { tag: 'Podcast', title: 'Podcast business — episod complet', desc: 'Montaj multi-cameră + clipuri de promovare', gradient: 'linear-gradient(135deg,#1d4ed8,#0ea5e9)' },
  { tag: 'Eveniment', title: 'Aftermovie conferință', desc: 'Highlight-uri cu color grading cinematic', gradient: 'linear-gradient(135deg,#0f2050,#2563eb)' },
];

export default function EditareVideoPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ minHeight: 'auto' }}>
        <div className="hero-slide active" style={{ padding: '80px 0 70px' }}>
          <div className="container">
            <div>
              <span className="eyebrow">Post-producție completă</span>
              <h1 className="h-xl">Editare video care <span className="grad-text">oprește scroll-ul</span></h1>
              <p className="lead">Primele 3 secunde decid dacă cineva se uită la clipul tău sau trece mai departe. Noi facem ca acele secunde — și tot ce urmează după ele — să conteze.</p>
              <div className="btn-row mt-2">
                <Link href="/brief-video" className="btn btn-primary">Cere ofertă — brief 2 minute <ArrowIcon /></Link>
                <Link href="/portofoliu" className="btn btn-ghost">▶ Vezi portofoliul</Link>
              </div>
              <div className="stats mt-3" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                <div className="stat" style={{ padding: '18px 10px' }}><b data-count="500" data-suffix="+">0</b><span>Clipuri editate</span></div>
                <div className="stat" style={{ padding: '18px 10px' }}><b data-count="48" data-suffix="h">0</b><span>Livrare medie</span></div>
                <div className="stat" style={{ padding: '18px 10px' }}><b data-count="100" data-suffix="%">0</b><span>Revizii incluse</span></div>
              </div>
            </div>
            <div className="hero-visual">
              <MockPlayer />
              <div className="float-chip p1">🎬 4K • Vertical • Horizontal</div>
              <div className="float-chip p2">⚡ Livrare în 48h</div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee platforme */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((s, i) => <span key={i}>{s}</span>)}
        </div>
      </div>

      {/* Ce include */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Tot ce ai nevoie</span>
            <h2 className="h-lg">Ce include <span className="grad-text">serviciul nostru</span></h2>
            <p className="lead">Trimiți filmările brute, primești un videoclip finisat, gata de publicat. Fără stres, fără software complicat, fără ore pierdute.</p>
          </div>
          <div className="cards-3 mt-3">
            {INCLUDES.map((s, i) => (
              <article className={`card reveal d${(i % 3) + 1}`} key={s.title}>
                <div className="card-icon"><svg viewBox="0 0 24 24">{s.icon}</svg></div>
                <h3 className="h-md">{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Tipuri de proiecte */}
      <section className="section">
        <div className="container">
          <div className="split">
            <div className="reveal-left">
              <span className="eyebrow">Pentru orice tip de proiect</span>
              <h2 className="h-lg">Ce tipuri de video <span className="grad-text">edităm</span></h2>
              <ul className="check-list mt-2">
                <li><span className="tick">✓</span><span><strong>Clipuri social media</strong> — Reels, TikTok, Shorts, reclame video</span></li>
                <li><span className="tick">✓</span><span><strong>Videoclipuri promoționale</strong> — prezentare firmă, produs sau serviciu</span></li>
                <li><span className="tick">✓</span><span><strong>Podcasturi</strong> — episoade complete + clipuri scurte de promovare</span></li>
                <li><span className="tick">✓</span><span><strong>Clipuri de lungă durată</strong> — vloguri, cursuri, documentare</span></li>
                <li><span className="tick">✓</span><span><strong>Interviuri &amp; evenimente</strong> — conferințe, lansări, momente speciale</span></li>
                <li><span className="tick">✓</span><span><strong>Orice alt material video</strong> — spune-ne ideea, găsim soluția</span></li>
              </ul>
              <div className="btn-row mt-3">
                <Link href="/brief-video" className="btn btn-primary">Completează brief-ul — primești oferta <ArrowIcon /></Link>
              </div>
            </div>
            <div className="reveal-right hero-visual">
              <MediaCard
                photo="studio-camera"
                video="filmare"
                tag="Behind the scenes"
                title="Filmare & producție video"
                ratio="4 / 3.4"
                fallback={<MockPlayer delay=".6s" screenStyle={{ background: 'linear-gradient(135deg,#16307a,#0ea5e9 70%,#7dd3fc 140%)' }} />}
              />
              <div className="float-chip p1">🎧 Audio &amp; muzică licențiată</div>
            </div>
          </div>
        </div>
      </section>

      {/* Proces */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">De la brut la wow</span>
            <h2 className="h-lg">Procesul nostru în <span className="grad-text">4 pași</span></h2>
          </div>
          <div className="steps mt-3">
            <div className="step reveal d1">
              <h3>Briefing</h3>
              <p>Ne spui ce vrei să obții, cui te adresezi și pe ce platformă publici. Ne trimiți filmările prin WeTransfer sau Drive.</p>
            </div>
            <div className="step reveal d2">
              <h3>Ofertă &amp; termen</h3>
              <p>Primești rapid o ofertă personalizată și un termen clar de livrare. Confirmăm și ne apucăm de treabă.</p>
            </div>
            <div className="step reveal d3">
              <h3>Editare</h3>
              <p>Montaj, subtitrări, culoare, sunet, efecte. Îți trimitem preview-uri ca să fii sigur că mergem în direcția dorită.</p>
            </div>
            <div className="step reveal d4">
              <h3>Livrare finală</h3>
              <p>Primești clipul în toate formatele necesare, plus reviziile de care ai nevoie până e totul perfect.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portofoliu teaser */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Lucrări recente</span>
            <h2 className="h-lg">Din <span className="grad-text">portofoliul</span> nostru</h2>
            <p className="lead">O selecție din proiectele la care am lucrat. Vezi galeria completă în pagina de portofoliu.</p>
          </div>
          <div className="folio-grid mt-3">
            {FOLIO_TEASER.map((f, i) => (
              <article className={`folio-item reveal d${i + 1}`} key={f.title}>
                <div className="folio-media placeholder" style={f.gradient ? { background: f.gradient } : undefined}>
                  <div className="mock-play"></div>
                </div>
                <div className="folio-body">
                  <span className="folio-tag">{f.tag}</span>
                  <h3>{f.title}</h3>
                  <span>{f.desc}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="center mt-3 reveal">
            <Link href="/portofoliu" className="btn btn-primary">Vezi tot portofoliul <ArrowIcon /></Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">FAQ</span>
            <h2 className="h-lg">Întrebări despre <span className="grad-text">editarea video</span></h2>
          </div>
          <Faq items={FAQ_ITEMS} />
        </div>
      </section>

      <CtaBand
        title="Gata să dai viață filmărilor tale?"
        text="Completează brief-ul în 2 minute și primești o ofertă corectă, adaptată proiectului — de obicei în aceeași zi."
        label="Completează brief-ul video"
        href="/brief-video"
      />
    </>
  );
}
