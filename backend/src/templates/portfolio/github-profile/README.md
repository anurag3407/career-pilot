# GitHub-Profile Portfolio Theme

A lightweight, GitHub-inspired portfolio template for the [CareerPilot](https://github.com/anurag3407/career-pilot) platform.
Hand-written, minimal code focused on clarity and maintainability.

---

## 📁 Files

| File | Description |
|------|-------------|
| `index.html` | Semantic HTML with a two-column layout (sidebar + content) |
| `style.css` | GitHub-inspired dark theme with CSS variables and responsive grid |
| `script.js` | Data config, DOM rendering, and tab navigation |

---

## 🎨 Design System

### Colour Palette (GitHub dark theme)

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | `#0d1117` | Page background |
| `--card` | `#161b22` | Card/sidebar background |
| `--border` | `#30363d` | Borders and dividers |
| `--text` | `#c9d1d9` | Primary text |
| `--muted` | `#8b949e` | Secondary text, hints |
| `--link` | `#58a6ff` | Links and interactive elements |

### Typography

- **Font**: System fonts (`-apple-system`, `Segoe UI`, `Helvetica`, `Arial`)
- **Sizing**: Responsive base of 16px with scale adjustments for mobile
- **Contrast**: High-contrast white on dark gray for readability

---

## ✨ Features

| Feature | Implementation |
|---------|---------------|
| Profile sidebar | Sticky left column with avatar, name, bio, and stats |
| Tab navigation | Smooth scroll-spy and history state management |
| Project grid | Responsive cards with language badges and star count |
| About section | Simple markdown renderer (headings, lists, code) |
| Contribution placeholder | Lightweight visual summary (no heavy DOM) |
| Skills & Experience | Semantic sections with HTML structure |
| Contact links | GitHub, LinkedIn, Email with SVG icons |
| Responsive layout | Single-column on mobile, two-column on desktop |

---

## ⚙️ Customisation

Edit the `DEFAULT_PROFILE` object at the top of `script.js`:

```js
const DEFAULT_PROFILE = {
  name: 'Your Name',
  username: 'yourusername',
  bio: 'Your short bio here.',
  stats: {
    followers: 0,
    following: 0
  },
  readme: `## About Me
Your detailed bio goes here. Supports markdown headings, lists, and inline code.`
};
```

Edit the `DEFAULT_REPOSITORIES` array to customize projects:

```js
const DEFAULT_REPOSITORIES = [
  {
    name: 'project-name',
    url: 'https://github.com/user/project',
    description: 'Brief description.',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    stars: 100
  },
  // ... add more
];
```

To override at runtime, set `window.GITHUB_PROFILE_DATA` before the script loads:

```js
window.GITHUB_PROFILE_DATA = {
  profile: { name: 'Override Name', /* ... */ },
  repositories: [ /* ... */ ]
};
```

---

## ✅ Accessibility

- Semantic HTML5 elements (`<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<article>`)
- `aria-label` on interactive nav sections
- `role="banner"` and `aria-label` on navigation
- Keyboard-navigable tabs with `#` hash navigation
- `rel="noopener noreferrer"` on all external links
- Smooth scroll behaviour via CSS (`scroll-behavior: smooth`)

---

## 🚀 Usage

```bash
# Serve with any static server
npx http-server .
# or
npx serve .

# Open in browser
open http://localhost:8080
```

---

## 📝 Notes

- This template avoids heavy frameworks and external APIs.
- DOM rendering is intentionally simple and predictable.
- All data is local; no real-time API calls to GitHub.
- The heatmap is a lightweight placeholder for demo purposes.

