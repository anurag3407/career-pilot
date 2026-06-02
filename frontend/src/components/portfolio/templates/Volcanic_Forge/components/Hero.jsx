import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

const lavaVariants = {
  initial: { width: '0%' },
  hover: { width: '100%', transition: { duration: 0.7, ease: 'easeInOut' } }
};

export default function Hero({ personal, socials }) {
  return (
    <section className="min-h-screen flex items-center relative z-10 w-full">
      <div className="w-full max-w-6xl mx-auto px-6 md:px-10 text-left">
        <style>{`
          .lava-btn { position: relative; overflow: hidden; }
          .lava-btn .wave-fill { position: absolute; left: 0; top: 0; bottom: 0; z-index: 0; }
          .lava-btn .wave-fill { background-image: linear-gradient(90deg, #b91c1c, #f97316, #fbbf24); background-size: 200% 100%; background-repeat: repeat; }
          @keyframes waveMove { from { background-position: 0 0; } to { background-position: -200% 0; } }
          .lava-btn:hover .wave-fill { animation: waveMove 1.6s linear infinite; }
          .lava-btn > svg { display: block; margin: auto; }
        `}</style>

        <h1 className="mt-2 text-5xl md:text-7xl lg:text-8xl leading-[0.95] font-extrabold text-white tracking-tight">
          {personal.name}
        </h1>
        <p className="mt-4 text-2xl md:text-4xl lg:text-5xl text-orange-400 font-semibold leading-tight max-w-5xl">
          {personal.title}
        </p>

        <div className="mt-9 flex flex-nowrap items-center gap-4 md:gap-5">
          {[
            { icon: Github, url: socials.github, label: 'GitHub', toneClass: 'border-orange-500/35 bg-stone-900/70 text-orange-200', waveGradient: 'linear-gradient(90deg, #7f1d1d, #b91c1c, #f97316)' },
            { icon: Linkedin, url: socials.linkedin, label: 'LinkedIn', toneClass: 'border-orange-500/35 bg-stone-900/70 text-orange-200', waveGradient: 'linear-gradient(90deg, #9a3412, #ea580c, #f59e0b)' },
            { icon: Twitter, url: socials.twitter, label: 'Twitter', toneClass: 'border-orange-500/35 bg-stone-900/70 text-orange-200', waveGradient: 'linear-gradient(90deg, #b45309, #f97316, #facc15)' },
          ].map((item, idx) => (
            item.url && (
              <motion.a
                key={idx} href={item.url} target="_blank" rel="noreferrer" initial="initial" whileHover="hover"
                className={`lava-btn relative inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full overflow-hidden border p-0 ${item.toneClass}`}
              >
                <motion.span variants={lavaVariants} className="wave-fill absolute left-0 top-0 bottom-0" style={{ width: '0%', backgroundImage: item.waveGradient }} />
                <item.icon className="relative z-10 block h-5 w-5 md:h-6 md:w-6 shrink-0" />
              </motion.a>
            )
          ))}
        </div>
      </div>
    </section>
  );
}