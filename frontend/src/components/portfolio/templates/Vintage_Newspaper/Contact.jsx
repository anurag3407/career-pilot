import React from 'react';

export default function Contact({ personal, socials }) {
  return (
    <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto border-t-4 border-double border-[#2b2b2b] border-b-8 bg-[#f4f1ea] text-[#2b2b2b] font-serif mb-12">
      <div className="border-4 border-[#2b2b2b] p-8 max-w-3xl mx-auto text-center bg-[#eae5d8] relative">
        <div className="absolute top-0 left-0 w-full h-full border-2 border-[#2b2b2b] m-1 pointer-events-none"></div>
        <h2 className="text-sm uppercase tracking-[0.3em] mb-4">Wanted: New Opportunities</h2>
        <h3 className="text-4xl md:text-6xl font-black uppercase mb-6 leading-none">Get In Touch</h3>
        <p className="text-xl mb-8 italic">Send a telegram or post a letter today!</p>
        
        {personal && (
          <div className="space-y-2 mb-8 font-sans font-bold uppercase tracking-wider">
            {personal.email && <p>Email: <a href={`mailto:${personal.email}`} className="underline hover:bg-[#2b2b2b] hover:text-[#f4f1ea] px-1">{personal.email}</a></p>}
            {personal.phone && <p>Phone: {personal.phone}</p>}
            {personal.location && <p>Based In: {personal.location}</p>}
          </div>
        )}
        
        {socials && socials.length > 0 && (
          <div>
            <p className="text-sm uppercase tracking-widest border-b border-[#2b2b2b] pb-2 mb-4 inline-block">Also Reachable Via</p>
            <div className="flex flex-wrap justify-center gap-6">
              {socials.map((social, i) => (
                <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="font-bold underline uppercase hover:bg-[#2b2b2b] hover:text-[#f4f1ea] px-2 py-1 transition-colors">
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
