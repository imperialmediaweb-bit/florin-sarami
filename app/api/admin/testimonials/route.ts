import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin';
import { getTestimonials, saveTestimonials } from '@/lib/testimonials';
import type { Testimonial } from '@/lib/testimonials';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
  }
  return NextResponse.json({ items: getTestimonials() });
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
    return NextResponse.json({ error: 'Lista de testimoniale lipsește.' }, { status: 400 });
  }

  const items: Testimonial[] = [];
  for (const raw of data.items as Record<string, unknown>[]) {
    const name = String(raw.name || '').trim();
    const text = String(raw.text || '').trim();
    if (!name || !text) {
      return NextResponse.json({ error: 'Fiecare testimonial are nevoie de nume și text.' }, { status: 400 });
    }
    const image = String(raw.image || '').trim();
    if (image && !/^(https?:\/\/|\/api\/media\/)/.test(image)) {
      return NextResponse.json({ error: `Poza de la „${name}" e invalidă.` }, { status: 400 });
    }
    items.push({
      id: String(raw.id || '').trim() || `testi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      role: String(raw.role || '').trim(),
      text,
      image: image || undefined,
    });
  }

  saveTestimonials(items);
  return NextResponse.json({ ok: true });
}
