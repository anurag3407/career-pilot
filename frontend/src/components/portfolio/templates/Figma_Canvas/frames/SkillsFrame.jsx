import React from 'react';

export default function SkillsFrame({ data }) {
  const { skills } = data;
  
  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="h-full p-10 bg-[#1A1A1A] overflow-y-auto custom-scrollbar">
      <h2 className="text-3xl font-bold mb-8 text-white">Skills & Expertise</h2>
      <div className="space-y-8">
        {Object.entries(groupedSkills).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold text-gray-400 mb-4 tracking-wider uppercase">{category}</h3>
            <div className="flex flex-wrap gap-3">
              {items.map(skill => (
                <div key={skill.name} className="px-4 py-2 bg-[#252525] border border-[#333] rounded-md flex items-center gap-3 hover:border-blue-500/50 transition-colors">
                  <span className="text-white font-medium">{skill.name}</span>
                  <span className="text-xs text-blue-400 font-mono">{skill.level}%</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
