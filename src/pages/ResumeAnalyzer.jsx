import { motion as Motion } from 'framer-motion';
import { BarChart3, Sparkles } from 'lucide-react';
import { useResumeAnalyzer } from '../hooks/useResumeAnalyzer';
import ResumeUploader from '../components/ResumeAnalyzer/ResumeUploader';
import ScoreCard from '../components/ResumeAnalyzer/ScoreCard';
import SectionAnalysis from '../components/ResumeAnalyzer/SectionAnalysis';
import ATSChecker from '../components/ResumeAnalyzer/ATSChecker';
import KeywordSuggestions from '../components/ResumeAnalyzer/KeywordSuggestions';
import ImprovementTips from '../components/ResumeAnalyzer/ImprovementTips';

export default function ResumeAnalyzer() {
  const {
    file,
    analysis,
    loading,
    extracting,
    error,
    acceptedTypes,
    selectFile,
    clearFile,
    runAnalysis,
    setError,
  } = useResumeAnalyzer();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Resume Strength Score Analyzer
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Upload your resume to get an instant ATS-friendly score with actionable feedback.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Local analysis — your file is processed in the browser and never uploaded.</span>
        </div>
      </Motion.div>

      <ResumeUploader
        file={file}
        onFileSelect={selectFile}
        onClear={clearFile}
        onAnalyze={runAnalysis}
        onError={setError}
        loading={loading}
        extracting={extracting}
        error={error}
        acceptedTypes={acceptedTypes}
      />

      {analysis && !analysis.error && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <ScoreCard score={analysis.totalScore} breakdown={analysis.breakdown} />
          <SectionAnalysis sections={analysis.sections} />
          <ATSChecker atsScore={analysis.atsScore} atsChecks={analysis.atsChecks} />
          <KeywordSuggestions
            keywordsFound={analysis.keywordsFound}
            keywordsMissing={analysis.keywordsMissing}
          />
          <ImprovementTips tips={analysis.improvementTips} />
        </Motion.div>
      )}
    </div>
  );
}
