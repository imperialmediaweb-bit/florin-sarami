import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin';
import { getAllPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
  }
  // lista vine din fișierele incluse în ultimul deploy;
  // modificările salvate apar aici după redeploy-ul Railway (~2-3 min)
  return NextResponse.json({ posts: getAllPosts() });
}
