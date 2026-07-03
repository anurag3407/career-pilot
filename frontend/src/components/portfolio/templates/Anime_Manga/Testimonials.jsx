import React from 'react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="relative w-full">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-black text-white px-8 py-2 border-4 border-black manga-title text-3xl shadow-[6px_6px_0_rgba(255,255,255,1),-2px_-2px_0_rgba(0,0,0,1)] text-center whitespace-nowrap transform -skew-x-6">
          ALLIES' CHATTER
        </div>
      </div>

      <div className="manga-panel p-8 pt-16 bg-white relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          {testimonials.map((test, idx) => (
            <div key={idx} className="flex flex-col relative group">
              {/* Speech Bubble */}
              <div className="border-4 border-black p-6 bg-white rounded-3xl rounded-br-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10 mb-4 transition-transform group-hover:-translate-y-2">
                <p className="font-bold text-lg leading-snug italic">
                  "{test.text || test.content}"
                </p>
                {/* Speech Bubble Tail */}
                <div className="absolute -bottom-5 right-0 w-8 h-8 bg-white border-r-4 border-b-4 border-black transform translate-y-[2px] skew-x-[30deg]"></div>
              </div>

              {/* Author Info */}
              <div className="flex justify-end items-center pr-4">
                <div className="text-right">
                  <h4 className="font-black uppercase text-xl border-b-2 border-black inline-block">{test.name}</h4>
                  <p className="font-semibold text-sm">{test.role || test.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
