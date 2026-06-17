import React, { useState } from 'react';
import dummyData from '../../../../data/dummy_data.json';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ContentArea from './components/ContentArea';

// Deep dark theme inspired by Dev Patel
const DARK_THEME = {
  bg: '#0E1018',
  cardBg: '#13161F',
  textMain: '#FFFFFF',
  textMuted: '#94A3B8',
  accent: '#4770FF',
  border: 'rgba(255, 255, 255, 0.05)',
  navBg: 'rgba(26, 31, 44, 0.8)'
};

// Crisp light theme
const LIGHT_THEME = {
  bg: '#F8FAFC',
  cardBg: '#FFFFFF',
  textMain: '#0F172A',
  textMuted: '#64748B',
  accent: '#4770FF',
  border: 'rgba(0, 0, 0, 0.08)',
  navBg: 'rgba(255, 255, 255, 0.8)'
};

const InspiredDevPatel = () => {
  const data = dummyData;
  const [activeTab, setActiveTab] = useState('Home');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = isDarkMode ? DARK_THEME : LIGHT_THEME;

  return (
    <div className="min-h-screen relative font-sans selection:bg-blue-500/30 transition-colors duration-500" style={{ backgroundColor: theme.bg, color: theme.textMain, fontFamily: '"Bricolage Grotesque", sans-serif' }}>
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] pointer-events-none transition-opacity duration-500" style={{ opacity: isDarkMode ? 1 : 0.4, background: 'radial-gradient(circle at 15% 0%, rgba(71, 112, 255, 0.15), transparent 50%), radial-gradient(circle at 85% 0%, rgba(138, 43, 226, 0.1), transparent 50%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          name={data.personalInfo?.name} 
          theme={theme}
          isDarkMode={isDarkMode}
          toggleTheme={() => setIsDarkMode(!isDarkMode)}
        />
        
        <div className="mt-8 flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Sticky Sidebar */}
          <div className="w-full lg:w-[380px] lg:sticky top-8 shrink-0">
            <Sidebar data={data} theme={theme} isDarkMode={isDarkMode} />
          </div>

          {/* Right Scrollable Content Area */}
          <div className="flex-1 w-full min-w-0">
            <ContentArea data={data} theme={theme} activeTab={activeTab} isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspiredDevPatel;
