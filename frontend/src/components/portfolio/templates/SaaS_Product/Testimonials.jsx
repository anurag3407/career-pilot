import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1];

export default function Testimonials({ data }) {
  const testimonials = data.testimonials || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (testimonials.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  const goTo = (nextDirection) => {
    setDirection(nextDirection);
    setActiveIndex((current) => {
      if (nextDirection > 0) {
        return (current + 1) % testimonials.length;
      }
      return (current - 1 + testimonials.length) % testimonials.length;
    });
  };

  const visibleCards = [0, 1, 2]
    .map((offset) => testimonials[(activeIndex + offset) % testimonials.length])
    .filter(Boolean);

  return (
    <section className="bg-[#0D0D12] px-5 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease }}
        className="mx-auto max-w-7xl"
      >
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-3 py-1.5 text-sm text-indigo-300">
              <Star size={15} strokeWidth={1.8} />
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">What People Say</h2>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => goTo(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-[#8884A8] transition hover:border-[#6366F1]/40 hover:bg-[#6366F1]/10 hover:text-white"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-[#8884A8] transition hover:border-[#6366F1]/40 hover:bg-[#6366F1]/10 hover:text-white"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.35, ease }}
            className="grid gap-6 md:grid-cols-3"
          >
            {visibleCards.map((testimonial, index) => (
              <article
                key={`${testimonial?.name}-${index}`}
                className={`relative overflow-hidden rounded-2xl border bg-[#13131A] p-8 ${
                  index === 0 ? 'border-[#6366F1]/40 shadow-lg shadow-indigo-500/10' : 'border-white/8'
                }`}
              >
                <span className="absolute right-6 top-3 text-6xl font-bold text-[#6366F1]/20">&quot;</span>
                <div className="mb-6 flex gap-1">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} size={16} className="fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <p className="relative text-lg italic leading-relaxed text-[#F1F0FF]">{testimonial?.text}</p>
                <div className="mt-8 flex items-center gap-3">
                  {testimonial?.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial?.name || 'Testimonial avatar'}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-[#6366F1]/30"
                    />
                  ) : null}
                  <div>
                    <p className="text-sm font-semibold text-[#F1F0FF]">{testimonial?.name}</p>
                    <p className="text-xs text-[#8884A8]">{testimonial?.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial?.name}
              type="button"
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex ? 'w-8 bg-[#6366F1]' : 'w-2 bg-[#4B4870]'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
