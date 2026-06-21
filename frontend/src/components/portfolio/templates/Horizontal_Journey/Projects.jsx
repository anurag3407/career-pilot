import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { SectionWrapper, staggerContainer, textReveal, fadeUp } from './shared';

function ProjectCard({ project, isMobile }) {
  const Card = isMobile ? 'article' : motion.article;

  return (
    <Card {...(isMobile ? {} : { variants: fadeUp })} className="flex flex-col overflow-hidden border border-zinc-800 bg-zinc-900/70">
      <div className="relative aspect-video overflow-hidden bg-zinc-950">
        <img
          src={project.image}
          alt={project.title || "Project Screenshot"}
          loading="lazy"
          className="h-full w-full object-cover opacity-70 grayscale transition-all duration-700 hover:scale-105 hover:opacity-100 hover:grayscale-0"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 lg:p-6">
        <h4 className="text-xl font-black leading-tight text-zinc-100 lg:text-3xl">{project.title}</h4>
        <p className="text-xs leading-relaxed text-zinc-400 lg:text-base">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech, j) => (
            <span key={j} className="border border-zinc-800 px-2 py-1 font-mono text-[9px] text-zinc-500 lg:px-3 lg:py-1.5 lg:text-sm">
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-auto flex gap-4 pt-3 lg:gap-6 lg:pt-4">
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-100 transition-colors hover:text-zinc-400 lg:gap-2 lg:text-base">
            <ExternalLink size={14} className="lg:h-5 lg:w-5" /> Live
          </a>
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-100 transition-colors hover:text-zinc-400 lg:gap-2 lg:text-base">
            <Github size={14} className="lg:h-5 lg:w-5" /> Code
          </a>
        </div>
      </div>
    </Card>
  );
}

export default function ProjectsSection({ isMobile = false }) {
  const Container = isMobile ? 'div' : motion.div;
  const Heading = isMobile ? 'h3' : motion.h3;
  const Paragraph = isMobile ? 'p' : motion.p;

  return (
    <SectionWrapper title="Project" scrollable disableScroll={isMobile}>
      <Container {...(isMobile ? {} : { variants: staggerContainer, initial: 'hidden', whileInView: 'show', viewport: { once: true } })} className="w-full">
        <div className="mb-6 max-w-3xl lg:mb-10">
          <Heading {...(isMobile ? {} : { variants: textReveal })} className="text-3xl font-black leading-none tracking-tight text-zinc-100 md:text-6xl">
            Projects 
          </Heading>
          <Paragraph {...(isMobile ? {} : { variants: fadeUp })} className="mt-3 text-xs leading-relaxed text-zinc-400 lg:text-lg">
            All featured work stays on the same page so the section reads as a single connected gallery on every device.
          </Paragraph>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {data.projects.map((project, index) => (
            <ProjectCard key={`project-${index}`} project={project} isMobile={isMobile} />
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}
