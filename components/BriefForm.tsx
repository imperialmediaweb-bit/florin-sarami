'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { FormEvent } from 'react';

export type BriefField = {
  name: string;
  label: string;
  type: 'text' | 'select' | 'textarea' | 'checkboxes';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  full?: boolean;
};

/**
 * Formular de brief generic — câmpurile de bază (nume/email/telefon) plus
 * câmpurile specifice serviciului. Trimite prin /api/contact (Resend),
 * cu toate răspunsurile ca perechi etichetă → valoare în email.
 */
export default function BriefForm({
  formular,
  serviciu,
  fields,
  mesajLabel = 'Descrie proiectul tău *',
  mesajPlaceholder = 'Spune-ne pe scurt despre proiect...',
}: {
  formular: string;
  serviciu: string;
  fields: BriefField[];
  mesajLabel?: string;
  mesajPlaceholder?: string;
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const extra: Record<string, string> = {};
    for (const f of fields) {
      if (f.type === 'checkboxes') {
        extra[f.label.replace(/\s*\*\s*$/, '')] = fd.getAll(f.name).join(', ');
      } else {
        extra[f.label.replace(/\s*\*\s*$/, '')] = String(fd.get(f.name) || '');
      }
    }
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formular,
          serviciu,
          nume: fd.get('nume'),
          email: fd.get('email'),
          telefon: fd.get('telefon'),
          mesaj: fd.get('mesaj'),
          consent: fd.get('consent') === 'on',
          extra,
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
        <h3 className="h-md">Brief-ul tău a plecat spre noi!</h3>
        <p style={{ color: 'var(--text-dim)', marginBottom: 8, maxWidth: 480, marginInline: 'auto' }}>
          Mulțumim pentru detalii — cu ele pregătim o ofertă pe măsura proiectului tău. Ce urmează:
        </p>
        <div style={{ textAlign: 'left', maxWidth: 420, margin: '16px auto 22px', color: 'var(--text-dim)', display: 'grid', gap: 8 }}>
          <span>📬 Primești imediat un email de confirmare</span>
          <span>👀 Citim brief-ul cu atenție și calculăm oferta</span>
          <span>💌 Revenim cu oferta — de obicei în aceeași zi lucrătoare</span>
        </div>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <a href="/portofoliu/" className="btn btn-primary">▶ Vezi portofoliul între timp</a>
          <button className="btn btn-ghost" onClick={() => setStatus('idle')}>Trimite alt brief</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label>Nume complet *</label>
          <input type="text" name="nume" required placeholder="Numele tău" />
        </div>
        <div className="form-field">
          <label>Email *</label>
          <input type="email" name="email" required placeholder="adresa@email.ro" />
        </div>
        <div className="form-field">
          <label>Telefon</label>
          <input type="tel" name="telefon" placeholder="07xx xxx xxx" />
        </div>

        {fields.map(f => (
          <div className={`form-field${f.full || f.type === 'textarea' || f.type === 'checkboxes' ? ' full' : ''}`} key={f.name}>
            <label>{f.label}</label>
            {f.type === 'text' && <input type="text" name={f.name} required={f.required} placeholder={f.placeholder} />}
            {f.type === 'select' && (
              <select name={f.name} required={f.required} defaultValue="">
                <option value="" disabled>Alege...</option>
                {f.options?.map(o => <option key={o}>{o}</option>)}
              </select>
            )}
            {f.type === 'textarea' && (
              <textarea name={f.name} required={f.required} placeholder={f.placeholder} style={{ minHeight: 90 }} />
            )}
            {f.type === 'checkboxes' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 22px', paddingTop: 4 }}>
                {f.options?.map(o => (
                  <label key={o} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '.93rem', color: 'var(--text-dim)', cursor: 'pointer' }}>
                    <input type="checkbox" name={f.name} value={o} style={{ accentColor: 'var(--blue-600)', width: 16, height: 16 }} />
                    {o}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="form-field full">
          <label>{mesajLabel}</label>
          <textarea name="mesaj" required placeholder={mesajPlaceholder} />
        </div>
        <div className="form-field full">
          <label className="form-consent">
            <input type="checkbox" name="consent" required />
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
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={status === 'sending'}>
            {status === 'sending' ? 'Se trimite...' : 'Trimite brief-ul'}
          </button>
        </div>
      </div>
      <p className="form-note">* câmpuri obligatorii. Primești oferta de obicei în aceeași zi lucrătoare.</p>
    </form>
  );
}
