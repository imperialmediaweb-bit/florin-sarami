# Sarami Media — site de prezentare

Site static (HTML/CSS/JS pur, fără dependențe) pentru serviciile de editare video și redactare conținut Sarami Media.

## Pagini

| Pagină | Fișier |
|---|---|
| Home (slider 3 slide-uri, servicii, testimoniale, FAQ) | `index.html` |
| Despre noi (poveste din 2020, timeline, valori) | `despre-noi.html` |
| Editare video (landing page servicii) | `editare-video.html` |
| Portofoliu (subpagină, cu filtre pe categorii) | `portofoliu.html` |
| Redactare conținut (Human Written, SEO, studii de caz) | `redactare-continut.html` |
| Contact (formular + bifă GDPR) | `contact.html` |
| Mulțumim (după trimiterea formularului) | `multumim.html` |
| Termeni și condiții | `termeni-si-conditii.html` |
| Politica de confidențialitate | `politica-confidentialitate.html` |
| Politica de cookies | `politica-cookies.html` |

## Cum publici site-ul

Fiind un site static, îl poți urca **oriunde**: hosting clasic cu cPanel (upload în `public_html`), Netlify, Vercel, GitHub Pages etc. Nu are nevoie de bază de date sau PHP.

## De completat înainte de lansare

1. **Logo-ul original** — site-ul folosește o recreare SVG a logo-ului (`assets/logo.svg` — fundal deschis, `assets/logo-white.svg` — varianta pentru site-ul închis la culoare). Ca să folosești PNG-ul original, urcă fișierul în `assets/` și înlocuiește calea din `<img src="assets/logo-white.svg">` în toate paginile.
2. **Clipurile din portofoliu** — în `portofoliu.html` există un comentariu HTML cu instrucțiuni pas cu pas: înlocuiești fiecare placeholder cu un embed YouTube (`https://www.youtube.com/embed/ID_VIDEO`).
3. **Numărul de telefon și datele firmei** — în `contact.html` (căută `+40 7xx` și `CUI: ROxxxxxxxx`), plus în paginile legale (comentariile `<!-- Completează ... -->`).
4. **Activarea formularului de contact** — formularul folosește [FormSubmit](https://formsubmit.co) și trimite mesajele la `contact@sarami.ro`. La primul mesaj trimis, FormSubmit livrează un email de activare pe adresa respectivă — apasă linkul din el o singură dată. De asemenea, în `contact.html`, câmpul `_next` trebuie să conțină URL-ul real al paginii de mulțumire (acum e `https://sarami.ro/multumim.html`).

## Structură

```
assets/    logo-uri SVG + favicon
css/       style.css — tot designul (culori din logo, gradiente, animații)
js/        main.js — slider, meniu mobil, animații la scroll, filtre, cookie banner
*.html     paginile site-ului
```
