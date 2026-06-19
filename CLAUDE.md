# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal static site ("Steve's Notes") that publishes condensed podcast/reading notes, hosted on GitHub Pages at https://stevehuang8242.github.io/notes/. No framework and no runtime dependencies — hand-written HTML plus a small zero-dependency Node build step. All content is Traditional Chinese.

## Architecture

Content lives as **self-contained HTML note files** in the repo root (e.g. `bg2-spacex-ipo-fable5.html`). Each note carries its own inline `<style>` (the dark theme / `--accent` / Saira + PingFang/JhengHei font stack is **copied per file by convention — there is no shared stylesheet**) and, in its `<head>`, a block of `note:*` meta tags that supply the home-page listing metadata:

```html
<meta name="note:src"    content="BG2 Pod">
<meta name="note:date"   content="2026.06.12">   <!-- YYYY.MM.DD; blank sinks to bottom -->
<meta name="note:title"  content="當 SpaceX 偷偷蓋了一座 AWS">
<meta name="note:dek"    content="一句話摘要…">
<meta name="note:people" content="Gavin Baker · …">
```

`note:title` is the **listing** title and is intentionally distinct from the page's own `<title>`.

**`build-index.js`** (pure Node, no deps) scans every `*.html` except `index.html`, reads the `note:*` meta, strips each note's body to plain text, and emits two files:

- **`notes.json`** — listing metadata, sorted newest-first by `note:date`. Loaded on page load.
- **`search-index.json`** — `{file, text}` per note (full body text). Loaded lazily on first search.

**Both JSON files are generated artifacts — git-ignored, never committed.** They are rebuilt fresh by CI on every deploy (and must be built locally for local preview).

**`index.html`** is the landing page. It `fetch`es `notes.json` to render the list, and lazily `fetch`es `search-index.json` on first search-box focus. Search is client-side: queries are whitespace-split into terms and matched as case-insensitive **substrings** (AND across terms) over both the listing metadata and the full body text — substring matching is deliberate because Chinese has no word boundaries. Title hits score highest; body hits render a highlighted snippet.

### Deploy

`.github/workflows/deploy.yml` runs on push to `main`: it runs `build-index.js`, assembles `_site/` (the HTML files + the two generated JSON), and deploys via `actions/deploy-pages`. Pages is configured with `build_type: workflow` (deploy from Actions, **not** from branch) — so the generated indexes never need to live in the repo.

## Adding a note

1. Drop a new self-contained HTML file in the repo root, including the `note:*` meta block in its `<head>`.
2. Commit and push. CI rebuilds `notes.json` / `search-index.json` and redeploys.

No list or index is hand-maintained — the build derives everything from the note files.

## Local preview

The page fetches JSON, so it must be served over **HTTP** (never `file://`, which silently breaks `fetch`). Build the indexes first:

```bash
node build-index.js
python3 -m http.server 8000   # open http://localhost:8000/index.html
```

There is no automated test suite; verify changes in a browser.

## Scaling note

Current search loads one `search-index.json` for the whole site — fine into the low hundreds of notes. If the collection ever reaches ~thousands, that single index gets too large to ship whole; switch to a sharded static-search engine (e.g. Pagefind, which also handles CJK), likely alongside moving content to Markdown + an SSG.
