'use client';

import { useEffect, useRef } from 'react';

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

  const TOOLS: { label: string; title: string; action: () => void }[] = [
    { label: 'B', title: 'Îngroșat', action: () => exec('bold') },
    { label: 'I', title: 'Italic', action: () => exec('italic') },
    { label: 'H2', title: 'Titlu secțiune', action: () => exec('formatBlock', '<h2>') },
    { label: 'H3', title: 'Subtitlu', action: () => exec('formatBlock', '<h3>') },
    { label: '¶', title: 'Paragraf normal', action: () => exec('formatBlock', '<p>') },
    { label: '• Listă', title: 'Listă cu puncte', action: () => exec('insertUnorderedList') },
    { label: '1. Listă', title: 'Listă numerotată', action: () => exec('insertOrderedList') },
    { label: '🔗 Link', title: 'Adaugă link', action: addLink },
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
    </div>
  );
}
