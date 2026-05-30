import React, { useState } from 'react';
import data from '../../../../data/dummy_data.json';

/**
 * VS Code Theme Portfolio Template
 * Category: Famous UI Inspired
 * Description: Full VS Code editor UI where tabs represent sections, file tree is navigation, terminal panel shows about me output, syntax-highlighted code blocks.
 */
export default function VSCodeTheme() {
  const [activeTab, setActiveTab] = useState("About");

  return (
    <div className="h-screen bg-[#1e1e1e] text-gray-200 flex overflow-hidden">

      {/* Activity Bar */}
      <div className="w-14 bg-[#181818] flex flex-col items-center py-4 gap-6">
        <div className="text-blue-400 text-2xl">⚡</div>
        <div className="text-gray-400">📁</div>
        <div className="text-gray-400">🔍</div>
        <div className="text-gray-400">⚙️</div>
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-[#252526] border-r border-gray-800 hidden md:block">
        <div className="p-4 text-sm uppercase tracking-wide text-gray-400">
          Explorer
        </div>

        <div className="px-4 space-y-3">
          <div
            onClick={() => setActiveTab("About")}
            className={`cursor-pointer ${
              activeTab === "About" ? "text-blue-400" : "text-gray-400"
            }`}
          >
            📄 About.jsx
          </div>

          <div
            onClick={() => setActiveTab("Skills")}
            className={`cursor-pointer ${
              activeTab === "Skills" ? "text-blue-400" : "text-gray-400"
            }`}
          >
            📄 Skills.jsx
          </div>

          <div
            onClick={() => setActiveTab("Projects")}
            className={`cursor-pointer ${
              activeTab === "Projects" ? "text-blue-400" : "text-gray-400"
            }`}
          >
            📄 Projects.jsx
          </div>

          <div
            onClick={() => setActiveTab("Experience")}
            className={`cursor-pointer ${
              activeTab === "Experience" ? "text-blue-400" : "text-gray-400"
            }`}
          >
            📄 Experience.jsx
          </div>

          <div
            onClick={() => setActiveTab("Contact")}
            className={`cursor-pointer ${
              activeTab === "Contact" ? "text-blue-400" : "text-gray-400"
            }`}
          >
            📄 Contact.jsx
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Tabs */}
        <div className="h-12 bg-[#2d2d2d] flex items-center px-4 border-b border-gray-800">
          <div className="bg-[#1e1e1e] px-4 py-2 rounded-t text-sm">
            {activeTab}.jsx
          </div>
        </div>

        {/* Editor */}
        {activeTab === "About" && (
          <>
            <h1 className="text-3xl md:text-5xl font-bold text-blue-400 mb-3">
              {data.personal.name}
            </h1>

            <p className="text-xl text-gray-400 mb-8">
              {data.personal.title}
            </p>

            <div className="bg-[#252526] p-6 rounded-lg border border-gray-700">
              <p className="text-green-400 mb-2">
                // About Me
              </p>
              <img
                src={data.personal.avatar}
                alt={data.personal.name}
                className="w-32 h-32 rounded-full border-2 border-blue-400 mb-6"
              />
              <p className="leading-7 text-gray-300">
                {data.personal.bio}
              </p>
            </div>
          </>
        )}

        {activeTab === "Skills" && (
          <>
            <h2 className="text-4xl text-yellow-400 mb-6">
              Skills.jsx
            </h2>

            <div className="flex flex-wrap gap-3">
              {data.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-[#252526] border border-gray-700 px-4 py-2 rounded"
                >
                  {skill.name}
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "Projects" && (
          <>
            <h2 className="text-4xl text-cyan-400 mb-6">
              Projects.jsx
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {data.projects.slice(0, 4).map((project, index) => (
                <div
                  key={index}
                  className="bg-[#252526] border border-gray-700 p-4 rounded"
                >
                  <h3 className="font-bold text-lg">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "Experience" && (
          <>
            <h2 className="text-4xl text-purple-400 mb-6">
              Experience.jsx
            </h2>

            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <div
                  key={index}
                  className="bg-[#252526] border border-gray-700 p-4 rounded"
                >
                  <h3 className="font-bold text-lg">
                    {exp.role}
                  </h3>

                  <p className="text-gray-400">
                    {exp.company} • {exp.period}
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "Contact" && (
          <>
            <h2 className="text-4xl text-pink-400 mb-6">
              Contact.jsx
            </h2>

            <div className="bg-[#252526] border border-gray-700 p-6 rounded-lg">
              <div className="space-y-4">
                <p>
                  <span className="text-green-400">Email:</span>{" "}
                  {data.socials.email}
                </p>

                <p>
                  <span className="text-green-400">GitHub:</span>{" "}
                  <a
                    href={data.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {data.socials.github}
                  </a>
                </p>

                <p>
                  <span className="text-green-400">LinkedIn:</span>{" "}
                  <a
                    href={data.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {data.socials.linkedin}
                  </a>
                </p>

                {data.socials.twitter && (
                  <p>
                    <span className="text-green-400">Twitter:</span>{" "}
                    <a
                      href={data.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {data.socials.twitter}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Terminal */}
        <div className="h-40 bg-[#181818] border-t border-gray-800 p-4 font-mono text-sm">
          <p className="text-green-400">
            PS portfolio&gt; npm run dev
          </p>

          <p className="mt-2 text-gray-400">
            Location: {data.personal.location}
          </p>

          <p className="text-cyan-400">
            Opened: {activeTab}.jsx
          </p>
        </div>

      </div>
    </div>
  );
}
