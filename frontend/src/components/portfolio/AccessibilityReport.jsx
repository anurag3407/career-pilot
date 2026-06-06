import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle, RefreshCw } from 'lucide-react';

const SeverityIcon = ({ severity, className }) => {
  const baseClass = className || "w-5 h-5";
  switch (severity) {
    case 'critical':
      return <AlertCircle className={`${baseClass} text-red-500`} />;
    case 'serious':
      return <AlertTriangle className={`${baseClass} text-orange-500`} />;
    case 'moderate':
      return <AlertTriangle className={`${baseClass} text-yellow-500`} />;
    case 'minor':
      return <Info className={`${baseClass} text-blue-500`} />;
    default:
      return null;
  }
};

const SeverityBadge = ({ severity }) => {
  const colors = {
    critical: 'bg-red-500/10 text-red-500 border-red-500/20',
    serious: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    moderate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    minor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[severity] || 'bg-muted text-muted-foreground border-border'}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
};

const getIssueKey = (issue) => {
  if (issue.id) return issue.id;
  return [issue.severity, issue.rule, issue.element, issue.suggestion].filter(Boolean).join('|');
};

const AccessibilityReport = ({ report, onRecheck, isLoading }) => {
  if (!report && !isLoading) {
    return (
      <div className="p-8 bg-card backdrop-blur-sm rounded-xl border border-border flex flex-col items-center text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-cyan-400" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Automated Accessibility Scan</h3>
        <p className="text-muted-foreground mb-6 max-w-lg">
          Evaluate your portfolio against modern WCAG guidelines. We'll check for 
          color contrast ratios, missing ARIA tags, screen reader compatibility, 
          and general semantic HTML structure.
        </p>
        <button
          onClick={onRecheck}
          className="inline-flex items-center px-5 py-2.5 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.25)]"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Run Accessibility Check
        </button>
      </div>
    );
  }

  const hasReport = Boolean(report);
  const { score = 100, issues = [] } = report || {};
  const scoreClassName = score >= 90 ? 'text-emerald-500' : score >= 70 ? 'text-yellow-500' : 'text-red-500';

  const issuesBySeverity = issues.reduce((acc, issue) => {
    if (!acc[issue.severity]) {
      acc[issue.severity] = [];
    }
    acc[issue.severity].push(issue);
    return acc;
  }, {});

  const severityOrder = ['critical', 'serious', 'moderate', 'minor'];

  return (
    <div className="p-6 bg-card backdrop-blur-sm rounded-xl border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Accessibility Report</h3>
          <p className="text-muted-foreground text-sm">Automated evaluation based on WCAG guidelines.</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-end">
            <span className="text-sm text-muted-foreground">Overall Score</span>
            <div className="flex items-center">
              <span className={`text-2xl font-bold ${hasReport ? scoreClassName : 'text-muted-foreground'}`}>
                {hasReport ? `${score}%` : '--'}
              </span>
            </div>
          </div>
          <button
            onClick={onRecheck}
            disabled={isLoading}
            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors disabled:opacity-50 flex items-center font-medium border border-transparent hover:border-border"
            title="Re-check"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Re-check
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <RefreshCw className="w-8 h-8 animate-spin mb-4 text-cyan-500" />
          <p>Running accessibility checks...</p>
        </div>
      ) : issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-emerald-500 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <CheckCircle className="w-12 h-12 mb-3" />
          <p className="font-medium">All accessibility checks passed!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {severityOrder.map((severity) => {
            const severityIssues = issuesBySeverity[severity];
            if (!severityIssues || severityIssues.length === 0) return null;

            return (
              <div key={severity} className="space-y-3">
                <h4 className="font-medium flex items-center capitalize text-foreground">
                  <SeverityIcon severity={severity} className="w-5 h-5 mr-2" />
                  {severity} Issues ({severityIssues.length})
                </h4>
                <div className="space-y-3">
                  {severityIssues.map((issue) => (
                    <div key={getIssueKey(issue)} className="p-4 rounded-lg border border-border bg-background/50 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <SeverityBadge severity={issue.severity} />
                          <span className="font-semibold text-foreground">{issue.rule}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-sm">
                          <strong className="text-muted-foreground block mb-1">Element:</strong>
                          <code className="bg-muted px-2 py-1 rounded text-xs break-all text-rose-400 font-mono border border-border">
                            {issue.element}
                          </code>
                        </div>
                        <div className="text-sm">
                          <strong className="text-muted-foreground block mb-1">Fix Suggestion:</strong>
                          <p className="text-foreground bg-cyan-500/10 p-2 rounded border border-cyan-500/20">
                            {issue.suggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AccessibilityReport;
