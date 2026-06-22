import React from "react";
import { motion } from "framer-motion";

export default function Experience({ experience = [] }) { 
return ( <section
   id="experience"
   className="py-24 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]"
 > <div className="max-w-5xl mx-auto"> <h2 className="text-5xl font-bold mb-16 text-[#3e3a37]">
Experience </h2>

    <div className="space-y-8">
      {experience.map((job, index) => (
        <motion.div
          key={index}
          whileHover={{ y: -5 }}
          className="rounded-3xl p-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(240,235,230,0.5) 100%)",
            boxShadow: "0 12px 40px rgba(199,167,127,0.12)",
          }}
        >
          <div className="flex flex-col md:flex-row md:justify-between gap-2 mb-4">
            <div>
              <h3 className="text-2xl font-bold text-[#3e3a37]">
                {job.role}
              </h3>

              <p className="text-[#8b6f47] font-medium">
                {job.company}
              </p>
            </div>

            <span className="text-[#7a6f66]">
              {job.period}
            </span>
          </div>

          <p className="text-[#5a4f47] leading-relaxed">
            {job.description}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

);
}
