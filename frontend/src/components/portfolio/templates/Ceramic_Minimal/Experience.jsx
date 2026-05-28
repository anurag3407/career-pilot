import React from 'react';

export default function Experience({ experience }) {
  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-gray-900">
          Work Experience
        </h2>

        {/* Timeline */}
        <div className="space-y-8 relative">
          {/* Vertical line (only on desktop) */}
          <div className="hidden md:block absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300" />

          {experience.map((job, index) => (
            <div key={index} className="relative md:pl-20">
              {/* Timeline dot (only on desktop) */}
              <div className="hidden md:block absolute left-0 top-2 w-12 h-12 bg-white border-2 border-gray-900 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-900 rounded-full" />
              </div>

              {/* Mobile timeline */}
              <div className="md:hidden mb-4 flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-900 rounded-full flex-shrink-0" />
                <div className="flex-1 h-0.5 bg-gray-300" />
              </div>

              {/* Job Card */}
              <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {job.role}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-700 font-medium">
                    {job.company}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {job.period}
                  </p>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {job.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
