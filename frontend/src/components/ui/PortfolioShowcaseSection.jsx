import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function PortfolioShowcaseSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselItems = [
    {
      id: 1,
      name: "Developer Theme",
      description: "Showcase your projects, repositories, and technical skills in a clean portfolio layout.",
      skills: ["React", "TypeScript", "Node.js"]
    },
    {
      id: 2,
      name: "Creative Theme",
      description: "Display your design work, case studies, and creative projects with a minimalist aesthetic.",
      skills: ["Figma", "UI/UX", "Design Systems"]
    },
    {
      id: 3,
      name: "Professional Theme",
      description: "Highlight your career milestones, industry experience, and professional achievements.",
      skills: ["Product", "Strategy", "Growth"]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  return (
    <section className="py-20 bg-background relative overflow-hidden transition-colors duration-300">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="px-3 py-1 bg-sky-500/10 text-sky-400 text-xs rounded-full border border-sky-500/20 font-medium">
              One-Click Deploy
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20 font-medium">
              AI Content
            </span>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs rounded-full border border-amber-500/20 font-medium">
              10+ Themes
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Build Stunning Portfolios in Minutes
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto">
            From Resume, GitHub, or LinkedIn — deployed instantly
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="max-w-xl mx-auto mb-12 relative">
          <div className="relative w-full h-[220px] overflow-hidden rounded-xl border border-border bg-card shadow-sm p-6 flex flex-col justify-between transition-colors duration-300">
            {carouselItems.map((item, index) => {
              const isActive = index === currentIndex;
              return (
                <div
                  key={item.id}
                  className={`absolute inset-0 p-6 flex flex-col justify-between transition-opacity duration-500 ease-in-out ${
                    isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{item.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 text-xs rounded-full border border-border bg-muted text-muted-foreground font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-primary w-4" : "bg-muted hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            to="/register"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background hover:text-white font-medium rounded-lg hover:bg-muted-foreground/80 transition-all duration-200"
          >
            Build Your Portfolio
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
