import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Analytics from '../Analytics';

vi.mock('../../services/api', () => ({
  interviewApi: {
    getAnalytics: vi.fn(() => Promise.resolve({
      data: {
        sessions: [
          { id: '1', date: 'May 28', overallScore: 70, communication: 65, technicalAccuracy: 75, confidence: 70 },
          { id: '2', date: 'May 30', overallScore: 78, communication: 72, technicalAccuracy: 80, confidence: 75 }
        ],
        summary: {
          count: 2,
          averageOverallScore: 74,
          averageCommunication: 68,
          averageTechnicalAccuracy: 77,
          averageConfidence: 72,
          latestSession: { id: '2', date: 'May 30', overallScore: 78, communication: 72, technicalAccuracy: 80, confidence: 75 }
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

    // 💡 CodeRabbit Fix: Changed getByText to queryByText to prevent premature throwing inside waitFor
    await waitFor(() => {
      expect(screen.queryByText('Performance over time')).toBeInTheDocument();
    });
  });

  it('swaps content layouts fluidly when clicking between tab options', async () => {
    renderComponent();

    const detailedTabButton = await screen.findByText('Detailed Breakdown');
    fireEvent.click(detailedTabButton);

    // 💡 CodeRabbit Fix: Using non-throwing query queries for concurrent timing checks
    await waitFor(() => {
      expect(screen.queryByText('Performance over time')).not.toBeInTheDocument();
      expect(screen.queryByText('Latest session radar')).toBeInTheDocument();
    });
  });
});