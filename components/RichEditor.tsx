'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Editor vizual simplu (fără dependențe): scrii ca într-un document Word,
 * iar în spate se generează HTML-ul articolului.
 */
export default function RichEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const initialised = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!initialised.current && ref.current) {
      ref.current.innerHTML = value || '<p><br></p>';
      initialised.current = true;
    }
    // valoarea inițială se setează o singură dată — apoi editorul e sursa
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    onChange(ref.current?.innerHTML || '');
  };

  const addLink = () => {
    const url = prompt('Adresa linkului (ex: https://sarami.ro):');
    if (url) exec('createLink', url);
  };

  const addImage = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload/', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload eșuat.');
      exec('insertImage', data.url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload eșuat.');
    } finally {
      setUploading(false);
    }
  };

  const TOOLS: { label: string; title: string; action: () => void }[] = [
    { label: 'B', title: 'Îngroșat', action: () => exec('bold') },
    { label: 'I', title: 'Italic', action: () => exec('italic') },
    { label: 'H2', title: 'Titlu secțiune', action: () => exec('formatBlock', '<h2>') },
    { label: 'H3', title: 'Subtitlu', action: () => exec('formatBlock', '<h3>') },
    { label: '¶', title: 'Paragraf normal', action: () => exec('formatBlock', '<p>') },
    { label: '• Listă', title: 'Listă cu puncte', action: () => exec('insertUnorderedList') },
    { label: '1. Listă', title: 'Listă numerotată', action: () => exec('insertOrderedList') },
    { label: '🔗 Link', title: 'Adaugă link', action: addLink },
    { label: uploading ? '⏳ Poză...' : '📷 Poză', title: 'Inserează poză în articol', action: () => fileRef.current?.click() },
    { label: '⌫ Format', title: 'Curăță formatarea', action: () => exec('removeFormat') },
  ];

  return (
    <div className="rich-wrap">
      <div className="rich-toolbar">
        {TOOLS.map(t => (
          <button
            key={t.label}
            type="button"
            title={t.title}
            onMouseDown={e => e.preventDefault() /* păstrează selecția din editor */}
            onClick={t.action}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        className="rich-editor article-body"
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML || '')}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) addImage(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
