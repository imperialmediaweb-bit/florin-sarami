import { NextResponse } from 'next/server';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

/** Informații publice ale site-ului (pentru butonul WhatsApp și bara de anunț). */
export async function GET() {
  const s = getSettings();
  return NextResponse.json({ whatsapp: s.whatsapp, anunt: s.anunt, ga: s.ga, fbpixel: s.fbpixel });
}
