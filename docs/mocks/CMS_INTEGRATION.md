# CMS Integration Audit — Kalun Leung mockups

This doc maps every block in the **Homepage** and **About** mockups to either:

- 🟢 **CMS** — content comes from a Notion database property or a Notion block
- 🔵 **Theme** — content lives in code/config and is part of the design system
- 🟡 **Hybrid** — structure is themed but copy/media is CMS-driven

The goal: when handing off to Claude Code, every 🟢 and 🟡 block has a clear Notion source so Claude can wire it up correctly.

---

## The two databases (from `constants-config.json`)

### Posts DB (`database-id: 28686f76…3dc4`)

Used for: portfolio, news, media, about page, mubone page, collaborations page, all collections except dates.

Key properties on each post (from `Post` interface in `src/lib/interfaces.ts`):

| Property      | Type                  | Notes                                                       |
|---------------|-----------------------|-------------------------------------------------------------|
| `Title`       | title                 | Page title                                                  |
| `Slug`        | rich_text / formula   | URL slug                                                    |
| `Collection`  | select                | `▙ portfolio`, `▉ news`, `▇ dates`, `▦ media`, etc.        |
| `Date`        | date                  | Publish/event date                                           |
| `Venue`       | rich_text             | Optional location/venue                                     |
| `Tags`        | multi_select          | `[performance]`, `[composition]`, etc.                      |
| `Excerpt`     | rich_text             | Short summary for cards                                     |
| `FeaturedImage` | files               | Single hero image                                           |
| `FeaturedImages` | files              | Array — for multi-image layouts (e.g. bakers1/2/3)          |
| `Cover`       | cover                 | Notion page cover                                           |
| `Icon`        | icon                  | Emoji or file icon                                          |
| `Pinned`      | checkbox              | Used by `use-pinned` homepage filter                        |
| `Rank`        | number                | Manual sort order                                           |

The **page body** (everything below the title) is rendered by `NotionBlocks` and supports: paragraph, heading 1/2/3, bulleted/numbered list, image, audio, video, file, callout, quote, divider, toggle, code, table, column list, table of contents, embed, bookmark, link preview, link to page, equation.

### Gigs DB (`gigs-database-id: 28d86f76…9a51`)

Used for: dates / upcoming.

| Property        | Type                   | Notes                                          |
|-----------------|------------------------|------------------------------------------------|
| `Title`         | title                  | Show title                                     |
| `Date`          | date                   | Single-day event date                          |
| `DateEnd`       | date                   | For residencies                                |
| `Venue`         | rich_text              | Venue name                                     |
| `City`          | rich_text              | Format: `Toronto (CA)`                         |
| `With`          | rich_text              | Ensemble / band                                |
| `Members`       | rich_text              | Personnel                                      |
| `EventLink`     | url                    | Tickets / info                                 |
| `Residency`     | checkbox               | Toggles residency styling                      |

---

## Homepage.html — block-by-block

### Rail (`.rail`)
| Block                          | Source  | Notes |
|--------------------------------|---------|-------|
| `梁家綸` mark                   | 🔵 Theme | Hardcoded vertical character stack. |
| Nav links (about, mubone, news, dates, portfolio, collaborations, media, contact) | 🟡 Hybrid | **Use `nav-order` from `constants-config.json`.** Glyphs and labels both come from `nav-order[*].title` (e.g. `"▁\nabout"` → glyph `▁`, label `about`). Item type can be `page`, `collection`, or `external`. |
| "Trombonist · Composer · Instrument Developer" footer | 🔵 Theme | Static role tagline. Could be moved to a Notion `_about` page property if you want to edit without rebuilding. |
| "Tiohtià:ke / Montréal"         | 🔵 Theme | Static. |

### Hero — alphabet soup (`.soup-hero`)
| Block                          | Source  | Notes |
|--------------------------------|---------|-------|
| Soup canvas + interaction       | 🔵 Theme | Pure JS, no CMS. |
| Title `梁家綸 / Kalun Leung`    | 🟡 Hybrid | Could come from `siteInfo.title` + `siteInfo.author` (already in `constants-config.json` → `author`). |
| Tagline "Trombonist · Composer · Instrument Developer · Educator" | 🟡 Hybrid | Suggest: store as page-level rich_text on the `home` page in Notion, render as the hero subtitle. Or keep in `siteInfo.description`. |
| Hero meta — "K.L. · Tiohtià:ke / Mtl · Currently: composing for the mubone" | 🟡 Hybrid | "Currently:" line is the only volatile piece — recommend a `Now` or `Status` rich_text property on the `home` page, or a "studio status" Notion page that's read at build time. Static fallback fine. |
| Footer instructions "Drag · push · paint · listen" | 🔵 Theme | Static UI hint. |

### Selected works — Index / Grid / Hybrid layouts (`.works-list`, `.works-grid`, `.works-hybrid`)
All three layouts read from the **same** `▙ portfolio` collection.

| Field in the mock              | Notion property (Posts DB) |
|--------------------------------|----------------------------|
| `year` (e.g. "2025")           | `Date` (year part)         |
| `date` (e.g. "Sep 2025")       | `Date` (formatted month + year) |
| `title` (e.g. "Conversations with Space and Architecture") | `Title` |
| `tag` (e.g. "performance")     | `Tags[0].name` (first tag) — or join multiple |
| `blurb`                        | `Excerpt`                  |
| `role` (e.g. "Composition · Performance · Instrument") | **NEW property suggested:** `Role` (rich_text) on Posts DB. Currently no equivalent. |
| `locations`                    | `Venue`                    |
| `images[]`                     | `FeaturedImages` (or fall back to `FeaturedImage` + `Cover`) |

Filtered by `Collection === "▙ portfolio"` and `Pinned === true` per `homepage-collections` config (`use-pinned: true`, `max-items: 3`).

**Section header** (mark `▙`, "Selected works" title, "06 entries", "All projects ↗" link): 🔵 Theme structure, 🟡 hybrid copy.
- `block-mark` glyph → from `nav-order` for `▙ portfolio`.
- `block-title` → from `homepage-collections["▙ portfolio"].title` (currently `"Projects"` — change to `"Selected works"` if you want).
- `block-count` → computed (`portfolio_posts.length`).
- `block-more` → links to `/collections/portfolio/` via `getNavLink(...)`.

### News — List / Index / Hybrid layouts (`.news-list`, `.news-idx`, `.news-hybrid`)
Same pattern as Selected works but reading `▉ news` collection.

| Field in the mock              | Notion property (Posts DB) |
|--------------------------------|----------------------------|
| `date` (e.g. "Sep 18, 2025")   | `Date`                     |
| `tag` (e.g. "residency")       | `Tags[0].name`             |
| `title`                        | `Title`                    |
| `body` (excerpt paragraph)     | `Excerpt`                  |
| `dateline` (e.g. "Montréal · Sep 2025") | `Venue` + formatted `Date` |
| `image`                        | `FeaturedImage` (or `Cover`) |

Section header: same hybrid pattern as portfolio. Mark `▉`, title from `homepage-collections["▉ news"].title`.

### Coming up / Dates strip (`.dates-list`)
Reads from the **Gigs DB**, NOT Posts DB.

| Field in the mock              | Gig property         |
|--------------------------------|----------------------|
| Date column                    | `Date` + (`DateEnd` if residency) |
| Title                          | `Title`              |
| Venue / city                   | `Venue` + `City`     |
| Personnel / context            | `With` + `Members`   |
| Tickets link                   | `EventLink`          |
| Residency badge                | `Residency` (checkbox) |

Section header: 🔵 Theme. Glyph `▇` from `nav-order` for `▇ dates`.

### Footer
| Block                          | Source  | Notes |
|--------------------------------|---------|-------|
| Vertical `KL` mark              | 🔵 Theme | Static. |
| Connect column links (Email, Instagram, Newsletter) | 🟡 Hybrid | **From `constants-config.json` → `socials.*`.** Already wired in the live site. |
| Studio column links (Booking, CV, Press kit, Mubone) | 🟡 Hybrid | Suggest: convert each to either a Notion page slug (`/about`, `/mubone`) or a `_pages` collection of rich_text links. CV/Press kit could be a file property on a `_about` page. |
| Now block (Tiohtià:ke / Montréal · Available 2026) | 🟡 Hybrid | "Available 2026" is volatile — recommend `Status` rich_text on `home` page. |
| Colophon                       | 🔵 Theme | Static design credit. |

---

## About.html — block-by-block

The About page is a **Notion `page`** (not a database post) with `slug: "about"`. In webtrotion this is rendered by `src/pages/[...page].astro` → `getAllPages()`.

That means **the whole body** can be authored as Notion blocks (paragraph, heading, image, callout, etc.), and the `NotionBlocks` renderer already handles every block type our mock uses. **The mock is essentially a styled preview of what Notion blocks will render as.**

### Three layout variants — Editorial / Split / Index

These are all just **CSS variants on the same content stream**. Not separate Notion pages. The Notion content stays the same; the CSS template choice is what changes.

### Variant: Editorial (`.about-editorial`)

| Block                          | Source  | Notion equivalent |
|--------------------------------|---------|-------------------|
| Eyebrow `▁ About`               | 🔵 Theme | Generated from page slug + nav glyph. |
| `<h1>` "Kalun Leung / 梁家綸"  | 🟢 CMS   | `Title` of the about page. |
| Subtitle "Trombonist · Composer · Instrument Developer · Educator" | 🟡 Hybrid | Recommend a `Subtitle` rich_text property on the page. Or render from `siteInfo.description`. |
| Portrait image                 | 🟢 CMS   | `Cover` or `FeaturedImage` of the about page. Or first `image` block. |
| "On working" / "Recent" / "Currently" headings + paragraphs | 🟢 CMS   | `heading_2` + `paragraph` blocks in Notion. |
| Pull-quote (Kranichstein jury)  | 🟢 CMS   | `quote` block in Notion. (Uses `theme.colors.quote.light = 203 41 65` automatically.) |
| Meta dl (Based · Roles · Recent · Press · Contact) | 🟡 Hybrid | Could be a Notion `table` block (2 columns) — `Table.astro` already renders this. Or a `column_list` with two columns. |

### Variant: Split (`.about-split`)

| Block                          | Source  | Notion equivalent |
|--------------------------------|---------|-------------------|
| Sticky portrait + meta dl       | 🟢 CMS   | First `image` block + a `column_list` (or `table`) block at top of page. |
| Lede paragraph (large)         | 🟢 CMS   | First `paragraph` block. The `.about-lede` class is theme — applied via a marker (e.g. callout with no icon, or first-paragraph CSS selector). |
| Subsequent prose               | 🟢 CMS   | `paragraph` blocks. |
| Inline gallery (3-up grid)     | 🟢 CMS   | `column_list` with 3 columns each containing an `image`. The webtrotion `ColumnList.astro` handles this. |
| Pull quote with caption        | 🟢 CMS   | `quote` block (the caption is theme-rendered from quote citation). |

### Variant: Index (`.about-index`)

| Block                          | Source  | Notion equivalent |
|--------------------------------|---------|-------------------|
| Numbered section rows (`01 / Statement`, `02 / Roles`, `03 / Ensembles`, etc.) | 🟡 Hybrid | This layout treats each `heading_2` in the Notion body as a numbered row. Numbers are generated by CSS counter; titles + content come from CMS. |
| Banner image                   | 🟢 CMS   | An `image` block in the Notion body. |
| Footer 2-up gallery            | 🟢 CMS   | `column_list` with 2 image columns at the end of the body. |

### How variants are selected

Currently exposed as a Tweak (`aboutLayout: "editorial" | "split" | "index"`). In production:
- **Option A:** Hardcode one variant in `[...page].astro` per slug (about → split). Simplest.
- **Option B:** Add a `Layout` select property to the Posts/Pages DB so each page can pick. Most flexible.
- **Option C:** Detect from page content (e.g. if first block is an `image` → split; if all top-level blocks are `heading_2` → index). Magical but fragile.

Recommend **Option A** for now, **Option B** later if you build more page types.

---

## What's purely **theme** (don't touch in CMS)

- Color tokens (`--bg`, `--ink`, `--accent` etc.) — these come from `constants-config.json → theme.colors`.
- Type stack (`Inter Tight` / `JetBrains Mono`) — currently in our mock; the live site uses `Jost` / `Roboto Mono` from `theme.fontfamily-google-fonts`. **Pick one; the mock should ultimately match the live theme config.**
- All `block-mark` glyph rendering, hairline rules, `mono` chip styling, hover states, the dispatch/list/hybrid grid templates themselves.
- The alphabet-soup canvas behaviour (the LETTERS array could be CMS — see "Open questions" below).
- Tweaks panel itself (development tool, not shipped).

## What needs **new Notion properties** I assumed but don't exist yet

Recommend adding these to the Posts DB:

1. **`Role`** — rich_text. Used by portfolio cards ("Composition · Performance · Instrument"). Currently only `Tags` and `Venue` exist; `Role` is conceptually different (it's *what Kalun did on the project*, not a category).
2. **`Subtitle`** — rich_text. For pages (about, mubone) that want a kicker line under the title.
3. **`Status`** / **`Now`** — rich_text. For the "Currently: composing for the mubone…" hero line and the "Available 2026" footer line. One field, written in first person, edited often.
4. *(optional)* **`Layout`** — select. If you adopt Option B above. Values: `editorial`, `split`, `index`.

## Open questions for Claude Code handoff

1. **Soup letters.** The hero soup currently uses a fixed string. Do we want this to come from a Notion page (e.g. a `_soup` page whose paragraph blocks are concatenated)? Cool but probably not worth it.
2. **News-vs-portfolio dispatch homepage.** Currently the homepage shows both via `homepage-collections`. Confirm both should stay pinned-only (`use-pinned: true`), and confirm the per-collection `display-style` mapping:
   - `▙ portfolio` → `medium-cards` in old config, but our redesign uses **index/grid/hybrid**. We'll need to add new display styles to `[...page].astro` — call them `"projects-index"`, `"projects-grid"`, `"projects-hybrid"`, and pick one in config.
   - `▉ news` → same. Add `"news-list"`, `"news-index"`, `"news-hybrid"` and pick.
3. **Section copy strings.** "Selected works", "Coming up", "From the studio" etc. — these are theme strings in our mock but could be `homepage-collections[*].title`. Recommend: keep as `title` field in config so non-devs can rename without touching code.
4. **About → Notion authoring conventions.** The Editorial / Split / Index variants impose subtle structural assumptions (e.g. Index variant assumes the page is a flat list of `heading_2`s). Document these for whoever's authoring About in Notion so they don't accidentally break the layout.

---

## TL;DR for Claude Code

> The mockups are templates. **The Posts DB and Gigs DB drive everything in the homepage's three content sections (portfolio, news, dates) and the entire About page body.** The rail, hero soup, footer scaffolding, and all the editorial chrome (block headers, glyphs, rules, hover states) are theme. To wire this up: add three new `display-style` values to `[...page].astro` for each redesigned section, pick the variant in `homepage-collections`, add a `Role` property to the Posts DB, and treat About as a regular Notion page rendered by `[...page].astro` with the new About CSS template applied.
