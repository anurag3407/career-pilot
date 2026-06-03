import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Analytics from '../Analytics';

// Adjusted mock specifier matching relative nesting directory levels
vi.mock('../../services/api', () => ({
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
          averageConfidence: 72,
          latestSession: { date: 'May 30', overallScore: 78, communication: 72, technicalAccuracy: 80, confidence: 75 }
        }
      }
    }))
  }
}));

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <Analytics />
    </BrowserRouter>
  );
};

describe('Analytics Tab Component Tests', () => {
  it('renders the Overview tab contents by default', async () => {
    renderComponent();

    expect(await screen.findByText('Overview Trends')).toBeInTheDocument();

    // Async fallback preventing race condition flakiness
    await waitFor(() => {
      expect(screen.getByText('Performance over time')).toBeInTheDocument();
    });
  });

  it('swaps content layouts fluidly when clicking between tab options', async () => {
    renderComponent();

    const detailedTabButton = await screen.findByText('Detailed Breakdown');
    fireEvent.click(detailedTabButton);

    // Dynamic assertion waiting block updates safely
    await waitFor(() => {
      expect(screen.queryByText('Performance over time')).not.toBeInTheDocument();
      expect(screen.getByText('Latest session radar')).toBeInTheDocument();
    });
  });
});