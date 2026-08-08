import Link from 'next/link';
import { ArrowIcon } from './Visuals';

export default function CtaBand({
  title,
  text,
  label = 'Contactează-ne',
  href = '/contact',
}: {
  title: string;
  text: string;
  label?: string;
  href?: string;
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-band reveal">
          <h2 className="h-lg">{title}</h2>
          <p>{text}</p>
          <Link href={href} className="btn">
            {label} <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
