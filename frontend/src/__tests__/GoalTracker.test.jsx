import React from 'react';
import { render, screen } from '@testing-library/react';
import GoalTracker from '../components/analytics/GoalTracker';

describe('GoalTracker Component', () => {
  test('renders goal tracking system header details correctly', () => {
    render(<GoalTracker />);
    const titleElement = screen.getByText(/Goal Setting & Tracking/i);
    expect(titleElement).toBeInTheDocument();
  });
});