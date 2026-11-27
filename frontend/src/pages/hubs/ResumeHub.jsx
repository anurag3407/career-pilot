import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FileText,
  Upload,
  Sparkles,
  Linkedin,
  LayoutTemplate,
  Eye,
  PlusCircle,
  Github,
  TextSelect,
  Flame,
  Mail,
  BookOpen,
  Star,
  Search,
  Trash2,
} from 'lucide-react';
import { careerProfileApi, resumeApi } from '../../services/api';
import HubLayout from '../../components/HubLayout';
import ToolCard from '../../components/ToolCard';
import { resumeDocToText } from '../../utils/resumeText';

export default function ResumeHub() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [careerProfile, setCareerProfile] = useState(null);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [res, profRes] = await Promise.all([
          resumeApi.getAll(),
          careerProfileApi.get().catch(() => null),
        ]);
        const fetchedResumes = Array.isArray(res.data)
          ? res.data
          : res.resumes || res.data?.resumes || [];
        setResumes(fetchedResumes);
        setCareerProfile(profRes?.profile || null);
      } catch {
        toast.error('Failed to load resumes');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const getId = (r) => r.id || r._id;

  const handleDelete = async (id) => {
    try {
      await resumeApi.delete(id);
      setResumes((prev) => prev.filter((r) => getId(r) !== id));
      toast.success('Resume deleted');
    } catch {
      toast.error('Failed to delete resume');
    }
  };

  const handleSetMaster = async (resume) => {
    const rid = getId(resume);
    try {
      const text = resumeDocToText(resume);
      await careerProfileApi.update({
        masterResumeId: rid,
        masterResumeText: text,
        targetRoles: careerProfile?.targetRoles || [],
        weeklyApplyTarget: careerProfile?.weeklyApplyTarget ?? 5,
      });
      setCareerProfile((prev) => ({ ...(prev || {}), masterResumeId: rid }));
      toast.success(`"${resume.title || 'Resume'}" set as master resume`);
    } catch (err) {
      toast.error(err?.message || 'Could not update master resume');
    }
  };

  const filteredResumes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resumes.filter((r) => {
      const rid = getId(r);
      if (filter === 'enhanced' && !r.enhancedText) return false;
      if (filter === 'master' && rid !== careerProfile?.masterResumeId) return false;
      if (!q) return true;
      return (
        (r.title || '').toLowerCase().includes(q) ||
        (r.jobRole || '').toLowerCase().includes(q) ||
        (r.originalFilename || '').toLowerCase().includes(q)
      );
    });
  }, [resumes, filter, query, careerProfile]);

  const enhancedCount = resumes.filter((r) => Boolean(r.enhancedText)).length;

  const stats = [
    {
      icon: FileText,
      value: resumes.length,
      label: 'Total resumes',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Sparkles,
      value: enhancedCount,
      label: 'AI enhanced',
      color: 'text-accent-foreground',
      bg: 'bg-accent',
    },
  ];

  return (
    <HubLayout
      icon={FileText}
      title="Resume & Document Studio"
      description="Create ATS-friendly resumes from scratch, parse PDFs, tailor versions for applications, and draft cover letters."
      color="primary"
      suite="01 Career Studio"
      breadcrumb="Resume & Documents"
      stats={loading ? [] : stats}
      actions={
        <>
          <Link
            to="/upload"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-semibold text-foreground transition hover:border-primary/40"
          >
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            Upload PDF
          </Link>
          <Link
            to="/resume-builder/build"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
          >
            <PlusCircle className="h-3.5 w-3.5" aria-hidden="true" />
            New resume
          </Link>
        </>
      }
    >
      <ToolCard
        to="/resume-builder/build"
        icon={PlusCircle}
        title="Resume Builder"
        description="Build a structured, ATS-ready resume step by step with live preview and PDF or DOCX export."
        color="primary"
      />
      <ToolCard
        to="/upload"
        icon={Upload}
        title="Upload & AI Enhance"
        description="Upload a PDF resume to parse its structure, check ATS signals, and enhance bullet points."
        badge="AI"
        color="secondary"
      />
      <ToolCard
        to="/text-to-resume"
        icon={TextSelect}
        title="Text to Resume"
        description="Paste raw notes or plain-text experience and convert it into a formatted resume."
        badge="AI"
        color="primary"
      />
      <ToolCard
        to="/cover-letter"
        icon={Mail}
        title="Cover Letter Studio"
        description="Generate role-tailored cover letters from your saved resumes and target job descriptions."
        color="emerald"
      />
      <ToolCard
        to="/resume-roast/analyze"
        icon={Flame}
        title="Resume Roast"
        description="Get direct AI critique on weak bullets, missing metrics, and formatting gaps."
        color="amber"
      />
      <ToolCard
        to="/resume-templates"
        icon={LayoutTemplate}
        title="Resume Templates"
        description="Browse ATS-tested layouts engineered for technical and leadership roles."
        color="foreground"
      />
      <ToolCard
        to="/resume-examples"
        icon={BookOpen}
        title="Resume Examples"
        description="Inspect strong role benchmarks and phrasing patterns before writing your own."
        color="foreground"
      />
      <ToolCard
        to="/github"
        icon={Github}
        title="GitHub to Resume"
        description="Import your GitHub repositories and top languages directly into a developer resume."
        color="foreground"
      />
      <ToolCard
        to="/linkedin"
        icon={Linkedin}
        title="LinkedIn Import & Optimizer"
        description="Convert your LinkedIn profile into a resume or rewrite your headline and About section."
        color="primary"
      />

      {/* My Resumes Library */}
      <div className="col-span-full mt-8 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">My Resumes</h2>
            <p className="text-xs text-muted-foreground">
              Mark one resume as your Master Resume so Job Tracker, Mock Interview, and Composer prefill automatically.
            </p>
          </div>

          {resumes.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search resumes..."
                  aria-label="Search resumes"
                  className="h-8 w-44 rounded-lg border border-border bg-card pl-8 pr-3 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>
              {['all', 'enhanced', 'master'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                    filter === key
                      ? 'border-primary/40 bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Loading your resumes...
          </div>
        ) : resumes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
            <FileText className="mx-auto h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-foreground">No resumes saved yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Start from scratch in the builder or upload an existing PDF to unlock AI enhancement.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Link
                to="/resume-builder/build"
                className="inline-flex h-8 items-center rounded-md bg-primary px-3.5 text-xs font-semibold text-primary-foreground"
              >
                Create resume
              </Link>
              <Link
                to="/upload"
                className="inline-flex h-8 items-center rounded-md border border-border bg-background px-3.5 text-xs font-semibold text-foreground"
              >
                Upload PDF
              </Link>
            </div>
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No resumes match the current filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResumes.map((resume) => {
              const rid = getId(resume);
              const isMaster = Boolean(careerProfile?.masterResumeId && rid === careerProfile.masterResumeId);
              return (
                <div
                  key={rid}
                  className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/35"
                >
                  <div>
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileText className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {resume.createdAt
                          ? new Date(resume.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Saved'}
                      </span>
                    </div>

                    <h3 className="truncate text-[15px] font-semibold text-foreground">
                      {resume.title || resume.originalFilename || 'Untitled Resume'}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {resume.enhancedText ? 'AI Enhanced' : 'Draft'}
                      </span>
                      {isMaster && (
                        <span className="rounded border border-accent-foreground/30 bg-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-foreground">
                          Master
                        </span>
                      )}
                      {resume.atsScore && (
                        <span className="rounded border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                          ATS {resume.atsScore}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 border-t border-border pt-3">
                    <Link
                      to={`/resume/${rid}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      View
                    </Link>
                    <Link
                      to={`/enhance/${rid}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                    >
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      Enhance
                    </Link>
                    {!isMaster && (
                      <button
                        type="button"
                        onClick={() => handleSetMaster(resume)}
                        title="Set as Master Resume"
                        aria-label="Set as Master Resume"
                        className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        <Star className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(rid)}
                      title="Delete resume"
                      aria-label="Delete resume"
                      className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </HubLayout>
  );
}
