import { Code2, Clock, Zap, AlertTriangle } from 'lucide-react';

/**
 * CodingQuestionCard — shows a coding problem statement with constraints,
 * complexity hints, and visible test cases.
 *
 * Props:
 *   coding  - the coding subdocument from the Interview question:
 *             { language, problemStatement, constraints, testCases, timeComplexity, spaceComplexity, starterCode }
 *   runResults - optional results from the last runCode() call:
 *                { results: [{ input, expected, actual, passed }], summary }
 */
export default function CodingQuestionCard({ coding, runResults }) {
  if (!coding) return null;
  const visibleTests = (coding.testCases || []).filter((tc) => !tc.hidden);

  return (
    <div className="p-6 rounded-2xl bg-background/50 border border-border space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
          <Code2 className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-medium text-purple-400 uppercase tracking-wide">
            Coding · {coding.language}
          </span>
          <h3 className="text-lg font-semibold text-foreground mt-1 whitespace-pre-wrap">
            {coding.problemStatement}
          </h3>
        </div>
      </div>

      {coding.constraints && (
        <div className="p-3 rounded-xl bg-muted/30 border border-border">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
            Constraints
          </p>
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {coding.constraints}
          </p>
        </div>
      )}

      {(coding.timeComplexity || coding.spaceComplexity) && (
        <div className="flex flex-wrap gap-3">
          {coding.timeComplexity && (
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300">
              <Clock className="w-3 h-3" />
              Time: {coding.timeComplexity}
            </span>
          )}
          {coding.spaceComplexity && (
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <Zap className="w-3 h-3" />
              Space: {coding.spaceComplexity}
            </span>
          )}
        </div>
      )}

      {visibleTests.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Sample test cases
          </p>
          {visibleTests.map((tc, idx) => {
            const result = runResults?.results?.[idx];
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-muted/20 border border-border font-mono text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted-foreground">Example {idx + 1}</span>
                  {result && (
                    <span
                      className={
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ' +
                        (result.passed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30')
                      }
                    >
                      {result.passed ? 'PASS' : 'FAIL'}
                    </span>
                  )}
                </div>
                <div className="text-foreground">
                  <span className="text-muted-foreground">Input: </span>
                  {tc.input}
                </div>
                <div className="text-foreground">
                  <span className="text-muted-foreground">Expected: </span>
                  {tc.expected}
                </div>
                {result && (
                  <div className="text-foreground mt-1">
                    <span className="text-muted-foreground">Actual: </span>
                    <span className={result.passed ? 'text-emerald-300' : 'text-red-300'}>
                      {result.actual}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {runResults?.summary && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-200">{runResults.summary}</p>
        </div>
      )}
    </div>
  );
}
