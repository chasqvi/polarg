# polArg — Project Context for Claude

This file is the canonical reference for any AI assistant working on this project.
Read it fully before writing any code, designing any component, or making any architectural decision.

---

## What This Project Is

A new frontend for **Política Argentina** (`politicaargentina.com`), Argentina's leading political news portal.
The frontend is being built from scratch — backend is handled by a separate developer.
The design direction is: **editorial print meets web-native motion**. Non-traditional for a news site. Fast. Opinionated.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite 8 |
| Text layout | `@chenglou/pretext` — DOM-free text measurement, Canvas-based |
| Animations | Framer Motion 12 |
| Data fetching | TanStack Query (React Query v5) |
| Routing | TanStack Router |
| Database client | `@supabase/supabase-js` v2 |
| Utilities | `clsx`, `lucide-react`, `ofetch`, `date-fns` |
| Styling | Plain CSS with custom properties — no CSS-in-JS |
| Linting | ESLint + TypeScript-ESLint + Prettier |

### Why Pretext
`@chenglou/pretext` by Cheng Lou (React core alumni) computes text layout — line breaks, heights, line coordinates — outside the DOM using an offscreen Canvas. 300–600× faster than DOM-based measurement. Enables print-style typographic control: text wrapping around images, precise multi-column flows, pull quotes with exact baselines. Load fonts via `FontFace` API before calling `prepare()`.

### Key scripts
```bash
npm run dev          # start dev server
npm run build        # production build
npm run scrape       # scrape politicaargentina.com (limited — site is client-rendered)
npm run seed         # seed scraped_articles.json into Supabase
npm run scrape:seed  # both in sequence
```

---

## Infrastructure

| Service | Detail |
|---|---|
| Supabase project | `polarg-news` — ref: `mialyorsbqrofxyiqjuf` |
| Supabase URL | `https://mialyorsbqrofxyiqjuf.supabase.co` |
| Vercel | Connected for deployment |
| GitHub | Source of truth for the repo |

### Environment variables (`.env` — never commit)
```
VITE_SUPABASE_URL=https://mialyorsbqrofxyiqjuf.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```
For seeding scripts use `SUPABASE_SERVICE_KEY=sb_secret_...` (server-side only).

---

## Database Schema

### `articles`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, auto |
| title | text | required |
| slug | text | unique |
| excerpt | text | nullable |
| content | text | nullable |
| image_url | text | nullable |
| category | text | politica / economia / judicial / internacional / sociedad |
| tags | text[] | GIN indexed |
| author | text | nullable |
| published_at | timestamptz | nullable |
| source_url | text | unique, nullable |
| created_at | timestamptz | auto |

### `categories`
| Column | Type |
|---|---|
| id | uuid |
| name | text |
| slug | text |
| description | text |
| created_at | timestamptz |

RLS is enabled on both tables. Public SELECT policies are active. Use the service key for writes from scripts.

### Seed data
50 realistic articles are seeded across 5 categories (15 política, 15 economía, 8 judicial, 7 internacional, 5 sociedad). The site's API is private and inaccessible externally, so seed data was generated from live-scraped headlines and enriched manually. Migration file: `supabase/migrations/001_initial_schema.sql`.

---

## Brand Guidelines — Política Argentina
*Source: Manual de Marca, Octubre 2024*

### Identity

**Full name:** Política Argentina
**Abbreviated:** PolArg
**Claim / tagline:** *Desde adentro*
**Domain:** polarg.com | @polarg

**Manifesto:**
> Política Argentina es el espacio donde la política se discute desde adentro, con una mirada comprometida y situada. No buscamos fingir objetividad, sino instalar una voz propia en la conversación política nacional. Con una selección cuidada de temas, análisis críticos y contenidos audiovisuales, traemos a la mesa los debates que nos importan, desde una perspectiva clara y cercana a la realidad del país.

**Why "Desde adentro":** The brand positions itself as built from within politics itself — not observers of it. They live, debate and transform politics. This is a declaration of identity, not neutrality. They don't pretend to be objective; they speak from a committed perspective aligned with the interests of the Argentine people.

**Brand values:**
Compromiso — Transparencia — Identidad — Debate — Coherencia — Opinión — Participación — Inclusión — Crítica — Transformación — Contexto — Profundidad — Influencia

---

### Logo

Two logo variants:
- **Full:** `Política Argentina` — "Política" in **Black** weight, "Argentina" in **Regular** weight. Same typeface, weight contrast creates the distinction.
- **Abbreviated:** `PolArg` — "Pol" in **Black**, "Arg" in **Regular**.

Both have a version with the claim "Desde adentro" as a subtitle below.

A special animated/branded variant integrates a **voting ballot box icon** (hand-drawn, yellow) between "Política" and "Argentina" — use for campaigns and featured applications.

Works on: black background, white background, gray (#D6D6D6) background. Always in solid black or white — never in color.

---

### Typography

**Single typeface system: Work Sans** (variable font — all weights available)

| Use case | Style |
|---|---|
| Subtitles / keywords | Work Sans Light, UPPERCASE |
| Main titles / primary headings | Work Sans Regular + Black (mixed in same headline) |
| Body text / long reads | Work Sans Light |
| Captions / small notes | Work Sans Light + Black, UPPERCASE |

The signature typographic move is **mixing Regular and Black within a single headline** — e.g., "Todos esperan **la liquidación** del campo" — where the key concept is set in Black and the surrounding text in Regular or Light. This creates strong visual rhythm identical to the logo logic.

Work Sans is available on Google Fonts. Load as a variable font for Pretext compatibility.

---

### Color Palette

| Name | Hex | Use |
|---|---|---|
| Negro | `#151515` | Primary background, text |
| Amarillo | `#FED900` | Primary accent, highlights, hand-drawn elements |
| Celeste | `#A0C6FF` | Secondary accent |
| Blanco | `#FFFFFF` | Primary background (light mode), text on dark | DEFAULT
| Gris Desaturado | `#D6D6D6` | Secondary backgrounds, cards |

**Color logic:** Negro is dominant. Amarillo is the accent that carries energy and Argentine identity (flag sun reference). Celeste references the Argentine flag. The palette is deliberately restrained — high contrast, no gradients, no semi-transparencies as a rule.

CSS custom properties to use:
```css
:root {
  --color-negro:   #151515;
  --color-amarillo: #FED900;
  --color-celeste: #A0C6FF;
  --color-blanco:  #FFFFFF;
  --color-gris:    #D6D6D6;
}
```

---

### Graphic Elements

**Iconography:** Circular icons with thin white line strokes on solid black circles. Style: minimal, geometric, consistent stroke weight. (Compatible with lucide-react for web use.)

**Hand-drawn illustrations (Elementos de trazo manual):** A set of culturally Argentine line-art illustrations in the brand colors — Congreso Nacional, Casa Rosada, Obelisco, mate, pava, camiseta #10, copa del mundo, pingüino, banderas, manos. Use these for editorial content, opinion pieces, and special features. They are drawn in yellow, white, or celeste on dark backgrounds.

**Portrait illustrations:** For opinion pieces and analysis with a slower editorial cadence, hand-drawn portraits of article subjects in yellow line art on black backgrounds are recommended over photography.

---

### Photography

Two types with distinct rules:

**Portraits:** Sharp, clear, high contrast. Subject must be clearly distinguishable. Avoid blurry backgrounds or situations where the person is ambiguous. If the photo is in motion or unclear — use hand-drawn illustration instead.

**Context / situational photos:** Prefer images where the situation reads clearly at a glance. Avoid photos where the action is ambiguous or requires context to understand. "Si" (clear) vs "No" (ambiguous) examples in the brand manual.

**Tags overlay system:** Article cards show category tags as breadcrumb-style navigation (e.g., `ECONOMÍA → EXPORTACIONES → DÓLAR → INFLACIÓN`) in small uppercase text, in amarillo on dark backgrounds.

---

### Layout & Web Application

From the website mockup in the brand manual:
- Asymmetric grid mixing full-bleed images with text blocks
- Strong black/white contrast sections, punctuated with amarillo
- Headlines that mix Regular and Black weights inline
- Category tags displayed as arrow-separated breadcrumbs in uppercase
- Three content archetypes for social/cards: **Textual** (quote on amarillo), **Noticia destacada** (photo + overlay), **Más leída** (gray bg + bold type)
- Mobile-first — the brand mockups show Instagram Stories as a primary content format

---

## Design Principles for This Frontend

Given the brand + the editorial vision:

1. **Typography is the design.** Work Sans variable font + Pretext for precise layout. Headlines always use the Black+Regular mixed weight signature.
2. **Black is the default.** Dark-first aesthetic. Light mode exists but dark is the primary experience.
3. **Yellow is earned.** Use `#FED900` sparingly — for the most important element on any given screen.
4. **No gradients, no blurs, no glass.** The brand is hard-edged, high contrast, editorial.
5. **Motion is purposeful.** Framer Motion for scroll-triggered reveals and page transitions. Not decorative.
6. **Print grid logic.** Asymmetric columns, text that bleeds, overlapping elements — print editorial sensibility applied to web layout.
7. **Tags as navigation.** Every article must show its category chain. It's a core brand element.

---

## Reading Experience — Paginated, Not Scrolled

This is the core design objective that defines the entire frontend. It is non-negotiable and shapes every component.

### The model: news as a book, not a feed

Articles **do not scroll**. They **paginate**. The reading experience is a book — flipping from page to page, left to right — rendered as a web app.

### Navigation gestures

All inputs map to the same two actions: **next page** or **previous page**.

| Input | Direction |
|---|---|
| Scroll down | Next page (→) |
| Scroll up | Previous page (←) |
| Swipe down or swipe right | Next page (→) |
| Swipe up or swipe left | Previous page (←) |
| Arrow Right / Arrow Down | Next page |
| Arrow Left / Arrow Up | Previous page |
| Space | Next page |

Scroll input is intercepted and translated to pagination — native browser scroll is disabled inside the article view. One scroll gesture = one page turn (not continuous). Page transitions are animated horizontally (left/right slide) with Framer Motion.

### Card-to-article expansion

On the homepage, every article is represented as a card. When the user clicks a card, the card **expands** (animated with Framer Motion, shared-layout transition) until it occupies almost the full viewport — leaving a narrow frame (target: ~5px on each side, tunable per viewport). The expanded card **is** the article reader.

Model reference: the iOS App Store "Today" tab card expansion. The card grows from its position in the grid to a near-fullscreen overlay. The homepage underneath is still there — closing the article collapses the card back to its grid position.

Closing: tap/click the X, press Escape, or swipe down from the top edge.

### Column grid by viewport

The viewport size and orientation determine the **maximum** number of text columns an article can use. An article never exceeds the maximum, but specific layouts can use fewer (e.g., force a 2-column editorial spread on a 4K screen).

**Horizontal (landscape) orientation:**

| Viewport | Max columns |
|---|---|
| 4K (≥ 2560px wide) | 5 |
| HD / Desktop (1280–2559px) | 4 |
| Tablet / iPad landscape | 2 |
| Mobile landscape | 1 |

**Vertical (portrait) orientation:**

| Viewport | Max columns |
|---|---|
| Tablet / iPad portrait | 2 |
| Mobile portrait | 1 |

**Mobile is always single-column**, regardless of orientation. This is a hard rule.

### Column-span elements inside an article

Within an article's column grid, individual blocks can span **multiple columns**:

- A photo can span 2 columns while surrounding text reflows in single columns
- A "related stories" module on HD might span 2 columns
- A pull quote might span the full width
- An ad on mobile might span half a column (text wraps around it)
- Highlights, stat callouts, embeds — any block can declare its column span

Each content block has a `columnSpan` property. The paginator honors it when laying out each page.

Design intent override: an article can force a column count below the viewport maximum (e.g., "always render as 2 columns except on mobile") for editorial effect. This is declared on the article layout, not the viewport.

### Pagination engine

Given an article's content — text, images, modules, highlights, ads, quotes — the system **calculates page breaks automatically** based on:

1. Viewport dimensions (available width × height, minus the ~5px frame)
2. Active column count (viewport max OR article-forced count)
3. Each block's column span and natural height
4. Text measurement via **Pretext** — this is why Pretext is core to the stack. Pretext's `prepare()` and `layoutWithLines()` return exact line coordinates and heights with zero DOM reflow, making sub-millisecond pagination feasible on resize
5. Widow/orphan rules for text flow across pages
6. Figure + caption keep-together rules

The paginator produces an ordered array of "pages," where each page is a grid of positioned blocks fitting exactly within the viewport. On window resize or orientation change, repagination runs again.

### Implementation direction (for when we build it)

- A `usePagination(articleBlocks, viewport)` hook that returns `{ pages, currentIndex, next, prev }`
- Content blocks modeled as a typed union: `TextBlock | ImageBlock | QuoteBlock | ModuleBlock | AdBlock | HighlightBlock`, each with `columnSpan` and rendering metadata
- Pretext runs inside a Web Worker when possible so pagination doesn't block the UI
- Page transitions use Framer Motion's `AnimatePresence` with directional slide variants
- Gesture handling via `@use-gesture/react` (add when building this layer) for unified wheel/swipe/key handling
- The card-expand transition uses Framer Motion's `layoutId` for a shared-element animation from grid to full view

---

## Project Structure

```
polArg/
├── src/
│   ├── components/     # UI components
│   ├── pages/          # Route pages
│   ├── hooks/          # Custom React hooks
│   ├── lib/
│   │   └── supabase.ts # Supabase client
│   ├── types/
│   │   └── database.ts # Full DB type definitions
│   ├── styles/         # Global CSS, design tokens
│   └── assets/         # Static assets + brand PDF
├── scripts/
│   ├── scrape.mjs          # Web scraper
│   ├── generate_seed.mjs   # Seed data generator
│   ├── seed.mjs            # Supabase seeder
│   └── scraped_articles.json
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── .env                # Local secrets (never commit)
├── .env.example        # Template
└── CLAUDE.md           # This file
```
