import React from 'react';
import { motion } from 'framer-motion';
import { GithubIcon, Linkedin, Mail, Twitter } from 'lucide-react';

const ease = [0.25, 0.1, 0.25, 1];

function socialRows(socials = {}) {
  return [
    { label: 'Github', value: socials.github, href: socials.github, Icon: Github },
    { label: 'LinkedIn', value: socials.linkedin, href: socials.linkedin, Icon: Linkedin },
    { label: 'Twitter', value: socials.twitter, href: socials.twitter, Icon: Twitter },
    {
      label: 'Email',
      value: socials.email,
      href: socials.email ? `mailto:${socials.email}` : '',
      Icon: Mail,
    },
  ].filter((item) => item.value);
}

export default function Contact({ data }) {
  const rows = socialRows(data.socials || {});

  return (
    <section className="bg-[#0A0A0F] px-6 py-24 text-center md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease }}
        className="mx-auto max-w-4xl"
      >
        <div className="mx-auto mb-8 h-px w-16 bg-[#C9A96E]" />
        <p className="text-xs uppercase tracking-[0.35em] text-[#C9A96E]">06 / CONTACT</p>
        <h2
          className="mt-5 font-serif text-5xl font-light leading-none text-[#F5F0E8] md:text-7xl"
          style={{ fontFamily: 'Cormorant Garamond, serif' }}
        >
          Let&apos;s Connect
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base font-light text-[#A8A090] md:text-lg">
          Open to new opportunities and collaborations
        </p>

        <div className="mx-auto mt-14 max-w-3xl divide-y divide-white/5 text-left">
          {rows.map(({ label, value, href, Icon }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 8 }}
              transition={{ duration: 0.25 }}
              className="group flex flex-col gap-3 py-6 text-[#A8A090] transition-colors hover:text-[#E8D5A3] sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="flex items-center gap-4">
                <Icon size={28} strokeWidth={1.5} className="text-[#C9A96E]" />
                <span className="text-sm uppercase tracking-[0.25em]">{label}</span>
              </span>
              <span className="break-all text-sm font-light text-[#F5F0E8]/75 group-hover:text-[#E8D5A3]">
                {value}
              </span>
            </motion.a>
          ))}
        </div>

        <p className="mt-16 text-[10px] uppercase tracking-[0.25em] text-[#5A5650]">
          Crafted with precision &middot; {new Date().getFullYear()}
        </p>
      </motion.div>
    </section>
  );
}
