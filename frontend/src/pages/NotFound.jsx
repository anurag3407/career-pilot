import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const [terminalText, setTerminalText] = useState('');
  const fullText = [
    '> git checkout page',
    'error: pathspec \'page\' did not match any file(s) known to git.',
    '> npm run locate-dashboard',
    'sh: locate-dashboard: command not found',
    '404: Brain Not Found',
    '> _'
  ];

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    const typingInterval = setInterval(() => {
      if (currentLine >= fullText.length) {
        clearInterval(typingInterval);
        return;
      }
      const line = fullText[currentLine];
      if (currentChar < line.length) {
        const char = line[currentChar];
        setTerminalText(prev => prev + char);
        currentChar++;
      } else {
        setTerminalText(prev => prev + '\n');
        currentLine++;
        currentChar = 0;
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-6 font-mono overflow-hidden">
      {/* Glitching 404 Heading */}
      <div className="relative group">
        <h1 className="text-9xl font-black mb-2 relative z-10 animate-pulse text-[#00ffaa] drop-shadow-[0_0_15px_rgba(0,255,170,0.5)]">
          404
        </h1>
        <div className="absolute inset-0 text-9xl font-black text-red-500 opacity-30 group-hover:animate-ping pointer-events-none select-none">
          404
        </div>
        <div className="absolute inset-0 text-9xl font-black text-blue-500 opacity-30 group-hover:animate-bounce pointer-events-none select-none ml-2 mt-1">
          404
        </div>
      </div>

      {/* Humorous Headline */}
      <div className="max-w-2xl text-center mb-10">
        <p className="text-xl md:text-2xl font-bold text-neutral-200 mb-2">
          FATAL: HEAD detached at unknown-route
        </p>
        <p className="text-neutral-500 text-sm md:text-base">
          This page has been force-pushed into a black hole or never existed in this branch.
        </p>
      </div>

      {/* Simulated Code Error Block */}
      <div className="w-full max-w-xl bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden shadow-2xl backdrop-blur-md mb-10">
        <div className="flex items-center gap-2 px-4 py-3 bg-[rgba(255,255,255,0.03)] border-b border-[rgba(255,255,255,0.08)]">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          <span className="ml-2 text-xs text-neutral-500">terminal — career-pilot</span>
        </div>
        <div className="p-6 h-48 overflow-y-auto font-mono text-sm leading-relaxed">
          <pre className="text-[#00ffaa] whitespace-pre-wrap">
            {terminalText}
          </pre>
        </div>
      </div>

      {/* Action Button */}
      <Link
        to="/dashboard"
        className="px-8 py-4 bg-[#00ffaa] text-[#0a0a0a] font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-[#00e699] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#00ffaa] focus:border-transparent flex items-center gap-2 shadow-[0_0_30px_rgba(0,255,170,0.2)]"
      >
        <span>git checkout dashboard</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </Link>

      {/* Subtle background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00ffaa] opacity-[0.03] blur-[100px] -z-10 rounded-full"></div>
    </div>
  );
};

export default NotFound;
