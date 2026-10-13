import React from 'react';
import { Tag, Sparkles, Zap, Layers, Globe, Code2, Database } from 'lucide-react';

export default function Skills({ data }) {
  const skills = data?.skills;
  if (!skills || skills.length === 0) return null;

  // Icons for visual variety
  const icons = [Code2, Database, Globe, Layers, Zap, Sparkles];

  return (
    <section className="relative py-24 bg-white overflow-hidden px-5">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-50/50 rounded-bl-[100px] -z-10"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-stone-200 pb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 border border-stone-200 bg-stone-50 shadow-sm rounded-full px-5 py-2 mb-6">
              <Tag size={16} className="text-orange-500" />
              <span className="text-sm font-semibold text-stone-700" style={{ fontFamily: "sans-serif" }}>
                Shop by Category
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-stone-900">
              Technical <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Capabilities</span>
            </h2>
          </div>
          <button type="button" className="hidden md:flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-stone-900 transition">
            View All Categories &rarr;
          </button>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {skills.map((skill, index) => {
            const skillName = typeof skill === 'string' ? skill : skill.name || skill.skill;
            const Icon = icons[index % icons.length];
            // Cycle through some nice pastel e-commerce backgrounds
            const bgColors = ['bg-orange-50', 'bg-blue-50', 'bg-emerald-50', 'bg-purple-50', 'bg-rose-50', 'bg-stone-100'];
            const textColors = ['text-orange-600', 'text-blue-600', 'text-emerald-600', 'text-purple-600', 'text-rose-600', 'text-stone-600'];
            const bgColor = bgColors[index % bgColors.length];
            const textColor = textColors[index % textColors.length];

            return (
              <div 
                key={index}
                className="group relative flex flex-col items-center justify-center p-6 md:p-8 rounded-[24px] border border-stone-200 bg-white hover:border-stone-400 transition-all duration-300 hover:shadow-xl cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${bgColor}`}>
                  <Icon size={24} className={textColor} />
                </div>
                <h3 className="text-lg font-bold text-stone-900 text-center mb-1">
                  {skillName}
                </h3>
                <p className="text-xs font-semibold text-stone-400 tracking-wider uppercase">
                  {10 + (index * 7) % 50} Products
                </p>

                {/* Quick Add Button Reveal */}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <button type="button" className="w-full py-2 bg-stone-900 text-white text-xs font-bold rounded-xl shadow-lg">
                    Quick View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}