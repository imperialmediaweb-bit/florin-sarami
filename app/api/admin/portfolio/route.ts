import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin';
import { FOLIO_CATS, getPortfolio, savePortfolio } from '@/lib/portfolio';
import type { FolioItem } from '@/lib/portfolio';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
  }
  return NextResponse.json({ items: getPortfolio() });
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
  }
  let data: { items?: unknown };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 });
  }
  if (!Array.isArray(data.items)) {
    return NextResponse.json({ error: 'Lista de clipuri lipsește.' }, { status: 400 });
  }

  const cats = FOLIO_CATS.map(c => c.key as string);
  const items: FolioItem[] = [];
  for (const raw of data.items as Record<string, unknown>[]) {
    const title = String(raw.title || '').trim();
    const cat = String(raw.cat || '').trim();
    const videoId = String(raw.videoId || '').trim();
    const link = String(raw.link || '').trim();
    if (!title) return NextResponse.json({ error: 'Fiecare element are nevoie de un titlu.' }, { status: 400 });
    if (!cats.includes(cat)) return NextResponse.json({ error: `Categorie invalidă la „${title}".` }, { status: 400 });
    if (videoId && !/^[A-Za-z0-9_-]{5,20}$/.test(videoId)) {
      return NextResponse.json({ error: `ID YouTube invalid la „${title}".` }, { status: 400 });
    }
    if (link && !/^https?:\/\//.test(link)) {
      return NextResponse.json({ error: `Linkul de la „${title}" trebuie să înceapă cu https://` }, { status: 400 });
    }
    items.push({
      id: String(raw.id || '').trim() || `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      cat: cat as FolioItem['cat'],
      title,
      desc: String(raw.desc || '').trim(),
      videoId: videoId || undefined,
      link: link || undefined,
    });
  }

  savePortfolio(items);
  return NextResponse.json({ ok: true });
}
