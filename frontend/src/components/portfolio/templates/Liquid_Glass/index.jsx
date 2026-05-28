import { motion } from "framer-motion";
import { GithubIcon, Linkedin, Twitter, Mail, ExternalLink, MapPin, Download, Star, Briefcase, User, Code2, MessageSquare, Phone, Globe } from "lucide-react";
import data from "../../../../data/dummy_data.json";

// Glass card component reused throughout
const GlassCard = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)] ${className}`}
  >
    {children}
  </div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
      {/* Gradient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/30 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/30 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-pink-500/20 blur-[100px]" />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {/* Left */}
        <motion.div variants={fadeUp}>
          {/* FIX 1: Safe fallback for availability key */}
          <GlassCard className="inline-flex items-center gap-2 px-4 py-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/80 text-sm">
              {data.personal.availability ?? "Open to work"}
            </span>
          </GlassCard>

          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            {data.personal.name.split(" ")[0]}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              {data.personal.name.split(" ").slice(1).join(" ")}
            </span>
          </h1>

          <p className="text-white/70 text-lg mb-4">{data.personal.title}</p>
          <p className="text-white/50 text-sm mb-2 flex items-center gap-1">
            <MapPin size={14} /> {data.personal.location}
          </p>

          {/* FIX 2: Safe fallback for shortBio — falls back to bio */}
          <p className="text-white/60 leading-relaxed mb-8">
            {data.personal.shortBio ?? data.personal.bio}
          </p>

          <div className="flex flex-wrap gap-3">
            {/* FIX 3: Safe fallback for resumeUrl */}
            <a
              href={data.personal.resumeUrl ?? "#"}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-medium text-sm backdrop-blur-sm transition-all"
            >
              <Download size={16} /> Download CV
            </a>
            <a
              href={`mailto:${data.socials.email}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/30 hover:bg-cyan-500/50 border border-cyan-400/40 text-cyan-200 font-medium text-sm backdrop-blur-sm transition-all"
            >
              <Mail size={16} /> Contact Me
            </a>
          </div>

          {/* Socials */}
          <div className="flex gap-4 mt-6">
            {[
              { icon: <Github size={18} />, href: data.socials.github, label: "GitHub" },
              { icon: <Linkedin size={18} />, href: data.socials.linkedin, label: "LinkedIn" },
              { icon: <Twitter size={18} />, href: data.socials.twitter, label: "Twitter" },
              { icon: <Globe size={18} />, href: data.socials.website, label: "Website" },
            ].map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/70 hover:text-white transition-all"
              >
                {icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right — avatar card */}
        <motion.div variants={fadeUp} className="flex justify-center">
          <GlassCard className="p-6 w-full max-w-sm text-center">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 blur-md opacity-60" />
              <img
                src={data.personal.avatar}
                alt={data.personal.name}
                className="relative w-32 h-32 rounded-full object-cover border-2 border-white/30 mx-auto"
              />
            </div>
            <h2 className="text-white font-bold text-xl mb-1">{data.personal.name}</h2>
            <p className="text-white/60 text-sm mb-4">{data.personal.title}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: `${data.stats.yearsExperience}+`, label: "Years" },
                { value: `${data.stats.projectsCompleted}+`, label: "Projects" },
                { value: `${data.stats.happyClients}+`, label: "Clients" },
              ].map(({ value, label }) => (
                <div key={label} className="p-2 rounded-xl bg-white/10 border border-white/10">
                  <div className="text-white font-black text-lg">{value}</div>
                  <div className="text-white/50 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────
function About() {
  return (
    <section className="relative px-6 py-20">
      <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-purple-500/20 blur-[100px]" />
      <motion.div
        className="max-w-5xl mx-auto"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
          <User size={20} className="text-cyan-400" />
          <h2 className="text-3xl font-black text-white">About Me</h2>
        </motion.div>

        <motion.div variants={fadeUp}>
          <GlassCard className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-white/70 leading-relaxed text-base mb-4">{data.personal.bio}</p>
                <p className="text-white/50 text-sm flex items-center gap-2">
                  <MapPin size={14} className="text-cyan-400" />
                  {data.personal.location}
                </p>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Email", value: data.socials.email, icon: <Mail size={14} /> },
                  { label: "GitHub", value: data.socials.github, icon: <Github size={14} /> },
                  { label: "Website", value: data.socials.website, icon: <Globe size={14} /> },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-cyan-400">{icon}</span>
                    <div>
                      <div className="text-white/40 text-xs">{label}</div>
                      <div className="text-white/80 text-sm">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Skills ──────────────────────────────────────────────────────────────────
function Skills() {
  const categories = [...new Set(data.skills.map((s) => s.category))];

  return (
    <section className="relative px-6 py-20">
      <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-cyan-500/20 blur-[100px]" />
      <motion.div
        className="max-w-5xl mx-auto"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
          <Code2 size={20} className="text-cyan-400" />
          <h2 className="text-3xl font-black text-white">Skills</h2>
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <GlassCard key={cat} className="p-5">
              <h3 className="text-white/50 text-xs uppercase tracking-widest mb-4">{cat}</h3>
              <div className="space-y-3">
                {data.skills
                  .filter((s) => s.category === cat)
                  .map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">{skill.name}</span>
                        <span className="text-cyan-400">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Projects ────────────────────────────────────────────────────────────────
function Projects() {
  return (
    <section className="relative px-6 py-20">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-pink-500/20 blur-[100px]" />
      <motion.div
        className="max-w-5xl mx-auto"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
          <Star size={20} className="text-cyan-400" />
          <h2 className="text-3xl font-black text-white">Projects</h2>
        </motion.div>

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data.projects || []).map((project, index) => (
            <motion.div key={index} variants={fadeUp}>
              <GlassCard className="overflow-hidden h-full flex flex-col">
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {project.featured && (
                    <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-medium backdrop-blur-sm">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">{project.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-white/60 text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                      <ExternalLink size={13} /> Live
                    </a>
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors">
                      <Github size={13} /> Code
                    </a>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────
function Experience() {
  return (
    <section className="relative px-6 py-20">
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-purple-500/20 blur-[100px]" />
      <motion.div
        className="max-w-5xl mx-auto"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
          <Briefcase size={20} className="text-cyan-400" />
          <h2 className="text-3xl font-black text-white">Experience</h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10 hidden md:block" />

          <motion.div variants={stagger} className="space-y-6">
            {(data.experience || []).map((exp, index) => (
              <motion.div key={index} variants={fadeUp} className="md:pl-12 relative">
                {/* Dot */}
                <div className="absolute left-2.5 top-6 w-3 h-3 rounded-full bg-cyan-400 border-2 border-white/20 hidden md:block" />
                <GlassCard className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-white font-bold text-lg">{exp.role}</h3>
                      <p className="text-cyan-400 text-sm">{exp.company}</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-white/50 text-xs whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed mb-3">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(exp.techStack || []).map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="relative px-6 py-20">
      <div className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full bg-cyan-500/20 blur-[100px]" />
      <motion.div
        className="max-w-5xl mx-auto"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
          <MessageSquare size={20} className="text-cyan-400" />
          <h2 className="text-3xl font-black text-white">Testimonials</h2>
        </motion.div>

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(data.testimonials || []).map((t, index) => (
            <motion.div key={index} variants={fadeUp}>
              <GlassCard className="p-6 h-full flex flex-col">
                <div className="text-cyan-400 text-3xl mb-3">"</div>
                <p className="text-white/70 text-sm leading-relaxed flex-1 mb-4">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.role}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section className="relative px-6 py-20">
      <div className="absolute top-0 left-1/2 w-72 h-72 rounded-full bg-purple-500/20 blur-[100px]" />
      <motion.div
        className="max-w-3xl mx-auto text-center"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-4">
          <Phone size={20} className="text-cyan-400" />
          <h2 className="text-3xl font-black text-white">Get In Touch</h2>
        </motion.div>
        <motion.p variants={fadeUp} className="text-white/60 mb-10">
          Have a project in mind? Let's build something amazing together.
        </motion.p>

        <motion.div variants={fadeUp}>
          <GlassCard className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* FIX 4: Added accessible labels to all form inputs */}
              <div>
                <label htmlFor="contact-name" className="sr-only">Your Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/60 backdrop-blur-sm transition-all"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="sr-only">Your Email</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/60 backdrop-blur-sm transition-all"
                />
              </div>
            </div>
            <label htmlFor="contact-subject" className="sr-only">Subject</label>
            <input
              id="contact-subject"
              type="text"
              placeholder="Subject"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/60 backdrop-blur-sm transition-all mb-4"
            />
            <label htmlFor="contact-message" className="sr-only">Your Message</label>
            <textarea
              id="contact-message"
              rows={4}
              placeholder="Your Message"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-cyan-400/60 backdrop-blur-sm transition-all mb-4 resize-none"
            />
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500/40 to-purple-500/40 hover:from-cyan-500/60 hover:to-purple-500/60 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all">
              Send Message
            </button>
          </GlassCard>
        </motion.div>

        {/* Social footer */}
        <motion.div variants={fadeUp} className="flex justify-center gap-4 mt-8">
          {[
            { icon: <Github size={18} />, href: data.socials.github, label: "GitHub" },
            { icon: <Linkedin size={18} />, href: data.socials.linkedin, label: "LinkedIn" },
            { icon: <Twitter size={18} />, href: data.socials.twitter, label: "Twitter" },
            { icon: <Mail size={18} />, href: `mailto:${data.socials.email}`, label: "Email" },
          ].map(({ icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white/60 hover:text-white transition-all"
            >
              {icon}
            </a>
          ))}
        </motion.div>

        {/* FIX 5: Dynamic copyright year instead of hardcoded 2025 */}
        <p className="text-white/30 text-xs mt-6">
          © {new Date().getFullYear()} {data.personal.name}. All rights reserved.
        </p>
      </motion.div>
    </section>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function LiquidGlass() {
  return (
    <div className="min-h-screen bg-[#060918] relative overflow-hidden">
      {/* Global ambient blobs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-600/20 blur-[150px] pointer-events-none" />

      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
    </div>
  );
}