# CareerPilot — Logo Guidelines (compact)

## 1. The logo
- **Idea**: Four pilot epaulette rank stripes swept into a wing — "captain, and climbing." Rank stripes encode *pilot* structurally; the sweep doubles as a rising bar chart for career growth.
- **Versions**: primary (horizontal lockup) · stacked · symbol-only · wordmark-only · app-icon tile
- **Files** (`logo-concepts/final/`):
  - Masters: `captain-wing-symbol.svg`, `wordmark-careerpilot.svg`, `lockup-horizontal*.svg`, `lockup-stacked*.svg`, `captain-wing-tile.svg`, `captain-wing-small.svg` (small-size cut)
  - Web/PWA set: `exports/` — `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `icon-192/512.png`, `maskable-512.png`, `site.webmanifest`, `head-snippet.html`
  - One-colour: `*-black / *-white / *-mono-7c3aed` SVG + PNG

## 2. Clear space
Keep a clear zone of **1 × stripe height** (the height of one wing bar) around the symbol on all sides. For lockups, also keep the zone around the whole lockup. The zone scales with the logo — never a fixed pixel distance.

## 3. Minimum size
| Version | Screen | Print |
|---|---|---|
| Horizontal lockup | 140 px wide | 35 mm wide |
| Stacked lockup | 96 px wide | 24 mm wide |
| Symbol | 24 px (16 px in favicon — use `exports/favicon.svg`, the 3-stripe cut) | 6 mm |

Below 32 px, always use `captain-wing-small.svg` / `favicon.svg` (3 stripes, wider gaps — the 4-stripe master clogs).

## 4. Colour
| Name | HEX | RGB | CMYK (approx) | Pantone (approx) |
|---|---|---|---|---|
| Signal Orange (primary) | #CC420C | 204·66·12 | 0·68·94·20 | 173 C |
| Warm White (on-tile glyph) | #FFFAF5 | 255·250·245 | — | — |
| Dark-UI accent | #FF6B2C | 255·107·44 | 0·66·83·0 | — |
| Ink (near-black) | #0A0A0A | 10·10·10 | — | Black 6 C |
| White | #FFFFFF | 255·255·255 | — | — |

Signal Orange matches `--primary` in `frontend/src/index.css`; #FF6B2C is the dark-theme accent — don't mix the two on one surface.
**Approved pairs**: Warm White symbol on Signal Orange tile · orange on white · black on white · white on dark UI (`#101014` or darker).
One-colour rule: the mark must always work in a single colour — greyscale and mono (`-mono-cc420c`) files are provided; never rely on the tile for contrast.

## 5. Typography
- The wordmark is **Geist SemiBold**, set lowercase with −3% tracking (matching the product UI), converted to SVG outlines — it is paths, not live text. Never retype it in a file; if it must change, rebuild with `tools` + Geist (SIL OFL licence — free for logo use).
- Product UI keeps the Geist/Inter stack, so lockup and UI type match by design.
- Headlines: Geist/Inter, Semibold · Body: Regular.

## 6. Don'ts
Don't stretch or squash · don't recolour outside the palette · don't rotate the wing · don't add shadows, outlines, gradients or effects · don't rearrange lockup parts or change their size ratio · don't set the wordmark in a live font · don't place the mark on busy backgrounds without the violet tile behind it · don't add a 5th stripe (four = captain).

## 7. Notes
- **Favicon/PWA**: drop `exports/` files in `frontend/public/` and paste `head-snippet.html` into `index.html`.
- **Masters** live in `logo-concepts/final/`. Presentation board: `presentation-board.html` (+ `slides/` PNGs).
- Status: concept approved 2026-11-14 · professional trademark search recommended before public launch.
