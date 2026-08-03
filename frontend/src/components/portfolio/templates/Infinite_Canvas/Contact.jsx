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
const sanitizeUrl = (url) => {
  try {
    const parsed = new URL(url);

    return ["http:", "https:"].includes(
      parsed.protocol
    )
      ? url
      : "#";
  } catch {
    return "#";
  }
};
export default function Contact({ data }) {
  const { personal = {}, socials = {} } = data || {};

  const socialLinks = [
    {
      label: "GitHub",
      href: socials?.github,
      icon: Github,
    },
    {
      label: "LinkedIn",
      href: socials?.linkedin,
      icon: Linkedin,
    },
    {
      label: "Twitter",
      href: socials?.twitter,
      icon: Twitter,
    },
  ].filter((item) => Boolean(item.href));

  return (
    <CanvasCard delay={0.3}>
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
          Let's Work Together
        </motion.h2>

        <p className="max-w-2xl mx-auto text-gray-400 leading-8 mb-10">
          Open to collaborations, freelance opportunities,
          product discussions, and ambitious ideas.
        </p>

        {socialLinks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;

              return (
                <motion.a
                  key={link.label}
                  href={sanitizeUrl(link.href)}
                  target="_blank"
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
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    y: -4,
                  }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col items-center gap-3 hover:border-cyan-400/30 transition"
                >
                  <Icon
                    size={22}
                    className="text-cyan-400"
                  />

                  <span>{link.label}</span>
                </motion.a>
              );
            })}
          </div>
        )}

        {socials?.email && (
          <motion.a
            href={`mailto:${socials.email}`}
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
            className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-cyan-500 text-black font-bold hover:scale-105 transition-transform"
          >
            <Mail size={18} />
            Contact Me
            <ArrowUpRight size={18} />
          </motion.a>
        )}

        <div className="mt-12 pt-8 border-t border-white/10">
          <h3 className="text-xl font-bold">
            {personal?.name || "Portfolio Owner"}
          </h3>

          <p className="text-gray-400 mt-2">
            {personal?.title || "Professional"}
          </p>

          {socials?.email && (
            <p className="text-gray-500 mt-3">
              {socials.email}
            </p>
          )}

          <p className="text-gray-600 text-sm mt-6">
            © {new Date().getFullYear()} · Infinite Canvas Portfolio
          </p>
        </div>
      </div>
    </CanvasCard>
  );
}