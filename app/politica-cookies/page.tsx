import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politica de cookies',
  description: 'Politica de utilizare a modulelor cookie pe site-ul sarami.ro.',
};

export default function CookiesPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="legal">
          <h1>Politica de cookies</h1>
          <p className="legal-updated">Ultima actualizare: august 2026</p>

          <h2>1. Ce sunt cookie-urile?</h2>
          <p>Cookie-urile sunt fișiere text de mici dimensiuni pe care un site le salvează pe dispozitivul tău (computer, telefon, tabletă) atunci când îl vizitezi. Ele ajută site-ul să funcționeze corect, să rețină preferințele tale și să înțeleagă cum este utilizat.</p>

          <h2>2. Ce cookie-uri folosim</h2>
          <h3>a) Cookie-uri strict necesare</h3>
          <p>Acestea sunt esențiale pentru funcționarea site-ului și nu pot fi dezactivate:</p>
          <ul>
            <li><strong>sarami-cookie-consent</strong> (stocare locală) — reține alegerea ta privind acordul pentru cookie-uri, ca să nu-ți afișăm bannerul la fiecare vizită. Durată: până la ștergerea manuală.</li>
          </ul>
          <h3>b) Cookie-uri ale terților</h3>
          <ul>
            <li><strong>Google Fonts</strong> — fonturile site-ului sunt încărcate de pe serverele Google, care pot înregistra date tehnice (adresa IP).</li>
            <li><strong>YouTube</strong> — paginile cu videoclipuri încorporate (de ex. Portofoliu) pot seta cookie-uri YouTube/Google atunci când redai un clip.</li>
            <li><strong>FormSubmit</strong> — serviciul care procesează mesajele din formularul de contact.</li>
          </ul>
          <p>Dacă vom adăuga instrumente de analiză a traficului (de ex. Google Analytics), vom actualiza această pagină și vom cere consimțământul corespunzător.</p>

          <h2>3. Cum poți controla cookie-urile</h2>
          <p>Poți gestiona sau șterge cookie-urile din setările browserului tău. Reține că blocarea anumitor cookie-uri poate afecta funcționarea unor părți din site. Instrucțiuni pentru browserele populare:</p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/ro/kb/cookie-urile" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/ro-ro/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/ro-ro/microsoft-edge" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>

          <h2>4. Date personale</h2>
          <p>Informații despre modul în care prelucrăm datele personale găsești în <Link href="/politica-confidentialitate">Politica de confidențialitate</Link>.</p>

          <h2>5. Contact</h2>
          <p>Pentru întrebări legate de această politică, scrie-ne la <a href="mailto:contact@sarami.ro">contact@sarami.ro</a>.</p>
        </div>
      </div>
    </section>
  );
}
