import React, { useState } from 'react';
import { MessageSquare, Quote } from 'lucide-react';

export default function Testimonials({ data }) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="flex-1 flex flex-col justify-between h-full font-mono text-[#00f3ff]">
      {/* OSD label */}
      <div className="flex justify-between items-center text-xs tracking-wider text-pink-500 font-bold border-b border-cyan-900/30 pb-3 mb-4">
        <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> INDEX: 06_QUOTES</span>
        <span className="text-cyan-400">PLAY: 0:13:40</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto items-center">
        
        {/* Left Side: Vintage Video Store Membership Stamp Card Look */}
        <div className="md:col-span-7 bg-[#121319] p-5 rounded-xl border border-cyan-500/20 relative shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] min-h-[220px] flex flex-col justify-between">
          <Quote className="w-8 h-8 text-pink-500/20 absolute top-4 left-4" />
          
          {/* Card Label Header */}
          <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-3">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">VIDEO RENTAL CARD</span>
            <span className="text-[9px] text-[#ff0055] font-bold">DUE DATE: LATE FEE $2.00</span>
          </div>

          {/* Active quote */}
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-xs md:text-sm text-gray-300 italic leading-relaxed font-sans select-text">
              "{data.testimonials[activeIdx]?.text}"
            </p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src={data.testimonials[activeIdx]?.avatar}
                alt={data.testimonials[activeIdx]?.name}
                className="w-8 h-8 rounded-full border border-pink-500 object-cover"
              />
              <div>
                <h4 className="text-xs font-black text-white uppercase select-text">{data.testimonials[activeIdx]?.name}</h4>
                <h5 className="text-[10px] text-gray-400 uppercase select-text">{data.testimonials[activeIdx]?.role}</h5>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: selector list */}
        <div className="md:col-span-5 flex flex-col gap-2">
          <span className="text-[10px] text-gray-500 font-bold tracking-widest mb-1">SELECT MEMBER CARD:</span>
          {data.testimonials.map((test, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-center gap-3 ${
                activeIdx === idx
                  ? 'bg-[#121319] text-white border-cyan-400 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
                  : 'bg-[#08080a] text-gray-400 border-gray-900 hover:border-gray-800'
              }`}
            >
              <div className={`w-2.5 h-2.5 rounded-full ${activeIdx === idx ? 'bg-pink-500 shadow-[0_0_6px_#ff0055]' : 'bg-gray-800'}`} />
              <span className="text-xs font-bold truncate select-text">{test.name}</span>
            </button>
          ))}
        </div>

      </div>

      <div className="text-[9px] text-gray-600 border-t border-cyan-900/30 pt-3 mt-4 text-right">
        BE KIND - PLEASE REWIND
      </div>
    </div>
  );
}
