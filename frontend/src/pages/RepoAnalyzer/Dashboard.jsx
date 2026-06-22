import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Loader2, GitMerge, Clock, Search, ExternalLink } from 'lucide-react';
import { analyzerApi } from '../../services/api';
import { useAnalyzerStore } from '../../stores/useAnalyzerStore';
import toast from 'react-hot-toast';

export default function RepoAnalyzerDashboard() {
  const [urlInput, setUrlInput] = useState('');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const navigate = useNavigate();
  
  const { 
    setRepoUrl, 
    setSessionId, 
    setGraph, 
    isLoading,
    setIsLoading
  } = useAnalyzerStore();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await analyzerApi.getHistory();
      setHistory(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load analysis history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleIngest = async (url) => {
    const targetUrl = url || urlInput.trim();
    if (!targetUrl) return;

    if (!targetUrl.includes('github.com')) {
      toast.error('Please enter a valid GitHub repository URL');
      return;
    }

    try {
      setIsLoading(true);
      const res = await analyzerApi.ingest(targetUrl);
      
      setSessionId(res.sessionId);
      setGraph(res.nodes, res.edges);
      setRepoUrl(targetUrl);
      
      toast.success('Repository ingested successfully!');
      navigate('/repo-analyzer/workspace');
    } catch (error) {
      console.error(error);
      toast.error('Failed to ingest repository. Make sure it is public.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleIngest();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050816] text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <GitMerge className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Analyzer Dashboard</h1>
              <p className="text-slate-400 text-sm mt-1">Ingest a new repository or open a previously analyzed one.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-[#0f172a] rounded-xl border border-slate-700/50 p-2">
              <Search className="w-5 h-5 text-slate-500 ml-3" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste GitHub Repository URL (e.g., https://github.com/expressjs/express)"
                className="flex-1 bg-transparent border-none focus:outline-none text-slate-200 px-4 py-3 placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={isLoading || (!urlInput.trim() && !isLoading)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitMerge className="w-4 h-4" />}
                Analyze Now
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Analysis History
          </h2>

          {loadingHistory ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-20 bg-[#0f172a]/50 rounded-2xl border border-slate-800 border-dashed">
              <Github className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No repositories analyzed yet.</p>
              <p className="text-sm text-slate-500 mt-1">Paste a URL above to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((item) => {
                const repoName = item.repoUrl.replace('https://github.com/', '').replace(/\/$/, '');
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-5 rounded-xl bg-[#0f172a] border border-slate-800 hover:border-blue-500/50 hover:bg-[#1e293b]/50 transition-all group cursor-pointer"
                    onClick={() => handleIngest(item.repoUrl)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                        <Github className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.lastAnalyzed).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-200 truncate mb-1" title={repoName}>
                      {repoName}
                    </h3>
                    <p className="text-xs text-slate-500 truncate mb-4">
                      {item.repoUrl}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
                      <span className="text-sm font-medium text-slate-400 group-hover:text-blue-400 transition-colors">
                        Re-Analyze Workspace
                      </span>
                      <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

