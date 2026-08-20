import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/admin';
import { dataDir } from '@/lib/storage';

export const dynamic = 'force-dynamic';

/** Istoricul emailurilor trimise din panou. */
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
  }
  const dir = dataDir('trimise');
  const sent = fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 100);
  return NextResponse.json({ sent });
}
