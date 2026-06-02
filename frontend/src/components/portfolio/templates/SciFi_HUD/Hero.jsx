import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Zap, ChevronRight, Crosshair, Activity, AlertCircle } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Hero() {
  const [bootSequence, setBootSequence] = useState([]);
  const [isBooted, setIsBooted] = useState(false);
  const personal = data?.personal || {};

  useEffect(() => {
    const seq = [
      'INIT_NETWORK_MODULES',
      'AUTH_CHECK',
      'LOAD_USERPROFILE',
      'LINK_ASSETS',
      'STANDBY'
    ];
    let i = 0;
    const id = setInterval(() => {
      setBootSequence((s) => [...s, seq[i]]);
      i++;
      if (i >= seq.length) {
        clearInterval(id);
        setIsBooted(true);
      }
    }, 300);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative w-full min-h-[420px] bg-slate-950 flex flex-col justify-center items-center overflow-hidden font-mono select-none py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <motion.div
        className="absolute w-full h-[1px] bg-cyan-400/10 shadow-[0_0_10px_#22d3ee] pointer-events-none z-10"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-20 w-full max-w-7xl px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="hidden lg:flex lg:col-span-3 flex-col h-full justify-center border-l border-cyan-900/50 pl-6">
          <div className="text-cyan-500 flex items-center gap-2 mb-4 border-b border-cyan-900/50 pb-2">
            <Terminal className="w-4 h-4" />
            <span className="text-[10px] tracking-widest font-bold">BOOT_LOG</span>
          </div>
          <div className="flex flex-col gap-2 text-[10px] tracking-widest text-cyan-300/70">
            {bootSequence.map((log, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={index === bootSequence.length - 1 ? 'text-cyan-400 font-bold animate-pulse' : ''}
              >
                {`> ${log}`}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-6 flex flex-col items-center text-center relative p-6 md:p-8 border border-cyan-500/20 bg-cyan-950/10 backdrop-blur-md shadow-[inset_0_0_20px_rgba(8,145,178,0.08)] rounded-sm group">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={isBooted ? { scale: 1, opacity: 1 } : { scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="flex flex-col items-center w-full"
          >
            <div className="flex items-center gap-3 mb-4 px-3 py-1 bg-cyan-950/50 border border-cyan-500/30 rounded-full">
              <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span className="text-sm text-cyan-300">Authenticated</span>
            </div>

            {personal?.avatar ? (
              <img src={personal.avatar} alt={personal.name} className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border border-cyan-700/30 mb-4" />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-cyan-800/30 flex items-center justify-center text-cyan-200 mb-4">{(personal?.name || '?').charAt(0)}</div>
            )}

            <h1 className="text-2xl md:text-4xl font-extrabold text-cyan-100 tracking-wider mb-1">{personal?.name || 'Your Name'}</h1>
            <h2 className="text-xs md:text-sm text-cyan-400 tracking-wider font-light mb-4">{personal?.title || 'Title — Role'}</h2>

            <p className="text-cyan-300/80 text-xs md:text-sm max-w-lg leading-relaxed mb-6 border-l-2 border-cyan-500/50 pl-4 text-left">
              {personal?.bio || 'Short bio goes here. Make sure to fill dummy_data.json to see real content.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button className="relative group/btn overflow-hidden px-6 py-3 bg-cyan-950/80 border border-cyan-400 text-cyan-100 text-xs tracking-widest uppercase hover:text-white transition-all duration-200">
                <span className="relative z-10 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Deploy
                </span>
              </button>
              <button className="relative group/btn overflow-hidden px-6 py-3 bg-transparent border border-cyan-800 text-cyan-400 text-xs tracking-widest uppercase hover:border-cyan-400 transition-all duration-200">
                <span className="relative z-10 flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" /> Open_Comms
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        <div className="hidden lg:flex lg:col-span-3 flex-col h-full justify-center gap-6 border-r border-cyan-900/50 pr-6 items-end text-right">
          <div className="flex flex-col gap-1 items-end">
            <div className="flex items-center gap-2 text-cyan-500 mb-1">
              <span className="text-[10px] tracking-widest font-bold">SYS_ENVIRONMENT</span>
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-[10px] text-cyan-300 tracking-widest border border-cyan-900/50 p-1 px-2 bg-cyan-950/30">{personal?.location || 'Unknown'}</div>
            <div className="text-[10px] text-cyan-300 tracking-widest border border-cyan-900/50 p-1 px-2 bg-cyan-950/30">TEMP: OPTIMAL</div>
          </div>

          <div className="flex flex-col gap-2 items-end mt-4">
            <div className="flex items-center gap-2 text-cyan-500 mb-1">
              <span className="text-[10px] tracking-widest font-bold">TARGET_LOCK</span>
              <Crosshair className="w-4 h-4" />
            </div>
            <div className="relative w-14 h-14 border border-cyan-500/50 rounded-full flex items-center justify-center bg-cyan-950/30">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} className="absolute w-full h-full border-t-2 border-cyan-400 rounded-full opacity-40" />
              <div className="w-1 h-1 bg-cyan-300 rounded-full shadow-[0_0_5px_#22d3ee]" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full border-t border-cyan-900/50 bg-slate-950 p-2 flex justify-between items-center px-6 text-[9px] text-cyan-600 tracking-[0.2em] uppercase">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3 h-3 text-cyan-500" />
          ENCRYPTION: ENABLED
        </div>
        <div className="hidden md:block">BUILD: V_1.0.9 // UPLINK_SECURE</div>
        <div>SYS_TIME: {new Date().toLocaleTimeString('en-US', { hour12: false })}</div>
      </div>
    </section>
  );
}