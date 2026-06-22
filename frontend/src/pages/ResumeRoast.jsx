import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, ArrowLeft, Sparkles, History } from 'lucide-react';
import RoastInput from '../components/roast/RoastInput';
import ShareCard from '../components/roast/ShareCard';
import { Button } from '../components/ui/button';
import { useRoastStore } from '../stores/useRoastStore';
import { roastApi } from '../services/api';
import { useAIConfigStore } from '../stores/useAIConfigStore';
import toast from 'react-hot-toast';

export default function ResumeRoast() {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [result, setResult] = useState(null);
  const setStoreResult = useRoastStore((s) => s.setResult);
  const setLoading = useRoastStore((s) => s.setLoading);
  const setError = useRoastStore((s) => s.setError);
  const isLoading = useRoastStore((s) => s.isLoading);
  const lastResult = useRoastStore((s) => s.lastResult);
  const activeProvider = useAIConfigStore((s) => s.activeProvider);

  // Hydrate from last persisted result on mount
  useEffect(() => {
    if (!result && lastResult) {
      setResult(lastResult);
    }
  }, []); // eslint-disable-line

  const submit = async () => {
    if (!activeProvider) {
      toast.error('Add an AI provider key in Settings first');
      navigate('/settings');
      return;
    }
    setLoading(true);
    try {
      const res = await roastApi.create({ resumeText, jobRole });
      const data = res.data || res;
      setResult(data);
      setStoreResult(data);
      toast.success(`Roasted! Score: ${data.overallScore}/100`);
    } catch (err) {
      console.error(err);
      const msg = err?.message || 'Roast failed — please try again';
      setError(msg);
      if (err?.status === 403 || err?.requireApiKey) {
        toast.error('Add an AI provider key in Settings first');
        navigate('/settings');
      } else {
        toast.error(msg);
      }
    }
  };

  const startOver = () => {
    setResult(null);
    setResumeText('');
    setJobRole('');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Link
            to="/hub/roast"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Roast Hub
          </Link>
          <Link
            to="/hub/roast"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <History className="w-4 h-4" />
            History
          </Link>
        </motion.div>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3">
            <Flame className="w-3.5 h-3.5" />
            BYOK · Zero cost to you
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            🔥 Resume Roast
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Brutally honest. Surprisingly helpful. 100% free — uses your own AI key.
            <br />
            <span className="text-xs">Shareable to LinkedIn when you survive it.</span>
          </p>
        </motion.div>

        {/* Content */}
        {!result ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 md:p-8"
          >
            <RoastInput
              value={resumeText}
              onChange={setResumeText}
              jobRole={jobRole}
              onJobRoleChange={setJobRole}
              onSubmit={submit}
              isLoading={isLoading}
            />

            {!activeProvider && (
              <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  You haven't set up an AI provider yet.{' '}
                  <Link to="/settings" className="text-amber-600 font-semibold hover:underline">
                    Add your key
                  </Link>{' '}
                  to start roasting — your key never leaves your browser.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="space-y-5">
            <ShareCard result={result} jobRole={jobRole} />
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button onClick={startOver} variant="outline" size="lg">
                🔥 Roast another
              </Button>
              <Link to="/hub/resume">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg">
                  🛠 Fix this with the Builder
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}