# Vijay Nagarcha Raja website – handover notes

Give this file (and the zip) to Claude in a new chat and say:
"This is our mandal website project. Read HANDOVER.md and README.md first."

## What it is
- Website of **Vijay Nagar Sarvajanik Ganesh Utsav Mandal** (विजय नगरचा राजा), Bandra (East), Mumbai 400051, founded 1969.
- Angular app in `client/` (plus an optional ASP.NET Core host in `server/`). **No database** – all content is JSON + images.
- Live at **https://vijaynagarganeshutsavmandalbandra51.github.io/**
- GitHub organisation `vijaynagarganeshutsavmandalbandra51`, repository `vijaynagarganeshutsavmandalbandra51.github.io`
  (owner account: CodePilot18 – Ketan). Every push to `main` auto-deploys via GitHub Actions (`.github/workflows`).
- The GitHub repo is the master copy. This zip is a backup / starting point.

## Where to change things
| What | File |
|---|---|
| Mandal info, address, contact, history, **Mission 60**, awards, featured videos, festival dates | `client/public/data/mandal.json` |
| Committee + Vyavasthapak (Members) | `client/public/data/committee.json` (photos: `client/public/images/committee/*.jpg`, 480×480 square, white background) |
| Schedule (`"published": false` shows only the "Bappa is coming on" countdown) | `client/public/data/schedule.json` |
| Visitors / guests | `client/public/data/visitors.json` |
| Year photos & videos | `client/public/media/years/<year>/` + `info.json` (title, text, captions in English + `Mr`) |
| SEO / Google / share preview | `client/src/index.html`, `client/public/sitemap.xml`, `robots.txt` |

Any text field can have a Marathi twin with the `Mr` suffix (e.g. `title` / `titleMr`).

## Commands
```bash
cd client
npm install
node scripts/generate-media-manifest.mjs   # after adding/removing year photos or videos
npm run build                              # or: npm start  (local preview)
```
Then commit and push to `main`; the site updates in ~1 minute.

## Conventions used so far
- Photos: auto-enhanced, max side 1600 px, JPEG quality ~80.
- Website videos are **muted** (`ffmpeg -an`, 720p, H.264, `-movflags +faststart`) with a `<name>.poster.jpg` thumbnail.
- Empty committee seats use `images/logo.svg` with name "To be updated" / "लवकरच".
- Never link to Google Drive – every image/video is stored inside the repo.
- Year numbering: 1969 = 1st Ganeshotsav → 2026 = 58th, **2027 = 59th (4–14 Sep 2027)**, **2028 = 60th, Diamond Jubilee / Mission 60 (23 Aug – 2 Sep 2028, expected)**.

## Contacts on the site
- Phone / WhatsApp: +91 83559 94705 · Email: vijaynagarcharajabandra51@gmail.com
- Instagram: https://www.instagram.com/_vijaynagarcha_raja_/
- Map: https://maps.app.goo.gl/3ePpdehUfkw8B6wVA

## Still pending (as of 17 Oct 2026)
- Committee: Treasurer (Khajindar), Auditors no. 3 and 5. Members: places 1, 5, 9–12.
- YouTube and Facebook pages not created yet → then link them in `mandal.json` → `social` (artwork is in `extras/social/`).
- Decoration theme names for 2008–2024 (most years only say "Our Nth Ganeshotsav").
- Large videos that could not be imported from Drive (2025 videos 2–6, 2024, 2023 (2), 2022 (2), 2021, 2020 (2), 2019, 2014 AVI, 2012).
- About-page timeline items 1985 "registered as a trust" and 1993 "silver jubilee week-long festival" are unverified sample text – confirm or remove.
- Google Search Console verification tag, Google Business Profile verification, UPI ID for donations, `.com` domain.

## Extras folder (not part of the website build)
- `extras/social/` – YouTube banner, Facebook cover, profile picture, QR code + printable QR poster (PNG/PDF).
