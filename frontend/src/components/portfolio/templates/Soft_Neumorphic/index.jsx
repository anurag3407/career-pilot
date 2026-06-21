import { usePortfolio } from "../../../../context/PortfolioContext";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  ExternalLink,
  Briefcase,
  Code2,
  Star,
  Send,
  ChevronDown,
  Award,
  Users,
  Layers,
} from "lucide-react";

const neu = {
  raised: "bg-[#e0e5ec] shadow-[6px_6px_14px_#b8bec7,-6px_-6px_14px_#ffffff] rounded-2xl",
  raisedSm: "bg-[#e0e5ec] shadow-[4px_4px_10px_#b8bec7,-4px_-4px_10px_#ffffff] rounded-xl",
  inset: "bg-[#e0e5ec] shadow-[inset_4px_4px_10px_#b8bec7,inset_-4px_-4px_10px_#ffffff] rounded-xl",
  insetSm: "bg-[#e0e5ec] shadow-[inset_3px_3px_7px_#b8bec7,inset_-3px_-3px_7px_#ffffff] rounded-lg",
  circle: "bg-[#e0e5ec] shadow-[6px_6px_14px_#b8bec7,-6px_-6px_14px_#ffffff] rounded-full",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" },
});

const iconMap = { Award, Code2, Star, Layers, Users, Briefcase };

const SectionHeading = ({ icon: Icon, title, subtitle }) => (
  <motion.div className="text-center mb-14" {...fadeUp()}>
    <div className={`inline-flex items-center gap-3 px-6 py-3 ${neu.raisedSm} mb-4`}>
      <Icon size={20} className="text-indigo-400" />
      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400">{title}</span>
    </div>
    {subtitle && (
      <h2 className="text-3xl md:text-4xl font-bold text-gray-600 mt-3 font-serif">{subtitle}</h2>
    )}
  </motion.div>
);

const Hero = () => {
  const { portfolioData: data } = usePortfolio();

  const { personal, socials, stats } = data;
  const socialLinks = [
    { icon: Github, href: socials.github, label: "GitHub" },
    { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: socials.twitter, label: "Twitter" },
    { icon: Mail, href: `mailto:${socials.email}`, label: "Email" },
  ];
  const statItems = [
    { label: "Years Exp.", value: stats.yearsExperience + "+" },
    { label: "Projects", value: stats.projectsCompleted + "+" },
    { label: "Clients", value: stats.happyClients + "+" },
  ];

  return (
    <section className="min-h-screen bg-[#e0e5ec] flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-indigo-100 opacity-40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-purple-100 opacity-30 blur-3xl pointer-events-none" />
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center z-10">
        <div>
          <motion.div className={`inline-flex items-center gap-2 px-4 py-2 ${neu.raisedSm} mb-6`} {...fadeUp(0)}>
            <MapPin size={14} className="text-indigo-400" />
            <span className="text-xs text-gray-500">{personal.location}</span>
          </motion.div>
          <motion.h1 className="text-5xl md:text-6xl font-bold text-gray-600 font-serif leading-tight mb-4" {...fadeUp(0.1)}>
            {personal.name}
          </motion.h1>
          <motion.p className="text-lg text-indigo-400 font-medium mb-6" {...fadeUp(0.2)}>
            {personal.title}
          </motion.p>
          <motion.p className="text-gray-500 leading-relaxed mb-8 max-w-md" {...fadeUp(0.3)}>
            {personal.tagline}
          </motion.p>
          <motion.div className="flex gap-4 mb-10" {...fadeUp(0.4)}>
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                className={`w-12 h-12 flex items-center justify-center ${neu.circle} text-gray-500 hover:text-indigo-400 transition-colors duration-200`}>
                <Icon size={18} />
              </a>
            ))}
          </motion.div>
          <motion.div className="flex flex-wrap gap-4" {...fadeUp(0.5)}>
            <a href="#projects" className="px-6 py-3 rounded-xl bg-indigo-400 text-white font-semibold shadow-[4px_4px_12px_#9fa8da,-2px_-2px_8px_#ffffff] hover:shadow-[2px_2px_6px_#9fa8da] transition-all duration-200">
              View Projects
            </a>
            <a href="#contact" className={`px-6 py-3 ${neu.raisedSm} text-gray-500 font-semibold hover:text-indigo-400 transition-colors duration-200`}>
              Contact Me
            </a>
          </motion.div>
        </div>
        <motion.div className="flex flex-col items-center gap-8" {...fadeUp(0.2)}>
          <div className={`p-3 ${neu.circle}`}>
            <div className={`p-2 ${neu.circle}`}>
              <img src={personal.avatar} alt={personal.name || "Profile Avatar"} className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full">
            {statItems.map(({ label, value }) => (
              <div key={label} className={`${neu.inset} p-4 text-center`}>
                <p className="text-2xl font-bold text-indigo-400">{value}</p>
                <p className="text-xs text-gray-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400"
        animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
};

const About = () => {
  const { portfolioData: data } = usePortfolio();

  const { personal, stats } = data;
  const capabilities = [
    { iconKey: "Award", label: `${stats.yearsExperience}+ Years Experience` },
    { iconKey: "Code2", label: "Full Stack Dev" },
    { iconKey: "Star", label: "Open Source Lover" },
    { iconKey: "Layers", label: "UI/UX Enthusiast" },
  ];

  return (
    <section id="about" className="bg-[#e0e5ec] py-24 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <SectionHeading icon={Users} title="About Me" subtitle="Who I Am" />
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div {...fadeUp(0.1)}>
            <div className={`${neu.raised} p-6 flex flex-col items-center gap-5`}>
              <img src={personal.avatar} alt={personal.name || "Profile Avatar"} className="w-36 h-36 rounded-full object-cover shadow-[4px_4px_12px_#b8bec7,-4px_-4px_12px_#ffffff]" />
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-600 font-serif">{personal.name}</h3>
                <p className="text-sm text-indigo-400 mt-1">{personal.title}</p>
                <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <MapPin size={12} /> {personal.location}
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.2)} className="space-y-6">
            <div className={`${neu.inset} p-6`}>
              <p className="text-gray-500 leading-relaxed">{personal.bio}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {capabilities.map(({ iconKey, label }) => {
                const Icon = iconMap[iconKey];
                return (
                  <div key={label} className={`${neu.raisedSm} p-4 flex items-center gap-3`}>
                    <div className={`w-9 h-9 flex items-center justify-center ${neu.circle}`}>
                      <Icon size={16} className="text-indigo-400" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">{label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Skills = () => {
  const { portfolioData: data } = usePortfolio();

  const { skills } = data;
  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <section id="skills" className="bg-[#e0e5ec] py-24 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <SectionHeading icon={Code2} title="Skills" subtitle="What I Work With" />
        <div className="space-y-10">
          {categories.map((cat, ci) => (
            <motion.div key={cat} {...fadeUp(ci * 0.1)}>
              <div className={`${neu.raised} p-6`}>
                <h3 className="text-sm font-semibold tracking-widest uppercase text-indigo-400 mb-6">{cat}</h3>
                <div className="space-y-4">
                  {skills.filter((s) => s.category === cat).map((skill, i) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">{skill.name}</span>
                        <span className="text-sm text-gray-400">{skill.level}%</span>
                      </div>
                      <div className={`h-3 ${neu.insetSm} overflow-hidden`}>
                        <motion.div
                          className="h-full rounded-lg bg-gradient-to-r from-indigo-300 to-indigo-500"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const { portfolioData: data } = usePortfolio();

  const { projects } = data;
  return (
    <section id="projects" className="bg-[#e0e5ec] py-24 px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeading icon={Layers} title="Projects" subtitle="Things I've Built" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div key={project.title} {...fadeUp(i * 0.08)} className={`${neu.raised} overflow-hidden flex flex-col group`}>
              <div className="relative overflow-hidden rounded-t-2xl h-44">
                <img src={project.image} alt={project.title || "Project Screenshot"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#e0e5ec]/80 to-transparent" />
              </div>
              <div className="p-5 flex flex-col flex-1 gap-3">
                <h3 className="font-bold text-gray-600 text-lg font-serif">{project.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className={`text-xs px-3 py-1 ${neu.insetSm} text-indigo-400 font-medium`}>{tech}</span>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <a href={project.liveUrl} target="_blank" rel="noreferrer"
                    className={`flex items-center gap-1 text-xs px-3 py-2 ${neu.raisedSm} text-gray-500 hover:text-indigo-400 transition-colors`}>
                    <ExternalLink size={12} /> Live
                  </a>
                  <a href={project.githubUrl} target="_blank" rel="noreferrer"
                    className={`flex items-center gap-1 text-xs px-3 py-2 ${neu.raisedSm} text-gray-500 hover:text-indigo-400 transition-colors`}>
                    <Github size={12} /> Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Experience = () => {
  const { portfolioData: data } = usePortfolio();

  const { experience } = data;
  return (
    <section id="experience" className="bg-[#e0e5ec] py-24 px-6 scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <SectionHeading icon={Briefcase} title="Experience" subtitle="Where I've Worked" />
        <div className="space-y-8">
          {experience.map((exp, i) => (
            <motion.div key={exp.company} {...fadeUp(i * 0.1)} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className={`w-5 h-5 shrink-0 ${neu.circle} border-2 border-indigo-300 mt-1`} />
                {i < experience.length - 1 && (
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-indigo-300 to-transparent mt-2" />
                )}
              </div>
              <div className={`${neu.raised} p-6 flex-1 mb-2`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                  <div>
                    <h3 className="font-bold text-gray-600 font-serif">{exp.role}</h3>
                    <p className="text-indigo-400 text-sm font-medium">{exp.company}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 ${neu.insetSm} text-gray-400 self-start sm:self-auto`}>
                    {exp.period}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const { portfolioData: data } = usePortfolio();

  const { testimonials } = data;
  return (
    <section id="testimonials" className="bg-[#e0e5ec] py-24 px-6 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <SectionHeading icon={Star} title="Testimonials" subtitle="What People Say" />
        <div className="grid sm:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} {...fadeUp(i * 0.1)} className={`${neu.raised} p-7 flex flex-col gap-5`}>
              <div className={`w-10 h-10 flex items-center justify-center ${neu.inset} text-indigo-300 text-2xl font-serif`}>"</div>
              <p className="text-gray-500 leading-relaxed text-sm flex-1 italic">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name || "Profile Avatar"} className="w-12 h-12 rounded-full object-cover shadow-[3px_3px_8px_#b8bec7,-3px_-3px_8px_#ffffff]" />
                <div>
                  <p className="font-semibold text-gray-600 text-sm">{t.name}</p>
                  <p className="text-xs text-indigo-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const { portfolioData: data } = usePortfolio();

  const { socials, personal } = data;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.elements["name"].value;
    const email = form.elements["email"].value;
    const message = form.elements["message"].value;
    window.location.href = `mailto:${socials.email}?subject=Message from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
  };

  return (
    <section id="contact" className="bg-[#e0e5ec] py-24 px-6 scroll-mt-20">
      <div className="max-w-2xl mx-auto">
        <SectionHeading icon={Send} title="Contact" subtitle="Get In Touch" />
        <motion.div {...fadeUp(0.1)} className={`${neu.raised} p-8 space-y-6`}>
          <p className="text-gray-500 text-center leading-relaxed">
            Have a project in mind or just want to say hi? Drop me a message — I'll get back to you as soon as possible!
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-1 ml-1">Your Name</label>
              <input id="name" name="name" type="text" placeholder="John Doe" required aria-label="Your Name"
                className={`w-full px-5 py-4 ${neu.inset} text-gray-500 placeholder-gray-400 text-sm outline-none bg-transparent focus:ring-2 focus:ring-indigo-200 transition-all`} />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1 ml-1">Your Email</label>
              <input id="email" name="email" type="email" placeholder="john@example.com" required aria-label="Your Email"
                className={`w-full px-5 py-4 ${neu.inset} text-gray-500 placeholder-gray-400 text-sm outline-none bg-transparent focus:ring-2 focus:ring-indigo-200 transition-all`} />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-medium text-gray-400 mb-1 ml-1">Your Message</label>
              <textarea id="message" name="message" rows={4} placeholder="Tell me about your project..." required aria-label="Your Message"
                className={`w-full px-5 py-4 ${neu.inset} text-gray-500 placeholder-gray-400 text-sm outline-none bg-transparent resize-none focus:ring-2 focus:ring-indigo-200 transition-all`} />
            </div>
            <button type="submit"
              className="w-full py-4 rounded-xl bg-indigo-400 text-white font-semibold shadow-[4px_4px_12px_#9fa8da,-2px_-2px_8px_#ffffff] hover:shadow-[2px_2px_6px_#9fa8da] transition-all duration-200 flex items-center justify-center gap-2">
              <Send size={16} /> Send Message
            </button>
          </form>
          <div className="flex justify-center gap-5 pt-2">
            {[
              { icon: Github, href: socials.github, label: "GitHub" },
              { icon: Linkedin, href: socials.linkedin, label: "LinkedIn" },
              { icon: Twitter, href: socials.twitter, label: "Twitter" },
              { icon: Mail, href: `mailto:${socials.email}`, label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                className={`w-11 h-11 flex items-center justify-center ${neu.circle} text-gray-400 hover:text-indigo-400 transition-colors`}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </motion.div>
        <motion.p {...fadeUp(0.3)} className="text-center text-xs text-gray-400 mt-10">
          © {new Date().getFullYear()} {personal.name}. Crafted with ♥ using React & Tailwind.
        </motion.p>
      </div>
    </section>
  );
};

const Nav = () => {
  const { portfolioData: data } = usePortfolio();

  const links = ["about", "skills", "projects", "experience", "testimonials", "contact"];
  return (
    <nav className="sticky top-0 z-50 bg-[#e0e5ec]/80 backdrop-blur-md shadow-[0_2px_12px_#b8bec7] px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <span className="font-bold text-gray-600 font-serif tracking-wide">
          {data.personal.name.split(" ")[0]}<span className="text-indigo-400">.</span>
        </span>
        <div className="hidden md:flex gap-1">
          {links.map((link) => (
            <a key={link} href={`#${link}`}
              className={`px-4 py-2 ${neu.raisedSm} text-xs font-semibold text-gray-500 hover:text-indigo-400 capitalize transition-colors`}>
              {link}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default function SoftNeumorphic() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="min-h-screen bg-[#e0e5ec] font-sans">
      <Nav />
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