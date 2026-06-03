# Clean White Theme

A clean, light-mode portfolio theme for career-pilot with maximum readability.

---

## Design Decisions

| Choice | Detail |
|--------|--------|
| **Background** | Pure white (`#ffffff`) with subtle gray (`#f9fafb`) surface accents |
| **Borders** | Subtle gray (`#e5e7eb`) — just enough structure without visual noise |
| **Whitespace** | Generous padding throughout; `5rem` section vertical padding |
| **Heading font** | Playfair Display (serif) — elegant, editorial feel |
| **Body font** | Inter (sans-serif) — clean, highly legible at all sizes |
| **Dark mode** | ❌ Not supported — this is intentionally a light-only theme |

---

## Layout

- **Hero** — centered, avatar + name + bio + location + social pills
- **About** — 2-column grid: left bio/details, right GitHub stats
- **Projects** — CSS masonry grid (3 → 2 → 1 column, responsive)
- **Contact** — minimal centered form (name, email, message)
- **Footer** — simple two-item bar

---

## Files

```
clean-white/
├── index.html     # Handlebars template
├── style.css      # All theme styles (variables, layout, print)
├── meta.json      # Theme metadata
├── preview.png    # Theme screenshot (replace with actual screenshot)
└── README.md      # This file
```

---

## Print Support

A full `@media print` block in `style.css` ensures clean paper output:
- Backgrounds, shadows and animations stripped
- Navigation and contact form hidden
- Project cards switch to 2-column, URLs shown after link text
- Page-break hints applied to sections and headings