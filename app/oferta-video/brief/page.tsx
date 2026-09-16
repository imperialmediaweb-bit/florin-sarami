import type { Metadata } from 'next';
import BriefForm from '@/components/BriefForm';

export const metadata: Metadata = {
  alternates: { canonical: '/oferta-video/brief/' },
  title: 'Cere oferta gratuită — 2 minute',
  description:
    'Completează formularul și primești în 24h oferta personalizată + un Short editat gratuit, să vezi exact ce facem.',
};

/**
 * Pagina de brief a landingului — DOAR formularul, nimic altceva.
 * Butoanele din /oferta-video duc direct aici: navigare simplă de pagină,
 * imposibil de ratat, pe orice telefon și orice browser.
 */
export default function OfertaBriefPage() {
  return (
    <section className="section-tight" style={{ paddingTop: 40 }}>
      <div className="container" style={{ maxWidth: 860 }}>
        <div className="center">
          <span className="eyebrow">🎁 Durează 2 minute</span>
          <h1 className="h-lg">Cere oferta <span className="grad-text">gratuită</span></h1>
          <p className="lead" style={{ marginBottom: 14 }}>
            Primești în <strong style={{ color: 'var(--text-main)' }}>24h</strong> oferta personalizată + stabilim{' '}
            <strong style={{ color: 'var(--text-main)' }}>Short-ul tău de probă gratuit</strong>.
          </p>
          <p style={{ color: 'var(--text-dim)', marginBottom: 12 }}>Preferi să vorbim direct?</p>
          <p style={{ marginBottom: 26 }}>
            <a
              href="https://wa.me/40743361684?text=Bun%C4%83!%20Vreau%20o%20ofert%C4%83%20pentru%20editare%20video."
              className="btn-wa"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Scrie-ne pe WhatsApp: +40 743 361 684
            </a>
          </p>
        </div>
        <div className="form-card">
          <BriefForm
            formular="Ofertă video"
            serviciu="Editare video"
            mesajLabel="Despre afacerea ta *"
            mesajPlaceholder="Ce vinzi / ce faci? Pentru cine? Ai deja filmări sau începem de la zero?"
            fields={[
              {
                name: 'tip', label: 'Ce fel de clipuri vrei? *', type: 'select', required: true,
                options: ['Reels / TikTok pentru afacerea mea', 'Clipuri pentru contul meu de creator', 'Clipuri din podcast / interviuri', 'Altceva — vă zic în mesaj'],
              },
              {
                name: 'clipuri', label: 'Câte clipuri ai vrea pe lună? *', type: 'select', required: true,
                options: ['10 clipuri / lună', '25 clipuri / lună', '50 clipuri / lună', 'Mai multe de 50', 'Nu știu încă — stabilim împreună'],
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
