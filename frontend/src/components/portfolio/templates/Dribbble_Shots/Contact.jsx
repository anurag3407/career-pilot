import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Mail, MapPin, Github, Linkedin, Twitter, Send } from "lucide-react";
import SectionLabel from "./SectionLabel";
import data from "../../../../data/dummy_data.json";

export default function Contact() {
  const { socials, personal } = data;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleSubmit = () => {
    if (form.name && form.email && form.message) {
      setSent(true);
      setTimeout(() => setSent(false), 3500);
      setForm({ name: "", email: "", message: "" });
    }
  };

  const inputCls =
    "w-full bg-white border border-[#ebebeb] rounded-xl px-4 py-3.5 text-[#333] placeholder-[#ccc] text-sm focus:outline-none focus:border-[#ea4c89]/50 focus:ring-2 focus:ring-[#ea4c89]/10 transition-all shadow-sm";

  return (
    <section id="contact" ref={ref} className="py-28 px-6 md:px-16 lg:px-24 pb-36">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Contact</SectionLabel>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl md:text-5xl font-black text-[#1a1a1a] mb-2"
        >
          Let's make <span className="text-[#ea4c89]">something</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-[#aaa] mb-14 text-sm"
        >
          Have a project in mind? Drop me a message.
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className={inputCls}
            />
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className={inputCls}
            />
            <textarea
              rows={5}
              placeholder="Tell me about your project..."
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              className={`${inputCls} resize-none`}
            />
            <motion.button
              onClick={handleSubmit}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(234,76,137,0.28)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-[#ea4c89] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(234,76,137,0.22)] transition-all"
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    ✓ Sent — I'll be in touch!
                  </motion.span>
                ) : (
                  <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    Send Message <Send size={13} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col justify-between gap-8"
          >
            <div>
              <p className="text-[#999] leading-relaxed text-sm mb-8">
                Whether it's a full project, a quick question, or just saying hello — I'd love to hear from you.
              </p>
              <div className="space-y-3">
                <a
                  href={`mailto:${socials?.email}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#fef0f5] border border-[#fad7e8] flex items-center justify-center">
                    <Mail size={14} className="text-[#ea4c89]" />
                  </div>
                  <span className="text-[#666] text-sm group-hover:text-[#ea4c89] transition-colors">{socials?.email}</span>
                </a>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fef0f5] border border-[#fad7e8] flex items-center justify-center">
                    <MapPin size={14} className="text-[#ea4c89]" />
                  </div>
                  <span className="text-[#666] text-sm">{personal?.location}</span>
                </div>
              </div>
            </div>

            {/* Social grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Github,   href: socials?.github,   label: "GitHub" },
                { icon: Linkedin, href: socials?.linkedin,  label: "LinkedIn" },
                { icon: Twitter,  href: socials?.twitter,   label: "Twitter" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4 }}
                  className="flex flex-col items-center gap-2 p-4 bg-white border border-[#f0f0f0] rounded-2xl hover:border-[#ea4c89]/25 hover:shadow-md transition-all"
                >
                  <Icon size={17} className="text-[#bbb]" />
                  <span className="text-[#ccc] text-[10px]">{label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}