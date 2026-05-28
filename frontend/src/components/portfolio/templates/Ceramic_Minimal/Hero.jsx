import React from 'react';

export default function Hero({ data, socials, stats }) {
  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full text-center">
        {/* Avatar */}
        <div className="mb-8 flex justify-center">
          <img
            src={data.avatar}
            alt={data.name}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-gray-200"
          />
        </div>

        {/* Name */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gray-900">
          {data.name}
        </h1>

        {/* Title */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 font-medium">
          {data.title}
        </p>

        {/* Tagline */}
        <p className="text-base sm:text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          {data.tagline}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-12 py-8 border-t border-b border-gray-200">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.yearsExperience}+</p>
            <p className="text-sm sm:text-base text-gray-600">Years Experience</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.projectsCompleted}</p>
            <p className="text-sm sm:text-base text-gray-600">Projects Completed</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.happyClients}</p>
            <p className="text-sm sm:text-base text-gray-600">Happy Clients</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="#projects"
            className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium text-base"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-medium text-base"
          >
            Get in Touch
          </a>
        </div>

        {/* Social Links */}
        <div className="flex gap-6 justify-center">
          {socials.github && (
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            >
              GitHub
            </a>
          )}
          {socials.linkedin && (
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            >
              LinkedIn
            </a>
          )}
          {socials.twitter && (
            <a
              href={socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            >
              Twitter
            </a>
          )}
          {socials.email && (
            <a
              href={`mailto:${socials.email}`}
              aria-label="Email"
              className="text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            >
              Email
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
