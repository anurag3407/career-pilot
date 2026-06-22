import React from 'react';
import { Briefcase } from 'lucide-react';
import { Message, Divider } from './MessageComponents';

export function ExperienceContent({ data }) {
  const p = data.personal;
  const timelineColors = ['#5865F2', '#23A559', '#F0B232', '#EB459E'];

  return (
    <div className="py-4 space-y-1">
      <Divider text="Work Experience" />
      <Message
        avatar="https://cdn.discordapp.com/embed/avatars/0.png"
        name="PortfolioBot"
        timestamp="Today at 12:30 AM"
        isBot
        index={0}
      >
        <p>💼 <span className="font-semibold text-white">{p.name}</span>'s professional journey:</p>
      </Message>

      {(data.experience || []).map((exp, idx) => (
        <Message
          key={idx}
          avatar={p.avatar}
          name={p.name}
          timestamp={`Today at 12:${31 + idx} AM`}
          index={idx + 1}
        >
          <div className="max-w-[520px] mt-1 flex rounded overflow-hidden bg-[#2B2D31] border border-[#1E1F22]">
            <div className="w-1 shrink-0" style={{ backgroundColor: timelineColors[idx % timelineColors.length] }} />
            <div className="p-3 flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4" style={{ color: timelineColors[idx % timelineColors.length] }} />
                <span className="text-sm font-semibold text-white">{exp.role}</span>
              </div>
              <div className="text-xs text-[#949BA4] mb-2">{exp.company} • {exp.period}</div>
              <div className="text-sm text-[#DBDEE1]">{exp.description}</div>
            </div>
          </div>
        </Message>
      ))}
    </div>
  );
}

export function TestimonialsContent({ data }) {
  const p = data.personal;
  return (
    <div className="py-4 space-y-1">
      <Divider text="Testimonials" />
      <Message
        avatar="https://cdn.discordapp.com/embed/avatars/0.png"
        name="PortfolioBot"
        timestamp="Today at 12:40 AM"
        isBot
        index={0}
      >
        <p>💬 Here's what people have said about working with <span className="font-semibold text-white">{p.name}</span>:</p>
      </Message>

      {(data.testimonials || []).map((t, idx) => (
        <Message
          key={idx}
          avatar={t.avatar}
          name={t.name}
          timestamp={`Today at 12:${41 + idx} AM`}
          index={idx + 1}
        >
          <div className="text-sm text-[#DBDEE1] italic">"{t.text}"</div>
          <div className="text-xs text-[#949BA4] mt-1">— {t.role}</div>
        </Message>
      ))}
    </div>
  );
}
