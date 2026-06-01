import React from "react";
import { motion } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";
import data from "../../../../data/dummy_data.json";

export default function Testimonials() {
  return (
    <section 
    id="board-testimonials"
    className=" relative overflow-hidden py-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Floating Board Tiles */}
   <div className="absolute inset-0 overflow-hidden pointer-events-none">

  {[...Array(20)].map((_, i) => (
    <motion.div
      key={i}
      animate={{
        y: [0, -30, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 6 + i,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute rounded-3xl opacity-10 blur-sm"
      style={{
        width: "70px",
        height: "70px",
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        backgroundColor: [
          "#ef4444",
          "#eab308",
          "#3b82f6",
          "#22c55e",
          "#a855f7",
        ][i % 5],
      }}
    />
  ))}

</div>
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="
              w-20 h-20
              rounded-2xl
              bg-purple-500
              flex items-center justify-center
              text-3xl font-bold text-white
              shadow-xl
            ">
              05
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white">
            Testimonials
          </h2>

          <p className="text-slate-400 mt-3">
            Feedback from clients and colleagues
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {data.testimonials?.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="
                bg-[#0B1224]
                border border-slate-700
                rounded-3xl
                p-6
                shadow-xl
                hover:border-purple-500
                transition-all
              "
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <MessageSquareQuote
                  size={32}
                  className="text-purple-400"
                />
              </div>

              {/* Testimonial Text */}
              <p className="text-slate-300 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="
                    w-14 h-14
                    rounded-full
                    object-cover
                    border-2 border-purple-500
                  "
                />

                <div>
                  <h4 className="text-white font-semibold">
                    {testimonial.name}
                  </h4>

                  <p className="text-slate-400 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}