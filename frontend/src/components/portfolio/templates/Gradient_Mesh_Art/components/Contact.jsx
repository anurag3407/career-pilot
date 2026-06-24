import React, { useState } from "react";
import data from "../../../../../data/dummy_data.json";
import { Mail, Github, Linkedin, Twitter, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.currentTarget.reset();
    setSent(true);
  };

  return (
    <section className="relative py-32 px-6 md:px-20 overflow-hidden" id="contact">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-pink-500/20 blur-[120px] top-[-200px] left-[-100px]" />
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] bottom-[-200px] right-[-100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">

        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black">
            Let’s build something{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-300 text-transparent bg-clip-text">
              amazing
            </span>
          </h2>

          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Have an idea, collaboration, or opportunity? I’m always open to
            meaningful work.
          </p>
        </motion.div>

        {/* MAIN CARD */}
        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT INFO PANEL */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="
              bg-white/5 
              border border-white/10 
              backdrop-blur-xl 
              rounded-3xl 
              p-10
            "
          >
            <h3 className="text-2xl font-bold mb-6">
              Contact Information
            </h3>

            <div className="space-y-6 text-gray-300">

              <div className="flex items-center gap-3">
                <Mail className="text-cyan-300" />
                <span>{data.socials.email}</span>
              </div>

              <div className="flex gap-4 mt-8">
                {[
                  { icon: Github, link: data.socials.github },
                  { icon: Linkedin, link: data.socials.linkedin },
                  { icon: Twitter, link: data.socials.twitter },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.link}
                    className="
                      p-4 rounded-2xl 
                      bg-white/5 
                      border border-white/10 
                      hover:bg-white/10 
                      hover:scale-110 
                      transition
                    "
                  >
                    <s.icon />
                  </a>
                ))}
              </div>

              <p className="text-sm text-gray-400 mt-10 leading-relaxed">
                Response time: usually within 24–48 hours. I prefer working on
                product-driven, impactful projects.
              </p>
            </div>
          </motion.div>

          {/* RIGHT FORM */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="
              bg-white/5 
              border border-white/10 
              backdrop-blur-xl 
              rounded-3xl 
              p-10 
              space-y-6
            "
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 outline-none text-white"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 outline-none text-white"
            />

            <textarea
              placeholder="Your Message"
              rows="5"
              className="w-full p-4 rounded-2xl bg-black/20 border border-white/10 outline-none text-white"
            />

            <button
              type="submit"
              className="
                w-full 
                flex items-center justify-center gap-2
                p-4 
                rounded-2xl 
                bg-linear-to-r from-pink-500 to-cyan-400 
                font-semibold
                hover:scale-[1.02]
                transition
              "
            >
              Send Message <Send size={18} />
            </button>

            {sent && (
              <p
                role="status"
                className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-4 text-center text-sm font-medium text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.12)]"
              >
                Message sent. I’ll reply soon.
              </p>
            )}
          </motion.form>

        </div>
      </div>
    </section>
  );
}
