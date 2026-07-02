import React, { Suspense, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PortfolioProvider } from '../context/PortfolioContext';

/**
 * Fallback portfolio data so templates never receive null/undefined.
 * This ensures every template renders its hero section even when there
 * is no user draft in localStorage (e.g. in gallery card iframes).
 */
const FALLBACK_PORTFOLIO = {
  personal: {
    name: "Alex Morgan",
    title: "Full Stack Developer",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate full-stack developer with 5+ years of experience building scalable web applications. Specializing in React, Node.js, and cloud architecture.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    website: "https://alexmorgan.dev",
  },
  personalInfo: {
    name: "Alex Morgan",
    title: "Full Stack Developer",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate full-stack developer with 5+ years of experience building scalable web applications. Specializing in React, Node.js, and cloud architecture.",
    avatar: "",
    website: "https://alexmorgan.dev",
  },
  skills: [
    { name: "React", level: "Expert", rating: 95, type: "Frontend" },
    { name: "Node.js", level: "Advanced", rating: 90, type: "Backend" },
    { name: "TypeScript", level: "Advanced", rating: 88, type: "Language" },
    { name: "Python", level: "Intermediate", rating: 78, type: "Language" },
    { name: "PostgreSQL", level: "Advanced", rating: 85, type: "Database" },
    { name: "AWS", level: "Intermediate", rating: 75, type: "Cloud" },
    { name: "Docker", level: "Advanced", rating: 82, type: "DevOps" },
    { name: "GraphQL", level: "Intermediate", rating: 76, type: "API" },
  ],
  experience: [
    {
      title: "Senior Frontend Engineer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      startDate: "2022-01",
      endDate: "Present",
      description: "Leading the frontend architecture for a SaaS platform serving 100K+ users. Reduced load times by 40% through code splitting and SSR.",
      highlights: [
        "Architected micro-frontend system serving 100K+ users",
        "Reduced bundle size by 60% through code splitting",
        "Mentored team of 5 junior developers",
      ],
    },
    {
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "Remote",
      startDate: "2020-03",
      endDate: "2021-12",
      description: "Built and shipped 3 products from 0 to 1. Full ownership of the tech stack from database design to deployment.",
      highlights: [
        "Built real-time collaboration features using WebSockets",
        "Designed and implemented RESTful APIs",
        "Set up CI/CD pipelines with GitHub Actions",
      ],
    },
    {
      title: "Junior Developer",
      company: "WebAgency Co.",
      location: "New York, NY",
      startDate: "2018-06",
      endDate: "2020-02",
      description: "Developed responsive web applications for clients across e-commerce, healthcare, and fintech industries.",
      highlights: [
        "Delivered 15+ client projects on time and within budget",
        "Improved site performance scores by average of 35%",
      ],
    },
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      institution: "Stanford University",
      year: "2018",
      location: "Stanford, CA",
      description: "Graduated with honors. Focus on distributed systems and human-computer interaction.",
    },
  ],
  projects: [
    {
      title: "CloudSync Dashboard",
      description: "Real-time cloud infrastructure monitoring dashboard with predictive alerts and automated scaling.",
      technologies: ["React", "TypeScript", "D3.js", "AWS"],
      tech: ["React", "TypeScript", "D3.js", "AWS"],
      techStack: ["React", "TypeScript", "D3.js", "AWS"],
      category: "Web Development",
      status: "Finished",
      progress: 95,
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "AI Code Review Bot",
      description: "An intelligent code review assistant powered by GPT-4 that provides actionable suggestions and detects security vulnerabilities.",
      technologies: ["Python", "FastAPI", "OpenAI", "Docker"],
      tech: ["Python", "FastAPI", "OpenAI", "Docker"],
      techStack: ["Python", "FastAPI", "OpenAI", "Docker"],
      category: "Python",
      status: "In Progress",
      progress: 72,
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "E-Commerce Platform",
      description: "Full-featured e-commerce platform with payment processing, inventory management, and real-time analytics.",
      technologies: ["Next.js", "Stripe", "PostgreSQL", "Redis"],
      tech: ["Next.js", "Stripe", "PostgreSQL", "Redis"],
      techStack: ["Next.js", "Stripe", "PostgreSQL", "Redis"],
      category: "Web Development",
      status: "Finished",
      progress: 100,
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "DevOps Pipeline Manager",
      description: "Automated CI/CD pipeline orchestrator with visual workflow builder and multi-cloud deployment support.",
      technologies: ["Go", "Kubernetes", "Terraform", "React"],
      tech: ["Go", "Kubernetes", "Terraform", "React"],
      techStack: ["Go", "Kubernetes", "Terraform", "React"],
      category: "DSA",
      status: "Finished",
      progress: 88,
      liveUrl: "#",
      githubUrl: "#",
    },
  ],
  testimonials: [
    {
      author: "Sarah Chen",
      role: "Engineering Manager at TechCorp",
      content: "Alex is one of the most talented engineers I've worked with. Their ability to architect complex systems while maintaining clean, readable code is exceptional.",
    },
    {
      author: "James Wilson",
      role: "CTO at StartupXYZ",
      content: "Working with Alex was a game-changer for our startup. They single-handedly built our entire backend infrastructure and it hasn't gone down since.",
    },
  ],
  socials: {
    github: "https://github.com/alexmorgan",
    linkedin: "https://linkedin.com/in/alexmorgan",
    twitter: "https://twitter.com/alexmorgan",
  },
  certifications: [
    { name: "AWS Solutions Architect", issuer: "Amazon Web Services", year: "2023" },
    { name: "Google Cloud Professional", issuer: "Google", year: "2022" },
  ],
};

export default function TemplatePreviewOnly() {
  const { templateId } = useParams();
  const [portfolioData, setPortfolioData] = useState(FALLBACK_PORTFOLIO);
  const [qualityScore, setQualityScore] = useState(100);
  const [qualitySuggestions, setQualitySuggestions] = useState([]);
  const [missingInfo, setMissingInfo] = useState([]);

  useEffect(() => {
    // Read the draft data from localStorage — merge with fallback so no field is missing
    try {
      const draft = localStorage.getItem('ai_portfolio_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        // Deep-merge: use user data where available, fallback for missing fields
        setPortfolioData(prev => ({
          ...prev,
          ...parsed,
          personal: { ...prev.personal, ...(parsed.personal || parsed.personalInfo || {}) },
          personalInfo: { ...prev.personalInfo, ...(parsed.personalInfo || parsed.personal || {}) },
          skills: parsed.skills?.length > 0 ? parsed.skills : prev.skills,
          experience: parsed.experience?.length > 0 ? parsed.experience : prev.experience,
          education: parsed.education?.length > 0 ? parsed.education : prev.education,
          projects: parsed.projects?.length > 0 ? parsed.projects : prev.projects,
          testimonials: parsed.testimonials?.length > 0 ? parsed.testimonials : prev.testimonials,
          socials: { ...prev.socials, ...(parsed.socials || {}) },
        }));
      }
    } catch (e) {
      console.error('Error parsing ai_portfolio_draft', e);
    }

    // Listen for messages from the parent window (useful for live-update)
    const handleMessage = (event) => {
      if (event.data?.type === 'UPDATE_PORTFOLIO_DATA') {
        setPortfolioData(prev => ({ ...prev, ...event.data.payload }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
  let score = 100;
  const suggestions = [];
  const missing = [];

  const aboutText =
    portfolioData?.personal?.bio ||
    portfolioData?.personalInfo?.bio ||
    "";

  if (aboutText.length < 100) {
    score -= 15;
    suggestions.push(
      "Expand your About section with more details."
    );
  }

  portfolioData.projects?.forEach((project) => {

    if (!project.description) {
      score -= 15;
      missing.push(
        `${project.title}: Description missing`
      );
    }

    if (
      project.description &&
      project.description.length < 60
    ) {
      score -= 10;
      suggestions.push(
        `${project.title}: Description is too short`
      );
    }

    if (!project.liveUrl || project.liveUrl === "#") {
      score -= 5;
      missing.push(
        `${project.title}: Live Demo URL missing`
      );
    }

    if (!project.githubUrl || project.githubUrl === "#") {
      score -= 5;
      missing.push(
        `${project.title}: GitHub URL missing`
      );
    }

    const hasMetric =
      /\d+%|\d+\+|\d+ users|\d+ downloads/i.test(
        project.description || ""
      );

    if (!hasMetric) {
      suggestions.push(
        `${project.title}: Add measurable results`
      );
    }
  });

  setQualityScore(Math.max(score, 0));
  setQualitySuggestions(suggestions);
  setMissingInfo(missing);

}, [portfolioData]);

  const Component = useMemo(() => {
    if (!templateId) return null;
    return React.lazy(() =>
      import(`../components/portfolio/templates/${templateId}/index.jsx`).catch(() => {
        return import(`../components/portfolio/templates/${templateId}.jsx`).catch(() => {
          return { default: () => <div className="p-10 text-red-500 font-mono">Failed to load template: {templateId}</div> };
        });
      })
    );
  }, [templateId]);

  if (!templateId) return null;

  return (
    <Suspense fallback={<div className="w-full h-full min-h-screen bg-black flex items-center justify-center text-white font-mono">Loading Template...</div>}>
      <PortfolioProvider portfolioData={portfolioData}>
        <Component
  portfolioData={portfolioData}
  qualityScore={qualityScore}
  qualitySuggestions={qualitySuggestions}
  missingInfo={missingInfo}
/>
      </PortfolioProvider>
    </Suspense>
  );
}
