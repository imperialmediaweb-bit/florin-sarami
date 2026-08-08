import crypto from 'crypto';

/**
 * Autentificarea panoului de administrare.
 * Config (Railway → Variables sau .env local):
 *   ADMIN_PASSWORD — parola de intrare în /admin (obligatoriu)
 */

export function adminToken(): string | null {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return null;
  return crypto.createHash('sha256').update(`sarami-admin:${pass}`).digest('hex');
}

/** Verifică cookie-ul de sesiune al adminului. */
export function isAuthorized(req: Request): boolean {
  const token = adminToken();
  if (!token) return false;
  const cookies = req.headers.get('cookie') || '';
  const match = cookies.match(/(?:^|;\s*)sm_admin=([a-f0-9]+)/);
  return match?.[1] === token;
}
