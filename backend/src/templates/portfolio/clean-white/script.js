/**
 * script.js — Clean White Portfolio Theme
 * Light interactions only — data is handled by Handlebars server-side.
 */

'use strict';

/* ═══════════════════════════════════════════════════════════
   ░░ ACTIVE NAV HIGHLIGHT ON SCROLL ░░
═══════════════════════════════════════════════════════════ */
const initNavHighlight = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.hero__social-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

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
   ░░ PROJECT CARD — SUBTLE LIFT ON HOVER ░░
   Adds a CSS custom property for mouse position so style.css
   can optionally use a radial highlight effect on cards.
═══════════════════════════════════════════════════════════ */
const initCardHover = () => {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });
};

/* ═══════════════════════════════════════════════════════════
   ░░ CONTACT FORM — CLIENT-SIDE FEEDBACK ░░
   Shows an inline success/error message on submit.
   Wire up to a real backend endpoint by changing action=""
   on the <form> element in index.html.
═══════════════════════════════════════════════════════════ */
const initContactForm = () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  // Create feedback element once
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

    const btn = form.querySelector('.contact-form__submit');
    const name    = form.querySelector('#cf-name')?.value.trim();
    const email   = form.querySelector('#cf-email')?.value.trim();
    const message = form.querySelector('#cf-message')?.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showFeedback('Please fill in all fields.', true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('Please enter a valid email address.', true);
      return;
    }

    // Disable button while submitting
    btn.disabled = true;
    btn.textContent = 'Sending…';
    feedback.classList.remove('contact-form__feedback--visible');

    try {
      const action = form.getAttribute('action');

      // If no real endpoint is configured, simulate success
      if (!action || action === '#') {
        await new Promise((res) => setTimeout(res, 600)); // simulate network
        showFeedback('Message sent! I\'ll get back to you soon.');
        form.reset();
      } else {
        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, message }),
        });

        if (res.ok) {
          showFeedback('Message sent! I\'ll get back to you soon.');
          form.reset();
        } else {
          showFeedback('Something went wrong. Please try again.', true);
        }
      }
    } catch {
      showFeedback('Could not send message. Please try again.', true);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send message';
    }
  });
};

/* ═══════════════════════════════════════════════════════════
   ░░ SCROLL-TO-TOP BUTTON ░░
   Appears after the user scrolls past the hero.
═══════════════════════════════════════════════════════════ */
const initScrollTop = () => {
  const btn = document.createElement('button');
  btn.className = 'scroll-top-btn';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '&#8593;'; // ↑
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('scroll-top-btn--visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
   ░░ FADE-IN ON SCROLL ░░
   Adds a lightweight entrance animation to sections.
═══════════════════════════════════════════════════════════ */
const initFadeIn = () => {
  const targets = document.querySelectorAll('.section, .project-card');
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
   ░░ INIT ░░
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavHighlight();
  initCardHover();
  initContactForm();
  initScrollTop();
  initFadeIn();
  setFooterYear();
});