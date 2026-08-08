'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { FormEvent } from 'react';

/**
 * Formularul de contact — trimite mesajele prin Resend, printr-un endpoint
 * securizat de pe server (app/api/contact). Cheia API stă doar în variabilele
 * de mediu (Railway → Variables → RESEND_API_KEY), niciodată în browser.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nume: fd.get('nume'),
          email: fd.get('email'),
          telefon: fd.get('telefon'),
          serviciu: fd.get('serviciu'),
          mesaj: fd.get('mesaj'),
          consent: fd.get('consent') === 'on',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Trimiterea a eșuat.');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Trimiterea a eșuat.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="center" style={{ padding: '40px 10px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
        <h3 className="h-md">Mesajul tău a ajuns la noi!</h3>
        <p style={{ color: 'var(--text-dim)', marginBottom: 8 }}>
          Mulțumim că ne-ai scris — primești imediat și un email de confirmare.
        </p>
        <p style={{ color: 'var(--text-dim)', marginBottom: 20 }}>
          Revenim cu răspunsul de obicei <strong style={{ color: 'var(--text-main)' }}>în aceeași zi lucrătoare</strong>. ☕
        </p>
        <button className="btn btn-ghost" onClick={() => setStatus('idle')}>Trimite alt mesaj</button>
      </div>
    );
  }

  return (
    <form id="contact-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="f-nume">Nume complet *</label>
          <input type="text" id="f-nume" name="nume" required placeholder="Numele tău" />
        </div>
        <div className="form-field">
          <label htmlFor="f-email">Email *</label>
          <input type="email" id="f-email" name="email" required placeholder="adresa@email.ro" />
        </div>
        <div className="form-field">
          <label htmlFor="f-telefon">Telefon</label>
          <input type="tel" id="f-telefon" name="telefon" placeholder="07xx xxx xxx" />
        </div>
        <div className="form-field">
          <label htmlFor="f-serviciu">Serviciul dorit *</label>
          <select id="f-serviciu" name="serviciu" required defaultValue="">
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
            name="mesaj"
            required
            placeholder="Povestește-ne despre proiectul tău: ce materiale ai, ce vrei să obții, pentru ce platformă..."
          />
        </div>
        <div className="form-field full">
          <label className="form-consent">
            <input type="checkbox" id="gdpr-consent" name="consent" required />
            <span>
              Sunt de acord cu prelucrarea datelor mele personale conform{' '}
              <Link href="/politica-confidentialitate">Politicii de confidențialitate</Link>. *
            </span>
          </label>
        </div>
        {status === 'error' && (
          <div className="form-field full">
            <p style={{ color: '#dc2626', fontSize: '.92rem', fontWeight: 600 }}>⚠ {errorMsg}</p>
          </div>
        )}
        <div className="form-field full">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Se trimite...' : 'Trimite mesajul'}
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
