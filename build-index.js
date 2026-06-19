#!/usr/bin/env node
/*
 * build-index.js — 掃描資料夾內所有筆記 HTML，產生兩個檔給首頁使用：
 *   notes.json         首頁清單中繼資料（取自各篇 <head> 的 note:* meta 標籤）
 *   search-index.json  每篇內文純文字（供全文搜尋，首頁第一次搜尋時才載入）
 *
 * 純 Node、零依賴。新增筆記時毋須改動本檔；GitHub Action 會在 push 時自動執行。
 *   用法： node build-index.js
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;
const SKIP = new Set(['index.html']);

function decodeEntities(s){
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0*39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function readMeta(html, name){
  const m = html.match(new RegExp('<meta\\s+name="note:' + name + '"\\s+content="([^"]*)"', 'i'));
  return m ? decodeEntities(m[1]).trim() : '';
}

function pageTitle(html){
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? decodeEntities(m[1]).trim() : '';
}

// strip a note's HTML down to readable body text for the search index
function bodyText(html){
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let s = m ? m[1] : html;
  s = s.replace(/<script[\s\S]*?<\/script>/gi, ' ')
       .replace(/<style[\s\S]*?<\/style>/gi, ' ')
       .replace(/<[^>]+>/g, ' ');
  return decodeEntities(s).replace(/\s+/g, ' ').trim();
}

const files = fs.readdirSync(ROOT)
  .filter(f => f.endsWith('.html') && !SKIP.has(f))
  .sort();

const notes = [];
const searchIndex = [];

for(const file of files){
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const title = readMeta(html, 'title') || pageTitle(html) || file;
  if(!readMeta(html, 'title')){
    console.warn(`⚠  ${file}: 缺少 <meta name="note:title">，暫用頁面 <title>。`);
  }
  notes.push({
    file,
    src:    readMeta(html, 'src'),
    date:   readMeta(html, 'date'),
    title,
    dek:    readMeta(html, 'dek'),
    people: readMeta(html, 'people'),
  });
  searchIndex.push({ file, text: bodyText(html) });
}

// newest first: by date desc; undated sink to the bottom; stable tiebreak by filename
const dkey = d => (d || '').replace(/[.\-/]/g, '');
notes.sort((a, b) => dkey(b.date).localeCompare(dkey(a.date)) || a.file.localeCompare(b.file));

fs.writeFileSync(path.join(ROOT, 'notes.json'), JSON.stringify(notes, null, 2) + '\n');
fs.writeFileSync(path.join(ROOT, 'search-index.json'), JSON.stringify(searchIndex));

const kb = Math.round(fs.statSync(path.join(ROOT, 'search-index.json')).size / 1024);
console.log(`✓ notes.json (${notes.length} 篇)、search-index.json (${kb} KB)`);
