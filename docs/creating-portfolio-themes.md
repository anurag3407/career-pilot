# 🎨 Creating Portfolio Themes for CareerPilot

Welcome contributors!

This guide explains how to create and submit custom portfolio themes for the CareerPilot Portfolio Builder.

---

# 📁 Theme Folder Structure

All portfolio themes must be placed inside:

```bash
backend/src/templates/portfolio/
```

Example:

```bash
backend/src/templates/portfolio/minimal-dark/
```

Each theme folder must contain:

```bash
minimal-dark/
├── index.html
├── style.css
├── meta.json
└── preview.png
```

---

# 📄 Required Files

## 1. `index.html`

Main portfolio template file.

### Requirements

- Use plain HTML only
- Support Handlebars template variables
- Maintain semantic HTML structure
- Ensure responsive layout
- Keep markup clean and readable

### Example

```html
<h1>{{name}}</h1>
<p>{{title}}</p>
```

---

## 2. `style.css`

Contains all theme styling.

### Requirements

- Plain CSS only
- No Tailwind CSS
- No Bootstrap
- No SCSS/SASS
- No external UI frameworks
- Responsive design required

---

## 3. `meta.json`

Contains theme metadata.

### Example

```json
{
  "name": "Minimal Dark",
  "description": "Clean dark portfolio theme for developers",
  "author": "your-github-username",
  "version": "1.0.0"
}
```

### Required Fields

| Field | Description |
|------|-------------|
| `name` | Theme display name |
| `description` | Short description of the theme |
| `author` | GitHub username |
| `version` | Theme version |

---

## 4. `preview.png`

Preview image used in the theme gallery.

### Requirements

- PNG format only
- Recommended size: `1280x720`
- Clear screenshot of the rendered theme

---

# 🧩 Available Handlebars Variables

Themes can use the following Handlebars variables.

## Basic Information

```handlebars
{{name}}
{{title}}
{{email}}
{{phone}}
{{location}}
{{bio}}
```

---

## Social Links

```handlebars
{{github}}
{{linkedin}}
{{website}}
{{twitter}}
```

---

## Skills

```handlebars
{{#each skills}}
  <span>{{this}}</span>
{{/each}}
```

---

## Projects

```handlebars
{{#each projects}}
  <div>
    <h3>{{title}}</h3>
    <p>{{description}}</p>
    <a href="{{link}}">View Project</a>
  </div>
{{/each}}
```

---

## Experience

```handlebars
{{#each experience}}
  <div>
    <h3>{{role}}</h3>
    <p>{{company}}</p>
    <p>{{duration}}</p>
  </div>
{{/each}}
```

---

## Education

```handlebars
{{#each education}}
  <div>
    <h3>{{institution}}</h3>
    <p>{{degree}}</p>
  </div>
{{/each}}
```

---

# 🎯 Design Guidelines

Portfolio themes should be:

- Clean and professional
- Fully responsive
- Accessible and readable
- Lightweight and fast-loading
- Easy to customize

---

## Recommended Practices

- Use semantic HTML tags
- Maintain consistent spacing and typography
- Use CSS variables where appropriate
- Keep animations subtle
- Test on multiple screen sizes

---

# 🚫 What NOT to Do

Do NOT:

- Use React, Vue, or Angular
- Add npm dependencies
- Use Tailwind CSS
- Use Bootstrap
- Add build tools
- Add server-side code
- Include unnecessary large assets
- Hardcode contributor-specific data

Themes must work using only:

- HTML
- CSS
- Handlebars variables

---

# 🧪 Testing Your Theme Locally

## 1. Add Theme Folder

Place your theme inside:

```bash
backend/src/templates/portfolio/
```

---

## 2. Verify Required Files

Ensure the following files exist:

- `index.html`
- `style.css`
- `meta.json`
- `preview.png`

---

## 3. Start the Development Servers

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

---

## 4. Test the Theme

Verify that:

- The theme renders correctly
- Layout is responsive
- Handlebars variables display properly
- Styles load without issues
- No assets are broken

---

# 📤 How to Submit Your Theme

## 1. Fork the Repository

```bash
git clone https://github.com/YOUR_USERNAME/career-pilot.git
```

---

## 2. Create a New Branch

```bash
git checkout -b feat/add-portfolio-theme
```

---

## 3. Add Your Theme

Place the completed theme folder inside:

```bash
backend/src/templates/portfolio/
```

---

## 4. Commit Changes

Example:

```bash
git commit -m "feat(portfolio): add minimal dark portfolio theme"
```

---

## 5. Open a Pull Request

Your PR should include:

- Use the repository PR template and complete all relevant sections
- Theme screenshots
- `preview.png`
- Responsive testing confirmation
- Short explanation of the design
---

# ✅ Code Review Criteria

Themes will be reviewed based on:

| Criteria | Description |
|------|-------------|
| Responsiveness | Works across mobile, tablet, and desktop |
| Accessibility | Proper readability and contrast |
| Performance | Lightweight and optimized |
| Code Quality | Clean HTML and CSS structure |
| Compatibility | Correct Handlebars variable usage |
| Visual Quality | Professional and polished design |

---

# 💡 Contributor Tips

- Review existing themes before creating a new one
- Keep designs unique and maintainable
- Avoid excessive animations
- Use consistent spacing and typography
- Test thoroughly before submitting

---

# 🙌 Thank You

Thank you for contributing to CareerPilot!

Your portfolio themes help users showcase their skills and projects professionally.
