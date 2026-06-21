import { motion } from "framer-motion";
import { MapPin, Phone, Mail, ChevronDown,Github } from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero({ data }) {
  const { personal, socials, stats } = data;

  // Convert flat socials object into an array safely for rendering
  const socialsArray = socials 
    ? Object.entries(socials).map(([platform, url]) => ({ platform, url }))
    : [];

  // Map flat stats keys to readable labels and values
  const statsArray = stats ? [
    { label: "Years Experience", value: stats.yearsExperience },
    { label: "Projects Completed", value: stats.projectsCompleted },
    { label: "Happy Clients", value: stats.happyClients }
  ].filter(stat => stat.value !== undefined) : [];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[55vw] h-[55vw] max-w-3xl max-h-3xl rounded-full bg-gradient-to-br from-blue-100/60 to-sky-200/40 blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[35vw] h-[35vw] max-w-xl max-h-xl rounded-full bg-gradient-to-tr from-teal-100/50 to-blue-100/30 blur-3xl -translate-x-1/4 translate-y-1/4" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e40af" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 md:px-16 py-6">
        <motion.div {...fadeUp(0)} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v20M2 12h20" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-semibold text-slate-800 tracking-tight text-lg">{personal?.name?.split(" ")[0] ?? "Dr."}</span>
        </motion.div>
        <motion.div {...fadeUp(0.1)} className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {["About", "Skills", "Experience", "Projects", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-blue-600 transition-colors duration-200">
              {item}
            </a>
          ))}
        </motion.div>
        <motion.a {...fadeUp(0.15)} href="#contact" className="hidden md:inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors duration-200 shadow-lg shadow-blue-200">
          Book Appointment
        </motion.a>
      </nav>

      <div className="relative z-10 flex-1 flex items-center px-6 md:px-16 py-12">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center">
          <div className="order-2 lg:order-1">
            <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              {personal?.availability ?? "Available for Consultations"}
            </motion.div>

            <motion.h1 {...fadeUp(0.2)} className="text-4xl md:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {personal?.name ?? "Dr. Jane Doe"}
            </motion.h1>

            <motion.p {...fadeUp(0.3)} className="text-blue-600 font-semibold text-lg md:text-xl mb-5 tracking-wide">
              {personal?.title ?? "Senior Medical Specialist"}
            </motion.p>

            <motion.p {...fadeUp(0.35)} className="text-slate-500 text-base md:text-lg leading-relaxed max-w-lg mb-8">
              {personal?.bio ?? "Dedicated to delivering compassionate, evidence-based care with a patient-first approach."}
            </motion.p>

            <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-4 mb-10">
              {personal?.location && (
                <span className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  {personal.location}
                </span>
              )}
              {socials?.email && (
                <span className="flex items-center gap-1.5 text-slate-500 text-sm">
                  <Mail className="w-4 h-4 text-blue-400" />
                  {socials.email}
                </span>
              )}
            </motion.div>

            <motion.div {...fadeUp(0.45)} className="flex flex-wrap gap-3">
              <a href="#contact" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-full text-sm transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5">
                Get in Touch
              </a>
              <a href="#experience" className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-7 py-3 rounded-full text-sm border border-slate-200 transition-all duration-200 hover:-translate-y-0.5">
                View Experience
              </a>
            </motion.div>

            {socialsArray.length > 0 && (
              <motion.div {...fadeUp(0.5)} className="flex items-center gap-3 mt-8">
                {socialsArray.map((s) => (
                  <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 text-xs font-bold shadow-sm">
                    {s.platform?.charAt(0).toUpperCase()}
                  </a>
                ))}
              </motion.div>
            )}
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 xl:w-96 xl:h-96 rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/60 border-4 border-white">
                {personal?.avatar ? (
                  <img src={personal.avatar} alt={personal.name || "Profile Avatar"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-32 h-32 text-blue-300" stroke="currentColor" strokeWidth="1">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-3">
                <p className="text-xs text-slate-400 font-medium mb-0.5">Experience</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.yearsExperience ?? "0"}+</p>
                <p className="text-xs text-slate-500">Years</p>
              </div>

              <div className="absolute -top-4 -right-4 bg-blue-600 text-white rounded-2xl shadow-xl px-4 py-3 text-center">
                <p className="text-xl font-bold">{stats?.happyClients ?? "0"}+</p>
                <p className="text-xs opacity-80">Patients</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {statsArray.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="relative z-10 border-t border-slate-100 bg-white/70 backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-16 py-6 flex flex-wrap justify-around gap-6">
            {statsArray.map((stat, i) => (
              <div key={i} className="text-center min-w-[120px]">
                <p className="text-2xl md:text-3xl font-bold text-blue-600">{stat.value}+</p>
                <p className="text-xs text-slate-500 mt-1 font-medium tracking-wide uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 hover:text-blue-500 transition-colors z-10"
      >
        <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.a>
    </section>
  );
}