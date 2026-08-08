# Sarami Media — site de prezentare

Site pentru serviciile de editare video și redactare conținut Sarami Media, construit cu **Next.js + TypeScript** (React, App Router).

## Rulare locală

```bash
npm install
npm run dev        # deschide http://localhost:3000
```

## Build pentru producție

```bash
npm run build
```

Configurația folosește `output: 'export'` — build-ul generează un **site static în folderul `out/`**, pe care îl poți urca pe orice hosting (cPanel → `public_html`, Netlify, Vercel, GitHub Pages). URL-urile sunt curate, fără `.html`: `/despre-noi/`, `/editare-video/`, `/portofoliu/`, `/redactare-continut/`, `/contact/` etc.

Dacă vei găzdui pe Vercel sau pe un server Node, poți șterge linia `output: 'export'` din `next.config.mjs` și rula `npm start` după build.

## Pagini

| Rută | Descriere |
|---|---|
| `/` | Home — slider 3 slide-uri, servicii, testimoniale, FAQ |
| `/despre-noi` | Poveste din 2020, timeline, valori |
| `/editare-video` | Landing page servicii video + teaser portofoliu |
| `/portofoliu` | Subpagină cu filtre pe categorii |
| `/redactare-continut` | Human Written, beneficii SEO/Google, studii de caz |
| `/contact` | Formular cu bifă GDPR → contact@sarami.ro |
| `/multumim` | Confirmare după trimiterea formularului |
| `/termeni-si-conditii`, `/politica-confidentialitate`, `/politica-cookies` | Pagini legale |

## Importul articolelor din WordPress

Site-ul are o secțiune de blog (`/blog`) care citește articolele din `content/blog/` (fișiere JSON). Ca să aduci articolele existente de pe WordPress (sarami.ro):

```bash
npm run import:wp                          # importă de pe https://sarami.ro
npm run import:wp -- https://alt-site.ro   # sau de pe alt site WordPress
```

Scriptul citește articolele publicate prin API-ul WordPress (`/wp-json/wp/v2/posts`), preia imaginile (copertă + cele din articole) și salvează fiecare articol ca `content/blog/<slug>.json`. Apoi rulezi `npm run build` și articolele apar pe `/blog`. Comanda trebuie rulată de pe un calculator care poate accesa site-ul (al tău e suficient).

În `content/blog/` există două articole demonstrative — le poți șterge după import.

### Imagini pe Cloudinary (opțional, recomandat)

Copiază `.env.example` cu numele `.env` (în folderul proiectului) și completează valorile din Cloudinary → Dashboard:

```
CLOUDINARY_CLOUD_NAME="numele-cloud"
CLOUDINARY_API_KEY="cheia-api"
CLOUDINARY_API_SECRET="secretul-api"
```

Scriptul de import citește automat fișierul `.env`. **Important:** `.env` este în `.gitignore` și nu se urcă niciodată pe GitHub — repository-ul este public, iar cheile ar fi furate de boți în câteva minute. Cu `.env` completat, imaginile sunt urcate în Cloudinary (folderul `sarami-blog/`) și articolele folosesc link-urile de acolo. Fără `.env`, imaginile se descarcă local în `public/blog/` — funcționează la fel de bine.

### Protecție SEO — vechile URL-uri nu se pierd

Scriptul de import reține URL-ul vechi al fiecărui articol de pe WordPress și scrie automat **redirect-uri 301** în `public/.htaccess` (ex: `sarami.ro/titlu-articol/` → `sarami.ro/blog/titlu-articol/`). Fișierul ajunge în `out/` la build și este citit de serverele Apache/cPanel. Google urmează redirecturile și transferă autoritatea vechilor pagini către cele noi — fără erori 404, fără penalizări.

Site-ul generează automat și `sitemap.xml` + `robots.txt` (la build). După lansare, trimite `https://sarami.ro/sitemap.xml` în [Google Search Console](https://search.google.com/search-console) ca reindexarea să fie cât mai rapidă.

## De completat înainte de lansare

1. **Logo-ul original** — urcă PNG-ul original ca `public/assets/logo.png`; componenta `components/Logo.tsx` îl folosește automat (până atunci afișează recrearea SVG din `public/assets/logo.svg`). Logo-ul apare pe o „pastilă" albă în meniu și footer, ca pe materialele de brand.
2. **Clipurile din portofoliu** — în `components/PortfolioGrid.tsx`, completează `videoId` pentru fiecare element din `ITEMS` cu ID-ul clipului de pe YouTube (pentru `youtube.com/watch?v=abc123XYZ`, ID-ul este `abc123XYZ`).
3. **Telefon și date firmă** — în `app/contact/page.tsx` (caută `+40 7xx` și `ROxxxxxxxx`) și comentariile `{/* Completează ... */}` din paginile legale.
4. **Activarea formularului** — formularul folosește [FormSubmit](https://formsubmit.co) și trimite la `contact@sarami.ro`. La primul mesaj trimis de pe site, FormSubmit livrează un email de activare pe această adresă — apasă linkul din el o dată. URL-ul paginii de mulțumire este setat în `components/ContactForm.tsx` (`_next`).

## Structură

```
app/            paginile (App Router) + globals.css (tot designul)
components/     Header, Footer, HeroSlider, Testimonials, PortfolioGrid,
                ContactForm, CookieBanner, ScrollFx (animații), Logo etc.
public/assets/  logo-uri SVG + favicon (+ logo.png al tău)
```
