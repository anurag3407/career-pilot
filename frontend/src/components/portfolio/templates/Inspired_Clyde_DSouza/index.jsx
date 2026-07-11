import React, { useState } from 'react';
import data from '../../../../data/dummy_data.json';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import TopNav from './components/TopNav';
import { MessageCircle, Send, Home, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InspiredClydeDSouza = ({ portfolioData }) => {
  const dataToUse = portfolioData || data;
  const [activeTab, setActiveTab] = useState('About');
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!dataToUse) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white font-sans text-gray-800 relative">
      {/* Sidebar - fixed on desktop, stacked on mobile */}
      <div className="w-full md:w-1/3 lg:w-1/4 md:fixed md:h-screen z-20">
        <Sidebar data={dataToUse} />
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-2/3 lg:w-3/4 md:ml-[33.333333%] lg:ml-[25%] flex flex-col items-center">
        <div className="w-full max-w-5xl px-6 py-10 md:py-16 md:px-12 flex flex-col gap-10">
          <div className="flex justify-center md:justify-start w-full">
            <TopNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          <ContentArea activeTab={activeTab} data={dataToUse} />
        </div>
      </div>

      {/* Chat Popover */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100 flex flex-col"
          >
            {/* Chat Header */}
            <div className="bg-[#008f7a] p-6 text-white text-center relative">
              <button type="button" 
                onClick={() => setIsChatOpen(false)}
                className="absolute top-3 right-3 text-white/80 hover:text-white"
              >
                <X size={18} />
              </button>
              <p className="text-[15px] font-medium leading-relaxed">
                Hi 👋! Thanks for visiting my website. Send me a message to start chatting.
              </p>
            </div>

            {/* Chat Content */}
            <div className="p-4 bg-gray-50 flex-grow min-h-[150px]">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:border-[#008f7a] transition-colors flex items-center justify-between group">
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">New Conversation</h4>
                  <p className="text-xs text-gray-500">We typically reply in a few minutes</p>
                </div>
                <Send className="text-[#008f7a] opacity-70 group-hover:opacity-100 transition-opacity" size={20} />
              </div>
            </div>

            {/* Chat Footer Tabs */}
            <div className="border-t border-gray-100 bg-white flex">
              <button type="button" className="flex-1 py-3 flex items-center justify-center text-[#008f7a] hover:bg-gray-50">
                <Home size={20} />
              </button>
              <button type="button" className="flex-1 py-3 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600">
                <MessageSquare size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#008f7a] text-white rounded-full flex items-center justify-center shadow-2xl z-50 cursor-pointer"
        aria-label="Toggle chat"
      >
        {isChatOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
};

export default InspiredClydeDSouza;
