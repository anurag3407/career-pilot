import React from 'react';

export default function Contact({ personal, socials }) {
  if (!personal && (!socials || socials.length === 0)) return null;

  return (
    <section className="py-24 px-6 bg-white text-gray-900 border-t border-gray-100">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-light mb-8 tracking-wide">Get In Touch</h2>
        <div className="w-12 h-px bg-gray-300 mx-auto mb-12"></div>
        
        {personal?.email && (
          <a href={`mailto:${personal.email}`} className="text-xl md:text-2xl font-light text-gray-500 hover:text-gray-900 transition-colors block mb-12">
            {personal.email}
          </a>
        )}

        {socials && socials.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8">
            {socials.map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors duration-300"
              >
                {social.platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
