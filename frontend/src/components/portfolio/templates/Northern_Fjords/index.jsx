import React from "react";
import data from "../../../../data/dummy_data.json";

export default function NorthernFjords() {
  return (
    <div className="bg-[#0b1b2b] text-white min-h-screen">

      {/* HERO */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-black/60 to-[#0b1b2b]">
        <h1 className="text-5xl md:text-7xl font-bold">
          {data.personal.name}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mt-4">
          {data.personal.title}
        </p>
        <p className="text-gray-400 mt-2">
          {data.personal.location}
        </p>
      </section>

      {/* ABOUT */}
      <section className="py-20 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <img
          src={data.personal.avatar}
          className="rounded-2xl w-full object-cover"
          alt="avatar"
        />
        <div>
          <h2 className="text-3xl font-bold mb-4">About</h2>
          <p className="text-gray-300 leading-relaxed">
            {data.personal.bio}
          </p>
        </div>
      </section>

      {/* SKILLS */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Skills</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.skills.map((skill, i) => (
            <div key={i} className="bg-white/5 p-4 rounded-xl text-center">
              <p className="font-semibold">{skill.name}</p>
              <p className="text-sm text-gray-400">{skill.level}%</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Projects</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {data.projects.map((project, i) => (
            <div key={i} className="bg-white/5 rounded-xl overflow-hidden">
              <img src={project.image} className="h-40 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold">{project.title}</h3>
                <p className="text-gray-400 text-sm mt-2">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Experience</h2>

        <div className="space-y-6">
          {data.experience.map((exp, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-xl">
              <h3 className="font-bold">{exp.role}</h3>
              <p className="text-gray-400">
                {exp.company} • {exp.period}
              </p>
              <p className="text-gray-300 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Testimonials</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {data.testimonials.map((t, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-xl">
              <p className="text-gray-300">"{t.text}"</p>
              <p className="mt-4 font-semibold">{t.name}</p>
              <p className="text-sm text-gray-400">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Contact</h2>

        <p className="text-gray-400 mb-6">{data.personal.bio}</p>

        <p className="text-sm text-gray-500">
          Email: {data.socials.email}
        </p>
      </section>

    </div>
  );
}