import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Briefcase,
  Code2,
  Github,
  Globe,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Quote,
  Send,
  Sparkles,
  Star,
  Twitter,
  UserRound
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

function BentoCard({ children, className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_25px_60px_-35px_rgba(0,0,0,0.8)] ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-70" />
      <div className="relative h-full p-6 md:p-8">{children}</div>
    </div>
  );
}

export default function BentoBox() {
  const { personal, socials, skills, projects, experience, testimonials, stats } = data;
  const primarySkills = skills.slice(0, 6);
  const secondarySkills = skills.slice(6, 14);
  const featuredProjects = projects.filter((project) => project.featured);
  const nonFeaturedProjects = projects.filter((project) => !project.featured);

  const socialLinks = [
    { label: 'GitHub', href: socials.github, icon: Github },
    { label: 'LinkedIn', href: socials.linkedin, icon: Linkedin },
    { label: 'Twitter', href: socials.twitter, icon: Twitter },
    { label: 'Website', href: socials.website, icon: Globe },
    { label: 'Email', href: `mailto:${socials.email}`, icon: Mail }
  ].filter((link) => link.href);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/30 blur-[140px]" />
        <div className="absolute -bottom-32 right-10 h-96 w-96 rounded-full bg-fuchsia-500/30 blur-[160px]" />
        <div className="absolute left-10 top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-14 md:px-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200">
              <Sparkles className="h-3 w-3" />
              Glass / Modern UI
            </p>
            <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl lg:text-6xl font-['Space_Grotesk']">
              {personal.name}
            </h1>
            <p className="mt-3 text-lg text-slate-300 sm:text-xl">{personal.title}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/80 transition hover:border-white/30 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </a>
              );
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 xl:col-span-4"
          >
            <BentoCard className="h-full">
              <div className="flex h-full flex-col justify-between gap-8">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
                    <MapPin className="h-4 w-4" />
                    {personal.location}
                  </p>
                  <h2 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">
                    {personal.shortBio}
                  </h2>
                  <p className="mt-4 max-w-xl text-base text-slate-300 sm:text-lg">
                    {personal.bio}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={personal.resumeUrl}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-200"
                  >
                    View Resume
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/80">
                    <Star className="h-4 w-4 text-cyan-300" />
                    {personal.availability}
                  </span>
                </div>
              </div>
            </BentoCard>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="md:col-span-1 xl:col-span-2"
          >
            <BentoCard className="h-full">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={personal.avatar}
                    alt={personal.name}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-white/60">About</p>
                    <p className="mt-2 text-lg font-semibold text-white">{personal.name}</p>
                    <p className="text-sm text-slate-400">{personal.title}</p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2 text-center sm:gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-2 py-3 overflow-hidden sm:px-3 sm:py-4">
                    <p className="text-xl font-semibold text-white sm:text-2xl">{stats.yearsExperience}</p>
                    <p className="text-[9px] uppercase tracking-[0.05em] text-white/60 sm:text-[11px] sm:tracking-[0.08em] whitespace-nowrap">Years</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-2 py-3 overflow-hidden sm:px-3 sm:py-4">
                    <p className="text-xl font-semibold text-white sm:text-2xl">{stats.projectsCompleted}</p>
                    <p className="text-[9px] uppercase tracking-[0.05em] text-white/60 sm:text-[11px] sm:tracking-[0.08em] whitespace-nowrap">Projects</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-2 py-3 overflow-hidden sm:px-3 sm:py-4">
                    <p className="text-xl font-semibold text-white sm:text-2xl">{stats.happyClients}</p>
                    <p className="text-[9px] uppercase tracking-[0.05em] text-white/60 sm:text-[11px] sm:tracking-[0.08em] whitespace-nowrap">Clients</p>
                  </div>
                </div>
              </div>
            </BentoCard>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 xl:col-span-2"
          >
            <BentoCard className="h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Skills</p>
                  <h3 className="mt-2 text-2xl font-semibold">Capability Map</h3>
                </div>
                <Layers className="h-8 w-8 text-cyan-300" />
              </div>
              <div className="mt-6 space-y-4">
                {primarySkills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-white">{skill.name}</span>
                      <span className="text-white/60">{skill.level}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-400"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-2 xl:col-span-4"
          >
            <BentoCard className="h-full">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Skill Tags</p>
                  <h3 className="mt-2 text-2xl font-semibold">Toolbox</h3>
                </div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                  <Code2 className="h-4 w-4" />
                  Multi-disciplinary
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {secondarySkills.map((skill) => (
                  <span
                    key={skill.name}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </BentoCard>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 xl:col-span-4"
          >
            <BentoCard className="h-full">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Projects</p>
                  <h3 className="mt-2 text-2xl font-semibold">Selected Work</h3>
                </div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                  <Sparkles className="h-4 w-4" />
                  {projects.length} Projects
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {featuredProjects.map((project) => (
                  <div
                    key={project.title}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">
                        Featured
                      </span>
                    </div>
                    <div className="flex h-full flex-col gap-3 p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-white">{project.title}</h4>
                        <a
                          href={project.liveUrl}
                          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200"
                        >
                          Visit
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </div>
                      <p className="text-sm text-slate-300">{project.description}</p>
                      <div className="mt-auto flex flex-wrap gap-2">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/50">
                        <a href={project.githubUrl} className="flex items-center gap-1 hover:text-white">
                          <Github className="h-3 w-3" />
                          Code
                        </a>
                        <span>{project.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {nonFeaturedProjects.map((project) => (
                  <a
                    key={project.title}
                    href={project.liveUrl}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
                  >
                    <span>{project.title}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </BentoCard>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="md:col-span-1 xl:col-span-2"
          >
            <BentoCard className="h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Experience</p>
                  <h3 className="mt-2 text-2xl font-semibold">Timeline</h3>
                </div>
                <Briefcase className="h-7 w-7 text-cyan-300" />
              </div>
              <div className="mt-6 space-y-6">
                {experience.map((role) => (
                  <div key={role.role} className="border-l border-white/10 pl-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">{role.period}</p>
                    <p className="mt-2 text-base font-semibold text-white">{role.role}</p>
                    <p className="text-sm text-slate-400">{role.company}</p>
                    <p className="mt-2 text-sm text-slate-300">{role.description}</p>
                  </div>
                ))}
              </div>
            </BentoCard>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 xl:col-span-3"
          >
            <BentoCard className="h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Testimonials</p>
                  <h3 className="mt-2 text-2xl font-semibold">People Say</h3>
                </div>
                <Quote className="h-7 w-7 text-cyan-300" />
              </div>
              <div className="mt-6 space-y-4">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-200">"{testimonial.text}"</p>
                    <div className="mt-4 flex items-center gap-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                        <p className="text-xs text-white/60">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </BentoCard>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="md:col-span-2 xl:col-span-3"
          >
            <BentoCard className="h-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Contact</p>
                  <h3 className="mt-2 text-2xl font-semibold">Let's Build Something</h3>
                </div>
                <UserRound className="h-7 w-7 text-cyan-300" />
              </div>
              <form className="mt-6 grid gap-4" onSubmit={(event) => event.preventDefault()}>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none"
                />
                <textarea
                  rows={4}
                  placeholder="Tell me about your project"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-200"
                >
                  Send Message
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
                <Mail className="h-4 w-4" />
                {socials.email}
              </div>
            </BentoCard>
          </motion.div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/60">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Crafted with modern glassmorphism and bento layout.
          </span>
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {socials.email}
          </span>
        </div>
      </div>
    </div>
  );
}
