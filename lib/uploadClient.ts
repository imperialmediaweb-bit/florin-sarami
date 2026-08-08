/** Urcă o imagine prin /api/admin/upload și întoarce URL-ul final (sau aruncă eroare). */
export async function uploadImageFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/admin/upload/', { method: 'POST', body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Upload eșuat.');
  return data.url as string;
}
