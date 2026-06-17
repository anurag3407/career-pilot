import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import CanvasCard from "./CanvasCard";

export default function Testimonials({ data }) {
  const { testimonials } = data;

  return (
    <div className="absolute top-[3400px] right-[6%] w-[90%] md:w-[650px]">
      <CanvasCard delay={0.3} rotate={2}>
        <div className="flex items-center gap-3 mb-8">
          <Quote className="text-cyan-400" size={24} />
          <h2 className="text-3xl font-bold">
            Testimonials
          </h2>
        </div>

        <div className="grid gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${index}`}
              initial={{
                opacity: 0,
                y: 30,
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
                delay: index * 0.1,
              }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex items-start gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border border-white/10"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {testimonial.name}
                      </h3>

                      <p className="text-sm text-cyan-300">
                        {testimonial.role}
                      </p>
                    </div>

                    <Quote
                      size={20}
                      className="text-cyan-400/40"
                    />
                  </div>

                  <p className="mt-4 text-gray-400 leading-7">
                    "{testimonial.text}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CanvasCard>
    </div>
  );
}