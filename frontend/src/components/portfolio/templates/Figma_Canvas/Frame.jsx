import React from 'react';

export default function Frame({ id, title, x, y, width, height, children, isActive, onClick }) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`absolute bg-[#1E1E1E] border transition-colors duration-300 shadow-2xl cursor-default group ${
        isActive ? 'border-blue-500' : 'border-[#333333] hover:border-[#444444]'
      }`}
      style={{
        left: x,
        top: y,
        width: width,
        height: height,
      }}
    >
      <div 
        className={`absolute -top-6 left-0 text-xs font-semibold transition-colors duration-300 ${
          isActive ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-400'
        }`}
      >
        # {title}
      </div>
      <div className="w-full h-full overflow-hidden text-gray-200">
        {children}
      </div>
    </div>
  );
}
