import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import CanvasCard from "./CanvasCard";

export default function Testimonials({ data }) {
  const testimonials = Array.isArray(data?.testimonials)
    ? data.testimonials
    : [];

  if (testimonials.length === 0) {
    return (
      <CanvasCard>
        <div className="text-center py-12">
          <Quote
            size={48}
            className="mx-auto mb-4 text-cyan-400"
          />

          <h2 className="text-3xl font-bold mb-3">
            Testimonials
          </h2>

          <p className="text-gray-400">
            No testimonials available.
          </p>
        </div>
      </CanvasCard>
    );
  }

  return (
    <CanvasCard delay={0.25}>
      <div className="flex items-center gap-3 mb-8">
        <Quote
          size={24}
          className="text-cyan-400"
        />

        <h2 className="text-3xl font-bold">
          Testimonials
        </h2>
      </div>

      <div className="grid gap-5">
        {testimonials.map((testimonial, index) => {
          const avatar =
            testimonial?.avatar ||
            "https://placehold.co/120x120?text=User";

          return (
            <motion.div
              key={`${testimonial?.name || "user"}-${index}`}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex items-start gap-4">
                <img
                  src={avatar}
                  alt={
                    testimonial?.name ||
                    "Testimonial Author"
                  }
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border border-white/10 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {testimonial?.name ||
                          "Anonymous"}
                      </h3>

                      {testimonial?.role && (
                        <p className="text-sm text-cyan-300">
                          {testimonial.role}
                        </p>
                      )}
                    </div>

                    <Quote
                      size={18}
                      className="text-cyan-400/40 flex-shrink-0"
                    />
                  </div>

                  <p className="mt-4 text-gray-400 leading-7">
                    {testimonial?.text ||
                      "No testimonial text available."}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </CanvasCard>
  );
}