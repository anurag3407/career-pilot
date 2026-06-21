import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Message, Divider } from './MessageComponents';

const embedColors = ['#5865F2', '#23A559', '#EB459E', '#F0B232', '#ED4245', '#57F287'];

export function ProjectsContent({ data }) {
  const p = data.personal;
  return (
    <div className="py-4 space-y-1">
      <Divider text="Projects Showcase" />
      <Message
        avatar="https://cdn.discordapp.com/embed/avatars/0.png"
        name="PortfolioBot"
        timestamp="Today at 12:20 AM"
        isBot
        index={0}
      >
        <p>🚀 Here are <span className="font-semibold text-white">{p.name}</span>'s featured projects:</p>
      </Message>

      {(data.projects || []).map((project, idx) => (
        <Message
          key={idx}
          avatar={p.avatar}
          name={p.name}
          timestamp={`Today at 12:${21 + idx} AM`}
          index={idx + 1}
        >
          <div className="max-w-[520px] mt-1 flex rounded overflow-hidden bg-[#2B2D31] border border-[#1E1F22]">
            <div className="w-1 shrink-0" style={{ backgroundColor: embedColors[idx % embedColors.length] }} />
            <div className="p-3 flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#00AFF4] mb-1">{project.title}</div>
              <div className="text-sm text-[#DBDEE1] mb-2">{project.description}</div>

              <div className="flex flex-wrap gap-1 mb-2">
                {(project.techStack || []).map((tech, i) => (
                  <span key={i} className="bg-[#1E1F22] text-[#B5BAC1] text-[11px] px-2 py-0.5 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>

              {project.image && (
                <img src={project.image} alt={project.title || "Project Screenshot"} className="w-full rounded mt-1 max-h-48 object-cover" />
              )}

              <div className="flex gap-3 mt-2">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#00AFF4] hover:underline">
                    <ExternalLink className="w-3 h-3" /> Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[#00AFF4] hover:underline">
                    <Github className="w-3 h-3" /> Source Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </Message>
      ))}
    </div>
  );
}
