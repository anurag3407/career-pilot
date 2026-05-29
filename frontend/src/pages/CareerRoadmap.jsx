import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, MapPin, ArrowRight, CheckCircle2, ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { aiApi } from '../services/api';
import toast from 'react-hot-toast';

export default function CareerRoadmap() {
  const navigate = useNavigate();
  const [targetCareer, setTargetCareer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!targetCareer.trim()) return;

    setIsLoading(true);
    try {
      const response = await aiApi.generateRoadmap(targetCareer);
      if (response.success && response.roadmap) {
        setRoadmap(response.roadmap);
        toast.success('Roadmap generated successfully!');
      } else {
        toast.error('Failed to generate roadmap');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while generating the roadmap');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/hub/career')}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Career Growth Hub
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 text-primary">
            <Map className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">AI Career Roadmap</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get a personalized, step-by-step timeline to reach your dream career. Tell us what you want to be, and our AI will chart the path.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="max-w-xl mx-auto mb-16 relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={targetCareer}
              onChange={(e) => setTargetCareer(e.target.value)}
              placeholder="e.g., Software Engineer, Data Scientist, Product Manager..."
              className="w-full pl-6 pr-32 py-4 bg-card border-2 border-border focus:border-primary rounded-2xl text-foreground placeholder:text-muted-foreground outline-none transition-all text-lg shadow-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!targetCareer.trim() || isLoading}
              className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-xl font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {roadmap && (
            <motion.div
              key="roadmap"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="relative"
            >
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border rounded-full" />
              
              <div className="space-y-12">
                {roadmap.roadmap?.map((step, index) => (
                  <motion.div key={index} variants={itemVariants} className="relative pl-20">
                    <div className="absolute left-6 top-1.5 w-4 h-4 bg-primary rounded-full shadow-[0_0_0_4px_var(--background)] ring-2 ring-primary/20 z-10" />
                    
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-primary tracking-wider uppercase bg-primary/10 px-3 py-1 rounded-full">
                          Year {step.year}
                        </span>
                        <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                      </div>
                      
                      <p className="text-muted-foreground mb-6">{step.description}</p>
                      
                      <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                        <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" /> Key Milestones
                        </h4>
                        <ul className="space-y-3">
                          {step.milestones.map((milestone, mIndex) => (
                            <li key={mIndex} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-foreground/90">{milestone}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={itemVariants} className="mt-12 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full mb-4 text-emerald-500 ring-1 ring-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">You reached your goal!</h3>
                <p className="text-muted-foreground">{roadmap.career}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
