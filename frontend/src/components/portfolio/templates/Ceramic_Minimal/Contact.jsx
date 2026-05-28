import React from 'react';

export default function Contact({ socials, email }) {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
      <div className="max-w-3xl mx-auto text-center">
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
          Get in Touch
        </h2>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          I'm always open to new opportunities and interesting conversations. Reach out and let's talk!
        </p>

        {/* Email CTA */}
        {email && (
          <div className="mb-12">
            <a
              href={`mailto:${email}`}
              className="inline-block px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Send me an Email
            </a>
          </div>
        )}

        {/* Social Links */}
        <div className="flex flex-wrap gap-6 justify-center">
          {socials.github && (
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-300 hover:text-white text-base sm:text-lg font-medium"
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
              className="text-gray-300 hover:text-white text-base sm:text-lg font-medium"
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
              className="text-gray-300 hover:text-white text-base sm:text-lg font-medium"
            >
              Twitter
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            © 2026. Built with React & Tailwind CSS.
          </p>
        </div>
      </div>
    </section>
  );
}
