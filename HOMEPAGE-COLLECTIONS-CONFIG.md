# Homepage Configuration Guide

The homepage assembles three independent blocks, each driven by its own
key in `constants-config.json`:

1. **`homepage-highlights`** — cross-collection showcase. Pulls anything
   with `Highlight = true` from the CMS DB (any collection: main, news,
   media, portfolio) **and** the standalone Dates DB. Renders with the
   sticky-feature + dispatch-list `projects-hybrid` layout. This replaced
   the previous portfolio-only "Selected Works" block.
2. **`homepage-collections`** — per-collection blocks (typically the News
   strip). See sections below.
3. **`homepage-upcoming-dates`** — automatic future-date strip from the
   Dates DB.

## `homepage-highlights`

```json
"homepage-highlights": {
  "enabled": true,
  "title": "Highlights",
  "glyph": "▒",
  "display-style": "projects-hybrid"
}
```

- An item is eligible if its `Highlight` checkbox is true. The CMS DB
  has `Highlight` on every page; the Dates DB has its own `Highlight`
  added alongside `Highlight Rank` and `FeaturedImage`.
- Ordering: `Highlight Rank` ascending (unranked items fall to the end),
  with Date descending as the tiebreaker. Set `Highlight Rank` to curate
  exact order; leave it blank to fall back to date. (`Highlight Rank` is
  separate from the existing `Rank` property on the CMS DB, which is
  reused by other parts of the build.)
- Past + future dates are both eligible — Highlight is curatorial, not a
  calendar filter.
- A date with no `EventLink` falls back to `/collections/dates/`. A
  highlighted item with no `FeaturedImage` still renders, but the feature
  panel shows a soft-grey placeholder; add an image in Notion to fix.
- `max-items` is optional. Omit it (as above) to show every highlighted
  item — you self-limit via Notion. Set it to a number to cap the list.

## `homepage-collections`

This document explains how the `homepage-collections` configuration works in `constants-config.json`.

## Example Configuration (News Section)

```json
"▉ news": {
  "enabled": true,           // Show/hide this collection on homepage
  "title": "News",           // Heading text displayed above the section
  "use-pinned": true,        // Only show pinned items (true) or recent items (false)
  "max-items": 3,           // Maximum number of items to display
  "display-style": "medium-cards"  // How to display: "medium-cards" or "list"
}
```

## Configuration Options Explained

### `"enabled": true/false`
- **`true`**: Collection appears on homepage
- **`false`**: Collection is hidden from homepage
- **Use case**: Turn sections on/off without deleting configuration

### `"title": "Custom Title"`
- **Purpose**: Sets the heading text for the section
- **Example**: `"title": "Latest News"` → displays as `<h2>Latest News</h2>`
- **Use case**: Customize section names independently of Notion collection names

### Per-section promotion filters

A homepage-collections block can opt into one of these checkbox-driven
gates. They're additive — a post must satisfy every enabled gate to
appear in that block.

- **`"use-show-on-homepage-news": true`** — only show items where the
  `Show on Homepage News` checkbox is true. Used by the News strip so
  news promotion is decoupled from the cross-collection Highlights flag.
- **`"use-highlight": true`** — only show items where `Highlight` is
  true. Useful if you want a per-collection block to mirror Highlights
  selections. Note: items satisfying this also appear in the
  cross-collection `homepage-highlights` block above.
- **`"use-featured": true`** — legacy alias for `use-highlight`, kept so
  configs from before the Featured→Highlight rename still work. New
  configs should use `use-highlight` (or `use-show-on-homepage-news`).

If none are set, the block shows every post in the collection (subject
to `max-items`).

### `"max-items": number`
- **Purpose**: Limits how many items to display in the section
- **Example**: `"max-items": 3` → shows max 3 items
- **Use case**: Control section length and page load performance

### `"display-style": "medium-cards" | "list"`
- **`"medium-cards"`**: Magazine-style cards with images (best for visual content)
  - Grid layout: 1 column mobile → 2 tablet → 3 desktop
  - Shows featured images, titles, excerpts, and tags
  - Perfect for: Portfolio, visual projects, featured content
  
- **`"list"`**: Clean text list with descriptions (best for text content)
  - Vertical list layout
  - Shows titles, excerpts, and dates
  - Perfect for: Blog posts, news, work history

## Collection Names

The collection names (like `"▉ news"`, `"portfolio"`) must **exactly match** the Collection property values in your Notion database:

- Case-sensitive: `"portfolio"` ≠ `"Portfolio"`
- Include special characters: `"▉ news"` (not just `"news"`)
- Include spaces: `"▦ media"` (space included)

## Real-World Examples

### Curated Portfolio Section
```json
"portfolio": {
  "enabled": true,
  "title": "Featured Work", 
  "use-pinned": true,        // Only hand-picked pieces
  "max-items": 6,
  "display-style": "medium-cards"  // Visual grid layout
}
```

### Automatic Blog Feed
```json
"blog": {
  "enabled": true,
  "title": "Recent Posts",
  "use-pinned": false,       // Show latest posts automatically
  "max-items": 5,
  "display-style": "list"    // Clean text list
}
```

### Important Announcements Only
```json
"▉ news": {
  "enabled": true,
  "title": "Important Updates",
  "use-pinned": true,        // Only pinned announcements
  "max-items": 2,
  "display-style": "list"
}
```

## Tips

1. **Mix pinned + recent**: Use `"use-pinned": true` for curated sections, `false` for automatic feeds
2. **Optimize performance**: Use reasonable `max-items` values (3-6 for cards, 5-10 for lists)
3. **Visual hierarchy**: Use `"medium-cards"` for hero content, `"list"` for secondary content
4. **Test responsively**: Medium cards look great on desktop but consider mobile experience