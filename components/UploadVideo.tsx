'use client';

import { useRef, useState } from 'react';

/**
 * Upload de clipuri video din panoul de admin — direct din browser în
 * Cloudinary (semnat de server prin /api/admin/sign-video/), cu bară de
 * progres. Returnează URL-ul .mp4 optimizat, gata de redat pe site.
 */
export default function UploadVideo({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');

  async function onPick(file: File) {
    setError('');
    if (!/^video\//.test(file.type)) {
      setError('Alege un fișier video (MP4, MOV, WEBM).');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError('Clipul e prea mare (max 100 MB). Exportă-l comprimat sau folosește un link YouTube.');
      return;
    }
    setProgress(0);
    try {
      const signRes = await fetch('/api/admin/sign-video/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name }),
      });
      const sign = await signRes.json();
      if (!signRes.ok) throw new Error(sign.error || 'Semnarea upload-ului a eșuat.');

      const fd = new FormData();
      fd.append('file', file);
      fd.append('api_key', sign.apiKey);
      fd.append('timestamp', String(sign.timestamp));
      fd.append('public_id', sign.publicId);
      fd.append('signature', sign.signature);

      const url: string = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', sign.uploadUrl);
        xhr.upload.onprogress = e => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) resolve(data.secure_url);
            else reject(new Error(data?.error?.message || `Upload eșuat (HTTP ${xhr.status}).`));
          } catch {
            reject(new Error('Răspuns neașteptat de la Cloudinary.'));
          }
        };
        xhr.onerror = () => reject(new Error('Conexiunea a picat în timpul upload-ului.'));
        xhr.send(fd);
      });

      // livrare optimizată: mp4 + calitate automată, indiferent de formatul urcat
      const mp4 = url
        .replace('/video/upload/', '/video/upload/q_auto/')
        .replace(/\.[a-z0-9]+$/i, '.mp4');
      onChange(mp4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload-ul a eșuat.');
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      {value ? (
        <div style={{ display: 'grid', gap: 10 }}>
          <video src={value} controls preload="metadata" style={{ width: '100%', maxHeight: 260, borderRadius: 12, background: '#0d1c42' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '.85rem' }} onClick={() => inputRef.current?.click()}>
              Înlocuiește clipul
            </button>
            <button type="button" className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '.85rem', color: '#dc2626', borderColor: 'rgba(220,38,38,.4)' }} onClick={() => onChange('')}>
              Scoate clipul
            </button>
          </div>
        </div>
      ) : progress !== null ? (
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ height: 10, borderRadius: 999, background: 'rgba(37,99,235,.15)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#1d4ed8,#38bdf8)', transition: 'width .3s' }} />
          </div>
          <span style={{ fontSize: '.85rem', color: 'var(--text-dim)' }}>Se încarcă clipul... {progress}%</span>
        </div>
      ) : (
        <button type="button" className="btn btn-ghost" onClick={() => inputRef.current?.click()}>
          🎞️ Încarcă clip de pe calculator (max 100 MB)
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/webm,video/*"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) onPick(f); }}
      />
      {error && <p style={{ color: '#dc2626', fontSize: '.85rem', marginTop: 8 }}>⚠ {error}</p>}
    </div>
  );
}
