import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, GitBranch, Network, Zap, ShieldAlert } from "lucide-react";

export default function ProjectVisualizerSection() {
  const features = [
    {
      icon: <Network className="w-5 h-5 text-cyan-400" />,
      title: "Architecture Maps",
      desc: "Interactive visual graphs of your codebase modules."
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-orange-400" />,
      title: "Risk Hotspots",
      desc: "Detect complexity and coupling instantly."
    },
    {
      icon: <Zap className="w-5 h-5 text-violet-400" />,
      title: "AI Onboarding",
      desc: "Chat with an AI that knows your architecture."
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-gradient-to-b from-cyan-500/10 to-violet-500/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-500 text-sm font-medium mb-6">
              <GitBranch className="w-4 h-4" />
              Project Visualizer
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Understand Any Repo in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Seconds</span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-lg">
              Paste a GitHub URL and let our AI engine instantly build a dynamic, visual architecture map. Explore modules, dependencies, and risks without cloning a single file.
            </p>

            <div className="space-y-6 mb-10">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-muted border border-border shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/project-visualizer"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background hover:text-white font-medium rounded-lg hover:bg-muted-foreground/80 transition-all duration-200 shadow-xl"
            >
              Try Visualizer Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Visual Showcase (Mockup) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl bg-[#0f172a] border border-slate-800 shadow-2xl overflow-hidden relative flex flex-col">
              {/* Window Header */}
              <div className="h-10 bg-[#0a0f1c] border-b border-slate-800 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="mx-auto bg-slate-800/50 px-3 py-1 rounded text-[10px] font-mono text-slate-400 border border-slate-700/50">
                  github.com/facebook/react
                </div>
              </div>
              
              {/* Mockup Body */}
              <div className="flex-1 p-6 relative">
                {/* Node 1 */}
                <div className="absolute top-10 left-10 w-32 bg-[#1e293b] border border-cyan-500/50 rounded-lg p-3 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                  <div className="w-6 h-1 bg-cyan-400 rounded-full mb-2"></div>
                  <div className="h-2 w-20 bg-slate-600 rounded-full mb-1.5"></div>
                  <div className="h-2 w-12 bg-slate-700 rounded-full"></div>
                </div>
                
                {/* Node 2 */}
                <div className="absolute top-32 right-12 w-32 bg-[#1e293b] border border-violet-500/50 rounded-lg p-3 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                  <div className="w-6 h-1 bg-violet-400 rounded-full mb-2"></div>
                  <div className="h-2 w-16 bg-slate-600 rounded-full mb-1.5"></div>
                  <div className="h-2 w-10 bg-slate-700 rounded-full"></div>
                </div>
                
                {/* Node 3 */}
                <div className="absolute bottom-12 left-24 w-32 bg-[#1e293b] border border-orange-500/50 rounded-lg p-3 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                  <div className="w-6 h-1 bg-orange-400 rounded-full mb-2"></div>
                  <div className="h-2 w-24 bg-slate-600 rounded-full mb-1.5"></div>
                  <div className="h-2 w-14 bg-slate-700 rounded-full"></div>
                </div>

                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  <path d="M 160 80 Q 250 80 280 150" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 120 120 Q 120 180 150 250" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
                
                {/* Overlay Chat bubble */}
                <div className="absolute bottom-6 right-6 max-w-[200px] bg-slate-800/90 backdrop-blur border border-slate-700 rounded-xl p-3 shadow-xl">
                  <div className="flex gap-2 items-start">
                    <Zap className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-300 leading-relaxed">
                      The core reconciler module seems heavily coupled. Consider reviewing dependencies.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative blurs */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 blur-[80px] rounded-full" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
