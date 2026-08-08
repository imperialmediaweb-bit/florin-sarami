import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin';
import { dataDir } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
  }
  const dir = dataDir('mesaje');
  const messages = fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  // ștergere mesaj
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
  }
  let data: { id?: string };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 });
  }
  const id = String(data.id || '');
  if (!/^[0-9]+-[a-z0-9]+$/.test(id)) {
    return NextResponse.json({ error: 'ID invalid.' }, { status: 400 });
  }
  const file = path.join(dataDir('mesaje'), `${id}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  return NextResponse.json({ ok: true });
}
