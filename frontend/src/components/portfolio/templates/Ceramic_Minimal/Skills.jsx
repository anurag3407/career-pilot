import React, { useMemo } from 'react';

export default function Skills({ skills }) {
  // Group skills by category
  const groupedSkills = useMemo(() => {
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});
  }, [skills]);

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-gray-900">
          Skills & Expertise
        </h2>

        {/* Skills by Category */}
        <div className="space-y-12">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              {/* Category Title */}
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
                {category}
              </h3>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    {/* Skill Name */}
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">{skill.name}</h4>
                      <span className="text-sm text-gray-600">{skill.level}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-900 h-2 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
