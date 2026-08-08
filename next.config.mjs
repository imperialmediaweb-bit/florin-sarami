/** @type {import('next').NextConfig} */
const nextConfig = {
  // `output: 'export'` generează site static în /out — poate fi urcat pe orice hosting.
  // Șterge linia dacă vei rula pe un server Node (next start) sau Vercel.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
