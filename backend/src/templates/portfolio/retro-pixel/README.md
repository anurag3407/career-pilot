# Retro Pixel Portfolio Theme

A retro 8-bit-inspired portfolio template for gaming and creative developers.
Built for the [CareerPilot](https://github.com/xyron24/career-pilot) platform.

---

## 📁 Files

| File | Description |
|------|-------------|
| `index.html` | Semantic HTML with `{{PLACEHOLDER}}` tokens |
| `style.css` | NES-inspired CSS (pixel borders, scanlines, animations) |
| `script.js` | Data config + DOM injection + interactive effects |

---

## 🎨 Design System

### Colour Palette (NES-inspired, limited palette)

| Variable | Value | Usage |
|----------|-------|-------|
| `--black` | `#0f0f0f` | Page background |
| `--dark-gray` | `#1a1a2e` | Card / section backgrounds |
| `--green` | `#00ff41` | Primary accent, borders, glow |
| `--yellow` | `#ffd700` | Headings, cartridge labels |
| `--cyan` | `#00e5ff` | Subtitles, skill bars |
| `--purple` | `#b14aed` | Section tags |
| `--red` | `#ff0040` | Error / alert states |
| `--orange` | `#ff6b35` | Fire / danger |

### Typography

- **Font**: `Press Start 2P` (Google Fonts) — minimum `14px` body, `22px+` headings
- **Line-height**: `1.9` — ensures pixel fonts stay readable

### Pixel Border Technique

All bordered elements use `box-shadow` stacking instead of `border`:

```css
box-shadow:
  0 -4px 0 var(--green),   /* top    */
  0  4px 0 var(--green),   /* bottom */
 -4px 0  0 var(--green),   /* left   */
  4px 0  0 var(--green);   /* right  */
```

This gives sharp, pixel-perfect corners without corner artefacts.

---

## ✨ Features

| Feature | Implementation |
|---------|---------------|
| Scanline overlay | `body::after` with repeating gradient + CSS animation |
| Blinking cursor | `.cursor` element with `steps(1)` animation |
| Loading screen | Progress bar with CSS `steps(16)` keyframe |
| Typed subtitle | Vanilla JS typewriter with erase–retype cycle |
| Skill bars | Animated on scroll via `IntersectionObserver` |
| Project cards | Game cartridge shape with notch + connector pins |
| Active nav | Scroll-spy via `IntersectionObserver` |
| Click effects | Pixel-pop emoji spawn on every click |
| Mobile nav | Hamburger toggle with `aria-expanded` |

---

## ⚙️ Customisation

Edit the `PORTFOLIO` object at the top of `script.js`:

```js
const PORTFOLIO = {
  name:      'YOUR NAME',
  initials:  'YN',
  role:      'YOUR ROLE',
  email:     'you@example.com',
  githubUrl: 'https://github.com/yourhandle',
  // ...
  projects: [
    {
      id:    'CART-001',
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

Closes **#868** — _Retro Pixel Portfolio Theme for Gaming Developers_
