/** Injectează date structurate schema.org (JSON-LD) — citite de Google pentru rich results. */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Sarami Media',
  url: 'https://sarami.ro',
  logo: 'https://sarami.ro/assets/logo.png',
  description:
    'Servicii profesionale de editare video (montaj, subtitrări, corecții de culoare) și redactare de conținut 100% Human Written: articole de blog, descrieri de produse, advertoriale.',
  email: 'contact@sarami.ro',
  areaServed: { '@type': 'Country', name: 'România' },
  foundingDate: '2020',
  sameAs: [] as string[],
};

export const WEBSITE = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Sarami Media',
  url: 'https://sarami.ro',
  inLanguage: 'ro-RO',
};

export const faqSchema = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(i => ({
    '@type': 'Question',
    name: i.q,
    acceptedAnswer: { '@type': 'Answer', text: i.a },
  })),
});

export const breadcrumbSchema = (crumbs: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: `https://sarami.ro${c.url}`,
  })),
});

export const serviceSchema = (name: string, description: string, url: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url: `https://sarami.ro${url}`,
  provider: { '@type': 'ProfessionalService', name: 'Sarami Media', url: 'https://sarami.ro' },
  areaServed: { '@type': 'Country', name: 'România' },
  inLanguage: 'ro-RO',
});
