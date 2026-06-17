import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials({ data }) {
  const { testimonials } = data;
  return (
    <section className="relative z-10 px-6 py-20 bg-white/40 text-left">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-rose-800 mb-14">
          Testimonials
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {testimonials.map((testimonial, index) => (
            <motion.div
              whileHover={{ y: -5 }}
              key={`${testimonial.name}-${index}`}
              className="bg-white rounded-3xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  loading="lazy"
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div>
                  <h3 className="font-semibold text-lg">
                    {testimonial.name}
                  </h3>

                  <p className="text-sm text-pink-600">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <p className="mt-6 text-gray-600 leading-relaxed italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
