import React from 'react';

export default function Contact({ personal, socials }) {
  if (!personal?.email && !socials?.length) return null;

  return (
    <div className="flex h-full bg-[#ECECEC] dark:bg-[#1E1E1E]">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-300 dark:border-gray-700 bg-[#F5F5F5] dark:bg-[#252525] p-2 overflow-y-auto">
        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase tracking-wider">Mailboxes</div>
        <div className="flex items-center gap-2 p-2 bg-blue-500 text-white rounded-md mb-1 cursor-pointer shadow-sm">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          <span className="text-sm font-medium">Inbox</span>
        </div>
        
        <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-4 mb-2 px-2 uppercase tracking-wider">Socials</div>
        {socials?.map((social, i) => (
          <a 
            key={i}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md mb-1 cursor-pointer text-gray-700 dark:text-gray-300 transition-colors"
          >
            <span className="text-lg w-5 text-center">{social.icon || "🔗"}</span>
            <span className="text-sm font-medium">{social.platform}</span>
          </a>
        ))}
      </div>
      
      {/* Main Area */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center bg-white dark:bg-[#1E1E1E]">
        <div className="w-full max-w-md bg-white dark:bg-[#2A2A2A] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
            <div className="flex items-center mb-2">
              <span className="text-gray-500 dark:text-gray-400 w-12 text-sm">To:</span>
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-sm px-2 py-0.5 rounded-md font-medium">
                {personal.email}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 w-12 text-sm">Subject:</span>
              <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                Hello from your portfolio!
              </span>
            </div>
          </div>
          
          <div className="mb-6 text-gray-700 dark:text-gray-300 text-sm min-h-[100px]">
            <p>Hi {personal.name?.split(' ')[0] || 'there'},</p>
            <p className="mt-4">I saw your portfolio and would love to connect.</p>
          </div>
          
          <div className="flex justify-end">
            <a 
              href={`mailto:${personal.email}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              Send Message
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
