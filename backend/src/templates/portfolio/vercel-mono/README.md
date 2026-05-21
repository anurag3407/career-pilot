# Vercel-Mono Portfolio Theme

A minimalist, high-performance portfolio template inspired by Vercel and Next.js aesthetics.
Built for the [CareerPilot](https://github.com/anurag3407/career-pilot) platform.

---

## 📁 Files

| File | Description |
|------|-------------|
| `index.html` | Semantic HTML with `{{PLACEHOLDER}}` tokens |
| `style.css` | Vercel-inspired CSS (pure black/white palette, Geist/Inter fonts) |
| `script.js` | Data config + DOM injection + interactive effects |

---

## 🎨 Design System

### Colour Palette (Vercel-inspired, high contrast)

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | `#000000` | Page background |
| `--fg` | `#ffffff` | Primary text |
| `--fg-muted` | `#888888` | Secondary text, subtle borders |
| `--accent` | `#ff0000` | Optional accent color |
| `--border` | `#333333` | Borders and dividers |
| `--card-bg` | `#111111` | Card backgrounds |

### Typography

- **Font**: `Inter` (Sans) and `JetBrains Mono` (Mono)
- **Contrast**: High contrast black and white with subtle grays
- **Details**: Monospaced tags, terminal mockups, and deployment status badges

---

## ✨ Features

| Feature | Implementation |
|---------|---------------|
| Geometric Background | Pure CSS background with blurred triangles |
| Terminal Output | Mock terminal in the About section |
| Status Badge | Vercel-style deployment status indicator |
| Gradient Border | Animated gradient border on the contact card |
| Skill bars | Animated on scroll via `IntersectionObserver` |
| Project cards | Minimalist cards with SVG icons |
| Active nav | Scroll-spy via `IntersectionObserver` |
| Mobile nav | Hamburger toggle with `aria-expanded` |

---

## ⚙️ Customisation

Edit the `PORTFOLIO` object at the top of `script.js`:

```js
const PORTFOLIO = {
  name:      'YOUR NAME',
  initials:  'YN',
  role:      'SOFTWARE ENGINEER',
  email:     'you@example.com',
  githubUrl: 'https://github.com/yourhandle',
  // ...
  projects: [
    {
      title: 'PROJECT NAME',
      desc:  'Short description.',
      tags:  ['React', 'Node.js'],
      demo:  'https://demo.url',
      code:  'https://github.com/repo',
    },
  ],
};
```

The HTML `{{PLACEHOLDER}}` tokens are filled at runtime by `script.js`
via a safe text-node walker (no `innerHTML` — XSS safe).

---

## ✅ Accessibility

- Semantic HTML5 elements (`<nav>`, `<section>`, `<article>`, `<footer>`)
- `aria-label`, `aria-controls`, `aria-expanded` on interactive elements
- `role="progressbar"` on skill fills with `aria-valuenow`
- `rel="noopener noreferrer"` on all external links
- Keyboard-navigable

---

## 🚀 Usage

```html
<!-- Serve the directory with any static server -->
npx serve .
<!-- or open index.html directly in a browser -->
```

No build step required — pure HTML, CSS, and vanilla JS.

---

## 📝 Issue Reference

Closes **#904** — *Create 'Vercel/Next.js' portfolio theme (Vercel-inspired)*
