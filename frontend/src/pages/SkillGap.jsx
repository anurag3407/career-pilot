import React, { useState, useEffect } from 'react';
import { Target, Sparkles, CheckCircle, XCircle, TrendingUp, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { enhanceApi, resumeApi } from '../services/api';
import toast from 'react-hot-toast';
import CopyButton from '../components/CopyButton';
import logger from '../utils/logger';
const SkillGap = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await resumeApi.getAll();
        const list = response.data || response.resumes || [];
        setResumes(list);
        if (list.length > 0) setSelectedResumeId(list[0]._id);
      } catch (error) {
        toast.error('Failed to load resumes');
      } finally {
        setLoadingResumes(false);
      }
    };
    fetchResumes();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!selectedResumeId) {
      toast.error('Please select a resume');
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const resumeResponse = await resumeApi.getById(selectedResumeId);
      const resume = resumeResponse.data || resumeResponse;
      const resumeText = resume.originalText || resume.enhancedText || '';

      if (!resumeText) {
        toast.error('Selected resume has no text content');
        setLoading(false);
        return;
      }

      const response = await enhanceApi.analyzeSkillGap(resumeText, jobDescription);
      setResults(response.data);
    } catch (error) {
      logger.error('Skill gap analysis error:', error);
      toast.error(error.message || 'Failed to analyze skill gap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
    if (score >= 40) return 'bg-orange-500/10 border-orange-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Skill Gap Analyzer
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Skill Gap Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare your resume against any job description to identify matching skills, gaps, and get personalized learning suggestions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleAnalyze} className="space-y-6">
              {/* Resume Selector */}
              <div className="bg-card border border-border rounded-xl p-6">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  <FileText className="w-4 h-4 text-primary" />
                  Select Resume
                </label>
                {loadingResumes ? (
                  <div className="h-10 bg-muted animate-pulse rounded-lg" />
                ) : resumes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No resumes found. Please upload a resume first.
                  </p>
                ) : (
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {resumes.map((resume) => (
                      <option key={resume._id} value={resume._id}>
                        {resume.title || resume.jobRole || 'Untitled Resume'} — {new Date(resume.createdAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Job Description Input */}
              <div className="bg-card border border-border rounded-xl p-6">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                  <Target className="w-4 h-4 text-primary" />
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={12}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !selectedResumeId || !jobDescription.trim()}
                className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    Analyze Skill Gap
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {!results && !loading && (
              <div className="bg-card border border-border rounded-xl p-12 text-center">
                <Target className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a resume and paste a job description to see your skill gap analysis.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-card border border-border rounded-xl p-8 space-y-4">
                <div className="h-6 bg-muted animate-pulse rounded w-1/3 mx-auto" />
                <div className="h-20 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-8 bg-muted animate-pulse rounded-full" />
                  ))}
                </div>
              </div>
            )}

            {results && (
              <>
                {/* Match Score */}
                <div className={`border rounded-xl p-6 text-center ${getScoreBg(results.matchScore)}`}>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Match Score</p>
                  <p className={`text-5xl font-bold ${getScoreColor(results.matchScore)}`}>
                    {results.matchScore}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {results.matchScore >= 80 && 'Excellent match! You are well-qualified.'}
                    {results.matchScore >= 60 && results.matchScore < 80 && 'Good match with some areas to improve.'}
                    {results.matchScore >= 40 && results.matchScore < 60 && 'Moderate match. Focus on the missing skills.'}
                    {results.matchScore < 40 && 'Significant gaps. Consider upskilling before applying.'}
                  </p>
                </div>

                {/* Matched Skills */}
                {results.matchedSkills.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Matched Skills ({results.matchedSkills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {results.matchedSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 text-sm bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {results.missingSkills.length > 0 && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
                      <XCircle className="w-4 h-4 text-red-500" />
                      Missing Skills ({results.missingSkills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {results.missingSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 text-sm bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {results.suggestions && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Learning Suggestions
                      </h3>
                      <CopyButton text={results.suggestions} label="Copy" size={14} />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {results.suggestions}
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SkillGap;
