
import React from "react";
import {
  ArrowRight,
  Sparkles,
  Code2,
  Layers3,
  Triangle,
  Square,
  Circle,
} from "lucide-react";

// Resume-template friendly content (generic placeholders)
const skills = [
  "Frontend Development",
  "Responsive Design",
  "JavaScript",
  "React.js",
  "Tailwind CSS",
  "Problem Solving",
  "UI Engineering",
  "Clean Code",
];

const stats = [
  { value: "3+", label: "Years Experience" },
  { value: "20+", label: "Projects Completed" },
  { value: "10+", label: "Technologies Used" },
  { value: "100%", label: "Commitment to Quality" },
];

const About = () => {
  return (
    <section className="relative overflow-hidden bg-[#07070A] text-white min-h-screen py-28 px-6 md:px-16 lg:px-24">
      {/* Geometric Grid Background */}
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Floating Geometric Shapes */}
      <div className="absolute top-10 left-10 w-40 h-40 border-2 border-cyan-400 rotate-45" />
      <div className="absolute top-1/3 right-10 w-28 h-28 bg-purple-500/20 rotate-12" />
      <div className="absolute bottom-10 left-1/4 w-32 h-32 border-2 border-pink-400 rounded-full" />
      <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-cyan-400/20 rotate-45" />

      {/* Triangle Shape */}
      <div
        className="absolute top-1/2 left-10 w-24 h-24 bg-yellow-400/20"
        style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
      />

      <div className="relative max-w-7xl mx-auto space-y-32">
        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT */}
          <div className="space-y-10">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-5 py-2 rounded-full text-sm text-gray-300">
              <Sparkles size={16} />
              Resume Portfolio Template
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[0.95]">
              Hi, I'm
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400">
                Your Name
              </span>
              Frontend Developer
            </h1>

            <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
              A passionate developer focused on building modern, responsive, and
              user-friendly web applications. I specialize in turning ideas into
              clean and functional digital experiences.
            </p>

            <div className="flex gap-4 flex-wrap">
              <button className="px-8 py-4 bg-white text-black rounded-xl flex items-center gap-2 hover:scale-105 transition">
                Download Resume
                <ArrowRight size={18} />
              </button>

              <button className="px-8 py-4 border border-white/20 rounded-xl hover:bg-white hover:text-black transition">
                Contact Me
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pt-10">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 text-center hover:-translate-y-2 transition"
                >
                  <div className="text-3xl font-black">{s.value}</div>
                  <div className="text-xs text-gray-400 mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - GEOMETRIC SHOWCASE */}
          <div className="relative flex justify-center items-center min-h-[650px]">
            <div className="absolute w-72 h-72 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rotate-45 rounded-[3rem] animate-pulse" />

            <div className="absolute w-96 h-96 border border-cyan-400/30 rounded-full" />
            <div className="absolute w-56 h-56 border border-pink-400/30 rounded-full" />

            <div className="absolute top-10 left-10 w-24 h-24 border-2 border-white/20 rotate-45" />
            <div className="absolute bottom-10 right-10 w-20 h-20 bg-yellow-400/30 rotate-12" />

            <div
              className="absolute top-20 right-0 w-32 h-32 bg-cyan-400/20"
              style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
            />

            <div className="relative z-10 bg-[#0F0F14]/90 border border-white/10 backdrop-blur-xl p-10 rounded-3xl max-w-sm text-center">
              <div className="flex justify-center gap-2 mb-6">
                <Square className="text-cyan-400" />
                <Circle className="text-pink-400" />
                <Triangle className="text-yellow-400" />
              </div>

              <h2 className="text-3xl font-black mb-3">Profile Summary</h2>

              <p className="text-gray-400">
                Dedicated to crafting scalable frontend applications with strong
                attention to design systems, performance, and user experience.
              </p>
            </div>
          </div>
        </div>

        {/* SKILLS SECTION */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-5xl font-black mb-8">
              Professional
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
                Skillset
              </span>
            </h2>

            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Below are the core technologies and skills I use to build modern
              web applications and interactive user interfaces.
            </p>

            <div className="flex flex-wrap gap-4">
              {skills.map((s, i) => (
                <div
                  key={i}
                  className="px-5 py-3 border border-white/10 bg-white/5 rounded-xl hover:rotate-2 transition"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* EXPERIENCE STYLE CARDS */}
          <div className="grid gap-6">
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
              <h3 className="text-2xl font-bold mb-2">Education</h3>
              <p className="text-gray-400">
                Bachelor of Technology in Computer Science (or your degree).
                Focused on software engineering fundamentals and web development.
              </p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
              <h3 className="text-2xl font-bold mb-2">Experience</h3>
              <p className="text-gray-400">
                Built multiple frontend projects including dashboards, portfolio
                templates, and responsive web applications using React.
              </p>
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
              <h3 className="text-2xl font-bold mb-2">Goal</h3>
              <p className="text-gray-400">
                To grow as a full-stack developer and contribute to impactful
                real-world applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

