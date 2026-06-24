import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Button from '../../../components/Button';

export default function WarmupRound({
  warmupQuestions,
  warmupIndex,
  completeWarmup
}) {
  const wq = warmupQuestions[warmupIndex];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-xl w-full">
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs">
            <Sparkles className="w-3 h-3" /> Warmup · not scored
          </span>
        </div>
        <div className="p-8 rounded-3xl bg-background/60 border border-border backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Warmup question {warmupIndex + 1} of {warmupQuestions.length}
          </h2>
          <p className="text-lg text-foreground/90 leading-relaxed">{wq?.question}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            This won't count toward your score — just a chance to find your rhythm.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={completeWarmup} className="flex-1">
              Skip warmup
            </Button>
            <Button variant="primary" onClick={completeWarmup} className="flex-1">
              {warmupIndex + 1 >= warmupQuestions.length ? 'Start real interview' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
