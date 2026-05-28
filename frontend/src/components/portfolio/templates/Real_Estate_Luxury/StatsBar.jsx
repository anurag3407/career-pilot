import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1];

function Counter({ target, active }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const numericTarget = Number(target) || 0;
    const duration = 2000;
    const steps = 60;
    const increment = numericTarget / steps;
    let currentStep = 0;

    const interval = window.setInterval(() => {
      currentStep += 1;
      setCount(Math.min(Math.round(increment * currentStep), numericTarget));

      if (currentStep >= steps) {
        window.clearInterval(interval);
      }
    }, duration / steps);

    return () => window.clearInterval(interval);
  }, [active, target]);

  return <>{count}</>;
}

export default function StatsBar({ data }) {
  const [started, setStarted] = useState(false);
  const stats = [
    { value: data.stats?.yearsExperience, label: 'Years of Excellence' },
    { value: data.stats?.projectsCompleted, label: 'Projects Delivered' },
    { value: data.stats?.happyClients, label: 'Happy Clients' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease }}
      onViewportEnter={() => setStarted(true)}
      className="border-t border-[#C9A96E]/30 bg-[#111118] px-6 py-12"
    >
      <div className="mx-auto grid max-w-6xl gap-10 text-center md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-3">
            <p
              className="font-serif text-5xl font-light text-[#C9A96E] md:text-6xl"
              style={{ fontFamily: 'Cormorant Garamond, serif' }}
            >
              <Counter target={stat.value} active={started} />+
            </p>
            <p className="text-xs uppercase tracking-[0.25em] text-[#A8A090]">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
