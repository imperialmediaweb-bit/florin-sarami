'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';

type Post = {
  slug: string;
  title: string;
  date: string;
  category?: string;
  excerpt: string;
  contentHtml: string;
  image?: string;
};

type Message = {
  id: string;
  date: string;
  formular: string;
  serviciu: string;
  nume: string;
  email: string;
  telefon: string;
  mesaj: string;
  extra: Record<string, string>;
};

const EMPTY: Post = { slug: '', title: '', date: '', category: '', excerpt: '', contentHtml: '', image: '' };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i').replace(/ș/g, 's').replace(/ț/g, 't')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);

export default function AdminPage() {
  const [stage, setStage] = useState<'login' | 'list' | 'edit'>('login');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Post>(EMPTY);
  const [isNew, setIsNew] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'articole' | 'mesaje'>('articole');
  const [messages, setMessages] = useState<Message[]>([]);

  const loadPosts = useCallback(async () => {
    const res = await fetch('/api/admin/posts/');
    if (res.status === 401) { setStage('login'); return; }
    const data = await res.json();
    setPosts(data.posts || []);
    setStage('list');
  }, []);

  const loadMessages = useCallback(async () => {
    const res = await fetch('/api/admin/messages/');
    if (res.status === 401) { setStage('login'); return; }
    const data = await res.json();
    setMessages(data.messages || []);
  }, []);

  useEffect(() => { loadPosts().catch(() => setStage('login')); }, [loadPosts]);
  useEffect(() => { if (stage === 'list' && tab === 'mesaje') loadMessages().catch(() => {}); }, [stage, tab, loadMessages]);

  async function onDeleteMessage(id: string) {
    if (!confirm('Ștergi acest mesaj?')) return;
    await fetch('/api/admin/messages/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setMessages(ms => ms.filter(m => m.id !== id));
  }

  const [replyFor, setReplyFor] = useState<string | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState('');

  function startReply(m: Message) {
    setReplyFor(m.id);
    setReplySubject(`Oferta Sarami Media — ${m.serviciu || 'proiectul tău'}`);
    setReplyText(`Bună, ${m.nume.split(' ')[0]}!\n\nMulțumim pentru mesaj. `);
    setReplyStatus('');
  }

  async function onSendReply(m: Message) {
    setBusy(true);
    setReplyStatus('');
    try {
      const res = await fetch('/api/admin/reply/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: m.email, subject: replySubject, text: replyText }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Trimiterea a eșuat.');
      setReplyStatus('✅ Oferta a plecat către ' + m.email);
      setReplyFor(null);
    } catch (err) {
      setReplyStatus('⚠ ' + (err instanceof Error ? err.message : 'Trimiterea a eșuat.'));
    } finally {
      setBusy(false);
    }
  }

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/admin/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Autentificare eșuată.');
      setPassword('');
      setUser('');
      await loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Autentificare eșuată.');
    } finally {
      setBusy(false);
    }
  }

  function startNew() {
    setEditing({ ...EMPTY, date: new Date().toISOString().slice(0, 16) });
    setIsNew(true);
    setNotice('');
    setError('');
    setStage('edit');
  }

  function startEdit(p: Post) {
    setEditing({ ...p, date: p.date.slice(0, 16) });
    setIsNew(false);
    setNotice('');
    setError('');
    setStage('edit');
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/save/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Salvarea a eșuat.');
      setNotice('✅ Salvat! Articolul e live pe site chiar acum.');
      setStage('list');
      loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Salvarea a eșuat.');
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(slug: string) {
    if (!confirm(`Sigur ștergi articolul „${slug}"? Acțiunea nu poate fi anulată.`)) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/delete/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Ștergerea a eșuat.');
      setNotice('🗑️ Șters! Modificarea e live pe site chiar acum.');
      setPosts(ps => ps.filter(p => p.slug !== slug));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ștergerea a eșuat.');
    } finally {
      setBusy(false);
    }
  }

  const filtered = posts.filter(
    p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase())
  );

  /* ---------- LOGIN ---------- */
  if (stage === 'login') {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 460 }}>
          <div className="form-card">
            <h1 className="h-md mb-2">🔐 Panou administrare</h1>
            <form onSubmit={onLogin}>
              <div className="form-field" style={{ marginBottom: 14 }}>
                <label htmlFor="admin-user">Utilizator</label>
                <input
                  id="admin-user"
                  type="text"
                  value={user}
                  onChange={e => setUser(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                />
              </div>
              <div className="form-field">
                <label htmlFor="admin-pass">Parola</label>
                <input
                  id="admin-pass"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && <p style={{ color: '#dc2626', fontSize: '.9rem', marginTop: 10 }}>⚠ {error}</p>}
              <button className="btn btn-primary mt-2" disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>
                {busy ? 'Se verifică...' : 'Intră'}
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- EDITOR ---------- */
  if (stage === 'edit') {
    return (
      <section className="section-tight">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="form-card">
            <h1 className="h-md mb-2">{isNew ? '📝 Articol nou' : `✏️ Editează: ${editing.title}`}</h1>
            <form onSubmit={onSave}>
              <div className="form-grid">
                <div className="form-field full">
                  <label>Titlu *</label>
                  <input
                    value={editing.title}
                    onChange={e =>
                      setEditing(ed => ({
                        ...ed,
                        title: e.target.value,
                        slug: isNew ? slugify(e.target.value) : ed.slug,
                      }))
                    }
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Slug (adresa URL) *</label>
                  <input
                    value={editing.slug}
                    onChange={e => setEditing(ed => ({ ...ed, slug: slugify(e.target.value) }))}
                    required
                    disabled={!isNew}
                  />
                </div>
                <div className="form-field">
                  <label>Categorie</label>
                  <input
                    value={editing.category || ''}
                    onChange={e => setEditing(ed => ({ ...ed, category: e.target.value }))}
                    placeholder="ex: Editare video"
                  />
                </div>
                <div className="form-field">
                  <label>Data publicării</label>
                  <input
                    type="datetime-local"
                    value={editing.date}
                    onChange={e => setEditing(ed => ({ ...ed, date: e.target.value }))}
                  />
                </div>
                <div className="form-field">
                  <label>Imagine de copertă (URL)</label>
                  <input
                    value={editing.image || ''}
                    onChange={e => setEditing(ed => ({ ...ed, image: e.target.value }))}
                    placeholder="https://res.cloudinary.com/..."
                  />
                </div>
                <div className="form-field full">
                  <label>Rezumat (opțional — se generează automat din conținut)</label>
                  <input
                    value={editing.excerpt}
                    onChange={e => setEditing(ed => ({ ...ed, excerpt: e.target.value }))}
                  />
                </div>
                <div className="form-field full">
                  <label>Conținut * (HTML sau text simplu — paragrafele se formatează automat)</label>
                  <textarea
                    style={{ minHeight: 320, fontFamily: 'monospace', fontSize: '.9rem' }}
                    value={editing.contentHtml}
                    onChange={e => setEditing(ed => ({ ...ed, contentHtml: e.target.value }))}
                    required
                  />
                </div>
              </div>
              {error && <p style={{ color: '#dc2626', fontSize: '.9rem', marginTop: 12 }}>⚠ {error}</p>}
              <div className="btn-row mt-2">
                <button className="btn btn-primary" disabled={busy}>
                  {busy ? 'Se salvează...' : '💾 Salvează articolul'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setStage('list')} disabled={busy}>
                  Renunță
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- LISTĂ (Articole | Mesaje) ---------- */
  if (tab === 'mesaje') {
    return (
      <section className="section-tight">
        <div className="container" style={{ maxWidth: 1000 }}>
          <div className="form-card">
            <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
              <button className="btn btn-ghost" onClick={() => setTab('articole')}>📚 Articole</button>
              <button className="btn btn-primary" onClick={() => loadMessages()}>✉️ Mesaje & Briefuri ({messages.length})</button>
            </div>
            {messages.length === 0 && (
              <p style={{ color: 'var(--text-faint)' }}>Niciun mesaj încă. Mesajele din formularele de contact și briefurile completate de clienți apar aici automat (și pe emailul contact@sarami.ro).</p>
            )}
            <div style={{ display: 'grid', gap: 12 }}>
              {messages.map(m => (
                <details key={m.id} style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 13, padding: '14px 18px' }}>
                  <summary style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', listStyle: 'none' }}>
                    <span>
                      <b>{m.formular === 'Contact' ? '💬' : '📋'} {m.formular}</b> — {m.nume}
                      <span style={{ color: 'var(--text-faint)', fontSize: '.82rem' }}> • {m.serviciu || 'general'} • {new Date(m.date).toLocaleString('ro-RO')}</span>
                    </span>
                    <span style={{ color: 'var(--blue-600)', fontSize: '.85rem', fontWeight: 600 }}>deschide ▾</span>
                  </summary>
                  <div style={{ marginTop: 14, fontSize: '.93rem', color: 'var(--text-dim)', display: 'grid', gap: 6 }}>
                    <div><b>Email:</b> <a href={`mailto:${m.email}`} style={{ color: 'var(--blue-600)' }}>{m.email}</a></div>
                    {m.telefon && <div><b>Telefon:</b> <a href={`tel:${m.telefon}`} style={{ color: 'var(--blue-600)' }}>{m.telefon}</a></div>}
                    {Object.entries(m.extra || {}).filter(([, v]) => String(v || '').trim()).map(([k, v]) => (
                      <div key={k}><b>{k}:</b> {String(v)}</div>
                    ))}
                    <div style={{ marginTop: 6, padding: '12px 14px', background: '#fff', borderRadius: 10, border: '1px solid var(--line)', whiteSpace: 'pre-wrap' }}>{m.mesaj}</div>

                    {replyFor === m.id ? (
                      <div style={{ marginTop: 10, display: 'grid', gap: 10, padding: '14px', background: '#fff', borderRadius: 10, border: '1px solid var(--ring)' }}>
                        <b style={{ color: 'var(--text-main)' }}>✉️ Răspunde cu oferta către {m.email}</b>
                        <div className="form-field">
                          <label>Subiect</label>
                          <input value={replySubject} onChange={e => setReplySubject(e.target.value)} />
                        </div>
                        <div className="form-field">
                          <label>Mesajul tău (oferta)</label>
                          <textarea style={{ minHeight: 160 }} value={replyText} onChange={e => setReplyText(e.target.value)} />
                        </div>
                        <div className="btn-row">
                          <button className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '.9rem' }} disabled={busy} onClick={() => onSendReply(m)}>
                            {busy ? 'Se trimite...' : 'Trimite oferta'}
                          </button>
                          <button className="btn btn-ghost" style={{ padding: '10px 22px', fontSize: '.9rem' }} onClick={() => setReplyFor(null)}>Renunță</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '.85rem' }} onClick={() => startReply(m)}>✉️ Răspunde cu ofertă</button>
                        <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: '.82rem', color: '#dc2626', borderColor: 'rgba(220,38,38,.4)' }} onClick={() => onDeleteMessage(m.id)}>Șterge</button>
                      </div>
                    )}
                    {replyStatus && replyFor !== m.id && <p style={{ fontWeight: 600, fontSize: '.88rem' }}>{replyStatus}</p>}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-tight">
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="form-card">
          <div style={{ display: 'flex', gap: 10, marginBottom: 22, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => loadPosts()}>📚 Articole ({posts.length})</button>
            <button className="btn btn-ghost" onClick={() => setTab('mesaje')}>✉️ Mesaje & Briefuri</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
            <h1 className="h-md" style={{ margin: 0 }}>Articolele site-ului</h1>
            <button className="btn btn-primary" onClick={startNew}>+ Articol nou</button>
          </div>
          {notice && <p style={{ color: '#059669', fontSize: '.92rem', marginBottom: 14, fontWeight: 600 }}>{notice}</p>}
          {error && <p style={{ color: '#dc2626', fontSize: '.92rem', marginBottom: 14 }}>⚠ {error}</p>}
          <div className="form-field" style={{ marginBottom: 18 }}>
            <input placeholder="🔍 Caută după titlu sau slug..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {filtered.map(p => (
              <div
                key={p.slug}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14,
                  padding: '14px 18px', background: 'var(--bg)', borderRadius: 13,
                  border: '1px solid var(--line)', flexWrap: 'wrap',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <b style={{ display: 'block', fontSize: '.96rem' }}>{p.title}</b>
                  <span style={{ color: 'var(--text-faint)', fontSize: '.8rem' }}>
                    /blog/{p.slug} • {new Date(p.date).toLocaleDateString('ro-RO')}
                    {p.category ? ` • ${p.category}` : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <a className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '.85rem' }} href={`/blog/${p.slug}/`} target="_blank" rel="noopener noreferrer">Vezi</a>
                  <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '.85rem' }} onClick={() => startEdit(p)}>Editează</button>
                  <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '.85rem', color: '#dc2626', borderColor: 'rgba(220,38,38,.4)' }} onClick={() => onDelete(p.slug)} disabled={busy}>Șterge</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p style={{ color: 'var(--text-faint)' }}>Niciun articol găsit.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
