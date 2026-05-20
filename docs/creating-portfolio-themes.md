# Creating Portfolio Themes

This guide explains how to create, test, and submit a new portfolio theme for CareerPilot.

The key constraint is simple: portfolio themes must be plain HTML and CSS. Do not introduce a build step, bundler, framework, or transpilation pipeline.

---

## Theme Folder Structure

Create one folder per theme inside `backend/src/templates/portfolio/`.

Recommended structure:

```text
backend/src/templates/portfolio/
└── your-theme-name/
    ├── index.html
    ├── style.css
    ├── meta.json
    ├── preview.png
    └── README.md
```

Required files:

- `index.html` - the theme markup
- `style.css` - all theme styling
- `meta.json` - theme metadata used to describe the theme
- `preview.png` - preview image for the gallery

Optional files:

- `README.md` - notes for maintainers and contributors
- `script.js` - only if you need small vanilla-JS behavior for the theme

Keep the theme self-contained inside its folder. Do not depend on generated assets or build output.

---

## Required Files

### `index.html`

Use semantic HTML and the template variables provided by the portfolio renderer. Keep the markup readable and accessible.

### `style.css`

Use plain CSS only. Keep the theme responsive, maintainable, and scoped to the theme’s own layout.

### `meta.json`

Use this file to describe the theme in the gallery.

Example:

```json
{
  "name": "TODO: Theme name",
  "description": "TODO: Brief description of your theme",
  "version": "1.0.0",
  "author": "TODO: Your name",
  "preview": "preview.png",
  "tags": ["minimal", "developer"],
  "colors": {
    "primary": "#000000",
    "background": "#ffffff",
    "text": "#111111"
  }
}
```

### `preview.png`

Provide a clear screenshot of the finished theme. The preview should show the main layout, typography, and visual style at a glance.

---

## Handlebars Template Variables Available

The starter theme documents the current portfolio variables available to template authors. Use these instead of hard-coding sample content.

### Owner

- `{{portfolio.owner.name}}` - full name of the portfolio owner
- `{{portfolio.owner.avatar}}` - profile picture URL
- `{{portfolio.owner.bio}}` - short bio
- `{{portfolio.owner.location}}` - location
- `{{portfolio.owner.github}}` - GitHub profile URL
- `{{portfolio.owner.linkedin}}` - LinkedIn profile URL
- `{{portfolio.owner.twitter}}` - Twitter profile URL
- `{{portfolio.owner.website}}` - personal website URL

### Repositories

- `{{repos}}` - array of repositories
- `{{this.name}}` - repository name
- `{{this.description}}` - repository description
- `{{this.url}}` - repository URL
- `{{this.stars}}` - star count
- `{{this.language}}` - primary language
- `{{this.forks}}` - fork count

### Stats

- `{{stats.totalStars}}` - total stars across all repositories
- `{{stats.totalForks}}` - total forks across all repositories
- `{{stats.totalRepos}}` - total number of repositories
- `{{stats.followers}}` - GitHub followers count
- `{{stats.contributions}}` - total contributions

### Common Helpers

- `{{#if}}` - conditional rendering
- `{{#each}}` - loop over arrays
- `{{#unless}}` - inverse conditional rendering

If your theme uses additional placeholders, document them in the theme’s own `README.md` so reviewers can see exactly what the template expects.

---

## Design Guidelines and Constraints

Follow these rules when designing a theme:

- Keep the design responsive on desktop and mobile
- Use semantic HTML elements such as `header`, `main`, `section`, `article`, and `footer`
- Preserve accessible labels, focus states, and sufficient color contrast
- Prefer lightweight CSS effects over heavy scripts
- Keep the page understandable without JavaScript
- If you use JavaScript, keep it small, vanilla, and optional
- Match the theme’s visual style to the content instead of forcing a generic layout
- Optimize for readability first, then polish

Do not:

- Add a framework, bundler, or build tool
- Require npm install, Vite, Webpack, or similar setup steps
- Depend on external runtime services for core rendering
- Use unsafe HTML injection patterns
- Hide essential content behind animations or scripts

---

## How to Test Locally

You can test a theme with any static server or by opening the HTML file directly in a browser.

Recommended options:

1. Serve the theme folder with a simple static server.
2. Open `index.html` directly in your browser for a quick visual check.
3. Resize the viewport and verify mobile behavior.
4. Confirm that the preview image matches the actual layout.
5. Check that links, buttons, and typography still work with real data.

Example local check:

```bash
cd backend/src/templates/portfolio/your-theme-name
npx serve .
```

No build step is required.

---

## How to Submit

1. Copy the starter theme from `backend/src/templates/portfolio/_starter`.
2. Rename the folder to your theme slug.
3. Replace the starter content with your theme layout and styles.
4. Fill out `meta.json`.
5. Replace `preview.png` with a real screenshot.
6. Document any extra placeholders or behaviors in `README.md`.
7. Open a pull request against the main branch.

Suggested PR template:

```md
## Summary
Add the `your-theme-name` portfolio theme.

## What changed
- Added new theme folder with `index.html`, `style.css`, `meta.json`, and `preview.png`
- Documented any theme-specific placeholders or behaviors

## Validation
- Opened the theme locally in a browser
- Verified responsive layout on mobile and desktop
- Confirmed preview image matches the final design
```

---

## Code Review Criteria

A theme is ready for review when it meets these checks:

- The folder contains all required files
- The theme works as plain HTML and CSS
- The layout is responsive and readable
- The theme uses accessible semantic markup
- All template variables are documented and used correctly
- The preview image accurately reflects the submitted theme
- The theme does not introduce unnecessary complexity or dependencies
- The theme matches the quality bar of the existing portfolio themes

Reviewers should reject themes that rely on build tooling, obscure the content, or break the plain-file contract.

---

## What Not To Do

- Do not require any build tools
- Do not use React, Vue, Svelte, or any other framework for theme rendering
- Do not add a compile or transpile step
- Do not depend on generated assets that are not checked in
- Do not leave `meta.json` incomplete or inconsistent with the theme
- Do not use `innerHTML` or unsafe templating shortcuts for user content
- Do not submit a theme without a valid preview image
- Do not make the theme so complex that it becomes difficult to review or maintain

---

## Quick Checklist

Before opening your PR, confirm that:

- `index.html` renders the intended layout
- `style.css` is complete and responsive
- `meta.json` is filled out and valid JSON
- `preview.png` clearly shows the theme
- The theme works without a build step
- Any extra placeholders are documented

If you are unsure whether a design fits the theme system, compare it against the existing starter theme and the shipped portfolio templates in `backend/src/templates/portfolio/`.
