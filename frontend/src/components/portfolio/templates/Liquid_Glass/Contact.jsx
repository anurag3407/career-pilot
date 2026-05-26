import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  User,
  Mail,
  MessageSquare,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Send,
  Heart,
  Sparkles,
} from 'lucide-react';

const glassPanel =
  'bg-white/[0.05] backdrop-blur-md border border-white/[0.1] rounded-2xl';

const inputBase =
  'w-full bg-white/[0.04] backdrop-blur-sm border border-white/[0.1] rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-500/20 focus:bg-white/[0.07]';

const socialIcons = {
  github: { icon: Github, label: 'GitHub', color: 'group-hover:text-white' },
  linkedin: {
    icon: Linkedin,
    label: 'LinkedIn',
    color: 'group-hover:text-sky-300',
  },
  twitter: {
    icon: Twitter,
    label: 'Twitter',
    color: 'group-hover:text-sky-300',
  },
  email: { icon: Mail, label: 'Email', color: 'group-hover:text-sky-300' },
};

function SocialButton({ href, type, index }) {
  const config = socialIcons[type];
  if (!config || !href) return null;

  const Icon = config.icon;
  const resolvedHref =
    type === 'email' ? `mailto:${href}` : href;

  return (
    <motion.a
      href={resolvedHref}
      target={type !== 'email' ? '_blank' : undefined}
      rel={type !== 'email' ? 'noopener noreferrer' : undefined}
      variants={{
        hidden: { opacity: 0, x: 30 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { delay: index * 0.1, duration: 0.5, ease: 'easeOut' },
        },
      }}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="group flex items-center gap-4 px-5 py-4 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.08] transition-all duration-300 cursor-pointer"
    >
      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.1] group-hover:border-white/[0.2] transition-all duration-300 group-hover:shadow-[0_0_14px_rgba(56,189,248,0.18)]">
        <Icon
          size={18}
          className={`text-white/60 transition-colors duration-300 ${config.color}`}
        />
      </span>
      <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-300">
        {config.label}
      </span>
      <ExternalLink
        size={14}
        className="ml-auto text-white/20 group-hover:text-white/50 transition-colors duration-300"
      />
    </motion.a>
  );
}

function FormField({ icon: Icon, placeholder, type = 'text', isTextarea, index }) {
  const variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.15 + index * 0.1, duration: 0.45, ease: 'easeOut' },
    },
  };

  return (
    <motion.div variants={variants} className="relative">
      <span className="absolute left-3.5 top-3.5 text-white/30 pointer-events-none">
        <Icon size={16} />
      </span>
      {isTextarea ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          className={`${inputBase} resize-none pt-3`}
        />
      ) : (
        <input type={type} placeholder={placeholder} className={inputBase} />
      )}
    </motion.div>
  );
}

export default function Contact({ data }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const personal = data?.personal || {};
  const socials = data?.socials || {};

  const contactEmail = socials.email || '';

  const socialEntries = [
    socials.github && { type: 'github', href: socials.github },
    socials.linkedin && { type: 'linkedin', href: socials.linkedin },
    socials.twitter && { type: 'twitter', href: socials.twitter },
    contactEmail && { type: 'email', href: contactEmail },
  ].filter(Boolean);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const leftSlide = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const rightSlide = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] rounded-full bg-sky-500/[0.06] blur-[120px]" />
        <div className="absolute -top-32 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-400/[0.05] blur-[100px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="relative z-10 mx-auto max-w-6xl"
      >
        {/* ── Section Title ── */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Get In Touch
          </h2>
          <div className="mt-4 mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-sky-400/80 via-cyan-400/80 to-sky-400/80 shadow-[0_0_20px_rgba(56,189,248,0.3)]" />
          <p className="mt-4 text-sm sm:text-base text-white/50 max-w-md mx-auto">
            Have a project in mind? Let&rsquo;s connect and bring your vision to
            life.
          </p>
        </motion.div>

        {/* ── Two‑Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left — Contact Form */}
          <motion.div variants={leftSlide}>
            <div className={`${glassPanel} group relative p-6 sm:p-8`}>
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(56,189,248,0.22)",
                  background:
                    "radial-gradient(120% 90% at 15% 0%, rgba(56,189,248,0.14) 0%, transparent 60%)",
                }}
              />
              <h3 className="text-lg font-semibold text-white/90 mb-6 flex items-center gap-2">
                <Send size={18} className="text-sky-300/70" />
                Send a Message
              </h3>

              <motion.form
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="flex flex-col gap-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <FormField
                  icon={User}
                  placeholder="Your Name"
                  index={0}
                />
                <FormField
                  icon={Mail}
                  placeholder="Your Email"
                  type="email"
                  index={1}
                />
                <FormField
                  icon={MessageSquare}
                  placeholder="Your Message..."
                  isTextarea
                  index={2}
                />

                <motion.button
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { delay: 0.5, duration: 0.45 },
                    },
                  }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: '0 0 28px rgba(56,189,248,0.35)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-xs sm:text-sm font-semibold text-white tracking-wide shadow-lg shadow-sky-500/20 transition-shadow duration-300 hover:shadow-sky-500/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Send Message
                </motion.button>
              </motion.form>
            </div>
          </motion.div>

          {/* Right — Social Links & Info */}
          <motion.div variants={rightSlide} className="flex flex-col gap-6">
            {/* Social links panel */}
            <div className={`${glassPanel} group relative p-6 sm:p-8`}>
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(56,189,248,0.22)",
                  background:
                    "radial-gradient(120% 90% at 15% 0%, rgba(56,189,248,0.14) 0%, transparent 60%)",
                }}
              />
              <h3 className="text-lg font-semibold text-white/90 mb-6 flex items-center gap-2">
                <Sparkles size={18} className="text-sky-300/70" />
                Connect With Me
              </h3>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="flex flex-col gap-3"
              >
                {socialEntries.map((entry, i) => (
                  <SocialButton
                    key={entry.type}
                    href={entry.href}
                    type={entry.type}
                    index={i}
                  />
                ))}

                {socialEntries.length === 0 && (
                  <p className="text-sm text-white/30 text-center py-4">
                    No social links available.
                  </p>
                )}
              </motion.div>
            </div>

            {/* Decorative tagline card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.5, duration: 0.55 },
                },
              }}
              className={`${glassPanel} group relative p-6 text-center`}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(56,189,248,0.2)",
                  background:
                    "radial-gradient(120% 90% at 20% 0%, rgba(56,189,248,0.14) 0%, transparent 60%)",
                }}
              />
              <p className="text-sm sm:text-base font-medium bg-gradient-to-r from-sky-300 via-cyan-200 to-sky-200 bg-clip-text text-transparent">
                &ldquo;Let&rsquo;s create something amazing together.&rdquo;
              </p>
              <p className="mt-2 text-xs text-white/30">
                {personal.name
                  ? `— ${personal.name}`
                  : 'Open to collaborations & opportunities'}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Footer ── */}
        <motion.footer
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { delay: 0.7, duration: 0.6 },
            },
          }}
          className="mt-20 sm:mt-28"
        >
          {/* Glass divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 text-xs text-white/35">
            <p>
              &copy; {new Date().getFullYear()}{' '}
              {personal.name || 'Portfolio'}. All rights reserved.
            </p>
            <p className="flex items-center gap-1">
              Made with{' '}
              <Heart
                size={12}
                className="text-sky-300/70 fill-sky-300/70"
              />{' '}
              and a touch of glass
            </p>
          </div>
        </motion.footer>
      </motion.div>
    </section>
  );
}
