import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, Search, Zap, Users, Bot, AlertTriangle, 
  ArrowRight, History, Loader2, Trash2, Clock, Star, GitFork, Package, BookOpen, BrainCircuit
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';
import { projectVisualizerApi } from '../../services/api';
import { cn } from '../../lib/utils';
import { HeroSection } from '../../components/ui/hero-section-dark';

const Landing = () => {
  const [url, setUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  
  const navigate = useNavigate();
  const { setStatus, setAnalysisData, setRepoUrl, status, reset } = useProjectVisualizerStore();

  useEffect(() => {
    reset();
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const data = await projectVisualizerApi.getHistory();
      if (data?.success !== false) {
        setHistory(data);
      }
    } catch (e) {
      console.warn("Failed to load history");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleDeleteHistory = async (id, e) => {
    e.stopPropagation();
    try {
      await projectVisualizerApi.deleteHistory(id);
      setHistory(prev => prev.filter(h => h._id !== id));
      toast.success('History deleted');
    } catch (e) {
      toast.error('Failed to delete history');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.includes('github.com')) {
      toast.error('Please enter a valid GitHub repository URL');
      return;
    }

    try {
      setStatus('analyzing');
      setRepoUrl(url);
      
      toast.loading('Analyzing repository...', { id: 'analyze' });
      
      const result = await projectVisualizerApi.analyze(url);
      
      toast.success('Analysis complete!', { id: 'analyze' });
      
      setAnalysisData(result);
      navigate(`/project-visualizer/dashboard/${result.sessionId}`);
      
    } catch (error) {
      setStatus('error');
      toast.error(error.message || 'Failed to analyze repository', { id: 'analyze' });
    }
  };

  const features = [
    {
      title: "Architecture Map",
      desc: "Interactive visual module dependency graph",
      icon: <GitBranch className="w-6 h-6 text-cyan-400" />,
      color: "from-cyan-500/20 to-cyan-500/0"
    },
    {
      title: "Dependency Scanner",
      desc: "Automatically check packages for vulnerabilities and updates",
      icon: <Package className="w-6 h-6 text-amber-400" />,
      color: "from-amber-500/20 to-amber-500/0"
    },
    {
      title: "Codebase Chat",
      desc: "Context-aware AI chat specifically tied to files and modules",
      icon: <Bot className="w-6 h-6 text-violet-400" />,
      color: "from-violet-500/20 to-violet-500/0"
    },
    {
      title: "Interview Prep",
      desc: "Mock interviews to test your knowledge of the repository",
      icon: <BrainCircuit className="w-6 h-6 text-red-400" />,
      color: "from-red-500/20 to-red-500/0"
    },
    {
      title: "Contribution Guide",
      desc: "Generate comprehensive markdown guides for new contributors",
      icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
      color: "from-emerald-500/20 to-emerald-500/0"
    },
    {
      title: "Risk & Hotspots",
      desc: "Identify complexity, coupling, and missing tests",
      icon: <AlertTriangle className="w-6 h-6 text-orange-400" />,
      color: "from-orange-500/20 to-orange-500/0"
    }
  ];

  return (
    
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      
      <HeroSection
        title="Repo-to-Map in 10 seconds"
        subtitle={{
          regular: "Project ",
          gradient: "Visualizer",
        }}
        description="Paste a GitHub repo → get a visual architecture map + AI onboarding in seconds."
        ctaText="Start Exploring"
        ctaHref="#analyzer-form"
        bottomImage={{
          light: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
          dark: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
        }}
        gridOptions={{
          angle: 65,
          opacity: 0.4,
          cellSize: 50,
          lightLineColor: "#4a4a4a",
          darkLineColor: "#2a2a2a",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10" id="analyzer-form">


        {/* URL Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-24"
        >
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            
            <div className="relative flex items-center bg-muted border border-border rounded-2xl p-2 pl-6 shadow-2xl">
              <Search className="w-6 h-6 text-muted-foreground mr-4 shrink-0" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                
                className="w-full bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground"
                disabled={status === 'analyzing'}
              />
              <button
                type="submit"
                disabled={status === 'analyzing' || !url}
                className={cn(
                  "ml-4 px-8 py-4 rounded-xl font-semibold text-white flex items-center gap-2 transition-all shrink-0",
                  status === 'analyzing'
                    ? "bg-muted cursor-not-allowed text-muted-foreground"
                    : "bg-gradient-to-r from-cyan-500 to-violet-500 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95"
                )}
              >
                {status === 'analyzing' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Visualize <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-24">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              
              className="relative p-6 rounded-2xl bg-muted border border-border overflow-hidden group hover:border-primary/50 transition-colors"
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", feature.color)} />
              <div className="relative z-10 flex items-start gap-4">
                
                <div className="p-3 rounded-xl bg-background border border-border">
                  {feature.icon}
                </div>
                <div>
                
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                 
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 0.5, delay: 0.8 }}
           className="text-center mb-24"
        >
           
           <h2 className="text-3xl font-bold text-foreground mb-12">How it works</h2>
           <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
             {[
               { num: "1", text: "Paste any public GitHub repository URL" },
               { num: "2", text: "Our AI engine analyzes the structure and codebase" },
               { num: "3", text: "Explore the visual map and chat with the repository" }
             ].map((step, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl font-bold mb-4 border border-cyan-500/30">
                    {step.num}
                  </div>
                  
                  <p className="text-muted-foreground">{step.text}</p>
                </div>
             ))}
           </div>
        </motion.div>

        {/* Recent Analysis History */}
        {!isLoadingHistory && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="max-w-4xl mx-auto"
          >
            
            <div className="flex items-center gap-2 mb-6 text-muted-foreground">
              <History className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Recent Analyses</h2>
            </div>
            
            <div className="grid gap-4">
              {history.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/project-visualizer/dashboard/${item.sessionId}`)}
                 
                  className="flex items-center justify-between p-4 rounded-xl bg-muted border border-border hover:bg-accent cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-4">
                  
                    <div className="p-3 rounded-lg bg-background border border-border">
                      <GitBranch className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-cyan-400 transition-colors">
                        {item.repoOwner} / {item.repoName}
                      </h3>
                     
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(item.lastAnalyzed).toLocaleDateString()}
                        </span>
                        {item.github?.stars !== undefined && (
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {item.github.stars}
                          </span>
                        )}
                        {item.stats?.totalFiles !== undefined && (
                          <span className="flex items-center gap-1">
                            <GitFork className="w-4 h-4" />
                            {item.stats.totalFiles} files
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => handleDeleteHistory(item._id, e)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Landing;
