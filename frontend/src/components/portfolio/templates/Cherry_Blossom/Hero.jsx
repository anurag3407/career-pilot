import React from "react";
import { Github, Linkedin, Twitter, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero({ data }) {
  const { personal, socials } = data;
  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-b from-pink-50 via-white to-rose-100/50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center text-left"
      >
        <div>
          <p className="text-pink-500 font-semibold tracking-widest uppercase mb-4">
            {personal.tagline}
          </p>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-rose-900">
            {personal.name}
          </h1>

          <h2 className="mt-4 text-2xl text-rose-600 font-medium">
            {personal.title}
          </h2>

          <p className="mt-6 text-gray-600 leading-relaxed text-lg">
            {personal.bio}
          </p>

          <div className="flex items-center gap-2 mt-6 text-gray-500">
            <MapPin size={18} />
            <span>{personal.location}</span>
          </div>

          <div className="flex gap-4 mt-8 flex-wrap">
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="p-3 rounded-full bg-white shadow-md hover:scale-110 transition duration-300"
              >
                <Github />
              </a>
            )}

            {socials.linkedin && (
              <a
                href={socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="p-3 rounded-full bg-white shadow-md hover:scale-110 transition duration-300"
              >
                <Linkedin />
              </a>
            )}

            {socials.twitter && (
              <a
                href={socials.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter Profile"
                className="p-3 rounded-full bg-white shadow-md hover:scale-110 transition duration-300"
              >
                <Twitter />
              </a>
            )}

            {socials.email && (
              <a
                href={`mailto:${socials.email}`}
                aria-label="Email Me"
                className="p-3 rounded-full bg-white shadow-md hover:scale-110 transition duration-300"
              >
                <Mail />
              </a>
            )}
          </div>
        </div>

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="relative flex justify-center"
        >
          <div className="absolute w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-40"></div>

          <img
            src={personal.avatar}
            alt={personal.name || "Profile Avatar"}
            className="relative z-10 w-72 h-72 md:w-80 md:h-80 object-cover rounded-full border-8 border-white shadow-2xl"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
