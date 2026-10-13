#!/usr/bin/env node
/**
 * Scans  public/media/years/<YEAR>/  and writes  public/data/years.json
 *
 * Runs automatically before `npm start` and every build (see package.json "pre..." scripts),
 * so you only need to drop photos into a year folder – no code changes.
 *
 * Inside each year folder:
 *   - photos:  .jpg .jpeg .png .webp .gif .svg   (name one "cover.jpg" to use it as the year's cover)
 *   - videos:  .mp4 .webm                         (keep them small; use YouTube for long videos)
 *   - info.json (optional):
 *       {
 *         "title": "Wari – The Pilgrimage of Devotion",   "titleMr": "वारी – भक्तीची वाटचाल",
 *         "text":  "Decoration theme description…",       "textMr":  "…",
 *         "youtube": ["https://www.youtube.com/watch?v=XXXXXXXXXXX", "https://youtu.be/YYYYYYYYYYY"],
 *         "captions": { "photo-1.jpg": "Pranapratishtha", "photo-2.jpg": "Visarjan" }
 *       }
 */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const yearsDir = join(root, 'media', 'years');
const outFile = join(root, 'data', 'years.json');

const IMAGE = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']);
const VIDEO = new Set(['.mp4', '.webm']);
const BIG_FILE_MB = 25;

const mandal = JSON.parse(readFileSync(join(root, 'data', 'mandal.json'), 'utf8'));
const firstYear = Number(mandal.firstUtsavYear) || Number(mandal.established);

const naturalSort = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

function youtubeId(link) {
  const m = String(link).match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  return m ? m[1] : /^[\w-]{11}$/.test(link) ? link : null;
}

function readInfo(dir) {
  const file = join(dir, 'info.json');
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (err) {
    console.warn(`⚠️  ${file} is not valid JSON – ignored (${err.message})`);
    return {};
  }
}

const years = [];
const warnings = [];

if (existsSync(yearsDir)) {
  for (const name of readdirSync(yearsDir).sort().reverse()) {
    const dir = join(yearsDir, name);
    if (!/^\d{4}$/.test(name) || !statSync(dir).isDirectory()) continue;

    const year = Number(name);
    const info = readInfo(dir);
    const files = readdirSync(dir).filter((f) => !f.startsWith('.')).sort(naturalSort);
    const url = (f) => `media/years/${name}/${encodeURIComponent(f)}`;

    for (const f of files) {
      const mb = statSync(join(dir, f)).size / 1024 / 1024;
      if (mb > BIG_FILE_MB) warnings.push(`${name}/${f} is ${mb.toFixed(0)} MB – too big for GitHub; compress it or upload to YouTube.`);
    }

    const imageFiles = files.filter((f) => IMAGE.has(extname(f).toLowerCase()));
    const coverFile = imageFiles.find((f) => /^cover\./i.test(f)) ?? imageFiles[0];
    const captions = info.captions ?? {};

    // cover photo first, then the rest in file-name order
    const ordered = coverFile ? [coverFile, ...imageFiles.filter((f) => f !== coverFile)] : imageFiles;
    const images = ordered.map((f) => ({
      src: url(f),
      caption: captions[f] ?? '',
      captionMr: (info.captionsMr ?? {})[f] ?? '',
    }));

    const videos = [
      ...files.filter((f) => VIDEO.has(extname(f).toLowerCase())).map((f) => ({ type: 'file', src: url(f) })),
      ...(info.youtube ?? []).map(youtubeId).filter(Boolean).map((id) => ({ type: 'youtube', id })),
    ];

    if (!images.length && !videos.length && !info.title) continue; // empty folder – skip

    years.push({
      year,
      edition: firstYear ? year - firstYear + 1 : null,
      title: info.title ?? '',
      titleMr: info.titleMr ?? '',
      text: info.text ?? '',
      textMr: info.textMr ?? '',
      cover: coverFile ? url(coverFile) : '',
      team: info.team?.photo ? { ...info.team, photo: url(info.team.photo) } : undefined,
      images,
      videos,
    });
  }
}

writeFileSync(outFile, JSON.stringify({ firstUtsavYear: firstYear, years }, null, 2) + '\n');

const photos = years.reduce((n, y) => n + y.images.length, 0);
const vids = years.reduce((n, y) => n + y.videos.length, 0);
console.log(`🪔 media manifest: ${years.length} year(s), ${photos} photo(s), ${vids} video(s) -> public/data/years.json`);
warnings.forEach((w) => console.warn('⚠️  ' + w));
