import React from 'react';
import { Mail, MailCheck, Github, Linkedin, Twitter } from 'lucide-react';

export default function Contact({ data }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('VCR system: Message buffered to memory block.');
  };

  return (
    <div className="flex-1 flex flex-col justify-between h-full font-mono text-[#00f3ff]">
      {/* OSD label */}
      <div className="flex justify-between items-center text-xs tracking-wider text-pink-500 font-bold border-b border-cyan-900/30 pb-3 mb-4">
        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> INDEX: 07_CONTACT</span>
        <span className="text-cyan-400">PLAY: 0:15:00</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto items-stretch">
        
        {/* Left Side: Contact Form in tape label sticker look */}
        <form onSubmit={handleSubmit} className="md:col-span-8 bg-white text-gray-900 p-5 rounded-xl border-4 border-gray-400 shadow-[0_10px_25px_rgba(0,0,0,0.5)] relative flex flex-col justify-between">
          {/* Cassette sticker lines design pattern */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-t-lg opacity-80" />
          
          <div className="mt-2 mb-3">
            <span className="text-[9px] font-black text-gray-500 tracking-widest uppercase">INSERT MESSAGE TAPE LABEL</span>
            <h3 className="text-base font-black text-black uppercase tracking-wide border-b border-gray-300 pb-1 mt-0.5">MESSAGE DETAILS</h3>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="YOUR NAME"
                required
                className="w-full bg-gray-50 border-2 border-gray-200 focus:border-cyan-500 rounded px-2.5 py-1.5 text-xs font-bold uppercase placeholder-gray-400 outline-none text-black"
              />
              <input
                type="email"
                placeholder="YOUR EMAIL"
                required
                className="w-full bg-gray-50 border-2 border-gray-200 focus:border-cyan-500 rounded px-2.5 py-1.5 text-xs font-bold uppercase placeholder-gray-400 outline-none text-black"
              />
            </div>
            <textarea
              placeholder="YOUR MESSAGE..."
              required
              rows={3}
              className="w-full bg-gray-50 border-2 border-gray-200 focus:border-cyan-500 rounded px-2.5 py-1.5 text-xs font-bold uppercase placeholder-gray-400 outline-none resize-none text-black flex-1"
            />
          </div>

          <button
            type="submit"
            className="mt-3 w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-extrabold uppercase tracking-widest rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <MailCheck className="w-3.5 h-3.5" />
            <span>SUBMIT LABEL TO VCR</span>
          </button>
        </form>

        {/* Right Side: Social Media Links */}
        <div className="md:col-span-4 bg-[#121319] p-4 rounded-xl border border-cyan-500/20 flex flex-col justify-center gap-3">
          <span className="text-[10px] text-gray-500 font-bold tracking-widest text-center mb-1">CONNECT DIRECT:</span>
          
          {data.socials.email && (
            <a
              href={`mailto:${data.socials.email}`}
              className="p-3 bg-[#08080a] border border-gray-900 rounded-lg hover:border-pink-500 text-xs font-bold transition-all flex items-center gap-3 hover:text-white"
            >
              <Mail className="w-4 h-4 text-pink-500" />
              <span className="truncate select-text">EMAIL ME</span>
            </a>
          )}
          {data.socials.github && (
            <a
              href={data.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#08080a] border border-gray-900 rounded-lg hover:border-cyan-400 text-xs font-bold transition-all flex items-center gap-3 hover:text-white"
            >
              <Github className="w-4 h-4 text-cyan-400" />
              <span>GITHUB</span>
            </a>
          )}
          {data.socials.linkedin && (
            <a
              href={data.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#08080a] border border-gray-900 rounded-lg hover:border-pink-500 text-xs font-bold transition-all flex items-center gap-3 hover:text-white"
            >
              <Linkedin className="w-4 h-4 text-pink-500" />
              <span>LINKEDIN</span>
            </a>
          )}
          {data.socials.twitter && (
            <a
              href={data.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#08080a] border border-gray-900 rounded-lg hover:border-cyan-400 text-xs font-bold transition-all flex items-center gap-3 hover:text-white"
            >
              <Twitter className="w-4 h-4 text-cyan-400" />
              <span>TWITTER</span>
            </a>
          )}
        </div>

      </div>

      <div className="text-[9px] text-gray-600 border-t border-cyan-900/30 pt-3 mt-4 text-right">
        END OF TAPE RECORDING
      </div>
    </div>
  );
}
