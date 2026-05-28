import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const GOLD = '#C9A96E';

function splitName(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { first: name, last: '' };
  }

  return {
    first: parts.slice(0, -1).join(' '),
    last: parts[parts.length - 1],
  };
}

export default function Hero({ data }) {
  const { first, last } = splitName(data.personal?.name || '');
  const heroItems = [
    <div key="line" className="mx-auto h-px w-10 bg-[#C9A96E]" />,
    <p key="eyebrow" className="text-xs uppercase tracking-[0.4em] text-[#C9A96E]">
      PORTFOLIO
    </p>,
    <h1
      key="name"
      className="font-serif text-6xl font-light leading-[0.9] tracking-normal text-[#F5F0E8] md:text-8xl lg:text-9xl"
      style={{ fontFamily: 'Cormorant Garamond, serif' }}
    >
      <span className="block">{first}</span>
      {last ? <span className="block italic">{last}</span> : null}
    </h1>,
    <p
      key="title"
      className="mx-auto max-w-3xl text-sm uppercase tracking-[0.2em] text-[#A8A090] md:text-lg"
    >
      {data.personal?.title}
    </p>,
    <div key="divider" className="mx-auto h-px w-full max-w-xl bg-[#C9A96E]/20" />,
    <div key="location" className="flex items-center justify-center gap-2 text-sm text-[#A8A090]">
      <MapPin size={16} color={GOLD} strokeWidth={1.5} />
      <span>{data.personal?.location}</span>
    </div>,
  ];

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24 text-center"
      style={{
        background:
          'radial-gradient(ellipse at 50% 100%, rgba(201,169,110,0.08) 0%, #0A0A0F 60%)',
      }}
    >
      <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(#C9A96E_1px,transparent_1px),linear-gradient(90deg,#C9A96E_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-7">
        {heroItems.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: index * 0.2 }}
            className="w-full"
          >
            {item}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-[#C9A96E]"
      >
        <span>SCROLL</span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-[#C9A96E]" />
      </motion.div>
    </section>
  );
}
