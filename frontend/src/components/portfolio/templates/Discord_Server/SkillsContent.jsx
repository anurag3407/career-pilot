import React from 'react';
import { motion } from 'framer-motion';
import { Message, Divider } from './MessageComponents';

const categoryColors = {
  Frontend: '#5865F2',
  Backend: '#23A559',
  DevOps: '#F0B232',
  Design: '#EB459E',
};

export function SkillsContent({ data }) {
  const p = data.personal;
  const grouped = (data.skills || []).reduce((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div className="py-4 space-y-1">
      <Divider text="Skills & Technologies" />
      <Message
        avatar="https://cdn.discordapp.com/embed/avatars/0.png"
        name="PortfolioBot"
        timestamp="Today at 12:10 AM"
        isBot
        index={0}
      >
        <p>Here's a breakdown of <span className="font-semibold text-white">{p.name}</span>'s technical skills 🛠️</p>
      </Message>

      {Object.entries(grouped).map(([category, skills], catIdx) => (
        <Message
          key={category}
          avatar={p.avatar}
          name={p.name}
          timestamp={`Today at 12:${11 + catIdx} AM`}
          index={catIdx + 1}
        >
          <div className="max-w-[520px] mt-1 flex rounded overflow-hidden bg-[#2B2D31] border border-[#1E1F22]">
            <div className="w-1 shrink-0" style={{ backgroundColor: categoryColors[category] || '#5865F2' }} />
            <div className="p-3 flex-1 min-w-0">
              <div className="text-sm font-semibold mb-3" style={{ color: categoryColors[category] || '#5865F2' }}>
                {category === 'Frontend' && '🎨'} {category === 'Backend' && '⚙️'} {category === 'DevOps' && '🚀'} {category === 'Design' && '✏️'} {category}
              </div>
              <div className="space-y-2">
                {skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#DBDEE1] font-medium">{skill.name}</span>
                      <span className="text-[#949BA4]">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-[#1E1F22] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(0, Number(skill.level) || 0))}%` }}
                        transition={{ duration: 1, delay: catIdx * 0.2 + i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: categoryColors[category] || '#5865F2' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Message>
      ))}
    </div>
  );
}
