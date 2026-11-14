import { describe, test, expect, beforeAll } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React, { Suspense } from 'react';
import { PortfolioProvider } from '../context/PortfolioContext';
import { getTemplateComponent } from '../data/portfolioTemplates';

// Every template that was a placeholder stub (or bare-bones generic) and was
// completed. Each must render — even with completely empty user data — in
// deploy mode without crashing and without leaking dummy stranger content.
const COMPLETED_TEMPLATES = [
  'Academic_Scholar', 'Acrylic_Windows', 'Advent_Calendar', 'Architect_Studio',
  'Aurora_Sky', 'Bento_Box', 'Board_Game', 'Boarding_Pass', 'Bonsai_Garden',
  'Carbon_Fiber', 'Ceramic_Minimal', 'Command_Palette', 'Coral_Reef',
  'Creative_Agency', 'DOS_Terminal', 'Digital_DNA', 'Elastic_Cards',
  'Ember_Glow', 'File_Cabinet', 'Flip_Card_Deck', 'Gradient_Glass',
  'Japanese_Zen', 'Kinetic_Type', 'Law_Firm_Classic', 'Linear_Dashboard',
  'Museum_Gallery', 'NGO_Nonprofit', 'Netflix_Browse', 'Newspaper_Front',
  'Notion_Workspace', 'Paper_Texture', 'Particle_Universe', 'Physics_Engine_Gravity_Drop',
  'Prismatic_Light', 'Recipe_Cookbook', 'Ripple_Touch', 'Scroll_Cinema',
  'Shadow_Layers', 'Silk_Flow', 'Snowfall_Winter', 'Spotify_Wrapped',
  'Starfield_Warp', 'Startup_Pitch', 'Story_Unfold', 'Timeline_River',
  'Tron_Grid', 'Tropical_Paradise', 'Vinyl_Record', 'Wave_Distortion',
  'Whitespace_Luxury', 'Wireframe_World',
];

beforeAll(() => {
  class MockIntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.IntersectionObserver = MockIntersectionObserver;
  window.ResizeObserver = MockResizeObserver;
  window.scrollTo = window.scrollTo || (() => {});
});

describe('Portfolio Templates - completed templates render in deploy mode', () => {
  test.each(COMPLETED_TEMPLATES)(
    '%s renders without crashing on empty user data and leaks no dummy content',
    async (templateId) => {
      const Template = getTemplateComponent(templateId);
      const { container, queryByText } = render(
        <PortfolioProvider portfolioData={{}} isDeploy={true}>
          <Suspense fallback={null}>
            <Template portfolioData={{}} data={{}} />
          </Suspense>
        </PortfolioProvider>
      );

      // Suspense hides the whole subtree (wrapper included) while the lazy
      // chunk loads — wait for the wrapper to appear, then for real content.
      const framed = await waitFor(
        () => {
          const el = container.querySelector('.cp-raw-palette');
          expect(el).toBeTruthy();
          return el;
        },
        { timeout: 15000 }
      );
      await waitFor(
        () => expect(framed.children.length).toBeGreaterThan(0),
        { timeout: 15000 }
      );

      // Deploy mode must never render dummy stranger content.
      expect(queryByText(/Alex Rivera/i)).toBeNull();
      expect(queryByText(/Sarah Chen/i)).toBeNull();
    },
    30000
  );
});
