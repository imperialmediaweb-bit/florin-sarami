import Link from 'next/link';
import { ArrowIcon } from './Visuals';

export default function CtaBand({
  title,
  text,
  label = 'Contactează-ne',
  href = '/contact',
  secondLabel,
  secondHref,
}: {
  title: string;
  text: string;
  label?: string;
  href?: string;
  secondLabel?: string;
  secondHref?: string;
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-band reveal">
          <h2 className="h-lg">{title}</h2>
          <p>{text}</p>
          <div className="btn-row">
            <Link href={href} className="btn">
              {label} <ArrowIcon />
            </Link>
            {secondLabel && secondHref && (
              <Link href={secondHref} className="btn btn-outline-light">
                {secondLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
