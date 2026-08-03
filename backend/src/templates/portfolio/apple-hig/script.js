/* eslint-env browser */
/**
 * script.js — Apple HIG-Inspired Portfolio
 * Clean data injection. No JS animations.
 */

'use strict';

/* ═══════════════════════════════════════════════════════════
   ░░ PORTFOLIO DATA ░░
═══════════════════════════════════════════════════════════ */
const PORTFOLIO = {
  name:      'Craig Federighi',
  role:      'Software Engineer',
  tagline:   'Designing intuitive and powerful software experiences.',
  email:     'craig@example.com',
  githubUrl: 'https://github.com/',
  linkedinUrl: 'https://linkedin.com/',
  twitterUrl:  'https://twitter.com/',

  aboutPara1: "I believe that software should be both beautiful and highly functional. My approach is centered around the user, ensuring that complex systems are presented with clarity and simplicity.",
  aboutPara2: "With over a decade of experience in systems architecture and front-end design, I bridge the gap between engineering and human-computer interaction.",

  stats: [
    { label: 'Years Experience', value: '12+' },
    { label: 'Projects Shipped', value: '40+' },
    { label: 'Open Source', value: '2M+' }
  ],

  /* ── Skills ──────────────────────────────────────────── */
  skills: [
    'Swift', 'SwiftUI', 'Objective-C', 'C++', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Core Data', 'Metal', 'UI/UX Design', 'Accessibility'
  ],

  /* ── Projects ────────────────────────────────────────── */
  projects: [
    {
      title: 'Safari UI Refresh',
      desc:  'A complete redesign of the web browser interface focusing on content maximization and tab management.',
      tags:  ['Design', 'Swift', 'macOS'],
      link:  'https://example.com/project1',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Control Center Pro',
      desc:  'An intuitive dashboard for managing system preferences and connected devices with seamless animations.',
      tags:  ['iOS', 'SwiftUI', 'Architecture'],
      link:  'https://example.com/project2',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Developer Tools',
      desc:  'A suite of performance profiling and debugging tools built for external developers.',
      tags:  ['C++', 'Instruments', 'macOS'],
      link:  'https://example.com/project3',
      image: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=800&q=80'
    }
  ],

  /* ── Experience ──────────────────────────────────────── */
  experience: [
    {
      date:    '2018 — PRESENT',
      role:    'Senior Software Engineer',
      company: 'Tech Corp',
      desc:    'Leading the development of core UI frameworks. Managed a team of 15 engineers to deliver the biggest redesign in company history.',
    },
    {
      date:    '2014 — 2018',
      role:    'Software Engineer',
      company: 'Innovate LLC',
      desc:    'Developed high-performance graphics rendering pipelines for mobile devices. Optimized memory usage by 40%.',
    },
    {
      date:    '2011 — 2014',
      role:    'Junior Developer',
      company: 'StartUp Inc',
      desc:    'Full-stack web development using modern JavaScript frameworks. Built the initial MVP for the flagship product.',
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
   ░░ SKILLS ░░
═══════════════════════════════════════════════════════════ */
const buildSkills = () => {
  const container = document.getElementById('skills-container');
  if (!container) return;

  PORTFOLIO.skills.forEach((skill) => {
    const pill = el('div', ['skill-pill']);
    pill.appendChild(txt(skill));
    container.appendChild(pill);
  });
};

/* ═══════════════════════════════════════════════════════════
   ░░ PROJECTS ░░
═══════════════════════════════════════════════════════════ */
const buildProjects = () => {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  PORTFOLIO.projects.forEach((proj) => {
    const card = el('article', ['project-card'], {
      'aria-label': proj.title,
    });

    const contentWrap = el('div', ['project-content']);
    
    const title = el('h3', ['project-title']);
    title.appendChild(txt(proj.title));
    
    const desc = el('p', ['project-desc']);
    desc.appendChild(txt(proj.desc));

    const tagsWrap = el('div', ['project-tags']);
    proj.tags.forEach((t) => {
      const tag = el('span', ['project-tag']);
      tag.appendChild(txt(t));
      tagsWrap.appendChild(tag);
    });

    contentWrap.appendChild(title);
    contentWrap.appendChild(desc);
    contentWrap.appendChild(tagsWrap);

    if (proj.link) {
      const linksWrap = el('div', ['project-links']);
      const link = el('a', ['project-link'], {
        href: proj.link,
        target: '_blank',
        rel: 'noopener noreferrer'
      });
      link.appendChild(txt('Learn more'));
      linksWrap.appendChild(link);
      contentWrap.appendChild(linksWrap);
    }

    const visualWrap = el('div', ['project-visual']);
    if (proj.image) {
      const img = el('img', [], {
        src: proj.image,
        alt: proj.title,
        style: 'width: 100%; height: 100%; object-fit: cover;'
      });
      visualWrap.appendChild(img);
    } else {
      visualWrap.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-tertiary); opacity: 0.5;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
    }

    card.appendChild(contentWrap);
    card.appendChild(visualWrap);
    
    grid.appendChild(card);
  });
};

/* ═══════════════════════════════════════════════════════════
   ░░ EXPERIENCE ░░
═══════════════════════════════════════════════════════════ */
const buildExperience = () => {
  const container = document.getElementById('experience-list');
  if (!container) return;

  PORTFOLIO.experience.forEach((exp) => {
    const item = el('div', ['experience-item']);

    const dateWrap = el('div');
    const dateEl = el('p', ['experience-date']);
    dateEl.appendChild(txt(exp.date));
    dateWrap.appendChild(dateEl);

    const contentWrap = el('div');
    const roleEl = el('h3', ['experience-role']);
    roleEl.appendChild(txt(exp.role));

    const companyEl = el('p', ['experience-company']);
    companyEl.appendChild(txt(exp.company));

    const descEl = el('p', ['experience-desc']);
    descEl.appendChild(txt(exp.desc));

    contentWrap.appendChild(roleEl);
    contentWrap.appendChild(companyEl);
    contentWrap.appendChild(descEl);

    item.appendChild(dateWrap);
    item.appendChild(contentWrap);
    
    container.appendChild(item);
  });
};

/* ═══════════════════════════════════════════════════════════
   ░░ UI UTILS ░░
═══════════════════════════════════════════════════════════ */
const initMobileNav = () => {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isActive = links.classList.toggle('active');
    toggle.setAttribute('aria-expanded', String(isActive));
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
};

const initThemeToggle = () => {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  const currentTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (currentTheme === 'dark' || (!currentTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || 
                   (!document.documentElement.hasAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
};

const setFooterYear = () => {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
};

/* ═══════════════════════════════════════════════════════════
   ░░ INIT ░░
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  fillPlaceholders();
  buildSkills();
  buildProjects();
  buildExperience();
  setFooterYear();
  initMobileNav();
  initThemeToggle();
});
