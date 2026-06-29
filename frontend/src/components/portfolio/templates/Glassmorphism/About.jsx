import React from "react";
import {
  User,
  Briefcase,
  Code2,
  Award,
  Sparkles,
} from "lucide-react";

export default function About() {
  const stats = [
    {
      icon: Briefcase,
      value: "2+",
      label: "Years Experience",
    },
    {
      icon: Code2,
      value: "25+",
      label: "Projects Built",
    },
    {
      icon: Award,
      value: "10+",
      label: "Achievements",
    },
    {
      icon: Sparkles,
      value: "15+",
      label: "Technologies",
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 px-6">
      {/* Background Blobs */}
      <div className="absolute top-0 left-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-xl">
              <User size={16} />
              <span className="text-sm">About Me</span>
            </div>

            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
              Building Modern &
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                Creative Digital Experiences
              </span>
            </h2>

            <p className="mt-6 text-gray-300 leading-relaxed">
              I am a passionate developer who loves crafting beautiful,
              responsive, and user-friendly web applications. My focus is on
              creating seamless digital experiences with modern technologies,
              clean code practices, and visually engaging interfaces.
            </p>

            <p className="mt-4 text-gray-400 leading-relaxed">
              From frontend design to backend architecture, I enjoy turning
              ideas into impactful products that solve real-world problems.
            </p>

            <button className="mt-8 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/20">
              Learn More
            </button>
          </div>

          {/* Right Glass Card */}
          <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-2xl shadow-2xl">
            <h3 className="mb-8 text-2xl font-semibold text-white">
              Quick Overview
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/10"
                  >
                    <Icon
                      size={28}
                      className="mb-3 text-cyan-400 transition-transform duration-300 group-hover:rotate-6"
                    />

                    <h4 className="text-2xl font-bold text-white">
                      {item.value}
                    </h4>

                    <p className="mt-1 text-sm text-gray-300">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <p className="text-gray-300 leading-relaxed">
                Passionate about building scalable applications, exploring new
                technologies, and continuously improving user experiences
                through thoughtful design and development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}