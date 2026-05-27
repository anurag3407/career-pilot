import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const quoteVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: 0.3, ease: "easeOut" },
  },
};

const floatAnimation = {
  y: [0, -6, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
  },
};

function TestimonialCard({ testimonial, index }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
      className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.1] bg-white/[0.06] p-6 backdrop-blur-md sm:p-8 transition-shadow duration-500 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.12)] hover:border-white/[0.22]"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(56,189,248,0.2)",
          background:
            "radial-gradient(120% 90% at 20% 0%, rgba(56,189,248,0.14) 0%, transparent 60%)",
        }}
      />
      {/* Subtle inner glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.02]" />

      {/* Quote mark */}
      <motion.div
        variants={quoteVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mb-4"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-40"
        >
          <defs>
            <linearGradient id={`quoteGrad-${index}`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="0.5" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#7dd3fc" />
            </linearGradient>
          </defs>
          <path
            d="M14 28c-3.3 0-6-2.7-6-6s2.7-6 6-6c0.7 0 1.4 0.1 2 0.4C17.2 12.2 20.3 8 24 8v4c-2.2 0-4.7 3-5.4 6.3C20.4 19.8 22 22 22 24.5 22 26.4 20.4 28 18.5 28H14zM34 28c-3.3 0-6-2.7-6-6s2.7-6 6-6c0.7 0 1.4 0.1 2 0.4C37.2 12.2 40.3 8 44 8v4c-2.2 0-4.7 3-5.4 6.3C40.4 19.8 42 22 42 24.5 42 26.4 40.4 28 38.5 28H34z"
            fill={`url(#quoteGrad-${index})`}
          />
        </svg>
      </motion.div>

      {/* Testimonial text */}
      <p className="relative z-10 mb-6 text-sm leading-relaxed text-white/80 italic sm:text-base">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Author section */}
      <div className="relative z-10 mt-auto flex items-center gap-4">
        {/* Avatar with glow */}
        {testimonial.avatar && (
          <motion.div
            animate={floatAnimation}
            className="relative shrink-0"
          >
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-sky-400/30 via-cyan-300/20 to-sky-300/30 blur-sm group-hover:blur-md transition-all duration-500" />
            <img
              src={testimonial.avatar}
              alt={testimonial.name || "Testimonial author"}
              className="relative h-11 w-11 rounded-full border border-white/[0.15] object-cover"
            />
          </motion.div>
        )}

        <div className="min-w-0">
          {testimonial.name && (
            <p className="truncate text-sm font-semibold text-white/90 sm:text-base">
              {testimonial.name}
            </p>
          )}
          {testimonial.role && (
            <p className="truncate text-xs text-white/40 sm:text-sm">
              {testimonial.role}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials({ data }) {
  const sectionRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const testimonials = data?.testimonials;
  const testimonialsSection = data?.testimonialsSection || {};

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32"
    >
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mx-auto mb-14 max-w-xl text-center sm:mb-20"
      >
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          {testimonialsSection.heading || "What People Say"}
        </h2>

        {/* Glass underline */}
        <div className="mx-auto mt-4 h-[2px] w-20 overflow-hidden rounded-full sm:w-24">
          <motion.div
            initial={{ x: "-100%" }}
            animate={isSectionInView ? { x: "0%" } : { x: "-100%" }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="h-full w-full bg-gradient-to-r from-sky-400/60 via-cyan-300/80 to-sky-300/60"
          />
        </div>
      </motion.div>

      {/* Testimonials grid */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate={isSectionInView ? "visible" : "hidden"}
        className="mx-auto grid max-w-5xl gap-6 sm:gap-8 md:grid-cols-2"
      >
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.name ? `${testimonial.name}-${index}` : index}
            testimonial={testimonial}
            index={index}
          />
        ))}
      </motion.div>
    </section>
  );
}
