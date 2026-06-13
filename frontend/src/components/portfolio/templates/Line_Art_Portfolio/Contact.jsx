import React from 'react';
import { Mail, ArrowUpRight, Github, Linkedin, Twitter } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { FadeIn, WireframeCorners } from './shared';

const ContactSection = () => {
  const { email, github, linkedin, twitter } = data.socials;

  return (
    <section id="contact" className="py-24">
      <FadeIn>
        <div className="border border-zinc-200 p-12 md:p-24 text-center relative group">
          <WireframeCorners />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border bg-white border-zinc-200 flex items-center justify-center transform rotate-45">
            <Mail size={20} strokeWidth={1} className="-rotate-45 text-zinc-400" />
          </div>

          <h3 className="text-4xl md:text-5xl font-extralight text-zinc-900 mb-8 mt-4">Start a project</h3>
          <p className="text-zinc-400 font-light mb-12 max-w-md mx-auto leading-relaxed">Available for new opportunities. Send a message to discuss your next technical or creative endeavor.</p>

          <a href={`mailto:${email}`} className="inline-flex items-center gap-3 border border-zinc-900 px-8 py-4 text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-300 text-xs tracking-[0.2em] uppercase">
            Say Hello <ArrowUpRight size={14} strokeWidth={1} />
          </a>

          <div className="flex justify-center gap-8 mt-24">
            {github && (<a href={github} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors"><Github size={20} strokeWidth={1} /></a>)}
            {linkedin && (<a href={linkedin} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors"><Linkedin size={20} strokeWidth={1} /></a>)}
            {twitter && (<a href={twitter} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-900 transition-colors"><Twitter size={20} strokeWidth={1} /></a>)}
          </div>
        </div>
      </FadeIn>
    </section>
  );
};

export default ContactSection;
