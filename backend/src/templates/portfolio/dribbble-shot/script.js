/**
 * script.js — Dribbble Shot Portfolio
 * Modern dynamic injection and interaction
 */

'use strict';

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

  aboutPara1:  'I am a design-minded engineer who believes that software should look stunning while operating flawlessly at scale. My focus lies at the intersection of aesthetic system design and high-fidelity interactive frontend prototyping.',
  aboutPara2:  'I specialize in turning complex wireframes into responsive, fluid components. When I am not pushing clean code, I am analyzing web layouts, crafting custom UI kits, and exploring generative design patterns.',

  stats: [
    { label: 'UI Concepts Shipped', value: '24+' },
    { label: 'System Libraries', value: '4' },
    { label: 'Client Approvals', value: '99%' }
  ],

  skillCategories: [
    {
      title: 'Design Craft',
      skills: [
        { name: 'UI/UX Design', pct: 95 },
        { name: 'Figma Prototyping', pct: 90 },
        { name: 'Design Systems', pct: 85 }
      ]
    },
    {
      title: 'Engineering Core',
      skills: [
        { name: 'React / Next.js', pct: 92 },
        { name: 'TypeScript', pct: 88 },
        { name: 'Tailwind CSS / CSS Grid', pct: 90 }
      ]
    }
  ],

  projects: [
    {
      title: 'Saamya AI - Accessible Learning Platform',
      desc:  'An inclusive, adaptive learning system tailor-made for neurodivergent students, prioritizing dynamic contrast and layout scaling.',
      tags:  ['UX Design', 'React', 'Tailwind', 'AI Integration'],
      demo:  'https://demo.example.com',
      code:  'https://www.github.com',
      likes: 248,
      views: '3.1k',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&h=550&q=80'
    },
    {
      title: 'TransitSync - Urban Mobility Dashboard',
      desc:  'A high-density telemetry dashboard offering real-time tracking for metropolitan transit systems.',
      tags:  ['Product Design', 'Next.js', 'D3.js', 'WebSockets'],
      demo:  'https://demo.example.com',
      code:  'https://www.github.com',
      likes: 182,
      views: '2.4k',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&h=900&q=80'
    },
    {
      title: 'Lok-Rakshak AI Dashboard',
      desc:  'A responsive geospatial mapping interface constructed to handle resource dispatching during natural disaster scenarios.',
      tags:  ['Design Systems', 'React', 'Mapbox', 'Node.js'],
      demo:  'https://demo.example.com',
      code:  'https://www.github.com',
      likes: 312,
      views: '4.2k',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=800&q=80'
    },
    {
      title: 'FinFlow - Wealth Management Companion',
      desc:  'A clean, interactive personal finance app focusing on transaction categorization, automated savings goals, and data privacy.',
      tags:  ['Fintech', 'Mobile Design', 'React Native', 'Data Viz'],
      demo:  'https://demo.example.com',
      code:  'https://www.github.com',
      likes: 412,
      views: '5.8k',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&h=500&q=80'
    },
    {
      title: 'Aura Wearables - Smart Healthcare UI',
      desc:  'An interactive mobile interface paired with connected smart device hardware to track biometric indicators.',
      tags:  ['Mobile App', 'Wearables', 'UI/UX Design', 'SwiftUI'],
      demo:  'https://demo.example.com',
      code:  'https://www.github.com',
      likes: 289,
      views: '3.6k',
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&h=950&q=80'
    },
    {
      title: 'Zenith Crypto - 3D Exchange Platform',
      desc:  'A decentralized token swapping application featuring high-performance real-time price tickers and 3D visual modules.',
      tags:  ['Web3', 'Three.js', 'React', 'Crypto'],
      demo:  'https://demo.example.com',
      code:  'https://www.github.com',
      likes: 356,
      views: '4.9k',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&h=800&q=80'
    }
  ],

  experience: [
    {
      date:    '2024 — PRESENT',
      role:    'Lead UI/UX Designer & Engineer',
      company: 'PixelCraft Labs',
      desc:    'Orchestrated design systems and high-fidelity React component libraries for developer-tooling startups, bridging visual direction with production codebase integration.'
    },
    {
      date:    '2022 — 2024',
      role:    'Frontend Engineer',
      company: 'HyperRoute Technologies',
      desc:    'Developed highly responsive dashboard user interfaces. Coordinated engineering teams to compile Figma tokens into clean, performant React configurations.'
    }
  ]
};

const txt = (text) => document.createTextNode(text);

const el = (tag, classes = [], attrs = {}) => {
  const node = document.createElement(tag);
  if (classes.length) node.className = classes.join(' ');
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

const fillPlaceholders = () => {
  const map = {
    '{{NAME}}':        PORTFOLIO.name,
    '{{INITIALS}}':    PORTFOLIO.initials,
    '{{ROLE}}':        PORTFOLIO.role,
    '{{TAGLINE}}':     PORTFOLIO.tagline,
    '{{AVATAR_URL}}':  PORTFOLIO.avatarUrl,
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

  // Walk text nodes to replace placeholder strings
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

  // Map placeholders in attributes
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

const buildProjects = () => {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  PORTFOLIO.projects.forEach((proj) => {
    const card = el('article', ['project-card'], {
      'aria-label': proj.title
    });

    // Main Shot Visual Link
    const visual = el('div', ['shot-visual']);
    const img = el('img', ['shot-image'], {
      src: proj.image,
      alt: proj.title,
      loading: 'lazy'
    });
    visual.appendChild(img);

    // Hover Overlay
    const overlay = el('div', ['shot-overlay']);
    const oTitle = el('h3', ['shot-overlay-title']);
    oTitle.appendChild(txt(proj.title));
    overlay.appendChild(oTitle);

    const tagsWrap = el('div', ['shot-overlay-tags']);
    proj.tags.forEach((tagText) => {
      const tag = el('span', ['shot-overlay-tag']);
      tag.appendChild(txt(tagText));
      tagsWrap.appendChild(tag);
    });
    overlay.appendChild(tagsWrap);

    const linksWrap = el('div', ['shot-overlay-links']);
    if (proj.demo) {
      const demoBtn = el('a', ['shot-overlay-link'], {
        href: proj.demo,
        target: '_blank',
        rel: 'noopener noreferrer'
      });
      demoBtn.appendChild(txt('View Live'));
      linksWrap.appendChild(demoBtn);
    }
    if (proj.code) {
      const codeBtn = el('a', ['shot-overlay-link'], {
        href: proj.code,
        target: '_blank',
        rel: 'noopener noreferrer'
      });
      codeBtn.appendChild(txt('Source Code'));
      linksWrap.appendChild(codeBtn);
    }
    overlay.appendChild(linksWrap);
    visual.appendChild(overlay);
    card.appendChild(visual);

    // Details/Stats row beneath the visual
    const info = el('div', ['shot-info']);
    
    // Author
    const author = el('div', ['shot-author']);
    const avatar = el('div', ['author-avatar']);
    avatar.appendChild(txt(PORTFOLIO.initials));
    const name = el('span', ['author-name']);
    name.appendChild(txt(PORTFOLIO.name));
    author.appendChild(avatar);
    author.appendChild(name);
    info.appendChild(author);

    // Dynamic stats badges
    const stats = el('div', ['shot-stats']);
    
    // Views
    const viewBadge = el('span', ['stat-badge']);
    viewBadge.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
    viewBadge.appendChild(txt(proj.views));
    stats.appendChild(viewBadge);

    // Likes
    const likeBadge = el('span', ['stat-badge', 'likes']);
    likeBadge.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    likeBadge.appendChild(txt(proj.likes.toString()));
    stats.appendChild(likeBadge);

    info.appendChild(stats);
    card.appendChild(info);

    grid.appendChild(card);
  });
};

const buildSkills = () => {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;

  PORTFOLIO.skillCategories.forEach((cat) => {
    const card = el('div', ['skill-card']);
    const title = el('h3', ['skill-card-title']);
    title.appendChild(txt(cat.title));
    card.appendChild(title);

    const items = el('div', ['skill-items']);
    cat.skills.forEach((skill) => {
      const wrap = el('div', ['skill-progress-wrap']);
      
      const info = el('div', ['skill-info']);
      const name = el('span');
      name.appendChild(txt(skill.name));
      const pct = el('span');
      pct.appendChild(txt(skill.pct + '%'));
      info.appendChild(name);
      info.appendChild(pct);
      wrap.appendChild(info);

      const barBg = el('div', ['skill-progress-bar']);
      const fill = el('div', ['skill-progress-fill'], {
        'data-pct': String(skill.pct),
        role: 'progressbar',
        'aria-valuenow': String(skill.pct),
        'aria-valuemin': '0',
        'aria-valuemax': '100',
        'aria-label': skill.name + ' skill level'
      });
      barBg.appendChild(fill);
      wrap.appendChild(barBg);
      items.appendChild(wrap);
    });

    card.appendChild(items);
    grid.appendChild(card);
  });
};

const initSkillObserver = () => {
  const fills = document.querySelectorAll('.skill-progress-fill');
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
    { threshold: 0.1 }
  );

  fills.forEach((f) => observer.observe(f));
};

const buildExperience = () => {
  const container = document.getElementById('timeline');
  if (!container) return;

  PORTFOLIO.experience.forEach((exp) => {
    const item = el('div', ['timeline-item']);

    const date = el('div', ['timeline-date']);
    date.appendChild(txt(exp.date));
    item.appendChild(date);

    const role = el('h3', ['timeline-role']);
    role.appendChild(txt(exp.role));
    item.appendChild(role);

    const company = el('div', ['timeline-company']);
    company.appendChild(txt(exp.company));
    item.appendChild(company);

    const desc = el('p', ['timeline-desc']);
    desc.appendChild(txt(exp.desc));
    item.appendChild(desc);

    container.appendChild(item);
  });
};

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

const initThemeMatch = () => {
  // Syncs initial site color scheme with OS preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
};

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

const setFooterYear = () => {
  const elYear = document.getElementById('year');
  if (elYear) elYear.textContent = new Date().getFullYear();
};

const initScrollReveal = () => {
  const targets = document.querySelectorAll('.about-card, .skill-card, .project-card, .timeline-item');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach((target) => {
    target.classList.add('reveal-on-scroll');
    observer.observe(target);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  fillPlaceholders();
  buildProjects();
  buildSkills();
  buildExperience();
  setFooterYear();

  initSkillObserver();
  initScrollReveal();
  initMobileNav();
  initThemeMatch();
  initScrollTop();
});
