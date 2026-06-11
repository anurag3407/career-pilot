import React from 'react';
import { Mail, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';

export default function Contact({ personal, socials }) {
  if (!personal) return null;

  const socialLinks = socials || [];

  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'github': return <Github size={24} />;
      case 'linkedin': return <Linkedin size={24} />;
      case 'twitter': return <Twitter size={24} />;
      default: return <ExternalLink size={24} />;
    }
  };

  return (
    <section className="relative w-full pb-12">
      <div className="manga-panel bg-black text-white p-8 md:p-12 relative overflow-hidden flex flex-col items-center text-center">
        {/* Huge background text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden">
          <span className="text-[12rem] font-black tracking-tighter leading-none whitespace-nowrap transform -rotate-12">
            TO BE CONTINUED
          </span>
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto space-y-8">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-widest manga-title text-white" style={{ textShadow: '4px 4px 0px #ff0000' }}>
            CONTACT
          </h2>
          
          <p className="text-xl md:text-2xl font-bold bg-white text-black p-4 border-4 border-white transform rotate-1 inline-block">
            READY FOR THE NEXT ARC?
          </p>

          <div className="flex flex-col items-center space-y-4">
            <a 
              href={`mailto:${personal.email}`}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-2xl font-black uppercase tracking-widest text-black bg-white border-4 border-white overflow-hidden transition-transform hover:scale-105"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
              <span className="relative flex items-center gap-2">
                <Mail className="group-hover:animate-bounce" /> {personal.email}
              </span>
            </a>
          </div>

          {socialLinks.length > 0 && (
            <div className="flex justify-center flex-wrap gap-4 pt-8">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black p-3 border-4 border-transparent hover:border-white hover:bg-black hover:text-white transition-all transform hover:-translate-y-2"
                  title={social.platform}
                >
                  {getIcon(social.platform)}
                </a>
              ))}
            </div>
          )}

          <div className="mt-12 text-sm font-bold uppercase tracking-widest text-gray-400">
            <p>Episode 1 - End.</p>
            <p className="mt-2">© {new Date().getFullYear()} {personal.name}</p>
          </div>
        </div>
        
        {/* Manga corner decoration */}
        <div className="absolute bottom-4 right-4 text-6xl font-black opacity-20">
          END
        </div>
      </div>
    </section>
  );
}
