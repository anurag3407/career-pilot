import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Linkedin,
  Github,
  Twitter,
} from 'lucide-react';

const isSafeUrl = (url) => {
  if (!url) {
    return false;
  }

  try {
    const parsed = new URL(url);

    return (
      parsed.protocol === 'http:' ||
      parsed.protocol === 'https:'
    );
  } catch {
    return false;
  }
};

export default function Contact({ data }) {
  const socials = data?.socials || {};
  const personal = data?.personal || {};

  const firstName =
    personal?.name?.trim()?.split(' ')?.[0] || 'Me';

  const socialLinks = [
    {
      url: socials.linkedin,
      icon: Linkedin,
      label: 'LinkedIn',
    },
    {
      url: socials.github,
      icon: Github,
      label: 'GitHub',
    },
    {
      url: socials.twitter,
      icon: Twitter,
      label: 'Twitter',
    },
  ].filter((item) => isSafeUrl(item.url));

  return (
    <section
      id="contact"
      className="relative bg-slate-950/95 px-6 py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 flex items-center justify-center gap-3"
        >
          <div className="h-1.5 w-20 rounded-full bg-amber-200/90" />

          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-200/70">
            Contact
          </span>

          <div className="h-1.5 w-20 rounded-full bg-amber-200/90" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-[2rem] border border-amber-200/20 bg-slate-900/75 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.35)]"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_0.45fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-200/70">
                Let&apos;s Collaborate
              </p>

              <h2 className="mt-4 font-serif text-4xl font-black leading-tight text-amber-100">
                Start Your Next Elegant Project.
              </h2>

              <p className="mt-6 text-base leading-relaxed text-amber-100/80">
                Reach out via email or connect on social platforms.
                Let&apos;s create something memorable together.
              </p>
            </div>

            <div className="space-y-5">
              {socials.email && (
                <a
                  href={`mailto:${socials.email}`}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-amber-200 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-300"
                >
                  <Mail size={16} />
                  Email {firstName}
                </a>
              )}

              {socialLinks.length > 0 && (
                <div className="rounded-[1.75rem] border border-amber-200/20 bg-slate-950/80 p-4">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/70">
                    Connect
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((item) => {
                      const Icon = item.icon;

                      return (
                        <a
                          key={item.label}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={item.label}
                          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-200/10 text-amber-100 transition hover:bg-amber-200/20"
                        >
                          <Icon size={18} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}