import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

export default function Skills({ skills }) {
  // Group skills by category to organize the tags
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Generate a mock 3-letter airport-style code for a skill (e.g., React -> REA, Tailwind CSS -> TAI)
  const getAirportCode = (name) => {
    return name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
  };

  // Assign distinct tag colors based on category
  const getCategoryColor = (category) => {
    const colors = {
      'Frontend': 'bg-rose-500 border-rose-600',
      'Backend': 'bg-emerald-500 border-emerald-600',
      'DevOps': 'bg-amber-500 border-amber-600',
      'Design': 'bg-purple-500 border-purple-600'
    };
    return colors[category] || 'bg-stone-500 border-stone-600';
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Tag className="w-6 h-6 text-stone-800" />
        <h2 className="text-2xl font-black text-stone-900 tracking-tighter uppercase">Checked Baggage (Skills)</h2>
      </div>

      <div className="space-y-12">
        {Object.entries(skillsByCategory).map(([category, catSkills], idx) => (
          <div key={category}>
            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-200 pb-2 mb-6">
              Class: {category}
            </h3>
            
            <div className="flex flex-wrap gap-6">
              {catSkills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.4, 
                    delay: i * 0.05 + (idx * 0.1),
                    type: "spring",
                    stiffness: 200
                  }}
                  className="relative group cursor-default"
                >
                  {/* The tag string loop */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-6 border-2 border-stone-300 rounded-t-full border-b-0 z-0"></div>
                  
                  {/* The tag body */}
                  <div className={`relative z-10 w-24 h-32 rounded-t-sm rounded-b-xl shadow-md border-b-4 flex flex-col items-center justify-between py-3 bg-stone-100 ${getCategoryColor(category).split(' ')[1]}`}>
                    {/* Punch hole */}
                    <div className="w-3 h-3 bg-white rounded-full shadow-inner border border-stone-200"></div>
                    
                    <div className="flex flex-col items-center w-full">
                      <span className="text-[8px] font-bold text-stone-500 uppercase tracking-widest">{category.substring(0,3)}</span>
                      <span className={`text-3xl font-black tracking-tighter my-1 ${getCategoryColor(category).split(' ')[0]} bg-clip-text text-transparent`}>
                        {getAirportCode(skill.name)}
                      </span>
                      <span className="text-[9px] font-bold text-stone-800 text-center leading-tight px-1 uppercase w-full truncate">
                        {skill.name}
                      </span>
                    </div>

                    <div className="w-full flex items-center justify-between px-2 pt-2 border-t border-dashed border-stone-300">
                      <span className="text-[8px] font-bold text-stone-400">LVL</span>
                      <span className="text-[10px] font-black text-stone-700">{skill.level}</span>
                    </div>
                  </div>
                  
                  {/* Hover tooltip for full name since tag truncates long names */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap pointer-events-none z-20">
                    {skill.name} ({skill.level}%)
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
