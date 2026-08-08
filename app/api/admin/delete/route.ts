import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin';
import { getBlogDir } from '@/lib/blog';

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
  }

  let data: { slug?: string };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 });
  }

  const slug = String(data.slug || '').trim().toLowerCase();
  if (!/^[a-z0-9-]{3,120}$/.test(slug)) {
    return NextResponse.json({ error: 'Slug invalid.' }, { status: 400 });
  }

  try {
    const file = path.join(getBlogDir(), `${slug}.json`);
    if (!fs.existsSync(file)) {
      return NextResponse.json({ error: 'Articolul nu există.' }, { status: 404 });
    }
    fs.unlinkSync(file);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Ștergerea a eșuat.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
