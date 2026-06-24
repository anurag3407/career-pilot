import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Play, Loader2 } from 'lucide-react';
import Button from '../../../components/Button';

const CodeEditor = lazy(() => import('../../../components/interview/CodeEditor'));
const CodingQuestionCard = lazy(() => import('../../../components/interview/CodingQuestionCard'));

export default function CodingRound({
  codingQuestion,
  questions,
  runResults,
  formData,
  code,
  setCode,
  runCandidateCode,
  isRunningCode,
  textAnswer,
  setTextAnswer,
  submitTextAnswer,
  loading
}) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <Suspense fallback={<div className="h-40 flex items-center justify-center text-muted-foreground">Loading problem…</div>}>
        <CodingQuestionCard
          coding={codingQuestion || questions[0]?.coding}
          runResults={runResults}
        />
      </Suspense>
      
      <div className="p-4 rounded-2xl bg-background/50 border border-border space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Your solution · {formData.codingLanguage}
          </span>
          <Button
            onClick={() => runCandidateCode(formData.codingLanguage)}
            disabled={isRunningCode || !code?.trim()}
            variant="outline"
            className="!py-2 !px-3 !text-xs"
          >
            {isRunningCode ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Play className="w-3.5 h-3.5 mr-1.5" />}
            {isRunningCode ? 'Evaluating…' : 'Run Tests'}
          </Button>
        </div>
        <Suspense fallback={<div className="h-32 flex items-center justify-center text-muted-foreground text-sm">Loading editor…</div>}>
          <CodeEditor
            language={formData.codingLanguage}
            value={code}
            onChange={setCode}
            height="320px"
          />
        </Suspense>
      </div>

      <textarea
        value={textAnswer}
        onChange={(e) => setTextAnswer(e.target.value)}
        placeholder="Optional: explain your approach (will be analyzed alongside your code)…"
        rows={3}
        className="w-full p-3 rounded-xl bg-muted/40 border border-border text-sm text-foreground focus:ring-2 focus:ring-primary resize-y"
      />
      
      <Button
        onClick={submitTextAnswer}
        disabled={loading || !code?.trim()}
        variant="primary"
        className="w-full !py-4 !rounded-xl flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {loading ? 'Submitting…' : 'Submit Solution'}
      </Button>

      <div className="p-4 rounded-xl bg-muted/30 border border-border">
        <p className="text-xs text-muted-foreground text-center">
          Submit when your solution passes the visible test cases.
        </p>
      </div>
    </motion.div>
  );
}
