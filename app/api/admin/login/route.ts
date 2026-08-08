import { NextResponse } from 'next/server';
import { adminToken } from '@/lib/admin';

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 });
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: 'Panoul nu este configurat: setează ADMIN_PASSWORD în variabilele de mediu.' },
      { status: 500 }
    );
  }
  const expectedUser = process.env.ADMIN_USER || 'admin';
  const givenUser = String((body as Record<string, unknown>).user || '').trim();
  if (givenUser !== expectedUser || body.password !== expected) {
    return NextResponse.json({ error: 'Utilizator sau parolă greșite.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('sm_admin', adminToken()!, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 3600,
  });
  return res;
}
