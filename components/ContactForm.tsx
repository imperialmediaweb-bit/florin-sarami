'use client';

import Link from 'next/link';

/**
 * Formularul trimite mesajele către contact@sarami.ro prin FormSubmit.
 * IMPORTANT: la primul mesaj trimis, FormSubmit livrează un email de confirmare
 * pe contact@sarami.ro — apasă linkul de activare din el o singură dată.
 */
export default function ContactForm() {
  return (
    <form id="contact-form" action="https://formsubmit.co/contact@sarami.ro" method="POST">
      <input type="hidden" name="_subject" value="Mesaj nou de pe sarami.ro" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="true" />
      <input type="hidden" name="_next" value="https://sarami.ro/multumim/" />
      <input type="text" name="_honey" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="f-nume">Nume complet *</label>
          <input type="text" id="f-nume" name="Nume" required placeholder="Numele tău" />
        </div>
        <div className="form-field">
          <label htmlFor="f-email">Email *</label>
          <input type="email" id="f-email" name="Email" required placeholder="adresa@email.ro" />
        </div>
        <div className="form-field">
          <label htmlFor="f-telefon">Telefon</label>
          <input type="tel" id="f-telefon" name="Telefon" placeholder="07xx xxx xxx" />
        </div>
        <div className="form-field">
          <label htmlFor="f-serviciu">Serviciul dorit *</label>
          <select id="f-serviciu" name="Serviciu" required defaultValue="">
            <option value="" disabled>Alege serviciul</option>
            <option>Editare video</option>
            <option>Redactare conținut</option>
            <option>Editare video + Redactare conținut</option>
            <option>Altceva</option>
          </select>
        </div>
        <div className="form-field full">
          <label htmlFor="f-mesaj">Mesajul tău *</label>
          <textarea
            id="f-mesaj"
            name="Mesaj"
            required
            placeholder="Povestește-ne despre proiectul tău: ce materiale ai, ce vrei să obții, pentru ce platformă..."
          />
        </div>
        <div className="form-field full">
          <label className="form-consent">
            <input type="checkbox" id="gdpr-consent" required />
            <span>
              Sunt de acord cu prelucrarea datelor mele personale conform{' '}
              <Link href="/politica-confidentialitate">Politicii de confidențialitate</Link>. *
            </span>
          </label>
        </div>
        <div className="form-field full">
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Trimite mesajul
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
      </div>
      <p className="form-note">* câmpuri obligatorii. Răspundem de obicei în aceeași zi lucrătoare.</p>
    </form>
  );
}
