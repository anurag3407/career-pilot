# Stripe Docs Portfolio Theme

A clean, premium portfolio template inspired by Stripe's technical documentation design. Built for the CareerPilot platform.

---

## 📁 Files

| File | Description |
|------|-------------|
| `index.html` | Semantic HTML with `{{PLACEHOLDER}}` tokens |
| `style.css` | Mesh gradients, floating cards, code block styling |
| `script.js` | Data config, DOM injection, interactive scroll effects |

---

## 🎨 Design System

### Colour Palette

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary` | `#635BFF` | Indigo: brand identity, highlights, links |
| `--secondary` | `#00D4AA` | Teal: subtitle accents, progress bars |
| `--accent` | `#FF5E6D` | Coral: high-emphasis actions, hover states |
| `--bg-dark` | `#0A2540` | Slate dark: footer, dark code blocks |
| `--bg-light` | `#F8F9FC` | Section backgrounds, canvas |
| `--card-white` | `rgba(255, 255, 255, 0.8)` | Floating content panels with blur |
| `--text-core` | `#0A2540` | Main body headings, title content |
| `--text-muted` | `#425466` | Secondary body text, captions |

### Typography

- **Font**: `Inter` (Google Fonts) for body and headings.
- **Monospace**: `JetBrains Mono` (Google Fonts) for code blocks and technical content.

### Aesthetic Features

- **Mesh Gradients**: Overlapping radial gradients to create a soft, vibrant background.
- **Animated Orbs**: Slow-drifting CSS background blobs using `@keyframes`.
- **Floating Cards**: Semi-transparent white cards with backdrop-filter blur (`blur(12px)`), crisp borders, and soft shadows.
- **Code Block Styling**: Developer-centric terminal elements with syntax highlighting emulation.

---

## ✨ Features

- Smooth scrolling with sticky, glassmorphic navigation
- Active navigation link highlight via `IntersectionObserver`
- Three-column feature grid for skills and projects
- Loading screen with gradient progress
- "Click-to-Copy" interactions for code blocks
- Responsive mobile design with off-canvas hamburger menu

---

## ⚙️ Customisation

Edit the `PORTFOLIO` object at the top of `script.js`.
The HTML `{{PLACEHOLDER}}` tokens are filled at runtime by `script.js` via a safe text-node walker to prevent XSS.

---

## 🚀 Usage

```bash
# Serve the directory with any static server
npx serve .
```

---

## 📝 Issue Reference

Closes **#905** - Create 'Stripe Docs' portfolio theme (Stripe-inspired)
