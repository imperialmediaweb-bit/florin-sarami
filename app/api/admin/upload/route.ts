import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin';
import { dataDir } from '@/lib/storage';

/**
 * Upload de imagini din panoul de admin (thumbnail-uri articole etc.).
 *  - cu CLOUDINARY_* setate în variabilele de mediu → urcă în Cloudinary
 *  - altfel → salvează pe discul serverului (persistent cu Volume la /data)
 *    și servește prin /api/media/<nume>
 */
export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
  }

  let file: File | null = null;
  try {
    const fd = await req.formData();
    file = fd.get('file') as File | null;
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 });
  }
  if (!file || !file.size) {
    return NextResponse.json({ error: 'Nicio poză primită.' }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: 'Poza e prea mare (max 8 MB).' }, { status: 400 });
  }
  // extensia derivă din tipul MIME real, nu din numele fișierului —
  // formatele nesuportate (SVG, HEIC etc.) sunt refuzate clar, nu servite greșit
  const MIME_EXT: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/avif': '.avif',
  };
  const ext = MIME_EXT[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: 'Format neacceptat — folosește JPG, PNG, GIF, WEBP sau AVIF.' },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeBase = (file.name || 'poza')
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || 'poza';
  const stamp = Date.now().toString(36);

  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const cldKey = process.env.CLOUDINARY_API_KEY;
  const cldSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloud && cldKey && cldSecret) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const publicId = `sarami-site/${safeBase}-${stamp}`;
      const signature = crypto
        .createHash('sha1')
        .update(`public_id=${publicId}&timestamp=${timestamp}${cldSecret}`)
        .digest('hex');
      const body = new FormData();
      body.append('file', `data:${file.type};base64,${buffer.toString('base64')}`);
      body.append('api_key', cldKey);
      body.append('timestamp', String(timestamp));
      body.append('public_id', publicId);
      body.append('signature', signature);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
        method: 'POST',
        body,
      });
      if (!res.ok) throw new Error(`Cloudinary HTTP ${res.status}`);
      const data = await res.json();
      return NextResponse.json({ url: data.secure_url });
    } catch (err) {
      // NU cădem silențios pe discul local (efemer pe Railway fără Volume) —
      // adminul trebuie să afle că upload-ul spre Cloudinary a eșuat
      console.error('Upload Cloudinary eșuat:', err);
      return NextResponse.json(
        { error: 'Upload-ul către Cloudinary a eșuat — încearcă din nou în câteva secunde.' },
        { status: 502 }
      );
    }
  }

  // fallback local doar când Cloudinary nu e configurat:
  // salvează pe disc și servește prin /api/media/
  const name = `${safeBase}-${stamp}${ext}`;
  fs.writeFileSync(path.join(dataDir('media'), name), buffer);
  return NextResponse.json({ url: `/api/media/${name}` });
}
