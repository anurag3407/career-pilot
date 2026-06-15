import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { interviewApi } from "../services/api";
import QuestionAnalysisCard from "../components/interview/QuestionAnalysisCard";
import { format } from "date-fns";
import { Calendar, Clock, Trophy, ArrowLeft, Target, Briefcase } from "lucide-react";
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
              <QuestionAnalysisCard 
                key={answer.questionId || index} 
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