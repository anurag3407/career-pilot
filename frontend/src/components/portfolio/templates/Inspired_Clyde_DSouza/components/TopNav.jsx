import React from 'react';
import { motion } from 'framer-motion';

const TopNav = ({ activeTab, setActiveTab }) => {
  const tabs = ['About', 'Portfolio', 'Platforms', 'Blog'];

  return (
    <div className="flex flex-wrap gap-2 md:gap-3 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-colors z-10
            ${
              activeTab === tab
                ? 'text-gray-900'
                : 'bg-gray-50 text-[#1B995E] hover:bg-gray-100'
            }
          `}
        >
          {activeTab === tab && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 bg-[#FFF000] rounded-full -z-10"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TopNav;
