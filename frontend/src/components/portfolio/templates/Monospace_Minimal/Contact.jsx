import React from 'react';

export default function Contact({ personal, socials }) {
  if (!personal && !socials) return null;
  
  return (
    <section className="py-20 px-6 font-mono border-t border-foreground/20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-12 uppercase tracking-widest border-b border-foreground/20 pb-4">
          // Contact
        </h2>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 border border-foreground/20 bg-foreground/5 relative">
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-bold mb-2 tracking-widest uppercase">Initiate_Connection</h3>
            <p className="opacity-70 text-sm max-w-sm mb-6">
              System ready for new transmissions. Reach out for collaborations, inquiries, or data exchanges.
            </p>
            {personal?.email && (
              <a 
                href={`mailto:${personal.email}`}
                className="inline-block px-6 py-3 bg-foreground text-background font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
              >
                Send_Message()
              </a>
            )}
          </div>
          
          <div className="flex flex-col space-y-4 w-full md:w-auto">
            <h4 className="text-sm font-bold opacity-50 uppercase tracking-widest mb-2">Social_Links</h4>
            {socials && socials.map((social, i) => (
              <a 
                key={i} 
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 text-sm hover:text-foreground/70 transition-colors"
              >
                <span className="opacity-50 group-hover:opacity-100 transition-opacity">{'>'}</span>
                <span className="border-b border-dashed border-foreground/30 pb-0.5 group-hover:border-foreground/70">{social.platform}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
