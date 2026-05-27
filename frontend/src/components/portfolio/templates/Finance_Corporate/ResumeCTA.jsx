import React from "react";
import {
  Download,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  TrendingUp,
} from "lucide-react";

export default function ResumeCTA() {
  return (
    <section className="w-full bg-slate-950 text-white py-20 px-6 rounded-3xl overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Content */}
        <div>
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-full text-sm text-amber-400 mb-6">
            <Briefcase size={16} />
            Finance Corporate Portfolio
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Build Trust With a
            <span className="text-amber-400"> Professional Resume</span>
          </h1>

          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            Present your professional profile with a modern finance-inspired
            resume section designed for executives, analysts, consultants, and
            corporate professionals.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button type="button" className="flex items-center justify-center gap-2 bg-amber-400 text-slate-950 font-semibold px-6 py-4 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg">
              <Download size={18} />
              Download Resume
            </button>

            <button type="button" className="flex items-center justify-center gap-2 border border-slate-700 bg-slate-900 px-6 py-4 rounded-xl hover:bg-slate-800 transition-all duration-300">
              View Portfolio
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-2xl font-bold text-amber-400">10+</h3>
              <p className="text-slate-400 text-sm">Years Experience</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-2xl font-bold text-amber-400">250+</h3>
              <p className="text-slate-400 text-sm">Projects Delivered</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 col-span-2 sm:col-span-1">
              <h3 className="text-2xl font-bold text-amber-400">98%</h3>
              <p className="text-slate-400 text-sm">Client Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Right Card */}
        <div className="relative">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Executive Resume</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Financial Strategy & Business Consulting
                </p>
              </div>

              <div className="bg-amber-400/20 p-3 rounded-xl">
                <ShieldCheck className="text-amber-400" size={28} />
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-5">
              
              <div className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">
                    Portfolio Performance
                  </span>
                  <TrendingUp className="text-green-400" size={20} />
                </div>

                <h3 className="text-3xl font-bold text-green-400">+24.8%</h3>

                <p className="text-slate-500 text-sm mt-1">
                  Annual business growth achieved
                </p>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800">
                <h4 className="text-lg font-semibold mb-4">
                  Professional Highlights
                </h4>

                <ul className="space-y-3 text-slate-300">
                  <li>• Strategic Financial Planning</li>
                  <li>• Corporate Risk Management</li>
                  <li>• Investment Analysis & Reporting</li>
                  <li>• Business Growth Optimization</li>
                </ul>
              </div>

              <div className="flex items-center justify-between bg-amber-400 text-slate-950 rounded-2xl px-5 py-4 font-semibold">
                <span>Ready for Executive Opportunities</span>
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}