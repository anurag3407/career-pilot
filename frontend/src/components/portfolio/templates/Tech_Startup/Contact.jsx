import React from 'react';
import { Mail, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';

function getSocialIcon(platform) {
  const normalized = platform?.toLowerCase() || '';
  if (normalized.includes('github')) return Github;
  if (normalized.includes('linkedin')) return Linkedin;
  if (normalized.includes('twitter') || normalized.includes('x')) return Twitter;
  return ExternalLink;
}

export default function Contact({ personal, socials }) {
  return (
    <section id="contact" className="bg-[#0A192F] py-32 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-[#64FFDA] font-mono mb-4 tracking-widest">05. What's Next?</p>
        <h2 className="text-4xl md:text-5xl font-bold text-[#CCD6F6] mb-6">
          Get In Touch
        </h2>
        
        <p className="text-[#8892B0] text-lg mb-12 mx-auto leading-relaxed">
          Although I'm not currently looking for any new opportunities, my inbox is always open. 
          Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>

        {personal?.email && (
          <a
            href={`mailto:${personal.email}`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-mono text-[#64FFDA] border border-[#64FFDA] hover:bg-[#64FFDA]/10 transition-all duration-300 mb-16"
          >
            <Mail className="w-5 h-5" />
            Say Hello
          </a>
        )}

        {/* Social Links */}
        <div className="flex justify-center gap-6 mt-8">
          {socials?.map((social, idx) => {
            const Icon = getSocialIcon(social.platform);
            return (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8892B0] hover:text-[#64FFDA] transition-all duration-300 hover:-translate-y-1"
                aria-label={social.platform}
              >
                <Icon className="w-6 h-6" />
              </a>
            );
          })}
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 left-0 w-full text-center mt-12">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-mono text-[#8892B0] text-[13px] hover:text-[#64FFDA] transition-colors inline-flex items-center gap-2"
        >
          Built with React & Tailwind <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </section>
  );
}
