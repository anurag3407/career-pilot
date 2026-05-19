import React, { useState, useRef, useEffect, useId } from 'react';
export default function Tooltip({ content, children }) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);
  const tooltipId = useId();

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), 300);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') hide();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timeoutRef.current);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {React.cloneElement(children, { 'aria-describedby': visible ? tooltipId : undefined })}
      {visible && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
        >
          <div className="px-2.5 py-1.5 bg-foreground text-background text-xs font-medium rounded-md shadow-lg whitespace-nowrap">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}