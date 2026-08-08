import { NextResponse } from 'next/server';
import { deleteFileFromGitHub, isAuthorized } from '@/lib/admin';

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
    await deleteFileFromGitHub(`content/blog/${slug}.json`, `Admin: ștergere articol "${slug}"`);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Ștergerea din GitHub a eșuat.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
