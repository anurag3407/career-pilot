import React, { useState } from 'react';
import { Circle, Terminal as TerminalIcon } from 'lucide-react';

export default function Contact({ personal, socials }) {
  const [copied, setCopied] = useState(false);

  const email = personal?.email || "hello@example.com";
  
  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="w-full flex items-center justify-center px-4 py-16" style={{ backgroundColor: "#0d1117", fontFamily: "'Fira Code', 'JetBrains Mono', monospace" }}>
      <div className="w-full max-w-3xl rounded-xl overflow-hidden" style={{ background: "#0d1117", border: "1px solid #30363d", boxShadow: "0 0 0 1px #21262d, 0 8px 64px rgba(0,0,0,0.6)" }}>
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#161b22", borderBottom: "1px solid #30363d" }}>
          <Circle size={12} fill="#ff5f57" stroke="none" />
          <Circle size={12} fill="#febc2e" stroke="none" />
          <Circle size={12} fill="#28c840" stroke="none" />
          <span className="ml-2 text-xs text-[#6e7681]">bash - contact</span>
        </div>
        
        <div className="p-6 text-sm text-[#e6edf3]">
          <div className="mb-6 font-mono leading-relaxed">
            <div>
              <span className="text-[#4ade80]">user@macbook</span>
              <span className="text-[#e6edf3]">:</span>
              <span className="text-[#3b82f6]">~/portfolio</span>
              <span className="text-[#e6edf3]">$ curl -X POST https://api.contact.me \</span>
            </div>
            <div className="pl-4 text-[#e6edf3]">-H "Content-Type: application/json" \</div>
            <div className="pl-4 text-[#e6edf3]">-d '{"{"}</div>
            <div className="pl-8 text-[#79c0ff]">"to": <span className="text-[#a5d6ff]">"{email}"</span>,</div>
            <div className="pl-8 text-[#79c0ff]">"subject": <span className="text-[#a5d6ff]">"Hello!"</span>,</div>
            <div className="pl-8 text-[#79c0ff]">"message": <span className="text-[#a5d6ff]">"Let's work together."</span></div>
            <div className="pl-4 text-[#e6edf3]">{"}"}'</div>
          </div>
          
          <div className="mt-8 mb-4 border-t border-[#30363d] pt-8 flex flex-col items-center font-sans">
            <p className="text-[#8b949e] mb-6 text-center">{"// Run the command above or reach out directly:"}</p>
            <div className="flex gap-4">
              <button 
                onClick={handleCopy}
                className="px-6 py-2 rounded-md bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] transition-colors text-[#e6edf3] font-medium"
              >
                {copied ? "Copied!" : "Copy Email"}
              </button>
              <a 
                href={`mailto:${email}`}
                className="px-6 py-2 rounded-md bg-[#238636] border border-[#2ea043] hover:bg-[#2ea043] transition-colors text-white font-medium inline-block"
              >
                Send Email
              </a>
            </div>
          </div>
          
          {socials && socials.length > 0 && (
             <div className="mt-8 flex flex-wrap justify-center gap-6 font-mono text-sm">
               {socials.map((social, i) => {
                 const platform = typeof social === 'string' ? social : (social.platform || social.name);
                 const url = typeof social === 'string' ? '#' : (social.url || social.link);
                 return (
                   <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-[#79c0ff] hover:text-[#a5d6ff] underline decoration-[#30363d] underline-offset-4 transition-colors">
                     {platform}
                   </a>
                 );
               })}
             </div>
          )}
          
          <div className="mt-8 flex items-center gap-2 text-[#4ade80] font-mono">
            <TerminalIcon size={14} />
            <span className="animate-pulse">_</span>
          </div>
        </div>
      </div>
    </section>
  );
}
