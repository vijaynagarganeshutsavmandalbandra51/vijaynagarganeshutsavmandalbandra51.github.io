# 🙏 Ganeshotsav Mandal Website

**गणपती बाप्पा मोरया!** — Website for our Sarvajanik Ganeshotsav Mandal (est. 1969, **59th Ganeshotsav in 2027**).

- **Front end:** Angular 21 + TypeScript (`client/`)
- **Back end / laptop host:** ASP.NET Core (`server/`)
- **No database.** All content is in JSON files and photo folders.
- **100 % free to host** on GitHub Pages — no domain or server to buy.

## 📱 Made for phones first

Most devotees will open the site on a mobile, so on phones it has:
- a **bottom tab bar** (Home · Schedule · **Donate** · Live · Photos) within thumb reach
- a compact top bar with the ☰ menu and the मराठी / EN button
- **swipe** left/right on the photo slider, awards and full-screen photos
- swipeable day chips on the Schedule (today's day opens automatically during the Utsav)
- 2-column photo grids, larger tap targets, no sideways scrolling
- **"Add to Home screen"** support – visitors can install it like an app (Chrome menu ⋮ → *Add to Home screen*)

Tip: test on your phone while running at home with `dotnet run --launch-profile lan` (see below), or in Chrome on the laptop press **F12 → 📱 (Toggle device toolbar)**.

---

## ✅ First time on your home laptop (step by step)

1. **Install Node.js 22 LTS or 24 LTS** → https://nodejs.org (choose "LTS", click Next → Next → Finish)
2. **Install the .NET 10 SDK** → https://dotnet.microsoft.com/download
   (If you already have .NET 8 or 9: open `server/MandalWebsite.Server.csproj` and change `net10.0` to `net8.0` / `net9.0`.)
3. **Unzip** `mandal-website.zip` somewhere simple, e.g. `D:\mandal-website`
4. **Double-click `start-website.bat`** (Mac/Linux: run `./start-website.sh`).
   The first run downloads packages (needs internet, takes 2–5 minutes). Later runs are quick.
5. Open **http://localhost:5000** in Chrome. 🎉

Only want to see/edit the design (no .NET needed)?
```bash
cd client
npm install       # first time only
npm start         # opens on http://localhost:4200 with live reload
```

**Show it on phones at the pandal (same Wi-Fi):**
```bash
cd server
dotnet run --launch-profile lan
```
Then open `http://<laptop-IP>:5000` on the phone (find the IP with `ipconfig`). Allow it through Windows Firewall if asked.

---

## 📸 Adding photos & videos year-wise (most important!)

Folder: **`client/public/media/years/`**

```
media/years/
├── 2026/
│   ├── cover.jpg          ← main Bappa photo (used as the year's cover)
│   ├── 01-aagman.jpg
│   ├── 02-aarti.jpg
│   ├── 03-visarjan.mp4    ← small clips are OK
│   └── info.json          ← optional: theme, description, YouTube links, captions
├── 2025/
├── 2024/
└── 1969/                  ← you can go all the way back to the first year
```

- Make a folder named with the **year** and drop that year's photos in. That's it.
- Only years that have something in them are shown. Missing years are simply skipped.
- The site shows "**58th year**", "**57th year**"… automatically (based on `firstUtsavYear: 1969` in `mandal.json`).
- Photos appear in file-name order → name them `01-…`, `02-…`.
- **Compress photos** to ~300–500 KB each (free: https://squoosh.app). Phone photos are 3–8 MB and would make the site slow.
- **Long videos → YouTube** (free), then paste the link into that year's `info.json`. GitHub rejects files over 100 MB.

`info.json` example (copy from the `2026` folder):
```json
{
  "title": "Wari – The Pilgrimage of Devotion",
  "titleMr": "वारी – भक्तीची वाटचाल",
  "text": "Our 58th year. The decoration showed the Pandharpur wari…",
  "textMr": "आमचे ५८ वे वर्ष…",
  "youtube": ["https://www.youtube.com/watch?v=XXXXXXXXXXX"],
  "captions":   { "cover.jpg": "Bappa 2026", "02-aarti.jpg": "Maha Aarti" },
  "captionsMr": { "cover.jpg": "बाप्पा २०२६", "02-aarti.jpg": "महाआरती" }
}
```
The `title`/`text` of each year also fills the **Decoration Theme** page.

These folders feed: **Bappa Through the Years** page, a page per year, the **Photo Gallery** (filter by year), the **Decoration Theme** page and the home page.

> How it works: before every run/build, `client/scripts/generate-media-manifest.mjs` scans the folders and writes `data/years.json`. You can also run it by hand: `cd client && npm run media`.

The sample folders (2026, 2025, 2024, 2018) contain **placeholder pictures** — delete them and add your real photos.

---

## ✏️ Changing the text (English + मराठी)

All text is in **`client/public/data/`**. Any field can have a Marathi twin ending in `Mr` (`title` / `titleMr`). The 🌐 button in the top bar switches language; if a Marathi text is missing, English is shown.

| File | What it controls |
|---|---|
| `mandal.json` | Name, logo, **news strip** (`marquee`), **hero slider** (`heroSlides`), festival dates, aarti timings, featured video, **history** + timeline, stats, **awards**, announcements, contact, **social links**, **live darshan**, **UPI / bank details** |
| `schedule.json` | Day-wise programs for the 11 days |
| `videos.json` | YouTube videos (home page sections + Videos page). `showOnHome: true` puts it on the home page |
| `initiatives.json` | Social & educational initiatives |
| `visitors.json` | **Distinguished Visitors** page (leaders who visited the pandal). Copy one block per person: `year`, `name`/`nameMr`, `role`/`roleMr` (designation), `text`/`textMr`, `photo` (put the photo in `public/images/visitors/`, e.g. `2027-name.jpg`). Newest year is shown first. |
| `committee.json` | **Committee Members** and **Helpers** (shown on the home page and the Committee page). Each person: `name`, `nameMr`, `role`, `roleMr`, `photo` (e.g. `images/committee/rahul.jpg`, empty = initials), `phone`. Section headings: `title` / `titleMr` — put the Marathi name for Helpers in `helpers.titleMr`. |

**Images:** `client/public/images/`
- `slides/slide-1.svg … slide-3.svg` → replace with big landscape photos (e.g. `slide-1.jpg`, 1920×1000) and update `heroSlides` in `mandal.json`
- `history.svg` → an old mandal photo · `logo.svg` + `../favicon.svg` → your logo

**YouTube video ID** = the part after `watch?v=` → `https://www.youtube.com/watch?v=`**`dQw4w9WgXcQ`**

**Live Darshan:** in `mandal.json → live`, set `youtubeChannelId` (starts with `UC…`, from YouTube Studio → Settings → Channel → Advanced) to always show your channel's current live stream, or `youtubeLiveVideoId` for one specific stream. Enable live streaming on YouTube at least 24 h before the festival (one-time phone verification, free).

**Festival dates 2027:** Ganesh Chaturthi Sat 4 Sept 2027, Anant Chaturdashi (visarjan) 14 Sept 2027 — already set in `mandal.json → festival`. Change every year.

> ⚠️ JSON is strict: keep the double quotes and no comma after the last item. If a page stays on "Loading…", paste the file into https://jsonlint.com to find the mistake.

---

## 🌐 Publish free on GitHub Pages

1. Create a free account on https://github.com and a new **public** repository, e.g. `mandal-website`.
2. Install Git (https://git-scm.com), then in the project folder:
   ```bash
   git init
   git add .
   git commit -m "Mandal website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/mandal-website.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. **Actions** tab → wait for "Deploy to GitHub Pages" to turn green ✅ (about 2 minutes).
5. Live at **`https://<your-username>.github.io/mandal-website/`** 🎉

After that, every `git push` (or editing a file directly on github.com) updates the site automatically.

**Show up in Google Search (free):** go to https://search.google.com/search-console → *Add property* → *URL prefix* → paste your github.io address → verify with the "HTML tag" method (paste the `<meta>` tag into `client/src/index.html` inside `<head>`, push, then click Verify) → *Sitemaps/URL inspection* → *Request indexing*. Google usually lists it within a few days.

**Optional:** a custom name like `www.yourmandal.com` costs ~₹800/year — not needed.

---

## 🗂️ Project structure

```
mandal-website/
├── client/                              Angular 21 + TypeScript
│   ├── public/
│   │   ├── data/*.json                  ← all text content
│   │   ├── media/years/<year>/          ← year-wise photos & videos
│   │   └── images/                      ← logo, slider, history, committee photos
│   ├── scripts/generate-media-manifest.mjs   scans media/years → data/years.json
│   └── src/
│       ├── styles.scss                  colours & fonts (change --primary, --accent, --marigold …)
│       ├── environments/                where content is loaded from (JSON vs API)
│       └── app/
│           ├── core/                    models, content service, i18n (EN/मराठी), countdown
│           ├── layout/                  header (menus), marquee, social rail, footer
│           ├── shared/                  page banner, YouTube player, lightbox, scroll-reveal
│           └── pages/                   home, about, committee, decoration, schedule, live,
│                                        initiatives, years, year-detail, gallery, contact
├── server/                              ASP.NET Core
│   ├── Program.cs                       hosts the Angular app + route fallback
│   ├── Controllers/ContentController.cs GET /api/content/{mandal|schedule|committee|videos|initiatives|years}
│   └── wwwroot/                         (generated) built Angular app
├── .github/workflows/                   automatic GitHub Pages deploy
├── MandalWebsite.sln                    open in Visual Studio
├── start-website.bat / .sh              one-click start
└── README.md
```

**Pages:** Home · Mandal's History · Committee · Decoration Theme · Distinguished Visitors · Schedule & Events (shows a countdown until `schedule.json` has `"published": true`) · Bappa Through the Years · each year · Photo Gallery · Contact & Donate (UPI QR).

**Where content comes from:** `npm start` and GitHub Pages read `data/*.json` directly; the ASP.NET Core server serves the same files through `/api/content/*`.

**Add a new page:** create a component in `client/src/app/pages/`, add a route in `app.routes.ts`, a menu entry in `layout/header/header.ts`, and labels in `core/i18n.service.ts`.

---

मंगलमूर्ती मोरया! 🌺
