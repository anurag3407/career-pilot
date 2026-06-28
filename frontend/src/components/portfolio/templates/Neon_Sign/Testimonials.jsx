import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

export default function Testimonials({ data }) {
  const { testimonials } = data;
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const testimonial = testimonials[current];

  return (
    <section id="testimonials" className="relative py-20 px-4 md:px-8 overflow-hidden">
      {/* Ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[150px] bg-purple-700 opacity-5 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Section heading */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div
            className="inline-block px-6 py-3 rounded border-2 border-purple-400 mb-4"
            style={{
              background: "rgba(176,38,255,0.05)",
              boxShadow: "0 0 20px #b026ff, 0 0 40px #b026ff40",
            }}
          >
            <h2
              className="text-3xl md:text-4xl font-black uppercase tracking-widest text-purple-300"
              style={{
                fontFamily: "'Courier New', monospace",
                textShadow: "0 0 10px #b026ff, 0 0 20px #b026ff, 0 0 40px #b026ff",
              }}
            >
              ❝ REVIEWS ❞
            </h2>
          </div>
          <div
            className="w-40 h-1 mx-auto mt-2 rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, #b026ff, transparent)",
              boxShadow: "0 0 10px #b026ff",
            }}
          />
        </Motion.div>

        {/* Carousel */}
        <div className="relative flex flex-col items-center gap-8">
          <div className="w-full max-w-3xl relative">
            <AnimatePresence mode="wait">
              <Motion.div
                key={current}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="rounded-3xl border-2 border-purple-500 p-8 md:p-10 relative overflow-hidden"
                style={{
                  background: "rgba(176,38,255,0.05)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 0 40px #b026ff30, inset 0 0 40px #b026ff08",
                }}
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-cyan-400" style={{ boxShadow: "0 0 8px #00d4ff" }} />
                <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-cyan-400" style={{ boxShadow: "0 0 8px #00d4ff" }} />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-cyan-400" style={{ boxShadow: "0 0 8px #00d4ff" }} />
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-cyan-400" style={{ boxShadow: "0 0 8px #00d4ff" }} />

                {/* Neon quote mark */}
                <div className="flex justify-start mb-6">
                  <Quote
                    size={48}
                    className="text-purple-400"
                    style={{ filter: "drop-shadow(0 0 12px #b026ff)" }}
                  />
                </div>

                {/* Review text */}
                <blockquote
                  className="text-gray-200 text-base md:text-lg leading-relaxed mb-8 italic"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  "{testimonial.text}"
                </blockquote>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                      style={{ filter: "drop-shadow(0 0 6px #ffd000)" }}
                    />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden border-2 border-pink-400 shrink-0"
                    style={{ boxShadow: "0 0 12px #ff2bd660" }}
                  >
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4
                      className="text-pink-300 font-black text-sm uppercase tracking-widest"
                      style={{
                        fontFamily: "'Courier New', monospace",
                        textShadow: "0 0 8px #ff2bd6",
                      }}
                    >
                      {testimonial.name}
                    </h4>
                    <p
                      className="text-gray-500 text-xs font-bold tracking-wider uppercase mt-0.5"
                      style={{ fontFamily: "'Courier New', monospace" }}
                    >
                      {testimonial.role}
                    </p>
                  </div>

                  {/* Index indicator */}
                  <div className="ml-auto">
                    <span
                      className="text-purple-500 font-black text-xs"
                      style={{ fontFamily: "'Courier New', monospace" }}
                    >
                      {String(current + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </Motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center gap-6">
            <Motion.button
              onClick={prev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-purple-500 text-purple-300 transition-all cursor-pointer"
              style={{
                background: "rgba(176,38,255,0.08)",
                boxShadow: "0 0 10px #b026ff30",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 25px #b026ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 10px #b026ff30";
              }}
            >
              <ChevronLeft size={20} />
            </Motion.button>

            {/* Dot indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button type="button"
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="transition-all duration-300 rounded-full cursor-pointer"
                  style={{
                    width: i === current ? "24px" : "8px",
                    height: "8px",
                    background: i === current ? "#b026ff" : "#b026ff30",
                    boxShadow: i === current ? "0 0 10px #b026ff" : "none",
                  }}
                />
              ))}
            </div>

            <Motion.button
              onClick={next}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-purple-500 text-purple-300 transition-all cursor-pointer"
              style={{
                background: "rgba(176,38,255,0.08)",
                boxShadow: "0 0 10px #b026ff30",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 25px #b026ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 0 10px #b026ff30";
              }}
            >
              <ChevronRight size={20} />
            </Motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
