import React, { useEffect, useRef } from 'react';
import {
  DEFAULT_DESIGN,
  getDensity,
  getFontPair,
  getWidth,
} from './portfolioDocument';

/* ─────────────────────────────── small helpers ─────────────────────────────── */

function hexToRgb(hex) {
  const value = String(hex || '').replace('#', '');
  const full = value.length === 3 ? value.split('').map((char) => char + char).join('') : value;
  const int = Number.parseInt(full.slice(0, 6) || '0', 16);
  if (Number.isNaN(int)) return { r: 17, g: 24, b: 39 };
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

function alpha(hex, opacity) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function contrastText(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#0b0b0c' : '#ffffff';
}

function initials(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function hrefFor(value, email) {
  const raw = String(value || '').trim();
  if (!raw) return email ? `mailto:${email}` : '';
  if (/^(https?:|mailto:|tel:|#)/i.test(raw)) return raw;
  return `https://${raw}`;
}

function readEditable(element) {
  if (!element) return '';
  const text = typeof element.innerText === 'string' ? element.innerText : element.textContent || '';
  return text.replace(/\u00a0/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

const SOCIAL_META = {
  github: { label: 'GitHub', short: 'GH' },
  linkedin: { label: 'LinkedIn', short: 'IN' },
  twitter: { label: 'X / Twitter', short: 'X' },
  website: { label: 'Website', short: 'WWW' },
};

/* ─────────────────────────────── inline editing ────────────────────────────── */

/**
 * Editable text node. Rendered as a plain element everywhere except inside the
 * Studio canvas, where it becomes a contenteditable bound to a document path.
 */
function Editable({ path, value = '', as: Tag = 'span', editable, onEdit, multiline = false, className = '', style }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!editable) return;
    const element = ref.current;
    if (!element) return;
    if (document.activeElement === element) return;
    if (element.textContent !== value) element.textContent = value;
  }, [value, editable]);

  if (!editable) {
    return (
      <Tag className={className} style={style}>
        {value}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={`pf-editable ${className}`.trim()}
      style={style}
      data-pf-path={path}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      spellCheck
      onPaste={(event) => {
        event.preventDefault();
        const text = event.clipboardData?.getData('text/plain') || '';
        const clean = multiline ? text : text.replace(/\s*\n+\s*/g, ' ');
        if (typeof document.execCommand === 'function') document.execCommand('insertText', false, clean);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !multiline) {
          event.preventDefault();
          event.currentTarget.blur();
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          event.currentTarget.textContent = value;
          event.currentTarget.blur();
        }
      }}
      onBlur={(event) => onEdit?.(path, readEditable(event.currentTarget))}
    >
      {value}
    </Tag>
  );
}

/* ───────────────────────────────── section gates ───────────────────────────── */

function sectionHasContent(type, doc) {
  switch (type) {
    case 'hero':
      return Boolean(doc.personal.name || doc.personal.title || doc.personal.tagline);
    case 'about':
      return Boolean(doc.personal.bio);
    case 'stats':
      return (doc.stats || []).some((stat) => stat.label || stat.value);
    case 'projects':
      return (doc.projects || []).length > 0;
    case 'skills':
      return (doc.skills || []).length > 0;
    case 'experience':
      return (doc.experience || []).length > 0;
    case 'education':
      return (doc.education || []).length > 0;
    case 'testimonials':
      return (doc.testimonials || []).length > 0;
    case 'contact':
      return Boolean(doc.contact.email || doc.personal.email || doc.contact.message || doc.contact.showForm);
    case 'socials':
      return Object.keys(SOCIAL_META).some((key) => doc.socials?.[key]);
    case 'custom':
      return true;
    default:
      return false;
  }
}

const NAV_TYPES = new Set([
  'about',
  'stats',
  'projects',
  'skills',
  'experience',
  'education',
  'testimonials',
  'contact',
]);

/* ─────────────────────────────────── sections ──────────────────────────────── */

export default function StudioSite({ doc, editable = false, onEdit }) {
  const design = { ...DEFAULT_DESIGN, ...(doc?.pf?.design || {}) };
  const font = getFontPair(design.font);
  const width = getWidth(design.width);
  const density = getDensity(design.density);
  const onAccent = contrastText(design.accent);

  const sections = (doc?.pf?.sections || []).filter(
    (section) => section.visible && (editable || sectionHasContent(section.type, doc)),
  );

  const customById = new Map((doc?.custom || []).map((entry) => [entry.id, entry]));
  const navSections = sections.filter((section) => NAV_TYPES.has(section.type));
  const email = doc?.contact?.email || doc?.personal?.email || '';
  const location = doc?.contact?.location || doc?.personal?.location || '';

  const style = {
    '--pf-bg': design.background,
    '--pf-surface': design.surface,
    '--pf-text': design.text,
    '--pf-muted': design.muted,
    '--pf-accent': design.accent,
    '--pf-on-accent': onAccent,
    '--pf-line': alpha(design.text, 0.12),
    '--pf-line-strong': alpha(design.text, 0.22),
    '--pf-soft': alpha(design.accent, 0.12),
    '--pf-radius': `${Math.max(0, Math.min(40, Number(design.radius) || 0))}px`,
    '--pf-max': `${width.max}px`,
    '--pf-gutter': `${Math.round(24 * density.scale)}px`,
    '--pf-block': `${Math.round(76 * density.scale)}px`,
    '--pf-display': font.display,
    '--pf-body': font.body,
    '--pf-mono': font.mono,
    '--pf-cols': String(design.projectColumns || 2),
  };

  const edit = editable ? onEdit : undefined;

  const renderSection = (section) => {
    switch (section.type) {
      case 'hero':
        return <Hero key={section.id} doc={doc} design={design} editable={editable} onEdit={edit} email={email} />;

      case 'about':
        return (
          <section key={section.id} id={section.id} data-pf-section={section.id} className="pf-block">
            <div className="pf-shell">
              <SectionHead eyebrow="About" title="The short version" accent={design.accent} />
              <div className="pf-prose">
                {editable ? (
                  <Editable
                    as="p"
                    path="personal.bio"
                    value={
                      doc.personal.bio ||
                      'Tell your story — what you build, who you build it for, and what changed because of it.'
                    }
                    editable
                    multiline
                    onEdit={edit}
                    className={doc.personal.bio ? '' : 'pf-placeholder'}
                  />
                ) : (doc.personal.bio || '').split(/\n{2,}/).filter(Boolean).length > 0 ? (
                  (doc.personal.bio || '')
                    .split(/\n{2,}/)
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                ) : (
                  <p className="pf-muted">Add an about section in the Studio.</p>
                )}
              </div>
              <div className="pf-about-facts">
                {location && (
                  <div>
                    <span className="pf-fact-label">Based in</span>
                    <span className="pf-fact-value">{location}</span>
                  </div>
                )}
                {email && (
                  <div>
                    <span className="pf-fact-label">Email</span>
                    <a className="pf-fact-value" href={`mailto:${email}`}>
                      {email}
                    </a>
                  </div>
                )}
                {(doc.skills || []).length > 0 && (
                  <div>
                    <span className="pf-fact-label">Focus</span>
                    <span className="pf-fact-value">
                      {[...new Set(doc.skills.map((skill) => skill.category).filter(Boolean))].slice(0, 3).join(' · ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'stats':
        return (
          <section key={section.id} id={section.id} data-pf-section={section.id} className="pf-block pf-block-tight">
            <div className="pf-shell">
              <div className="pf-stats">
                {(doc.stats || []).map((stat, index) => (
                  <div className="pf-stat" key={stat.id || index}>
                    <div className="pf-stat-value">
                      <Editable path={`stats.${index}.value`} value={stat.value} editable={editable} onEdit={edit} />
                      <Editable path={`stats.${index}.suffix`} value={stat.suffix} editable={editable} onEdit={edit} />
                    </div>
                    <Editable
                      className="pf-stat-label"
                      path={`stats.${index}.label`}
                      value={stat.label}
                      editable={editable}
                      onEdit={edit}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'projects':
        return (
          <section key={section.id} id={section.id} data-pf-section={section.id} className="pf-block">
            <div className="pf-shell">
              <SectionHead eyebrow="Selected work" title="Projects" accent={design.accent} />
              <div className="pf-projects">
                {(doc.projects || []).map((project, index) => (
                  <article className="pf-project" key={project.id || index}>
                    {project.image ? (
                      <img className="pf-project-media" src={project.image} alt="" loading="lazy" />
                    ) : (
                      <div className="pf-project-media pf-project-placeholder" aria-hidden="true">
                        <span>{initials(project.title)}</span>
                      </div>
                    )}
                    <div className="pf-project-body">
                      {project.featured && <span className="pf-pill">Featured</span>}
                      <Editable
                        as="h3"
                        className="pf-project-title"
                        path={`projects.${index}.title`}
                        value={project.title}
                        editable={editable}
                        onEdit={edit}
                      />
                      <Editable
                        as="p"
                        className="pf-project-desc"
                        path={`projects.${index}.description`}
                        value={project.description}
                        editable={editable}
                        multiline
                        onEdit={edit}
                      />
                      {(project.techStack || []).length > 0 && (
                        <div className="pf-tags">
                          {project.techStack.map((tag, tagIndex) => (
                            <span className="pf-tag" key={`${tag}-${tagIndex}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="pf-project-links">
                        {project.liveUrl && (
                          <a href={hrefFor(project.liveUrl)} target="_blank" rel="noreferrer">
                            Live site <span aria-hidden="true">↗</span>
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={hrefFor(project.githubUrl)} target="_blank" rel="noreferrer">
                            Code <span aria-hidden="true">↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );

      case 'skills': {
        const grouped = new Map();
        for (const skill of doc.skills || []) {
          const key = skill.category || 'Core';
          if (!grouped.has(key)) grouped.set(key, []);
          grouped.get(key).push(skill);
        }
        return (
          <section key={section.id} id={section.id} data-pf-section={section.id} className="pf-block">
            <div className="pf-shell">
              <SectionHead eyebrow="Toolkit" title="Skills" accent={design.accent} />
              <div className="pf-skill-groups">
                {[...grouped.entries()].map(([category, skills]) => (
                  <div className="pf-skill-group" key={category}>
                    <h3 className="pf-skill-category">{category}</h3>
                    <div className="pf-skill-list">
                      {skills.map((skill) => {
                        const index = doc.skills.indexOf(skill);
                        return (
                          <div className="pf-skill" key={skill.id || skill.name}>
                            <div className="pf-skill-head">
                              <Editable
                                path={`skills.${index}.name`}
                                value={skill.name}
                                editable={editable}
                                onEdit={edit}
                              />
                              <span className="pf-skill-level">{Math.round(skill.level)}%</span>
                            </div>
                            <div className="pf-skill-track">
                              <span style={{ width: `${Math.max(4, Math.min(100, skill.level))}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      case 'experience':
        return (
          <section key={section.id} id={section.id} data-pf-section={section.id} className="pf-block">
            <div className="pf-shell">
              <SectionHead eyebrow="Track record" title="Experience" accent={design.accent} />
              <div className="pf-timeline">
                {(doc.experience || []).map((role, index) => (
                  <article className="pf-role" key={role.id || index}>
                    <div className="pf-role-period">
                      <Editable
                        path={`experience.${index}.start`}
                        value={role.start}
                        editable={editable}
                        onEdit={edit}
                      />
                      <span aria-hidden="true">–</span>
                      <Editable path={`experience.${index}.end`} value={role.end} editable={editable} onEdit={edit} />
                    </div>
                    <div className="pf-role-body">
                      <Editable
                        as="h3"
                        className="pf-role-title"
                        path={`experience.${index}.role`}
                        value={role.role}
                        editable={editable}
                        onEdit={edit}
                      />
                      <div className="pf-role-company">
                        <Editable
                          path={`experience.${index}.company`}
                          value={role.company}
                          editable={editable}
                          onEdit={edit}
                        />
                        {role.location && <span className="pf-muted"> · {role.location}</span>}
                      </div>
                      {(role.bullets || []).length > 0 && (
                        <ul className="pf-bullets">
                          {role.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );

      case 'education':
        return (
          <section key={section.id} id={section.id} data-pf-section={section.id} className="pf-block">
            <div className="pf-shell">
              <SectionHead eyebrow="Foundations" title="Education" accent={design.accent} />
              <div className="pf-edu-grid">
                {(doc.education || []).map((entry, index) => (
                  <article className="pf-edu" key={entry.id || index}>
                    <div className="pf-edu-year">
                      <Editable path={`education.${index}.year`} value={entry.year} editable={editable} onEdit={edit} />
                    </div>
                    <Editable
                      as="h3"
                      className="pf-edu-degree"
                      path={`education.${index}.degree`}
                      value={entry.degree}
                      editable={editable}
                      onEdit={edit}
                    />
                    <Editable
                      className="pf-edu-school"
                      path={`education.${index}.school`}
                      value={entry.school}
                      editable={editable}
                      onEdit={edit}
                    />
                    {entry.description && <p className="pf-muted">{entry.description}</p>}
                  </article>
                ))}
              </div>
            </div>
          </section>
        );

      case 'testimonials':
        return (
          <section key={section.id} id={section.id} data-pf-section={section.id} className="pf-block">
            <div className="pf-shell">
              <SectionHead eyebrow="Kind words" title="Testimonials" accent={design.accent} />
              <div className="pf-quotes">
                {(doc.testimonials || []).map((quote, index) => (
                  <figure className="pf-quote" key={quote.id || index}>
                    <blockquote>
                      <Editable
                        path={`testimonials.${index}.content`}
                        value={quote.content}
                        editable={editable}
                        multiline
                        onEdit={edit}
                      />
                    </blockquote>
                    <figcaption>
                      <span className="pf-avatar" aria-hidden="true">
                        {initials(quote.author)}
                      </span>
                      <span>
                        <Editable
                          className="pf-quote-author"
                          path={`testimonials.${index}.author`}
                          value={quote.author}
                          editable={editable}
                          onEdit={edit}
                        />
                        <Editable
                          className="pf-quote-role"
                          path={`testimonials.${index}.role`}
                          value={quote.role}
                          editable={editable}
                          onEdit={edit}
                        />
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key={section.id} id={section.id} data-pf-section={section.id} className="pf-block">
            <div className="pf-shell">
              <div className="pf-contact">
                <div>
                  <SectionHead eyebrow="Contact" title="Let's build something" accent={design.accent} />
                  <Editable
                    as="p"
                    className="pf-contact-message"
                    path="contact.message"
                    value={doc.contact.message || 'The fastest way to reach me is email.'}
                    editable={editable}
                    multiline
                    onEdit={edit}
                  />
                  <div className="pf-contact-links">
                    {email && (
                      <a className="pf-button" href={`mailto:${email}`}>
                        {email}
                      </a>
                    )}
                    {location && <span className="pf-muted">{location}</span>}
                  </div>
                </div>
                {doc.contact.showForm && (
                  <form
                    className="pf-form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const data = new FormData(event.currentTarget);
                      const subject = encodeURIComponent(`Hello from ${data.get('name') || 'your portfolio'}`);
                      const body = encodeURIComponent(String(data.get('message') || ''));
                      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                    }}
                  >
                    <label>
                      <span>Name</span>
                      <input name="name" type="text" placeholder="Ada Lovelace" required />
                    </label>
                    <label>
                      <span>Email</span>
                      <input name="email" type="email" placeholder="ada@example.com" required />
                    </label>
                    <label>
                      <span>Message</span>
                      <textarea name="message" rows={3} placeholder="What are you working on?" required />
                    </label>
                    <button type="submit" className="pf-button">
                      Send message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        );

      case 'socials':
        return (
          <section key={section.id} id={section.id} data-pf-section={section.id} className="pf-block pf-block-tight">
            <div className="pf-shell pf-socials">
              {Object.entries(SOCIAL_META).map(([key, meta]) =>
                doc.socials?.[key] ? (
                  <a key={key} href={hrefFor(doc.socials[key], email)} target="_blank" rel="noreferrer">
                    <span className="pf-social-mark">{meta.short}</span>
                    {meta.label}
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : null,
              )}
            </div>
          </section>
        );

      case 'custom': {
        const custom = customById.get(section.customId);
        if (!custom) return null;
        return (
          <section key={section.id} id={section.id} data-pf-section={section.id} className="pf-block">
            <div className="pf-shell">
              <SectionHead eyebrow="More" title={custom.title || 'More'} accent={design.accent} />
              {custom.description && <p className="pf-muted">{custom.description}</p>}
              <div className="pf-custom-list">
                {(custom.items || []).map((item, index) => (
                  <article className="pf-custom-item" key={item.id || index}>
                    <div className="pf-custom-head">
                      <h3>{item.title}</h3>
                      {item.meta && <span className="pf-muted">{item.meta}</span>}
                    </div>
                    {item.description && <p>{item.description}</p>}
                    {item.url && (
                      <a href={hrefFor(item.url)} target="_blank" rel="noreferrer">
                        Open <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="pf-site" style={style}>
      <style>{SITE_CSS}</style>

      {design.showNav && sections.length > 1 && (
        <header className="pf-nav">
          <div className="pf-shell pf-nav-inner">
            <a className="pf-brand" href="#hero">
              <span className="pf-brand-mark">{initials(doc.personal.name) || 'ME'}</span>
              <span className="pf-brand-name">{doc.personal.name || 'Portfolio'}</span>
            </a>
            <nav className="pf-nav-links" aria-label="Sections">
              {navSections.map((section) => (
                <a key={section.id} href={`#${section.id}`}>
                  {section.type === 'contact' ? 'Contact' : section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                </a>
              ))}
            </nav>
            {email && (
              <a className="pf-nav-cta" href={`mailto:${email}`}>
                Get in touch
              </a>
            )}
          </div>
        </header>
      )}

      <main>{sections.map(renderSection)}</main>

      <footer className="pf-footer">
        <div className="pf-shell pf-footer-inner">
          <span>
            © {new Date().getFullYear()} {doc.personal.name || 'Portfolio'}
          </span>
          <span className="pf-footer-note">Built with CareerPilot</span>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({ eyebrow, title, accent }) {
  return (
    <div className="pf-section-head">
      <span className="pf-eyebrow" style={{ color: accent }}>
        {eyebrow}
      </span>
      <h2 className="pf-section-title">{title}</h2>
    </div>
  );
}

function Hero({ doc, design, editable, onEdit, email }) {
  const name = doc.personal.name || 'Your Name';
  const role = doc.personal.title || 'Your role';
  const primaryHref = hrefFor(doc.hero.primaryHref, email) || '#projects';
  const secondaryHref = hrefFor(doc.hero.secondaryHref || email, email);
  const socials = Object.entries(SOCIAL_META).filter(([key]) => doc.socials?.[key]);

  return (
    <section id="hero" data-pf-section="hero" className="pf-hero">
      <div className={`pf-shell pf-hero-grid${design.heroLayout === 'centered' ? ' is-centered' : ''}`}>
        <div className="pf-hero-copy">
          {doc.hero.availability && (
            <span className="pf-available">
              <span className="pf-dot" aria-hidden="true" />
              <Editable path="hero.availability" value={doc.hero.availability} editable={editable} onEdit={onEdit} />
            </span>
          )}
          <Editable as="h1" className="pf-name" path="personal.name" value={name} editable={editable} onEdit={onEdit} />
          <Editable
            as="p"
            className="pf-hero-role"
            path="personal.title"
            value={role}
            editable={editable}
            onEdit={onEdit}
          />
          <Editable
            as="p"
            className="pf-tagline"
            path={doc.hero.subheadline ? 'hero.subheadline' : 'personal.tagline'}
            value={doc.hero.subheadline || doc.personal.tagline}
            editable={editable}
            multiline
            onEdit={onEdit}
          />

          <div className="pf-hero-actions">
            {doc.hero.primaryLabel && (
              <a className="pf-button pf-button-lg" href={primaryHref}>
                {doc.hero.primaryLabel}
              </a>
            )}
            {doc.hero.secondaryLabel && (
              <a className="pf-button-ghost" href={secondaryHref}>
                {doc.hero.secondaryLabel}
              </a>
            )}
          </div>

          {socials.length > 0 && (
            <div className="pf-hero-socials">
              {socials.map(([key, meta]) => (
                <a key={key} href={hrefFor(doc.socials[key], email)} target="_blank" rel="noreferrer">
                  {meta.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {design.heroLayout !== 'centered' && (
          <div className="pf-portrait-wrap">
            <div className="pf-portrait-glow" aria-hidden="true" />
            {doc.personal.avatar ? (
              <img className="pf-portrait" src={doc.personal.avatar} alt={name} />
            ) : (
              <div className="pf-portrait pf-portrait-mono" aria-hidden="true">
                <span>{initials(name) || 'ME'}</span>
              </div>
            )}
            {(doc.stats || []).length > 0 && (
              <div className="pf-portrait-card">
                <span className="pf-portrait-value">
                  {doc.stats[0].value}
                  {doc.stats[0].suffix}
                </span>
                <span className="pf-portrait-label">{doc.stats[0].label}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────────────── site styles ─────────────────────────────── */

const SITE_CSS = `
.pf-site {
  --pf-font-display: var(--pf-display, 'Inter', system-ui, sans-serif);
  min-height: 100vh;
  background:
    radial-gradient(1100px 520px at 82% -8%, var(--pf-soft), transparent 62%),
    radial-gradient(720px 420px at 4% 4%, rgba(255,255,255,0.045), transparent 60%),
    var(--pf-bg);
  color: var(--pf-text);
  font-family: var(--pf-body);
  font-size: 16px;
  line-height: 1.65;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
.pf-site *, .pf-site *::before, .pf-site *::after { box-sizing: border-box; }
.pf-site h1, .pf-site h2, .pf-site h3, .pf-site p, .pf-site ul, .pf-site figure, .pf-site blockquote { margin: 0; }
.pf-site a { color: inherit; text-decoration: none; }
.pf-site img { max-width: 100%; display: block; }
.pf-site button, .pf-site input, .pf-site textarea { font: inherit; color: inherit; }

.pf-shell { width: 100%; max-width: var(--pf-max); margin: 0 auto; padding: 0 var(--pf-gutter); }
.pf-block { padding: var(--pf-block) 0; }
.pf-block-tight { padding-bottom: calc(var(--pf-block) * 0.55); }
.pf-muted { color: var(--pf-muted); }

/* nav */
.pf-nav {
  position: sticky; top: 0; z-index: 30;
  backdrop-filter: blur(18px) saturate(140%);
  background: var(--pf-bg);
  background: color-mix(in srgb, var(--pf-bg) 82%, transparent);
  border-bottom: 1px solid var(--pf-line);
}
.pf-nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 22px; height: 66px; }
.pf-brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; letter-spacing: -0.01em; }
.pf-brand-mark {
  display: grid; place-items: center; width: 32px; height: 32px; border-radius: 10px;
  background: var(--pf-accent); color: var(--pf-on-accent); font-size: 12px; font-weight: 800;
  font-family: var(--pf-mono); letter-spacing: 0.02em;
}
.pf-brand-name { font-size: 0.95rem; white-space: nowrap; }
.pf-nav-links { display: flex; align-items: center; gap: 22px; font-size: 0.83rem; color: var(--pf-muted); }
.pf-nav-links a:hover { color: var(--pf-text); }
.pf-nav-cta {
  padding: 8px 16px; border-radius: 999px; border: 1px solid var(--pf-line-strong);
  font-size: 0.82rem; font-weight: 600; white-space: nowrap; transition: border-color .18s ease, background .18s ease;
}
.pf-nav-cta:hover { border-color: var(--pf-accent); background: var(--pf-soft); }

/* hero */
.pf-hero { padding: calc(var(--pf-block) * 1.15) 0 calc(var(--pf-block) * 0.9); }
.pf-hero-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.85fr); gap: clamp(32px, 5vw, 76px); align-items: center; }
.pf-hero-grid.is-centered { grid-template-columns: minmax(0, 1fr); text-align: center; max-width: 860px; }
.pf-hero-grid.is-centered .pf-hero-actions, .pf-hero-grid.is-centered .pf-hero-socials { justify-content: center; }
.pf-hero-grid.is-centered .pf-available { margin-inline: auto; }
.pf-available {
  display: inline-flex; align-items: center; gap: 8px; padding: 6px 13px 6px 10px; margin-bottom: 22px;
  border-radius: 999px; border: 1px solid color-mix(in srgb, var(--pf-accent) 34%, transparent);
  background: var(--pf-soft); color: var(--pf-accent);
  font-size: 0.76rem; font-weight: 650; letter-spacing: 0.01em;
}
.pf-dot { width: 7px; height: 7px; border-radius: 999px; background: var(--pf-accent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--pf-accent) 22%, transparent); }
.pf-name {
  font-family: var(--pf-display); font-size: clamp(2.9rem, 6.4vw, 4.6rem); line-height: 0.98;
  font-weight: 800; letter-spacing: -0.035em; text-wrap: balance;
}
.pf-hero-role {
  margin-top: 16px; font-size: clamp(1.02rem, 1.8vw, 1.28rem); font-weight: 600;
  color: var(--pf-accent); letter-spacing: -0.01em;
}
.pf-tagline {
  margin-top: 18px; max-width: 58ch; font-size: clamp(0.98rem, 1.35vw, 1.08rem);
  color: var(--pf-muted); line-height: 1.7; white-space: pre-wrap;
}
.pf-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
.pf-button, .pf-button-ghost {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 11px 20px; border-radius: 12px; font-size: 0.9rem; font-weight: 650;
  border: 1px solid transparent; cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease;
}
.pf-button { background: var(--pf-accent); color: var(--pf-on-accent); box-shadow: 0 14px 30px -14px color-mix(in srgb, var(--pf-accent) 70%, transparent); }
.pf-button:hover { transform: translateY(-1px); }
.pf-button-ghost { border-color: var(--pf-line-strong); color: var(--pf-text); background: color-mix(in srgb, var(--pf-surface) 60%, transparent); }
.pf-button-ghost:hover { border-color: var(--pf-accent); }
.pf-button-lg { padding: 13px 24px; font-size: 0.95rem; }
.pf-hero-socials { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 26px; font-size: 0.82rem; color: var(--pf-muted); }
.pf-hero-socials a { border-bottom: 1px solid transparent; }
.pf-hero-socials a:hover { color: var(--pf-text); border-color: var(--pf-accent); }

.pf-portrait-wrap { position: relative; justify-self: end; width: min(340px, 100%); }
.pf-portrait-glow {
  position: absolute; inset: -12% -6% -8%; border-radius: 50%;
  background: radial-gradient(circle at 60% 30%, color-mix(in srgb, var(--pf-accent) 40%, transparent), transparent 70%);
  filter: blur(28px); opacity: .65;
}
.pf-portrait {
  position: relative; width: 100%; aspect-ratio: 4 / 5; object-fit: cover;
  border-radius: calc(var(--pf-radius) + 10px); border: 1px solid var(--pf-line-strong);
  background: var(--pf-surface);
}
.pf-portrait-mono { display: grid; place-items: center; font-family: var(--pf-display); }
.pf-portrait-mono span { font-size: clamp(3rem, 7vw, 4.6rem); font-weight: 800; letter-spacing: -0.04em; color: color-mix(in srgb, var(--pf-accent) 82%, var(--pf-text)); }
.pf-portrait-card {
  position: absolute; left: -18px; bottom: 22px; display: flex; flex-direction: column; gap: 2px;
  padding: 12px 16px; border-radius: 14px; border: 1px solid var(--pf-line-strong);
  background: color-mix(in srgb, var(--pf-surface) 92%, transparent); backdrop-filter: blur(10px);
  box-shadow: 0 18px 40px -22px rgba(0,0,0,0.7);
}
.pf-portrait-value { font-family: var(--pf-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -0.03em; }
.pf-portrait-label { font-size: 0.72rem; color: var(--pf-muted); max-width: 16ch; }

/* section headings */
.pf-section-head { display: flex; flex-direction: column; gap: 8px; margin-bottom: 30px; }
.pf-eyebrow { font-family: var(--pf-mono); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
.pf-section-title { font-family: var(--pf-display); font-size: clamp(1.55rem, 3vw, 2.15rem); font-weight: 750; letter-spacing: -0.028em; }
.pf-prose { display: flex; flex-direction: column; gap: 16px; max-width: 68ch; color: var(--pf-muted); font-size: 1.02rem; line-height: 1.78; white-space: pre-wrap; }
.pf-prose p { white-space: pre-wrap; }
.pf-about-facts { display: flex; flex-wrap: wrap; gap: 38px; margin-top: 34px; padding-top: 26px; border-top: 1px solid var(--pf-line); }
.pf-about-facts > div { display: flex; flex-direction: column; gap: 4px; }
.pf-fact-label { font-family: var(--pf-mono); font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--pf-muted); }
.pf-fact-value { font-size: 0.92rem; font-weight: 600; }

/* stats */
.pf-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 18px; }
.pf-stat { padding: 22px; border-radius: var(--pf-radius); border: 1px solid var(--pf-line); background: color-mix(in srgb, var(--pf-surface) 72%, transparent); }
.pf-stat-value { font-family: var(--pf-display); font-size: clamp(1.7rem, 3.2vw, 2.3rem); font-weight: 800; letter-spacing: -0.04em; display: flex; }
.pf-stat-label { display: block; margin-top: 4px; font-size: 0.82rem; color: var(--pf-muted); }

/* projects */
.pf-projects { display: grid; grid-template-columns: repeat(var(--pf-cols), minmax(0, 1fr)); gap: 22px; }
.pf-project {
  display: flex; flex-direction: column; overflow: hidden;
  border-radius: calc(var(--pf-radius) + 4px); border: 1px solid var(--pf-line);
  background: color-mix(in srgb, var(--pf-surface) 78%, transparent);
  transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
}
.pf-project:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--pf-accent) 42%, transparent); box-shadow: 0 24px 50px -30px rgba(0,0,0,0.8); }
.pf-project-media { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-bottom: 1px solid var(--pf-line); }
.pf-project-placeholder {
  display: grid; place-items: center; border-bottom: 1px solid var(--pf-line);
  background:
    radial-gradient(circle at 24% 18%, color-mix(in srgb, var(--pf-accent) 26%, transparent), transparent 62%),
    linear-gradient(140deg, color-mix(in srgb, var(--pf-surface) 96%, var(--pf-accent)), var(--pf-bg));
}
.pf-project-placeholder span { font-family: var(--pf-mono); font-size: 1.6rem; font-weight: 700; color: color-mix(in srgb, var(--pf-text) 72%, transparent); letter-spacing: 0.06em; }
.pf-project-body { display: flex; flex-direction: column; gap: 10px; padding: 22px; flex: 1; }
.pf-pill { align-self: flex-start; padding: 3px 9px; border-radius: 999px; background: var(--pf-soft); color: var(--pf-accent); font-size: 0.66rem; font-weight: 750; letter-spacing: 0.09em; text-transform: uppercase; }
.pf-project-title { font-family: var(--pf-display); font-size: 1.14rem; font-weight: 700; letter-spacing: -0.015em; }
.pf-project-desc { font-size: 0.9rem; line-height: 1.65; color: var(--pf-muted); white-space: pre-wrap; }
.pf-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }
.pf-tag { padding: 3px 9px; border-radius: 7px; border: 1px solid var(--pf-line); font-family: var(--pf-mono); font-size: 0.68rem; color: var(--pf-muted); }
.pf-project-links { display: flex; gap: 16px; margin-top: auto; padding-top: 12px; font-size: 0.82rem; font-weight: 600; color: var(--pf-accent); }
.pf-project-links a:hover { text-decoration: underline; }

/* skills */
.pf-skill-groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 30px; }
.pf-skill-group { padding: 24px; border-radius: var(--pf-radius); border: 1px solid var(--pf-line); background: color-mix(in srgb, var(--pf-surface) 66%, transparent); }
.pf-skill-category { font-family: var(--pf-mono); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--pf-accent); margin-bottom: 16px; }
.pf-skill-list { display: flex; flex-direction: column; gap: 13px; }
.pf-skill-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; font-size: 0.88rem; font-weight: 600; }
.pf-skill-level { font-family: var(--pf-mono); font-size: 0.72rem; color: var(--pf-muted); }
.pf-skill-track { height: 4px; margin-top: 7px; border-radius: 999px; background: var(--pf-line); overflow: hidden; }
.pf-skill-track span { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, color-mix(in srgb, var(--pf-accent) 70%, transparent), var(--pf-accent)); }

/* timeline */
.pf-timeline { display: flex; flex-direction: column; gap: 6px; }
.pf-role { display: grid; grid-template-columns: 170px minmax(0, 1fr); gap: 26px; padding: 26px 0; border-top: 1px solid var(--pf-line); }
.pf-role:first-child { border-top: none; padding-top: 0; }
.pf-role-period { font-family: var(--pf-mono); font-size: 0.78rem; color: var(--pf-muted); display: flex; gap: 6px; }
.pf-role-title { font-family: var(--pf-display); font-size: 1.1rem; font-weight: 700; }
.pf-role-company { margin-top: 3px; font-size: 0.88rem; color: var(--pf-accent); font-weight: 600; }
.pf-bullets { margin-top: 12px; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; font-size: 0.9rem; color: var(--pf-muted); }
.pf-bullets li::marker { color: var(--pf-accent); }

/* education */
.pf-edu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
.pf-edu { padding: 24px; border-radius: var(--pf-radius); border: 1px solid var(--pf-line); background: color-mix(in srgb, var(--pf-surface) 66%, transparent); display: flex; flex-direction: column; gap: 6px; }
.pf-edu-year { font-family: var(--pf-mono); font-size: 0.72rem; letter-spacing: 0.12em; color: var(--pf-accent); }
.pf-edu-degree { font-family: var(--pf-display); font-size: 1.02rem; font-weight: 700; }
.pf-edu-school { font-size: 0.86rem; color: var(--pf-muted); }

/* testimonials */
.pf-quotes { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.pf-quote { padding: 26px; border-radius: var(--pf-radius); border: 1px solid var(--pf-line); background: color-mix(in srgb, var(--pf-surface) 72%, transparent); display: flex; flex-direction: column; gap: 18px; }
.pf-quote blockquote { font-size: 0.96rem; line-height: 1.72; white-space: pre-wrap; }
.pf-quote blockquote::before { content: '“'; display: block; font-family: var(--pf-display); font-size: 2.2rem; line-height: 1; color: var(--pf-accent); margin-bottom: 6px; }
.pf-quote figcaption { display: flex; align-items: center; gap: 12px; }
.pf-avatar { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 999px; background: var(--pf-soft); color: var(--pf-accent); font-family: var(--pf-mono); font-size: 0.72rem; font-weight: 700; }
.pf-quote-author { display: block; font-size: 0.86rem; font-weight: 650; }
.pf-quote-role { display: block; font-size: 0.76rem; color: var(--pf-muted); }

/* contact */
.pf-contact { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr); gap: clamp(28px, 4vw, 60px); padding: clamp(28px, 4vw, 46px); border-radius: calc(var(--pf-radius) + 8px); border: 1px solid var(--pf-line-strong); background: color-mix(in srgb, var(--pf-surface) 82%, transparent); }
.pf-contact .pf-section-head { margin-bottom: 16px; }
.pf-contact-message { color: var(--pf-muted); max-width: 42ch; white-space: pre-wrap; }
.pf-contact-links { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; margin-top: 24px; }
.pf-form { display: flex; flex-direction: column; gap: 12px; }
.pf-form label { display: flex; flex-direction: column; gap: 5px; font-size: 0.76rem; font-weight: 600; color: var(--pf-muted); }
.pf-form input, .pf-form textarea {
  width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--pf-line-strong);
  background: color-mix(in srgb, var(--pf-bg) 70%, transparent); font-size: 0.88rem; resize: vertical;
}
.pf-form input:focus, .pf-form textarea:focus { outline: 2px solid color-mix(in srgb, var(--pf-accent) 45%, transparent); outline-offset: 1px; border-color: var(--pf-accent); }
.pf-form button { margin-top: 4px; }
.pf-socials { display: flex; flex-wrap: wrap; gap: 12px; }
.pf-socials a { display: inline-flex; align-items: center; gap: 9px; padding: 9px 16px; border-radius: 999px; border: 1px solid var(--pf-line-strong); font-size: 0.84rem; font-weight: 600; color: var(--pf-muted); transition: color .18s ease, border-color .18s ease; }
.pf-socials a:hover { color: var(--pf-text); border-color: var(--pf-accent); }
.pf-social-mark { font-family: var(--pf-mono); font-size: 0.68rem; color: var(--pf-accent); }

/* custom */
.pf-custom-list { display: flex; flex-direction: column; gap: 14px; margin-top: 8px; }
.pf-custom-item { padding: 20px 24px; border-radius: var(--pf-radius); border: 1px solid var(--pf-line); background: color-mix(in srgb, var(--pf-surface) 62%, transparent); }
.pf-custom-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; }
.pf-custom-head h3 { font-family: var(--pf-display); font-size: 1rem; font-weight: 700; }
.pf-custom-item p { margin-top: 6px; font-size: 0.9rem; color: var(--pf-muted); }
.pf-custom-item a { display: inline-block; margin-top: 10px; font-size: 0.82rem; font-weight: 650; color: var(--pf-accent); }

/* footer */
.pf-footer { border-top: 1px solid var(--pf-line); padding: 26px 0 34px; }
.pf-footer-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; font-size: 0.78rem; color: var(--pf-muted); }
.pf-footer-note { font-family: var(--pf-mono); font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; }

/* inline editing affordances */
.pf-editable { cursor: text; border-radius: 6px; transition: outline-color .12s ease, background .12s ease; }
.pf-site .pf-editable:hover, .pf-site .pf-editable:focus { outline: 1px dashed color-mix(in srgb, var(--pf-accent) 70%, transparent); outline-offset: 4px; background: color-mix(in srgb, var(--pf-accent) 7%, transparent); }
.pf-site .pf-editable:focus { outline-style: solid; outline-width: 2px; }
.pf-placeholder { color: color-mix(in srgb, var(--pf-muted) 80%, transparent); }

@media (max-width: 900px) {
  .pf-hero-grid { grid-template-columns: minmax(0, 1fr); }
  .pf-portrait-wrap { justify-self: start; width: min(280px, 80%); order: -1; }
  .pf-contact { grid-template-columns: minmax(0, 1fr); }
  .pf-role { grid-template-columns: minmax(0, 1fr); gap: 8px; }
  .pf-nav-links { display: none; }
  .pf-projects { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .pf-site *, .pf-site *::before, .pf-site *::after { transition-duration: 0.001ms !important; animation-duration: 0.001ms !important; }
}
`;

export { Editable as StudioEditable, sectionHasContent };
