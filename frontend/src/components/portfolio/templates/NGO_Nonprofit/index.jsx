import { motion } from "framer-motion";
import { Heart, Users, Globe, Mail, MapPin, Github, Linkedin, Twitter, ExternalLink, Award, Calendar, TrendingUp, HandHeart, Target, Star } from "lucide-react";
import data from "../../../../data/dummy_data.json";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};

const Section = ({ id, className = "", children }) => (
  <section id={id} className={`py-20 px-4 md:px-8 lg:px-16 ${className}`}>{children}</section>
);

const SectionTitle = ({ icon: Icon, title, subtitle, light = false }) => (
  <div className="text-center mb-14">
    <div className="flex items-center justify-center gap-2 mb-3">
      {Icon && <Icon size={28} className={light ? "text-amber-300" : "text-amber-600"} />}
      <h2 className={`text-3xl md:text-4xl font-bold ${light ? "text-white" : "text-stone-800"}`}>{title}</h2>
    </div>
    {subtitle && <p className={`mt-3 text-lg max-w-2xl mx-auto ${light ? "text-amber-100" : "text-stone-500"}`}>{subtitle}</p>}
    <div className={`mx-auto mt-4 h-1 w-20 rounded-full ${light ? "bg-amber-300" : "bg-amber-500"}`} />
  </div>
);

const Hero = () => {
  const { personal, socials, stats } = data;
  const impactStats = [
    { label: "Years of Impact", value: stats?.yearsExperience ?? 8, icon: Calendar },
    { label: "Projects Completed", value: stats?.projectsCompleted ?? 120, icon: Target },
    { label: "Lives Touched", value: stats?.happyClients ?? 5000, icon: Heart },
  ];
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-amber-800 via-amber-700 to-orange-600">
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-900 opacity-30 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-400 opacity-20 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-24 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 120, delay: 0.2 }} className="mx-auto mb-6 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-amber-300 overflow-hidden shadow-2xl">
          {personal?.avatar ? (
            <img src={personal.avatar} alt={personal.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-amber-200 flex items-center justify-center">
              <HandHeart size={56} className="text-amber-700" />
            </div>
          )}
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="inline-flex items-center gap-2 bg-amber-900/50 text-amber-200 text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-amber-500/40">
          <Heart size={14} className="text-rose-300" fill="currentColor" />
          Nonprofit and Social Impact Professional
        </motion.div>
        <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={2} className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4">
          {personal?.name ?? "Your Name"}
        </motion.h1>
        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={3} className="text-xl md:text-2xl text-amber-200 mb-6">
          {personal?.title ?? "NGO Leader and Community Builder"}
        </motion.p>
        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={4} className="max-w-2xl mx-auto text-amber-100/90 text-lg leading-relaxed mb-8">
          {personal?.bio ?? "Dedicated to creating lasting change through community-driven initiatives."}
        </motion.p>
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} className="flex flex-wrap justify-center gap-4 mb-14">
          <a href="#contact" className="bg-white text-amber-800 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-amber-50 transition-all duration-300 flex items-center gap-2">
            <HandHeart size={18} /> Get Involved
          </a>
          <a href="#projects" className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
            <Globe size={18} /> Our Work
          </a>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {impactStats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <Icon size={28} className="text-amber-300 mx-auto mb-2" />
              <p className="text-4xl font-extrabold text-white">{value.toLocaleString()}+</p>
              <p className="text-amber-200 text-sm mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7} className="flex justify-center gap-5 mt-10">
          {socials?.github && <a href={socials.github} target="_blank" rel="noreferrer" className="text-amber-200 hover:text-white transition-colors"><Github size={22} /></a>}
          {socials?.linkedin && <a href={socials.linkedin} target="_blank" rel="noreferrer" className="text-amber-200 hover:text-white transition-colors"><Linkedin size={22} /></a>}
          {socials?.twitter && <a href={socials.twitter} target="_blank" rel="noreferrer" className="text-amber-200 hover:text-white transition-colors"><Twitter size={22} /></a>}
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path fill="#fafaf9" d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
};

const About = () => {
  const { personal } = data;
  return (
    <Section id="about" className="bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <SectionTitle icon={Users} title="About Me" subtitle="Driven by purpose, guided by compassion" />
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-square max-w-sm mx-auto">
              {personal?.avatar ? (
                <img src={personal.avatar} alt={personal.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                  <HandHeart size={80} className="text-amber-500" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-800/80 to-transparent p-6">
                <p className="text-white font-bold text-lg">{personal?.name}</p>
                <p className="text-amber-200 text-sm">{personal?.location}</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <h3 className="text-2xl font-bold text-stone-800 mb-4">{personal?.title}</h3>
            <p className="text-stone-600 leading-relaxed text-lg mb-6">{personal?.bio}</p>
            <div className="flex items-center gap-2 text-stone-500 mb-3">
              <MapPin size={18} className="text-amber-600" />
              <span>{personal?.location}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-500">
              <Mail size={18} className="text-amber-600" />
              <span>{data.socials?.email}</span>
            </div>
            <div className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-200">
              <p className="text-amber-800 font-semibold text-sm flex items-center gap-2">
                <Heart size={16} fill="currentColor" className="text-rose-500" /> Mission Statement
              </p>
              <p className="text-stone-600 mt-2 italic">Every action, no matter how small, contributes to a larger wave of change.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

const Skills = () => {
  const { skills } = data;
  const categories = [...new Set(skills?.map((s) => s.category) ?? [])];
  return (
    <Section id="skills" className="bg-white">
      <div className="max-w-5xl mx-auto">
        <SectionTitle icon={TrendingUp} title="Skills and Expertise" subtitle="Capabilities that drive meaningful impact" />
        {categories.map((cat) => (
          <div key={cat} className="mb-10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-5">{cat}</h3>
            <div className="space-y-4">
              {skills.filter((s) => s.category === cat).map((skill, i) => (
                <motion.div key={skill.name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-stone-700 font-medium">{skill.name}</span>
                    <span className="text-amber-600 font-semibold">{skill.level}%</span>
                  </div>
                  <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut", delay: i * 0.05 }} className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

const Projects = () => {
  const { projects } = data;
  return (
    <Section id="projects" className="bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <SectionTitle icon={Globe} title="Our Initiatives" subtitle="Programs and projects that create lasting change" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project, i) => (
            <motion.div key={project.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
              {project.image && (
                <div className="h-48 overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-stone-800 mb-2">{project.title}</h3>
                <p className="text-stone-500 text-sm flex-grow mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack?.map((tech) => (
                    <span key={tech} className="bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full font-medium border border-amber-200">{tech}</span>
                  ))}
                </div>
                <div className="flex gap-3 pt-3 border-t border-stone-100">
                  {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-amber-600 hover:text-amber-800 text-sm font-medium"><ExternalLink size={14} /> Live</a>}
                  {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-sm font-medium"><Github size={14} /> Source</a>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const Experience = () => {
  const { experience } = data;
  return (
    <Section id="experience" className="bg-amber-800">
      <div className="max-w-4xl mx-auto">
        <SectionTitle icon={Award} title="Journey and Experience" subtitle="A timeline of impact and growth" light />
        <div className="relative pl-8 border-l-2 border-amber-500 space-y-10">
          {experience?.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="relative">
              <span className="absolute -left-[2.35rem] top-1.5 w-5 h-5 bg-amber-400 border-4 border-amber-800 rounded-full" />
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                  <span className="text-amber-300 text-sm bg-amber-900/50 px-3 py-1 rounded-full flex items-center gap-1">
                    <Calendar size={12} /> {exp.period}
                  </span>
                </div>
                <p className="text-amber-200 font-medium mb-3">{exp.company}</p>
                <p className="text-amber-100/80 text-sm leading-relaxed">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const Testimonials = () => {
  const { testimonials } = data;
  return (
    <Section id="testimonials" className="bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <SectionTitle icon={Star} title="Volunteer Stories" subtitle="Voices from our community" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials?.map((t, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="bg-white rounded-3xl p-7 shadow-md hover:shadow-xl transition-shadow border border-stone-100 flex flex-col">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-amber-400" fill="currentColor" />)}
              </div>
              <p className="text-stone-600 italic flex-grow mb-6">{t.text}</p>
              <div className="flex items-center gap-4 pt-4 border-t border-stone-100">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center">
                    <Users size={20} className="text-amber-600" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-stone-800 text-sm">{t.name}</p>
                  <p className="text-stone-400 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const Contact = () => {
  const { socials, personal } = data;
  return (
    <Section id="contact" className="bg-gradient-to-br from-amber-900 to-orange-800">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Heart size={48} className="text-rose-300 mx-auto mb-4" fill="currentColor" />
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Join Our Mission</h2>
          <p className="text-amber-100 text-lg max-w-xl mx-auto mb-8">Whether you want to volunteer, donate, or collaborate, every bit of support creates change.</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8">
            <p className="text-amber-200 text-sm font-semibold uppercase tracking-widest mb-3">Make a Difference Today</p>
            <a href={`mailto:${socials?.email}`} className="inline-block bg-white text-amber-800 font-extrabold px-10 py-4 rounded-full text-lg shadow-2xl hover:bg-amber-50 transition-all duration-300">Get Involved</a>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
            {socials?.email && <a href={`mailto:${socials.email}`} className="flex items-center gap-2 text-amber-200 hover:text-white transition-colors"><Mail size={18} />{socials.email}</a>}
            {personal?.location && <span className="flex items-center gap-2 text-amber-200"><MapPin size={18} />{personal.location}</span>}
          </div>
          <div className="flex justify-center gap-6">
            {socials?.github && <a href={socials.github} target="_blank" rel="noreferrer" className="text-amber-200 hover:text-white text-sm flex items-center gap-1.5 transition-colors"><Github size={18} />GitHub</a>}
            {socials?.linkedin && <a href={socials.linkedin} target="_blank" rel="noreferrer" className="text-amber-200 hover:text-white text-sm flex items-center gap-1.5 transition-colors"><Linkedin size={18} />LinkedIn</a>}
            {socials?.twitter && <a href={socials.twitter} target="_blank" rel="noreferrer" className="text-amber-200 hover:text-white text-sm flex items-center gap-1.5 transition-colors"><Twitter size={18} />Twitter</a>}
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
const NGO_Nonprofit = () => {
  return (
    <div className="font-sans antialiased bg-stone-50 text-stone-800">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-amber-800/90 backdrop-blur-md shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <HandHeart size={22} className="text-amber-300" />
            {data.personal?.name?.split(" ")[0] ?? "NGO"}
          </div>
          <div className="hidden md:flex items-center gap-6 text-amber-200 text-sm font-medium">
            {["about", "skills", "projects", "experience", "testimonials", "contact"].map((s) => (
              <a key={s} href={`#${s}`} className="hover:text-white capitalize transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </nav>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Testimonials />
      <Contact />
      <footer className="bg-stone-900 py-6 text-center text-stone-400 text-sm">
        <p className="flex items-center justify-center gap-1.5">
          Made with <Heart size={14} className="text-rose-400" fill="currentColor" /> by <span className="text-white font-medium">{data.personal?.name}</span>
        </p>
      </footer>
    </div>
  );
};

export default NGO_Nonprofit;
