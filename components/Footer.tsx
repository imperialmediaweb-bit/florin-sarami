import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="logo-pill"><Logo /></span>
            <p>Transformăm filmările tale în videoclipuri care atrag atenția, iar ideile tale în conținut care face diferența.</p>
          </div>
          <div>
            <h4>Navigare</h4>
            <div className="footer-links">
              <Link href="/">Home</Link>
              <Link href="/despre-noi">Despre noi</Link>
              <Link href="/editare-video">Editare video</Link>
              <Link href="/portofoliu">Portofoliu</Link>
              <Link href="/redactare-continut">Redactare conținut</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>
          <div>
            <h4>Legal</h4>
            <div className="footer-links">
              <Link href="/termeni-si-conditii">Termeni și condiții</Link>
              <Link href="/politica-confidentialitate">Politica de confidențialitate</Link>
              <Link href="/politica-cookies">Politica de cookies</Link>
            </div>
          </div>
          <div>
            <h4>Contact</h4>
            <div className="footer-links">
              <a href="mailto:contact@sarami.ro">contact@sarami.ro</a>
              <Link href="/contact">Formular de contact</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Sarami Media. Toate drepturile rezervate.</span>
          <span>Creat cu ♥ în România</span>
        </div>
      </div>
    </footer>
  );
}
