import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, Star, GitFork, AlertCircle, ArrowLeft,
  Map, Grid3X3, AlertTriangle, Users, Search,
  Loader2, ChevronDown, Box, Info, Scale,
  Sparkles, CheckCircle2, Package, Code2, BrainCircuit, BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useProjectVisualizerStore } from '../../stores/useProjectVisualizerStore';
import { projectVisualizerApi } from '../../services/api';

import ArchitectureCanvas from '../../components/visualizer/ArchitectureCanvas';
import ModuleInspector from '../../components/visualizer/ModuleInspector';
import StatsOverview from '../../components/visualizer/StatsOverview';
import LanguageBar from '../../components/visualizer/LanguageBar';
import RiskCard from '../../components/visualizer/RiskCard';
import RiskSummaryChart from '../../components/visualizer/RiskSummaryChart';
import SuggestionCard from '../../components/visualizer/SuggestionCard';
import ContributorGrid from '../../components/visualizer/ContributorGrid';
import CommitTimeline from '../../components/visualizer/CommitTimeline';
import VisualizerChat from '../../components/visualizer/VisualizerChat';
import AnalysisProgress from '../../components/visualizer/AnalysisProgress';
import DependencyHealth from '../../components/visualizer/DependencyHealth';
import FileExplorer from '../../components/visualizer/FileExplorer';
import InterviewPrep from '../../components/visualizer/InterviewPrep';
import ContributionGuide from '../../components/visualizer/ContributionGuide';
import { cn } from '../../lib/utils';

const Dashboard = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { 
    sessionId: storeSessionId, 
    status,
    activeTab, 
    setActiveTab,
    setAnalysisData,
    setStatus,
    setContributors,
    setCommits,
    modules,
    risks,
    suggestions,
    contributors,
    commits,
    github,
    repoOwner,
    repoName,
    setSelectedModule,
    setInspectorOpen,
    architectureSummary
  } = useProjectVisualizerStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [moduleSearch, setModuleSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all'); // all, critical, high, medium, low

  // Load Data if not in store
  useEffect(() => {
    if (!sessionId) return;
    
    if (storeSessionId !== sessionId || status !== 'complete') {
      loadAnalysisData(sessionId);
    } else {
      // Data is in store, let's lazy load the extra github data if missing
      if (!contributors || contributors.length === 0) {
        loadExtraData(sessionId);
      }
    }
  }, [sessionId, storeSessionId, status]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAnalysisData = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await projectVisualizerApi.getAnalysis(id);
      setAnalysisData(data);
      
      // Kick off extra loading
      loadExtraData(id);
    } catch (err) {
      console.error(err);
      setError("Failed to load analysis data or analysis not found.");
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadExtraData = async (id) => {
    try {
      projectVisualizerApi.getContributors(id).then(res => {
         if (res && res.length) setContributors(res);
      }).catch(e => console.warn('Failed to load contributors', e));
      
      projectVisualizerApi.getCommits(id).then(res => {
         if (res && res.length) setCommits(res);
      }).catch(e => console.warn('Failed to load commits', e));
    } catch (e) {
      // silent fail for extra data
    }
  };

  // Derived state for Modules tab
  const filteredModules = useMemo(() => {
    if (!modules) return [];
    let filtered = modules;
    if (moduleSearch) {
      const q = moduleSearch.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.path.toLowerCase().includes(q)
      );
    }
    // Sort by file count desc by default
    return filtered.sort((a, b) => b.fileCount - a.fileCount);
  }, [modules, moduleSearch]);

  // Derived state for Risks tab
  const filteredRisks = useMemo(() => {
    if (!risks) return [];
    let filtered = risks;
    if (riskFilter !== 'all') {
      filtered = filtered.filter(r => r.severity === riskFilter);
    }
    
    // Sort by severity (critical -> high -> medium -> low)
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return filtered.sort((a, b) => order[a.severity] - order[b.severity]);
  }, [risks, riskFilter]);

  if (isLoading || status === 'analyzing') {
    return <AnalysisProgress status={status === 'analyzing' ? 'analyzing' : 'complete'} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Analysis Error</h2>
        <p className="text-muted-foreground mb-8 max-w-md text-center">{error}</p>
        <button 
          onClick={() => navigate('/project-visualizer')}
          className="px-6 py-3 bg-card border border-border hover:bg-accent text-foreground rounded-xl transition-colors"
        >
          Back to Visualizer
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'architecture', label: 'Architecture', icon: Map, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { id: 'modules', label: 'Modules', icon: Grid3X3, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { id: 'files', label: 'Files & Code', icon: Code2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'dependencies', label: 'Dependencies', icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'interview', label: 'Interview Prep', icon: BrainCircuit, color: 'text-red-400', bg: 'bg-red-500/10' },
    { id: 'contribution', label: 'Contribution Guide', icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'risks', label: 'Risks', icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', count: risks?.length },
    { id: 'contributors', label: 'Contributors', icon: Users, color: 'text-pink-400', bg: 'bg-pink-500/10' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden font-sans">
      
      {/* Header */}
      <header className="shrink-0 bg-card border-b border-border py-4 px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30 shadow-xl">
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => navigate('/project-visualizer')}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group w-max"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Search
          </button>
          
          <div className="flex items-center gap-3 mt-1">
            <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 rounded-lg border border-border shadow-inner">
              <GitBranch className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-muted-foreground font-medium">{repoOwner}</span>
                <span className="text-muted-foreground opacity-50 mx-1">/</span>
                <span className="text-foreground">{repoName}</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center p-1 bg-muted rounded-xl border border-border overflow-x-auto custom-scrollbar md:w-auto w-full">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 shrink-0",
                activeTab === tab.id 
                  ? "text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className={cn("absolute inset-0 rounded-lg", tab.bg)}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <tab.icon className={cn("w-4 h-4 relative z-10", activeTab === tab.id ? tab.color : "")} />
              <span className="relative z-10">{tab.label}</span>
              
              {tab.count !== undefined && (
                <span className={cn(
                  "relative z-10 ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold",
                  activeTab === tab.id ? "bg-background" : "bg-card"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar pb-[80px]">
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full h-full">
          <AnimatePresence mode="wait">
            
            {/* ARCHITECTURE TAB */}
            {activeTab === 'architecture' && (
              <motion.div 
                key="architecture"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6 h-full"
              >
                <StatsOverview />
                <LanguageBar languages={github?.languages} />
                
                {architectureSummary && (
                   <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
                     <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                       <Sparkles className="w-5 h-5 text-violet-400" /> AI Architecture Summary
                     </h3>
                     <p className="text-muted-foreground leading-relaxed max-w-5xl whitespace-pre-wrap text-sm">
                       {architectureSummary}
                     </p>
                   </div>
                )}
                
                <div className="flex-1 min-h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-border">
                  <ArchitectureCanvas />
                </div>
              </motion.div>
            )}

            {/* MODULES TAB */}
            {activeTab === 'modules' && (
              <motion.div 
                key="modules"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    <Grid3X3 className="w-6 h-6 text-violet-400" />
                    Project Modules ({modules?.length || 0})
                  </h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search modules..."
                      value={moduleSearch}
                      onChange={(e) => setModuleSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 rounded-xl bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-violet-500/50 transition-colors w-64"
                    />
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl overflow-hidden flex-1">
                  <div className="overflow-x-auto h-full custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-muted/50 text-muted-foreground text-sm font-medium border-b border-border">
                          <th className="p-4 whitespace-nowrap">Module Name</th>
                          <th className="p-4 whitespace-nowrap">Path</th>
                          <th className="p-4 whitespace-nowrap">Type</th>
                          <th className="p-4 whitespace-nowrap text-right">Files</th>
                          <th className="p-4 whitespace-nowrap text-right">LOC</th>
                          <th className="p-4 whitespace-nowrap text-right">Dependencies</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredModules.map(mod => (
                          <tr 
                            key={mod.name}
                            onClick={() => {
                              setSelectedModule(mod);
                              setInspectorOpen(true);
                            }}
                            className="hover:bg-accent transition-colors cursor-pointer group"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <Box className="w-5 h-5 text-muted-foreground group-hover:text-violet-400 transition-colors" />
                                <span className="font-semibold text-foreground">{mod.name}</span>
                              </div>
                            </td>
                            <td className="p-4 text-muted-foreground font-mono text-xs">{mod.path}</td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-bold uppercase tracking-wider">
                                {mod.type}
                              </span>
                            </td>
                            <td className="p-4 text-right text-foreground font-medium">{mod.fileCount}</td>
                            <td className="p-4 text-right text-muted-foreground">{mod.loc.toLocaleString()}</td>
                            <td className="p-4 text-right text-muted-foreground">
                              {mod.dependencies ? mod.dependencies.length : 0}
                            </td>
                          </tr>
                        ))}
                        {filteredModules.length === 0 && (
                          <tr>
                            <td colSpan="6" className="p-8 text-center text-muted-foreground">
                              No modules found matching your search.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* RISKS TAB */}
            {activeTab === 'risks' && (
              <motion.div 
                key="risks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Chart */}
                  <div className="lg:col-span-1">
                    <RiskSummaryChart risks={risks} />
                  </div>
                  
                  {/* AI Suggestions */}
                  <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-violet-400" /> AI Improvement Suggestions
                    </h3>
                    
                    {suggestions && suggestions.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestions.map((sug, i) => (
                          <SuggestionCard key={i} suggestion={sug} index={i} />
                        ))}
                      </div>
                    ) : (
                      <div className="h-40 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
                        No AI suggestions generated for this repository.
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Detailed Risks List */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-400" />
                      Detailed Hotspots ({filteredRisks.length})
                    </h3>
                    
                    <div className="flex items-center gap-2 bg-muted p-1 rounded-lg border border-border">
                      {['all', 'critical', 'high', 'medium', 'low'].map(f => (
                        <button
                          key={f}
                          onClick={() => setRiskFilter(f)}
                          className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors",
                            riskFilter === f 
                              ? "bg-card text-foreground shadow-sm" 
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {filteredRisks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredRisks.map((risk, i) => (
                        <RiskCard key={i} risk={risk} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-green-500/50 mb-4" />
                      <p className="text-muted-foreground">No risks matching the selected filter.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* CONTRIBUTORS TAB */}
            {activeTab === 'contributors' && (
              <motion.div 
                key="contributors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                      <Users className="w-6 h-6 text-pink-400" />
                      Top Contributors
                    </h2>
                    <ContributorGrid contributors={contributors} />
                  </div>
                  
                  <div className="lg:col-span-1">
                    <CommitTimeline commits={commits} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* DEPENDENCIES TAB */}
            {activeTab === 'dependencies' && (
              <motion.div 
                key="dependencies"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col gap-6"
              >
                <DependencyHealth />
              </motion.div>
            )}

            {/* FILES TAB */}
            {activeTab === 'files' && (
              <motion.div 
                key="files"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col gap-6"
              >
                <FileExplorer />
              </motion.div>
            )}

            {/* INTERVIEW TAB */}
            {activeTab === 'interview' && (
              <motion.div 
                key="interview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col gap-6"
              >
                <InterviewPrep />
              </motion.div>
            )}

            {/* CONTRIBUTION TAB */}
            {activeTab === 'contribution' && (
              <motion.div 
                key="contribution"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col gap-6"
              >
                <ContributionGuide />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Slide-in Inspector Panel */}
      <ModuleInspector />
      
      {/* Docked Chat */}
      <VisualizerChat />
      
    </div>
  );
};

export default Dashboard;
