/**
 * script.js — Glassmorphism Portfolio Theme
 * Handles: skill chips, nav highlight, contact form,
 *          scroll-to-top, fade-in, mobile nav, footer year.
 */

'use strict';

/* ═══════════════════════════════════════════════════════════
   ░░ SKILLS DATA
   Customise this list — chips are injected into #skills-chips
═══════════════════════════════════════════════════════════ */
const SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Python', 'HTML', 'CSS', 'TailwindCSS', 'Git',
  'REST APIs', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Docker',
];

/* ═══════════════════════════════════════════════════════════
   ░░ SKILL CHIPS INJECTION
═══════════════════════════════════════════════════════════ */
const buildSkillChips = () => {
  const container = document.getElementById('skills-chips');
  if (!container) return;

  SKILLS.forEach((skill) => {
    const chip = document.createElement('span');
    chip.className = 'skill-chip';
    chip.textContent = skill;
    container.appendChild(chip);
  });
};

/* ═══════════════════════════════════════════════════════════
   ░░ ACTIVE NAV LINK ON SCROLL
═══════════════════════════════════════════════════════════ */
const initNavHighlight = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('a[href^="#"]');
  if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      // Find the most intersecting section
      let mostVisible = null;
      let maxRatio = 0;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisible = entry.target;
        }
      });

      if (mostVisible) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + mostVisible.id
          );
        });
      }
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
};

/* ═══════════════════════════════════════════════════════════
   ░░ MOBILE NAV TOGGLE
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
   ░░ CONTACT FORM — CLIENT-SIDE FEEDBACK
═══════════════════════════════════════════════════════════ */
const initContactForm = () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const feedback = document.createElement('p');
  feedback.className = 'contact-form__feedback';
  feedback.setAttribute('aria-live', 'polite');
  form.appendChild(feedback);

  const showFeedback = (message, isError = false) => {
    feedback.textContent = message;
    feedback.classList.toggle('contact-form__feedback--error', isError);
    feedback.classList.add('contact-form__feedback--visible');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn     = form.querySelector('.glass-btn--primary');
    const name    = form.elements['name']?.value.trim();
    const email   = form.elements['email']?.value.trim();
    const message = form.elements['message']?.value.trim();

    if (!name || !email || !message) {
      showFeedback('Please fill in all fields.', true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('Please enter a valid email address.', true);
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';
    feedback.classList.remove('contact-form__feedback--visible');

    try {
      const action = form.getAttribute('action');

      if (!action || action === '#') {
        await new Promise((res) => setTimeout(res, 600));
        showFeedback("Message sent! I'll get back to you soon.");
        form.reset();
      } else {
        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        });
        if (res.ok) {
          showFeedback("Message sent! I'll get back to you soon.");
          form.reset();
        } else {
          showFeedback('Something went wrong. Please try again.', true);
        }
      }
    } catch {
      showFeedback('Could not send message. Please try again.', true);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  });
};

/* ═══════════════════════════════════════════════════════════
   ░░ SCROLL-TO-TOP BUTTON
═══════════════════════════════════════════════════════════ */
const initScrollTop = () => {
  const btn = document.createElement('button');
  btn.className = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '&#8593;';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('scroll-top-btn--visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

/* ═══════════════════════════════════════════════════════════
   ░░ FADE-IN ON SCROLL
═══════════════════════════════════════════════════════════ */
const initFadeIn = () => {
  const targets = document.querySelectorAll('.section, .project-card, .stat-card');
  if (!targets.length || !('IntersectionObserver' in window)) return;

  targets.forEach((el) => el.classList.add('fade-pending'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('fade-pending');
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  targets.forEach((el) => observer.observe(el));
};

/* ═══════════════════════════════════════════════════════════
   ░░ FOOTER YEAR
═══════════════════════════════════════════════════════════ */
const setFooterYear = () => {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
};

/* ═══════════════════════════════════════════════════════════
   ░░ INIT
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  buildSkillChips();
  initNavHighlight();
  initMobileNav();
  initContactForm();
  initScrollTop();
  initFadeIn();
  setFooterYear();
});
