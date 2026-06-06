import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import data from "../../../../data/dummy_data.json";

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 18 } },
};

const floatMotion = {
  animate: {
    y: [0, -18, 0],
    x: [0, 10, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function SpringBounce() {
  const skillCategories = data.skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="relative overflow-hidden bg-[#effaf0] text-slate-900 font-sans">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-16 top-24 h-52 w-52 rounded-full bg-emerald-200/40 blur-3xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          {...floatMotion}
        />
        <motion.div
          className="absolute right-0 top-0 h-64 w-64 rounded-full bg-lime-200/30 blur-3xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.2, ease: "easeOut" }}
          {...floatMotion}
        />
        <motion.div
          className="absolute left-1/2 top-[40rem] h-72 w-72 -translate-x-1/2 rounded-full bg-green-100/40 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.4 }}
          {...floatMotion}
        />
      </div>

      <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-12 lg:px-8">
        <motion.section
          className="relative rounded-[2rem] border border-emerald-200/50 bg-white/90 p-6 shadow-[0_25px_80px_rgba(34,197,94,0.15)] backdrop-blur-xl md:p-10"
          initial="hidden"
          animate="show"
          variants={staggerContainer}
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <motion.span variants={fadeUp} className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm shadow-emerald-100/80">
                <Sparkles className="h-4 w-4" /> Spring Bounce Portfolio
              </motion.span>
              <motion.div variants={fadeUp} className="space-y-4">
                <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
                  {data.personal.name}
                </h1>
                <p className="max-w-2xl text-lg text-slate-700 sm:text-xl">
                  {data.personal.title} — {data.personal.tagline}
                </p>
              </motion.div>
              <motion.p variants={fadeUp} className="max-w-2xl text-base leading-8 text-slate-600">
                {data.personal.bio}
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <a href="#projects" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition duration-200 hover:-translate-y-1 hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200">
                  Explore Projects
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100">
                  Contact Me
                  <Mail className="h-4 w-4" />
                </a>
              </motion.div>
            </div>

            <motion.div variants={fadeUp} className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-6 shadow-2xl shadow-emerald-200/40">
              <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-emerald-200/50 blur-2xl" />
              <div className="absolute -right-10 bottom-14 h-24 w-24 rounded-full bg-lime-200/60 blur-2xl" />
              <div className="flex flex-col items-center gap-5 text-center">
                <img src={data.personal.avatar} alt={data.personal.name} className="h-40 w-40 rounded-full border-4 border-white object-cover shadow-xl shadow-emerald-200/40" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Premium Creator</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-950">{data.personal.name}</h2>
                  <p className="mt-2 text-sm text-slate-600">{data.personal.location}</p>
                </div>
                <div className="grid w-full gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl bg-white/85 p-4 text-left shadow-sm shadow-slate-200/70">
                    <p className="text-3xl font-semibold text-slate-900">{data.stats.yearsExperience}+</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">Years</p>
                  </div>
                  <div className="rounded-3xl bg-white/85 p-4 text-left shadow-sm shadow-slate-200/70">
                    <p className="text-3xl font-semibold text-slate-900">{data.stats.projectsCompleted}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">Projects</p>
                  </div>
                  <div className="rounded-3xl bg-white/85 p-4 text-left shadow-sm shadow-slate-200/70">
                    <p className="text-3xl font-semibold text-slate-900">{data.stats.happyClients}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">Clients</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <section className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer} className="space-y-8">
            <motion.div variants={fadeUp} className="rounded-[2rem] border border-emerald-100 bg-white/90 p-8 shadow-[0_25px_80px_rgba(34,197,94,0.12)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">About</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">Modern, playful, premium presence</h2>
                </div>
                <Sparkles className="h-8 w-8 text-emerald-400" />
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl bg-emerald-50 p-6 shadow-sm shadow-emerald-100/80">
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">Bio</p>
                  <p className="mt-4 leading-7 text-slate-600">{data.personal.bio}</p>
                </div>
                <div className="rounded-3xl bg-emerald-50 p-6 shadow-sm shadow-emerald-100/80">
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">Location</p>
                  <p className="mt-4 text-lg font-semibold text-slate-900">{data.personal.location}</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-[2rem] border border-emerald-100 bg-white/90 p-8 shadow-[0_25px_80px_rgba(34,197,94,0.12)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Skills</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">Crafted with energy and clarity</h2>
                </div>
                <div className="rounded-3xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">{data.skills.length} skills</div>
              </div>
              <div className="mt-8 space-y-8">
                {Object.entries(skillCategories).map(([category, skills]) => (
                  <div key={category} className="space-y-4 rounded-3xl bg-emerald-50 p-6 shadow-sm shadow-emerald-100/80">
                    <h3 className="text-lg font-semibold text-slate-900">{category}</h3>
                    <div className="space-y-4">
                      {skills.map((skill) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -24 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.4 }}
                          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
                        >
                          <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                            <span>{skill.name}</span>
                            <span>{skill.level}%</span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-400"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true, amount: 0.4 }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} variants={staggerContainer} className="space-y-8">
            <motion.div variants={fadeUp} className="rounded-[2rem] border border-emerald-100 bg-white/90 p-8 shadow-[0_25px_80px_rgba(34,197,94,0.12)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Stats</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">Impact in numbers</h2>
                </div>
                <div className="rounded-3xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">Focused & measurable</div>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                <div className="rounded-[1.75rem] bg-emerald-50 p-6 shadow-sm shadow-emerald-100/70 transition-transform duration-200 hover:-translate-y-1">
                  <p className="text-4xl font-semibold text-slate-950">{data.stats.yearsExperience}+</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.24em] text-emerald-700">Years Experience</p>
                </div>
                <div className="rounded-[1.75rem] bg-emerald-50 p-6 shadow-sm shadow-emerald-100/70 transition-transform duration-200 hover:-translate-y-1">
                  <p className="text-4xl font-semibold text-slate-950">{data.stats.projectsCompleted}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.24em] text-emerald-700">Projects Completed</p>
                </div>
                <div className="rounded-[1.75rem] bg-emerald-50 p-6 shadow-sm shadow-emerald-100/70 transition-transform duration-200 hover:-translate-y-1">
                  <p className="text-4xl font-semibold text-slate-950">{data.stats.happyClients}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.24em] text-emerald-700">Happy Clients</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-[2rem] border border-emerald-100 bg-white/90 p-8 shadow-[0_25px_80px_rgba(34,197,94,0.12)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Testimonials</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">Trusted by leaders</h2>
                </div>
                <ExternalLink className="h-8 w-8 text-emerald-400" />
              </div>
              <div className="mt-8 grid gap-6">
                {data.testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 110, damping: 18 }}
                    className="rounded-[1.75rem] border border-slate-100 bg-emerald-50/80 p-6 shadow-sm shadow-emerald-100/60"
                  >
                    <div className="flex items-center gap-4">
                      <img src={testimonial.avatar} alt={testimonial.name} className="h-14 w-14 rounded-full object-cover shadow-inner shadow-slate-200/60" />
                      <div>
                        <p className="font-semibold text-slate-950">{testimonial.name}</p>
                        <p className="text-sm text-slate-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="mt-5 text-slate-700">“{testimonial.text}”</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section id="projects" className="mt-16 space-y-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Projects</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Selected creative systems</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">Browse animated, enterprise-ready work with polished interactions, crisp design, and lightweight motion that feels premium on every screen.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {data.projects.map((project, index) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: index * 0.08, type: "spring", stiffness: 120, damping: 18 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_20px_70px_rgba(34,197,94,0.1)]"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">Featured</p>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">{project.techStack[0]}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-slate-950">{project.title}</h3>
                    <p className="text-sm leading-7 text-slate-600">{project.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{tech}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white">
                      <Github className="h-4 w-4" /> GitHub
                    </a>
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:-translate-y-1 hover:bg-emerald-600">
                      <ExternalLink className="h-4 w-4" /> Live Demo
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-emerald-100 bg-white/90 p-8 shadow-[0_25px_80px_rgba(34,197,94,0.12)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Experience</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Timeline of growth</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">A polished career story built on leadership, collaboration, and products designed for scale.</p>
          </div>

          <div className="mt-10 space-y-8">
            {data.experience.map((item, index) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, x: index % 2 === 0 ? -32 : 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 120, damping: 16 }}
                className="relative rounded-[2rem] border border-slate-100 bg-emerald-50/70 p-8 shadow-sm shadow-emerald-100/60"
              >
                <div className="absolute left-5 top-5 h-12 w-12 rounded-full bg-emerald-100/90 shadow-md" />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">{item.company}</p>
                    <h3 className="text-xl font-semibold text-slate-950">{item.role}</h3>
                  </div>
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/50">{item.period}</span>
                </div>
                <p className="mt-5 leading-7 text-slate-700">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-16 rounded-[2rem] border border-emerald-100 bg-emerald-50/80 p-8 shadow-[0_25px_80px_rgba(34,197,94,0.14)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Contact</p>
              <h2 className="text-3xl font-semibold text-slate-950">Let’s build something that feels alive.</h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-700">Reach out for product design systems, interactive experiences, or a premium developer partnership that keeps momentum moving forward.</p>
            </div>
            <div className="space-y-4 rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-100/60">
              <a href={data.socials.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:bg-emerald-50">
                <Github className="h-5 w-5 text-slate-900" />
                <span className="text-sm font-semibold text-slate-900">GitHub</span>
              </a>
              <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:bg-emerald-50">
                <Linkedin className="h-5 w-5 text-slate-900" />
                <span className="text-sm font-semibold text-slate-900">LinkedIn</span>
              </a>
              <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:bg-emerald-50">
                <Sparkles className="h-5 w-5 text-slate-900" />
                <span className="text-sm font-semibold text-slate-900">Twitter</span>
              </a>
              <a href={`mailto:${data.socials.email}`} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 transition hover:bg-emerald-50">
                <Mail className="h-5 w-5 text-slate-900" />
                <span className="text-sm font-semibold text-slate-900">Email</span>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
