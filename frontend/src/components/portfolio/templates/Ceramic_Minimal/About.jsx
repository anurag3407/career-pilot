import React from 'react';

export default function About({ data }) {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-gray-900">
          About Me
        </h2>

        {/* Bio */}
        <div className="space-y-6 text-base sm:text-lg text-gray-700 leading-relaxed">
          <p>
            {data.bio}
          </p>

          {/* Location Info */}
          {data.location && (
            <p className="text-gray-600">
              <span className="font-semibold">📍 Location:</span> {data.location}
            </p>
          )}
        </div>

        {/* Tagline as emphasis */}
        {data.tagline && (
          <blockquote className="mt-12 pt-8 border-t border-gray-300">
            <p className="text-lg sm:text-xl text-gray-900 font-medium italic">
              "{data.tagline}"
            </p>
          </blockquote>
        )}
      </div>
    </section>
  );
}
