import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  X, CheckCircle, Upload, Sparkles, Github,
  FolderPlus, Rocket, Bell, Trophy, PartyPopper, ArrowRight
} from 'lucide-react';
import { auth } from '../config/firebase';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const OnboardingChecklist = ({ user, onComplete, onDismiss }) => {
  const navigate = useNavigate();

  const [items, setItems] = useState([
    { id: 'resume_uploaded', label: 'Upload your resume', completed: false, icon: Upload, path: '/upload' },
    { id: 'resume_enhanced', label: 'Enhance your resume with AI', completed: false, icon: Sparkles, path: '/enhance' },
    { id: 'github_connected', label: 'Connect your GitHub', completed: false, icon: Github, path: '/dashboard/integrations' },
    { id: 'portfolio_created', label: 'Create your first portfolio', completed: false, icon: FolderPlus, path: '/portfolio' },
    { id: 'portfolio_deployed', label: 'Deploy your portfolio', completed: false, icon: Rocket, path: '/portfolio/deploy' },
    { id: 'job_alerts_setup', label: 'Set up job alerts', completed: false, icon: Bell, path: '/job-alerts' }
  ]);

  const [showCelebration, setShowCelebration] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  const getAuthHeaders = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Not authenticated');
    const token = await currentUser.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.uid) return;
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/users/onboarding/${user.uid}`, { headers });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();

        setItems(prevItems =>
          prevItems.map(item => ({
            ...item,
            completed: data.completedItems?.[item.id] || false
          }))
        );
        if (data.checklistDismissed) {
          setIsDismissed(true);
        }
      } catch (error) {
        const dismissedFlag = localStorage.getItem(`onboarding_dismissed_${user.uid}`);
        if (dismissedFlag === 'true') {
          setIsDismissed(true);
          return;
        }
        const saved = localStorage.getItem(`onboarding_${user.uid}`);
        if (saved) setItems(JSON.parse(saved));
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [user, getAuthHeaders]);

  useEffect(() => {
    const saveProgress = async () => {
      if (!user?.uid || loading) return;
      const completedItems = items.reduce((acc, item) => {
        acc[item.id] = item.completed;
        return acc;
      }, {});
      try {
        const headers = await getAuthHeaders();
        await fetch(`${API_BASE}/users/onboarding/${user.uid}`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ completedItems })
        });
        localStorage.setItem(`onboarding_${user.uid}`, JSON.stringify(items));
      } catch (error) {
        localStorage.setItem(`onboarding_${user.uid}`, JSON.stringify(items));
      }
    };
    saveProgress();
  }, [items, user, loading, getAuthHeaders]);

  useEffect(() => {
    const allCompleted = items.length > 0 && items.every(item => item.completed === true);
    if (allCompleted && !hasCelebrated && !loading) {
      setHasCelebrated(true);
      setShowCelebration(true);
      if (onComplete) onComplete();
      const timer = setTimeout(() => setShowCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
    if (!allCompleted) {
      setHasCelebrated(false);
    }
  }, [items, hasCelebrated, loading, onComplete]);

  const handleItemClick = useCallback((itemId, path) => {
    if (path) navigate(path);
  }, [navigate]);

  const handleDismiss = useCallback(async () => {
    setIsDismissed(true);
    if (user?.uid) {
      localStorage.setItem(`onboarding_dismissed_${user.uid}`, 'true');
      try {
        const headers = await getAuthHeaders();
        await fetch(`${API_BASE}/users/onboarding/${user.uid}/dismiss`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ dismissed: true })
        });
      } catch (error) {
        console.error('Error dismissing checklist:', error);
      }
    }
    if (onDismiss) onDismiss();
  }, [user, getAuthHeaders, onDismiss]);

  const ChecklistItem = ({ item, index }) => {
    const IconComponent = item.icon;
    return (
      <motion.button
        type="button"
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => !item.completed && handleItemClick(item.id, item.path)}
        disabled={item.completed}
        aria-pressed={item.completed}
        className={`
          w-full group relative flex items-center p-4 rounded-xl
          transition-all duration-200 border text-left
          ${item.completed
            ? 'bg-primary/5 border-primary/20 cursor-default'
            : 'bg-muted/50 hover:bg-muted border-border hover:border-primary/30 hover:shadow-md cursor-pointer'
          }
        `}
      >
        <div className={`
          flex-shrink-0 mr-4 transition-transform duration-200
          ${!item.completed && 'group-hover:scale-110'}
          ${item.completed ? 'text-primary' : 'text-muted-foreground'}
        `}>
          {item.completed ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <IconComponent className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1">
          <p className={`font-bold ${item.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
            {item.label}
          </p>
          {!item.completed && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Click to get started →
            </p>
          )}
        </div>
        {!item.completed && (
          <div className="flex-shrink-0">
            <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        )}
      </motion.button>
    );
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  if (loading || !user || isDismissed) return null;

  return (
    <>
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowCelebration(false)}
            />
            <motion.div
              initial={{ scale: 0.8, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: -50 }}
              className="relative bg-card border border-border rounded-2xl shadow-2xl p-8 text-center max-w-md mx-4 z-10"
            >
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.2, 1.2, 1.2, 1]
                }}
                transition={{ duration: 0.5 }}
              >
                <PartyPopper className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-black text-foreground mb-2">
                🎉 Congratulations! 🎉
              </h3>
              <p className="text-muted-foreground mb-2">
                You've completed all onboarding steps!
              </p>
              <p className="text-sm text-muted-foreground">
                Your profile is now ready to shine ✨
              </p>
              <button
                onClick={handleDismiss}
                className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-all duration-200 cursor-pointer"
                type="button"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-2xl border border-border overflow-hidden mb-8 shadow-sm"
      >
        <div className="bg-primary/10 border-b border-border px-6 py-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-primary" />
                <h3 className="text-foreground font-black text-lg">
                  🚀 Getting Started
                </h3>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                Complete these steps to make the most of Career Pilot
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-1.5 transition-all duration-200"
              aria-label="Dismiss checklist"
              title="Don't show again"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 pt-4 pb-2">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span className="font-medium">Your Progress</span>
            <span className="font-medium">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-primary h-2.5 rounded-full"
            />
          </div>
        </div>

        <div className="p-6 space-y-3">
          {items.map((item, index) => (
            <ChecklistItem key={item.id} item={item} index={index} />
          ))}
        </div>

        {completedCount > 0 && completedCount < totalCount && (
          <div className="bg-primary/5 border-t border-border px-6 py-3">
            <p className="text-sm text-primary text-center font-medium">
              🎯 You're making great progress! Keep going to complete your profile.
            </p>
          </div>
        )}

        {completedCount === totalCount && (
          <div className="bg-primary/5 border-t border-border px-6 py-3">
            <p className="text-sm text-primary text-center font-medium">
              ✨ Amazing! You've completed everything. Your profile is fully optimized! ✨
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default OnboardingChecklist;