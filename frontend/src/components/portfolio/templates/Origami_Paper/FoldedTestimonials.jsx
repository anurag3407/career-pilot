import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Aiko Tanaka",
    role: "Senior UX Designer @ Figma",
    quote:
      "Working with Alex was like watching origami unfold — each layer of the project revealed something more refined and intentional. Truly a master of structured, purposeful design.",
    rating: 3,
    rotate: "rotate-1",
  },
  {
    name: "Marcus Chen",
    role: "Engineering Lead @ Notion",
    quote: "Alex's code is as precise as a folded crane. Every component fits together perfectly, and the architectural attention to detail was unlike anything I had seen before.",
    rating: 3,
    rotate: "-rotate-1",
  },
  {
    name: "Priya Nair",
    role: "Product Manager @ Linear",
    quote:
      "Collaborating with Alex felt effortless. They brought a calm, methodical approach to every sprint — and the results were always beyond what we scoped.",
    rating: 3,
    rotate: "rotate-2",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.13, ease: "easeOut" },
  }),
};

const stripVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.45, ease: "easeOut" } },
};

export default function FoldedTestimonials() {
  return (
    <section className="relative overflow-hidden bg-[#f6f1e7] px-6 py-24 md:px-12">
      {/* Background origami shapes — static, no pulse */}
      <div className="absolute top-8 left-8 h-32 w-32 rotate-45 bg-[#efe6d6] border border-black/10" />
      <div className="absolute bottom-8 right-8 h-48 w-48 -rotate-12 bg-[#f1e3cc] border border-black/10" />
      <div className="absolute top-1/2 right-1/4 h-20 w-20 rotate-12 bg-[#e9dcc7] border border-black/10 opacity-50" />
      <div className="absolute bottom-1/3 left-1/4 h-14 w-14 -rotate-6 bg-[#f8f4ec] border border-black/10 opacity-40" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border-2 border-black bg-white px-5 py-2 shadow-[4px_4px_0px_#000]">
            <Quote size={16} />
            <span className="font-mono text-xs uppercase tracking-widest">
              Folded Testimonials
            </span>
          </div>

          <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-black">
            Words That Fold In
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-700 text-base md:text-lg leading-relaxed">
            Like a carefully folded note passed between colleagues — each
            testimonial carries weight, intention, and genuine craft.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className={`group relative bg-white border-2 border-black p-6 shadow-[6px_6px_0px_rgba(0,0,0,0.75)] transition-all duration-500 hover:-translate-y-2 hover:rotate-0 hover:shadow-[10px_10px_0px_rgba(0,0,0,0.65)] ${item.rotate}`}
            >
              {/* Fold corner */}
              <div className="absolute top-0 right-0 h-12 w-12 bg-[#e9dcc7] border-b-2 border-l-2 border-black" />

              {/* Paper shadow layer */}
              <div className="absolute -bottom-3 -left-3 w-full h-full bg-[#efe6d6] border-2 border-black/60 -z-10" />

              {/* Quote icon + stars */}
              <div className="mb-4 flex items-center justify-between">
                <Quote
                  size={28}
                  className="text-black/20 fill-black/10 group-hover:text-black/30 transition-colors duration-300"
                />
                <div className="flex gap-0.5">
                  {Array.from({ length: item.rating }).map((_, s) => (
                    <Star key={s} size={14} className="fill-amber-500 text-amber-500" />
                  ))}
                </div>
              </div>

              {/* Quote text */}
              <p className="text-gray-800 leading-relaxed mb-6 text-sm md:text-base italic font-serif">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Fold-line divider */}
              <div className="border-t-2 border-dashed border-black/10 my-4" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 h-10 w-10 bg-[#f8f4ec] border-2 border-black flex items-center justify-center font-black text-sm select-none">
                  {item.name[0]}
                </div>
                <div>
                  <p className="font-extrabold text-black text-sm leading-tight">{item.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5 font-mono">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Satisfaction strip */}
        <motion.div
          variants={stripVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-20 relative border-2 border-black bg-white shadow-[6px_6px_0px_rgba(0,0,0,0.75)] p-8 text-center"
        >
          <div className="absolute top-0 right-0 h-10 w-10 bg-[#e9dcc7] border-b-2 border-l-2 border-black" />
          <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
            Client Satisfaction
          </p>
          <p className="text-3xl md:text-4xl font-black text-black">100% Positive Feedback</p>
          <p className="text-gray-600 mt-2 text-sm">
            Every fold tells a story. Every project leaves an impression.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
