import type { Metadata } from 'next';
import Link from 'next/link';
import CtaBand from '@/components/CtaBand';
import Faq from '@/components/Faq';
import { ArrowIcon, MockDoc } from '@/components/Visuals';

export const metadata: Metadata = {
  title: 'Redactare Conținut — Articole Blog, Descrieri Produse',
  description:
    'Redactare de conținut 100% Human Written: articole de blog SEO, descrieri de produse, pagini de prezentare, comunicate și advertoriale. Conținut scris de oameni reali, apreciat de Google.',
};

const SERVICES = [
  {
    title: 'Articole de blog',
    desc: 'Articole documentate, optimizate SEO, care răspund exact la întrebările pe care le caută publicul tău — și îl transformă în client.',
    icon: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />,
  },
  {
    title: 'Descrieri de produse',
    desc: 'Descrieri unice pentru magazinul tău online — care evită conținutul duplicat, urcă în căutări și conving vizitatorii să apese „Adaugă în coș".',
    icon: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></>,
  },
  {
    title: 'Pagini de prezentare',
    desc: 'Textele site-ului tău: homepage, despre noi, servicii. Mesaje clare, care spun exact ce faci și de ce ești alegerea potrivită.',
    icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 8h10M7 12h10M7 16h6" /></>,
  },
  {
    title: 'Comunicate de presă',
    desc: 'Comunicate profesioniste care ajung la jurnaliști și publicații — redactate în stilul cerut de presă, gata de distribuit.',
    icon: <><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6Z" /></>,
  },
  {
    title: 'Advertoriale',
    desc: 'Articole sponsorizate care promovează natural, fără să sune a reclamă — ideale pentru campanii de PR și link building.',
    icon: <path d="m3 11 18-8-8 18-2-8-8-2Z" />,
  },
  {
    title: 'Optimizare SEO',
    desc: 'Cercetare de cuvinte-cheie, structură corectă (H1–H3), meta description, linkuri interne — fiecare text e pregătit să performeze în Google.',
    icon: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  },
];

const CASE_STUDIES = [
  {
    tag: 'E-commerce',
    title: 'Magazin online de echipamente sportive',
    challenge: 'sute de produse cu descrieri copiate de la furnizori — conținut duplicat, invizibil în Google.',
    solution: 'am rescris manual descrierile pentru categoriile principale, cu focus pe beneficii și cuvinte-cheie comerciale.',
    result: '+180% trafic organic pe paginile de produs în 4 luni și o rată de conversie vizibil mai bună.',
  },
  {
    tag: 'Servicii B2B',
    title: 'Blog pentru o firmă de contabilitate',
    challenge: 'site nou, zero autoritate, competiție puternică pe căutările din domeniu.',
    solution: '4 articole pe lună, scrise de redactori care înțeleg legislația, pe subiecte căutate de antreprenori.',
    result: 'primele poziții în Google pentru mai multe întrebări frecvente și clienți noi veniți direct de pe blog.',
  },
  {
    tag: 'Local',
    title: 'Clinică stomatologică',
    challenge: 'pagini de servicii scurte, generice, care nu inspirau încredere pacienților.',
    solution: 'pagini de prezentare rescrise cu explicații clare ale procedurilor, ton empatic și răspunsuri la temerile pacienților.',
    result: 'mai multe programări prin site și un timp petrecut pe pagină dublu față de vechile texte.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Chiar scrieți totul manual, fără AI?',
    a: 'Da — dacă asta îți dorești, toate materialele tale sunt scrise integral de redactori umani, de la prima documentare până la ultima virgulă. Este opțiunea recomandată pentru conținutul care trebuie să performeze pe termen lung în Google.',
  },
  {
    q: 'De ce contează pentru Google cine a scris textul?',
    a: 'Google evaluează calitatea prin semnale precum originalitatea, profunzimea, experiența demonstrată (E-E-A-T) și comportamentul cititorilor pe pagină. Conținutul autentic, scris de oameni care cunosc domeniul, obține scoruri mai bune la toate aceste capitole — și poziții mai bune în căutări.',
  },
  {
    q: 'Cât costă un articol de blog?',
    a: <>Depinde de lungime, complexitatea documentării și domeniul tău. Oferim și pachete lunare avantajoase pentru colaborări constante. Scrie-ne prin <Link href="/contact" style={{ color: 'var(--sky-300)' }}>formularul de contact</Link> și primești rapid o ofertă personalizată.</>,
  },
  {
    q: 'În ce domenii scrieți?',
    a: 'Am scris pentru e-commerce, servicii B2B, medical, juridic, construcții, turism, HoReCa, tehnologie și multe altele. Pentru domenii de specialitate, documentarea temeinică face parte din proces.',
  },
  {
    q: 'Textele sunt verificate la plagiat?',
    a: 'Da, fiecare material este verificat înainte de livrare. Primești conținut 100% original — condiție esențială atât pentru Google, cât și pentru reputația brandului tău.',
  },
];

export default function RedactareContinutPage() {
  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ minHeight: 'auto' }}>
        <div className="hero-slide active" style={{ padding: '80px 0 70px' }}>
          <div className="container">
            <div>
              <span className="eyebrow">✍️ 100% Human Written</span>
              <h1 className="h-xl">Conținut scris de <span className="grad-text">oameni reali</span>, iubit de Google</h1>
              <p className="lead">Articole de blog, descrieri de produse, pagini de prezentare, comunicate și advertoriale — texte autentice, documentate, care aduc trafic organic și construiesc încredere.</p>
              <div className="btn-row mt-2">
                <Link href="/contact" className="btn btn-primary">Cere o ofertă <ArrowIcon /></Link>
                <a href="#studii-de-caz" className="btn btn-ghost">Vezi rezultatele</a>
              </div>
            </div>
            <div className="hero-visual">
              <MockDoc />
              <div className="float-chip p1">🔍 SEO optimizat</div>
              <div className="float-chip p2">🚫 Fără AI, la cerere</div>
            </div>
          </div>
        </div>
      </section>

      {/* De ce Human Written / Google */}
      <section className="section">
        <div className="container">
          <div className="split">
            <div className="reveal-left">
              <span className="eyebrow">De ce conținut scris manual?</span>
              <h2 className="h-lg">Google <span className="grad-text">premiază</span> conținutul autentic</h2>
              <p className="lead mb-2">Internetul e plin de texte generate automat, care sună toate la fel. Google a devenit tot mai bun la a le recunoaște — și tot mai generos cu conținutul care demonstrează experiență reală și valoare pentru cititor.</p>
              <ul className="check-list">
                <li><span className="tick">✓</span><span><strong>E-E-A-T</strong> — Google evaluează experiența, expertiza, autoritatea și încrederea. Conținutul scris manual, de oameni care înțeleg domeniul, bifează toate criteriile.</span></li>
                <li><span className="tick">✓</span><span><strong>Helpful Content</strong> — algoritmii Google favorizează conținutul creat pentru oameni, nu pentru motoare de căutare. Exact așa scriem noi.</span></li>
                <li><span className="tick">✓</span><span><strong>Originalitate reală</strong> — texte documentate, cu unghiuri proprii și exemple concrete, nu parafrazări ale primelor 5 rezultate din căutare.</span></li>
                <li><span className="tick">✓</span><span><strong>Vocea brandului tău</strong> — un om poate prinde tonul, umorul și personalitatea afacerii tale. Cititorii simt diferența, iar Google măsoară cât rămân pe pagină.</span></li>
              </ul>
              <p className="mt-2" style={{ color: 'var(--text-dim)' }}>
                Dacă îți dorești, <strong style={{ color: 'var(--text-main)' }}>garantăm contractual</strong> că materialele tale sunt scrise integral de persoane reale — fără nicio unealtă AI implicată.
              </p>
            </div>
            <div className="reveal-right">
              <div className="cards-2" style={{ gridTemplateColumns: '1fr', gap: 18 }}>
                <div className="stat" style={{ textAlign: 'left', padding: '26px 28px' }}>
                  <b style={{ fontSize: '2rem' }}>+215%</b>
                  <span>creștere medie de trafic organic la 6 luni pentru blogurile pe care le administrăm*</span>
                </div>
                <div className="stat" style={{ textAlign: 'left', padding: '26px 28px' }}>
                  <b style={{ fontSize: '2rem' }}>Top 10</b>
                  <span>poziții Google obținute pentru zeci de cuvinte-cheie competitive*</span>
                </div>
                <div className="stat" style={{ textAlign: 'left', padding: '26px 28px' }}>
                  <b style={{ fontSize: '2rem' }}>2x</b>
                  <span>timp petrecut pe pagină față de media industriei, pentru articolele noastre*</span>
                </div>
                <p style={{ color: 'var(--text-faint)', fontSize: '.78rem', marginTop: 4 }}>
                  *rezultate din proiectele noastre; performanța variază în funcție de domeniu și competiție.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicii */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Ce scriem pentru tine</span>
            <h2 className="h-lg">Servicii de <span className="grad-text">redactare</span></h2>
          </div>
          <div className="cards-3 mt-3">
            {SERVICES.map((s, i) => (
              <article className={`card reveal d${(i % 3) + 1}`} key={s.title}>
                <div className="card-icon"><svg viewBox="0 0 24 24">{s.icon}</svg></div>
                <h3 className="h-md">{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Studii de caz */}
      <section className="section" id="studii-de-caz">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Studii de caz</span>
            <h2 className="h-lg">Rezultate <span className="grad-text">reale</span>, nu promisiuni</h2>
            <p className="lead">Câteva exemple din proiectele noastre de conținut și ce au adus clienților.</p>
          </div>
          <div className="cards-3 mt-3">
            {CASE_STUDIES.map((c, i) => (
              <article className={`card reveal d${i + 1}`} key={c.title}>
                <span className="folio-tag">{c.tag}</span>
                <h3 className="h-md mt-1">{c.title}</h3>
                <p><strong style={{ color: 'var(--text-main)' }}>Provocarea:</strong> {c.challenge}</p>
                <p className="mt-1"><strong style={{ color: 'var(--text-main)' }}>Soluția:</strong> {c.solution}</p>
                <p className="mt-1"><strong style={{ color: 'var(--sky-300)' }}>Rezultat:</strong> {c.result}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Proces */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">Cum lucrăm</span>
            <h2 className="h-lg">De la brief la <span className="grad-text">publicare</span></h2>
          </div>
          <div className="steps mt-3">
            <div className="step reveal d1">
              <h3>Brief &amp; research</h3>
              <p>Înțelegem afacerea, publicul și obiectivele tale. Facem cercetare de cuvinte-cheie și analizăm competiția.</p>
            </div>
            <div className="step reveal d2">
              <h3>Plan de conținut</h3>
              <p>Îți propunem subiectele, structura și calendarul. Tu aprobi direcția înainte să scriem primul rând.</p>
            </div>
            <div className="step reveal d3">
              <h3>Scriere &amp; verificare</h3>
              <p>Redactorii noștri scriu, editorii verifică: corectitudine, ton, SEO, originalitate. Totul scris de oameni.</p>
            </div>
            <div className="step reveal d4">
              <h3>Livrare &amp; revizii</h3>
              <p>Primești textele gata de publicat, cu meta date incluse. Reviziile sunt parte din proces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container">
          <div className="center reveal">
            <span className="eyebrow">FAQ</span>
            <h2 className="h-lg">Întrebări despre <span className="grad-text">redactare</span></h2>
          </div>
          <Faq items={FAQ_ITEMS} />
        </div>
      </section>

      <CtaBand
        title="Hai să scriem povestea brandului tău"
        text="Spune-ne ce ai nevoie — articole, descrieri, pagini de site — și primești o ofertă corectă, adaptată proiectului."
        label="Cere ofertă gratuită"
      />
    </>
  );
}
