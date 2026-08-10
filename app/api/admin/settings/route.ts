import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin';
import { getSettings, saveSettings } from '@/lib/settings';
import type { SiteSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
  }
  return NextResponse.json({ settings: getSettings() });
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
  }
  let data: Partial<SiteSettings>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 });
  }
  const current = getSettings();
  const gaRaw = String(data.ga ?? current.ga).trim().toUpperCase();
  if (gaRaw && !/^G-[A-Z0-9]{4,20}$/.test(gaRaw)) {
    return NextResponse.json(
      { error: 'ID Google Analytics invalid — trebuie să arate ca G-XXXXXXXXXX (nu GTM-... sau UA-...).' },
      { status: 400 }
    );
  }
  const fbRaw = String(data.fbpixel ?? current.fbpixel).trim();
  if (fbRaw && !/^[0-9]{5,20}$/.test(fbRaw)) {
    return NextResponse.json(
      { error: 'ID Meta Pixel invalid — trebuie să fie doar cifre (ex: 2108829569729584).' },
      { status: 400 }
    );
  }
  const next: SiteSettings = {
    telefon: String(data.telefon ?? current.telefon).trim(),
    email: String(data.email ?? current.email).trim(),
    firma: String(data.firma ?? current.firma).trim(),
    cui: String(data.cui ?? current.cui).trim(),
    regcom: String(data.regcom ?? current.regcom).trim(),
    adresa: String(data.adresa ?? current.adresa).trim(),
    program: String(data.program ?? current.program).trim(),
    whatsapp: String(data.whatsapp ?? current.whatsapp).replace(/[^0-9]/g, ''),
    anunt: String(data.anunt ?? current.anunt).trim(),
    ga: gaRaw,
    fbpixel: fbRaw,
  };
  saveSettings(next);
  return NextResponse.json({ ok: true });
}
