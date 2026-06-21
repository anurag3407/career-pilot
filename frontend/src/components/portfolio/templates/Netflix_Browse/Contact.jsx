import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Twitter, Send, CheckCircle } from "lucide-react";
import logger from '../../../../utils/logger';

export default function Contact({ personal, socials }) {
 const [sent, setSent] = useState(false);
 const [loading, setLoading] = useState(false);
 const [form, setForm] = useState({ name: "", email: "", message: "" });
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    // Simulate send delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSent(true);
    setTimeout(() => setSent(false), 4000);

    setForm({ name: "", email: "", message: "" });

  } catch (error) {
    console.log(error);

  } finally {
    setLoading(false);
  }
};

  return (
    <section id="contact" className="py-16 px-4 md:px-12">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-white text-xl md:text-2xl font-bold tracking-wide mb-8"
      >
        ✉️ Get In Touch
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left — form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-[#1f1f1f] rounded-xl p-6 border border-white/5"
        >
          <h3 className="text-white text-lg font-bold mb-5">Send a Message</h3>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="w-12 h-12 text-[#E50914] mb-3" />
              <p className="text-white font-bold text-lg">Message sent!</p>
              <p className="text-[#737373] text-sm mt-1">I'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#a3a3a3] text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#525252] focus:outline-none focus:border-[#E50914] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#a3a3a3] text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#525252] focus:outline-none focus:border-[#E50914] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[#a3a3a3] text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="What would you like to say?"
                  className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#525252] focus:outline-none focus:border-[#E50914] transition-colors resize-none"
                />
              </div>
              <button
  type="submit"
  disabled={loading}
  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#E50914] text-white font-bold text-sm rounded-lg hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(229,9,20,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
>
  {loading ? (
    <>
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Sending...
    </>
  ) : (
    <>
      <Send className="w-4 h-4" />
      Send Message
    </>
  )}
</button>
            </form>
          )}
        </motion.div>

        {/* Right — info + socials */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col justify-between"
        >
          <div className="bg-[#1f1f1f] rounded-xl p-6 border border-white/5 mb-4">
            <h3 className="text-white text-lg font-bold mb-4">Connect With Me</h3>
            <div className="space-y-3">
              {[
                { icon: Mail, label: "Email", value: socials.email, href: `mailto:${socials.email}` },
                { icon: Github, label: "GitHub", value: "github.com/alexrivera", href: socials.github },
                { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/alexrivera", href: socials.linkedin },
                { icon: Twitter, label: "Twitter", value: "@alexrivera", href: socials.twitter },
              ].map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#141414] border border-white/5 hover:border-[#E50914]/40 hover:bg-[#E50914]/5 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#E50914]/10 border border-[#E50914]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E50914]/20">
                    <Icon className="w-4 h-4 text-[#E50914]" />
                  </div>
                  <div>
                    <p className="text-[#737373] text-[10px] font-semibold uppercase tracking-wider">{label}</p>
                    <p className="text-[#e5e5e5] text-xs">{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Footer quote */}
          <div className="bg-[#1f1f1f] rounded-xl p-6 border border-[#E50914]/20">
            <p className="text-[#E50914] font-black text-lg leading-snug">
              "Let's build something amazing together."
            </p>
            <p className="text-[#737373] text-sm mt-2">— {personal.name}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
