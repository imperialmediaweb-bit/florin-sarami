'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import RichEditor from '@/components/RichEditor';
import UploadImage from '@/components/UploadImage';
import UploadVideo from '@/components/UploadVideo';

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

type FolioItem = {
  id: string;
  cat: 'shorts' | 'longform' | 'social' | 'promo' | 'podcast' | 'eveniment' | 'redactare';
  title: string;
  desc: string;
  videoId?: string;
  tiktok?: string;
  video?: string;
  link?: string;
  image?: string;
};

const FOLIO_CATS = [
  { key: 'shorts', label: 'Shorts' },
  { key: 'longform', label: 'Long Form' },
  { key: 'redactare', label: 'Redactare conținut' },
] as const;

type Testimonial = { id: string; name: string; role: string; text: string; image?: string };

const EMPTY: Post = { slug: '', title: '', date: '', category: '', excerpt: '', contentHtml: '', image: '' };
const EMPTY_FOLIO: FolioItem = { id: '', cat: 'shorts', title: '', desc: '', videoId: '', tiktok: '', video: '', link: '' };
const EMPTY_TESTI: Testimonial = { id: '', name: '', role: '', text: '', image: '' };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i').replace(/ș/g, 's').replace(/ț/g, 't')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);

/** extrage ID-ul YouTube din orice formă de link (sau îl acceptă direct) */
const parseYoutubeId = (input: string): string => {
  const s = input.trim();
  const m = s.match(/(?:youtu\.be\/|v=|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{5,20})/);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{5,20}$/.test(s) ? s : '';
};

/** extrage ID-ul numeric al clipului dintr-un link TikTok (sau îl acceptă direct) */
const parseTiktokId = (input: string): string => {
  const s = input.trim();
  const m = s.match(/tiktok\.com\/.*(?:video|photo)\/(\d{5,25})/);
  if (m) return m[1];
  return /^\d{5,25}$/.test(s) ? s : '';
};

export default function AdminPage() {
  const [view, setView] = useState<'login' | 'acasa' | 'articole' | 'editor' | 'portofoliu' | 'testimoniale' | 'mesaje' | 'setari'>('login');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Post>(EMPTY);
  const [isNew, setIsNew] = useState(true);

  const [messages, setMessages] = useState<Message[]>([]);
  const [folio, setFolio] = useState<FolioItem[]>([]);
  const [folioEdit, setFolioEdit] = useState<FolioItem | null>(null);
  const [testi, setTesti] = useState<Testimonial[]>([]);
  const [testiEdit, setTestiEdit] = useState<Testimonial | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});

  const [replyFor, setReplyFor] = useState<string | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyText, setReplyText] = useState('');

  /* ---------- încărcare date ---------- */
  const loadPosts = useCallback(async () => {
    const res = await fetch('/api/admin/posts/');
    if (res.status === 401) { setView('login'); return false; }
    setPosts((await res.json()).posts || []);
    return true;
  }, []);

  const loadMessages = useCallback(async () => {
    const res = await fetch('/api/admin/messages/');
    if (res.status === 401) { setView('login'); return; }
    setMessages((await res.json()).messages || []);
  }, []);

  const loadFolio = useCallback(async () => {
    const res = await fetch('/api/admin/portfolio/');
    if (res.status === 401) { setView('login'); return; }
    setFolio((await res.json()).items || []);
  }, []);

  const loadSettings = useCallback(async () => {
    const res = await fetch('/api/admin/settings/');
    if (res.status === 401) { setView('login'); return; }
    setSettings((await res.json()).settings || {});
  }, []);

  useEffect(() => {
    loadPosts().then(ok => {
      if (ok) {
        setView('acasa');
        // încarcă restul datelor pentru statisticile de pe Acasă
        loadMessages().catch(() => {});
        loadFolio().catch(() => {});
        loadTesti().catch(() => {});
        loadSettings().catch(() => {});
      }
    }).catch(() => setView('login'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadPosts]);

  const loadTesti = useCallback(async () => {
    const res = await fetch('/api/admin/testimonials/');
    if (res.status === 401) { setView('login'); return; }
    setTesti((await res.json()).items || []);
  }, []);

  useEffect(() => {
    if (view === 'mesaje') loadMessages().catch(() => {});
    if (view === 'portofoliu') loadFolio().catch(() => {});
    if (view === 'testimoniale') loadTesti().catch(() => {});
  }, [view, loadMessages, loadFolio, loadTesti]);

  const go = (v: typeof view) => { setNotice(''); setError(''); setView(v); };

  /* ---------- autentificare ---------- */
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
      setView('articole');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Autentificare eșuată.');
    } finally {
      setBusy(false);
    }
  }

  async function onLogout() {
    await fetch('/api/admin/logout/', { method: 'POST' });
    setView('login');
  }

  /* ---------- articole ---------- */
  function startNew() {
    setEditing({ ...EMPTY, date: new Date().toISOString().slice(0, 16) });
    setIsNew(true);
    go('editor');
  }

  function startEdit(p: Post) {
    setEditing({ ...p, date: p.date.slice(0, 16) });
    setIsNew(false);
    go('editor');
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
      setView('articole');
      loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Salvarea a eșuat.');
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(slug: string) {
    if (!confirm(`Sigur ștergi articolul „${slug}"?`)) return;
    setBusy(true);
    try {
      const res = await fetch('/api/admin/delete/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        setNotice('🗑️ Articol șters.');
        setPosts(ps => ps.filter(p => p.slug !== slug));
      }
    } finally {
      setBusy(false);
    }
  }

  /* ---------- portofoliu ---------- */
  async function saveFolio(items: FolioItem[]) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/portfolio/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Salvarea a eșuat.');
      setFolio(items);
      setFolioEdit(null);
      setNotice('✅ Portofoliul e actualizat pe site chiar acum.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Salvarea a eșuat.');
    } finally {
      setBusy(false);
    }
  }

  function submitFolioEdit(e: FormEvent) {
    e.preventDefault();
    if (!folioEdit) return;
    // la „redactare" contează doar linkul articolului — sursele video se golesc
    const isText = folioEdit.cat === 'redactare';
    const item = {
      ...folioEdit,
      videoId: isText ? undefined : parseYoutubeId(folioEdit.videoId || '') || undefined,
      tiktok: isText ? undefined : parseTiktokId(folioEdit.tiktok || '') || undefined,
      video: isText ? undefined : folioEdit.video || undefined,
      link: isText ? folioEdit.link || undefined : undefined,
    };
    if (!isText && (folioEdit.tiktok || '').trim() && !item.tiktok) {
      setError('Linkul TikTok nu e recunoscut — folosește linkul complet al clipului (tiktok.com/@user/video/...), nu linkul scurt de share.');
      return;
    }
    if (!item.title.trim()) { setError('Titlul e obligatoriu.'); return; }
    const exists = folio.some(f => f.id === item.id);
    const items = exists
      ? folio.map(f => (f.id === item.id ? item : f))
      : [...folio, { ...item, id: `item-${Date.now()}` }];
    saveFolio(items);
  }

  const moveFolio = (idx: number, dir: -1 | 1) => {
    const items = [...folio];
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    [items[idx], items[j]] = [items[j], items[idx]];
    saveFolio(items);
  };

  /* ---------- testimoniale ---------- */
  async function saveTesti(items: Testimonial[]) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/testimonials/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Salvarea a eșuat.');
      setTesti(items);
      setTestiEdit(null);
      setNotice('✅ Testimonialele sunt actualizate pe site chiar acum.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Salvarea a eșuat.');
    } finally {
      setBusy(false);
    }
  }

  function submitTestiEdit(e: FormEvent) {
    e.preventDefault();
    if (!testiEdit) return;
    if (!testiEdit.name.trim() || !testiEdit.text.trim()) { setError('Numele și textul sunt obligatorii.'); return; }
    const exists = testi.some(t => t.id === testiEdit.id);
    const items = exists
      ? testi.map(t => (t.id === testiEdit.id ? testiEdit : t))
      : [...testi, { ...testiEdit, id: `testi-${Date.now()}` }];
    saveTesti(items);
  }

  const moveTesti = (idx: number, dir: -1 | 1) => {
    const items = [...testi];
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    [items[idx], items[j]] = [items[j], items[idx]];
    saveTesti(items);
  };

  /* ---------- mesaje ---------- */
  async function onDeleteMessage(id: string) {
    if (!confirm('Ștergi acest mesaj?')) return;
    await fetch('/api/admin/messages/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setMessages(ms => ms.filter(m => m.id !== id));
  }

  function startReply(m: Message) {
    const prenume = m.nume.split(' ')[0];
    const serviciu = (m.serviciu || 'proiectul tău').toLowerCase();
    setReplyFor(m.id);
    setReplySubject(`Oferta Sarami Media — ${m.serviciu || 'proiectul tău'}`);
    setReplyText(
      `Bună, ${prenume}!\n\n` +
      `Mulțumim pentru încrederea acordată și pentru detaliile trimise — ne-au ajutat să înțelegem exact ce ai nevoie pentru ${serviciu}.\n\n` +
      `Iată oferta noastră:\n\n` +
      `• Ce livrăm: [descrie pe scurt livrabilele]\n` +
      `• Termen de livrare: [ex: 3-5 zile lucrătoare]\n` +
      `• Investiție: [preț] (include [nr] revizii)\n\n` +
      `Cum lucrăm: după confirmare, ne apuci de treabă imediat și te ținem la curent pe tot parcursul. Plata se face pe bază de factură, prin transfer bancar.\n\n` +
      `Dacă ai orice întrebare sau vrei să ajustăm ceva la ofertă, răspunde-mi la acest email — sunt aici.\n\n` +
      `O zi excelentă,\n` +
      `Echipa Sarami Media\n` +
      `sarami.ro`
    );
  }

  async function onSendReply(m: Message) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/reply/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: m.email, subject: replySubject, text: replyText }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Trimiterea a eșuat.');
      setNotice('✅ Oferta a plecat către ' + m.email);
      setReplyFor(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Trimiterea a eșuat.');
    } finally {
      setBusy(false);
    }
  }

  /* ================= LOGIN ================= */
  if (view === 'login') {
    return (
      <div className="admin-root">
        <section className="section" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
          <div style={{ width: 'min(440px, 92vw)' }}>
            <div className="admin-card">
              <h1 className="h-md mb-2">🔐 Sarami <span className="grad-text">Admin</span></h1>
              <form onSubmit={onLogin}>
                <div className="form-field" style={{ marginBottom: 14 }}>
                  <label htmlFor="admin-user">Utilizator</label>
                  <input id="admin-user" type="text" value={user} onChange={e => setUser(e.target.value)} required autoFocus autoComplete="username" />
                </div>
                <div className="form-field">
                  <label htmlFor="admin-pass">Parola</label>
                  <input id="admin-pass" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
                </div>
                {error && <p style={{ color: '#dc2626', fontSize: '.9rem', marginTop: 10 }}>⚠ {error}</p>}
                <button className="btn btn-primary mt-2" disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>
                  {busy ? 'Se verifică...' : 'Intră în panou'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* ================= PANOU ================= */
  return (
    <div className="admin-root">
      <div className="admin-shell">
        {/* Meniul lateral */}
        <aside className="admin-side">
          <div className="admin-brand">Sarami <span>Admin</span></div>
          <button className={view === 'acasa' ? 'on' : ''} onClick={() => go('acasa')}>🏠 Acasă</button>
          <button className={view === 'articole' || view === 'editor' ? 'on' : ''} onClick={() => go('articole')}>📚 Articole</button>
          <button className={view === 'portofoliu' ? 'on' : ''} onClick={() => go('portofoliu')}>🎬 Portofoliu</button>
          <button className={view === 'testimoniale' ? 'on' : ''} onClick={() => go('testimoniale')}>⭐ Testimoniale</button>
          <button className={view === 'mesaje' ? 'on' : ''} onClick={() => go('mesaje')}>✉️ Mesaje &amp; Briefuri</button>
          <button className={view === 'setari' ? 'on' : ''} onClick={() => go('setari')}>⚙️ Setări</button>
          <div className="admin-side-bottom">
            <a href="/" target="_blank" rel="noopener noreferrer">🌐 Vezi site-ul</a>
            <button onClick={onLogout}>🚪 Ieși din cont</button>
          </div>
        </aside>

        {/* Conținutul */}
        <main className="admin-main">
          {notice && <p style={{ color: '#059669', fontWeight: 600, marginBottom: 16 }}>{notice}</p>}
          {error && view !== 'editor' && <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: 16 }}>⚠ {error}</p>}

          {/* ---- ACASĂ (dashboard clienți) ---- */}
          {view === 'acasa' && (
            <>
              <div className="admin-title">
                <h1>🏠 Bine ai venit!</h1>
                <button className="btn btn-ghost" onClick={() => { loadMessages(); loadFolio(); loadTesti(); }}>↻ Reîncarcă datele</button>
              </div>
              <div className="stats" style={{ marginBottom: 30 }}>
                <button className="stat" style={{ cursor: 'pointer', border: '1px solid var(--line)', font: 'inherit' }} onClick={() => go('mesaje')}>
                  <b>{messages.filter(m => m.formular !== 'Contact').length}</b><span>📋 Briefuri primite</span>
                </button>
                <button className="stat" style={{ cursor: 'pointer', border: '1px solid var(--line)', font: 'inherit' }} onClick={() => go('mesaje')}>
                  <b>{messages.filter(m => m.formular === 'Contact').length}</b><span>💬 Mesaje de contact</span>
                </button>
                <button className="stat" style={{ cursor: 'pointer', border: '1px solid var(--line)', font: 'inherit' }} onClick={() => go('portofoliu')}>
                  <b>{folio.filter(f => f.videoId || f.link || f.image).length}</b><span>🎬 Lucrări în portofoliu</span>
                </button>
                <button className="stat" style={{ cursor: 'pointer', border: '1px solid var(--line)', font: 'inherit' }} onClick={() => go('testimoniale')}>
                  <b>{testi.length}</b><span>⭐ Testimoniale</span>
                </button>
              </div>

              <div className="admin-title"><h1 style={{ fontSize: '1.15rem' }}>Ultimele mesaje de la clienți</h1></div>
              {messages.length === 0 ? (
                <p style={{ color: 'var(--text-faint)' }}>Niciun mesaj încă — când un client completează un brief sau formularul de contact, apare aici.</p>
              ) : (
                <div style={{ display: 'grid', gap: 10 }}>
                  {messages.slice(0, 5).map(m => (
                    <div className="admin-row" key={m.id} style={{ cursor: 'pointer' }} onClick={() => go('mesaje')}>
                      <div style={{ minWidth: 0 }}>
                        <b style={{ display: 'block', fontSize: '.95rem' }}>{m.formular === 'Contact' ? '💬' : '📋'} {m.nume} <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>• {m.serviciu || 'general'}</span></b>
                        <span style={{ color: 'var(--text-faint)', fontSize: '.8rem' }}>{new Date(m.date).toLocaleString('ro-RO')} • {m.email}</span>
                      </div>
                      <span style={{ color: 'var(--blue-600)', fontWeight: 600, fontSize: '.85rem' }}>Deschide →</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ---- ARTICOLE ---- */}
          {view === 'articole' && (
            <>
              <div className="admin-title">
                <h1>📚 Articole ({posts.length})</h1>
                <button className="btn btn-primary" onClick={startNew}>+ Articol nou</button>
              </div>
              <div className="form-field" style={{ marginBottom: 18, maxWidth: 480 }}>
                <input placeholder="🔍 Caută după titlu sau slug..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {posts
                  .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase()))
                  .map(p => (
                    <div className="admin-row" key={p.slug}>
                      <div style={{ minWidth: 0 }}>
                        <b style={{ display: 'block', fontSize: '.96rem' }}>{p.title}</b>
                        <span style={{ color: 'var(--text-faint)', fontSize: '.8rem' }}>
                          /blog/{p.slug} • {new Date(p.date).toLocaleDateString('ro-RO')}{p.category ? ` • ${p.category}` : ''}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <a className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '.85rem' }} href={`/blog/${p.slug}/`} target="_blank" rel="noopener noreferrer">Vezi</a>
                        <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '.85rem' }} onClick={() => startEdit(p)}>Editează</button>
                        <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '.85rem', color: '#dc2626', borderColor: 'rgba(220,38,38,.4)' }} onClick={() => onDelete(p.slug)} disabled={busy}>Șterge</button>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* ---- EDITOR ARTICOL ---- */}
          {view === 'editor' && (
            <>
              <div className="admin-title">
                <h1>{isNew ? '📝 Articol nou' : `✏️ ${editing.title}`}</h1>
              </div>
              <div className="admin-card">
                <form onSubmit={onSave}>
                  <div className="form-grid">
                    <div className="form-field full">
                      <label>Titlu *</label>
                      <input
                        value={editing.title}
                        onChange={e => setEditing(ed => ({ ...ed, title: e.target.value, slug: isNew ? slugify(e.target.value) : ed.slug }))}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Slug (adresa URL) *</label>
                      <input value={editing.slug} onChange={e => setEditing(ed => ({ ...ed, slug: slugify(e.target.value) }))} required disabled={!isNew} />
                    </div>
                    <div className="form-field">
                      <label>Categorie</label>
                      <input value={editing.category || ''} onChange={e => setEditing(ed => ({ ...ed, category: e.target.value }))} placeholder="ex: Editare video" />
                    </div>
                    <div className="form-field">
                      <label>Data publicării</label>
                      <input type="datetime-local" value={editing.date} onChange={e => setEditing(ed => ({ ...ed, date: e.target.value }))} />
                    </div>
                    <div className="form-field">
                      <label>Imagine de copertă (thumbnail)</label>
                      <UploadImage value={editing.image} onChange={url => setEditing(ed => ({ ...ed, image: url }))} />
                    </div>
                    <div className="form-field full">
                      <label>Conținutul articolului * (scrii ca în Word — folosește butoanele pentru titluri, liste, linkuri)</label>
                      <RichEditor value={editing.contentHtml} onChange={html => setEditing(ed => ({ ...ed, contentHtml: html }))} />
                    </div>
                  </div>
                  {error && <p style={{ color: '#dc2626', fontSize: '.9rem', marginTop: 12 }}>⚠ {error}</p>}
                  <div className="btn-row mt-2">
                    <button className="btn btn-primary" disabled={busy}>{busy ? 'Se salvează...' : '💾 Salvează articolul'}</button>
                    <button type="button" className="btn btn-ghost" onClick={() => go('articole')} disabled={busy}>Renunță</button>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* ---- PORTOFOLIU ---- */}
          {view === 'portofoliu' && (
            <>
              <div className="admin-title">
                <h1>🎬 Portofoliu ({folio.length} clipuri)</h1>
                <button className="btn btn-primary" onClick={() => { setError(''); setFolioEdit({ ...EMPTY_FOLIO }); }}>+ Adaugă clip</button>
              </div>

              {folioEdit && (
                <div className="admin-card" style={{ marginBottom: 20 }}>
                  <h3 className="h-md" style={{ marginBottom: 16 }}>{folio.some(f => f.id === folioEdit.id) ? 'Editează clipul' : 'Clip nou'}</h3>
                  <form onSubmit={submitFolioEdit}>
                    <div className="form-grid">
                      <div className="form-field">
                        <label>Titlu *</label>
                        <input value={folioEdit.title} onChange={e => setFolioEdit(f => f && { ...f, title: e.target.value })} required />
                      </div>
                      <div className="form-field">
                        <label>Categorie *</label>
                        <select value={folioEdit.cat} onChange={e => setFolioEdit(f => f && { ...f, cat: e.target.value as FolioItem['cat'] })}>
                          {FOLIO_CATS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                          {!FOLIO_CATS.some(c => c.key === folioEdit.cat) && (
                            <option value={folioEdit.cat}>{folioEdit.cat} (categorie veche)</option>
                          )}
                        </select>
                      </div>
                      {folioEdit.cat === 'redactare' ? (
                        <div className="form-field full">
                          <label>Link către articolul publicat (unde poate fi citit)</label>
                          <input value={folioEdit.link || ''} onChange={e => setFolioEdit(f => f && { ...f, link: e.target.value, videoId: '' })} placeholder="https://site-client.ro/articolul-scris-de-noi" />
                        </div>
                      ) : (
                        <>
                          {/* o singură sursă video pe clip — alegerea uneia le golește pe celelalte */}
                          <div className="form-field full">
                            <label>Clipul — încarcă-l direct de pe calculator</label>
                            <UploadVideo value={folioEdit.video} onChange={url => setFolioEdit(f => f && { ...f, video: url, videoId: url ? '' : f.videoId, tiktok: url ? '' : f.tiktok, link: '' })} />
                          </div>
                          <div className="form-field">
                            <label>...sau link YouTube (merge și nelistat)</label>
                            <input value={folioEdit.videoId || ''} onChange={e => setFolioEdit(f => f && { ...f, videoId: e.target.value, video: e.target.value ? '' : f.video, tiktok: e.target.value ? '' : f.tiktok, link: '' })} placeholder="https://www.youtube.com/watch?v=..." />
                          </div>
                          <div className="form-field">
                            <label>...sau link TikTok (clipul clientului)</label>
                            <input value={folioEdit.tiktok || ''} onChange={e => setFolioEdit(f => f && { ...f, tiktok: e.target.value, video: e.target.value ? '' : f.video, videoId: e.target.value ? '' : f.videoId, link: '' })} placeholder="https://www.tiktok.com/@client/video/..." />
                          </div>
                        </>
                      )}
                      <div className="form-field full">
                        <label>Descriere scurtă</label>
                        <input value={folioEdit.desc} onChange={e => setFolioEdit(f => f && { ...f, desc: e.target.value })} placeholder="ex: Montaj multi-cameră cu subtitrări dinamice" />
                      </div>
                      <div className="form-field full">
                        <label>Imagine de copertă (opțional — afișată când nu e clip YouTube)</label>
                        <UploadImage value={folioEdit.image} onChange={url => setFolioEdit(f => f && { ...f, image: url })} />
                      </div>
                    </div>
                    {error && <p style={{ color: '#dc2626', fontSize: '.9rem', marginTop: 12 }}>⚠ {error}</p>}
                    <div className="btn-row mt-2">
                      <button className="btn btn-primary" disabled={busy}>{busy ? 'Se salvează...' : '💾 Salvează clipul'}</button>
                      <button type="button" className="btn btn-ghost" onClick={() => setFolioEdit(null)}>Renunță</button>
                    </div>
                  </form>
                </div>
              )}

              <div style={{ display: 'grid', gap: 10 }}>
                {folio.map((f, i) => (
                  <div className="admin-row" key={f.id}>
                    <div style={{ minWidth: 0 }}>
                      <b style={{ display: 'block', fontSize: '.96rem' }}>{f.video ? '🎞️' : f.tiktok ? '🎵' : f.videoId ? '▶️' : '⬜'} {f.title}</b>
                      <span style={{ color: 'var(--text-faint)', fontSize: '.8rem' }}>
                        {FOLIO_CATS.find(c => c.key === f.cat)?.label || f.cat}
                        {f.video ? ' • clip încărcat pe site' : f.tiktok ? ' • TikTok' : f.videoId ? ` • youtube: ${f.videoId}` : f.link ? ' • link extern' : ' • fără clip încă (placeholder)'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button className="btn btn-ghost" style={{ padding: '8px 12px', fontSize: '.85rem' }} onClick={() => moveFolio(i, -1)} disabled={busy || i === 0}>↑</button>
                      <button className="btn btn-ghost" style={{ padding: '8px 12px', fontSize: '.85rem' }} onClick={() => moveFolio(i, 1)} disabled={busy || i === folio.length - 1}>↓</button>
                      <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '.85rem' }} onClick={() => { setError(''); setFolioEdit({ ...f }); }}>Editează</button>
                      <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '.85rem', color: '#dc2626', borderColor: 'rgba(220,38,38,.4)' }} onClick={() => { if (confirm(`Ștergi „${f.title}"?`)) saveFolio(folio.filter(x => x.id !== f.id)); }} disabled={busy}>Șterge</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ---- TESTIMONIALE ---- */}
          {view === 'testimoniale' && (
            <>
              <div className="admin-title">
                <h1>⭐ Testimoniale ({testi.length})</h1>
                <button className="btn btn-primary" onClick={() => { setError(''); setTestiEdit({ ...EMPTY_TESTI }); }}>+ Adaugă testimonial</button>
              </div>

              {testiEdit && (
                <div className="admin-card" style={{ marginBottom: 20 }}>
                  <h3 className="h-md" style={{ marginBottom: 16 }}>{testi.some(t => t.id === testiEdit.id) ? 'Editează testimonialul' : 'Testimonial nou'}</h3>
                  <form onSubmit={submitTestiEdit}>
                    <div className="form-grid">
                      <div className="form-field">
                        <label>Nume client *</label>
                        <input value={testiEdit.name} onChange={e => setTestiEdit(t => t && { ...t, name: e.target.value })} required placeholder="ex: Andreea M." />
                      </div>
                      <div className="form-field">
                        <label>Firma / rolul</label>
                        <input value={testiEdit.role} onChange={e => setTestiEdit(t => t && { ...t, role: e.target.value })} placeholder="ex: Magazin online fashion" />
                      </div>
                      <div className="form-field full">
                        <label>Textul testimonialului *</label>
                        <textarea style={{ minHeight: 110 }} value={testiEdit.text} onChange={e => setTestiEdit(t => t && { ...t, text: e.target.value })} required />
                      </div>
                      <div className="form-field full">
                        <label>Poza clientului (opțional — apare lângă nume)</label>
                        <UploadImage value={testiEdit.image} onChange={url => setTestiEdit(t => t && { ...t, image: url })} />
                      </div>
                    </div>
                    {error && <p style={{ color: '#dc2626', fontSize: '.9rem', marginTop: 12 }}>⚠ {error}</p>}
                    <div className="btn-row mt-2">
                      <button className="btn btn-primary" disabled={busy}>{busy ? 'Se salvează...' : '💾 Salvează'}</button>
                      <button type="button" className="btn btn-ghost" onClick={() => setTestiEdit(null)}>Renunță</button>
                    </div>
                  </form>
                </div>
              )}

              <div style={{ display: 'grid', gap: 10 }}>
                {testi.map((t, i) => (
                  <div className="admin-row" key={t.id}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <b style={{ display: 'block', fontSize: '.96rem' }}>{t.name} <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>• {t.role}</span></b>
                      <span style={{ color: 'var(--text-dim)', fontSize: '.85rem' }}>{t.text.slice(0, 120)}{t.text.length > 120 ? '…' : ''}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button className="btn btn-ghost" style={{ padding: '8px 12px', fontSize: '.85rem' }} onClick={() => moveTesti(i, -1)} disabled={busy || i === 0}>↑</button>
                      <button className="btn btn-ghost" style={{ padding: '8px 12px', fontSize: '.85rem' }} onClick={() => moveTesti(i, 1)} disabled={busy || i === testi.length - 1}>↓</button>
                      <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '.85rem' }} onClick={() => { setError(''); setTestiEdit({ ...t }); }}>Editează</button>
                      <button className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '.85rem', color: '#dc2626', borderColor: 'rgba(220,38,38,.4)' }} onClick={() => { if (confirm(`Ștergi testimonialul de la „${t.name}"?`)) saveTesti(testi.filter(x => x.id !== t.id)); }} disabled={busy}>Șterge</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ---- SETĂRI ---- */}
          {view === 'setari' && (
            <>
              <div className="admin-title"><h1>⚙️ Setări site</h1></div>
              <div className="admin-card" style={{ maxWidth: 720 }}>
                <p style={{ color: 'var(--text-dim)', fontSize: '.92rem', marginBottom: 18 }}>
                  Datele de mai jos apar pe pagina de Contact. Tot de aici pornești butonul de WhatsApp
                  și bara de anunț de pe site — modificările sunt live instant.
                </p>
                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    setBusy(true);
                    setError('');
                    try {
                      const res = await fetch('/api/admin/settings/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(settings),
                      });
                      if (!res.ok) throw new Error('Salvarea a eșuat.');
                      setNotice('✅ Setările sunt live pe site.');
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Salvarea a eșuat.');
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  <div className="form-grid">
                    <div className="form-field">
                      <label>Telefon</label>
                      <input value={settings.telefon || ''} onChange={e => setSettings(s => ({ ...s, telefon: e.target.value }))} placeholder="+40 7xx xxx xxx" />
                    </div>
                    <div className="form-field">
                      <label>Email de contact</label>
                      <input value={settings.email || ''} onChange={e => setSettings(s => ({ ...s, email: e.target.value }))} placeholder="contact@sarami.ro" />
                    </div>
                    <div className="form-field">
                      <label>Numele firmei</label>
                      <input value={settings.firma || ''} onChange={e => setSettings(s => ({ ...s, firma: e.target.value }))} placeholder="SARAMI MEDIA S.R.L." />
                    </div>
                    <div className="form-field">
                      <label>CUI</label>
                      <input value={settings.cui || ''} onChange={e => setSettings(s => ({ ...s, cui: e.target.value }))} placeholder="ROxxxxxxxx" />
                    </div>
                    <div className="form-field">
                      <label>Reg. Com.</label>
                      <input value={settings.regcom || ''} onChange={e => setSettings(s => ({ ...s, regcom: e.target.value }))} placeholder="Jxx/xxxx/20xx" />
                    </div>
                    <div className="form-field">
                      <label>Program</label>
                      <input value={settings.program || ''} onChange={e => setSettings(s => ({ ...s, program: e.target.value }))} placeholder="Luni – Vineri: 09:00 – 18:00" />
                    </div>
                    <div className="form-field full">
                      <label>Adresa sediului</label>
                      <input value={settings.adresa || ''} onChange={e => setSettings(s => ({ ...s, adresa: e.target.value }))} placeholder="Str. ..., Oraș, România" />
                    </div>
                    <div className="form-field">
                      <label>WhatsApp — buton plutitor pe site (doar cifre, gol = ascuns)</label>
                      <input value={settings.whatsapp || ''} onChange={e => setSettings(s => ({ ...s, whatsapp: e.target.value }))} placeholder="40723111222" />
                    </div>
                    <div className="form-field">
                      <label>Anunț / promoție — bară sus pe site (gol = ascunsă)</label>
                      <input value={settings.anunt || ''} onChange={e => setSettings(s => ({ ...s, anunt: e.target.value }))} placeholder="🎬 Ofertă: -20% la primul proiect video în august!" />
                    </div>
                    <div className="form-field">
                      <label>Google Analytics — Measurement ID (gol = oprit)</label>
                      <input value={settings.ga || ''} onChange={e => setSettings(s => ({ ...s, ga: e.target.value }))} placeholder="G-XXXXXXXXXX" />
                    </div>
                    <div className="form-field">
                      <label>Meta / Facebook Pixel — ID (gol = oprit)</label>
                      <input value={settings.fbpixel || ''} onChange={e => setSettings(s => ({ ...s, fbpixel: e.target.value }))} placeholder="2108829569729584" />
                    </div>
                  </div>
                  {error && <p style={{ color: '#dc2626', fontSize: '.9rem', marginTop: 12 }}>⚠ {error}</p>}
                  <div className="btn-row mt-2">
                    <button className="btn btn-primary" disabled={busy}>{busy ? 'Se salvează...' : '💾 Salvează setările'}</button>
                  </div>
                </form>
              </div>
            </>
          )}

          {/* ---- MESAJE ---- */}
          {view === 'mesaje' && (
            <>
              <div className="admin-title">
                <h1>✉️ Mesaje &amp; Briefuri ({messages.length})</h1>
                <button className="btn btn-ghost" onClick={() => loadMessages()}>↻ Reîncarcă</button>
              </div>
              {messages.length === 0 && (
                <p style={{ color: 'var(--text-faint)' }}>
                  Niciun mesaj încă. Mesajele de contact și briefurile completate de clienți apar aici automat (și pe email).
                </p>
              )}
              <div style={{ display: 'grid', gap: 12 }}>
                {messages.map(m => (
                  <details key={m.id} className="admin-row" style={{ display: 'block' }}>
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
                      <div style={{ marginTop: 6, padding: '12px 14px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--line)', whiteSpace: 'pre-wrap' }}>{m.mesaj}</div>

                      {replyFor === m.id ? (
                        <div style={{ marginTop: 10, display: 'grid', gap: 10, padding: 14, background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--ring)' }}>
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
                    </div>
                  </details>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
