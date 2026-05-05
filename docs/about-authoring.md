# Authoring the About page in Notion

The `/about` page is rendered by `src/pages/[...page].astro` from the Notion
page whose `Specific Slug` is `about` (in the Posts DB). The body of the
page is your Notion blocks, rendered through `NotionBlocks.astro` — the same
renderer used everywhere else.

The redesigned About uses the **editorial** CSS variant. It activates only
when the rendered page slug is `about` (via `body[data-page-slug="about"]`
in `src/styles/global.css`). It does not change which blocks render or
their order — it only restyles them.

## Block-by-block expectations

| Notion block                               | Renders as                                                |
|--------------------------------------------|-----------------------------------------------------------|
| Page title                                 | Eyebrow glyph (`▁ About`) is generated automatically. The page title appears as the article's `<h1>`. |
| `Subtitle` property (rich_text)            | Currently NOT rendered on About body — the subtitle is shown in the hero on the home page only. (See "Future" below.) |
| First `paragraph` block                    | Lede paragraph (slightly larger). |
| `heading_2`                                | Section heading (`On working`, `Recent`, `Currently`, etc.). |
| `paragraph` blocks                         | Body prose. Constrained to a 64ch max-width column. |
| `quote` block                              | Pull-quote with rule above and below, in `--theme-quote` accent color. |
| `image` block                              | Inline image, full-width inside the column. The first image becomes the portrait if you keep it near the top. |
| `table` block (2 columns)                  | Meta dl at the end of the page (Based · Roles · Recent · Press · Contact). Column 1 = label (uppercase mono), column 2 = value. Place this last. |

## Recommended structure

```
[Title in Notion]                            ← becomes <h1>; eyebrow auto-generated above it

[paragraph]                                  ← lede
[image]                                      ← portrait (Cover also works)

[heading_2] On working
[paragraph]
[paragraph]

[heading_2] Recent
[paragraph]

[quote] "…"                                  ← pull-quote (rule above + below)
   — citation                                ← optional in a child paragraph

[heading_2] Currently
[paragraph]

[table]  ← meta dl at the bottom
| Based   | Tiohtià:ke / Montréal           |
| Roles   | Trombonist · Composer · …       |
| Recent  | Conversations with Space, …     |
| Press   | …                                |
| Contact | kalunis+website@gmail.com       |
```

## Things to avoid

- Don't put a `heading_1` in the body — the page title already supplies the
  H1. A second H1 on the same page hurts accessibility.
- Don't rely on `column_list` for the meta dl. The editorial variant styles
  a 2-column `table` block, not a `column_list`. (Other variants — split,
  index — are designed around `column_list`; we picked editorial.)
- Keep paragraph length sane. The editorial variant clamps prose to 64ch.
  Very long single paragraphs will look awkward.
- Don't use `quote` inside a `column_list` — the styling assumes top-level.

## If you want to change variants later

The variant is a CSS template scoped to `body[data-page-slug="about"]` in
`src/styles/global.css`. Swap the rules under that selector for the split
or index variant from `docs/mocks/styles.css` (search for `.about-split`
or `.about-index`). No Astro code changes needed.

## Future

The `Subtitle` property exists on the Posts DB but isn't currently rendered
inside the About body — only on the home page hero. If you want a kicker
line under the H1 on About, we can wire `page.Subtitle` into a render in
`[...page].astro` — ping me.
