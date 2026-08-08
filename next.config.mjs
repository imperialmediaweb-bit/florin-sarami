/** @type {import('next').NextConfig} */
const nextConfig = {
  // `output: 'export'` generează site static în /out — poate fi urcat pe orice hosting.
  // Șterge linia dacă vei rula pe un server Node (next start) sau Vercel.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // rădăcina proiectului e chiar acest folder (evită confuzia cu alte
  // package-lock.json rătăcite prin folderele părinte)
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
