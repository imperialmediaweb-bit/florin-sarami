/**
 * Rulează o singură dată, la pornirea serverului Next.js:
 * restaurează datele (briefuri, articole, portofoliu, setări) din seiful
 * Cloudinary, ca nimic să nu se piardă la redeploy-urile de pe Railway.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { cloudHydrate } = await import('./lib/cloudstore');
    await cloudHydrate();
  }
}
