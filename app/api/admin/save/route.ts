import { NextResponse } from 'next/server';
import { isAuthorized, saveFileToGitHub } from '@/lib/admin';

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Cerere invalidă.' }, { status: 400 });
  }

  const slug = String(data.slug || '').trim().toLowerCase();
  const title = String(data.title || '').trim();
  let contentHtml = String(data.contentHtml || '').trim();

  if (!/^[a-z0-9-]{3,120}$/.test(slug)) {
    return NextResponse.json(
      { error: 'Slug invalid — folosește doar litere mici, cifre și cratime (ex: titlul-articolului).' },
      { status: 400 }
    );
  }
  if (!title || !contentHtml) {
    return NextResponse.json({ error: 'Titlul și conținutul sunt obligatorii.' }, { status: 400 });
  }

  // text simplu lipit fără HTML → transformă paragrafele în <p>
  if (!/<(p|h[1-6]|ul|ol|div|blockquote)\b/i.test(contentHtml)) {
    contentHtml = contentHtml
      .split(/\n{2,}/)
      .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
      .join('\n');
  }

  const excerptSource = String(data.excerpt || '').trim();
  const post = {
    slug,
    title,
    date: String(data.date || '').trim() || new Date().toISOString(),
    category: String(data.category || '').trim() || undefined,
    excerpt:
      excerptSource ||
      contentHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220),
    contentHtml,
    image: String(data.image || '').trim() || undefined,
  };

  try {
    await saveFileToGitHub(
      `content/blog/${slug}.json`,
      JSON.stringify(post, null, 2) + '\n',
      `Admin: salvare articol "${title}"`
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Salvarea în GitHub a eșuat.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
