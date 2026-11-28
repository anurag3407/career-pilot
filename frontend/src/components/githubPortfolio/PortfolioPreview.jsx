import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  MapPin,
  Briefcase,
  Star,
  GitFork,
  ExternalLink,
  Code2,
  Plus,
  Trash2,
  X,
  ArrowLeft,
  ArrowRight,
  Wrench,
  Layers,
  Link as LinkIcon,
} from 'lucide-react';
import ResizableBox, {
  SECTION_WIDTH_STEPS,
  snapColSpan,
  snapSectionWidth,
  snapStep,
} from '../portfolio/studio/ResizableBox';

const SECTION_MAX_WIDTH_PX = {
  narrow: '672px',
  regular: '896px',
  wide: '1024px',
  full: '100%',
};

function readEditableText(element) {
  if (!element) return '';
  const text = typeof element.innerText === 'string' ? element.innerText : element.textContent || '';
  return text.replace(/\u00a0/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

function InlineText({
  value = '',
  placeholder = 'Click to edit…',
  editable = false,
  multiline = false,
  as: Tag = 'span',
  className = '',
  onCommit,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!editable) return;
    const el = ref.current;
    if (!el || document.activeElement === el) return;
    if (el.textContent !== value) el.textContent = value;
  }, [value, editable]);

  if (!editable) {
    if (!value) return null;
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      spellCheck
      data-placeholder={placeholder}
      className={`cursor-text rounded px-1 -mx-1 transition outline-none hover:ring-1 hover:ring-dashed hover:ring-primary/60 focus:ring-2 focus:ring-primary focus:bg-primary/5 empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/60 ${className}`}
      onClick={(e) => e.stopPropagation()}
      onPaste={(e) => {
        e.preventDefault();
        const text = e.clipboardData?.getData('text/plain') || '';
        const clean = multiline ? text : text.replace(/\s*\n+\s*/g, ' ');
        if (typeof document.execCommand === 'function') document.execCommand('insertText', false, clean);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !multiline) {
          e.preventDefault();
          e.currentTarget.blur();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          e.currentTarget.textContent = value;
          e.currentTarget.blur();
        }
      }}
      onBlur={(e) => {
        const next = readEditableText(e.currentTarget);
        if (next !== value) onCommit?.(next);
      }}
    >
      {value}
    </Tag>
  );
}

function SectionContainer({
  sectionKey,
  label,
  layout,
  editable,
  onPatchSectionLayout,
  children,
}) {
  const secLayout = layout?.sections?.[sectionKey] || {};
  const maxWidthId = secLayout.maxWidth || 'full';
  const paddingY = secLayout.paddingY || null;
  const maxWidthStyle = SECTION_MAX_WIDTH_PX[maxWidthId] || '100%';
  const widthLabel = SECTION_WIDTH_STEPS.find((w) => w.id === maxWidthId)?.label || 'Full';
  const sizeLabel = [
    maxWidthId !== 'full' ? widthLabel : null,
    paddingY ? `${paddingY}px pad` : null,
  ]
    .filter(Boolean)
    .join(' · ') || 'Full width';

  return (
    <div className="mx-auto w-full transition-[max-width] duration-150" style={{ maxWidth: maxWidthStyle }}>
      <ResizableBox
        enabled={editable}
        variant="section"
        label={label}
        sizeLabel={sizeLabel}
        accentColor="#10b981"
        isCustomized={Boolean(maxWidthId !== 'full' || paddingY)}
        onResizeX={(dx, rect) => {
          const nextW = snapSectionWidth(rect.width, dx);
          onPatchSectionLayout(sectionKey, { maxWidth: nextW }, `resize:gh:sec:${sectionKey}:w`);
        }}
        onResizeY={(dy, rect) => {
          const base = paddingY || 24;
          const nextPad = snapStep(base + dy / 2, 8, 12, 88);
          onPatchSectionLayout(sectionKey, { paddingY: nextPad }, `resize:gh:sec:${sectionKey}:h`);
        }}
        onReset={() => {
          onPatchSectionLayout(sectionKey, { maxWidth: 'full', paddingY: null });
        }}
      >
        <div
          style={
            paddingY
              ? { paddingTop: `${paddingY}px`, paddingBottom: `${paddingY}px` }
              : undefined
          }
        >
          {children}
        </div>
      </ResizableBox>
    </div>
  );
}

/**
 * Interactive, editable, and drag-resizable preview of the generated GitHub portfolio.
 * Supports inline text editing, item add/delete/reorder, and snapped card/section/avatar resizing.
 */
export default function PortfolioPreview({ data, editable = false, onChange }) {
  const [newTagByProject, setNewTagByProject] = useState({});
  const [editingLinkIdx, setEditingLinkIdx] = useState(null);
  const [newTool, setNewTool] = useState('');
  const [newDomain, setNewDomain] = useState('');

  if (!data) return null;

  const { sections = {}, profile, aggregateStats, layout = {} } = data;
  const hero = sections?.hero || {};
  const about = sections?.about || '';
  const projects = Array.isArray(sections?.projects) ? sections.projects : [];
  const skills = sections?.skills || { languages: [], tools: [], domains: [] };
  const avatarSize = Number(layout?.avatarSize) || 64;

  const updateSections = (updater, options) => {
    if (!onChange) return;
    const nextSections = typeof updater === 'function' ? updater(sections) : { ...sections, ...updater };
    onChange({ ...data, sections: nextSections }, options);
  };

  const updateLayout = (updater, options) => {
    if (!onChange) return;
    const nextLayout = typeof updater === 'function' ? updater(layout) : { ...layout, ...updater };
    onChange({ ...data, layout: nextLayout }, options);
  };

  const patchSectionLayout = (sectionKey, patch, mergeKey) => {
    updateLayout(
      (prev) => ({
        ...prev,
        sections: {
          ...(prev.sections || {}),
          [sectionKey]: { ...(prev.sections?.[sectionKey] || {}), ...patch },
        },
      }),
      mergeKey ? { mergeKey } : undefined,
    );
  };

  const patchProject = (index, patch, mergeKey) => {
    updateSections(
      (prev) => ({
        ...prev,
        projects: (prev.projects || []).map((item, i) => (i === index ? { ...item, ...patch } : item)),
      }),
      mergeKey ? { mergeKey } : undefined,
    );
  };

  const patchProjectLayout = (key, patch, mergeKey) => {
    updateLayout(
      (prev) => ({
        ...prev,
        projects: {
          ...(prev.projects || {}),
          [key]: { ...(prev.projects?.[key] || {}), ...patch },
        },
      }),
      mergeKey ? { mergeKey } : undefined,
    );
  };

  const patchSkillBlockLayout = (key, patch, mergeKey) => {
    updateLayout(
      (prev) => ({
        ...prev,
        skills: {
          ...(prev.skills || {}),
          [key]: { ...(prev.skills?.[key] || {}), ...patch },
        },
      }),
      mergeKey ? { mergeKey } : undefined,
    );
  };

  const moveProject = (from, to) => {
    if (to < 0 || to >= projects.length) return;
    updateSections((prev) => {
      const next = [...(prev.projects || [])];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return { ...prev, projects: next };
    });
  };

  const addProject = () => {
    updateSections((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          name: `custom-project-${(prev.projects || []).length + 1}`,
          title: 'New Featured Project',
          summary: 'Describe the problem you solved, architecture choices, and impact.',
          highlights: ['Built end-to-end with clean tests and documentation.'],
          tech: ['TypeScript', 'React'],
          url: '',
          stars: 0,
          forks: 0,
        },
      ],
    }));
  };

  const removeProject = (index) => {
    updateSections((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index),
    }));
  };

  const hasSkillsContent =
    skills.languages?.length > 0 || skills.tools?.length > 0 || skills.domains?.length > 0 || editable;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Hero */}
      <SectionContainer
        sectionKey="hero"
        label="Hero"
        layout={layout}
        editable={editable}
        onPatchSectionLayout={patchSectionLayout}
      >
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 md:p-8">
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            {profile?.avatarUrl && (
              <ResizableBox
                enabled={editable}
                variant="media"
                label="Avatar"
                sizeLabel={`${avatarSize}px`}
                accentColor="#10b981"
                isCustomized={avatarSize !== 64}
                className="mb-3 inline-block rounded-full"
                style={{ width: avatarSize, height: avatarSize }}
                onResizeX={(dx, rect) => {
                  const next = snapStep(rect.width + dx, 8, 48, 160);
                  updateLayout({ avatarSize: next }, { mergeKey: 'resize:gh:avatar' });
                }}
                onResizeXY={(dx, dy, rect) => {
                  const next = snapStep(rect.width + Math.max(dx, dy), 8, 48, 160);
                  updateLayout({ avatarSize: next }, { mergeKey: 'resize:gh:avatar' });
                }}
                onReset={() => updateLayout({ avatarSize: 64 })}
              >
                <img
                  src={profile.avatarUrl}
                  alt={profile.login}
                  className="h-full w-full rounded-full border-2 border-border object-cover"
                />
              </ResizableBox>
            )}

            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              <InlineText
                value={hero.headline || profile?.name || profile?.login || 'Your Portfolio'}
                placeholder="Your headline…"
                editable={editable}
                onCommit={(val) =>
                  updateSections((prev) => ({ ...prev, hero: { ...(prev.hero || {}), headline: val } }))
                }
              />
            </h1>

            {(hero.subheadline || editable) && (
              <p className="mt-1 text-base text-muted-foreground">
                <InlineText
                  value={hero.subheadline || ''}
                  placeholder="Add a role or tagline…"
                  editable={editable}
                  onCommit={(val) =>
                    updateSections((prev) => ({ ...prev, hero: { ...(prev.hero || {}), subheadline: val } }))
                  }
                />
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {profile?.login && (
                <a
                  href={profile.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  <Github className="h-3.5 w-3.5" /> @{profile.login}
                </a>
              )}
              {(hero.location || editable) && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <InlineText
                    value={hero.location || ''}
                    placeholder="Add location"
                    editable={editable}
                    onCommit={(val) =>
                      updateSections((prev) => ({ ...prev, hero: { ...(prev.hero || {}), location: val } }))
                    }
                  />
                </span>
              )}
              {(hero.availableFor || editable) && (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Briefcase className="h-3.5 w-3.5 shrink-0" />
                  <InlineText
                    value={hero.availableFor || ''}
                    placeholder="Availability status"
                    editable={editable}
                    onCommit={(val) =>
                      updateSections((prev) => ({ ...prev, hero: { ...(prev.hero || {}), availableFor: val } }))
                    }
                  />
                </span>
              )}
            </div>

            {aggregateStats && (
              <div className="mt-4 flex flex-wrap gap-4 text-xs">
                <span className="rounded-full bg-foreground/5 px-3 py-1">
                  <strong>{aggregateStats.stars || 0}</strong> stars
                </span>
                <span className="rounded-full bg-foreground/5 px-3 py-1">
                  <strong>{aggregateStats.forks || 0}</strong> forks
                </span>
                <span className="rounded-full bg-foreground/5 px-3 py-1">
                  <strong>{aggregateStats.reposAnalyzed || projects.length}</strong> repos
                </span>
              </div>
            )}
          </div>
        </div>
      </SectionContainer>

      {/* About */}
      {(about || editable) && (
        <SectionContainer
          sectionKey="about"
          label="About"
          layout={layout}
          editable={editable}
          onPatchSectionLayout={patchSectionLayout}
        >
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
              About
            </h2>
            {editable ? (
              <InlineText
                as="p"
                multiline
                editable
                value={about}
                placeholder="Write a short bio describing what you build and your engineering focus…"
                className="block whitespace-pre-wrap text-sm leading-relaxed"
                onCommit={(val) => updateSections((prev) => ({ ...prev, about: val }))}
              />
            ) : (
              about.split(/\n{2,}/).map((p, i) => (
                <p key={i} className="text-sm leading-relaxed mb-2 last:mb-0">
                  {p}
                </p>
              ))
            )}
          </div>
        </SectionContainer>
      )}

      {/* Projects */}
      {(projects.length > 0 || editable) && (
        <SectionContainer
          sectionKey="projects"
          label="Projects"
          layout={layout}
          editable={editable}
          onPatchSectionLayout={patchSectionLayout}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Projects
            </h2>
            {editable && (
              <button
                type="button"
                onClick={addProject}
                className="inline-flex items-center gap-1 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/10"
              >
                <Plus className="h-3.5 w-3.5" /> Add project
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projects.map((p, i) => {
              const projKey = p.name || p.title || `proj-${i}`;
              const cardLayout = layout?.projects?.[projKey] || {};
              const colSpan = cardLayout.colSpan === 2 ? 2 : 1;
              const cardHeight = cardLayout.cardHeight || null;

              return (
                <ResizableBox
                  key={projKey + i}
                  enabled={editable}
                  label="Card"
                  sizeLabel={`${colSpan === 2 ? 'Full row (2 cols)' : '1 col'}${cardHeight ? ` · ${cardHeight}px` : ''}`}
                  accentColor="#10b981"
                  isCustomized={Boolean(colSpan > 1 || cardHeight)}
                  className={`rounded-xl border border-border bg-card p-4 hover:border-primary/40 transition-colors flex flex-col ${
                    colSpan === 2 ? 'md:col-span-2' : 'md:col-span-1'
                  }`}
                  style={cardHeight ? { minHeight: `${cardHeight}px` } : undefined}
                  onResizeX={(dx, rect) => {
                    const nextSpan = snapColSpan(colSpan, rect.width, dx, 2);
                    patchProjectLayout(projKey, { colSpan: nextSpan }, `resize:gh:proj:${projKey}:x`);
                  }}
                  onResizeY={(dy, rect) => {
                    const nextH = snapStep(rect.height + dy, 20, 180, 520);
                    patchProjectLayout(projKey, { cardHeight: nextH }, `resize:gh:proj:${projKey}:y`);
                  }}
                  onReset={() => patchProjectLayout(projKey, { colSpan: 1, cardHeight: null })}
                  actions={
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => moveProject(i, i - 1)}
                        title="Move earlier"
                        className="rounded px-1 text-[10px] hover:bg-white/15 disabled:opacity-30"
                      >
                        <ArrowLeft className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        disabled={i === projects.length - 1}
                        onClick={() => moveProject(i, i + 1)}
                        title="Move later"
                        className="rounded px-1 text-[10px] hover:bg-white/15 disabled:opacity-30"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProject(i)}
                        title="Delete project"
                        className="rounded px-1 text-rose-400 hover:bg-white/15"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  }
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-sm flex-1 min-w-0">
                      <InlineText
                        value={p.title || p.name || ''}
                        placeholder="Project title"
                        editable={editable}
                        onCommit={(val) => patchProject(i, { title: val })}
                      />
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3" /> {p.stars || 0}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork className="h-3 w-3" /> {p.forks || 0}
                      </span>
                    </div>
                  </div>

                  <p className={`text-xs text-muted-foreground mb-2 ${editable ? '' : 'line-clamp-3'}`}>
                    <InlineText
                      multiline
                      value={p.summary || ''}
                      placeholder="Add project summary…"
                      editable={editable}
                      onCommit={(val) => patchProject(i, { summary: val })}
                    />
                  </p>

                  {(p.highlights?.length > 0 || editable) && (
                    <ul className="text-xs space-y-1 mb-2">
                      {(editable ? p.highlights || [] : (p.highlights || []).slice(0, 3)).map((h, j) => (
                        <li key={j} className="flex items-start gap-1.5 group/bullet">
                          <span className="text-primary mt-0.5">•</span>
                          <span className="flex-1 min-w-0">
                            <InlineText
                              value={h}
                              placeholder="Highlight…"
                              editable={editable}
                              onCommit={(val) => {
                                const nextH = [...(p.highlights || [])];
                                nextH[j] = val;
                                patchProject(i, { highlights: nextH });
                              }}
                            />
                          </span>
                          {editable && (
                            <button
                              type="button"
                              aria-label="Remove highlight"
                              onClick={() =>
                                patchProject(i, {
                                  highlights: (p.highlights || []).filter((_, hi) => hi !== j),
                                })
                              }
                              className="opacity-0 group-hover/bullet:opacity-100 text-muted-foreground hover:text-destructive p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </li>
                      ))}
                      {editable && (
                        <li>
                          <button
                            type="button"
                            onClick={() =>
                              patchProject(i, {
                                highlights: [...(p.highlights || []), 'Key outcome or technical highlight'],
                              })
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                          >
                            <Plus className="h-3 w-3" /> Add highlight
                          </button>
                        </li>
                      )}
                    </ul>
                  )}

                  {(p.tech?.length > 0 || editable) && (
                    <div className="flex flex-wrap items-center gap-1 mb-2">
                      {(editable ? p.tech || [] : (p.tech || []).slice(0, 5)).map((t, ti) => (
                        <span
                          key={`${t}-${ti}`}
                          className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-2 py-0.5 text-[10px] font-semibold"
                        >
                          {t}
                          {editable && (
                            <button
                              type="button"
                              aria-label={`Remove ${t}`}
                              onClick={() =>
                                patchProject(i, { tech: (p.tech || []).filter((_, idx) => idx !== ti) })
                              }
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                          )}
                        </span>
                      ))}
                      {editable && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const val = (newTagByProject[i] || '').trim();
                            if (!val) return;
                            patchProject(i, { tech: [...(p.tech || []), val] });
                            setNewTagByProject((prev) => ({ ...prev, [i]: '' }));
                          }}
                          className="inline-flex"
                        >
                          <input
                            type="text"
                            value={newTagByProject[i] || ''}
                            onChange={(e) =>
                              setNewTagByProject((prev) => ({ ...prev, [i]: e.target.value }))
                            }
                            placeholder="+ tag"
                            aria-label="Add tech tag"
                            className="w-16 rounded-full border border-dashed border-border bg-transparent px-2 py-0.5 text-[10px] focus:w-24 focus:border-primary focus:outline-none transition-all"
                          />
                        </form>
                      )}
                    </div>
                  )}

                  <div className="mt-auto pt-1 flex flex-wrap items-center gap-2">
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        View repo <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {editable && (
                      <button
                        type="button"
                        onClick={() => setEditingLinkIdx(editingLinkIdx === i ? null : i)}
                        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                      >
                        <LinkIcon className="h-3 w-3" /> {p.url ? 'Edit URL' : 'Add URL'}
                      </button>
                    )}
                  </div>
                  {editable && editingLinkIdx === i && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <input
                        type="url"
                        value={p.url || ''}
                        onChange={(e) => patchProject(i, { url: e.target.value }, `edit:gh:proj:${i}:url`)}
                        placeholder="https://github.com/..."
                        className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingLinkIdx(null)}
                        className="rounded-md bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </ResizableBox>
              );
            })}
          </div>
        </SectionContainer>
      )}

      {/* Skills */}
      {hasSkillsContent && (
        <SectionContainer
          sectionKey="skills"
          label="Skills"
          layout={layout}
          editable={editable}
          onPatchSectionLayout={patchSectionLayout}
        >
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Languages block */}
              {(skills.languages?.length > 0 || editable) && (() => {
                const langLayout = layout?.skills?.languages || {};
                const lSpan = langLayout.colSpan === 2 ? 2 : 1;
                const lHeight = langLayout.cardHeight || null;
                return (
                  <ResizableBox
                    enabled={editable}
                    label="Languages"
                    sizeLabel={`${lSpan === 2 ? '2 cols' : '1 col'}${lHeight ? ` · ${lHeight}px` : ''}`}
                    accentColor="#10b981"
                    isCustomized={Boolean(lSpan > 1 || lHeight)}
                    className={`rounded-xl border border-border/70 bg-background/40 p-4 ${
                      lSpan === 2 ? 'md:col-span-2' : 'md:col-span-1'
                    }`}
                    style={lHeight ? { minHeight: `${lHeight}px` } : undefined}
                    onResizeX={(dx, rect) => {
                      const nextSpan = snapColSpan(lSpan, rect.width, dx, 2);
                      patchSkillBlockLayout('languages', { colSpan: nextSpan }, 'resize:gh:skills:languages:x');
                    }}
                    onResizeY={(dy, rect) => {
                      const nextH = snapStep(rect.height + dy, 20, 120, 440);
                      patchSkillBlockLayout('languages', { cardHeight: nextH }, 'resize:gh:skills:languages:y');
                    }}
                    onReset={() => patchSkillBlockLayout('languages', { colSpan: 1, cardHeight: null })}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold inline-flex items-center gap-1">
                        <Code2 className="h-3 w-3" /> Languages
                      </h3>
                      {editable && (
                        <button
                          type="button"
                          onClick={() =>
                            updateSections((prev) => ({
                              ...prev,
                              skills: {
                                ...(prev.skills || {}),
                                languages: [
                                  ...(prev.skills?.languages || []),
                                  { name: 'New Language', level: 4 },
                                ],
                              },
                            }))
                          }
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                        >
                          <Plus className="h-3 w-3" /> Add
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {(skills.languages || []).map((l, li) => (
                        <div key={`${l.name}-${li}`} className="flex items-center gap-2 group/lang">
                          <span className="text-xs font-mono w-24 truncate">
                            <InlineText
                              value={l.name}
                              placeholder="Language"
                              editable={editable}
                              onCommit={(val) =>
                                updateSections((prev) => ({
                                  ...prev,
                                  skills: {
                                    ...(prev.skills || {}),
                                    languages: (prev.skills?.languages || []).map((item, idx) =>
                                      idx === li ? { ...item, name: val } : item,
                                    ),
                                  },
                                }))
                              }
                            />
                          </span>
                          {editable ? (
                            <div className="flex flex-1 items-center gap-1" title="Click 1–5 to set proficiency">
                              {[1, 2, 3, 4, 5].map((lvl) => (
                                <button
                                  key={lvl}
                                  type="button"
                                  aria-label={`Set ${l.name} level to ${lvl}`}
                                  onClick={() =>
                                    updateSections((prev) => ({
                                      ...prev,
                                      skills: {
                                        ...(prev.skills || {}),
                                        languages: (prev.skills?.languages || []).map((item, idx) =>
                                          idx === li ? { ...item, level: lvl } : item,
                                        ),
                                      },
                                    }))
                                  }
                                  className={`h-2 flex-1 rounded-full transition ${
                                    lvl <= (l.level || 1) ? 'bg-primary' : 'bg-foreground/10 hover:bg-foreground/20'
                                  }`}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="flex-1 h-1.5 rounded-full bg-foreground/5 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-primary/60"
                                style={{ width: `${(l.level / 5) * 100}%` }}
                              />
                            </div>
                          )}
                          <span className="text-[10px] text-muted-foreground tabular-nums">
                            {l.level}/5
                          </span>
                          {editable && (
                            <button
                              type="button"
                              aria-label={`Remove ${l.name}`}
                              onClick={() =>
                                updateSections((prev) => ({
                                  ...prev,
                                  skills: {
                                    ...(prev.skills || {}),
                                    languages: (prev.skills?.languages || []).filter((_, idx) => idx !== li),
                                  },
                                }))
                              }
                              className="opacity-0 group-hover/lang:opacity-100 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </ResizableBox>
                );
              })()}

              {/* Tools & Domains block */}
              {(skills.tools?.length > 0 || skills.domains?.length > 0 || editable) && (() => {
                const tdLayout = layout?.skills?.domains || {};
                const tdSpan = tdLayout.colSpan === 2 ? 2 : 1;
                const tdHeight = tdLayout.cardHeight || null;
                return (
                  <ResizableBox
                    enabled={editable}
                    label="Tools & Domains"
                    sizeLabel={`${tdSpan === 2 ? '2 cols' : '1 col'}${tdHeight ? ` · ${tdHeight}px` : ''}`}
                    accentColor="#10b981"
                    isCustomized={Boolean(tdSpan > 1 || tdHeight)}
                    className={`rounded-xl border border-border/70 bg-background/40 p-4 space-y-4 ${
                      tdSpan === 2 ? 'md:col-span-2' : 'md:col-span-1'
                    }`}
                    style={tdHeight ? { minHeight: `${tdHeight}px` } : undefined}
                    onResizeX={(dx, rect) => {
                      const nextSpan = snapColSpan(tdSpan, rect.width, dx, 2);
                      patchSkillBlockLayout('domains', { colSpan: nextSpan }, 'resize:gh:skills:domains:x');
                    }}
                    onResizeY={(dy, rect) => {
                      const nextH = snapStep(rect.height + dy, 20, 120, 440);
                      patchSkillBlockLayout('domains', { cardHeight: nextH }, 'resize:gh:skills:domains:y');
                    }}
                    onReset={() => patchSkillBlockLayout('domains', { colSpan: 1, cardHeight: null })}
                  >
                    {(skills.tools?.length > 0 || editable) && (
                      <div>
                        <h3 className="text-xs font-semibold mb-2 inline-flex items-center gap-1">
                          <Wrench className="h-3 w-3" /> Tools
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {(skills.tools || []).map((t, ti) => (
                            <span
                              key={`${t}-${ti}`}
                              className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-2.5 py-0.5 text-[11px] font-medium"
                            >
                              {t}
                              {editable && (
                                <button
                                  type="button"
                                  aria-label={`Remove ${t}`}
                                  onClick={() =>
                                    updateSections((prev) => ({
                                      ...prev,
                                      skills: {
                                        ...(prev.skills || {}),
                                        tools: (prev.skills?.tools || []).filter((_, idx) => idx !== ti),
                                      },
                                    }))
                                  }
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              )}
                            </span>
                          ))}
                          {editable && (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const val = newTool.trim();
                                if (!val) return;
                                updateSections((prev) => ({
                                  ...prev,
                                  skills: {
                                    ...(prev.skills || {}),
                                    tools: [...(prev.skills?.tools || []), val],
                                  },
                                }));
                                setNewTool('');
                              }}
                              className="inline-flex"
                            >
                              <input
                                type="text"
                                value={newTool}
                                onChange={(e) => setNewTool(e.target.value)}
                                placeholder="+ tool"
                                aria-label="Add tool"
                                className="w-16 rounded-full border border-dashed border-border bg-transparent px-2 py-0.5 text-[11px] focus:w-24 focus:border-primary focus:outline-none transition-all"
                              />
                            </form>
                          )}
                        </div>
                      </div>
                    )}

                    {(skills.domains?.length > 0 || editable) && (
                      <div>
                        <h3 className="text-xs font-semibold mb-2 inline-flex items-center gap-1">
                          <Layers className="h-3 w-3" /> Domains
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {(skills.domains || []).map((d, di) => (
                            <span
                              key={`${d}-${di}`}
                              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary"
                            >
                              {d}
                              {editable && (
                                <button
                                  type="button"
                                  aria-label={`Remove ${d}`}
                                  onClick={() =>
                                    updateSections((prev) => ({
                                      ...prev,
                                      skills: {
                                        ...(prev.skills || {}),
                                        domains: (prev.skills?.domains || []).filter((_, idx) => idx !== di),
                                      },
                                    }))
                                  }
                                  className="hover:text-destructive"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              )}
                            </span>
                          ))}
                          {editable && (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const val = newDomain.trim();
                                if (!val) return;
                                updateSections((prev) => ({
                                  ...prev,
                                  skills: {
                                    ...(prev.skills || {}),
                                    domains: [...(prev.skills?.domains || []), val],
                                  },
                                }));
                                setNewDomain('');
                              }}
                              className="inline-flex"
                            >
                              <input
                                type="text"
                                value={newDomain}
                                onChange={(e) => setNewDomain(e.target.value)}
                                placeholder="+ domain"
                                aria-label="Add domain"
                                className="w-20 rounded-full border border-dashed border-primary/40 bg-transparent px-2 py-0.5 text-[10px] focus:w-28 focus:border-primary focus:outline-none transition-all"
                              />
                            </form>
                          )}
                        </div>
                      </div>
                    )}
                  </ResizableBox>
                );
              })()}
            </div>
          </div>
        </SectionContainer>
      )}

      {/* CTA */}
      {(sections?.callToAction || editable) && (
        <SectionContainer
          sectionKey="cta"
          label="Call to Action"
          layout={layout}
          editable={editable}
          onPatchSectionLayout={patchSectionLayout}
        >
          <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-center">
            <p className="text-sm font-semibold text-primary">
              <InlineText
                value={sections?.callToAction || ''}
                placeholder="Add a call to action…"
                editable={editable}
                onCommit={(val) => updateSections((prev) => ({ ...prev, callToAction: val }))}
              />
            </p>
          </div>
        </SectionContainer>
      )}
    </motion.div>
  );
}
