import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, PlusCircle, ArrowRight } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-dvh bg-[#0a0a0a] text-white flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,170,0.08),_transparent_60%)]" />

      <div className="relative z-10 max-w-2xl w-full bg-[#111111]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-10 md:p-14 text-center shadow-2xl">
        <div className="mx-auto mb-8 w-24 h-24 rounded-3xl bg-[#00ffaa]/10 border border-[#00ffaa]/20 flex items-center justify-center">
          <Briefcase className="w-11 h-11 text-[#00ffaa]" />
        </div>

        <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold mb-4 tracking-tight">
          Create Your Portfolio
        </h1>

        <p className="text-neutral-400 text-lg leading-relaxed max-w-xl mx-auto mb-10">
          You haven’t created a portfolio yet. Start building your portfolio
          to showcase your work, skills, and achievements.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="px-8 py-4 bg-[#00ffaa] text-black font-semibold rounded-xl hover:scale-105 hover:bg-[#00e699] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Create Portfolio
          </Link>

          <Link
            to="/dashboard"
            className="px-8 py-4 border border-neutral-700 rounded-xl hover:border-[#00ffaa] transition-all duration-300 flex items-center justify-center gap-2"
          >
            Back to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;