import React, { useState, useEffect } from 'react';
import { ShieldAlert, Key, User, MessageSquare } from 'lucide-react';

function DecryptText({ text, speed = 30 }) {
  const [displayed, setDisplayed] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayed(text.split('').map((letter, index) => {
        if (index < iteration) {
          return text[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayed}</span>;
}

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="relative w-full py-24 bg-[#010502] font-mono overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#00ff41 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex items-center gap-4 mb-16 border-b border-[#00ff41]/20 pb-6">
          <ShieldAlert size={32} className="text-[#ffcc00]" />
          <div>
            <div className="text-[#ffcc00] text-[10px] tracking-widest mb-1">// INTERCEPTED COMMS</div>
            <h2 className="text-3xl font-bold text-[#00ff41] tracking-[0.2em] uppercase">
              VOUCH_LOGS
            </h2>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2 border border-[#00ff41]/20 px-3 py-1 bg-[#00ff41]/5">
            <Key size={12} className="text-[#00ff41]" />
            <span className="text-[#00ff41] text-[10px] tracking-widest">RSA-4096 DECRYPTED</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((test, i) => (
            <div key={i} className="group relative border border-[#00ff41]/20 bg-[#000401] p-6 hover:border-[#00ff41]/60 transition-colors">
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-[#00ff41]/10 pb-3 mb-4">
                <div className="flex items-center gap-2 text-[#00ff41]/60 text-xs">
                  <User size={12} />
                  <span className="uppercase tracking-widest">{test.name || 'ANONYMOUS'}</span>
                </div>
                <div className="text-[10px] text-[#00ff41]/40 tracking-wider">
                  {test.company ? `@${test.company}` : 'UNKNOWN_ORG'}
                </div>
              </div>

              {/* Payload */}
              <div className="relative">
                <MessageSquare size={16} className="absolute -left-2 -top-2 text-[#00ff41]/20" />
                <p className="text-sm text-[#00ff41]/80 leading-relaxed pl-6 italic mb-4">
                  "<DecryptText text={test.text} speed={20} />"
                </p>
              </div>

              {/* Footer */}
              <div className="mt-auto pt-4 border-t border-[#00ff41]/10 flex justify-between items-center text-[10px] text-[#00ff41]/40">
                <span className="uppercase tracking-wider">ROLE: {test.role || 'CLASSIFIED'}</span>
                <span>SIG_VALID ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}