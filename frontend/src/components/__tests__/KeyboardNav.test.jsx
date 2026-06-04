import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import KeyboardNav from '../KeyboardNav';

describe('KeyboardNav Component', () => {
  beforeEach(() => {
    // Reset body classes before each test
    document.body.className = '';
  });

  it('renders the "Skip to main content" link', () => {
    render(<KeyboardNav />);
    const skipLink = screen.getByText(/skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('adds "keyboard-nav" class to body when Tab key is pressed', () => {
    render(<KeyboardNav />);
    
    // Initially body should not have the class
    expect(document.body.classList.contains('keyboard-nav')).toBe(false);

    // Simulate pressing Tab
    fireEvent.keyDown(window, { key: 'Tab' });
    
    expect(document.body.classList.contains('keyboard-nav')).toBe(true);
  });

  it('removes "keyboard-nav" class from body when mouse is clicked', () => {
    render(<KeyboardNav />);
    
    // Simulate pressing Tab first to add the class
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.body.classList.contains('keyboard-nav')).toBe(true);

    // Simulate mouse click
    fireEvent.mouseDown(window);
    
    expect(document.body.classList.contains('keyboard-nav')).toBe(false);
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<KeyboardNav />);
    
    // Unmount the component
    unmount();

    // Simulating events should no longer affect the body class
    fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.body.classList.contains('keyboard-nav')).toBe(false);
  });
});
