import React from 'react';
import { Rocket, Code, ExternalLink, Code, Star } from 'lucide-react';

const projectsData = [
  {
    id: 1,
    title: "SmartHire ATS Dashboard",
    description: "Real-time dashboard for tracking hiring metrics. Built with React and Chart.js for live data.",
    tags: ["React", "Firebase", "Chart.js", "Tailwind"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true
  },
  {
    id: 2,
    title: "CryptoFlow Gateway", 
    description: "Decentralized payment solution for startups to accept crypto. Smart contracts on Polygon.",
    tags: ["Next.js", "Solidity", "Web3", "Polygon"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true
  },
  {
    id: 3,
    title: "TeamSync IDE",
    description: "Browser-based collaborative code editor with live preview and team chat for remote developers.",
    tags: ["React", "Socket.io", "Monaco", "Node.js"],
    liveUrl: "#",
    githubUrl: "#",
    featured: false
  }
];

const Projects = () => {
  return (
    <section id="projects" className="bg-[#0A192F] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="text-[#64FFDA] w-8 h-8" />
            <h2 className="text-4xl md:text-5xl font-bold text-[#CCD6F6]">
              Featured <span className="text-[#64FFDA]">Projects</span>
            </h2>
          </div>
          <p className="text-[#8892B0] text-lg max-w-2xl mx-auto">
            Here are some of the products I've built for modern startups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project) => (
            <div key={project.id} className="bg-[#112240] rounded-xl border border-[#233554] hover:border-[#64FFDA] transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-[#64FFDA]/10 rounded-lg">
                    <Code className="text-[#64FFDA] w-6 h-6" />
                  </div>
                  <div className="flex gap-3">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[#CCD6F6] hover:text-[#64FFDA] transition-colors">
                      <Code size={20} />
                    </a>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[#CCD6F6] hover:text-[#64FFDA] transition-colors">
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[#CCD6F6] mb-3 group-hover:text-[#64FFDA] transition-colors">
                  {project.title}
                  {project.featured && <Star className="inline ml-2 w-4 h-4 text-[#64FFDA] fill-[#64FFDA]" />}
                </h3>
                
                <p className="text-[#8892B0] mb-6 text-sm leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="text-xs font-mono text-[#64FFDA] bg-[#64FFDA]/10 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
