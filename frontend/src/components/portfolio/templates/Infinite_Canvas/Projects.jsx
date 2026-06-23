import React from "react";
import {
  FolderKanban,
  ExternalLink,
  Github,
} from "lucide-react";
import CanvasCard from "./CanvasCard";

const PROJECT_POSITIONS = [
  { left: "5%", top: "0px", rotate: -3 },
  { left: "55%", top: "180px", rotate: 2 },
  { left: "15%", top: "520px", rotate: -2 },
  { left: "60%", top: "780px", rotate: 3 },
  { left: "8%", top: "1180px", rotate: -1 },
  { left: "55%", top: "1450px", rotate: 2 },
];

export default function Projects({ data }) {
  const projects = Array.isArray(data?.projects)
    ? data.projects
    : [];

  if (projects.length === 0) {
    return (
      <CanvasCard>
        <div className="text-center py-12">
          <FolderKanban
            size={48}
            className="mx-auto mb-4 text-cyan-400"
          />

          <h2 className="text-3xl font-bold mb-3">
            Projects Canvas
          </h2>

          <p className="text-gray-400">
            No projects available.
          </p>
        </div>
      </CanvasCard>
    );
  }

  return (
    <div>
      <div className="text-center mb-16">
        <div className="flex justify-center items-center gap-3 mb-4">
          <FolderKanban
            size={28}
            className="text-cyan-400"
          />

          <h2 className="text-4xl md:text-5xl font-black">
            Infinite Canvas
          </h2>
        </div>

        <p className="max-w-2xl mx-auto text-gray-400">
          Explore projects placed across a connected
          whiteboard-inspired workspace.
        </p>
      </div>

      {/* Desktop Canvas */}
      <div className="hidden lg:block relative min-h-[1900px]">
        {/* Connection Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          aria-hidden="true"
        >
          <line
            x1="25%"
            y1="120"
            x2="68%"
            y2="320"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="8 8"
          />

          <line
            x1="68%"
            y1="320"
            x2="30%"
            y2="650"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="8 8"
          />

          <line
            x1="30%"
            y1="650"
            x2="72%"
            y2="920"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="8 8"
          />

          <line
            x1="72%"
            y1="920"
            x2="25%"
            y2="1320"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="8 8"
          />

          <line
            x1="25%"
            y1="1320"
            x2="72%"
            y2="1580"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="8 8"
          />
        </svg>

        {projects.map((project, index) => {
          const basePosition =
            PROJECT_POSITIONS[
              index % PROJECT_POSITIONS.length
            ];

          const cycle = Math.floor(
            index / PROJECT_POSITIONS.length
          );

          const position = {
            ...basePosition,
            top: `${
              parseInt(basePosition.top, 10) +
              cycle * 1800
            }px`,
          };

          const image =
            project?.image ||
            "https://placehold.co/800x450?text=Project";

          const techStack = Array.isArray(
            project?.techStack
          )
            ? project.techStack
            : [];

          const repoLink =
            project?.githubUrl ||
            project?.repoUrl;

          return (
            <div
              key={`${project?.title || "project"}-${index}`}
              className="absolute w-[420px]"
              style={{
                left: position.left,
                top: position.top,
              }}
            >
              <CanvasCard
                rotate={position.rotate}
                delay={index * 0.08}
              >
                <img
                  src={image}
                  alt={project?.title || "Project"}
                  className="w-full h-52 object-cover rounded-2xl mb-5"
                />

                <h3 className="text-2xl font-bold mb-3">
                  {project?.title || "Untitled Project"}
                </h3>

                <p className="text-gray-400 leading-7 mb-5">
                  {project?.description ||
                    "No description available."}
                </p>

                {techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {techStack.map((tech) => (
                      <span
                        key={`${project?.title}-${tech}-${index}`}
                        className="px-3 py-1 rounded-full text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 flex-wrap">
                  {project?.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold"
                    >
                      <ExternalLink size={16} />
                      Live
                    </a>
                  )}

                  {repoLink && (
                    <a
                      href={repoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5"
                    >
                      <Github size={16} />
                      Code
                    </a>
                  )}
                </div>
              </CanvasCard>
            </div>
          );
        })}
      </div>

      {/* Mobile + Tablet */}
      <div className="lg:hidden space-y-6">
        {projects.map((project, index) => {
          const image =
            project?.image ||
            "https://placehold.co/800x450?text=Project";

          const techStack = Array.isArray(
            project?.techStack
          )
            ? project.techStack
            : [];

          const repoLink =
            project?.githubUrl ||
            project?.repoUrl;

          return (
            <CanvasCard
              key={`${project?.title || "project"}-${index}`}
              delay={index * 0.05}
            >
              <img
                src={image}
                alt={project?.title || "Project"}
                className="w-full h-52 object-cover rounded-2xl mb-5"
              />

              <h3 className="text-2xl font-bold mb-3">
                {project?.title || "Untitled Project"}
              </h3>

              <p className="text-gray-400 mb-5">
                {project?.description ||
                  "No description available."}
              </p>

              {techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {techStack.map((tech) => (
                    <span
                      key={`${project?.title}-${tech}-${index}`}
                      className="px-3 py-1 rounded-full text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                {project?.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold"
                  >
                    <ExternalLink size={16} />
                    Live
                  </a>
                )}

                {repoLink && (
                  <a
                    href={repoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5"
                  >
                    <Github size={16} />
                    Code
                  </a>
                )}
              </div>
            </CanvasCard>
          );
        })}
      </div>
    </div>
  );
}