import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { dataDir } from '@/lib/storage';

const TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

/** Servește imaginile urcate din admin (fallback-ul local, când Cloudinary nu e configurat). */
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[a-z0-9-]+\.(jpe?g|png|gif|webp|avif)$/.test(name)) {
    return NextResponse.json({ error: 'Nume invalid.' }, { status: 400 });
  }
  const file = path.join(dataDir('media'), name);
  if (!fs.existsSync(file)) {
    return NextResponse.json({ error: 'Nu există.' }, { status: 404 });
  }
  const ext = path.extname(name);
  return new NextResponse(new Uint8Array(fs.readFileSync(file)), {
    headers: {
      'Content-Type': TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
