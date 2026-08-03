import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectsGrid = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <ProjectCard key={index} project={project} index={index} />
      ))}
    </div>
  );
};

export default ProjectsGrid;
