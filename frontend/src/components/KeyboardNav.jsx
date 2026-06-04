import React, { useEffect } from 'react';

/**
 * KeyboardNav
 * 
 * Provides global keyboard navigation accessibility features:
 * 1. A "Skip to main content" link that is visually hidden until focused via keyboard.
 * 2. Detects keyboard usage (Tab key) and adds a 'keyboard-nav' class to the body, 
 *    allowing custom focus rings only for keyboard users.
 */
const KeyboardNav = () => {
  useEffect(() => {
    // Add event listener to detect when user is using keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    };

    // Remove class when user clicks with a mouse
    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-nav');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <a
      href="#main-content"
      className="absolute top-0 left-0 -translate-y-full focus:translate-y-0 z-[9999] px-4 py-2 bg-blue-600 text-white font-semibold rounded-br-md shadow-lg transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
    >
      Skip to main content
    </a>
  );
};

export default KeyboardNav;
