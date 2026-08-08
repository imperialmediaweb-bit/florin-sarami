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
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Post>(EMPTY);
  const [isNew, setIsNew] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const loadPosts = useCallback(async () => {
    const res = await fetch('/api/admin/posts/');
    if (res.status === 401) { setStage('login'); return; }
    const data = await res.json();
    setPosts(data.posts || []);
    setStage('list');
  }, []);

  useEffect(() => { loadPosts().catch(() => setStage('login')); }, [loadPosts]);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await fetch('/api/admin/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Autentificare eșuată.');
      setPassword('');
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
      setNotice('✅ Salvat în GitHub! Site-ul se actualizează automat în ~2-3 minute (redeploy Railway).');
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
      setNotice('🗑️ Șters! Site-ul se actualizează automat în ~2-3 minute.');
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
              <div className="form-field">
                <label htmlFor="admin-pass">Parola</label>
                <input
                  id="admin-pass"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoFocus
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

  /* ---------- LISTĂ ---------- */
  return (
    <section className="section-tight">
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="form-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
            <h1 className="h-md" style={{ margin: 0 }}>📚 Articole ({posts.length})</h1>
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
