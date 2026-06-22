# Spotify Wrapped Portfolio Theme

A bold, card-based portfolio theme inspired by Spotify Wrapped's visual storytelling approach. 
Built for the [CareerPilot](https://github.com/boss477/career-pilot) platform.

---

## 📁 Files

| File | Description |
|------|-------------|
| `index.html` | Semantic HTML with `{{placeholder}}` tokens and loop delimiters |
| `style.css` | Spotify-inspired scroll-snap styling, animations, and typography |
| `script.js` | Scroll-spy, stat counters, music player events, and a fallback template compiler |

---

## 🎨 Design System

### Color Palette (Spotify-inspired)

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | `#121212` | Main page dark background |
| `--spotify-green` | `#22c55e` | Primary brand accent and interactive active states |
| `--spotify-green-hover` | `#4ade80` | Hover states |
| `--text` | `#ffffff` | Primary text |
| `--text-muted` | `#b3b3b3` | Secondary text |

### Custom Gradients

- **Hero Card**: Deep green-black gradient.
- **Projects Card**: Deep purple-black gradient.
- **Experience Card**: Deep orange-black gradient.
- **Share Summary Card**: Multi-stop linear gradient (`#1e1b4b` to `#4c1d95`).

### Typography

- **Display (Headings)**: `Montserrat` (Google Fonts) — heavyweight (800 / 900), tight letter spacing, high-impact.
- **Main (Body)**: `Outfit` (Google Fonts) — clean, readable, modern sans-serif.

---

## ✨ Features

- **Full-Screen Cards**: Utilizes CSS scroll-snapping (`scroll-snap-type: y mandatory`) to deliver card-by-card transitions.
- **Stories Progress Bars**: Interactive indicator at the top tracking current card progress (Instagram/Spotify style).
- **Stat Counters**: Intersection-observed smooth numbering counters.
- **Glassmorphic Music Player**: Responsive widget that plays soothing coding beats with audio visualization and custom seek controls.
- **Wrapped Share Card**: End-of-slide summary card summarizing developers metrics, social icons, and mock profile avatar.
- **Offline Fallback Engine**: Pure client-side regex compiler that auto-populates fallback data if opened statically in a browser.

---

## ⚙️ Customisation

The portfolio variables are injected either at the backend level via the CareerPilot engine or fall back to the `PORTFOLIO_DATA` object at the top of `script.js` during standalone testing:

```js
const PORTFOLIO_DATA = {
  name: 'Alex Rivera',
  projects_count: 14,
  experience_years: 6,
  skills: [ ... ],
  projects: [ ... ],
  email: 'alex.rivera@dev.io',
  github_url: 'https://github.com/alexrivera',
  linkedin_url: 'https://linkedin.com/in/alexrivera',
  twitter_url: 'https://twitter.com/alexriveradev'
};
```

---

## 🚀 Usage

Serve the directory with any static server:

```bash
npx serve .
```

Or open `index.html` directly in a browser.

---

## 📝 Issue Reference

Closes **#909** — *[Portfolio] Create 'Spotify Wrapped' portfolio theme (Spotify-inspired)*
