# Hotel Drei Könige Chur — Astro + Sveltia CMS on Netlify

Editorial heritage site for Hotel Drei Könige, Reichsgasse 18, Chur.

## Stack

- **Astro 6** — pure static build, 4 prerendered HTML pages
- **Sveltia CMS** — modern Git-based headless CMS (Decap/Netlify CMS-compatible config, modern Svelte editor UI)
- **Netlify** — hosting + Git Gateway + Identity (managed editor auth)
- **GitHub** — single source of truth for code and content

No databases. No serverless functions. No CLI tools required for deployment.

## Deploy in 3 steps

### 1. Push to GitHub
Create a repo (e.g. `dreikoenige-website`) and push this project to it.

### 2. Connect Netlify
1. Log in to Netlify → **Add new site** → **Import an existing project**
2. Select the GitHub repo
3. Build settings are auto-detected from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy**. First build takes ~1 minute.

### 3. Enable editor login (Netlify Identity + Git Gateway)
1. Site dashboard → **Identity** → **Enable Identity**
2. Under **Registration preferences**, set to **Invite only** (so random people can't sign up)
3. Under **Services → Git Gateway** → **Enable Git Gateway**
4. Click **Invite users** → enter editor email addresses

Editors get an email invite, set a password, log in at `https://www.dreikoenige.ch/admin/`, and start editing.

That's the whole deploy. Push to GitHub from now on → Netlify rebuilds in ~60 seconds.

## Custom domain
Site dashboard → **Domain management** → **Add custom domain** → `www.dreikoenige.ch`. SSL is automatic (Let's Encrypt).

## Editing content

Editors visit `https://www.dreikoenige.ch/admin/`. They see content organised by language tabs in the editor (Sveltia handles i18n natively — same field, language tabs).

Three top-level groupings in the sidebar:

- **Site Settings** — SEO, navigation, footer (one entry each, per locale)
- **Page Sections** — hero, heritage, stats, rooms section, building features, experiences section, practical section, CTA strip
- **Rooms** / **Experiences** / **Practical Info** — collections, multiple entries

When an editor hits **Publish**, Sveltia commits the JSON change to GitHub via Netlify's Git Gateway. Netlify auto-rebuilds. New content is live in ~60 seconds.

## Local development

```bash
npm install
npm run dev          # http://localhost:4321 — site
npm run build        # produces dist/
npm run preview      # serves the build locally
```

The CMS admin works locally only against a deployed Git Gateway, so use Netlify's branch deploy previews (auto-created for every PR) to test admin changes before they hit production.

## Project structure

```
src/
  components/                     Astro components, one per page section
  content/                        All content (managed by Sveltia)
    settings/{en,de,fr,it}/       site.json, nav.json, footer.json per locale
    sections/{en,de,fr,it}/       hero.json, heritage.json, stats.json, etc.
    rooms/{en,de,fr,it}/          9 room JSON files per locale
    experiences/{en,de,fr,it}/    6 Chur experience JSON files per locale
    practical/{en,de,fr,it}/      8 practical info JSON files per locale
  layouts/Layout.astro            Shared <head>: SEO, JSON-LD, hreflang, preloads
  pages/
    index.astro                   English at /
    [lang]/index.astro            de / fr / it
    sitemap.xml.ts                Multilingual sitemap with hreflang

public/
  admin/
    index.html                    Sveltia CMS entry (loads from unpkg)
    config.yml                    Sveltia schema for everything × 4 locales
  _headers, _redirects, robots.txt
  favicon.svg, images/

netlify.toml                      Netlify build config
astro.config.mjs                  Astro static config (no adapter)
```

## SEO — what's in place

### Per page (every locale)
- ✅ Localised `<title>` and `<meta name="description">`
- ✅ Canonical URL
- ✅ Hreflang × 5 (`en`, `de-CH`, `fr-CH`, `it-CH`, `x-default`)
- ✅ `<html lang>` set correctly per locale
- ✅ Theme color, format-detection, robots meta (`max-image-preview:large`)
- ✅ Geo meta tags (`geo.region: CH-GR`, `geo.position`, `ICBM`)

### Social / Open Graph
- ✅ OG title, description, image (with width/height), URL, site_name, type
- ✅ OG locale (current) + 3 locale alternates
- ✅ Twitter Card (summary_large_image) with image + alt

### Structured data (JSON-LD graph)
Three linked entities under a single `@graph`:
- ✅ **WebSite** — top-level identity with `inLanguage`
- ✅ **Hotel** — full schema:
  - PostalAddress (street, city, postal code, region: Graubünden, country: CH)
  - GeoCoordinates
  - 4 `amenityFeature` entries (WiFi, bike storage, breakfast, pets)
  - `checkinTime: 15:00`, `checkoutTime: 11:00`, `petsAllowed: true`
  - `foundingDate: 1793-01-01`, slogan, star rating, price range
  - `containsPlace`: 9 **HotelRoom** entries, each with bed type and occupancy
- ✅ **BreadcrumbList**

### Performance / Core Web Vitals
- ✅ Hero image preload with `fetchpriority="high"` (LCP optimisation)
- ✅ Font preconnects + `display=swap`
- ✅ Lazy loading on all below-the-fold images
- ✅ Fingerprinted asset caching (1 year immutable)
- ✅ HTML revalidation headers (instant content updates)

### Accessibility & semantics
- ✅ Single `<h1>` (hero), `<h2>` per section (proper hierarchy)
- ✅ Every section has `aria-labelledby` pointing to its heading
- ✅ Each room rendered as `<article>` with its own `aria-labelledby`
- ✅ Landmark elements: `<nav>`, `<main>`, `<section>`, `<footer>`
- ✅ `<meta name="robots">` allows Google to use large image previews
- ✅ Alt text on every image (per-locale)

### Search engine signals
- ✅ Multilingual `/sitemap.xml` with full hreflang annotations
- ✅ `/robots.txt` pointing at sitemap; blocks `/admin/` from crawlers
- ✅ Security headers (HSTS, CSP-adjacent) via `_headers`

## Before going live (one-time tasks)

1. **Replace placeholder images** — all photos are currently Unsplash. Either upload real photos via the Sveltia admin's image fields, or drop files into `public/images/` and reference them
2. **Real OG image** — should be a real hotel exterior photo (1200×630)
3. **Booking engine URL** — Book Now button currently links to `https://www.dreikoenige.ch/wbe4/index.html`. Update via Sveltia (Site Settings → Navigation → Book Now button) once a new engine goes live
4. **JSON-LD coordinates** — verify against Google Maps for Reichsgasse 18 before launch (currently approximate at 46.8499, 9.5329)
5. **Change `site:` in `astro.config.mjs`** if the final production URL differs from `www.dreikoenige.ch`
6. **Submit sitemap to Google Search Console** at https://search.google.com/search-console for faster indexation

## What the site does NOT promote

Following the actual content of dreikoenige.ch (not aggregator listings):
- **No on-site restaurant** — Weinstube and Drei König hall are framed as historic features of the building on the History section
- **No specific room counts** — sources disagree (31 / 33 / 38); hotel's own site doesn't state one
- **No fixed room prices** — these come from the booking engine

See `VERIFIED-CONTENT-NOTES.md` for the provenance of every claim.
