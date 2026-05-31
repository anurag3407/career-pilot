import React from 'react';

export default function Navbar({ data }) {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/5 bg-black/40 px-5 py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="#top" className="text-sm font-semibold tracking-tight text-[#F1F0FF]">
          {data.personal?.name}
        </a>

        <div className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/20 bg-[#10B981]/10 px-3 py-1.5 text-xs font-medium text-[#D1FAE5]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981]" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
          </span>
          Available for work
        </div>
      </div>
    </nav>
  );
}
