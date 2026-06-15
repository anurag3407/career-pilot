import React from 'react';
import { motion } from 'framer-motion';

export default function About({ data }) {
  const { about } = data || {};

  if (!about) return null;

  return (
    <section className="w-full py-24 px-6 md:px-16 border-b border-dashed border-[#8d6e63]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto bg-[#e8dac1] p-10 md:p-16 rounded shadow-[5px_5px_15px_rgba(62,39,35,0.2)] border border-[#c4a482] relative"
      >
        {/* Decorative corner pieces */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#5d4037]"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#5d4037]"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#5d4037]"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#5d4037]"></div>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-double border-[#5d4037] p-2 bg-[#f4ebd8]">
              <div className="w-full h-full rounded-full bg-[#c4a482] flex items-center justify-center overflow-hidden">
                {data?.personalInfo?.avatar ? (
                  <img src={data.personalInfo.avatar} alt="Explorer" className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                ) : (
                  <span className="text-[#5d4037] font-serif text-2xl italic">Portrait</span>
                )}
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <h3 className="text-4xl font-bold mb-6 text-[#2e1d16] tracking-wide uppercase border-b-2 border-[#8d6e63] inline-block pb-2">The Explorer's Journal</h3>
            <div className="prose prose-stone text-[#3e2723] font-serif leading-loose text-lg whitespace-pre-wrap">
              {about}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
