import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import React from 'react';
import ScrollTape from '../components/portfolio/templates/Scroll_Tape';

describe('ScrollTape Template', () => {
  test('renders the CRT monitor screen and the play deck', () => {
    render(<ScrollTape />);
    
    // Checks that the power status is visible on the screen bezel control deck
    expect(screen.getByText('POWER ON')).toBeInTheDocument();
    expect(screen.getByText('TAPE LOADED')).toBeInTheDocument();
  });

  test('renders navigation tabs for VCR physical deck', () => {
    render(<ScrollTape />);

    expect(screen.getByText('01. INTRO')).toBeInTheDocument();
    expect(screen.getByText('02. BIO')).toBeInTheDocument();
    expect(screen.getByText('03. SKILLS')).toBeInTheDocument();
  });
});
