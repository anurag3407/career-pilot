import React, { useState, useEffect } from 'react';
import { Link, useNavigate,  useLocation, useSearchParams } from 'react-router-dom';

import SearchInput from '../components/SearchInput';
import ReportBugModal from '../components/ReportBugModal';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [terminalText, setTerminalText] = useState('');

  const currentPath = location.pathname;

  const handleSearch = (value) => {
    setSearchParams({ q: value });
  };

  const fullText = [
    '> git checkout page',
    "error: pathspec 'page' did not match any file(s) known to git.",
    '> npm run locate-dashboard',
    'sh: locate-dashboard: command not found',
    '404: Brain Not Found',
    '> _',
  ];

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;

    const typingInterval = setInterval(() => {
      if (currentLine < fullText.length) {
        if (currentChar < fullText[currentLine].length) {
          setTerminalText(
            (prev) => prev + fullText[currentLine][currentChar]
          );
          currentChar++;
        } else {
          setTerminalText((prev) => prev + '\n');
          currentLine++;
          currentChar = 0;
        }
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-6 font-mono overflow-hidden">
      {/* 404 Heading */}
      <div className="relative group">
        <h1 className="text-9xl font-black mb-2 relative z-10 animate-pulse text-[#00ffaa] drop-shadow-[0_0_15px_rgba(0,255,170,0.5)]">
          404
        </h1>
      </div>

      {/* Headline */}
      <div className="max-w-2xl text-center mb-10">
        <p className="text-xl md:text-2xl font-bold text-neutral-200 mb-2">
          FATAL: HEAD detached at unknown-route
        </p>
        <p className="text-neutral-500 text-sm md:text-base">
          This page has been force-pushed into a black hole or never existed in
          this branch.
        </p>
      </div>

      {/* Search */}
      <div className="w-full max-w-xl mb-8">
        <SearchInput
          value={currentPath}
          placeholder="Search for a page..."
          onChange={handleSearch}
        />
      </div>

      {/* Terminal */}
      <div className="w-full max-w-xl bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden shadow-2xl backdrop-blur-md mb-10">
        <div className="p-6 h-48 overflow-y-auto font-mono text-sm leading-relaxed">
          <pre className="text-[#00ffaa] whitespace-pre-wrap">
            {terminalText}
          </pre>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/dashboard"
          className="px-8 py-4 bg-[#00ffaa] text-[#0a0a0a] font-bold rounded-xl"
        >
          Dashboard
        </Link>

        <button
          onClick={() => navigate(-1)}
          className="px-8 py-4 border border-neutral-700 rounded-xl font-bold"
        >
          Go Back
        </button>

        <button
          onClick={() => setIsBugModalOpen(true)}
          className="px-8 py-4 border border-red-500 text-red-400 rounded-xl font-bold"
        >
          Report Broken Link
        </button>
      </div>

      <ReportBugModal
        isOpen={isBugModalOpen}
        onClose={() => setIsBugModalOpen(false)}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00ffaa] opacity-[0.03] blur-[100px] -z-10 rounded-full"></div>
    </div>
  );
};

export default NotFound;