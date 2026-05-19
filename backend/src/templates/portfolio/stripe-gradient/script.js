/**
 * script.js — Stripe Docs Portfolio Theme
 * 
 * Responsibilities:
 * 1. Portfolio data configuration
 * 2. DOM injection for skills, projects, timeline
 * 3. Safe placeholder replacement to prevent XSS
 * 4. Interactive elements (nav, scroll, loading)
 */

'use strict';

/* ═══════════════════════════════════════════════════════════
   PORTFOLIO DATA
═══════════════════════════════════════════════════════════ */
const PORTFOLIO = {
  name:      'ALEX DEV',
  initials:  'AD',
  role:      'SOFTWARE ENGINEER',
  tagline:   'Building scalable web applications with modern technologies. Passionate about clean code, intuitive design, and solving complex problems.',
  email:     'alex@example.com',
  githubUrl: 'https://github.com/',
  linkedinUrl: 'https://linkedin.com/',
  twitterUrl:  'https://twitter.com/',
  
  avatarEmoji: '👨‍💻',

  aboutPara1: "I'm a full-stack developer with a focus on building robust, scalable infrastructure and seamless user experiences. With a strong foundation in modern web frameworks, I architect solutions that drive real business value.",
  aboutPara2: "When I'm not coding, I contribute to open-source projects, write technical articles, and experiment with emerging web technologies.",

  stats: ['5+ Years Exp', '40+ Projects', '100% Client Success'],

  /* ── Skills ──────────────────────────────────────────── */
  skillCategories: [
    {
      title: 'Frontend',
      skills: [
        { name: 'React / Next.js', pct: 95 },
        { name: 'TypeScript',      pct: 90 },
        { name: 'Tailwind CSS',    pct: 85 }
      ]
    },
    {
      title: 'Backend',
      skills: [
        { name: 'Node.js',         pct: 90 },
        { name: 'PostgreSQL',      pct: 85 },
        { name: 'GraphQL',         pct: 80 }
      ]
    },
    {
      title: 'Infrastructure',
      skills: [
        { name: 'AWS',             pct: 75 },
        { name: 'Docker',          pct: 85 },
        { name: 'CI/CD',           pct: 80 }
      ]
    }
  ],

  /* ── Projects ────────────────────────────────────────── */
  projects: [
    {
      id:    '01',
      title: 'FinTech Dashboard',
      desc:  'A high-performance financial analytics dashboard handling real-time data streams and complex visualisations.',
      tags:  ['React', 'TypeScript', 'WebSockets'],
      demo:  'https://demo.example.com',
      code:  'https://github.com/example',
    },
    {
      id:    '02',
      title: 'E-Commerce API',
      desc:  'Scalable microservices architecture for a global e-commerce platform processing thousands of transactions daily.',
      tags:  ['Node.js', 'PostgreSQL', 'Redis'],
      demo:  'https://demo.example.com',
      code:  'https://github.com/example',
    },
    {
      id:    '03',
      title: 'Design System',
      desc:  'Comprehensive UI component library built with accessibility and developer experience as primary goals.',
      tags:  ['React', 'Storybook', 'Figma'],
      demo:  'https://demo.example.com',
      code:  'https://github.com/example',
    }
  ],

  /* ── Experience ──────────────────────────────────────── */
  experience: [
    {
      date:    '2022 — Present',
      role:    'Senior Engineer',
      company: 'TechFlow Solutions',
      desc:    'Leading a team of engineers to build enterprise-grade SaaS products. Reduced infrastructure costs by 30% through optimisation.',
    },
    {
      date:    '2019 — 2022',
      role:    'Full-Stack Developer',
      company: 'Innovate Studio',
      desc:    'Developed and maintained multiple client-facing applications. Championed the adoption of TypeScript across all projects.',
    },
    {
      date:    '2018 — 2019',
      role:    'Frontend Developer',
      company: 'Digital Nexus',
      desc:    'Built responsive, high-converting landing pages and interactive web experiences for global brands.',
    }
  ]
};

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const txt = (text) => document.createTextNode(text);

const el = (tag, classes = [], attrs = {}) => {
  const node = document.createElement(tag);
  if (classes.length) node.className = classes.join(' ');
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

/* ═══════════════════════════════════════════════════════════
   PLACEHOLDER REPLACEMENT
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
   DOM INJECTION
═══════════════════════════════════════════════════════════ */
const buildSkills = () => {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  PORTFOLIO.skillCategories.forEach(cat => {
    const card = el('div', ['skill-category', 'floating-card']);
    
    const title = el('h3', ['skill-category-title']);
    title.appendChild(txt(cat.title));
    card.appendChild(title);

    cat.skills.forEach(skill => {
      const item = el('div', ['skill-item']);
      
      const header = el('div', ['skill-header']);
      const name = el('span');
      name.appendChild(txt(skill.name));
      const pct = el('span');
      pct.appendChild(txt(skill.pct + '%'));
      
      header.appendChild(name);
      header.appendChild(pct);
      
      const barBg = el('div', ['skill-bar-bg']);
      const barFill = el('div', ['skill-bar-fill'], {
        'data-pct': String(skill.pct),
        role: 'progressbar',
        'aria-valuenow': String(skill.pct),
        'aria-valuemin': '0',
        'aria-valuemax': '100',
        'aria-label': skill.name
      });
      
      barBg.appendChild(barFill);
      item.appendChild(header);
      item.appendChild(barBg);
      card.appendChild(item);
    });

    grid.appendChild(card);
  });
};

const buildProjects = () => {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  PORTFOLIO.projects.forEach(proj => {
    const cardWrap = el('article', ['floating-card'], { 'aria-label': proj.title });
    const card = el('div', ['project-card']);
    
    const title = el('h3', ['project-title']);
    title.appendChild(txt(proj.title));
    
    const desc = el('p', ['project-desc']);
    desc.appendChild(txt(proj.desc));
    
    const tags = el('div', ['project-tags'], { 'aria-label': 'Technologies used' });
    proj.tags.forEach(t => {
      const tag = el('span', ['tag']);
      tag.appendChild(txt(t));
      tags.appendChild(tag);
    });
    
    const links = el('div', ['project-links']);
    if (proj.demo) {
      const demo = el('a', ['project-link'], { href: proj.demo, target: '_blank', rel: 'noopener noreferrer' });
      demo.innerHTML = 'Live Demo &rarr;';
      links.appendChild(demo);
    }
    if (proj.code) {
      const code = el('a', ['project-link'], { href: proj.code, target: '_blank', rel: 'noopener noreferrer' });
      code.innerHTML = 'Source Code &rarr;';
      links.appendChild(code);
    }

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(tags);
    card.appendChild(links);
    cardWrap.appendChild(card);
    grid.appendChild(cardWrap);
  });
};

const buildTimeline = () => {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;

  PORTFOLIO.experience.forEach(exp => {
    const item = el('div', ['timeline-item']);
    
    const marker = el('div', ['timeline-marker'], { 'aria-hidden': 'true' });
    
    const date = el('div', ['timeline-date']);
    date.appendChild(txt(exp.date));
    
    const role = el('h3', ['timeline-role']);
    role.appendChild(txt(exp.role));
    
    const company = el('div', ['timeline-company']);
    company.appendChild(txt(exp.company));
    
    const desc = el('p', ['timeline-desc']);
    desc.appendChild(txt(exp.desc));

    item.appendChild(marker);
    item.appendChild(date);
    item.appendChild(role);
    item.appendChild(company);
    item.appendChild(desc);
    
    timeline.appendChild(item);
  });
};

/* ═══════════════════════════════════════════════════════════
   INTERACTIONS
═══════════════════════════════════════════════════════════ */
const initObservers = () => {
  // Skill bars animation
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.pct + '%';
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-bar-fill').forEach(f => skillObserver.observe(f));

  // Active nav link highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => navObserver.observe(s));
};

const initNavigation = () => {
  // Mobile nav toggle
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll to top
  const scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

const removeLoadingScreen = () => {
  const screen = document.getElementById('loading-screen');
  if (screen) {
    setTimeout(() => {
      screen.style.opacity = '0';
      setTimeout(() => screen.remove(), 500);
    }, 800);
  }
};

const setFooterYear = () => {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
};

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  fillPlaceholders();
  buildSkills();
  buildProjects();
  buildTimeline();
  setFooterYear();
  
  initObservers();
  initNavigation();
  removeLoadingScreen();
});
