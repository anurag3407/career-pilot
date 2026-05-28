import { useState } from "react";
import data from "../../../../data/dummy_data.json";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const [flipped, setFlipped] = useState(null);

  return (
    <section className="p-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Projects</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Interactive project cards powered by Framer Motion and dynamic dummy data.
            Click or drag any card to explore the project details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {data.projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            isFlipped={flipped === index}
            onToggle={() => setFlipped(flipped === index ? null : index)}
          />
        ))}
      </div>
    </section>
  );
}
