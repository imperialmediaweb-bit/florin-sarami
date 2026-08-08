import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politica de confidențialitate',
  description: 'Politica de confidențialitate a site-ului sarami.ro — cum colectăm, folosim și protejăm datele tale personale, conform GDPR.',
};

export default function ConfidentialitatePage() {
  return (
    <section className="section">
      <div className="container">
        <div className="legal">
          <h1>Politica de confidențialitate</h1>
          <p className="legal-updated">Ultima actualizare: august 2026</p>

          <p>
            Această politică explică modul în care <strong>SARAMI MEDIA S.R.L.</strong> („Sarami Media", „noi") colectează, utilizează și protejează datele tale cu
            caracter personal atunci când folosești site-ul <strong>sarami.ro</strong>, în conformitate cu Regulamentul (UE) 2016/679 („GDPR") și legislația română aplicabilă.
          </p>

          <h2>1. Operatorul de date</h2>
          <p>
            Operatorul datelor tale personale este SARAMI MEDIA S.R.L.
            {/* Completează: CUI, Reg. Com., adresa sediului */}{' '}
            Ne poți contacta oricând la <a href="mailto:contact@sarami.ro">contact@sarami.ro</a>.
          </p>

          <h2>2. Ce date colectăm</h2>
          <h3>a) Date furnizate direct de tine</h3>
          <ul>
            <li><strong>Formularul de contact:</strong> nume, adresă de email, număr de telefon (opțional), serviciul dorit și conținutul mesajului.</li>
            <li><strong>Corespondență:</strong> datele incluse în emailurile pe care ni le trimiți.</li>
            <li><strong>Colaborări:</strong> date de facturare și contractuale, dacă devii client.</li>
          </ul>
          <h3>b) Date colectate automat</h3>
          <ul>
            <li>Date tehnice uzuale (adresă IP, tip de browser, pagini vizitate) prin module cookie și tehnologii similare — detalii în <Link href="/politica-cookies">Politica de cookies</Link>.</li>
          </ul>

          <h2>3. Scopurile și temeiurile prelucrării</h2>
          <ul>
            <li><strong>Răspuns la solicitări și oferte</strong> — temei: demersuri precontractuale la cererea ta (art. 6 alin. 1 lit. b GDPR) și consimțământul exprimat prin bifarea căsuței din formular (art. 6 alin. 1 lit. a).</li>
            <li><strong>Executarea contractelor</strong> — temei: executarea contractului (art. 6 alin. 1 lit. b).</li>
            <li><strong>Facturare și obligații legale</strong> — temei: obligație legală (art. 6 alin. 1 lit. c).</li>
            <li><strong>Funcționarea și securitatea site-ului</strong> — temei: interes legitim (art. 6 alin. 1 lit. f).</li>
          </ul>

          <h2>4. Cât timp păstrăm datele</h2>
          <ul>
            <li>Mesajele din formularul de contact: maximum 2 ani de la ultima comunicare, dacă nu rezultă o colaborare.</li>
            <li>Documentele contabile: 10 ani, conform legislației fiscale.</li>
            <li>Datele contractuale: pe durata colaborării plus termenele legale de arhivare.</li>
          </ul>

          <h2>5. Cui transmitem datele</h2>
          <p>Nu vindem și nu închiriem datele tale. Le putem partaja doar cu:</p>
          <ul>
            <li>furnizori de servicii necesari funcționării (găzduire web, servicii de email/transmitere formulare, contabilitate), pe bază de contracte care asigură protecția datelor;</li>
            <li>autorități publice, atunci când legea ne obligă.</li>
          </ul>
          <p>Dacă unii furnizori prelucrează date în afara Spațiului Economic European, ne asigurăm că există garanții adecvate (de ex. clauze contractuale standard).</p>

          <h2>6. Drepturile tale</h2>
          <p>Conform GDPR, ai următoarele drepturi:</p>
          <ul>
            <li>dreptul de acces la datele tale;</li>
            <li>dreptul la rectificarea datelor inexacte;</li>
            <li>dreptul la ștergerea datelor („dreptul de a fi uitat");</li>
            <li>dreptul la restricționarea prelucrării;</li>
            <li>dreptul la portabilitatea datelor;</li>
            <li>dreptul de opoziție la prelucrare;</li>
            <li>dreptul de a-ți retrage consimțământul în orice moment, fără a afecta legalitatea prelucrării anterioare;</li>
            <li>
              dreptul de a depune o plângere la{' '}
              <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer">
                Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)
              </a>.
            </li>
          </ul>
          <p>Pentru exercitarea acestor drepturi, scrie-ne la <a href="mailto:contact@sarami.ro">contact@sarami.ro</a>. Răspundem în cel mult 30 de zile.</p>

          <h2>7. Securitatea datelor</h2>
          <p>Aplicăm măsuri tehnice și organizatorice rezonabile pentru a proteja datele împotriva accesului neautorizat, pierderii sau divulgării (conexiune securizată HTTPS, acces restricționat la date, parteneri verificați).</p>

          <h2>8. Datele minorilor</h2>
          <p>Serviciile noastre se adresează persoanelor de peste 18 ani. Nu colectăm cu bună știință date ale minorilor.</p>

          <h2>9. Modificări ale politicii</h2>
          <p>Putem actualiza periodic această politică. Versiunea curentă, împreună cu data actualizării, este publicată pe această pagină.</p>

          <h2>10. Contact</h2>
          <p>Întrebări despre protecția datelor? Scrie-ne la <a href="mailto:contact@sarami.ro">contact@sarami.ro</a>.</p>
        </div>
      </div>
    </section>
  );
}
