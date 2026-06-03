import { vi, describe, test, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Analytics from '../Analytics';

// 🛠️ INDUSTRY STANDARD: Intercept the api import and force it to return a successful mock package instantly
vi.mock('../services/api', () => ({
  interviewApi: {
    getAnalytics: vi.fn(() => Promise.resolve({
      data: {
        sessions: [
          { date: 'May 28', overallScore: 70, communication: 65, technicalAccuracy: 75, confidence: 70 },
          { date: 'May 30', overallScore: 78, communication: 72, technicalAccuracy: 80, confidence: 75 }
        ],
        summary: {
          count: 2,
          averageOverallScore: 74,
          averageCommunication: 68,
          averageTechnicalAccuracy: 77,
          averageConfidence: 72
        }
      }
    }))
  }
}));

// Mock ResizeObserver for Recharts graphics
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

const renderComponent = () => {
  render(
    <BrowserRouter>
      <Analytics />
    </BrowserRouter>
  );
};

describe('Analytics Tab Component Tests', () => {
  test('renders the Overview tab contents by default', async () => {
    renderComponent();
    
    // Using findByText lets the virtual DOM resolve the mock API call cleanly
    expect(await screen.findByText('Overview Trends')).toBeInTheDocument();
    expect(screen.getByText('Performance over time')).toBeInTheDocument();
  });

  test('swaps content layouts fluidly when clicking between tab options', async () => {
    renderComponent();

    const detailedTabButton = await screen.findByText('Detailed Breakdown');
    fireEvent.click(detailedTabButton);

    expect(screen.queryByText('Performance over time')).not.toBeInTheDocument();
    expect(screen.getByText('Latest session radar')).toBeInTheDocument();
  });
});