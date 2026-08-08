import type { ReactNode } from 'react';

export type FaqItem = { q: string; a: ReactNode };

export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq mt-3 reveal">
      {items.map((item, i) => (
        <details key={i}>
          <summary>{item.q}</summary>
          <div className="faq-body">{item.a}</div>
        </details>
      ))}
    </div>
  );
}
