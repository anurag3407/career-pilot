/**
 * Generates a complete, self-contained HTML portfolio page from structured data.
 * The output is a single index.html file with all CSS inlined — ready for
 * Cloudflare Pages / Netlify / GitHub Pages deployment.
 */

/**
 * @param {Object} data - The portfolio data (hero, about, experience, projects, skills)
 * @param {string} templateId - The template style to use (currently 'Cherry_Blossom' or 'default')
 * @returns {{ html: string, css: string }} - Complete HTML string + extracted CSS
 */
export function generatePortfolioHtml(data, templateId = 'default') {
  const hero = data.hero || {};
  const about = data.about || {};
  const experience = data.experience || [];
  const projects = data.projects || [];
  const skills = data.skills || [];

  const name = hero.subtitle || 'Portfolio';
  const title = hero.title || '';
  const tagline = hero.tagline || '';
  const bio = about.bio || '';

  // Escape HTML to prevent XSS
  const esc = (s) => String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const skillsHtml = Array.isArray(skills)
    ? skills.map(s => typeof s === 'string' ? s : s.name || '').filter(Boolean)
        .map(s => `<span class="skill-tag">${esc(s)}</span>`).join('\n            ')
    : '';

  const experienceHtml = experience.map(exp => `
          <div class="exp-card">
            <div class="exp-header">
              <h3>${esc(exp.role || exp.title)}</h3>
              <span class="exp-period">${esc(exp.period || '')}</span>
            </div>
            <p class="exp-company">${esc(exp.company || '')}</p>
            <p class="exp-desc">${esc(exp.description || '')}</p>
          </div>`).join('\n');

  const projectsHtml = projects.map(p => {
    const techs = (p.technologies || p.techStack || [])
      .map(t => `<span class="tech-tag">${esc(t)}</span>`).join('');
    return `
          <div class="project-card">
            <h3>${esc(p.title || p.name || 'Project')}</h3>
            <p>${esc(p.description || '')}</p>
            <div class="tech-list">${techs}</div>
          </div>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(name)} — ${esc(title)}</title>
  <meta name="description" content="${esc(tagline)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #0a0a0f;
      --surface: #12121a;
      --surface-2: #1a1a2e;
      --border: rgba(255,255,255,0.06);
      --text: #e4e4e7;
      --text-muted: #71717a;
      --accent: #818cf8;
      --accent-2: #a78bfa;
      --gradient: linear-gradient(135deg, #818cf8, #a78bfa, #f472b6);
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
    }
    a { color: var(--accent); text-decoration: none; }

    /* Hero */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 4rem 2rem;
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 600px 400px at 30% 20%, rgba(129,140,248,0.12), transparent),
        radial-gradient(ellipse 500px 350px at 70% 80%, rgba(167,139,250,0.08), transparent);
    }
    .hero-content { position: relative; z-index: 1; max-width: 700px; }
    .hero-badge {
      display: inline-block;
      padding: 0.4rem 1.2rem;
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: rgba(129,140,248,0.1);
      border: 1px solid rgba(129,140,248,0.2);
      color: var(--accent);
      margin-bottom: 2rem;
    }
    .hero h1 {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      font-weight: 900;
      letter-spacing: -0.03em;
      line-height: 1.1;
      background: var(--gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero h2 {
      font-size: clamp(1.1rem, 2.5vw, 1.5rem);
      font-weight: 500;
      color: var(--text-muted);
      margin-top: 1rem;
    }
    .hero p.tagline {
      font-size: 1.1rem;
      color: var(--text-muted);
      margin-top: 1.5rem;
      max-width: 550px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Sections */
    section {
      max-width: 900px;
      margin: 0 auto;
      padding: 5rem 2rem;
    }
    .section-title {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 3rem;
      position: relative;
      display: inline-block;
    }
    .section-title::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 60px;
      height: 4px;
      border-radius: 2px;
      background: var(--gradient);
    }

    /* About */
    .about-text {
      font-size: 1.1rem;
      color: var(--text-muted);
      line-height: 1.8;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 1.5rem;
      padding: 2.5rem;
    }

    /* Skills */
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .skill-tag {
      padding: 0.5rem 1.2rem;
      border-radius: 100px;
      font-size: 0.85rem;
      font-weight: 500;
      background: var(--surface-2);
      border: 1px solid var(--border);
      color: var(--text);
      transition: all 0.2s;
    }
    .skill-tag:hover {
      border-color: var(--accent);
      background: rgba(129,140,248,0.08);
    }

    /* Experience */
    .exp-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 1.25rem;
      padding: 2rem;
      margin-bottom: 1.25rem;
      transition: border-color 0.2s;
    }
    .exp-card:hover { border-color: rgba(129,140,248,0.3); }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; }
    .exp-header h3 { font-size: 1.15rem; font-weight: 700; }
    .exp-period {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--accent);
      background: rgba(129,140,248,0.08);
      padding: 0.25rem 0.75rem;
      border-radius: 100px;
    }
    .exp-company { font-weight: 600; color: var(--text-muted); margin-top: 0.3rem; }
    .exp-desc { color: var(--text-muted); margin-top: 0.75rem; font-size: 0.95rem; }

    /* Projects */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .project-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 1.25rem;
      padding: 2rem;
      transition: all 0.25s;
    }
    .project-card:hover {
      border-color: rgba(167,139,250,0.3);
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.3);
    }
    .project-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; }
    .project-card p { color: var(--text-muted); font-size: 0.9rem; }
    .tech-list { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
    .tech-tag {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.3rem 0.7rem;
      border-radius: 6px;
      background: rgba(129,140,248,0.1);
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    /* Footer */
    footer {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-muted);
      font-size: 0.85rem;
      border-top: 1px solid var(--border);
    }
    footer a { color: var(--accent-2); }

    @media (max-width: 640px) {
      section { padding: 3rem 1.25rem; }
      .exp-header { flex-direction: column; }
    }
  </style>
</head>
<body>
  <main>
    <section class="hero">
      <div class="hero-content">
        <span class="hero-badge">Portfolio</span>
        <h1>${esc(name)}</h1>
        <h2>${esc(title)}</h2>
        ${tagline ? `<p class="tagline">${esc(tagline)}</p>` : ''}
      </div>
    </section>

    ${bio ? `
    <section>
      <h2 class="section-title">About</h2>
      <div class="about-text">${esc(bio)}</div>
    </section>` : ''}

    ${skillsHtml ? `
    <section>
      <h2 class="section-title">Skills</h2>
      <div class="skills-grid">
        ${skillsHtml}
      </div>
    </section>` : ''}

    ${experience.length > 0 ? `
    <section>
      <h2 class="section-title">Experience</h2>
      <div class="experience-list">
        ${experienceHtml}
      </div>
    </section>` : ''}

    ${projects.length > 0 ? `
    <section>
      <h2 class="section-title">Projects</h2>
      <div class="projects-grid">
        ${projectsHtml}
      </div>
    </section>` : ''}
  </main>

  <footer>
    <p>Built with <a href="https://careerpilot.dev" target="_blank" rel="noopener">CareerPilot</a></p>
  </footer>
</body>
</html>`;

  return { html };
}
