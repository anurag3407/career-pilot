import { useState } from "react";
import { ChevronLeft, ChevronRight, FolderOpen } from "lucide-react";

export default function PortfolioProjectCarousel() {
  const projects = [
    {
      title: "Career Pilot",
      category: "Web App",
      description: "AI-powered career development platform."
    },
    {
      title: "AquaLeaf",
      category: "IoT",
      description: "Smart irrigation system using weather prediction."
    },
    {
      title: "Smart RFID Door Lock",
      category: "Embedded",
      description: "RFID-based secure access control system."
    }
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <FolderOpen className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-black">
          Portfolio Project Showcase
        </h2>
      </div>

      <div className="text-center p-6 border rounded-xl">
        <h3 className="text-2xl font-bold mb-2">
          {projects[current].title}
        </h3>

        <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
          {projects[current].category}
        </span>

        <p className="mt-4 text-muted-foreground">
          {projects[current].description}
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={prevSlide}
            className="p-2 rounded-lg border"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={nextSlide}
            className="p-2 rounded-lg border"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}