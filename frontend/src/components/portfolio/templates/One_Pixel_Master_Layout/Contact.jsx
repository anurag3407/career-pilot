import React, { useContext } from 'react';
import { PortfolioContext } from './index';

const Contact = () => {
  const { personal, socials } = useContext(PortfolioContext);

  return (
    <section className="relative">
      <div className="absolute top-0 right-0 p-2 text-[10px] text-[#444] font-mono select-none">
        OBJ_ID: CONTACT_06
      </div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold uppercase text-white tracking-widest">Contact</h2>
        <div className="flex-1 h-px bg-[#333]"></div>
      </div>
      
      <div className="border border-[#333] p-8 bg-[#0a0a0a] group hover:border-green-500/50 transition-colors duration-500 text-center">
        <div className="mb-8">
          <p className="text-[#a0a0a0] mb-2 font-mono">INITIATE_CONNECTION_PROTOCOL</p>
          <div className="w-16 h-px bg-[#333] mx-auto group-hover:bg-green-500 transition-colors"></div>
        </div>
        
        <h3 className="text-2xl md:text-4xl font-bold uppercase text-white mb-6">
          Ready to Collaborate?
        </h3>
        
        <a 
          href={`mailto:${personal.email || 'hello@example.com'}`}
          className="inline-block border-2 border-green-500 text-green-500 px-8 py-4 font-bold uppercase tracking-widest hover:bg-green-500 hover:text-black transition-all duration-300"
        >
          [ SEND_TRANSMISSION ]
        </a>
        
        <div className="mt-12 pt-8 border-t border-[#333] flex flex-wrap justify-center gap-6">
          {socials.github && (
            <a href={socials.github} target="_blank" rel="noreferrer" className="text-[#666] hover:text-white uppercase text-xs tracking-widest transition-colors">
              // Github
            </a>
          )}
          {socials.linkedin && (
            <a href={socials.linkedin} target="_blank" rel="noreferrer" className="text-[#666] hover:text-white uppercase text-xs tracking-widest transition-colors">
              // LinkedIn
            </a>
          )}
          {socials.twitter && (
            <a href={socials.twitter} target="_blank" rel="noreferrer" className="text-[#666] hover:text-white uppercase text-xs tracking-widest transition-colors">
              // Twitter
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
