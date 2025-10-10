# Homepage Collections Configuration Guide

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

### `"use-pinned": true/false`
- **`true`**: Only shows items where "Pinned" property = true in Notion
- **`false`**: Shows most recent items regardless of pin status
- **Use case**: 
  - `true` = Curated content (hand-picked featured items)
  - `false` = Automatic recent content

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