# Glassmorphism Theme

A modern glassmorphism-style portfolio theme for career-pilot with frosted glass cards, animated gradient background, and floating orb decorations.

---

## Design Decisions

| Choice | Detail |
|--------|--------|
| **Background** | Animated gradient (`#0f0c29` → `#302b63` → `#24243e`) via CSS keyframes |
| **Glass effect** | `backdrop-filter: blur(20px)` with solid fallback for unsupported browsers |
| **Orbs** | CSS-only floating decorations using `filter: blur` + `@keyframes` |
| **Heading font** | Space Grotesk — modern, geometric, readable |
| **Body font** | Inter — clean, highly legible |
| **Accent** | Purple-to-blue gradient (`#a78bfa` → `#60a5fa`) |
| **Dark mode** | ✅ This is a dark theme by design |

---

## Fallback Strategy

Browsers that don't support `backdrop-filter` receive a solid semi-transparent background (`rgba(48, 43, 99, 0.85)`) via the `.glass` class fallback, ensuring the theme looks good everywhere.

---

## Layout

- **Sticky nav** — frosted glass, gradient logo, active link underline, mobile hamburger
- **Hero** — centered glass card with avatar, name, bio, location, social buttons
- **About** — 2-column: bio card left, stat cards grid right
- **Projects** — 3-column responsive grid with shimmer border hover effect
- **Skills** — glass card with chip list (populated by `script.js` `SKILLS` array)
- **Contact** — centered glass form with client-side validation
- **Footer** — gradient name, dynamic year via JS

---

## Files

```
glassmorphism/
├── index.html   # Handlebars template
├── style.css    # All theme styles (glass, orbs, gradient, print)
├── script.js    # Skills injection, nav, form, scroll, fade-in
├── meta.json    # Theme metadata
├── preview.png  # Theme screenshot
└── readme.md    # This file
```

---

## Customising Skills

Edit the `SKILLS` array in `script.js` to change the skill chips shown in the Skills section:

```js
const SKILLS = [
  'JavaScript', 'TypeScript', 'React', ...
];
```

---

## Print Support

A full `@media print` block in `style.css` ensures clean paper output — backgrounds stripped, nav/form hidden, project URLs shown inline.