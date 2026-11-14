import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Image as ImageIcon,
  Plus,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  DENSITY_OPTIONS,
  DESIGN_PRESETS,
  FONT_PAIRS,
  SECTION_TYPE_MAP,
  WIDTH_OPTIONS,
  scoreDocument,
  slugify,
} from './portfolioDocument';
import { getTemplateMeta } from '../../../data/portfolioTemplates';

/* ─────────────────────────────── field primitives ─────────────────────────── */

function FieldHint({ children }) {
  if (!children) return null;
  return <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{children}</p>;
}

function Label({ children, hint, right }) {
  return (
    <div className="mb-1.5 flex items-center justify-between gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{children}</span>
      {right}
      {hint ? <span className="text-[10px] font-medium text-muted-foreground/70">{hint}</span> : null}
    </div>
  );
}

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 transition focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20';

export function TextField({ label, value, onChange, onBlur, placeholder, hint, type = 'text', mono = false }) {
  return (
    <label className="block">
      {label && <Label>{label}</Label>}
      <input
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${inputClass} ${mono ? 'font-mono text-xs' : ''}`}
      />
      <FieldHint>{hint}</FieldHint>
    </label>
  );
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 4, hint, maxLength, counter }) {
  return (
    <label className="block">
      {label && (
        <Label right={counter ? <span className="text-[10px] font-mono text-muted-foreground/70">{String(value || '').length}{maxLength ? `/${maxLength}` : ''}</span> : null}>
          {label}
        </Label>
      )}
      <textarea
        rows={rows}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`${inputClass} resize-y leading-relaxed`}
      />
      <FieldHint>{hint}</FieldHint>
    </label>
  );
}

export function ToggleField({ label, value, onChange, hint }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background/60 px-3 py-2.5">
      <div>
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <FieldHint>{hint}</FieldHint>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={Boolean(value)}
        aria-label={label}
        onClick={() => onChange(!value)}
        className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-muted-foreground/30'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  );
}

export function SegmentedField({ label, value, onChange, options, columns = false }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className={`grid gap-1 rounded-lg border border-border bg-background p-1 ${columns ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-md px-2 py-1.5 text-[11px] font-semibold transition ${
              value === option.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ColorField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="h-6 w-6 rounded-md border border-border" style={{ backgroundColor: value }} />
        <span className="text-xs font-medium text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] text-muted-foreground">{value}</span>
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label} colour`}
          className="h-7 w-8 cursor-pointer rounded border border-border bg-transparent p-0"
        />
      </div>
    </div>
  );
}

export function RangeField({ label, value, onChange, min = 0, max = 100, step = 1, suffix = '' }) {
  return (
    <div>
      <Label right={<span className="font-mono text-[10px] text-muted-foreground">{value}{suffix}</span>}>{label}</Label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

export function TagsField({ label, value = [], onChange, placeholder = 'React, TypeScript, Postgres' }) {
  const [draft, setDraft] = useState('');
  const tags = Array.isArray(value) ? value : [];

  const commit = () => {
    const additions = draft
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    if (!additions.length) return;
    const next = [...tags];
    for (const tag of additions) if (!next.includes(tag)) next.push(tag);
    onChange(next);
    setDraft('');
  };

  return (
    <div>
      {label && <Label hint="Enter or comma">{label}</Label>}
      <div className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-background p-2">
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-foreground"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(tags.filter((_, i) => i !== index))}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault();
              commit();
            }
            if (event.key === 'Backspace' && !draft && tags.length) onChange(tags.slice(0, -1));
          }}
          onBlur={commit}
          placeholder={tags.length ? 'Add another…' : placeholder}
          className="min-w-[100px] flex-1 bg-transparent px-1 py-0.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
      </div>
    </div>
  );
}

export function ImageField({ label, value, onChange, hint }) {
  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Choose an image file');
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error('Keep images under 1.5 MB — use a hosted URL for larger files');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {label && <Label hint="URL or upload">{label}</Label>}
      <div className="flex items-start gap-2">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <input
            value={value?.startsWith('data:') ? '' : value || ''}
            onChange={(event) => onChange(event.target.value)}
            placeholder={value?.startsWith('data:') ? 'Uploaded image' : 'https://…/photo.jpg'}
            className={`${inputClass} text-xs`}
          />
          <div className="flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground">
              <Upload className="h-3 w-3" /> Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            )}
          </div>
        </div>
      </div>
      <FieldHint>{hint}</FieldHint>
    </div>
  );
}

function ListItem({ index, total, title, subtitle, onRemove, onMove, children }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background/40">
      <div className="flex items-center gap-1 px-2 py-1.5">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-1 text-left hover:bg-muted/60"
        >
          <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-foreground">{title || `Item ${index + 1}`}</span>
            {subtitle && <span className="block truncate text-[10px] text-muted-foreground">{subtitle}</span>}
          </span>
        </button>
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            aria-label="Move up"
            disabled={index === 0}
            onClick={() => onMove(index, index - 1)}
            className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Move down"
            disabled={index === total - 1}
            onClick={() => onMove(index, index + 1)}
            className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Delete"
            onClick={onRemove}
            className="rounded p-1 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {open && <div className="space-y-3 border-t border-border px-3 py-3">{children}</div>}
    </div>
  );
}

function AddButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-primary/40 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5"
    >
      <Plus className="h-3.5 w-3.5" /> {children}
    </button>
  );
}

/* ──────────────────────────────── section forms ───────────────────────────── */

function HeroForm({ doc, store }) {
  const { patch, setDesign } = store;
  const hero = doc.hero;
  const design = doc.pf.design;
  return (
    <div className="space-y-4">
      <TextField label="Name" value={doc.personal.name} onChange={(v) => patch('personal.name', v)} placeholder="Ada Lovelace" />
      <TextField label="Role / headline" value={doc.personal.title} onChange={(v) => patch('personal.title', v)} placeholder="Product Engineer" />
      <TextAreaField
        label="One-line pitch"
        value={doc.personal.tagline}
        onChange={(v) => patch('personal.tagline', v)}
        rows={2}
        maxLength={220}
        counter
        hint="Shows under your name. Keep it specific and human."
      />
      <TextAreaField
        label="Hero intro (optional)"
        value={hero.subheadline}
        onChange={(v) => patch('hero.subheadline', v)}
        rows={2}
        hint="Overrides the pitch in the hero only."
      />
      <TextField
        label="Availability badge"
        value={hero.availability}
        onChange={(v) => patch('hero.availability', v)}
        placeholder="Available for new work"
        hint="Leave empty to hide the badge."
      />
      <ImageField label="Portrait" value={doc.personal.avatar} onChange={(v) => patch('personal.avatar', v)} />
      <SegmentedField
        label="Hero layout"
        value={design.heroLayout}
        onChange={(v) => setDesign({ heroLayout: v })}
        options={[
          { id: 'split', label: 'Split' },
          { id: 'centered', label: 'Centered' },
        ]}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Primary button" value={hero.primaryLabel} onChange={(v) => patch('hero.primaryLabel', v)} />
        <TextField label="Link" value={hero.primaryHref} onChange={(v) => patch('hero.primaryHref', v)} placeholder="#projects" mono />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Secondary button" value={hero.secondaryLabel} onChange={(v) => patch('hero.secondaryLabel', v)} placeholder="Email me" />
        <TextField label="Link" value={hero.secondaryHref} onChange={(v) => patch('hero.secondaryHref', v)} placeholder="mailto:…" mono />
      </div>
    </div>
  );
}

function AboutForm({ doc, store }) {
  const { patch } = store;
  return (
    <div className="space-y-4">
      <TextAreaField
        label="About"
        value={doc.personal.bio}
        onChange={(v) => patch('personal.bio', v)}
        rows={9}
        maxLength={2200}
        counter
        hint="Two short paragraphs beat one long one. Lead with the work you want more of."
      />
      <TextField label="Location" value={doc.personal.location} onChange={(v) => patch('personal.location', v)} placeholder="Bengaluru, India" />
      <TextField label="Email" value={doc.personal.email} onChange={(v) => patch('personal.email', v)} placeholder="you@example.com" />
      <TextField label="Phone (optional)" value={doc.personal.phone} onChange={(v) => patch('personal.phone', v)} />
    </div>
  );
}

function StatsForm({ doc, store }) {
  const { addItem, removeItem, moveListItem, patchItem } = store;
  return (
    <div className="space-y-3">
      <p className="text-[11px] text-muted-foreground">Proof points. Numbers with a unit read best (“5+ years”, “40% faster”).</p>
      {doc.stats.map((stat, index) => (
        <ListItem
          key={stat.id || index}
          index={index}
          total={doc.stats.length}
          title={`${stat.value || '0'}${stat.suffix || ''} — ${stat.label || 'New highlight'}`}
          onRemove={() => removeItem('stats', index)}
          onMove={(from, to) => moveListItem('stats', from, to)}
        >
          <div className="grid grid-cols-3 gap-2">
            <TextField label="Value" value={stat.value} onChange={(v) => patchItem('stats', index, 'value', v)} />
            <TextField label="Suffix" value={stat.suffix} onChange={(v) => patchItem('stats', index, 'suffix', v)} placeholder="+ / %" />
            <div className="col-span-1">
              <TextField label="Label" value={stat.label} onChange={(v) => patchItem('stats', index, 'label', v)} />
            </div>
          </div>
        </ListItem>
      ))}
      <AddButton onClick={() => addItem('stats', { value: '10', suffix: '+', label: 'New highlight' })}>Add highlight</AddButton>
    </div>
  );
}

function ProjectsForm({ doc, store }) {
  const { addItem, removeItem, moveListItem, patchItem } = store;
  return (
    <div className="space-y-3">
      <p className="text-[11px] text-muted-foreground">
        Three to five projects is the sweet spot. Describe the problem, what you built, and the measurable outcome.
      </p>
      {doc.projects.map((project, index) => (
        <ListItem
          key={project.id || index}
          index={index}
          total={doc.projects.length}
          title={project.title}
          subtitle={project.techStack?.slice(0, 3).join(' · ')}
          onRemove={() => removeItem('projects', index)}
          onMove={(from, to) => moveListItem('projects', from, to)}
        >
          <TextField label="Title" value={project.title} onChange={(v) => patchItem('projects', index, 'title', v)} />
          <TextAreaField
            label="Description"
            value={project.description}
            onChange={(v) => patchItem('projects', index, 'description', v)}
            rows={4}
            maxLength={600}
            counter
            hint="Aim for 60+ characters and one concrete result."
          />
          <TagsField
            label="Tech stack"
            value={project.techStack}
            onChange={(v) => patchItem('projects', index, 'techStack', v)}
          />
          <div className="grid grid-cols-2 gap-2">
            <TextField label="Live URL" value={project.liveUrl} onChange={(v) => patchItem('projects', index, 'liveUrl', v)} mono />
            <TextField label="Repo URL" value={project.githubUrl} onChange={(v) => patchItem('projects', index, 'githubUrl', v)} mono />
          </div>
          <ImageField label="Cover image" value={project.image} onChange={(v) => patchItem('projects', index, 'image', v)} />
          <ToggleField
            label="Feature this project"
            value={project.featured}
            onChange={(v) => patchItem('projects', index, 'featured', v)}
            hint="Adds a Featured badge."
          />
        </ListItem>
      ))}
      <AddButton
        onClick={() =>
          addItem('projects', {
            title: 'New project',
            description: '',
            techStack: [],
            liveUrl: '',
            githubUrl: '',
            image: '',
            featured: false,
          })
        }
      >
        Add project
      </AddButton>
    </div>
  );
}

function SkillsForm({ doc, store }) {
  const { addItem, removeItem, moveListItem, patchItem } = store;
  const categories = useMemo(
    () => [...new Set(doc.skills.map((skill) => skill.category).filter(Boolean))],
    [doc.skills],
  );
  return (
    <div className="space-y-3">
      <p className="text-[11px] text-muted-foreground">
        Skills are grouped by category in the Studio layout. Level drives the progress bar.
      </p>
      {doc.skills.map((skill, index) => (
        <div key={skill.id || index} className="rounded-lg border border-border bg-background/40 p-2.5">
          <div className="mb-2 flex items-center gap-1.5">
            <input
              value={skill.name}
              onChange={(event) => patchItem('skills', index, 'name', event.target.value)}
              placeholder="Skill"
              className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-xs font-semibold text-foreground focus:border-border focus:outline-none"
            />
            <input
              value={skill.category}
              onChange={(event) => patchItem('skills', index, 'category', event.target.value)}
              placeholder="Category"
              list="pf-skill-categories"
              className="w-24 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground focus:outline-none"
            />
            <button
              type="button"
              aria-label="Move up"
              disabled={index === 0}
              onClick={() => moveListItem('skills', index, index - 1)}
              className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ArrowUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              aria-label="Remove skill"
              onClick={() => removeItem('skills', index)}
              className="rounded p-1 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={skill.level}
            aria-label={`${skill.name} level`}
            onChange={(event) => patchItem('skills', index, 'level', Number(event.target.value))}
            className="w-full accent-primary"
          />
        </div>
      ))}
      <datalist id="pf-skill-categories">
        {(categories.length ? categories : ['Engineering', 'Design', 'Platform']).map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>
      <AddButton onClick={() => addItem('skills', { name: 'New skill', category: categories[0] || 'Engineering', level: 80 })}>
        Add skill
      </AddButton>
    </div>
  );
}

function ExperienceForm({ doc, store }) {
  const { addItem, removeItem, moveListItem, patchItem } = store;

  const updateBullet = (index, bulletIndex, value) => {
    const bullets = [...(doc.experience[index].bullets || [])];
    bullets[bulletIndex] = value;
    patchItem('experience', index, 'bullets', bullets);
  };

  return (
    <div className="space-y-3">
      {doc.experience.map((role, index) => (
        <ListItem
          key={role.id || index}
          index={index}
          total={doc.experience.length}
          title={role.role || 'New role'}
          subtitle={role.company}
          onRemove={() => removeItem('experience', index)}
          onMove={(from, to) => moveListItem('experience', from, to)}
        >
          <div className="grid grid-cols-2 gap-2">
            <TextField label="Role" value={role.role} onChange={(v) => patchItem('experience', index, 'role', v)} />
            <TextField label="Company" value={role.company} onChange={(v) => patchItem('experience', index, 'company', v)} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <TextField label="Start" value={role.start} onChange={(v) => patchItem('experience', index, 'start', v)} placeholder="2023" />
            <TextField label="End" value={role.end} onChange={(v) => patchItem('experience', index, 'end', v)} placeholder="Present" />
            <TextField label="Location" value={role.location} onChange={(v) => patchItem('experience', index, 'location', v)} placeholder="Remote" />
          </div>
          <div>
            <Label>Achievements</Label>
            <div className="space-y-1.5">
              {(role.bullets || []).map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex items-start gap-1.5">
                  <textarea
                    rows={2}
                    value={bullet}
                    onChange={(event) => updateBullet(index, bulletIndex, event.target.value)}
                    className={`${inputClass} resize-y text-xs`}
                  />
                  <button
                    type="button"
                    aria-label="Remove achievement"
                    onClick={() =>
                      patchItem(
                        'experience',
                        index,
                        'bullets',
                        (role.bullets || []).filter((_, i) => i !== bulletIndex),
                      )
                    }
                    className="mt-1 rounded p-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => patchItem('experience', index, 'bullets', [...(role.bullets || []), ''])}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                + Add achievement
              </button>
            </div>
          </div>
          <ToggleField
            label="Current role"
            value={role.current}
            onChange={(v) => patchItem('experience', index, 'current', v)}
            hint='Ends up as "Present".'
          />
        </ListItem>
      ))}
      <AddButton
        onClick={() =>
          addItem('experience', {
            role: 'New role',
            company: '',
            location: '',
            start: '',
            end: 'Present',
            current: true,
            bullets: [''],
          })
        }
      >
        Add experience
      </AddButton>
    </div>
  );
}

function EducationForm({ doc, store }) {
  const { addItem, removeItem, moveListItem, patchItem } = store;
  return (
    <div className="space-y-3">
      {doc.education.map((entry, index) => (
        <ListItem
          key={entry.id || index}
          index={index}
          total={doc.education.length}
          title={entry.degree || 'New qualification'}
          subtitle={entry.school}
          onRemove={() => removeItem('education', index)}
          onMove={(from, to) => moveListItem('education', from, to)}
        >
          <TextField label="Degree" value={entry.degree} onChange={(v) => patchItem('education', index, 'degree', v)} />
          <TextField label="Institution" value={entry.school} onChange={(v) => patchItem('education', index, 'school', v)} />
          <TextField label="Year" value={entry.year} onChange={(v) => patchItem('education', index, 'year', v)} />
          <TextAreaField
            label="Notes"
            value={entry.description}
            onChange={(v) => patchItem('education', index, 'description', v)}
            rows={2}
          />
        </ListItem>
      ))}
      <AddButton onClick={() => addItem('education', { degree: 'New qualification', school: '', year: '', description: '' })}>
        Add education
      </AddButton>
    </div>
  );
}

function TestimonialsForm({ doc, store }) {
  const { addItem, removeItem, moveListItem, patchItem } = store;
  return (
    <div className="space-y-3">
      {doc.testimonials.map((quote, index) => (
        <ListItem
          key={quote.id || index}
          index={index}
          total={doc.testimonials.length}
          title={quote.author || 'New quote'}
          subtitle={quote.role}
          onRemove={() => removeItem('testimonials', index)}
          onMove={(from, to) => moveListItem('testimonials', from, to)}
        >
          <TextAreaField
            label="Quote"
            value={quote.content}
            onChange={(v) => patchItem('testimonials', index, 'content', v)}
            rows={4}
          />
          <div className="grid grid-cols-2 gap-2">
            <TextField label="Name" value={quote.author} onChange={(v) => patchItem('testimonials', index, 'author', v)} />
            <TextField label="Role" value={quote.role} onChange={(v) => patchItem('testimonials', index, 'role', v)} />
          </div>
        </ListItem>
      ))}
      <AddButton onClick={() => addItem('testimonials', { author: '', role: '', content: '' })}>Add testimonial</AddButton>
    </div>
  );
}

function ContactForm({ doc, store }) {
  const { patch } = store;
  return (
    <div className="space-y-4">
      <TextField label="Email" value={doc.contact.email} onChange={(v) => patch('contact.email', v)} placeholder="you@example.com" />
      <TextField label="Phone" value={doc.contact.phone} onChange={(v) => patch('contact.phone', v)} />
      <TextField label="Location" value={doc.contact.location} onChange={(v) => patch('contact.location', v)} />
      <TextAreaField
        label="Note"
        value={doc.contact.message}
        onChange={(v) => patch('contact.message', v)}
        rows={3}
        hint="Shown above the contact form."
      />
      <ToggleField
        label="Show contact form"
        value={doc.contact.showForm}
        onChange={(v) => patch('contact.showForm', v)}
        hint="Opens the visitor's mail client — no backend required."
      />
    </div>
  );
}

function SocialsForm({ doc, store }) {
  const { patch } = store;
  return (
    <div className="space-y-4">
      <TextField label="GitHub" value={doc.socials.github} onChange={(v) => patch('socials.github', v)} placeholder="https://github.com/…" mono />
      <TextField label="LinkedIn" value={doc.socials.linkedin} onChange={(v) => patch('socials.linkedin', v)} placeholder="https://linkedin.com/in/…" mono />
      <TextField label="X / Twitter" value={doc.socials.twitter} onChange={(v) => patch('socials.twitter', v)} placeholder="https://x.com/…" mono />
      <TextField label="Website" value={doc.socials.website} onChange={(v) => patch('socials.website', v)} placeholder="https://…" mono />
      <TextField label="Public email" value={doc.socials.email} onChange={(v) => patch('socials.email', v)} placeholder="you@example.com" />
    </div>
  );
}

function CustomForm({ doc, section, store }) {
  const { patch, addItem, removeItem, moveListItem, patchItem } = store;
  const customIndex = doc.custom.findIndex((entry) => entry.id === section.customId);
  const custom = doc.custom[customIndex];
  if (!custom) {
    return <p className="text-xs text-muted-foreground">This custom section was removed.</p>;
  }
  return (
    <div className="space-y-4">
      <TextField
        label="Section title"
        value={custom.title}
        onChange={(v) => patch(`custom.${customIndex}.title`, v)}
      />
      <TextAreaField
        label="Intro (optional)"
        value={custom.description}
        onChange={(v) => patch(`custom.${customIndex}.description`, v)}
        rows={2}
      />
      <div className="space-y-3">
        {(custom.items || []).map((item, index) => (
          <ListItem
            key={item.id || index}
            index={index}
            total={custom.items.length}
            title={item.title || 'New item'}
            subtitle={item.meta}
            onRemove={() => removeItem(`custom.${customIndex}.items`, index)}
            onMove={(from, to) => moveListItem(`custom.${customIndex}.items`, from, to)}
          >
            <TextField
              label="Title"
              value={item.title}
              onChange={(v) => patchItem(`custom.${customIndex}.items`, index, 'title', v)}
            />
            <TextField
              label="Meta"
              value={item.meta}
              onChange={(v) => patchItem(`custom.${customIndex}.items`, index, 'meta', v)}
              placeholder="2025 · Award"
            />
            <TextAreaField
              label="Description"
              value={item.description}
              onChange={(v) => patchItem(`custom.${customIndex}.items`, index, 'description', v)}
              rows={3}
            />
            <TextField
              label="Link"
              value={item.url}
              onChange={(v) => patchItem(`custom.${customIndex}.items`, index, 'url', v)}
              mono
            />
          </ListItem>
        ))}
        <AddButton
          onClick={() =>
            addItem(`custom.${customIndex}.items`, { title: 'New item', description: '', meta: '', url: '' })
          }
        >
          Add item
        </AddButton>
      </div>
    </div>
  );
}

/* ───────────────────────────────── design tab ─────────────────────────────── */

export function DesignPanel({ doc, store }) {
  const { setDesign } = store;
  const design = doc.pf.design;
  const [advanced, setAdvanced] = useState(false);

  return (
    <div className="space-y-5">
      <div>
        <Label hint={`${DESIGN_PRESETS.length} palettes`}>Palette</Label>
        <div className="grid grid-cols-2 gap-2">
          {DESIGN_PRESETS.map((preset) => {
            const active = design.preset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  setDesign({
                    preset: preset.id,
                    mode: preset.mode,
                    accent: preset.accent,
                    background: preset.background,
                    surface: preset.surface,
                    text: preset.text,
                    muted: preset.muted,
                  })
                }
                className={`group relative overflow-hidden rounded-lg border p-2 text-left transition ${
                  active ? 'border-primary ring-2 ring-primary/25' : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="flex gap-1">
                  {[preset.background, preset.surface, preset.accent, preset.text].map((color) => (
                    <span
                      key={color}
                      className="h-5 flex-1 rounded-sm border border-black/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
                <span className="mt-1.5 flex items-center justify-between gap-1">
                  <span className="truncate text-[10px] font-semibold text-foreground">{preset.label}</span>
                  {active && <Check className="h-3 w-3 shrink-0 text-primary" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ColorField label="Accent" value={design.accent} onChange={(v) => setDesign({ accent: v, preset: 'custom' })} />

      <div>
        <Label>Typeface</Label>
        <select
          value={design.font}
          onChange={(event) => setDesign({ font: event.target.value })}
          className={inputClass}
        >
          {FONT_PAIRS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <RangeField
        label="Corner radius"
        value={design.radius}
        min={0}
        max={32}
        step={2}
        suffix="px"
        onChange={(v) => setDesign({ radius: v })}
      />

      <SegmentedField
        label="Density"
        value={design.density}
        onChange={(v) => setDesign({ density: v })}
        options={DENSITY_OPTIONS.map((option) => ({ id: option.id, label: option.label }))}
        columns
      />
      <SegmentedField
        label="Page width"
        value={design.width}
        onChange={(v) => setDesign({ width: v })}
        options={WIDTH_OPTIONS.map((option) => ({ id: option.id, label: option.label }))}
        columns
      />
      <SegmentedField
        label="Project grid"
        value={String(design.projectColumns)}
        onChange={(v) => setDesign({ projectColumns: Number(v) })}
        options={[
          { id: '1', label: '1 col' },
          { id: '2', label: '2 col' },
          { id: '3', label: '3 col' },
        ]}
        columns
      />
      <SegmentedField
        label="Hero layout"
        value={design.heroLayout}
        onChange={(v) => setDesign({ heroLayout: v })}
        options={[
          { id: 'split', label: 'Split' },
          { id: 'centered', label: 'Centered' },
        ]}
      />
      <ToggleField
        label="Sticky section nav"
        value={design.showNav}
        onChange={(v) => setDesign({ showNav: v })}
        hint="Only used by the Studio layout."
      />

      <div className="rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setAdvanced((value) => !value)}
          className="flex w-full items-center justify-between px-3 py-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
        >
          Advanced colours
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${advanced ? '' : '-rotate-90'}`} />
        </button>
        {advanced && (
          <div className="space-y-2 border-t border-border p-2.5">
            {[
              ['background', 'Background'],
              ['surface', 'Surface'],
              ['text', 'Text'],
              ['muted', 'Muted text'],
            ].map(([key, label]) => (
              <ColorField
                key={key}
                label={label}
                value={design[key]}
                onChange={(v) => setDesign({ [key]: v, preset: 'custom' })}
              />
            ))}
          </div>
        )}
      </div>

      <p className="rounded-lg bg-muted/50 px-3 py-2 text-[11px] leading-snug text-muted-foreground">
        These tokens style the <strong>Studio</strong> layout. Art-directed templates keep their own
        art direction; your words and images still apply to all of them.
      </p>
    </div>
  );
}

/* ─────────────────────────────── SEO / publish ────────────────────────────── */

export function SeoPanel({ doc, store, onPublish }) {
  const { patch } = store;
  const meta = doc.pf.meta;
  const template = getTemplateMeta(doc.pf.templateId);
  const readiness = useMemo(() => scoreDocument(doc), [doc]);
  const descriptionLength = (meta.description || '').length;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-background/60 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Readiness</span>
          <span
            className={`text-sm font-bold ${
              readiness.score >= 85 ? 'text-emerald-500' : readiness.score >= 60 ? 'text-amber-500' : 'text-rose-500'
            }`}
          >
            {readiness.score}%
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${
              readiness.score >= 85 ? 'bg-emerald-500' : readiness.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${readiness.score}%` }}
          />
        </div>
        <ul className="mt-3 space-y-1.5">
          {readiness.checks.map((check) => (
            <li key={check.id} className="flex items-start gap-2 text-[11px]">
              <span
                className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full ${
                  check.passed ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'
                }`}
              >
                {check.passed ? <Check className="h-2.5 w-2.5" /> : '!'}
              </span>
              <span className={check.passed ? 'text-muted-foreground' : 'text-foreground'}>
                {check.label}
                {!check.passed && <span className="block text-[10px] text-muted-foreground">{check.hint}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <TextField
        label="Browser title"
        value={meta.siteTitle}
        onChange={(v) => patch('pf.meta.siteTitle', v)}
        placeholder={`${doc.personal.name || 'Your name'} — ${doc.personal.title || 'Portfolio'}`}
        hint="Around 55–60 characters."
      />
      <button
        type="button"
        onClick={() =>
          patch(
            'pf.meta.siteTitle',
            [doc.personal.name, doc.personal.title].filter(Boolean).join(' — ').slice(0, 60),
          )
        }
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
      >
        <Sparkles className="h-3 w-3" /> Use my name and role
      </button>

      <TextAreaField
        label="Meta description"
        value={meta.description}
        onChange={(v) => patch('pf.meta.description', v)}
        rows={3}
        maxLength={180}
        counter
      />
      <p className={`-mt-2 text-[10px] ${descriptionLength >= 50 ? 'text-emerald-500' : 'text-muted-foreground'}`}>
        {descriptionLength >= 50 ? 'Good length for search results.' : 'Aim for 50–160 characters.'}
      </p>

      <TextField
        label="URL slug"
        value={meta.slug}
        onChange={(v) => patch('pf.meta.slug', v)}
        onBlur={() => patch('pf.meta.slug', slugify(meta.slug || doc.personal.name))}
        placeholder={slugify(doc.personal.name || 'my-portfolio')}
        mono
        hint="Used when publishing to a hosting provider."
      />

      <div className="rounded-xl border border-border bg-background/60 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Template</p>
        <p className="mt-1 text-sm font-semibold text-foreground">{template.title}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {template.isStudio
            ? 'Composable Studio layout — sections reorder, hide and restyle.'
            : 'Art-directed template. Section order is controlled by the template; content still comes from your document.'}
        </p>
      </div>

      <button
        type="button"
        onClick={onPublish}
        className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        Publish portfolio
      </button>
    </div>
  );
}

/* ─────────────────────────────────── shell ────────────────────────────────── */

const TABS = [
  { id: 'content', label: 'Content' },
  { id: 'design', label: 'Design' },
  { id: 'seo', label: 'Publish' },
];

export default function Inspector({ doc, section, store, onPublish }) {
  const [tab, setTab] = useState('content');
  const sectionType = section?.type || 'hero';
  const meta = SECTION_TYPE_MAP[sectionType];

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-l border-border bg-card">
      <div className="border-b border-border px-4 pb-3 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {sectionType === 'custom' ? 'Custom section' : meta?.label || 'Section'}
            </p>
            <h2 className="truncate text-base font-bold text-foreground">
              {sectionType === 'custom'
                ? doc.custom.find((entry) => entry.id === section?.customId)?.title || 'Custom section'
                : meta?.label || 'Section'}
            </h2>
          </div>
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {doc.pf.templateId === 'Studio' ? 'Studio' : 'Template'}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-md py-1.5 text-[11px] font-semibold transition ${
                tab === item.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {tab === 'design' && <DesignPanel doc={doc} store={store} />}
        {tab === 'seo' && <SeoPanel doc={doc} store={store} onPublish={onPublish} />}
        {tab === 'content' && (
          <div className="space-y-4">
            {meta?.hint && <p className="text-[11px] leading-snug text-muted-foreground">{meta.hint}</p>}
            {sectionType === 'hero' && <HeroForm doc={doc} store={store} />}
            {sectionType === 'about' && <AboutForm doc={doc} store={store} />}
            {sectionType === 'stats' && <StatsForm doc={doc} store={store} />}
            {sectionType === 'projects' && <ProjectsForm doc={doc} store={store} />}
            {sectionType === 'skills' && <SkillsForm doc={doc} store={store} />}
            {sectionType === 'experience' && <ExperienceForm doc={doc} store={store} />}
            {sectionType === 'education' && <EducationForm doc={doc} store={store} />}
            {sectionType === 'testimonials' && <TestimonialsForm doc={doc} store={store} />}
            {sectionType === 'contact' && <ContactForm doc={doc} store={store} />}
            {sectionType === 'socials' && <SocialsForm doc={doc} store={store} />}
            {sectionType === 'custom' && <CustomForm doc={doc} section={section} store={store} />}
          </div>
        )}
      </div>
    </aside>
  );
}
