import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  Twitter,
  Star,
  BookOpen,
  Pencil,
  GraduationCap,
  MessageSquare,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const ChalkDust = ({ className = '' }) => (
  <div className={`rounded-full bg-white opacity-10 blur-md pointer-events-none select-none ${className}`} />
);

const ChalkDivider = ({ className = '' }) => (
  <div className={`w-full border-t-2 border-dashed border-white/20 ${className}`} />
);

const CornerBracket = ({ position = 'tl', color = 'white' }) => {
  const corners = {
    tl: 'top-0 left-0 border-t-2 border-l-2 rounded-tl-md',
    tr: 'top-0 right-0 border-t-2 border-r-2 rounded-tr-md',
    bl: 'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-md',
    br: 'bottom-0 right-0 border-b-2 border-r-2 rounded-br-md',
  };
  return (
    <span
      className={`absolute w-4 h-4 pointer-events-none select-none opacity-60 ${corners[position]}`}
      style={{ borderColor: color === 'white' ? 'rgba(255,255,255,0.7)' : color }}
    />
  );
};

const ChalkInput = ({ label, id, type = 'text', value, onChange, placeholder, required, icon: Icon }) => (
  <div className="relative group">
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-yellow-300 mb-1 tracking-widest uppercase"
      style={{ fontFamily: "'Caveat', cursive" }}
    >
      {Icon && <Icon size={13} className="inline mr-1 -mt-0.5 opacity-80" />}
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoComplete="off"
      className="w-full bg-transparent border-b-2 border-dashed border-white/40 text-white placeholder-white/30 py-2 px-1 text-base outline-none transition-all duration-300 focus:border-yellow-300 focus:placeholder-white/10 group-hover:border-white/60"
      style={{ fontFamily: "'Caveat', cursive", fontSize: '1.05rem' }}
    />
    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-yellow-300 transition-all duration-500 group-focus-within:w-full rounded-full" />
  </div>
);

const ChalkTextarea = ({ label, id, value, onChange, placeholder, required }) => (
  <div className="relative group">
    <label
      htmlFor={id}
      className="block text-sm font-semibold text-yellow-300 mb-1 tracking-widest uppercase"
      style={{ fontFamily: "'Caveat', cursive" }}
    >
      <MessageSquare size={13} className="inline mr-1 -mt-0.5 opacity-80" />
      {label}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={4}
      className="w-full bg-white/5 border-2 border-dashed border-white/30 text-white placeholder-white/30 rounded-md py-2 px-3 text-base outline-none resize-none transition-all duration-300 focus:border-yellow-300 focus:bg-white/8 group-hover:border-white/50"
      style={{ fontFamily: "'Caveat', cursive", fontSize: '1.05rem' }}
    />
  </div>
);

const InfoCard = ({ icon: Icon, label, value, color }) => (
  <div className="relative flex items-start gap-3 p-3 rounded-lg border border-dashed border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5 group">
    <CornerBracket position="tl" color={color} />
    <CornerBracket position="br" color={color} />
    <div
      className="mt-0.5 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full"
      style={{ background: `${color}22`, border: `1.5px dashed ${color}` }}
    >
      <Icon size={15} style={{ color }} />
    </div>
    <div>
      <p className="text-xs tracking-widest uppercase opacity-60 text-white mb-0.5">{label}</p>
      <p className="text-white font-semibold text-sm leading-snug" style={{ fontFamily: "'Caveat', cursive", fontSize: '1rem' }}>
        {value}
      </p>
    </div>
  </div>
);

const SocialPill = ({ icon: Icon, label, href, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-dashed text-white font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
    style={{ borderColor: color, background: `${color}18`, fontFamily: "'Caveat', cursive", fontSize: '0.95rem' }}
  >
    <Icon size={15} style={{ color }} />
    {label}
  </a>
);

const ChalkHeading = ({ children, accent = '#FDE047' }) => (
  <span className="relative inline-block">
    {children}
    <span className="absolute left-0 -bottom-1 w-full h-1 rounded-full opacity-70" style={{ background: accent, filter: 'blur(1px)' }} />
    <span className="absolute left-0 -bottom-1 w-full h-0.5 rounded-full" style={{ background: accent }} />
  </span>
);

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.id]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap');
        @keyframes chalkFlicker {
          0%, 100% { opacity: 1; }
          48% { opacity: 1; }
          50% { opacity: 0.88; }
          52% { opacity: 1; }
          80% { opacity: 1; }
          82% { opacity: 0.92; }
          84% { opacity: 1; }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) rotate(-6deg); }
          50% { transform: translateY(-10px) rotate(-6deg); }
        }
        @keyframes floatY2 {
          0%, 100% { transform: translateY(0px) rotate(8deg); }
          50% { transform: translateY(-14px) rotate(8deg); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.7); opacity: 0; }
          70% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .chalk-flicker { animation: chalkFlicker 8s infinite; }
        .float-1 { animation: floatY 4s ease-in-out infinite; }
        .float-2 { animation: floatY2 5.5s ease-in-out infinite; }
        .bounce-in { animation: bounceIn 0.5s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>

      <section
        className="relative w-full min-h-screen overflow-hidden py-20 px-4"
        style={{ background: 'linear-gradient(160deg, #1a3a2a 0%, #0f2318 40%, #0a1a10 100%)', fontFamily: "'Caveat', cursive" }}
        aria-label="Contact section"
      >
        {/* Chalkboard noise texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.07'/%3E%3C/svg%3E")`,
            opacity: 0.55,
          }}
        />

        {/* Chalk-dust blobs */}
        <ChalkDust className="w-96 h-96 absolute -top-24 -left-24" />
        <ChalkDust className="w-64 h-64 absolute top-1/2 -right-20" />
        <ChalkDust className="w-48 h-48 absolute bottom-10 left-1/3" />

        {/* Floating doodles */}
        <div className="float-1 absolute top-12 right-12 opacity-10 pointer-events-none">
          <Star size={44} strokeWidth={1.2} color="white" />
        </div>
        <div className="float-2 absolute top-32 left-8 opacity-10 pointer-events-none">
          <BookOpen size={48} strokeWidth={1.2} color="white" />
        </div>
        <div className="float-1 absolute bottom-24 right-16 opacity-10 pointer-events-none" style={{ animationDelay: '1.2s' }}>
          <GraduationCap size={42} strokeWidth={1.2} color="white" />
        </div>
        <div className="float-2 absolute bottom-36 left-12 opacity-10 pointer-events-none" style={{ animationDelay: '0.6s' }}>
          <Pencil size={36} strokeWidth={1.2} color="white" />
        </div>

        {/* Board frame borders */}
        <div className="absolute inset-4 rounded-2xl border-4 border-white/10 pointer-events-none" />
        <div className="absolute inset-6 rounded-xl border border-dashed border-white/8 pointer-events-none" />

        {/* Chalk tray glow */}
        <div className="absolute bottom-0 left-0 right-0 h-5 rounded-b-2xl pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.05))' }} />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/8 border border-dashed border-white/20 rounded-full px-5 py-1.5 mb-6 text-yellow-300 text-sm tracking-widest uppercase">
              <Pencil size={13} className="opacity-80" />
              Leave a Note
            </div>
            <h2
              className="chalk-flicker text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight"
              style={{ textShadow: '0 0 30px rgba(255,255,255,0.15), 2px 2px 0 rgba(0,0,0,0.4)' }}
            >
              <ChalkHeading>Get In Touch</ChalkHeading>
            </h2>
            <p className="text-white/60 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Got a project in mind? Want to collaborate? Or just want to say hello?
              Drop me a message — I'm always happy to connect! 👋
            </p>
            <ChalkDivider className="mt-10 max-w-sm mx-auto opacity-40" />
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Left panel */}
            <aside className="lg:col-span-2 flex flex-col gap-6">

              {/* Contact info */}
              <div
                className="relative rounded-xl p-6 border-2 border-dashed border-white/20 bg-white/5"
                style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2), 0 4px 32px rgba(0,0,0,0.3)' }}
              >
                <CornerBracket position="tl" color="#FDE047" />
                <CornerBracket position="tr" color="#FDE047" />
                <CornerBracket position="bl" color="#FDE047" />
                <CornerBracket position="br" color="#FDE047" />
                <h3 className="text-yellow-300 text-2xl font-bold mb-4"
                  style={{ textShadow: '0 0 12px rgba(253,224,71,0.4)' }}>
                  📌 My Details
                </h3>
                <div className="flex flex-col gap-3">
                  <InfoCard icon={Mail}   label="Email"    value="alex.student@edu.dev"      color="#60a5fa" />
                  <InfoCard icon={Phone}  label="Phone"    value="+1 (555) 012-3456"          color="#34d399" />
                  <InfoCard icon={MapPin} label="Location" value="San Francisco, CA, USA 🌁"  color="#f472b6" />
                </div>
              </div>

              {/* Social links */}
              <div
                className="relative rounded-xl p-5 border-2 border-dashed border-white/15 bg-white/5"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25)' }}
              >
                <CornerBracket position="tl" color="#a78bfa" />
                <CornerBracket position="br" color="#a78bfa" />
                <p className="text-white/50 text-xs tracking-widest uppercase mb-4">— Find me online —</p>
                <div className="flex flex-wrap gap-3">
                  <SocialPill icon={Github}   label="GitHub"   href="#" color="#a78bfa" />
                  <SocialPill icon={Linkedin} label="LinkedIn" href="#" color="#60a5fa" />
                  <SocialPill icon={Twitter}  label="Twitter"  href="#" color="#38bdf8" />
                </div>
              </div>

              {/* Availability badge */}
              <div className="relative rounded-xl p-4 border-2 border-dashed border-green-400/30 bg-green-400/8 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
                </span>
                <p className="text-green-300 font-semibold text-base">
                  Available for freelance &amp; internships
                </p>
              </div>
            </aside>

            {/* Right: contact form */}
            <main className="lg:col-span-3">
              <div
                className="relative rounded-2xl p-8 border-2 border-dashed border-white/20 bg-white/5"
                style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.3), 0 8px 48px rgba(0,0,0,0.4)' }}
              >
                <CornerBracket position="tl" color="#f472b6" />
                <CornerBracket position="tr" color="#f472b6" />
                <CornerBracket position="bl" color="#f472b6" />
                <CornerBracket position="br" color="#f472b6" />

                {/* Chalk dot row */}
                <div className="flex gap-2 mb-6">
                  {['#f87171', '#fbbf24', '#34d399'].map((c) => (
                    <span key={c} className="w-3 h-3 rounded-full opacity-60" style={{ background: c }} />
                  ))}
                  <span className="flex-1 border-b border-dashed border-white/15 self-center ml-2" />
                  <span className="text-white/30 text-xs tracking-widest">write to me</span>
                </div>

                {submitted ? (
                  <div className="bounce-in flex flex-col items-center justify-center py-16 gap-4 text-center">
                    <CheckCircle size={52} className="text-green-400" strokeWidth={1.5} />
                    <h3 className="text-3xl font-bold text-white"
                      style={{ textShadow: '0 0 20px rgba(52,211,153,0.4)' }}>
                      Message Sent! ✨
                    </h3>
                    <p className="text-white/60 text-lg max-w-xs">
                      Thanks for reaching out! I'll get back to you soon.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}
                      className="mt-4 text-yellow-300 border border-dashed border-yellow-300/40 px-5 py-2 rounded-full text-sm hover:bg-yellow-300/10 transition-all"
                    >
                      Send another ↩
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <ChalkInput label="Your Name"     id="name"    value={form.name}    onChange={handleChange} placeholder="Alex Johnson"     required icon={Pencil} />
                      <ChalkInput label="Email Address" id="email"   value={form.email}   onChange={handleChange} placeholder="alex@example.com" required icon={Mail} type="email" />
                    </div>
                    <div className="mb-8">
                      <ChalkTextarea label="Your Message" id="message" value={form.message} onChange={handleChange} placeholder="Hi! I'd love to collaborate on..." required />
                    </div>

                    <ChalkDivider className="mb-6 opacity-20" />

                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <p className="text-white/35 text-sm italic">* I typically reply within 24 hours</p>
                      <button
                        type="submit"
                        disabled={loading}
                        className="relative flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-base text-gray-900 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-transparent"
                        style={{
                          background: loading ? 'rgba(253,224,71,0.6)' : 'linear-gradient(135deg, #FDE047 0%, #fb923c 100%)',
                          boxShadow: '0 4px 20px rgba(253,224,71,0.35)',
                          fontFamily: "'Caveat', cursive",
                          fontSize: '1.1rem',
                        }}
                        aria-label="Send message"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                            </svg>
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Send Message
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Emoji doodle row */}
              <div className="mt-5 flex items-center gap-3 justify-center opacity-40">
                {['✏️', '📚', '🎓', '📐', '🔬', '📝', '💡'].map((emoji, i) => (
                  <span key={i} className="text-lg select-none"
                    style={{ transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (i * 3 % 9)}deg)` }}>
                    {emoji}
                  </span>
                ))}
              </div>
            </main>
          </div>

          {/* Footer */}
          <ChalkDivider className="mt-14 mb-6 opacity-20" />
          <p className="text-center text-white/25 text-sm tracking-widest">
            © 2026 Alex Johnson · Chalkboard Education Theme · Built with ❤️ &amp; chalk dust
          </p>
        </div>
      </section>
    </>
  );
}
