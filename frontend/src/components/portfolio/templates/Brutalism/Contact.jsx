import React from 'react';

export default function Contact({ personal, socials }) {
  if (!personal && !socials) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-8 py-16 mb-20">
      <div className="border-4 border-black bg-purple-500 p-2 md:p-4 mb-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black m-0">Contact</h2>
        <span className="text-6xl hidden md:inline-block">📞</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border-4 border-black p-8 bg-yellow-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-3xl font-black uppercase mb-6 border-b-4 border-black pb-2">Get_In_Touch</h3>
          {personal?.email && (
            <a href={`mailto:${personal.email}`} className="block w-full border-4 border-black bg-white p-4 font-bold text-xl uppercase mb-4 hover:bg-black hover:text-white transition-colors text-center">
              Email_Me
            </a>
          )}
          {personal?.phone && (
            <div className="w-full border-4 border-black bg-white p-4 font-bold text-xl uppercase text-center mb-4">
              {personal.phone}
            </div>
          )}
        </div>

        {socials && socials.length > 0 && (
          <div className="border-4 border-black p-8 bg-cyan-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
             <h3 className="text-3xl font-black uppercase mb-6 border-b-4 border-black pb-2">Stalk_Me</h3>
             <div className="flex flex-col gap-4">
               {socials.map((social, idx) => (
                 <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="block w-full border-4 border-black bg-white p-4 font-bold text-xl uppercase hover:bg-black hover:text-white transition-colors text-center">
                   {social.platform || social.name}
                 </a>
               ))}
             </div>
          </div>
        )}
      </div>
    </section>
  );
}
