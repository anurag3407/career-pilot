import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
} from "lucide-react";
import CanvasCard from "./CanvasCard";

export default function Contact({ data }) {
  const { personal, socials } = data;

  const links = [
    {
      icon: Github,
      label: "GitHub",
      href: socials.github,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: socials.linkedin,
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: socials.twitter,
    },
    {
      icon: Mail,
      label: "Email",
      href: `mailto:${socials.email}`,
    },
  ];

  return (
    <div className="absolute top-[4300px] left-1/2 -translate-x-1/2 w-[92%] md:w-[900px] pb-32">
      <CanvasCard delay={0.4}>
        <div className="text-center">
          <motion.h2
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
              duration: 0.6,
            }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            Let's Build Something Great
          </motion.h2>

          <p className="text-gray-400 max-w-2xl mx-auto leading-8 mb-10">
            Interested in collaborating, hiring, or discussing a project?
            I'm always open to meaningful conversations and exciting ideas.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {links.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target={
                    item.label === "Email"
                      ? "_self"
                      : "_blank"
                  }
                  rel="noreferrer"
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
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    y: -5,
                  }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col items-center gap-3 hover:border-cyan-400/30 transition"
                >
                  <Icon
                    size={22}
                    className="text-cyan-400"
                  />

                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                </motion.a>
              );
            })}
          </div>

          <a
            href={`mailto:${socials.email}`}
            className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-cyan-500 text-black font-bold hover:scale-105 transition"
          >
            <Mail size={18} />
            Contact Me
            <ArrowUpRight size={18} />
          </a>

          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold mb-2">
              {personal.name}
            </h3>

            <p className="text-gray-500">
              {personal.title}
            </p>

            <p className="text-gray-600 text-sm mt-4">
              © {new Date().getFullYear()} • Infinite Canvas Portfolio
            </p>
          </div>
        </div>
      </CanvasCard>
    </div>
  );
}