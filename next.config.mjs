import fs from 'fs';

/* Redirecturile 301 de la vechile URL-uri WordPress (generate de importul
   din scripts/import-wordpress.mjs în public/serve.json) — aplicate de
   serverul Next, ca Google să nu găsească pagini lipsă după mutare. */
let wpRedirects = [];
try {
  const data = JSON.parse(fs.readFileSync(new URL('./public/serve.json', import.meta.url), 'utf8'));
  wpRedirects = (data.redirects || [])
    .filter(r => r.source.endsWith('/')) // cu trailingSlash: true, sursele au slash final
    .map(r => ({ source: r.source, destination: r.destination, permanent: true }));
} catch { /* fără redirecturi până la primul import */ }

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Rulează ca aplicație Node (Railway: npm run build && npm start) —
  // necesar pentru formularul de contact prin Resend (app/api/contact).
  trailingSlash: true,
  images: { unoptimized: true },
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return wpRedirects;
  },
};

export default nextConfig;
