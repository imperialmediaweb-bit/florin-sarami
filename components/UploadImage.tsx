'use client';

import { useState } from 'react';
import { uploadImageFile } from '@/lib/uploadClient';

/** Buton de upload imagine (către Cloudinary prin /api/admin/upload) cu previzualizare. */
export default function UploadImage({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function upload(file: File) {
    setUploading(true);
    setError('');
    try {
      onChange(await uploadImageFile(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload eșuat.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" style={{ height: 52, borderRadius: 8, border: '1px solid var(--line)' }} />
        )}
        <label className="btn btn-ghost" style={{ padding: '9px 18px', fontSize: '.88rem', cursor: 'pointer' }}>
          {uploading ? 'Se urcă...' : value ? '🔄 Schimbă poza' : '📷 Urcă poză'}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            disabled={uploading}
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = '';
            }}
          />
        </label>
        {value && (
          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '9px 14px', fontSize: '.85rem', color: '#dc2626', borderColor: 'rgba(220,38,38,.4)' }}
            onClick={() => onChange('')}
          >
            Scoate
          </button>
        )}
      </div>
      {error && <p style={{ color: '#dc2626', fontSize: '.85rem', marginTop: 6 }}>⚠ {error}</p>}
    </div>
  );
}
