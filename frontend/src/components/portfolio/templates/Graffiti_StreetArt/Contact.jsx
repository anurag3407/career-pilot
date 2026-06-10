import React from 'react';
import { Mail, MapPin, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';

export default function Contact({ personal, socials }) {
  if (!personal) return null;

  const getSocialIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'github': return <Github className="h-6 w-6" />;
      case 'linkedin': return <Linkedin className="h-6 w-6" />;
      case 'twitter': return <Twitter className="h-6 w-6" />;
      default: return <ExternalLink className="h-6 w-6" />;
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center bg-black overflow-hidden py-24">
      {/* Heavy graffiti drips at top */}
      <div className="absolute top-0 left-1/4 h-40 w-2 bg-pink-500 opacity-80" />
      <div className="absolute top-0 left-[26%] h-24 w-1 bg-pink-500 opacity-60" />
      <div className="absolute top-0 right-1/3 h-64 w-3 bg-green-500 opacity-70" />
      <div className="absolute top-0 right-[32%] h-32 w-1.5 bg-green-500 opacity-50" />

      {/* Center glowing orb */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 animate-pulse rounded-full bg-pink-600 opacity-20 blur-[150px]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 md:px-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-8 rotate-[-3deg] transform border-4 border-white bg-black p-4 shadow-[8px_8px_0px_0px_rgba(250,204,21,1)]">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-white md:text-7xl">
              HIT MY LINE
            </h2>
          </div>

          <p className="mb-12 max-w-2xl text-lg font-bold text-gray-400">
            Got a project in mind? Want to collaborate on a masterpiece? 
            Drop a message and let's create something legendary.
          </p>

          <div className="flex w-full flex-col gap-6 md:flex-row md:justify-center md:gap-12">
            {personal.email && (
              <a 
                href={`mailto:${personal.email}`}
                className="group flex flex-col items-center rounded-xl border-2 border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-500 hover:bg-pink-500/10"
              >
                <div className="mb-4 rounded-full bg-pink-500/20 p-4 text-pink-400 group-hover:scale-110 transition-transform">
                  <Mail className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-black uppercase text-gray-500 mb-1">Email</h3>
                <p className="text-lg font-bold text-white">{personal.email}</p>
              </a>
            )}

            {personal.location && (
              <div className="group flex flex-col items-center rounded-xl border-2 border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-500 hover:bg-green-500/10">
                <div className="mb-4 rounded-full bg-green-500/20 p-4 text-green-400 group-hover:scale-110 transition-transform">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-black uppercase text-gray-500 mb-1">Location</h3>
                <p className="text-lg font-bold text-white">{personal.location}</p>
              </div>
            )}
          </div>

          {/* Socials */}
          {socials && socials.length > 0 && (
            <div className="mt-16 flex flex-wrap justify-center gap-6">
              {socials.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-yellow-400 hover:text-black hover:shadow-[0_0_20px_rgba(250,204,21,0.6)] hover:scale-110"
                >
                  {getSocialIcon(social.platform)}
                  {/* Decorative dot */}
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </div>
          )}

          {/* Copyright / Footer Note */}
          <div className="mt-24 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-600">
              © {new Date().getFullYear()} {personal.name || 'Artist'}. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
