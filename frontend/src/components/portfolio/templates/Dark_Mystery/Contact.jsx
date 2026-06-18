import React from 'react';
import { Mail, MapPin, Radio, Link as LinkIcon } from 'lucide-react';

export default function Contact({ personal, socials }) {
  if (!personal) return null;

  return (
    <section id="contact" className="relative isolate overflow-hidden bg-[#030406] px-4 py-20 text-stone-100 sm:px-6 lg:px-8 border-t border-stone-800/50">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_80%,rgba(112,24,54,0.2),transparent_40%),linear-gradient(0deg,#030406_0%,#0b0a0d_100%)]" />
      <div className="absolute left-1/2 bottom-0 -z-10 h-64 w-96 -translate-x-1/2 rounded-full bg-[#7f1d1d]/10 blur-3xl" />

      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-12 flex flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-2 border border-red-300/20 bg-red-950/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-red-100/80">
            <Radio className="h-4 w-4 animate-pulse" />
            Secure Channel Open
          </div>
          <h2 className="font-serif text-4xl leading-tight text-stone-50 sm:text-5xl lg:text-6xl">
            Initiate Contact.
          </h2>
          <p className="mt-6 max-w-2xl text-base text-stone-400">
            Ready to solve your next problem. Drop a line through the encrypted network below.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {personal.email && (
            <a 
              href={`mailto:${personal.email}`}
              className="group flex flex-col items-center border border-stone-500/20 bg-black/45 p-6 shadow-xl shadow-black/40 backdrop-blur-sm transition duration-300 hover:border-amber-200/30 hover:bg-stone-950/60"
            >
              <Mail className="mb-4 h-6 w-6 text-stone-500 transition-colors group-hover:text-amber-200/80" />
              <span className="text-sm font-medium tracking-wide text-stone-300 group-hover:text-amber-50">
                {personal.email}
              </span>
            </a>
          )}
          {personal.location && (
            <div className="group flex flex-col items-center border border-stone-500/20 bg-black/45 p-6 shadow-xl shadow-black/40 backdrop-blur-sm transition duration-300 hover:border-emerald-200/30 hover:bg-stone-950/60">
              <MapPin className="mb-4 h-6 w-6 text-stone-500 transition-colors group-hover:text-emerald-200/80" />
              <span className="text-sm font-medium tracking-wide text-stone-300 group-hover:text-amber-50">
                {personal.location}
              </span>
            </div>
          )}
          {socials && socials.length > 0 && socials.map((social, idx) => (
            <a
              key={idx}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center border border-stone-500/20 bg-black/45 p-6 shadow-xl shadow-black/40 backdrop-blur-sm transition duration-300 hover:border-amber-200/30 hover:bg-stone-950/60 sm:col-span-2 lg:col-span-1"
            >
              <LinkIcon className="mb-4 h-6 w-6 text-stone-500 transition-colors group-hover:text-amber-200/80" />
              <span className="text-sm font-medium uppercase tracking-[0.15em] text-stone-300 group-hover:text-amber-50">
                {social.platform}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
