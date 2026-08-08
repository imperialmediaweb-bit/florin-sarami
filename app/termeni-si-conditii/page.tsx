import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Termeni și condiții',
  description: 'Termenii și condițiile de utilizare a site-ului sarami.ro și a serviciilor Sarami Media.',
};

export default function TermeniPage() {
  return (
    <section className="section">
      <div className="container">
        <div className="legal">
          <h1>Termeni și condiții</h1>
          <p className="legal-updated">Ultima actualizare: august 2026</p>

          <h2>1. Informații generale</h2>
          <p>
            Site-ul <strong>sarami.ro</strong> (denumit în continuare „Site-ul") este operat de{' '}
            <strong>SARAMI MEDIA S.R.L.</strong> (denumită în continuare „Sarami Media", „noi"), cu sediul în România.
            {/* Completează datele complete ale firmei: CUI, Reg. Com., adresă */}
          </p>
          <p>Utilizarea Site-ului implică acceptarea integrală a acestor Termeni și condiții. Dacă nu ești de acord cu ei, te rugăm să nu utilizezi Site-ul.</p>

          <h2>2. Serviciile oferite</h2>
          <p>Sarami Media oferă servicii de creare de conținut, incluzând, fără a se limita la:</p>
          <ul>
            <li>editare video (montaj, subtitrări, tranziții, corecții de culoare, efecte vizuale, optimizare pentru platforme social media);</li>
            <li>redactare de conținut (articole de blog, descrieri de produse, pagini de prezentare, comunicate de presă, advertoriale).</li>
          </ul>
          <p>Detaliile fiecărei colaborări (volum, termene, preț, număr de revizii) se stabilesc prin ofertă și/sau contract încheiat separat cu fiecare client.</p>

          <h2>3. Oferte și prețuri</h2>
          <p>Prețurile sunt stabilite personalizat, în funcție de complexitatea fiecărui proiect. Ofertele transmise sunt valabile pentru perioada menționată în cuprinsul lor. Prețurile afișate sau comunicate nu includ TVA decât dacă se specifică altfel.</p>

          <h2>4. Drepturi de proprietate intelectuală</h2>
          <p>Conținutul Site-ului (texte, grafică, logo, elemente de design) aparține Sarami Media și este protejat de legislația privind drepturile de autor. Este interzisă copierea, reproducerea sau distribuirea acestuia fără acordul nostru scris.</p>
          <p>Materialele realizate pentru clienți (video sau texte) devin proprietatea clientului după achitarea integrală a contravalorii serviciilor, dacă nu se convine altfel prin contract. Sarami Media își rezervă dreptul de a include lucrările realizate în portofoliul propriu, cu excepția cazului în care clientul solicită expres contrariul.</p>

          <h2>5. Materialele furnizate de client</h2>
          <p>Clientul garantează că deține drepturile necesare asupra materialelor furnizate spre editare sau documentare (filmări, imagini, texte, muzică) și că utilizarea lor nu încalcă drepturile unor terți. Sarami Media nu răspunde pentru încălcări ale drepturilor de autor generate de materialele furnizate de client.</p>

          <h2>6. Livrare și revizii</h2>
          <p>Termenele de livrare se stabilesc pentru fiecare proiect în parte. Numărul de revizii incluse se menționează în ofertă. Reviziile suplimentare sau modificările majore de brief pot face obiectul unor costuri suplimentare, comunicate în prealabil.</p>

          <h2>7. Limitarea răspunderii</h2>
          <p>Sarami Media depune toate eforturile pentru a oferi servicii de calitate, însă nu garantează rezultate specifice (de ex. un anumit număr de vizualizări, poziții în motoarele de căutare sau conversii), acestea depinzând de factori externi. Site-ul este furnizat „ca atare"; nu garantăm funcționarea neîntreruptă sau lipsită de erori a acestuia.</p>

          <h2>8. Date personale și cookies</h2>
          <p>
            Prelucrarea datelor personale este descrisă în <Link href="/politica-confidentialitate">Politica de confidențialitate</Link>,
            iar utilizarea modulelor cookie în <Link href="/politica-cookies">Politica de cookies</Link>.
          </p>

          <h2>9. Modificarea termenilor</h2>
          <p>Ne rezervăm dreptul de a modifica acești Termeni și condiții. Versiunea actualizată se publică pe această pagină, cu data ultimei actualizări. Continuarea utilizării Site-ului după publicare echivalează cu acceptarea modificărilor.</p>

          <h2>10. Legea aplicabilă și litigii</h2>
          <p>
            Acești termeni sunt guvernați de legea română. Eventualele litigii se vor soluționa pe cale amiabilă, iar în caz contrar, de instanțele competente din România.
            Consumatorii pot apela și la platforma europeană de soluționare online a litigiilor (<a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">SOL</a>)
            sau la <a href="https://anpc.ro" target="_blank" rel="noopener noreferrer">ANPC</a>.
          </p>

          <h2>11. Contact</h2>
          <p>Pentru orice întrebări legate de acești termeni, ne poți scrie la <a href="mailto:contact@sarami.ro">contact@sarami.ro</a>.</p>
        </div>
      </div>
    </section>
  );
}
