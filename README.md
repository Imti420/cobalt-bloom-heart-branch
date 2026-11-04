# ADMISSION//26

The Bangladesh university admission archive for the 2026–27 session.

A local desk: directory, circulars, deadline radar, shortlist and application tracker. Personal marks stay in this browser. There is no account and no external database.

## Launch

Requirements: Node.js 22 or newer.

```bash
npm install
npm run dev
```

The dev server listens on port 8080.

```bash
npm run build
npm run preview
```

## What is stored

Seed records live in `src/data/universities.ts` and `src/data/circulars.ts`.

Unknown dates, fees, seats and eligibility are `null` and render as **NOT ANNOUNCED**. Do not fill a number from memory or from last year's circular.

Evidence grades:

- **Official notice cited** — a report quotes a university notice, press release, or signed decision. A PDF is linked only when this archive has a URL.
- **Reported** — a newsroom stated the date. The underlying document is not stored here.
- **Reported · not final** — the source itself calls the date proposed, probable, provisional or tentative.
- **Marked verified on this desk** — your own check. It does not change the source grade.

The 4 Nov 2026 seed uses the UGC public-university list for names and websites, and three Daily Star reports for dates. It does not scrape the web.

## Backup

Settings → Export desk backup. That JSON restores bookmarks, notes, the shortlist, tracker progress and amendments. The merged catalog export is a readable snapshot and is not an import file.
