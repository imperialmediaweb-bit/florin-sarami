import fs from 'fs';
import path from 'path';

/**
 * Folder de date persistent:
 *  - pe Railway cu Volume montat la /data → /data/<sub>
 *  - altfel → content/<sub> din proiect (pentru rulare locală)
 */
export function dataDir(sub: string): string {
  const base = process.env.DATA_DIR || (fs.existsSync('/data') ? '/data' : path.join(process.cwd(), 'content'));
  const dir = path.join(base, sub);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
