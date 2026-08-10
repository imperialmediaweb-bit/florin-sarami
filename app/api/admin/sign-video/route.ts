import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin';
import { cloudinaryConfig, signCloudinaryParams } from '@/lib/cloudstore';

export const dynamic = 'force-dynamic';

/**
 * Semnează un upload de clip video direct din browser către Cloudinary.
 * Fișierul NU trece prin serverul nostru — merge direct în Cloudinary,
 * deci funcționează și cu clipuri mari, fără limită de body pe server.
 */
export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
  }
  const c = cloudinaryConfig();
  if (!c) {
    return NextResponse.json(
      { error: 'Cloudinary nu e configurat (variabilele CLOUDINARY_* lipsesc).' },
      { status: 500 }
    );
  }

  let base = 'clip';
  try {
    const data = await req.json();
    base =
      String(data.name || 'clip')
        .toLowerCase()
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 50) || 'clip';
  } catch {
    /* nume implicit */
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `sarami-video/${base}-${Date.now().toString(36)}`;

  return NextResponse.json({
    cloud: c.cloud,
    apiKey: c.key,
    timestamp,
    publicId,
    signature: signCloudinaryParams({ public_id: publicId, timestamp }, c.secret),
    uploadUrl: `https://api.cloudinary.com/v1_1/${c.cloud}/video/upload`,
  });
}
