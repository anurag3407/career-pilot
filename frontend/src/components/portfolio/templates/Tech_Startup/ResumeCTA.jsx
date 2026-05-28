import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mail, Sparkles } from 'lucide-react';

export default function ResumeCTA({ data }) {
  // 1. SECURITY FIX: Sanitize URL to prevent XSS (Cross-Site Scripting) attacks
  const sanitizeUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    // Block dangerous javascript execution protocols
    if (url.trim().toLowerCase().startsWith('javascript:')) return null;
    return url;
  };

  const rawResumeUrl = data?.resumeUrl || data?.resume || null;
  const resumeUrl = sanitizeUrl(rawResumeUrl);

  const fullName = data?.fullName || data?.name || 'Professional Developer';
  const email = data?.email || data?.contactEmail || '';

  const subtitleText = data?.resumeCtaSubtitle || "Download my complete, professionally tailored resume to explore my technical skills, architectural execution, and background.";

  // Spring animation transition configurations
  const springTransition = { type: "spring", stiffness: 300, damping: 20 };

  // 2. STABILITY FIX: Type-check before running regex to prevent fatal crashes
  const getFileExtension = (url) => {
    if (!url || typeof url !== 'string') return '';
    const match = url.match(/\.([a-zA-Z0-9]+)(?:[\?#]|$)/);
    return match ? `.${match[1]}` : '';
  };

  const fileExtension = getFileExtension(resumeUrl);

  return (
    <section className="relative w-full py-24 md:py-32 bg-[#030712] overflow-hidden text-slate-100 font-sans border-t border-slate-900">

      {/* Soft blue/indigo spotlight glow matching the homepage's left gradient light */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(0,210,255,0.06),transparent_65%)] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.04),transparent_65%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">

        {/* Animated Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full rounded-3xl border border-slate-800/60 bg-[#0b0f19]/30 backdrop-blur-xl p-8 md:p-16 flex flex-col items-center text-center shadow-2xl overflow-hidden"
        >
          {/* Top accent highlighting line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D2FF]/30 to-transparent" />

          {/* Capsule Badge */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, ...springTransition }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-slate-800/80 text-[#00D2FF] text-xs font-semibold mb-8 shadow-inner"
          >
            <Sparkles size={12} className="text-[#00D2FF]" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D2FF] to-[#8B5CF6]">
              Available for immediate opportunities
            </span>
          </motion.div>

          {/* Headline: Clean conditional rendering */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white max-w-2xl leading-tight"
          >
            {data?.resumeCtaTitle ? (
              data.resumeCtaTitle
            ) : (
              <>
                Land your next <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D2FF] to-[#8B5CF6]">opportunity</span> with a solid track record.
              </>
            )}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-5 text-slate-400 text-base md:text-lg max-w-xl leading-relaxed font-normal"
          >
            {subtitleText}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto"
          >

            {/* Primary Action Button: Now handles disabled state, extensions, AND XSS Protection! */}
            <motion.a
              href={resumeUrl || undefined}
              download={resumeUrl ? `${fullName.replace(/\s+/g, '_')}_Resume${fileExtension}` : undefined}
              aria-disabled={!resumeUrl}
              whileHover={resumeUrl ? { scale: 1.025, boxShadow: "0 0 25px rgba(0, 210, 255, 0.4)" } : {}}
              whileTap={resumeUrl ? { scale: 0.985 } : {}}
              transition={springTransition}
              className={`group flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
                resumeUrl
                  ? "bg-gradient-to-r from-[#00D2FF] to-[#0070F3] hover:brightness-110 shadow-lg shadow-cyan-500/10 cursor-pointer"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
              }`}
            >
              <Download size={16} className={resumeUrl ? "text-white transition-transform group-hover:translate-y-0.5" : "text-slate-500"} />
              {resumeUrl ? "Download Resume" : "Resume Unavailable"}
            </motion.a>

            {/* Secondary Action Button */}
            {email && (
              <motion.a
                href={`mailto:${email}?subject=Project Proposal`}
                whileHover={{
                  scale: 1.025,
                  borderColor: "rgba(0, 210, 255, 0.3)"
                }}
                whileTap={{ scale: 0.985 }}
                transition={springTransition}
                className="group flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-semibold text-slate-300 bg-[#0F172A]/40 border border-slate-800 hover:text-white transition-colors duration-200"
              >
                <Mail size={16} className="text-slate-500 transition-transform group-hover:scale-105" />
                Get in Touch
              </motion.a>
            )}

          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
