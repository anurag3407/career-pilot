import { useNavigate } from 'react-router-dom';
import { GitMerge, Zap, ArrowRight, Server, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RepoAnalyzerLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050816] text-white overflow-hidden relative selection:bg-blue-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050816] to-[#050816] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4" />
            <span>0-Token Architecture</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            GitHub <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Analyzer</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Instantly ingest, map, and interact with any public codebase. Powered by high-fidelity React Flow graphs and a cached Agentic RAG engine.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate('/repo-analyzer/dashboard')}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.5)] cursor-pointer"
          >
            Open Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard 
            icon={<Server className="w-6 h-6 text-emerald-400" />}
            title="Token-Free Ingestion Engine"
            description="Algorithmic processing clones and recursively walks the file system, parsing static text to extract internal import networks without consuming a single LLM token."
            delay={0.4}
          />
          <FeatureCard 
            icon={<GitMerge className="w-6 h-6 text-blue-400" />}
            title="Low-Latency Graph UI"
            description="Built on React Flow 12. Interactive node-based mapping dynamically renders your codebase structure with Dagre auto-layout algorithms."
            delay={0.5}
          />
          <FeatureCard 
            icon={<BrainCircuit className="w-6 h-6 text-purple-400" />}
            title="Cached Agentic Chat"
            description="Leverages Anthropic's Ephemeral Prompt Caching. Switch between objective QA Engine mode and aggressive Principal Interview mode to test your architectural knowledge."
            delay={0.6}
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-8 rounded-2xl bg-[#0f172a]/80 border border-slate-800 backdrop-blur-sm hover:bg-[#1e293b]/80 transition-colors group"
    >
      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-200 mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">
        {description}
      </p>
    </motion.div>
  );
}
