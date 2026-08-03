import React, { useState } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

export default function Experience({ experience }) {
  const [activeTabId, setActiveTabId] = useState(0);

  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience" className="bg-[#0A192F] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#CCD6F6]">
            <span className="text-[#64FFDA] font-mono text-xl md:text-2xl mr-2">02.</span>
            Where I've Worked
          </h2>
          <div className="flex-grow h-px bg-[#233554] max-w-[300px]"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Tabs */}
          <div className="flex md:flex-col overflow-x-auto hide-scrollbar md:w-48 border-b md:border-b-0 md:border-l border-[#233554]">
            {experience.map((exp, index) => (
              <button type="button"
                key={index}
                onClick={() => setActiveTabId(index)}
                className={`text-left px-5 py-3 font-mono text-sm whitespace-nowrap transition-all duration-200 border-b-2 md:border-b-0 md:border-l-2 -ml-[2px] ${
                  activeTabId === index
                    ? 'text-[#64FFDA] border-[#64FFDA] bg-[#112240]'
                    : 'text-[#8892B0] border-transparent hover:text-[#64FFDA] hover:bg-[#112240]/50'
                }`}
              >
                {exp.company}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 min-h-[320px]">
            {experience.map((exp, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  activeTabId === index ? 'block opacity-100 translate-y-0' : 'hidden opacity-0 translate-y-4'
                }`}
              >
                <h3 className="text-xl md:text-2xl font-bold text-[#CCD6F6] mb-2">
                  {exp.title} <span className="text-[#64FFDA]">@ {exp.company}</span>
                </h3>
                <p className="text-sm font-mono text-[#8892B0] mb-6 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {exp.startDate} - {exp.endDate}
                </p>

                <ul className="space-y-4">
                  {exp.description && exp.description.split('. ').map((item, i) => item ? (
                    <li key={i} className="flex items-start gap-3 text-[#8892B0]">
                      <ChevronRight className="w-5 h-5 text-[#64FFDA] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item.trim()}{item.endsWith('.') ? '' : '.'}</span>
                    </li>
                  ) : null)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}