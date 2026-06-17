import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Medium Article Portfolio Template
 * Category: Famous UI Inspired
 */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function MediumArticle() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="min-h-screen bg-white text-zinc-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Author Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-10"
        >
          <img
            src={data.personal?.avatar}
            alt={data.personal?.name || 'Profile avatar'}
            className="w-14 h-14 rounded-full object-cover"
          />

          <div>
            <p className="font-semibold text-zinc-900">
              {data.personal?.name}
            </p>
            <p className="text-sm text-zinc-500">
              {data.personal?.title}
            </p>
            <p className="text-xs text-zinc-400">
              {data.personal?.location}
            </p>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6"
        >
          Medium Style Case Study Portfolio
        </motion.h1>

        {/* Meta */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex items-center gap-3 text-sm text-zinc-500 mb-10"
        >
          <span>~ {data.stats?.yearsExperience ?? 5} years experience</span>
          <span>•</span>
          <span>Career Pilot Portfolio</span>
        </motion.div>

        {/* ABOUT */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="border-t border-zinc-200 pt-10 mb-14"
        >
          <h2 className="text-xl font-serif font-semibold mb-6">About</h2>

          <p className="text-base md:text-lg leading-8 text-zinc-600 mb-6">
            {data.personal?.bio}
          </p>
        </motion.section>

        {/* SKILLS */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="border-t border-zinc-200 pt-10 mb-14"
        >
          <h2 className="text-xl font-serif font-semibold mb-6">Skills</h2>

          <div className="flex flex-wrap gap-3">
            {data.skills?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200 transition"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </motion.section>

        {/* PROJECTS */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="border-t border-zinc-200 pt-10 mb-14"
        >
          <h2 className="text-xl font-serif font-semibold mb-8">Projects</h2>

          <div className="space-y-12">
            {data.projects?.map((project, index) => (
              <div
                key={index}
                className="grid md:grid-cols-2 gap-6 items-center"
              >
                <div className="overflow-hidden rounded-xl border border-zinc-200">
                  <img
                    src={project.image}
                    alt={project.title || 'Project preview'}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>

                <div>
                  <h3 className="text-2xl font-serif font-semibold mb-2">
                    {project.title}
                  </h3>

                  <p className="text-zinc-600 leading-7 mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack?.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-zinc-100 border border-zinc-200 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 text-sm">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-black"
                      >
                        Live Demo
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-black"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* EXPERIENCE */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="border-t border-zinc-200 pt-10 mb-14"
        >
          <h2 className="text-xl font-serif font-semibold mb-8">
            Experience
          </h2>

          <div className="space-y-10">
            {data.experience?.map((exp, index) => (
              <div key={index} className="relative pl-6 border-l border-zinc-200">
                <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 bg-zinc-800 rounded-full" />

                <p className="text-sm text-zinc-500 mb-1">
                  {exp.period}
                </p>

                <h3 className="text-lg font-semibold">
                  {exp.role} · {exp.company}
                </h3>

                <p className="text-zinc-600 leading-7 mt-2">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* TESTIMONIALS */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="border-t border-zinc-200 pt-10 mb-14"
        >
          <h2 className="text-xl font-serif font-semibold mb-8">
            Testimonials
          </h2>

          <div className="space-y-6">
            {data.testimonials?.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-zinc-50 border border-zinc-200"
              >
                <p className="italic text-zinc-700 mb-4">
                  “{item.text}”
                </p>

                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name || 'Testimonial author'}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-zinc-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CONTACT */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="border-t border-zinc-200 pt-10 mb-10"
        >
          <h2 className="text-xl font-serif font-semibold mb-6">
            Contact
          </h2>

          <div className="flex flex-wrap gap-4">
            {data.socials?.github && (
              <a href={data.socials.github} className="underline">
                GitHub
              </a>
            )}
            {data.socials?.linkedin && (
              <a href={data.socials.linkedin} className="underline">
                LinkedIn
              </a>
            )}
            {data.socials?.twitter && (
              <a href={data.socials.twitter} className="underline">
                Twitter
              </a>
            )}
            {data.socials?.email && (
              <a href={`mailto:${data.socials.email}`} className="underline">
                Email
              </a>
            )}
          </div>
        </motion.section>

      </div>
    </div>
  );
}