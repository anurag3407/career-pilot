# Portfolio Theme Starter Kit

This is a starter template for creating new portfolio themes for career-pilot.
Copy this folder, rename it, and customize it to create your own theme.

---

## Getting Started

1. Copy the `_starter` folder
2. Rename it to your theme name (e.g. `my-awesome-theme`)
3. Edit `meta.json` with your theme details
4. Customize `index.html` with your layout
5. Style it in `style.css`
6. Replace `preview.png` with a screenshot of your theme

---

## File Structure

your-theme-name/
├── index.html     # Main Handlebars template
├── style.css      # Your theme styles
├── meta.json      # Theme metadata
├── preview.png    # Theme preview screenshot
└── README.md      # This file
---

## Available Handlebars Variables

### Owner
| Variable | Description |
|----------|-------------|
| `{{portfolio.owner.name}}` | Full name |
| `{{portfolio.owner.avatar}}` | Profile picture URL |
| `{{portfolio.owner.bio}}` | Short bio |
| `{{portfolio.owner.location}}` | Location |
| `{{portfolio.owner.github}}` | GitHub URL |
| `{{portfolio.owner.linkedin}}` | LinkedIn URL |
| `{{portfolio.owner.twitter}}` | Twitter URL |
| `{{portfolio.owner.website}}` | Personal website URL |

### Repositories
| Variable | Description |
|----------|-------------|
| `{{repos}}` | Array of repositories |
| `{{this.name}}` | Repository name |
| `{{this.description}}` | Repository description |
| `{{this.url}}` | Repository URL |
| `{{this.stars}}` | Star count |
| `{{this.language}}` | Primary language |
| `{{this.forks}}` | Fork count |

### Stats
| Variable | Description |
|----------|-------------|
| `{{stats.totalStars}}` | Total stars |
| `{{stats.totalForks}}` | Total forks |
| `{{stats.totalRepos}}` | Total repositories |
| `{{stats.followers}}` | Followers count |
| `{{stats.contributions}}` | Total contributions |

---

## Available Handlebars Helpers

| Helper | Usage | Description |
|--------|-------|-------------|
| `{{#if}}` | `{{#if variable}}...{{/if}}` | Conditional rendering |
| `{{#each}}` | `{{#each array}}...{{/each}}` | Loop through arrays |
| `{{#unless}}` | `{{#unless variable}}...{{/unless}}` | Inverse conditional |

---

## Tips

* Do NOT make the starter visually complex — keep it clean and minimal
* Always document new variables you discover in this README
* Test your theme with different data before submitting
* Keep `style.css` well commented so others can follow your structure