import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => React.createElement('div', props, children),
    span: ({ children, ...props }) => React.createElement('span', props, children),
    button: ({ children, ...props }) => React.createElement('button', props, children),
    h1: ({ children, ...props }) => React.createElement('h1', props, children),
    h2: ({ children, ...props }) => React.createElement('h2', props, children),
    h3: ({ children, ...props }) => React.createElement('h3', props, children),
    p: ({ children, ...props }) => React.createElement('p', props, children),
    a: ({ children, ...props }) => React.createElement('a', props, children),
  },
  AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
  useAnimation: () => ({ start: vi.fn(), set: vi.fn(), stop: vi.fn() }),
  useMotionValue: () => ({ get: vi.fn(), set: vi.fn() }),
  useTransform: () => vi.fn(),
  useScroll: () => ({ scrollY: { get: vi.fn(), set: vi.fn() } }),
}));