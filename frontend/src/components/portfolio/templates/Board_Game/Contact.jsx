import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Trophy,
} from "lucide-react";

import data from "../../../../data/dummy_data.json";

export default function Contact() {
  return (
    <section className="  relative overflow-hidden py-20 px-6 "> 
      <div className="max-w-5xl mx-auto">

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
      className="absolute rounded-2xl opacity-20"
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
        {/* Finish Badge */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="
              w-24 h-24
              rounded-full
              bg-yellow-500
              flex
              items-center
              justify-center
              shadow-2xl
            "
          >
            <Trophy size={40} className="text-black" />
          </motion.div>
        </div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileHover={{
           x: 10,
         scale: 1.01
         }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            bg-[#0B1224]
            border
            border-slate-700
            rounded-3xl
            p-8
            md:p-12
            shadow-2xl
          "
        >
          <div className="text-center">

            <span
              className="
                inline-block
                px-4 py-2
                rounded-full
                bg-yellow-500/20
                text-yellow-400
                font-semibold
                mb-4
              "
            >
              🏁 Finish Line
            </span>

            <h2 className="text-4xl font-bold text-white">
              Let's Connect
            </h2>

            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
              Thanks for playing through my portfolio journey.
              Feel free to reach out and let's build something amazing together.
            </p>
          </div>

          {/* Social Links */}
          <div className="grid md:grid-cols-2 gap-4 mt-10">

            <a
              href={`mailto:${data.socials.email}`}
              className="
                flex items-center gap-4
                bg-[#111827]
                border border-slate-700
                rounded-2xl
                p-4
                hover:border-yellow-500
                transition
              "
            >
              <Mail className="text-yellow-400" />
              <span className="text-white">
                {data.socials.email}
              </span>
            </a>

            <a
              href={data.socials.github}
              target="_blank"
              rel="noreferrer"
              className="
                flex items-center gap-4
                bg-[#111827]
                border border-slate-700
                rounded-2xl
                p-4
                hover:border-blue-500
                transition
              "
            >
              <Github className="text-blue-400" />
              <span className="text-white">
                GitHub
              </span>
            </a>

            <a
              href={data.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="
                flex items-center gap-4
                bg-[#111827]
                border border-slate-700
                rounded-2xl
                p-4
                hover:border-cyan-500
                transition
              "
            >
              <Linkedin className="text-cyan-400" />
              <span className="text-white">
                LinkedIn
              </span>
            </a>

            <a
              href={data.socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="
                flex items-center gap-4
                bg-[#111827]
                border border-slate-700
                rounded-2xl
                p-4
                hover:border-purple-500
                transition
              "
            >
              <Twitter className="text-purple-400" />
              <span className="text-white">
                Twitter
              </span>
            </a>

          </div>
        </motion.div>
      </div>
    </section>
  );
}