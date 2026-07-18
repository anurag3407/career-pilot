import React from 'react';

/**
 * Hover-glow bento card. Tracks cursor for the radial glow (forge signature).
 */
export default function BentoCard({ icon: Icon, title, description, className = '' }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div className={`forge-card ${className}`} onMouseMove={onMove}>
      {Icon && (
        <div className="ico">
          <Icon size={22} strokeWidth={1.8} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
