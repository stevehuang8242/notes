# Steve's Notes — 設計系統規範 (Design System)

統一首頁與內頁的視覺語言，定義**深色 / 淺色**兩套主題。
本檔是規範來源 (single source of truth)；各 HTML 仍依慣例各自內嵌 `<style>`，
但 token 區塊與元件樣式都應以本檔為準複製。

> **架構前提**：本站無共用 stylesheet，每個 note 檔自帶整份 `<style>`（CLAUDE.md 的「copied per file by convention」）。
> 因此「設計系統」= 一份**可貼上的 token 區塊 + 元件樣式字典**，而非一支 CSS。

---

## 0. 現況差異盤點 (為何需要這份規範)

| 項目 | `index.html` | `bg2-…` 內頁 | `spacex-s1-…` 內頁 | 規範統一為 |
|---|---|---|---|---|
| 主題 | **深 + 淺**（token 化） | 僅深色 | 僅深色 | 深 + 淺 |
| Nav 高度 | 54px | 54px | **52px** | **54px** |
| Nav 底色 | `var(--nav-bg)` | 寫死 `rgba(0,0,0,.55)` | 寫死 `rgba(0,0,0,.55)` | `var(--nav-bg)` |
| 卡片底色 | — | 寫死 `#000` | 寫死 `#000` | `var(--surface)` |
| 進度條軌 | — | `rgba(255,255,255,.04)` | `rgba(255,255,255,.08)` | `var(--track)` |
| 圖表灰階 | — | `#8e8e95` / `#4a4a50` | `#6a6a72` | `--bar-2/3` ramp |
| 語意色 | `--accent` | `--accent` | `--pos` / `--neg`（無淺色） | 全部補淺色變體 |
| Section 間距 | 110px | 120px | 104px | **scale（見 §4）** |

**結論**：內頁要支援淺色，唯一阻礙是上面那些「寫死的深色值」。把它們換成下方 token 即可。

---

## 1. 設計原則

1. **編輯室質感，非儀表板**：黑底白字、細線分隔、寬鬆字距的小型 uppercase 標籤；資訊靠排版層級，不靠色塊。
2. **單一冷調強調色**：`--accent`（cold steel）是唯一裝飾色；其餘一律中性灰階。
3. **數字是主角**：大號 `font-variant-numeric:tabular-nums`，等寬對齊。
4. **線比面重**：分隔用 `--line` / `--hair` 髮絲線與 1px gap grid，少用填色。
5. **語意色克制**：`--pos` / `--neg` 只在「真的有正負含義」時出現（財務、bull/bear），不做純裝飾。
6. **兩主題同構**：深淺只換 token，**不分叉元件樣式**。任何寫死的顏色都是 bug。

---

## 2. 色彩 Token（深 + 淺）

> 直接複製這整段 `:root` / `[data-theme="light"]` 到每個檔案。
> 已涵蓋首頁既有變數 + 內頁需要補上的 `--surface` / `--track` / `--bar-*` / `--pos` / `--neg`。

```css
:root{
  color-scheme:dark;

  /* —— 基底 / 文字 —— */
  --bg:#000;            /* 頁面底 */
  --surface:#000;       /* 卡片 / 區塊面（深色下＝bg） */
  --ink:#fff;           /* 主文字 */
  --ink2:#b9b9bd;       /* 次文字 / 內文 */
  --ink3:#7c7c82;       /* 標籤 / 註解 / 弱化 */

  /* —— 線 —— */
  --line:rgba(255,255,255,.16);   /* 主分隔線、邊框、tag 框 */
  --hair:rgba(255,255,255,.10);   /* 髮絲線、grid gap、次邊框 */

  /* —— 面 / 互動底 —— */
  --panel:rgba(255,255,255,.035); /* 輸入框、hover 底 */
  --panel2:rgba(255,255,255,.06); /* focus / 強化底 */
  --track:rgba(255,255,255,.06);  /* 進度條 / bar 軌道 */

  /* —— 強調色 —— */
  --accent:#9db7d8;               /* cold steel：連結 hover、focus、編號 */
  --mark:rgba(157,183,216,.28);   /* 搜尋高亮 */

  /* —— 語意色（財務 / 多空）—— */
  --pos:#37d6ad;        /* 正向 / cash engine / bull */
  --neg:#ff5a4d;        /* 負向 / burn / bear */

  /* —— 資料視覺中性階（長條圖）—— */
  --bar-1:var(--ink);   /* 最強：白 */
  --bar-2:#8e8e95;      /* 中灰 */
  --bar-3:#4a4a50;      /* 暗灰 */

  /* —— Nav —— */
  --nav-bg:rgba(0,0,0,.55);
  --nav-bg2:rgba(0,0,0,.78);      /* scrolled */

  /* —— 字體 —— */
  --sf:"Saira","PingFang TC","Helvetica Neue","Microsoft JhengHei",sans-serif;
}

[data-theme="light"]{
  color-scheme:light;

  --bg:#f7f7f5;
  --surface:#ffffff;              /* 卡片浮在淺灰頁面上＝純白 */
  --ink:#16181d;
  --ink2:#4a4d55;
  --ink3:#85888f;

  --line:rgba(0,0,0,.15);
  --hair:rgba(0,0,0,.08);

  --panel:rgba(0,0,0,.04);
  --panel2:rgba(0,0,0,.06);
  --track:rgba(0,0,0,.06);

  --accent:#3f6597;               /* 加深以在淺底維持對比 */
  --mark:rgba(63,101,151,.20);

  --pos:#0e8c68;                  /* 加深的綠，淺底可讀 */
  --neg:#d23b2e;                  /* 加深的紅 */

  --bar-1:var(--ink);
  --bar-2:#6f727a;
  --bar-3:#c9cbd1;

  --nav-bg:rgba(247,247,245,.72);
  --nav-bg2:rgba(247,247,245,.88);
}
```

**「填色上的文字」規則**（給長條 / split / 進度條，避免兩主題互換時看不見）：

```css
.bf-1 .v, .bf-2 .v { color:var(--bg);  }  /* 強填色 → 用底色當反白字 */
.bf-3 .v           { color:var(--ink); }  /* 弱填色 → 用主文字色 */
```

深色：bg=黑、ink=白 → 強填色上黑字、暗填色上白字 ✓
淺色：bg≈白、ink=黑 → 強填色上白字、淺填色上黑字 ✓ — **無需分叉，token 自動翻轉。**

> FOUC 防呆：每個檔案 `<head>` 第一支 script 先讀 `localStorage.theme`（否則跟隨 `prefers-color-scheme`）寫上 `data-theme`，再載入樣式。沿用 `index.html` 的那段 inline script。

---

## 3. 字體系統

字體一律 `--sf`（Saira 數字/拉丁 + PingFang TC / 微軟正黑中文）。

| 角色 | size | weight | letter-spacing | line-height | 顏色 |
|---|---|---|---|---|---|
| Hero / 大標 H1 | `clamp(33–46px … 70–118px)` | 600 | `.005–.01em` | `.98–1.28` | `--ink` |
| Section H2 | `clamp(28–30px,4.4–4.6vw,46–52px)` | 600 | `.005em` | `1.08–1.1` | `--ink` |
| 卡片標題 H3 | 23px | 600 | `.01em` | 1.2 | `--ink` |
| Lede 導言 | `clamp(17–18px,2.1vw,21–22px)` | **300** | — | 1.55 | `--ink2` |
| Body 內文 | 17–18px | **300** | `.01em` | 1.7–1.72 | `--ink2`（`strong`→`--ink`/500） |
| Pull-quote 引言 | `clamp(23–24px,3.4–3.8vw,38–40px)` | **300** | `.005em` | 1.34 | `--ink`（`b`→600） |
| **Eyebrow / Label** | 11–12px | 600 | **`.22–.28em` UPPERCASE** | — | `--ink3` |
| Meta / 註腳 | 11–12.5px | 300–400 | `.12–.18em` | — | `--ink3` |
| 大數字 value | `clamp(26–40px … 50–66px)` | 500 | `.005em` | 1 | `--ink`／語意色 |

**簽名手法**：
- 細體大字 (`font-weight:300` 的標題/引言) 是本站的招牌反差。
- 小型 UPPERCASE + 寬 `letter-spacing`（`.2em`↑）只用於英數標籤，**中文不套 uppercase**。
- `.num{font-variant-numeric:tabular-nums}` 一律加在數字上。

---

## 4. 間距 / 版面 / 形狀

```css
.wrap{max-width:1080px;margin:0 auto;padding:0 30px}
```

| Token | 桌面 | 手機 (`≤760px`) | 用途 |
|---|---|---|---|
| Section 垂直留白 | **110px** | 80px | `section{padding:110px 0}` |
| Hero 留白 | 100–110px top | 96px | — |
| Masthead 留白（首頁） | 130px / 54px | 104px / 40px | — |
| Grid gap（卡片牆） | **1px**（露出 `--hair` 當格線） | 1px | bento / bb / strip |
| 卡片內距 | 32–40px × 26–34px | 28px × 22px | — |
| Label→內容 | 22–46px | — | — |

- **間距收斂**：原本 104/110/120 三種 → 一律 **110px**（手機 80px）。
- **圓角極小**：`2px`（tag/btn/輸入框 4px）。本站幾乎全直角，圓角只是去毛邊，**不要用大圓角**。
- **格線牆模式**：`display:grid;gap:1px;background:var(--hair)` + 子項 `background:var(--surface)` → 1px 髮絲格線。是 bento / metric strip / bull-bear 的統一做法。

```css
.section{padding:110px 0;border-top:1px solid var(--hair)}
@media(max-width:760px){.section{padding:80px 0}}
```

---

## 5. 動效

```css
/* 進場 */
.rev{opacity:0;transform:translateY(24px);transition:opacity .85s ease,transform .85s ease}
.rev.in{opacity:1;transform:none}

/* 條狀生長（圖表）統一緩動 */
transition:width 1.2s cubic-bezier(.25,1,.4,1);

/* 主題切換 */
body{transition:background .35s ease,color .35s ease}
```

- 進場位移 `translateY(22–26px)` → 統一 **24px**，時長 **.85s**。
- 圖表/進度條成長曲線統一 `cubic-bezier(.25,1,.4,1)`，1.2s。
- **務必**保留 reduced-motion 收斂：

```css
@media(prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  .rev,.fill,.sg,.bar-fill,.b{transition:none!important;opacity:1;transform:none}
}
```

---

## 6. 元件字典 (Component Catalog)

所有元件在深淺兩主題下**用同一份樣式**，僅靠 token 換色。下列為各元件的權威定義與來源頁。

### 6.1 Nav（全站）
固定頂列，54px，毛玻璃。捲動加底線。
```css
nav{position:fixed;inset:0 0 auto;z-index:100;height:54px;display:flex;align-items:center;
  background:var(--nav-bg);backdrop-filter:saturate(160%) blur(14px);
  -webkit-backdrop-filter:saturate(160%) blur(14px);
  border-bottom:1px solid transparent;transition:border-color .3s,background .3s}
nav.scrolled{border-bottom-color:var(--hair);background:var(--nav-bg2)}
/* brand＝breadcrumb：站名（連回首頁）› 頁名（當前位置） */
nav .brand{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.26em;display:flex;align-items:center;gap:10px;min-width:0}
nav .brand a{color:var(--ink2);transition:color .2s;white-space:nowrap}   /* 站名：muted，hover→ink */
nav .brand a:hover{color:var(--ink)}
nav .brand .sep{color:var(--ink3);font-weight:400}                        /* › 分隔 */
nav .brand .here{color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis} /* 頁名：bright，不可點 */
nav .links a{font-size:11.5px;font-weight:500;text-transform:uppercase;letter-spacing:.2em;
  color:var(--ink2);transition:color .2s}
nav .links a:hover{color:var(--ink)}
```
```html
<div class="brand"><a class="home" href="index.html">Steve's&nbsp;Notes</a><span class="sep">›</span><span class="here">頁名</span></div>
```
> 統一：高度 54、底色 token 化。**brand 是 breadcrumb**：站名 `<a href="index.html">` 連回首頁（每個內頁唯一的回首頁入口）、頁名為當前位置。前提：全站 `a{text-decoration:none}`，否則 home 連結會帶底線。
> 手機收斂：`@media(max-width:760px){nav .links{display:none}nav .brand .sep,nav .brand .here{display:none}}` — 隱藏右側連結與頁名，只留站名當回首頁鍵。`design/` 內的參考檔 home 連結用 `../index.html`。

### 6.2 主題切換鈕（建議推廣到內頁）
首頁的 `.theme-toggle`（sun/moon SVG，深色顯示太陽、淺色顯示月亮）應複製到內頁 nav，內頁才有切換入口。

### 6.3 Section 標籤
```css
.label{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.26em;
  color:var(--ink3);display:flex;align-items:center;gap:16px;margin-bottom:26px}
.label .n{color:var(--ink);border:1px solid var(--line);border-radius:4px;padding:2px 9px;letter-spacing:.06em} /* 內頁編號框（canonical 單一） */
```
> **前綴統一為編號框 `.n`**（如 `00 / 01 / 02…`，overview 段用 `00`）；`letter-spacing` 統一 `.26em`。首頁清單 `.ep` 的短線是另一個元件，與此無關。

### 6.4 大數字組 BigNums / Metric Strip
4–6 欄格線牆，value 用 tabular-nums。
```css
.bignums{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line)}
.bignum{padding:38px 26px 34px;border-right:1px solid var(--hair)}
.bignum .v{font-size:clamp(40px,5.6vw,66px);font-weight:500;line-height:1;font-variant-numeric:tabular-nums}
.bignum .l{font-size:14px;font-weight:300;color:var(--ink2);margin-top:18px}
```

### 6.5 卡片 / Bento 牆
```css
.bento{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--hair);border:1px solid var(--hair)}
.card{background:var(--surface);padding:40px 34px}      /* ← was #000 */
.card .ico{font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.24em;color:var(--ink3)}
.card h3{font-size:23px;font-weight:600;margin-bottom:14px}
.card p{font-size:15px;font-weight:300;line-height:1.7;color:var(--ink2)}
.card p b{color:var(--ink);font-weight:500}
```
> **唯一淺色關鍵改動**：卡片底 `#000` → `var(--surface)`。所有牆面元件（engines / grid2 / bb / strip / sotp）同理。

### 6.6 長條圖 / 進度條 / Split
```css
.bar-track{height:48px;background:var(--track)}            /* ← was rgba(255,255,255,.04) */
.bar-fill{transition:width 1.2s cubic-bezier(.25,1,.4,1)}
.bf-1{background:var(--bar-1)} .bf-2{background:var(--bar-2)} .bf-3{background:var(--bar-3)}
.bf-1 .v,.bf-2 .v{color:var(--bg)} .bf-3 .v{color:var(--ink)}   /* 見 §2 反白規則 */

/* 窄條的數值標籤：bar-track 是 overflow:hidden，極短的 bar（如佔比個位數）
   把標籤關在 fill 內會被裁掉。給該 bar 加 .out，把標籤移到 fill 右側外。 */
.bar-fill.out{overflow:visible;padding-right:0}
.bar-fill.out .v{position:absolute;left:calc(100% + 12px);top:50%;transform:translateY(-50%);color:var(--ink)}
```
> 灰階 ramp 與軌道 token 化；正向資料可用 `--pos` 取代 `--bar-1`。
> **窄條標籤**：只要 bar 寬度小到容不下數值文字，就替它加 `.out`（標籤外置），否則 `overflow:hidden` 會把數字裁掉——這是每張含「零頭級」分類的圖都會踩到的坑。

### 6.7 表格（財務）
```css
table{width:100%;border-collapse:collapse;font-size:14px;font-variant-numeric:tabular-nums}
th,td{padding:13px 16px;text-align:right;border-bottom:1px solid var(--hair)}
th:first-child,td:first-child{text-align:left;color:var(--ink2)}
thead th{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);font-weight:600}
tbody tr.hl td{color:var(--ink);font-weight:600;background:var(--panel)}  /* ← was rgba(255,255,255,.03) */
td.pos{color:var(--pos)} td.neg{color:var(--neg)}
```

### 6.8 Callout / 引述框
```css
.callout{border:1px solid var(--line);border-left:3px solid var(--ink);padding:24px 26px}
.callout.c{border-left-color:var(--pos)} .callout.b{border-left-color:var(--neg)}
```

### 6.9 Glossary tooltip（內頁）
`.gl` 虛線底 + hover `::after` 浮層。浮層底色須 token 化：
```css
.gl{border-bottom:1px dotted var(--line)}                  /* ← was rgba(255,255,255,.55) */
.gl::after{background:var(--surface);border:1px solid var(--line);color:var(--ink2);
  box-shadow:0 16px 44px rgba(0,0,0,.45)}                  /* 陰影淺色下自然變淡 */
```

### 6.10 Bull / Bear、Timeline、Pull-quote、Footer、List、Search
- **Bull/Bear**：格線牆兩欄（`.bbc.bull` / `.bbc.bear`）。**標題一律中性灰 `.bbc .h{color:var(--ink3)}`**，多空只靠 `▲`／`▼` 區分，語意色僅留在內文 `strong`（不染標題）。
- **Hero**：**canonical 單一＝靠左 ticker**（`.ticker` badge + meta、細粗混排多行 h1、副標、選填 CTA），`padding:120px 0 40px`。不再用置中 hero。**`.hero` 不要設 `display:flex`**——靠 `.inner.wrap` 當一般 1080 wrap，左緣才會跟內文 section 對齊（flex column + `margin:0 auto` 會讓 inner 縮成內容寬並置中、與內文不齊，是 bug）。h1 強調三選一：`.hl`（`--accent` 藍，一般重點預設）/ `u`（`--pos` 綠，限真有正向語意）/ `.xline`（中性底線）。**選填 CTA 僅作頁內跳轉（`#anchor`）；podcast／影片的 YT 來源連結不放 hero（見 Footer）。**
- **Timeline**：**canonical 單一＝大數字里程碑**（`.tl-row`：左 `.tl-when` 期間 + 右 `.tl-what b` 大字頭條 + `span` 說明）。敘事轉折也用這款（頭條放短句、詳述移到 span），不再用 `.tlr` 引述款。
- **Pull-quote**：置中、`font-weight:300` 大字、`.who` 署名小 caps。**垂直留白 `padding:60px 0 48px`**——引言常夾在兩段 `.body` 之間，留白太小（如 14px）會和上下文擠在一起、失去「停頓」感；上多下少（署名下方已有 section 留白）。
- **Footer**：`border-top:1px solid var(--line)`，大字結語 + meta caps + 免責 `--ink3`。**來源連結的唯一正規位置**：podcast／影片的 YT 連結放在 `.meta` 內、緊接「來源 · 日期 · 與談人」之後，hero 與內文都不重複放。
- **首頁清單 `.ep`** 與 **搜尋 `.search` / `mark`**：見 `index.html`，已全 token 化，照搬即可。

---

## 7. 內頁淺色化 — 改動清單 (Migration Checklist)

要讓兩篇內頁支援淺色，逐項替換（純機械替換，元件結構不動）：

1. 貼上 §2 完整 `:root` + `[data-theme="light"]` token 區塊（取代現有 `:root`）。
2. `<head>` 加入 FOUC inline script + `data-theme` 初始化（抄 `index.html`）。
3. nav 加 `.theme-toggle` 按鈕與 JS。
4. 全檔取代寫死值：
   - `background:#000`（卡片/面）→ `var(--surface)`
   - `rgba(255,255,255,.04|.08)`（軌道）→ `var(--track)`
   - `rgba(255,255,255,.03)`（hl 列）→ `var(--panel)`
   - `#8e8e95`/`#4a4a50`/`#6a6a72`（灰階）→ `var(--bar-2)`/`var(--bar-3)`
   - tooltip `#15161b` → `var(--surface)`；虛線 `rgba(255,255,255,.55)` → `var(--line)`
   - bar 文字寫死 `#000` → 套 §2 反白規則
   - nav 高度 52 → 54；nav 底色 → `var(--nav-bg)`
5. `color-scheme` 由 token 區塊的 `--` 帶（`:root` dark / light 各自宣告），移除元件層寫死。
6. 瀏覽器逐主題目視驗收（本站無自動測試）。

---

## 8. 速查 (Cheat Sheet)

```
底色   bg / surface          文字  ink ▸ ink2 ▸ ink3
線     line（強）/ hair（弱）   面   panel / panel2 / track
強調   accent + mark         語意  pos / neg
圖表   bar-1 ▸ bar-2 ▸ bar-3   Nav  nav-bg / nav-bg2
字     --sf｜標題600｜內文/引言300｜標籤12px .26em UPPER｜數字 tabular-nums
形     圓角2px｜格線gap1px on hair｜wrap1080/邊距30
動     進場 translateY24 .85s｜條 cubic-bezier(.25,1,.4,1) 1.2s｜切換 .35s
規則   任何寫死顏色都是 bug → 換 token｜中文不套 uppercase｜語意色只用在真有正負
```
