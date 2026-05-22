/**
 * script.js — Vercel-Inspired Portfolio
 * Clean, minimalistic data injection & interactions
 */

'use strict';

/* ═══════════════════════════════════════════════════════════
   ░░ PORTFOLIO DATA — customise everything below ░░
═══════════════════════════════════════════════════════════ */
const PORTFOLIO = {
  name:      'GUILLERMO SMOKE',
  initials:  'GS',
  role:      'SOFTWARE ENGINEER',
  tagline:   'Building the fast web. Focused on performance, developer experience, and edge computing.',
  email:     'guillermo@example.com',
  githubUrl: 'https://github.com/',
  linkedinUrl: 'https://linkedin.com/',
  twitterUrl:  'https://twitter.com/',

  aboutPara1: "I'm a full-stack developer who cares deeply about performance and clean architecture. I specialize in the React/Next.js ecosystem and serverless edge functions.",
  aboutPara2: "My approach is simple: ship fast, measure everything, and iterate. Zero downtime is a requirement, not a feature.",

  stats: [
    { label: 'Uptime', value: '99.99%' },
    { label: 'Latency', value: '<50ms' },
    { label: 'Deploys', value: '1K+' }
  ],

  /* ── Terminal Commands for About Section ── */
  terminal: [
    { cmd: 'npx create-next-app@latest my-app', out: 'Success! Created my-app at /home/gs/my-app' },
    { cmd: 'cd my-app && npm run dev', out: 'ready - started server on 0.0.0.0:3000, url: http://localhost:3000' },
    { cmd: 'vercel --prod', out: 'Deployed to production. https://my-app.vercel.app' }
  ],

  /* ── Skills ──────────────────────────────────────────── */
  skillCategories: [
    {
      title: 'Frontend Edge',
      skills: [
        { name: 'Next.js / React', pct: 95 },
        { name: 'TypeScript',      pct: 90 },
        { name: 'Tailwind CSS',    pct: 85 },
      ],
    },
    {
      title: 'Backend & Cloud',
      skills: [
        { name: 'Node.js / Edge Functions', pct: 90 },
        { name: 'PostgreSQL / Prisma',      pct: 80 },
        { name: 'Redis',                    pct: 75 },
      ],
    },
    {
      title: 'Tools & CI/CD',
      skills: [
        { name: 'Vercel / AWS',  pct: 95 },
        { name: 'GitHub Actions', pct: 85 },
        { name: 'Jest / Playwright', pct: 80 },
      ],
    },
  ],

  /* ── Projects ────────────────────────────────────────── */
  projects: [
    {
      title: 'Turborepo Dashboard',
      desc:  'A high-performance monorepo build visualization tool. Reduces CI times by 40% using remote caching.',
      tags:  ['Next.js 14', 'React Server Components', 'Tailwind'],
      demo:  'https://demo.example.com',
      code:  'https://github.com/example',
    },
    {
      title: 'Edge Analytics',
      desc:  'Privacy-friendly web analytics running entirely on the edge. Sub-10ms response times globally.',
      tags:  ['Cloudflare Workers', 'Redis', 'TypeScript'],
      demo:  'https://demo.example.com',
      code:  'https://github.com/example',
    },
    {
      title: 'Design System',
      desc:  'Accessible, headless component library used across 12+ internal applications.',
      tags:  ['Radix UI', 'Storybook', 'NPM'],
      demo:  'https://demo.example.com',
      code:  'https://github.com/example',
    },
  ],

  /* ── Experience ──────────────────────────────────────── */
  experience: [
    {
      date:    '2022 — PRESENT',
      role:    'STAFF ENGINEER',
      company: 'ACME CORP',
      desc:    'Architected the migration from monolithic architecture to Next.js + Edge functions. Improved core web vitals by 60%.',
    },
    {
      date:    '2019 — 2022',
      role:    'SENIOR FRONTEND DEVELOPER',
      company: 'GLOBAL TECH',
      desc:    'Led a team of 4 to rebuild the customer dashboard. Implemented strict TypeScript standards and CI/CD automation.',
    },
    {
      date:    '2017 — 2019',
      role:    'SOFTWARE ENGINEER',
      company: 'STARTUP INC',
      desc:    'Built RESTful APIs in Node/Express and designed the initial React frontend architecture.',
    },
  ],
};

/* ═══════════════════════════════════════════════════════════
   ░░ HELPERS ░░
═══════════════════════════════════════════════════════════ */

const txt = (text) => document.createTextNode(text);

const el = (tag, classes = [], attrs = {}) => {
  const node = document.createElement(tag);
  if (classes.length) node.className = classes.join(' ');
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

/* ═══════════════════════════════════════════════════════════
   ░░ TEMPLATE PLACEHOLDERS ░░
═══════════════════════════════════════════════════════════ */
const fillPlaceholders = () => {
  const map = {
    '{{NAME}}':        PORTFOLIO.name,
    '{{INITIALS}}':    PORTFOLIO.initials,
    '{{ROLE}}':        PORTFOLIO.role,
    '{{TAGLINE}}':     PORTFOLIO.tagline,
    '{{EMAIL}}':       PORTFOLIO.email,
    '{{GITHUB_URL}}':  PORTFOLIO.githubUrl,
    '{{LINKEDIN_URL}}':PORTFOLIO.linkedinUrl,
    '{{TWITTER_URL}}': PORTFOLIO.twitterUrl,
    '{{ABOUT_PARA_1}}':PORTFOLIO.aboutPara1,
    '{{ABOUT_PARA_2}}':PORTFOLIO.aboutPara2,
    '{{STAT_1_VALUE}}':PORTFOLIO.stats[0]?.value || '',
    '{{STAT_1_LABEL}}':PORTFOLIO.stats[0]?.label || '',
    '{{STAT_2_VALUE}}':PORTFOLIO.stats[1]?.value || '',
    '{{STAT_2_LABEL}}':PORTFOLIO.stats[1]?.label || '',
    '{{STAT_3_VALUE}}':PORTFOLIO.stats[2]?.value || '',
    '{{STAT_3_LABEL}}':PORTFOLIO.stats[2]?.label || '',
  };

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    let val = node.nodeValue;
    let changed = false;
    Object.entries(map).forEach(([placeholder, replacement]) => {
      if (val.includes(placeholder)) {
        val = val.split(placeholder).join(replacement);
        changed = true;
      }
    });
    if (changed) node.nodeValue = val;
  });

  document.querySelectorAll('[href],[src],[aria-label],[title],[alt]').forEach((node) => {
    ['href', 'src', 'aria-label', 'title', 'alt'].forEach((attr) => {
      const val = node.getAttribute(attr);
      if (!val) return;
      let newVal = val;
      Object.entries(map).forEach(([p, r]) => { newVal = newVal.split(p).join(r); });
      if (newVal !== val) node.setAttribute(attr, newVal);
    });
  });
};

/* ═══════════════════════════════════════════════════════════
   ░░ TERMINAL INJECTION ░░
═══════════════════════════════════════════════════════════ */
const buildTerminal = () => {
  const tb = document.getElementById('terminal-body');
  if (!tb) return;

  PORTFOLIO.terminal.forEach(line => {
    const l = el('div', ['t-line']);
    
    const p = el('span', ['t-prompt']);
    p.appendChild(txt('>'));
    
    const c = el('span', ['t-cmd']);
    c.appendChild(txt(line.cmd));
    
    const o = el('div', ['t-out']);
    o.appendChild(txt(line.out));

    l.appendChild(p);
    l.appendChild(c);
    l.appendChild(o);
    tb.appendChild(l);
  });
};

/* ═══════════════════════════════════════════════════════════
   ░░ SKILL BARS ░░
═══════════════════════════════════════════════════════════ */
const buildSkillCards = () => {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  PORTFOLIO.skillCategories.forEach((cat) => {
    const card = el('div', ['skill-category']);
    const heading = el('h3', ['skill-category-title', 'mono']);
    heading.appendChild(txt(cat.title));
    card.appendChild(heading);

    const list = el('ul', ['skill-list']);

    cat.skills.forEach((skill) => {
      const li = el('li');
      
      const item = el('div', ['skill-item']);
      const name = el('span', ['skill-name']);
      name.appendChild(txt(skill.name));
      const pct = el('span', ['skill-pct', 'mono']);
      pct.appendChild(txt(skill.pct + '%'));
      
      item.appendChild(name);
      item.appendChild(pct);

      const barBg = el('div', ['skill-bar-bg']);
      const barFill = el('div', ['skill-bar-fill'], {
        'data-pct': String(skill.pct),
        role: 'progressbar',
        'aria-valuenow': String(skill.pct),
        'aria-valuemin': '0',
        'aria-valuemax': '100',
        'aria-label': skill.name + ' proficiency',
      });
      barBg.appendChild(barFill);

      li.appendChild(item);
      li.appendChild(barBg);
      list.appendChild(li);
    });

    card.appendChild(list);
    grid.appendChild(card);
  });
};

const initSkillObserver = () => {
  const fills = document.querySelectorAll('.skill-bar-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          fill.style.width = fill.dataset.pct + '%';
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.2 }
  );

  fills.forEach((f) => observer.observe(f));
};

/* ═══════════════════════════════════════════════════════════
   ░░ PROJECT CARDS ░░
═══════════════════════════════════════════════════════════ */
const buildProjectCards = () => {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  PORTFOLIO.projects.forEach((proj, i) => {
    const card = el('article', ['project-card'], {
      'aria-label': proj.title,
    });

    const header = el('div', ['project-header']);
    const title = el('h3', ['project-title']);
    title.appendChild(txt(proj.title));
    
    const links = el('div', ['project-links']);
    if (proj.demo) {
      const demoLink = el('a', ['project-link'], {
        href: proj.demo,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: `Live demo for ${proj.title}`,
      });
      // Minimal SVG icon for external link
      demoLink.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>';
      links.appendChild(demoLink);
    }
    if (proj.code) {
      const codeLink = el('a', ['project-link'], {
        href: proj.code,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: `Source code for ${proj.title}`,
      });
      // Minimal SVG icon for code/github
      codeLink.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>';
      links.appendChild(codeLink);
    }
    header.appendChild(title);
    header.appendChild(links);

    const desc = el('p', ['project-desc', 'mono']);
    desc.appendChild(txt(proj.desc));

    const footer = el('div', ['project-footer']);
    const tagsWrap = el('div', ['project-tags']);
    proj.tags.forEach((t) => {
      const tag = el('span', ['project-tag', 'mono']);
      tag.appendChild(txt(t));
      tagsWrap.appendChild(tag);
    });
    footer.appendChild(tagsWrap);

    card.appendChild(header);
    card.appendChild(desc);
    card.appendChild(footer);

    grid.appendChild(card);
  });
};

const initProjectHover = () => {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
};

/* ═══════════════════════════════════════════════════════════
   ░░ EXPERIENCE TIMELINE ░░
═══════════════════════════════════════════════════════════ */
const buildTimeline = () => {
  const container = document.getElementById('timeline');
  if (!container) return;

  PORTFOLIO.experience.forEach((exp) => {
    const item = el('div', ['timeline-item']);

    const dateEl = el('p', ['timeline-date', 'mono']);
    dateEl.appendChild(txt(exp.date));

    const roleEl = el('h3', ['timeline-role']);
    roleEl.appendChild(txt(exp.role));

    const companyEl = el('p', ['timeline-company', 'mono']);
    companyEl.appendChild(txt(exp.company));

    const descEl = el('p', ['timeline-desc']);
    descEl.appendChild(txt(exp.desc));

    item.appendChild(dateEl);
    item.appendChild(roleEl);
    item.appendChild(companyEl);
    item.appendChild(descEl);
    container.appendChild(item);
  });
};

/* ═══════════════════════════════════════════════════════════
   ░░ ACTIVE NAV LINK ON SCROLL ░░
═══════════════════════════════════════════════════════════ */
const initNavHighlight = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
};

/* ═══════════════════════════════════════════════════════════
   ░░ SCROLL TO TOP ░░
═══════════════════════════════════════════════════════════ */
const initScrollTop = () => {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

/* ═══════════════════════════════════════════════════════════
   ░░ MOBILE NAV TOGGLE ░░
═══════════════════════════════════════════════════════════ */
const initMobileNav = () => {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
};

/* ═══════════════════════════════════════════════════════════
   ░░ FOOTER YEAR ░░
═══════════════════════════════════════════════════════════ */
const setFooterYear = () => {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
};

/* ═══════════════════════════════════════════════════════════
   ░░ INIT ░░
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  fillPlaceholders();
  buildTerminal();
  buildSkillCards();
  buildProjectCards();
  buildTimeline();
  setFooterYear();

  initSkillObserver();
  initProjectHover();
  initNavHighlight();
  initScrollTop();
  initMobileNav();
});
