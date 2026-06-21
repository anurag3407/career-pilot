import { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  Linkedin,
  BarChart3,
  LayoutTemplate,
  Eye,
  FileDown,
  PlusCircle,
  Github,
  TextSelect,
} from 'lucide-react';
import { resumeApi } from '../../services/api';
import HubLayout from '../../components/HubLayout';
import ToolCard from '../../components/ToolCard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import logger from '../../utils/logger';


export default function ResumeHub() {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [fontFamily, setFontFamily] = useState("Poppins")
  const [fontSize, setFontSize] = useState("Medium")
  const [colorTheme, setColorTheme] = useState("Blue")
  const [headerStyle, setHeaderStyle] = useState("Modern")
  const [pageMargin, setPageMargin] = useState("Normal")
  const [sectionSpacing, setSectionSpacing] = useState("Medium")

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await resumeApi.getAll();
        const fetchedResumes = Array.isArray(res.data)
          ? res.data
          : res.resumes || res.data?.resumes || [];
        setResumes(fetchedResumes);
      } catch {
        logger.error('Failed to fetch resumes');
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await resumeApi.delete(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success('Resume deleted');
    } catch {
      toast.error('Failed to delete resume');
    }
  };

  const stats = [
    {
      icon: FileText,
      value: resumes.length,
      label: 'Resumes',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  return (
    <HubLayout
      icon={FileText}
      title="Resume Builder"
      description="Build, enhance & optimize your resume with AI-powered tools. Upload, import from LinkedIn, or create from scratch."
      color="primary"
      breadcrumb="Resume Builder"
      stats={loading ? [] : stats}
    >
      <ToolCard
        to="/resume-builder"
        icon={PlusCircle}
        title="Create from Scratch"
        description="Build a structured, ATS-friendly resume from scratch using our multi-step builder."
        color="secondary"
      />
      <ToolCard
        to="/text-to-resume"
        icon={TextSelect}
        title="Text to Resume"
        description="Paste unformatted text or an old resume and let AI generate a structured markdown resume."
        badge="AI"
        color="primary"
      />
      <ToolCard
        to="/github-dashboard"
        icon={Github}
        title="GitHub to Resume"
        description="Import your GitHub profile and repositories to instantly generate a developer resume."
        color="foreground"
      />
      <ToolCard
        to="/upload"
        icon={Upload}
        title="Upload & Parse"
        description="Upload your PDF resume and let AI extract and structure the content."
        color="primary"
      />
      <ToolCard
        to="/upload"
        icon={Sparkles}
        title="AI Enhance"
        description="Transform your resume with ATS-optimized formatting and keyword suggestions."
        badge="AI"
        color="secondary"
      />
      <ToolCard
        to="/linkedin-dashboard"
        icon={Linkedin}
        title="LinkedIn Import"
        description="Import your LinkedIn profile and convert it into a polished resume instantly."
        color="primary"
      />
      <ToolCard
        to="/upload"
        icon={BarChart3}
        title="ATS Score Analyzer"
        description="Check how well your resume scores against Applicant Tracking Systems."
        badge="AI"
        color="emerald-500"
      />
      <ToolCard
        to="/templates"
        icon={LayoutTemplate}
        title="Resume Templates"
        description="Browse beautiful, professionally designed resume templates."
      />
      <ToolCard
        to="/upload"
        icon={FileDown}
        title="Download as PDF"
        description="Export your enhanced resume as a beautifully formatted PDF file."
      />

      {/* My Resumes Section */}
      {!loading && resumes.length > 0 && (
        <div className="col-span-full mt-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-secondary" />
            My Resumes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume, idx) => (
              <motion.div
                key={resume._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {new Date(resume.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-1 truncate">
                  {resume.title || resume.originalFilename || 'Untitled Resume'}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-xs text-muted-foreground">
                    {resume.enhancedText ? 'AI Enhanced' : 'Original'}
                  </p>
                  {resume.atsScore && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                      ATS: {resume.atsScore}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={
                      resume.enhancedText
                        ? `/enhance/${resume._id}`
                        : `/resume/${resume._id}`
                    }
                    className="flex-1 text-center text-xs font-semibold px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 inline mr-1" />
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="text-xs font-semibold px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </HubLayout>
  );
}
