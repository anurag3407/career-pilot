import React from "react";

const GitHubProfileTheme = ({ portfolioData }) => {
  const {
    name = "Your Name",
    username = "github-username",
    bio = "Full Stack Developer | Open Source Enthusiast",
    avatar = "https://github.com/identicons/default.png",
    location = "India",
    projects = [],
    skills = [],
    experience = [],
  } = portfolioData || {};

  const contributionLevels = [
    "bg-[#161b22]",
    "bg-[#0e4429]",
    "bg-[#006d32]",
    "bg-[#26a641]",
    "bg-[#39d353]",
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans p-6">

      {/* ── MAIN LAYOUT ── */}
      <div className="max-w-6xl mx-auto flex gap-6 flex-col md:flex-row">

        {/* ── LEFT SIDEBAR ── */}
        <div className="w-full md:w-64 flex-shrink-0">

          {/* Avatar */}
          <img
            src={avatar}
            alt={name}
            className="w-full rounded-full border-2 border-[#30363d] mb-4"
          />

          {/* Name & Username */}
          <h1 className="text-2xl font-semibold text-[#f0f6fc]">{name}</h1>
          <p className="text-lg text-[#8b949e] mb-3">@{username}</p>

          {/* Bio */}
          <p className="text-sm text-[#c9d1d9] mb-3">{bio}</p>

          {/* Location */}
          {location && (
            <p className="text-sm text-[#8b949e] mb-4">📍 {location}</p>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="border-t border-[#30363d] pt-4">
              <h3 className="text-sm font-semibold text-[#f0f6fc] mb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-[#161b22] border border-[#30363d] rounded-full px-3 py-1 text-xs text-[#58a6ff]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="border-t border-[#30363d] pt-4 mt-4">
              <h3 className="text-sm font-semibold text-[#f0f6fc] mb-2">
                Experience
              </h3>
              {experience.map((exp, i) => (
                <div key={i} className="mb-3">
                  <p className="text-sm font-medium text-[#f0f6fc]">
                    {exp.role}
                  </p>
                  <p className="text-xs text-[#8b949e]">{exp.company}</p>
                  <p className="text-xs text-[#8b949e]">{exp.duration}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT MAIN CONTENT ── */}
        <div className="flex-1">

          {/* ── CONTRIBUTION GRAPH ── */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-[#f0f6fc] border-b border-[#30363d] pb-2 mb-4">
              Contribution Activity
            </h2>
            <div className="flex gap-[3px] overflow-x-auto pb-2">
              {Array(52)
                .fill(null)
                .map((_, week) => (
                  <div key={week} className="flex flex-col gap-[3px]">
                    {Array(7)
                      .fill(null)
                      .map((_, day) => {
                        const level = Math.floor(Math.random() * 5);
                        return (
                          <div
                            key={day}
                            className={`w-[11px] h-[11px] rounded-sm ${contributionLevels[level]}`}
                            title={`${level} contributions`}
                          />
                        );
                      })}
                  </div>
                ))}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-1 mt-2 text-xs text-[#8b949e]">
              <span>Less</span>
              {contributionLevels.map((cls, i) => (
                <div
                  key={i}
                  className={`w-[11px] h-[11px] rounded-sm ${cls}`}
                />
              ))}
              <span>More</span>
            </div>
          </div>

          {/* ── PINNED PROJECTS ── */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-[#f0f6fc] border-b border-[#30363d] pb-2 mb-4">
              Pinned Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.slice(0, 6).map((project, i) => (
                <div
                  key={i}
                  className="bg-[#161b22] border border-[#30363d] rounded-md p-4 flex flex-col gap-2 hover:border-[#58a6ff] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>📁</span>
                    <a
                      href={project.link || "#"}
                      className="text-[#58a6ff] text-sm font-semibold hover:underline"
                    >
                      {project.name || "Project Name"}
                    </a>
                  </div>
                  <p className="text-xs text-[#8b949e] flex-1">
                    {project.description || "No description provided."}
                  </p>
                  <div className="flex gap-4 text-xs text-[#8b949e]">
                    <span className="text-[#f0f6fc]">
                      ● {project.language || "JavaScript"}
                    </span>
                    <span>⭐ {project.stars || 0}</span>
                    <span>🍴 {project.forks || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GitHubProfileTheme;