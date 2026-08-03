import React from 'react';
import ProjectsGrid from './ProjectsGrid';
import { motion } from 'framer-motion';

const ContentArea = ({ activeTab, data }) => {
  const { personal } = data;

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (activeTab === 'About') {
    return (
      <motion.div 
        key="about"
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <h2 className="text-[32px] font-normal mb-6 text-[#1B995E]">About me</h2>
        <div className="prose prose-lg text-[#333333] max-w-none space-y-6 font-light leading-relaxed text-[15px]">
          <p>
            Hi! I'm {personal?.name || "Clyde D'Souza"}. I'm a creative and self-driven person who likes to code and do other things. I'm currently working as a senior software engineer at Xero. Previously, I've worked with Datacom and Heritage Hotels.
          </p>
          <p>
            I was the event director of a non-profit educational event called <span className="text-[#1B995E] cursor-pointer hover:underline">Light & Spark NPO</span>. I conceptualized and executed this event in Mumbai along with my <span className="text-[#1B995E] cursor-pointer hover:underline">amazing team</span>. Read more about it <span className="text-[#1B995E] cursor-pointer hover:underline">here</span>.
          </p>
          <p>
            I've published a book titled <i>Mama, Tell Me a Story</i> which is available on <span className="text-[#1B995E] cursor-pointer hover:underline">these platforms</span>. It's a collection of twelve short bedtime stories that parents will love reading to their kids over and over again. Go buy it now!
          </p>
          <p>
            In my spare time, I like to explore other interests like <span className="text-[#1B995E] cursor-pointer hover:underline">writing, designing, teaching</span>, and I've also created many other projects.
          </p>
          <p>
            I'm an alumnus of <span className="text-[#1B995E] cursor-pointer hover:underline">Auckland University of Technology (AUT)</span> with a Postgraduate Diploma in Computer and Information Sciences and holds a Bachelor of Science degree specializing in Information Technology from University of Mumbai, India.
          </p>
        </div>
      </motion.div>
    );
  }

  if (activeTab === 'Portfolio' || activeTab === 'Platforms') {
    return (
      <motion.div 
        key="portfolio"
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <h2 className="text-[32px] font-normal mb-8 text-[#1B995E]">Highlights</h2>
        <ProjectsGrid projects={data?.projects || []} />
      </motion.div>
    );
  }

  return (
    <motion.div 
      key="soon"
      variants={variants}
      initial="hidden"
      animate="visible"
      className="w-full text-center py-20 text-gray-500"
    >
      <p>Content for {activeTab} coming soon.</p>
    </motion.div>
  );
};

export default ContentArea;
