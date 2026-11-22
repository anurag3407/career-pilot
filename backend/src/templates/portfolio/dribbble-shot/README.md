# Dribbble Shot Portfolio Theme

A premium, visual-heavy portfolio template inspired by Dribbble's shot grid layout. Designed and optimized for designers, UI/UX engineers, and visual creatives. Built with clean, vanilla technologies for the [CareerPilot](https://github.com/anurag3407/career-pilot) platform.

---

## 📁 Files

| File | Description |
|------|-------------|
| [index.html](file:///d:/Sanvi/career-pilot/backend/src/templates/portfolio/dribbble-shot/index.html) | Semantic HTML5 structure with dynamic `{{PLACEHOLDER}}` tokens |
| [style.css](file:///d:/Sanvi/career-pilot/backend/src/templates/portfolio/dribbble-shot/style.css) | Premium HSL-based stylesheets with dark/light themes, masonry grids, and keyframe animations |
| [script.js](file:///d:/Sanvi/career-pilot/backend/src/templates/portfolio/dribbble-shot/script.js) | DOM rendering, dynamic placeholder injection, interaction observers, and mock portfolio state |

---

## 🎨 Design System

### Colour Palette (Creative & Vibrant HSL)

| Variable | Light Theme | Dark Theme | Usage |
|----------|-------------|------------|-------|
| `--bg` | `#f8f7f4` (Cream) | `#0d0c22` (Deep Navy) | Base background |
| `--fg` | `#0d0c22` (Deep Navy) | `#f8f7f4` (Cream) | Core typography & labels |
| `--fg-muted` | `#6e6d7a` (Slate) | `#9e9ea7` (Silver) | Descriptions & sub-info |
| `--accent` | `#ea4c89` (Dribbble Pink) | `#ea4c89` (Dribbble Pink) | High-emphasis accent actions |
| `--accent-bg` | `#fee5ec` (Soft Pink) | `#2f2e47` (Navy-grey) | Hover borders & light badges |
| `--card-bg` | `#ffffff` (Pure White) | `#1f1e33` (Charcoal Blue) | Content cards base |

### Typography & Spacing

- **Primary Font**: `Poppins` (Sans-serif)
- **Aesthetic**: Playful, rounded shapes, generous margins, minimal card text, and a high-focus visual hierarchy.
- **Borders & Corners**: Premium rounded corners (`--radius-lg: 24px`, `--radius-md: 16px`) with soft drop-shadow variables.

---

## ✨ Features (All Completed & Fully Verified)

### 1. Staggered CSS Masonry Grid
- **Multi-column Layout**: Configured `.projects-masonry` with CSS column counts (`column-count: 3; column-gap: 32px;` on desktop) and structured project cards to break-inside properly.
- **Organic Visual Flow**: Supports alternating heights (Landscape, Tall Portrait, Square) for 6 featured shots to create a true, staggered Dribbble masonry look.
- **Hover Micro-Interactions**: Smoothly scales images (`scale(1.06)`) and reveals a dark gradient overlay with tags, descriptions, and action links upon card hover.

### 2. Profile Photo Circle (About Card)
- **Premium Placement**: Integrates a clean profile photo circle of the author (`Maya Lin`) next to the about biography description.
- **Double-Accent Border**: Encircled by a modern double-accent outline (`6px solid var(--accent-bg)`) that shifts to the Dribbble pink accent color on hover.
- **Interactive Scaling**: Applies smooth scaling transitions (`scale(1.05)`) when hovered to feel alive and click-friendly.
- **Responsive Stacking**: Automatically stacks vertically and centers the photo, biography copy, and highlights on screens narrower than `992px`.

### 3. Dual Audience CTA Optimization (Recruiters & Collaborators)
- **Softened Landing Copy**: Tailored contact block headers and taglines to welcome both independent clients looking for designers and corporate recruiters sourcing engineering talent.
- **Static Resume Download**: Positioned a low-emphasis outline button ("Download Resume") side-by-side with the primary "Let's Connect" action button, housed in a responsive button group.

### 4. Interactive & Shimmering Skill Fills
- **IntersectionObserver Trigger**: Utilizes `IntersectionObserver` in JavaScript to watch skill containers and trigger progress bar animations only when they scroll into the viewport.
- **Continuous Shimmer**: progress bar fills feature a moving linear-gradient background that shifts dynamically to animate active progress.

### 5. Hero Entrance Transitions
- **Sequence Fade-in**: Animates hero badge, main heading, role titles, taglines, and action buttons sequentially on window load using staggered transition delays and keyframe fades (`fadeInUp`).

---

## 🌟 Extra Features Added

### 1. Scroll-To-Top Interactive Button
- Fully functional circular navigation button that fades into view once the user scrolls down 400px, enabling smooth scrolling back to the top of the viewport.

### 2. OS-Level Dark Mode Matcher
- Initialized client-side listeners that dynamically detect and synchronize the website theme with the user's OS preference (`(prefers-color-scheme: dark)`) on initial load.

### 3. Comprehensive Scroll Reveal Handlers
- Registered scroll observers on the about card, skill cards, projects, and timeline entries to trigger modern fade-in-up entries as the visitor explores down the page.

### 4. Professional Link Sanitization
- Replaced default redirect routes with generalized secure links (`https://www.github.com` and target `rel="noopener noreferrer"`) to prevent opening random sample repositories.

---

## ⚙️ Customisation

All portfolio variables are fully configurable inside the `PORTFOLIO` object in `script.js`:

```js
const PORTFOLIO = {
  name:        'Maya Lin',
  initials:    'ML',
  role:        'UI/UX Designer & Frontend Engineer',
  tagline:     'Bridging complex technical architectures with intuitive, visual-first user experiences.',
  avatarUrl:   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
  email:       'maya@example.com',
  githubUrl:   'https://github.com/',
  linkedinUrl: 'https://linkedin.com/',
  twitterUrl:  'https://twitter.com/',
  aboutPara1:  'I am a design-minded engineer who believes...',
  // ...
};
```

---

## ✅ Accessibility

- **Semantic HTML5**: Full landmark structures (`<nav>`, `<section>`, `<article>`, `<footer>`) to help assistive technologies.
- **ARIA Actions**: Built-in keyboard accessibility attributes (`aria-expanded`, `aria-controls`, `aria-label`) on mobile hamburger triggers.
- **Standard Controls**: Interactive progress bar configurations with `role="progressbar"` and range definitions.

---

## 🚀 Usage & Deployment

To run and preview the theme files locally:

```bash
# Serve the theme files using a static server
npx serve .

# Or compile and deploy straight from the CareerPilot deployment modal
```
