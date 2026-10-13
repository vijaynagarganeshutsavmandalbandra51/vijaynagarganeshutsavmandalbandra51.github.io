HOW TO ADD PHOTOS / VIDEOS FOR A YEAR
=====================================

1. Make a folder with the year as its name, e.g.  2023
2. Put that year's photos inside (.jpg .jpeg .png .webp). Small .mp4 clips also work.
   - Name the main Bappa photo  cover.jpg  so it is used as the year's cover.
   - Photos are shown in file-name order: 01-..., 02-..., 03-...
   - Please compress photos to under ~500 KB each (e.g. with https://squoosh.app).
   - Long videos: upload to YouTube and put the link in info.json (GitHub refuses files over 100 MB).
3. Optional: add  info.json  (copy one from 2026 and edit):
   {
     "title": "Decoration theme",       "titleMr": "देखावा",
     "text": "Short description",        "textMr": "माहिती",
     "youtube": ["https://www.youtube.com/watch?v=XXXXXXXXXXX"],
     "captions":   { "cover.jpg": "Bappa 2023" },
     "captionsMr": { "cover.jpg": "बाप्पा २०२३" }
   }

That's it. The list of years is rebuilt automatically every time you run
`npm start`, `npm run build...`, start-website.bat, or push to GitHub.
Empty year folders are ignored.
