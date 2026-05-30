import React from 'react';

export default function Footer({ data }) {
  const { name } = data.personal;
  return (
    <footer className="border-t border-black px-5 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-black">{name}</span>
      <span className="text-[10px] text-gray-400 uppercase tracking-widest">
        Swiss Typography — {new Date().getFullYear()}
      </span>
    </footer>
  );
}
