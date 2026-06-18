import React from 'react';
import { motion } from 'framer-motion';

const msgAnim = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35 } }),
};

export function Message({ avatar, name, timestamp, children, isBot, index = 0 }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={msgAnim}
      className="flex gap-4 px-4 py-1 hover:bg-[#2E3035] group transition-colors"
    >
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover mt-0.5 shrink-0 cursor-pointer hover:opacity-80"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-medium text-sm cursor-pointer hover:underline ${isBot ? 'text-[#5865F2]' : 'text-[#F2F3F5]'}`}>
            {name}
          </span>
          {isBot && (
            <span className="bg-[#5865F2] text-[10px] text-white font-bold px-1 py-[1px] rounded text-center leading-tight">BOT</span>
          )}
          <span className="text-[11px] text-[#949BA4]">{timestamp}</span>
        </div>
        <div className="text-sm text-[#DBDEE1] mt-0.5 leading-relaxed">{children}</div>
      </div>
    </motion.div>
  );
}

export function Embed({ color = '#5865F2', title, description, fields, image, footer }) {
  return (
    <div className="max-w-[520px] mt-1 flex rounded overflow-hidden bg-[#2B2D31] border border-[#1E1F22]">
      <div className="w-1 shrink-0" style={{ backgroundColor: color }} />
      <div className="p-3 min-w-0 flex-1">
        {title && <div className="text-sm font-semibold text-[#00AFF4] mb-1">{title}</div>}
        {description && <div className="text-sm text-[#DBDEE1] mb-2">{description}</div>}
        {fields && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
            {fields.map((f, i) => (
              <div key={i}>
                <div className="text-xs font-semibold text-[#B5BAC1]">{f.name}</div>
                <div className="text-sm text-[#DBDEE1]">{f.value}</div>
              </div>
            ))}
          </div>
        )}
        {image && <img src={image} alt={title || 'Embedded image'} className="w-full rounded mt-1 max-h-48 object-cover" />}
        {footer && <div className="text-[11px] text-[#949BA4] mt-2">{footer}</div>}
      </div>
    </div>
  );
}

export function Divider({ text }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 my-2">
      <div className="flex-1 h-[1px] bg-[#3F4147]" />
      <span className="text-[11px] font-semibold text-[#949BA4]">{text}</span>
      <div className="flex-1 h-[1px] bg-[#3F4147]" />
    </div>
  );
}
