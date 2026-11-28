# 🎨 Creating Portfolio Templates for CareerPilot

**Last updated:** 2026-11-28
**Live templates:** 262 (plus the built-in `Studio` layout)

Portfolio templates are **React components**, not server-side HTML themes. The
gallery, preview page, Studio switcher and the standalone deploy bundle all
discover them from the filesystem.

---

## 1. Where templates live

```text
frontend/src/components/portfolio/templates/
└── My_Template_Name/
    └── index.jsx
```

The folder name is the template id. Use PascalCase words separated by
underscores (`Academic_Scholar`, `3D_Isometric`, `ASCII_Art_Terminal_Code`).
The id is used in URLs, the registry, and deploy metadata — pick it once and
do not rename it later.

---

## 2. Required files

| File | Required | Purpose |
|---|---|---|
| `frontend/src/components/portfolio/templates/<Id>/index.jsx` | Yes | The template component (default export) |
| `frontend/public/template-previews/<Id>.png` (or `/templates/<Id>.png`) | Recommended | Gallery/preview image referenced by metadata |
| Entry in `frontend/src/data/templates.js` | Yes | Gallery metadata (`id`, `title`, `category`, `colorScheme`, `layout`, `author`, `image`, `isComplete`, `description`) |

No manual registry import is needed — `frontend/src/data/portfolioTemplates.jsx`
uses `import.meta.glob` to lazy-load every `*/index.jsx` and merges it with the
metadata list.

---

## 3. Component contract

```jsx
import { usePortfolio } from "../../../../context/PortfolioContext";

export default function MyTemplate() {
  const { portfolioData } = usePortfolio();
  const { personal, hero, about, skills = [], projects = [], experience = [] } = portfolioData;

  return (
    <main>
      <h1>{personal?.name || "Your Name"}</h1>
      <p>{personal?.title}</p>
      {/* sections */}
    </main>
  );
}
```

Rules:

1. **Default export**, no required props. `usePortfolio()` supplies normalized
   data.
2. Read from the normalized shape:
   `personal {name,title,tagline,bio,location,email,phone,avatar}`,
   `hero {title,subtitle,tagline,bio,image}`, `about {bio}`, `skills[]`,
   `projects[]` (`title`, `description`, `techStack`, `image`, `liveUrl`,
   `githubUrl`), `experience[]`, `education[]`, `socials`, `testimonials[]`,
   `stats`, `contact`.
3. **Never inject placeholder people.** The context normalizer already prevents
   dummy data from leaking into deploy mode; do not hardcode names, quotes or
   testimonials in the component.
4. **Handle empty data**: render sensible empty sections instead of crashing.
5. **Self-contained styling**: inline styles, CSS modules or Tailwind classes.
   Do not import global CSS or depend on the dashboard theme.
6. **No network calls** at render time (no fetch/AI). Deployment is static.
7. **Safe links**: `target="_blank"` + `rel="noreferrer noopener"` for external
   URLs; never `dangerouslySetInnerHTML` with user content.
8. **Responsive and accessible**: semantic landmarks, alt text, focus styles,
   reduced-motion respect.
9. Framer Motion, lucide-react and other installed packages are fine; keep
   animations cheap on mobile.

---

## 4. Metadata entry

Add one object to `frontend/src/data/templates.js`:

```js
{
  id: "My_Template_Name",
  title: "My Template Name",
  category: "Portfolio",
  colorScheme: "Dark",
  layout: "Interactive",
  author: "Your Name",
  views: 0,
  rating: 5,
  image: "/template-previews/My_Template_Name.png",
  createdAt: "2026-11-28",
  isComplete: true,
  description: "One or two sentences describing the visual concept and interactions."
}
```

`isComplete: true` marks it as production-ready; incomplete templates are shown
as previews only.

---

## 5. Preview image

- Put a 1200×900 (or 16:10) PNG at `frontend/public/template-previews/<Id>.png`.
- The gallery uses it; the preview route also renders the live component.
- Keep the file under ~300 KB so the gallery stays fast.

---

## 6. Verify locally

```bash
cd frontend
npm run dev
```

| Check | URL |
|---|---|
| Gallery | `http://localhost:5173/templates` |
| Live preview | `http://localhost:5173/preview/<Id>` |
| Studio switcher | `http://localhost:5173/portfolio-builder/studio` |

Then build the deployable shell:

```bash
npm run build:portfolio
# emits frontend/dist-portfolio/standalone.html + assets/
```

The backend portfolio-generator tests read that file; CI rebuilds it in the
frontend job and restores it for the backend job.

---

## 7. Deploy path

```text
template component
  → PortfolioContext (normalized data)
  → standalone bundle (vite.standalone.config.js)
  → backend portfolioHtmlGenerator (fills window.__PORTFOLIO_DATA__)
  → cloudflare / netlify / github-pages deployer
```

The deployer must never include gallery/dummy content: the normalizer checks
`window.__PORTFOLIO_DATA__` and user content before falling back to the demo
data.

---

## 8. Submission checklist

- [ ] Folder `frontend/src/components/portfolio/templates/<Id>/index.jsx`
- [ ] Default export renders with empty and full data
- [ ] Metadata entry in `frontend/src/data/templates.js`
- [ ] Preview image in `frontend/public/template-previews/`
- [ ] No hardcoded people/testimonials
- [ ] Links safe; no raw HTML injection
- [ ] Responsive at 375 px and 1440 px
- [ ] Gallery, preview and Studio all load it
- [ ] `npm run build:portfolio` succeeds
- [ ] `npm test` (frontend) passes
