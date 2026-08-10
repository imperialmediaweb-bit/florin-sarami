import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin';

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
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret) {
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
  const signature = crypto
    .createHash('sha1')
    .update(`public_id=${publicId}&timestamp=${timestamp}${secret}`)
    .digest('hex');

  return NextResponse.json({
    cloud,
    apiKey: key,
    timestamp,
    publicId,
    signature,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloud}/video/upload`,
  });
}
