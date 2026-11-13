// Linear Dark Theme — data injection and interactive portfolio layout

"use strict";

/* --------------------------------------------------------------
   Linear Dark Theme script
   Handles portfolio data injection and interactive UI behavior.
-------------------------------------------------------------- */

const PORTFOLIO = {
  name: "Avery Reed",
  initials: "AR",
  role: "Product Designer & Software Engineer",
  tagline:
    "Crafting modern portfolio experiences with sharp dark surfaces, intuitive motion, and clean product hierarchy.",
  email: "hello@example.com",
  githubUrl: "https://github.com/",
  linkedinUrl: "https://linkedin.com/",
  twitterUrl: "https://twitter.com/",

  aboutPara1:
    "I build product-ready portfolios and design systems that support launch-ready experiences. My work balances clarity, speed, and approachable interface structure.",
  aboutPara2:
    "I focus on product details that feel premium without adding visual clutter: responsive flows, strong contrast, and consistent component spacing.",

  stats: [
    { label: "Products shipped", value: "15+" },
    { label: "Design systems", value: "5+" },
    { label: "Years experience", value: "8+" },
  ],

  skillCategories: [
    {
      title: "Design Systems",
      items: ["Figma", "Design tokens", "Accessibility"],
    },
    {
      title: "Frontend",
      items: ["React", "TypeScript", "CSS / Motion"],
    },
    {
      title: "Platform",
      items: ["Vercel", "GitHub Actions", "Serverless"],
    },
  ],

  projects: [
    {
      title: "Launchboard",
      desc: "A product analytics dashboard built for fast stakeholder decisions and launch tracking.",
      status: "shipped",
      shortcut: "⌘ K",
      tags: ["React", "Tailwind", "Product"],
      demo: "https://example.com",
      code: "https://github.com/example",
    },
    {
      title: "Pulse CRM",
      desc: "A modern relationship platform designed to keep product teams aligned and operational metrics visible.",
      status: "building",
      shortcut: "⌘ P",
      tags: ["Next.js", "Node.js", "UX"],
      demo: "https://example.com",
      code: "https://github.com/example",
    },
    {
      title: "Mesh Studio",
      desc: "A lightweight workflow suite for visual collaboration, design reviews, and launch planning.",
      status: "research",
      shortcut: "⌘ R",
      tags: ["Figma", "API", "Motion"],
      demo: "https://example.com",
      code: "https://github.com/example",
    },
  ],

  experience: [
    {
      date: "2023 — Present",
      role: "Senior Product Engineer",
      company: "Modern Labs",
      desc: "Designed and shipped a metrics platform focused on launch velocity and experimental tracking for distributed teams.",
    },
    {
      date: "2020 — 2023",
      role: "Product Designer",
      company: "Launch Collective",
      desc: "Led experience design for premium SaaS products, delivering improved retention with tighter onboarding flows.",
    },
    {
      date: "2017 — 2020",
      role: "Frontend Engineer",
      company: "Bright Studio",
      desc: "Built reusable interface systems and polished motion patterns for enterprise web apps.",
    },
  ],
};

/* Utility helpers for creating DOM nodes and text nodes */
const txt = (text) => document.createTextNode(text);

const el = (tag, classes = [], attrs = {}) => {
  const node = document.createElement(tag);
  if (classes.length) node.className = classes.join(" ");
  Object.entries(attrs).forEach(([key, value]) =>
    node.setAttribute(key, value),
  );
  return node;
};

/* Populate template placeholders with portfolio data */
const fillPlaceholders = () => {
  const map = {
    "{{NAME}}": PORTFOLIO.name,
    "{{INITIALS}}": PORTFOLIO.initials,
    "{{ROLE}}": PORTFOLIO.role,
    "{{TAGLINE}}": PORTFOLIO.tagline,
    "{{EMAIL}}": PORTFOLIO.email,
    "{{GITHUB_URL}}": PORTFOLIO.githubUrl,
    "{{LINKEDIN_URL}}": PORTFOLIO.linkedinUrl,
    "{{TWITTER_URL}}": PORTFOLIO.twitterUrl,
    "{{ABOUT_PARA_1}}": PORTFOLIO.aboutPara1,
    "{{ABOUT_PARA_2}}": PORTFOLIO.aboutPara2,
    "{{STAT_1_VALUE}}": PORTFOLIO.stats[0]?.value || "",
    "{{STAT_1_LABEL}}": PORTFOLIO.stats[0]?.label || "",
    "{{STAT_2_VALUE}}": PORTFOLIO.stats[1]?.value || "",
    "{{STAT_2_LABEL}}": PORTFOLIO.stats[1]?.label || "",
    "{{STAT_3_VALUE}}": PORTFOLIO.stats[2]?.value || "",
    "{{STAT_3_LABEL}}": PORTFOLIO.stats[2]?.label || "",
  };

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    let value = node.nodeValue;
    Object.entries(map).forEach(([placeholder, replacement]) => {
      if (value.includes(placeholder)) {
        value = value.split(placeholder).join(replacement);
      }
    });
    node.nodeValue = value;
  });

  document.querySelectorAll("[href], [aria-label]").forEach((element) => {
    ["href", "aria-label", "title", "alt"].forEach((attr) => {
      const current = element.getAttribute(attr);
      if (!current) return;
      let updated = current;
      Object.entries(map).forEach(([placeholder, replacement]) => {
        updated = updated.split(placeholder).join(replacement);
      });
      if (updated !== current) element.setAttribute(attr, updated);
    });
  });

  if (document.title) {
    let updatedTitle = document.title;
    Object.entries(map).forEach(([placeholder, replacement]) => {
      updatedTitle = updatedTitle.split(placeholder).join(replacement);
    });
    if (updatedTitle !== document.title) document.title = updatedTitle;
  }

  const headPlaceholders = [
    'meta[name="description"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
  ];

  headPlaceholders.forEach((selector) => {
    const element = document.querySelector(selector);
    if (!element) return;
    const current = element.getAttribute("content");
    if (!current) return;
    let updated = current;
    Object.entries(map).forEach(([placeholder, replacement]) => {
      updated = updated.split(placeholder).join(replacement);
    });
    if (updated !== current) element.setAttribute("content", updated);
  });
};

/* Render skills section content */
const buildSkills = () => {
  const grid = document.getElementById("skills-grid");
  if (!grid) return;

  PORTFOLIO.skillCategories.forEach((category) => {
    const card = el("article", ["skill-card"]);
    const title = el("h3");
    title.appendChild(txt(category.title));
    card.appendChild(title);

    const tags = el("div", ["skill-tags"]);
    category.items.forEach((item) => {
      const tag = el("span", ["skill-tag"]);
      tag.appendChild(txt(item));
      tags.appendChild(tag);
    });

    card.appendChild(tags);
    grid.appendChild(card);
  });
};

/* Render project cards in the projects section */
const buildProjects = () => {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  PORTFOLIO.projects.forEach((project) => {
    const card = el("article", ["project-card"]);

    const head = el("div", ["project-head"]);
    const status = el("span", ["project-status", project.status]);
    status.appendChild(
      txt(
        project.status === "shipped"
          ? "Shipped"
          : project.status === "building"
            ? "Building"
            : "Research",
      ),
    );
    const shortcut = el("span", ["shortcut-badge"]);
    shortcut.appendChild(txt(project.shortcut));
    head.appendChild(status);
    head.appendChild(shortcut);

    const title = el("h3", ["project-title"]);
    title.appendChild(txt(project.title));
    const desc = el("p", ["project-desc"]);
    desc.appendChild(txt(project.desc));

    const tags = el("div", ["project-tags"]);
    project.tags.forEach((tagText) => {
      const tag = el("span", ["project-tag"]);
      tag.appendChild(txt(tagText));
      tags.appendChild(tag);
    });

    card.appendChild(head);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(tags);
    grid.appendChild(card);
  });
};

/* Render experience timeline entries */
const buildExperience = () => {
  const container = document.getElementById("timeline");
  if (!container) return;

  PORTFOLIO.experience.forEach((item) => {
    const entry = el("article", ["timeline-item"]);
    const date = el("p", ["timeline-date"]);
    date.appendChild(txt(item.date));
    const role = el("h3");
    role.appendChild(txt(item.role));
    const company = el("p", ["timeline-company"]);
    company.appendChild(txt(item.company));
    const desc = el("p", ["timeline-desc"]);
    desc.appendChild(txt(item.desc));

    entry.appendChild(date);
    entry.appendChild(role);
    entry.appendChild(company);
    entry.appendChild(desc);
    container.appendChild(entry);
  });
};

/* Mobile navigation toggle implementation */
const initNavToggle = () => {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const expanded = links.classList.toggle("active");
    toggle.setAttribute("aria-expanded", String(expanded));
  });
};

/* Scroll-to-top button visibility and click handler */
const initScrollTop = () => {
  const button = document.getElementById("scroll-top");
  if (!button) return;

  window.addEventListener(
    "scroll",
    () => {
      button.classList.toggle("show", window.scrollY > 320);
    },
    { passive: true },
  );

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

/* Update the footer with the current year */
const setFooterYear = () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
};

/* Initialize the page once DOM content is loaded */
window.addEventListener("DOMContentLoaded", () => {
  fillPlaceholders();
  buildSkills();
  buildProjects();
  buildExperience();
  initNavToggle();
  initScrollTop();
  setFooterYear();
});
