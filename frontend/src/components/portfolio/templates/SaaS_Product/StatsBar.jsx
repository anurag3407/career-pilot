import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

function CountUp({ value, active }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    const target = Number(value) || 0;
    const steps = 50;
    const duration = 1500;
    let step = 0;

    const interval = window.setInterval(() => {
      step += 1;
      setCount(Math.min(Math.round((target / steps) * step), target));

      if (step >= steps) {
        window.clearInterval(interval);
      }
    }, duration / steps);

    return () => window.clearInterval(interval);
  }, [active, value]);

  return <>{count}</>;
}

export default function StatsBar({ data }) {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: data.stats?.yearsExperience, label: 'Years Experience' },
    { value: data.stats?.projectsCompleted, label: 'Projects Shipped' },
    { value: data.stats?.happyClients, label: 'Happy Clients' },
  ];

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease }}
      className="border-y border-[#222232] bg-[#13131A] px-5 py-10"
    >
      <div className="mx-auto grid max-w-7xl gap-8 divide-y divide-[#222232] md:grid-cols-3 md:divide-x md:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="pt-8 text-center first:pt-0 md:pt-0">
            <p className="saas-gradient-text text-4xl font-bold md:text-5xl">
              <CountUp value={stat.value} active={active} />+
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#4B4870]">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
