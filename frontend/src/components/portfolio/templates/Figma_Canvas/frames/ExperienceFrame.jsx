import React from 'react';

export default function ExperienceFrame({ data }) {
  const { experience, education } = data;
  
  return (
    <div className="h-full p-10 bg-[#1A1A1A] overflow-y-auto custom-scrollbar">
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-8 text-white">Work Experience</h2>
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#333] before:to-transparent">
          {experience && experience.map((exp, i) => (
            <div key={exp.id || i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-blue-500 bg-[#1A1A1A] text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
              
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-5 rounded-lg border border-[#333] bg-[#252525]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                  <h3 className="font-bold text-lg text-white">{exp.role}</h3>
                  <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded">{exp.period}</span>
                </div>
                <h4 className="text-gray-300 font-medium mb-4">{exp.company}</h4>
                <p className="text-sm text-gray-400 mb-4">{exp.description}</p>
                {exp.techStack && exp.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.techStack.map(tech => (
                      <span key={tech} className="text-xs text-gray-500 bg-[#1A1A1A] px-2 py-1 rounded">{tech}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {education && education.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-8 text-white">Education</h2>
          <div className="space-y-6">
            {education.map((edu, i) => (
              <div key={edu.id || i} className="p-6 rounded-lg border border-[#333] bg-[#252525]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                  <h3 className="font-bold text-lg text-white">{edu.degree}</h3>
                  <span className="text-xs font-mono text-gray-400">{edu.period}</span>
                </div>
                <h4 className="text-blue-400 font-medium mb-3">{edu.school}</h4>
                <p className="text-sm text-gray-400">{edu.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
