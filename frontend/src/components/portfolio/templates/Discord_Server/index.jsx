import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import data from '../../../../data/dummy_data.json';
import ServerSidebar from './ServerSidebar';
import ChannelSidebar from './ChannelSidebar';
import ChatHeader from './ChatHeader';
import { WelcomeContent, AboutContent } from './WelcomeAbout';
import { SkillsContent } from './SkillsContent';
import { ProjectsContent } from './ProjectsContent';
import { ExperienceContent, TestimonialsContent } from './ExperienceTestimonials';
import { ContactContent } from './ContactContent';

/**
 * Discord Server Portfolio Template
 * Category: Famous UI Inspired
 * Description: Discord server layout with sidebar channels for navigation,
 * main content area styled as chat messages, user profile card in sidebar.
 */

const channelLabels = {
  welcome: 'welcome',
  about: 'about-me',
  skills: 'skills',
  projects: 'projects',
  experience: 'experience',
  testimonials: 'testimonials',
  contact: 'contact',
};

export default function DiscordServer() {
  const [activeChannel, setActiveChannel] = useState('welcome');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeChannel) {
      case 'welcome':
        return <WelcomeContent data={data} />;
      case 'about':
        return <AboutContent data={data} />;
      case 'skills':
        return <SkillsContent data={data} />;
      case 'projects':
        return <ProjectsContent data={data} />;
      case 'experience':
        return <ExperienceContent data={data} />;
      case 'testimonials':
        return <TestimonialsContent data={data} />;
      case 'contact':
        return <ContactContent data={data} />;
      default:
        return <WelcomeContent data={data} />;
    }
  };

  const handleChannelChange = (ch) => {
    setActiveChannel(ch);
    setMobileMenuOpen(false);
  };

  return (
    <div className="h-screen w-full flex bg-[#313338] text-[#DBDEE1] font-sans overflow-hidden">
      {/* Server Sidebar - far left */}
      <ServerSidebar avatar={data.personal.avatar} name={data.personal.name} />

      {/* Channel Sidebar */}
      <ChannelSidebar
        activeChannel={activeChannel}
        setActiveChannel={handleChannelChange}
        name={data.personal.name}
        title={data.personal.title}
        avatar={data.personal.avatar}
      />

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 z-50 flex md:hidden"
            >
              <ServerSidebar avatar={data.personal.avatar} name={data.personal.name} forceShow />
              <ChannelSidebar
                activeChannel={activeChannel}
                setActiveChannel={handleChannelChange}
                name={data.personal.name}
                title={data.personal.title}
                avatar={data.personal.avatar}
                forceShow
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          channelName={channelLabels[activeChannel]}
          onToggleMobile={() => setMobileMenuOpen(true)}
        />
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChannel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Message Input Bar */}
        {activeChannel !== 'contact' && (
          <div className="px-4 pb-4 pt-2">
            <div className="bg-[#383A40] rounded-lg flex items-center px-4 py-2.5">
              <span className="text-[#6D6F78] text-sm flex-1">
                Message #{channelLabels[activeChannel]}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
