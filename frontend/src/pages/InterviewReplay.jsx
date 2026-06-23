import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { interviewApi } from "../services/api";
import QuestionAnalysisCard from "../components/interview/QuestionAnalysisCard";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Trophy,
  ArrowLeft,
  Target,
  Briefcase,
  Volume2,
  StickyNote,
  Save,
  Loader2,
  CheckCircle2
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function InterviewReplay() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    loadInterview(controller.signal);
    return () => controller.abort();
  }, [id]);

  const loadInterview = async (signal) => {
    try {
      setLoading(true);
      setError(null);
      const response = await interviewApi.getById(id);
      if (!signal.aborted) {
        setInterview(response.data);
      }
    } catch (err) {
      if (!signal.aborted) {
        console.error(err);
        setError(err.message || "Failed to fetch interview details");
        setInterview(null);
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score >= 60) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Error Loading Interview</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <button
          onClick={() => navigate('/interview-history')}
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </button>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Interview Not Found</h2>
        <button
          onClick={() => navigate('/interview-history')}
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header and Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/interview-history')}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
              {interview.jobRole || "Mock Interview"}
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreBadgeColor(interview.overallScore || 0)}`}>
                {interview.overallScore || 0}% Score
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{interview.completedAt || interview.createdAt ? format(new Date(interview.completedAt || interview.createdAt), "MMMM d, yyyy") : "Date unavailable"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{Math.round((interview.duration || 0) / 60)} minutes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span className="capitalize">{interview.experienceLevel} Level</span>
              </div>
              {interview.industry && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>{interview.industry}</span>
                </div>
              )}
              {interview.mode && interview.mode !== 'behavioral' && (
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium capitalize">
                    {interview.mode}
                  </span>
                </div>
              )}
              {interview.companyName && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span className="capitalize">{interview.companyName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overall Feedback Section */}
      {interview.overallFeedback && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8">
          <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Overall Feedback
          </h3>
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
            {typeof interview.overallFeedback === 'string' ? (
              <ReactMarkdown>{interview.overallFeedback}</ReactMarkdown>
            ) : (
              <div className="space-y-4">
                {interview.overallFeedback.summary && (
                  <p className="mb-4 text-foreground leading-relaxed">{interview.overallFeedback.summary}</p>
                )}

                {interview.overallFeedback.topStrengths && interview.overallFeedback.topStrengths.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-foreground font-semibold mb-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      Top Strengths
                    </h4>
                    <ul className="list-none space-y-1 pl-4">
                      {interview.overallFeedback.topStrengths.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1 shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {interview.overallFeedback.areasToImprove && interview.overallFeedback.areasToImprove.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-foreground font-semibold mb-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                      Areas to Improve
                    </h4>
                    <ul className="list-none space-y-1 pl-4">
                      {interview.overallFeedback.areasToImprove.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-500 mt-1 shrink-0">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {interview.overallFeedback.recommendations && interview.overallFeedback.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-foreground font-semibold mb-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sky-500"></div>
                      Recommendations
                    </h4>
                    <ul className="list-none space-y-1 pl-4">
                      {interview.overallFeedback.recommendations.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-sky-500 mt-1 shrink-0">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Answers / Question Analysis Cards */}
      <div className="space-y-6">
        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
          Detailed Analysis ({interview.answers?.length || 0} Questions)
        </h3>

        {interview.answers && interview.answers.length > 0 ? (
          <div className="space-y-4">
            {interview.answers.map((answer, index) => (
              <AnswerWithExtras
                key={answer._id || answer.questionId || index}
                interviewId={interview._id}
                answer={answer}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">No answers recorded for this session.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AnswerWithExtras — wraps QuestionAnalysisCard with audio playback and
// personal annotations. Annotations persist via /interview/:id/annotate/:answerId.
// ---------------------------------------------------------------------------
function AnswerWithExtras({ interviewId, answer, index }) {
  const [annotation, setAnnotation] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [annotations, setAnnotations] = useState(answer.annotations || []);

  const saveAnnotation = async () => {
    if (!annotation.trim() || !answer._id) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await interviewApi.annotate(interviewId, answer._id, annotation.trim());
      if (res?.data?.annotations) {
        setAnnotations(res.data.annotations);
      } else {
        setAnnotations((prev) => [...prev, { text: annotation.trim(), createdAt: new Date().toISOString() }]);
      }
      setAnnotation('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Annotation save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {answer.audioUrl && (
        <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-primary shrink-0" />
          <audio
            src={answer.audioUrl}
            controls
            preload="metadata"
            className="w-full h-9"
          />
        </div>
      )}

      <QuestionAnalysisCard answer={answer} index={index} />

      {answer.code && (
        <div className="rounded-2xl border border-border bg-[#0f172a] p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
            Submitted Code
          </p>
          <pre className="text-xs text-slate-200 overflow-auto whitespace-pre-wrap font-mono leading-relaxed">
            {answer.code}
          </pre>
        </div>
      )}

      {answer._id && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <StickyNote className="w-4 h-4 text-amber-400" />
            Your notes
          </div>

          {annotations.length > 0 && (
            <ul className="space-y-2">
              {annotations.map((a, i) => (
                <li
                  key={i}
                  className="text-sm text-foreground bg-amber-500/10 border border-amber-500/20 rounded-lg p-3"
                >
                  {a.text}
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-start gap-2">
            <textarea
              value={annotation}
              onChange={(e) => setAnnotation(e.target.value)}
              placeholder="What would you say differently next time?"
              rows={2}
              className="flex-1 text-sm bg-muted/40 border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary focus:border-primary/50 resize-y"
            />
            <button
              onClick={saveAnnotation}
              disabled={!annotation.trim() || saving}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
