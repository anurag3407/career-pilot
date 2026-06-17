import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ArrowRight,
} from "lucide-react";

import { motion } from "framer-motion";
import data from "../../../../../data/dummy_data.json";

export default function Contact() {
  const socials = [
    {
      icon: Github,
      link: data.socials.github,
      label: "GitHub",
    },
    {
      icon: Linkedin,
      link: data.socials.linkedin,
      label: "LinkedIn",
    },
    {
      icon: Twitter,
      link: data.socials.twitter,
      label: "Twitter",
    },
  ];

  return (
    <section className="relative py-32 px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div
          className="
            absolute
            top-0
            left-1/2
            -translate-x-1/2
            w-[600px]
            h-[600px]
            rounded-full
            bg-indigo-500/20
            blur-[150px]
          "
        />
      </div>

      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
          }}
          className="
            rounded-[40px]
            border
            border-white/10
            bg-white/[0.03]
            backdrop-blur-2xl
            p-12
            md:p-16
            text-center
          "
        >

          <span
            className="
              inline-block
              px-4
              py-2
              rounded-full
              border
              border-white/10
              bg-white/5
              text-sm
              text-slate-300
            "
          >
            Available for Opportunities
          </span>

          <h2
            className="
              text-5xl
              md:text-6xl
              font-bold
              mt-8
              leading-tight
            "
          >
            Let's Build
            <span className="text-indigo-400">
              {" "}Something Amazing
            </span>
          </h2>

          <p
            className="
              mt-6
              text-lg
              text-slate-400
              max-w-2xl
              mx-auto
            "
          >
            Looking for a developer,
            collaborator, or open-source
            contributor? I'd love to hear
            about your project.
          </p>

          {/* Email CTA */}
          <motion.a
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            href={`mailto:${data.socials.email}`}
            className="
              inline-flex
              items-center
              gap-3
              mt-10
              px-8
              py-4
              rounded-full
              bg-white
              text-black
              font-semibold
            "
          >
            <Mail size={18} />
            Get In Touch
            <ArrowRight size={18} />
          </motion.a>

          {/* Social Links */}
          <div
            className="
              flex
              justify-center
              gap-6
              mt-12
              flex-wrap
            "
          >
            {socials.map((social) => {
              const Icon = social.icon;

              return (
                <motion.a
                  key={social.label}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    y: -5,
                  }}
                  className="
                    flex
                    items-center
                    gap-3
                    px-5
                    py-3
                    rounded-full
                    border
                    border-white/10
                    bg-white/5
                    hover:bg-white/10
                    transition-all
                  "
                >
                  <Icon size={18} />
                  <span>
                    {social.label}
                  </span>
                </motion.a>
              );
            })}
          </div>

        </motion.div>
      </div>
    </section>
  );
}