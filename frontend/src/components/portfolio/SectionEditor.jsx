import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Save, User, Briefcase, Code2, FolderGit2,
  Mail, ChevronDown, ChevronUp, Plus, Trash2, Sparkles
} from 'lucide-react';
import { portfolioApi } from '../../services/api';
import toast from 'react-hot-toast';

const SECTION_ICONS = {
  hero: User,
  about: Sparkles,
  projects: FolderGit2,
  skills: Code2,
  experience: Briefcase,
  contact: Mail,
};

const SECTION_LABELS = {
  hero: 'Hero',
  about: 'About',
  projects: 'Projects',
  skills: 'Skills',
  experience: 'Experience',
  contact: 'Contact',
};

// ─── Field Components ────────────────────────────────────────────────────────

function Input({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-background border border-border
          text-sm text-foreground placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg bg-background border border-border
          text-sm text-foreground placeholder:text-muted-foreground resize-none
          focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
      />
    </div>
  );
}

function Slider({ label, value, onChange, min = 1, max = 5 }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </label>
        <span className="text-xs font-bold text-primary">{value}/{max}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value || min}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

// ─── Section Forms ────────────────────────────────────────────────────────────

function HeroForm({ data, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <Input label="Full Name" value={data.name} onChange={v => onChange({ ...data, name: v })} placeholder="e.g. Jane Doe" />
      <Input label="Title" value={data.title} onChange={v => onChange({ ...data, title: v })} placeholder="e.g. Full Stack Developer" />
      <Input label="Subtitle" value={data.subtitle} onChange={v => onChange({ ...data, subtitle: v })} placeholder="e.g. Building AI-powered products" />
      <Input label="Profile Image URL" value={data.image} onChange={v => onChange({ ...data, image: v })} placeholder="https://..." />
      <Input label="CTA Button Text" value={data.cta} onChange={v => onChange({ ...data, cta: v })} placeholder="e.g. View My Work" />
    </div>
  );
}

function AboutForm({ data, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <Textarea label="Bio" value={data.bio} onChange={v => onChange({ ...data, bio: v })} placeholder="Tell your story..." rows={4} />
      <Input label="Profile Image URL" value={data.image} onChange={v => onChange({ ...data, image: v })} placeholder="https://..." />
      <Input label="GitHub URL" value={data.github} onChange={v => onChange({ ...data, github: v })} placeholder="https://github.com/..." />
      <Input label="LinkedIn URL" value={data.linkedin} onChange={v => onChange({ ...data, linkedin: v })} placeholder="https://linkedin.com/in/..." />
      <Input label="Twitter/X URL" value={data.twitter} onChange={v => onChange({ ...data, twitter: v })} placeholder="https://twitter.com/..." />
      <Input label="Personal Website" value={data.website} onChange={v => onChange({ ...data, website: v })} placeholder="https://..." />
    </div>
  );
}

function ProjectsForm({ data, onChange }) {
  const projects = data.projects || [];

  const addProject = () => onChange({
    ...data,
    projects: [...projects, { id: Date.now() + Math.random(), title: '', description: '', tech: '', liveUrl: '', repoUrl: '', image: '' }]
  });

  const updateProject = (i, field, value) => {
    const updated = projects.map((p, idx) => idx === i ? { ...p, [field]: value } : p);
    onChange({ ...data, projects: updated });
  };

  const removeProject = (i) => onChange({
    ...data,
    projects: projects.filter((_, idx) => idx !== i)
  });

  return (
    <div className="flex flex-col gap-4">
      {projects.map((project, i) => (
        <div key={project.id || i} className="p-4 rounded-xl border border-border bg-background/50 flex flex-col gap-3 relative">
          <button
            onClick={() => removeProject(i)}
            className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <p className="text-xs font-bold text-primary uppercase tracking-wider">Project {i + 1}</p>
          <Input label="Title" value={project.title} onChange={v => updateProject(i, 'title', v)} placeholder="e.g. CareerPilot" />
          <Textarea label="Description" value={project.description} onChange={v => updateProject(i, 'description', v)} placeholder="What does it do?" rows={2} />
          <Input label="Tech Stack (comma separated)" value={project.tech} onChange={v => updateProject(i, 'tech', v)} placeholder="React, Node.js, MongoDB" />
          <Input label="Live URL" value={project.liveUrl} onChange={v => updateProject(i, 'liveUrl', v)} placeholder="https://..." />
          <Input label="Repo URL" value={project.repoUrl} onChange={v => updateProject(i, 'repoUrl', v)} placeholder="https://github.com/..." />
          <Input label="Image URL" value={project.image} onChange={v => updateProject(i, 'image', v)} placeholder="https://..." />
        </div>
      ))}
      <button
        onClick={addProject}
        className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg
          border border-dashed border-primary/40 text-primary text-sm font-medium
          hover:bg-primary/5 transition"
      >
        <Plus className="w-4 h-4" /> Add Project
      </button>
    </div>
  );
}

function SkillsForm({ data, onChange }) {
  const groups = data.groups || [];

  const addGroup = () => onChange({
    ...data,
    groups: [...groups, { id: Date.now() + Math.random(), category: '', skills: [{ id: Date.now() + Math.random(), name: '', level: 3 }] }]
  });

  const updateGroup = (gi, field, value) => {
    const updated = groups.map((g, i) => i === gi ? { ...g, [field]: value } : g);
    onChange({ ...data, groups: updated });
  };

  const addSkill = (gi) => {
    const updated = groups.map((g, i) =>
      i === gi ? { ...g, skills: [...g.skills, { id: Date.now() + Math.random(), name: '', level: 3 }] } : g
    );
    onChange({ ...data, groups: updated });
  };

  const updateSkill = (gi, si, field, value) => {
    const updated = groups.map((g, i) =>
      i === gi ? {
        ...g,
        skills: g.skills.map((s, j) => j === si ? { ...s, [field]: value } : s)
      } : g
    );
    onChange({ ...data, groups: updated });
  };

  const removeSkill = (gi, si) => {
    const updated = groups.map((g, i) =>
      i === gi ? { ...g, skills: g.skills.filter((_, j) => j !== si) } : g
    );
    onChange({ ...data, groups: updated });
  };

  const removeGroup = (gi) => onChange({
    ...data, groups: groups.filter((_, i) => i !== gi)
  });

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group, gi) => (
        <div key={group.id || gi} className="p-4 rounded-xl border border-border bg-background/50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Input label="Category" value={group.category} onChange={v => updateGroup(gi, 'category', v)} placeholder="e.g. Frontend" />
            <button onClick={() => removeGroup(gi)} className="ml-3 mt-5 text-muted-foreground hover:text-destructive transition">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {group.skills.map((skill, si) => (
            <div key={si} className="flex items-end gap-2">
              <div className="flex-1">
                <Input label={`Skill ${si + 1}`} value={skill.name} onChange={v => updateSkill(gi, si, 'name', v)} placeholder="e.g. React" />
              </div>
              <div className="flex-1">
                <Slider label="Level" value={skill.level} onChange={v => updateSkill(gi, si, 'level', v)} />
              </div>
              <button onClick={() => removeSkill(gi, si)} className="mb-1 text-muted-foreground hover:text-destructive transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addSkill(gi)}
            className="text-xs text-primary hover:underline text-left"
          >
            + Add Skill
          </button>
        </div>
      ))}
      <button
        onClick={addGroup}
        className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg
          border border-dashed border-primary/40 text-primary text-sm font-medium
          hover:bg-primary/5 transition"
      >
        <Plus className="w-4 h-4" /> Add Skill Group
      </button>
    </div>
  );
}

function ExperienceForm({ data, onChange }) {
  const entries = data.entries || [];

  const addEntry = () => onChange({
    ...data,
    entries: [...entries, { id: Date.now() + Math.random(), company: '', role: '', start: '', end: '', bullets: [''] }]
  });

  const updateEntry = (i, field, value) => {
    const updated = entries.map((e, idx) => idx === i ? { ...e, [field]: value } : e);
    onChange({ ...data, entries: updated });
  };

  const addBullet = (i) => {
    const updated = entries.map((e, idx) =>
      idx === i ? { ...e, bullets: [...e.bullets, ''] } : e
    );
    onChange({ ...data, entries: updated });
  };

  const updateBullet = (i, bi, value) => {
    const updated = entries.map((e, idx) =>
      idx === i ? { ...e, bullets: e.bullets.map((b, j) => j === bi ? value : b) } : e
    );
    onChange({ ...data, entries: updated });
  };

  const removeBullet = (i, bi) => {
    const updated = entries.map((e, idx) =>
      idx === i ? { ...e, bullets: e.bullets.filter((_, j) => j !== bi) } : e
    );
    onChange({ ...data, entries: updated });
  };

  const removeEntry = (i) => onChange({
    ...data, entries: entries.filter((_, idx) => idx !== i)
  });

  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry, i) => (
        <div key={entry.id || i} className="p-4 rounded-xl border border-border bg-background/50 flex flex-col gap-3 relative">
          <button onClick={() => removeEntry(i)} className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition">
            <Trash2 className="w-4 h-4" />
          </button>
          <p className="text-xs font-bold text-primary uppercase tracking-wider">Experience {i + 1}</p>
          <Input label="Company" value={entry.company} onChange={v => updateEntry(i, 'company', v)} placeholder="e.g. Google" />
          <Input label="Role" value={entry.role} onChange={v => updateEntry(i, 'role', v)} placeholder="e.g. Software Engineer" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" value={entry.start} onChange={v => updateEntry(i, 'start', v)} placeholder="e.g. Jun 2023" />
            <Input label="End Date" value={entry.end} onChange={v => updateEntry(i, 'end', v)} placeholder="e.g. Present" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bullets</label>
            {entry.bullets.map((b, bi) => (
              <div key={bi} className="flex items-center gap-2">
                <input
                  value={b}
                  onChange={e => updateBullet(i, bi, e.target.value)}
                  placeholder={`Bullet ${bi + 1}`}
                  className="flex-1 px-3 py-2 rounded-lg bg-background border border-border
                    text-sm text-foreground placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
                <button onClick={() => removeBullet(i, bi)} className="text-muted-foreground hover:text-destructive transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button onClick={() => addBullet(i)} className="text-xs text-primary hover:underline text-left">
              + Add Bullet
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={addEntry}
        className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg
          border border-dashed border-primary/40 text-primary text-sm font-medium
          hover:bg-primary/5 transition"
      >
        <Plus className="w-4 h-4" /> Add Experience
      </button>
    </div>
  );
}

function ContactForm({ data, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <Input label="Email" value={data.email} onChange={v => onChange({ ...data, email: v })} placeholder="you@example.com" type="email" />
      <Input label="Phone" value={data.phone} onChange={v => onChange({ ...data, phone: v })} placeholder="+91 98765 43210" />
      <Input label="Location" value={data.location} onChange={v => onChange({ ...data, location: v })} placeholder="e.g. Bangalore, India" />
      <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50">
        <span className="text-sm font-medium text-foreground">Show Contact Form</span>
        <button
          onClick={() => onChange({ ...data, showForm: !data.showForm })}
          className={`w-11 h-6 rounded-full transition-colors ${data.showForm ? 'bg-primary' : 'bg-muted'}`}
        >
          <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${data.showForm ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SectionEditor({ portfolioId, sectionType, initialData = {}, onClose, onSaved }) {
  const originalData = useRef(initialData);
  const [formData, setFormData] = useState(initialData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    originalData.current = initialData;
    setFormData(initialData);
  }, [sectionType, initialData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await portfolioApi.update(portfolioId, { [sectionType]: formData });
      toast.success(`${SECTION_LABELS[sectionType]} section saved!`);
      onSaved?.({ [sectionType]: formData });
      onClose?.();
    } catch (err) {
      toast.error('Failed to save. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData.current);
    onClose?.();
  };

  const Icon = SECTION_ICONS[sectionType] || User;

  const renderForm = () => {
    switch (sectionType) {
      case 'hero':       return <HeroForm data={formData} onChange={setFormData} />;
      case 'about':      return <AboutForm data={formData} onChange={setFormData} />;
      case 'projects':   return <ProjectsForm data={formData} onChange={setFormData} />;
      case 'skills':     return <SkillsForm data={formData} onChange={setFormData} />;
      case 'experience': return <ExperienceForm data={formData} onChange={setFormData} />;
      case 'contact':    return <ContactForm data={formData} onChange={setFormData} />;
      default:           return <p className="text-muted-foreground text-sm">Unknown section type.</p>;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={handleCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-foreground text-lg">
                  Edit {SECTION_LABELS[sectionType] || sectionType}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Changes saved to your portfolio
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {renderForm()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-card">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground
                hover:text-foreground hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold
                bg-primary text-primary-foreground hover:bg-primary/90 transition
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Section
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}