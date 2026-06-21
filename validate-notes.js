#!/usr/bin/env node
/*
 * validate-notes.js — 檢查每篇筆記 HTML 的 note:* meta 是否合規。
 *
 * 本站無共用 stylesheet、無框架，meta 一致性只能靠約定維持；篇數變多後
 * 容易 drift（缺日期、日期格式錯、欄位誤用…）。本檔把 CLAUDE.md 的
 * 「listing-card convention」變成可執行的檢查，CI 在 build 前先跑一次，
 * 有 error 就以非零退出碼擋下 deploy。
 *
 * 純 Node、零依賴。
 *   用法： node validate-notes.js          掃描全部筆記
 *          node validate-notes.js a.html   只檢查指定檔（生成器產出後自查用）
 *
 * 退出碼： 0 = 全部通過（warning 不影響）；1 = 有 error。
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;
const SKIP = new Set(['index.html']);

// 必填、非空的欄位（缺或空 = error）
const REQUIRED = ['src', 'date', 'title', 'dek'];
// 日期格式：YYYY.MM.DD
const DATE_RE = /^\d{4}\.\d{2}\.\d{2}$/;
// dek 建議上限：清單一行約 ~40 個 CJK 字，兩行(~80)仍可接受；
// 超過 90 約等於三行以上，才提醒可能破版。
const DEK_MAX = 90;

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
// 區分「沒有這個 meta 標籤」與「有但 content 為空」——訊息才精準
function hasMeta(html, name){
  return new RegExp('<meta\\s+name="note:' + name + '"', 'i').test(html);
}

function checkFile(file){
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const errors = [];
  const warnings = [];

  const meta = {};
  for(const k of ['src', 'date', 'title', 'dek', 'people']) meta[k] = readMeta(html, k);

  // 1. 必填非空
  for(const k of REQUIRED){
    if(!meta[k]){
      const why = hasMeta(html, k) ? '為空' : '缺少';
      errors.push(`note:${k} ${why}（必填）`);
    }
  }

  // 2. 日期格式
  if(meta.date && !DATE_RE.test(meta.date)){
    errors.push(`note:date 格式錯誤「${meta.date}」，必須是 YYYY.MM.DD（例 2026.06.12）`);
  }

  // 3. 語意軟檢查（warning，不擋 deploy）
  //   people 是「署名／與談人」，不該重複 src 這個類型/來源標籤
  if(meta.people && meta.src && meta.people.includes(meta.src)){
    warnings.push(`note:people 含有 src 標籤「${meta.src}」，可能把類型詞誤塞進署名列`);
  }
  if(meta.dek && [...meta.dek].length > DEK_MAX){
    warnings.push(`note:dek 過長（${[...meta.dek].length} 字 > ${DEK_MAX}），卡片可能折行破版`);
  }

  return { errors, warnings };
}

// ── 主流程 ──
const arg = process.argv[2];
const files = arg
  ? [path.basename(arg)]
  : fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !SKIP.has(f)).sort();

let errCount = 0, warnCount = 0, badFiles = 0;

for(const file of files){
  if(SKIP.has(file)) continue;
  const { errors, warnings } = checkFile(file);
  if(!errors.length && !warnings.length) continue;
  badFiles++;
  console.log(`\n${file}`);
  for(const e of errors){   console.log(`  ✗ ${e}`); errCount++; }
  for(const w of warnings){ console.log(`  ⚠ ${w}`); warnCount++; }
}

console.log(
  `\n${'─'.repeat(40)}\n` +
  `檢查 ${files.length} 篇：${errCount} error、${warnCount} warning` +
  (errCount ? '' : '（全部通過）')
);

if(errCount){
  console.error(`\n✗ 有 ${errCount} 個 error，請修正後再 build/deploy。`);
  process.exit(1);
}
