/**
 * Șablonul HTML de brand pentru emailurile Sarami Media —
 * logo, antet cu gradient albastru, card alb, footer.
 * Stiluri inline (cerință a clienților de email gen Gmail/Outlook).
 */

const LOGO_URL =
  'https://res.cloudinary.com/kaz6teok/image/upload/e_trim:10/h_120,c_fit/v1786184469/Screenshot_1049_mdo29q.png';

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const nl2br = (s: string) => escapeHtml(s).replace(/\n/g, '<br>');

/** Tabel etichetă → valoare pentru detaliile brief-urilor. */
export function fieldsTable(rows: [string, string][]): string {
  const tr = rows
    .filter(([, v]) => v && v.trim())
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:8px 14px;background:#f0f6ff;border-radius:6px 0 0 6px;font-weight:700;color:#16307a;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(k)}</td>
        <td style="padding:8px 14px;background:#f7faff;border-radius:0 6px 6px 0;color:#43587f;font-size:13px;">${escapeHtml(v)}</td>
      </tr>
      <tr><td colspan="2" style="height:6px;"></td></tr>`
    )
    .join('');
  return `<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:separate;margin:14px 0;">${tr}</table>`;
}

export function brandEmail({
  heading,
  bodyHtml,
  preheader = '',
}: {
  heading: string;
  bodyHtml: string;
  preheader?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="ro">
<body style="margin:0;padding:0;background:#eef4fd;font-family:'Segoe UI',Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preheader)}</span>
  <table cellpadding="0" cellspacing="0" style="width:100%;background:#eef4fd;padding:28px 12px;">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;">
        <!-- logo -->
        <tr><td align="center" style="padding:6px 0 18px;">
          <img src="${LOGO_URL}" alt="Sarami Media" height="52" style="height:52px;width:auto;display:block;">
        </td></tr>
        <!-- card -->
        <tr><td style="background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(29,78,216,.12);">
          <table cellpadding="0" cellspacing="0" style="width:100%;">
            <!-- antet gradient -->
            <tr><td style="background:linear-gradient(135deg,#16307a,#1d4ed8 60%,#2563eb);background-color:#1d4ed8;padding:22px 30px;">
              <h1 style="margin:0;color:#ffffff;font-size:19px;line-height:1.35;">${escapeHtml(heading)}</h1>
            </td></tr>
            <!-- conținut -->
            <tr><td style="padding:26px 30px;color:#43587f;font-size:14.5px;line-height:1.65;">
              ${bodyHtml}
            </td></tr>
          </table>
        </td></tr>
        <!-- footer -->
        <tr><td align="center" style="padding:18px 10px;color:#7d8fb0;font-size:12px;line-height:1.6;">
          <strong style="color:#16307a;">Sarami Media</strong> — editare video &amp; redactare conținut<br>
          <a href="https://sarami.ro" style="color:#2563eb;text-decoration:none;">sarami.ro</a> •
          <a href="mailto:contact@sarami.ro" style="color:#2563eb;text-decoration:none;">contact@sarami.ro</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
