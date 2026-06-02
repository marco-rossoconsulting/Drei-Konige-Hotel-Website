# Content Verification Notes

This file documents what's in the initial content and where it came from — so the team can confidently edit or extend it without re-checking sources every time.

## Verified directly from dreikoenige.ch

- **Founded 1793** by Zunftmeister Conrad Bavier (Home > History)
- **Founding announcement quote** — verbatim from the History page
- **Schällibaum family ran it for 3+ generations until 2005** (History page)
- **Current operator: DC Gastronomie GmbH** (footer of every page)
- **Address: Reichsgasse 18, CH-7000 Chur** (footer)
- **Phone: +41 81 354 90 90** (every page header)
- **Email: info@dreikoenige.ch** (footer)
- **7 minutes walk from Chur Hauptbahnhof** ("Specifics" on homepage)
- **More than 10 restaurants within a 2-minute walk** ("Specifics" on homepage)
- **Free Wi-Fi in all rooms and public areas** ("Specifics")
- **Free lockable bike room** ("Specifics")
- **Parking 1 minute walk away** ("Specifics")
- **All 9 room categories and rates** (Hotel > Room rates page) — Single CHF 95, Double Economy CHF 120, Double Standard / Courtyard / Twin CHF 130, Double Classic / Historic CHF 140, Double Superior CHF 150, Triple CHF 190. *Per room/night, without breakfast, incl. VAT. Tourist tax CHF 2.60 per person per night.*
- **Breakfast: daily 6:30 – 10am, CHF 15 (external)** (Hotel > Breakfast)
- **Check-in 3pm – 8pm, check-out by 11am** (General Information)
- **Pets: CHF 15/night** (General Information)
- **Children: under 6 free in existing bed, under 15 CHF 10 discount, cot CHF 30/night** (General Information)
- **Heritage features mentioned on the History page:**
  - The Weinstube was once a postal relay station and a set for the film *Jürg Jenatsch*
  - The "Drei König" banquet hall was alternately part of an abbey and the seat of government
  - Legend of an underground passage from the bishop's seat
  - First Grisons forestry workers' health insurance scheme drafted under this roof
  - The oldest preserved hotel room in Chur is in the building

## NOT from their site — general public knowledge about Chur

These are facts about Chur the city, not claims about the hotel:

- "Switzerland's oldest continuously inhabited city" (5,000+ years) — widely documented
- Chur Guest Card — Chur Tourism / Graubünden Ferien
- Rhaetian Railway, Bernina Express, Glacier Express, Landwasser Viaduct depart from Chur — verifiable via SBB / RhB
- Rhine cycle route runs through Chur — Switzerland Tourism

## Placeholders that need replacement before launch

- **All images** are Unsplash placeholders. Every image field is a Sveltia upload widget — replace with real hotel photography.
- **Booking widget** currently triggers an `alert()`. Wire to the hotel's actual booking engine (their existing `wbe4` system, or replace it).
- **Number of rooms** — not stated on their own site. Booking.com listings vary (31–38). I have intentionally NOT made a specific room-count claim. If you want one, get it confirmed by the hotel and add it back to `src/content/sections/stats.json`.

## Things I noted but did NOT include without confirmation

- Specific Weinstube interior description (panelling, beams) — only the historic-use facts are confirmed
- Any current restaurant menu — the hotel doesn't operate one
- Any current banquet-hall offering — the hall exists historically; not currently promoted as a venue
- Seat counts, opening hours of any restaurant — none confirmed

If any of these come back into scope (e.g. the hotel decides to rent out the banquet hall again), the CMS structure is ready for it — add a new section file and surface in `index.astro`.

---

## CMS architecture notes (Keystatic edition)

Content is managed via Keystatic admin at `/keystatic/`. The schema lives in `keystatic.config.ts` at the project root. Editors see the content grouped by language in the sidebar (English / Deutsch / Français / Italiano).

**Important:** when an editor updates a field in Keystatic, it commits a new JSON file to the GitHub repo, which triggers a Cloudflare rebuild. Updates go live in ~30–60 seconds, no manual deploys needed.

Files Keystatic manages:
- `src/content/settings/{locale}/{site|nav|footer}/index.json` — site-wide settings
- `src/content/sections/{locale}/{section}/index.json` — per-section copy
- `src/content/{rooms|experiences|practical}/{locale}/{slug}.json` — collections

The site reads these JSON files at build time via Vite's `import.meta.glob` — no runtime dependency on Keystatic. If Keystatic ever needed to be swapped out, the content is just JSON in Git and would survive any CMS migration.
