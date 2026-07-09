import json
import os
import re

folders = [
    "Live_Satellite_Imagery_Feed",
    "Low_Poly_Terrain",
    "Magnetic_Dock",
    "Magnifying_Glass_Hidden_Reveal",
    "Matte_Clay",
    "Medium_Article",
    "Memphis_Pop",
    "Michelin_Star_Chef_Plating",
    "Minimal_Dark_Fluid",
    "Morphing_Blobs"
]

jsx_code = """import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';

export default function Template() {
  const { data } = usePortfolio();
  
  if (!data || !data.personalInfo) {
    return <div className="p-8 text-center text-gray-500">Loading template data...</div>;
  }

  const { personalInfo, experience, projects, skills, education } = data;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-8 md:p-16">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-12 text-center">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">{personalInfo.name}</h1>
          <p className="text-2xl font-light opacity-90">{personalInfo.headline}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-medium opacity-80">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
          </div>
        </header>
        
        <main className="p-12 space-y-16">
          {/* About Section */}
          {personalInfo.summary && (
            <section>
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-gray-100 pb-2">About Me</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience Section */}
          {experience && experience.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-gray-100 pb-2">Experience</h2>
              <div className="space-y-8">
                {experience.map((exp, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-blue-200">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-2"></div>
                    <h3 className="text-2xl font-semibold text-gray-900">{exp.role}</h3>
                    <p className="text-lg text-blue-600 font-medium mb-3">{exp.company} <span className="text-gray-400 font-normal">| {exp.duration}</span></p>
                    <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects Section */}
          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-gray-100 pb-2">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((proj, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{proj.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{proj.description}</p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {proj.technologies.map((tech, j) => (
                          <span key={j} className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b-2 border-gray-100 pb-2">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, i) => (
                  <span key={i} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                    {skill.name || skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
"""

# Write JSX files
for folder in folders:
    dir_path = f"frontend/src/components/portfolio/templates/{folder}"
    os.makedirs(dir_path, exist_ok=True)
    with open(f"{dir_path}/index.jsx", "w") as f:
        f.write(jsx_code)

# Modify templates.js
templates_file = "frontend/src/data/templates.js"
with open(templates_file, "r") as f:
    content = f.read()

# We'll use a regex to extract the templates array. Since it's a JS file exporting an array, 
# we can find all objects and parse them, but it's simpler to do a JS string manipulation.
# Let's extract the JS array content.
# The file looks like: export const templates = [ { ... }, { ... } ];
match = re.search(r'export const templates = (\[.*\]);', content, re.DOTALL)
if match:
    # Need to be careful with JSON parsing because it might not be strict JSON.
    # Actually, it's JS. To do this safely, we can just find the string block for each template
    # and move it to the top.
    pass

# Alternative string replacement strategy:
for folder in folders:
    # Find the object that has `id: "{folder}"` or `"id": "{folder}"`
    # We will regex to find the object block.
    # Regex pattern: { ... "id": "Folder_Name" ... }
    # This might be tricky if there are nested braces. 
    pass

