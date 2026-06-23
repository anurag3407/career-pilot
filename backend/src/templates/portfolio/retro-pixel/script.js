/* eslint-env browser */
/**
 * script.js — Retro Pixel Portfolio
 * 8-bit / NES-inspired interactive layer
 *
 * Responsibilities:
 *  1. Portfolio data configuration (edit this to personalise)
 *  2. Inject skill bars, project cartridges, timeline entries
 *  3. Loading screen with progress bar
 *  4. Blinking cursor & typed hero-subtitle
 *  5. Pixel skill-bar animation on scroll (IntersectionObserver)
 *  6. Active nav-link highlight on scroll
 *  7. Scroll-to-top button
 *  8. Mobile hamburger toggle
 */

'use strict';

/* ═══════════════════════════════════════════════════════════
   ░░ PORTFOLIO DATA — customise everything below ░░
═══════════════════════════════════════════════════════════ */
const PORTFOLIO = {
  name:      'ALEX PIXEL',
  initials:  'AP',
  role:      'FULL-STACK GAME DEVELOPER',
  tagline:   'Crafting pixel-perfect experiences by day, defeating final bosses by night. I build fast, scalable, and thoroughly over-engineered web apps.',
  email:     'alex@pixel.dev',
  githubUrl: 'https://github.com/',
  linkedinUrl: 'https://linkedin.com/',
  twitterUrl:  'https://twitter.com/',

  avatarEmoji: '🕹️',

  aboutPara1: "I'm a software developer with a love for retro aesthetics and modern performance. My toolkit spans React, Node.js, and cloud infrastructure — with an unhealthy attachment to pixel fonts.",
  aboutPara2: "When I'm not pushing commits, I'm speed-running classic NES titles or designing chiptune soundtracks. Code is my XP; problems are my boss fights.",

  stats: ['5+ YRS EXP', '30+ PROJECTS', '∞ COFFEE'],

  /* ── Skills ──────────────────────────────────────────── */
  skillCategories: [
    {
      title: '⚔  FRONTEND',
      skills: [
        { name: 'React / Next.js', pct: 92 },
        { name: 'TypeScript',      pct: 88 },
        { name: 'CSS / Tailwind',  pct: 85 },
        { name: 'WebGL / Canvas',  pct: 70 },
      ],
    },
    {
      title: '🛡  BACKEND',
      skills: [
        { name: 'Node.js / Express', pct: 90 },
        { name: 'PostgreSQL',        pct: 80 },
        { name: 'MongoDB',           pct: 82 },
        { name: 'GraphQL',           pct: 72 },
      ],
    },
    {
      title: '✦  DEVOPS & TOOLS',
      skills: [
        { name: 'Docker / K8s',  pct: 75 },
        { name: 'AWS / GCP',     pct: 70 },
        { name: 'CI/CD',         pct: 80 },
        { name: 'Git / GitHub',  pct: 95 },
      ],
    },
  ],

  /* ── Projects ────────────────────────────────────────── */
  projects: [
    {
      id:    'CART-001',
      title: 'DUNGEON QUEST RPGAME',
      desc:  'A browser-based RPG built with Phaser 3, featuring procedurally generated dungeons, inventory system, and WebSocket multiplayer.',
      tags:  ['Phaser 3', 'Node.js', 'Socket.io', 'MongoDB'],
      demo:  'https://demo.example.com',
      code:  'https://github.com/example',
    },
    {
      id:    'CART-002',
      title: 'PIXEL COMMERCE STORE',
      desc:  'Full-stack e-commerce platform with a retro pixel-art UI, Stripe payments, real-time inventory, and admin dashboard.',
      tags:  ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL'],
      demo:  'https://demo.example.com',
      code:  'https://github.com/example',
    },
    {
      id:    'CART-003',
      title: 'CHIPMAP — MUSIC TRACKER',
      desc:  'Web-based chiptune music tracker inspired by classic MOD players. Supports WAV export and live preview via Web Audio API.',
      tags:  ['Web Audio API', 'React', 'Vite', 'IndexedDB'],
      demo:  'https://demo.example.com',
      code:  'https://github.com/example',
    },
    {
      id:    'CART-004',
      title: '8-BIT WEATHER APP',
      desc:  'A retro-styled weather dashboard that pulls live data from OpenWeatherMap and renders animated pixel-art weather sprites.',
      tags:  ['JavaScript', 'OpenWeatherMap API', 'Canvas'],
      demo:  'https://demo.example.com',
      code:  'https://github.com/example',
    },
  ],

  /* ── Experience ──────────────────────────────────────── */
  experience: [
    {
      date:    '2023 — PRESENT',
      role:    'SENIOR FULL-STACK DEVELOPER',
      company: 'LEVEL UP STUDIOS',
      desc:    'Lead a team of 6 engineers building cloud-native SaaS products. Reduced API latency by 40% and introduced automated testing pipelines.',
    },
    {
      date:    '2021 — 2023',
      role:    'FRONTEND ENGINEER',
      company: 'PIXEL FORGE INC.',
      desc:    'Built interactive dashboards in React + D3.js for analytics clients. Delivered pixel-perfect designs from Figma specs.',
    },
    {
      date:    '2019 — 2021',
      role:    'JUNIOR DEVELOPER',
      company: 'CODE CASTLE LTD.',
      desc:    'Developed REST APIs with Node/Express, maintained legacy jQuery frontends, and shipped three mobile-first redesigns.',
    },
  ],
};

/* ═══════════════════════════════════════════════════════════
   ░░ HELPERS ░░
═══════════════════════════════════════════════════════════ */

/**
 * Safely create a text node — no innerHTML injection risk.
 * @param {string} text
 * @returns {Text}
 */
const txt = (text) => document.createTextNode(text);

/**
 * Create an element with optional classes and attributes.
 * @param {string} tag
 * @param {string[]} [classes]
 * @param {Object}  [attrs]
 * @returns {HTMLElement}
 */
const el = (tag, classes = [], attrs = {}) => {
  const node = document.createElement(tag);
  if (classes.length) node.className = classes.join(' ');
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

/* ═══════════════════════════════════════════════════════════
   ░░ TEMPLATE PLACEHOLDERS — inject into static HTML ░░
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
    '{{AVATAR_EMOJI}}':PORTFOLIO.avatarEmoji,
    '{{ABOUT_PARA_1}}':PORTFOLIO.aboutPara1,
    '{{ABOUT_PARA_2}}':PORTFOLIO.aboutPara2,
    '{{STAT_1}}':      PORTFOLIO.stats[0] || '',
    '{{STAT_2}}':      PORTFOLIO.stats[1] || '',
    '{{STAT_3}}':      PORTFOLIO.stats[2] || '',
  };

  // Walk all text nodes in the body
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

  // Also replace in attribute values (href, aria-label, etc.)
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
   ░░ LOADING SCREEN ░░
═══════════════════════════════════════════════════════════ */
const initLoadingScreen = () => {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;

  // Hide after CSS animation finishes (≈1.6 s) + brief pause
  setTimeout(() => {
    screen.classList.add('fade-out');
    setTimeout(() => screen.remove(), 500);
  }, 2000);
};

/* ═══════════════════════════════════════════════════════════
   ░░ TYPED SUBTITLE ░░
═══════════════════════════════════════════════════════════ */
const initTypedSubtitle = () => {
  const target = document.getElementById('hero-subtitle');
  if (!target) return;

  const titles = [
    PORTFOLIO.role,
    'GAME DEVELOPER',
    'PIXEL ARTIST',
    'OPEN-SOURCE HACKER',
  ];

  let tIdx = 0, cIdx = 0, deleting = false;

  const type = () => {
    const current = titles[tIdx];
    target.textContent = deleting
      ? current.substring(0, cIdx--)
      : current.substring(0, cIdx++);

    let delay = deleting ? 60 : 100;

    if (!deleting && cIdx > current.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && cIdx < 0) {
      deleting = false;
      tIdx = (tIdx + 1) % titles.length;
      cIdx = 0;
      delay = 400;
    }

    setTimeout(type, delay);
  };

  // Start after loading screen is gone
  setTimeout(type, 2400);
};

/* ═══════════════════════════════════════════════════════════
   ░░ SKILL BARS ░░
═══════════════════════════════════════════════════════════ */
const buildSkillCards = () => {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  PORTFOLIO.skillCategories.forEach((cat) => {
    const card = el('div', ['skill-card']);
    const heading = el('h4');
    heading.appendChild(txt(cat.title));
    card.appendChild(heading);

    cat.skills.forEach((skill) => {
      const wrap  = el('div', ['skill-bar-wrap']);
      const label = el('div', ['skill-label']);
      const name  = el('span');
      name.appendChild(txt(skill.name));
      const pct = el('span');
      pct.appendChild(txt(skill.pct + '%'));
      label.appendChild(name);
      label.appendChild(pct);

      const bar  = el('div', ['skill-bar']);
      const fill = el('div', ['skill-fill'], {
        'data-pct': String(skill.pct),
        role: 'progressbar',
        'aria-valuenow': String(skill.pct),
        'aria-valuemin': '0',
        'aria-valuemax': '100',
        'aria-label': skill.name + ' proficiency',
      });

      bar.appendChild(fill);
      wrap.appendChild(label);
      wrap.appendChild(bar);
      card.appendChild(wrap);
    });

    grid.appendChild(card);
  });
};

/** Animate skill fills when they scroll into view */
const initSkillObserver = () => {
  const fills = document.querySelectorAll('.skill-fill');
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
   ░░ PROJECT CARTRIDGES ░░
═══════════════════════════════════════════════════════════ */
const buildProjectCards = () => {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  PORTFOLIO.projects.forEach((proj, i) => {
    const cart = el('article', ['cartridge'], {
      'aria-label': proj.title,
      id: `project-${i}`,
    });

    // Top notch
    const notch = el('div', ['cartridge-notch'], { 'aria-hidden': 'true' });
    cart.appendChild(notch);

    // Label area
    const label = el('div', ['cartridge-label']);

    const idEl = el('p', ['cartridge-id']);
    idEl.appendChild(txt(proj.id));

    const titleEl = el('h3', ['cartridge-title']);
    titleEl.appendChild(txt(proj.title));

    const descEl = el('p', ['cartridge-desc']);
    descEl.appendChild(txt(proj.desc));

    // Tags
    const tagsWrap = el('div', ['cartridge-tags'], { 'aria-label': 'Technologies used' });
    proj.tags.forEach((t) => {
      const tag = el('span', ['tag']);
      tag.appendChild(txt(t));
      tagsWrap.appendChild(tag);
    });

    // Links
    const links = el('div', ['cartridge-links']);
    if (proj.demo) {
      const demoLink = el('a', [], {
        href: proj.demo,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `Live demo for ${proj.title}`,
      });
      demoLink.appendChild(txt('▶ DEMO'));
      links.appendChild(demoLink);
    }
    if (proj.code) {
      const codeLink = el('a', [], {
        href: proj.code,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `Source code for ${proj.title}`,
      });
      codeLink.appendChild(txt('⊞ CODE'));
      links.appendChild(codeLink);
    }

    label.appendChild(idEl);
    label.appendChild(titleEl);
    label.appendChild(descEl);
    label.appendChild(tagsWrap);
    label.appendChild(links);
    cart.appendChild(label);

    // Bottom pins
    const pinsRow = el('div', ['cartridge-pins'], { 'aria-hidden': 'true' });
    for (let p = 0; p < 8; p++) {
      pinsRow.appendChild(el('div', ['pin']));
    }
    cart.appendChild(pinsRow);

    grid.appendChild(cart);
  });
};

/* ═══════════════════════════════════════════════════════════
   ░░ EXPERIENCE TIMELINE ░░
═══════════════════════════════════════════════════════════ */
const buildTimeline = () => {
  const container = document.getElementById('timeline');
  if (!container) return;

  PORTFOLIO.experience.forEach((exp, i) => {
    const item = el('div', ['timeline-item'], { id: `exp-${i}` });

    const dateEl = el('p', ['timeline-date']);
    dateEl.appendChild(txt(exp.date));

    const roleEl = el('h3', ['timeline-role']);
    roleEl.appendChild(txt(exp.role));

    const companyEl = el('p', ['timeline-company']);
    companyEl.appendChild(txt('@ ' + exp.company));

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

  // Close on link click
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
   ░░ 8-BIT CURSOR CLICK EFFECT ░░
   Spawns a tiny "pixel pop" on every click for extra flair.
═══════════════════════════════════════════════════════════ */
const initClickEffect = () => {
  document.addEventListener('click', (e) => {
    const pop = document.createElement('div');
    pop.textContent = ['✦','★','✿','▶','♦'][Math.floor(Math.random() * 5)];
    pop.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      font-family: 'Press Start 2P', monospace;
      font-size: 14px;
      color: #ffd700;
      text-shadow: 0 0 8px #ffd700;
      pointer-events: none;
      z-index: 99998;
      animation: popUp 0.6s steps(6) forwards;
    `;
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 700);
  });

  // Inject keyframes once
  if (!document.getElementById('pop-style')) {
    const style = document.createElement('style');
    style.id = 'pop-style';
    style.textContent = `
      @keyframes popUp {
        0%   { transform: translateY(0)    scale(1);   opacity: 1; }
        100% { transform: translateY(-40px) scale(0.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
};

/* ═══════════════════════════════════════════════════════════
   ░░ INIT ░░
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  fillPlaceholders();
  buildSkillCards();
  buildProjectCards();
  buildTimeline();
  setFooterYear();

  initLoadingScreen();
  initTypedSubtitle();
  initSkillObserver();
  initNavHighlight();
  initScrollTop();
  initMobileNav();
  initClickEffect();
});
