import React, { useMemo } from 'react';
import dummyData from '../../../../data/dummy_data.json';

// Sub-components
import Hero from './Hero';
import About from './About';
import FeaturedVideos from './FeaturedVideos';
import Stats from './Stats';
import SocialLinks from './SocialLinks';
import Contact from './Contact';

const YouTuberVlogsphereChannel = ({ portfolioData }) => {
  // Merge portfolio data with dummy data
  const personal = {
    ...dummyData.personal,
    ...(portfolioData?.hero?.subtitle && { name: portfolioData.hero.subtitle }),
    ...(portfolioData?.hero?.title && { title: portfolioData.hero.title }),
    ...(portfolioData?.hero?.tagline && { tagline: portfolioData.hero.tagline }),
    ...(portfolioData?.about?.bio && { bio: portfolioData.about.bio }),
  };

  const socials = { ...dummyData.socials, ...portfolioData?.socials };

  // Adapt skills array if needed
  let skills = dummyData.skills;
  if (Array.isArray(portfolioData?.skills) && portfolioData.skills.length > 0) {
    skills = portfolioData.skills;
  }

  // Adapt projects
  let projects = dummyData.projects;
  if (Array.isArray(portfolioData?.projects) && portfolioData.projects.length > 0) {
    projects = portfolioData.projects.map((p, i) => ({
      title: p.title || p.name || 'Project',
      description: p.description || '',
      techStack: p.technologies || p.techStack || [],
      image: p.image || dummyData.projects[i % dummyData.projects.length].image,
      liveUrl: p.liveUrl || '#',
      githubUrl: p.githubUrl || '#',
    }));
  }

  const experience = useMemo(() => {
    return Array.isArray(portfolioData?.experience) && portfolioData.experience.length > 0
      ? portfolioData.experience
      : dummyData.experience;
  }, [portfolioData?.experience]);

  const testimonials = useMemo(() => {
    return Array.isArray(portfolioData?.testimonials) && portfolioData.testimonials.length > 0
      ? portfolioData.testimonials
      : dummyData.testimonials;
  }, [portfolioData?.testimonials]);

  const stats = portfolioData?.stats || dummyData.stats;

  const data = { personal, socials, skills, projects, experience, testimonials, stats };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200">
      <Hero data={data} />
      <About data={data} />
      <FeaturedVideos data={data} />
      <Stats data={data} />
      <SocialLinks data={data} />
      <Contact data={data} />
      
      {/* Footer */}
      <footer className="border-t border-[#303030] bg-[#0f0f0f] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500">© {new Date().getFullYear()} {data.personal.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default YouTuberVlogsphereChannel;
