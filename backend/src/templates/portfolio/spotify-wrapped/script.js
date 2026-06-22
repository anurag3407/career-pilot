'use strict';

/**
 * script.js — Spotify Wrapped Portfolio Theme
 * Controls dynamic compilation, story-style progress bars,
 * intersection-observed stat counting, and the interactive audio player.
 */

// 1. DEFAULT MOCK DATA (used for standalone client-side execution)
const PORTFOLIO_DATA = {
  name: 'Alex Rivera',
  projects_count: 14,
  experience_years: 6,
  skills: [
    'JavaScript (ES6+)',
    'TypeScript',
    'React / Next.js',
    'Node.js / Express',
    'Tailwind CSS',
    'PostgreSQL & Prisma',
    'Docker & K8s',
    'Git & GitHub Actions',
    'REST & GraphQL APIs',
    'AWS Cloud Services'
  ],
  projects: [
    {
      title: 'DevFlow Platform',
      description: 'A developer workflow orchestrator built with Next.js and Go. Speeds up microservice deployment by 40% using automated environment templating.'
    },
    {
      title: 'SoundWave Web Client',
      description: 'Real-time collaborative audio studio in the browser. Uses Web Audio API, WebSockets, and Canvas to sync track editing.'
    },
    {
      title: 'HoloCSS UI Engine',
      description: 'A light-weight design system and component library focusing on high performance, glassmorphism design tokens, and CSS-only utility classes.'
    },
    {
      title: 'SmartAlert Agent',
      description: 'Server monitoring and alert dispatching engine. Integrates with Slack, Discord, and Telegram for real-time notification routing.'
    }
  ],
  email: 'alex.rivera@dev.io',
  github_url: 'https://github.com/alexrivera',
  linkedin_url: 'https://linkedin.com/in/alexrivera',
  twitter_url: 'https://twitter.com/alexriveradev'
};

// 2. CLIENT-SIDE COMPILER FOR STANDALONE RUNS
const compileTemplates = () => {
  let html = document.body.innerHTML;

  // Check if we need to compile (looking for Jinja/Django loops or placeholders)
  if (html.includes('{%') || html.includes('{{')) {
    console.log('Static compiler: Compiling placeholders locally.');

    // Compile Skills Loop
    const skillRegex = /\{%\s*for\s+skill\s+in\s+skills\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g;
    html = html.replace(skillRegex, (match, innerHtml) => {
      return PORTFOLIO_DATA.skills.map(skill => {
        return innerHtml.replace(/\{\{\s*skill\s*\}\}/g, skill);
      }).join('');
    });

    // Compile Projects Loop
    const projectRegex = /\{%\s*for\s+project\s+in\s+projects\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g;
    html = html.replace(projectRegex, (match, innerHtml) => {
      return PORTFOLIO_DATA.projects.map(proj => {
        return innerHtml
          .replace(/\{\{\s*project\.title\s*\}\}/g, proj.title)
          .replace(/\{\{\s*project\.description\s*\}\}/g, proj.description);
      }).join('');
    });

    // Compile Simple Placeholders
    const replacements = {
      'name': PORTFOLIO_DATA.name,
      'projects_count': PORTFOLIO_DATA.projects_count,
      'experience_years': PORTFOLIO_DATA.experience_years,
      'email': PORTFOLIO_DATA.email,
      'github_url': PORTFOLIO_DATA.github_url,
      'linkedin_url': PORTFOLIO_DATA.linkedin_url,
      'twitter_url': PORTFOLIO_DATA.twitter_url
    };

    Object.entries(replacements).forEach(([key, val]) => {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      html = html.replace(regex, val);
    });

    // Write compiled HTML back to the body
    document.body.innerHTML = html;

    // Update document title
    document.title = document.title.replace(/\{\{\s*name\s*\}\}/g, PORTFOLIO_DATA.name);
  }
};

// 3. SCROLL PROGRESS (STORIES MODE)
const initScrollProgress = () => {
  const container = document.querySelector('.scroll-container');
  const cards = document.querySelectorAll('.card');
  const fills = document.querySelectorAll('.progress-bar-fill');

  const updateProgress = () => {
    const scrollTop = container.scrollTop;
    const cardHeight = window.innerHeight;
    
    // Find active card index
    const activeIndex = Math.round(scrollTop / cardHeight);

    fills.forEach((fill, idx) => {
      if (idx < activeIndex) {
        fill.style.width = '100%';
      } else if (idx === activeIndex) {
        // Calculate sub-progress of the active card
        const cardOffset = scrollTop - (idx * cardHeight);
        const ratio = Math.max(0, Math.min(1, cardOffset / cardHeight));
        fill.style.width = `${ratio * 100}%`;
      } else {
        fill.style.width = '0%';
      }
    });
  };

  container.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
  updateProgress();
};

// 4. ANIMATED STAT COUNTERS
const initStatCounters = () => {
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCounter = (el) => {
    // If target has curly braces (not compiled by backend/frontend compiler), skip
    if (el.dataset.target.includes('{')) return;
    
    const target = +el.dataset.target;
    let current = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      current = Math.floor(easeProgress * target);
      
      el.innerText = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerText = target;
      }
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Run counter animation
        animateCounter(el);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => {
    // Set dataset target if it is raw innerText and target isn't set
    if (!num.dataset.target || num.dataset.target.includes('{')) {
      num.dataset.target = num.innerText.trim();
      num.innerText = '0';
    }
    observer.observe(num);
  });
};

// 5. INTERACTIVE LOFI MUSIC PLAYER
const initMusicPlayer = () => {
  const widget = document.getElementById('music-player');
  const toggleBtn = document.getElementById('player-toggle-btn');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const audio = document.getElementById('bg-music');
  const progressFill = document.getElementById('audio-progress');

  if (!widget || !toggleBtn || !playPauseBtn || !audio) return;

  // Toggle player expand/collapse
  toggleBtn.addEventListener('click', (e) => {
    widget.classList.toggle('expanded');
    e.stopPropagation();
  });

  // Collapse player when clicking outside
  document.addEventListener('click', (e) => {
    if (!widget.contains(e.target)) {
      widget.classList.remove('expanded');
    }
  });

  // Play / Pause toggle
  const togglePlay = () => {
    if (audio.paused) {
      audio.play().then(() => {
        widget.classList.add('playing');
        playPauseBtn.innerText = '⏸';
      }).catch(err => {
        console.warn('Audio playback failed (usually due to autoplay restrictions):', err);
      });
    } else {
      audio.pause();
      widget.classList.remove('playing');
      playPauseBtn.innerText = '▶';
    }
  };

  playPauseBtn.addEventListener('click', togglePlay);

  // Update playback progress
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const percentage = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${percentage}%`;
    }
  });

  // Handle clicking on progress bar to seek
  const progressBar = document.querySelector('.player-progress');
  progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    audio.currentTime = percentage * audio.duration;
  });
};

// 6. DOWNLOAD SUMMARY CARD
const initDownloadCard = () => {
  const downloadBtn = document.getElementById('download-card-btn');
  if (!downloadBtn) return;

  downloadBtn.addEventListener('click', () => {
    // Create a visual indicator that card is downloading
    downloadBtn.innerText = '⏳ Saving...';
    downloadBtn.style.opacity = '0.7';

    setTimeout(() => {
      // Simulate file download
      const name = document.querySelector('.summary-meta h3')?.innerText || 'Developer';
      const stats = `--- ${name}'s DEVELOPER WRAPPED ---\n` +
                    `Projects Built: ${PORTFOLIO_DATA.projects_count}\n` +
                    `Experience: ${PORTFOLIO_DATA.experience_years} Years\n` +
                    `Top Skill: ${PORTFOLIO_DATA.skills[0] || 'Web Development'}\n` +
                    `----------------------------------`;
      
      const blob = new Blob([stats], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name.replace(/\s+/g, '_')}_Wrapped_Card.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Restore button state
      downloadBtn.innerText = '✅ Saved!';
      downloadBtn.style.opacity = '1';
      
      setTimeout(() => {
        downloadBtn.innerText = '📥 Save Card';
      }, 2000);
    }, 1200);
  });
};

// ON DOM LOADED
document.addEventListener('DOMContentLoaded', () => {
  compileTemplates();
  initScrollProgress();
  initStatCounters();
  initMusicPlayer();
  initDownloadCard();
});
