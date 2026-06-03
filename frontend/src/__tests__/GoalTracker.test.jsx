import React from 'react';
import { render, screen } from '@testing-library/react'; // Adjust import path to match your project setup
import GoalTracker from '../components/analytics/GoalTracker';

describe('GoalTracker Component', () => {
  test('renders component header and titles', () => {
    render(<GoalTracker />);
    // Adjust this line to match your actual header text if different
    expect(screen.getByText(/Weekly Milestones/i)).toBeInTheDocument(); 
  });

  test('renders all default goal metrics and calculated progress', () => {
    render(<GoalTracker />);

    // 1. Verify Labels are visible
    expect(screen.getByText('Job Applications')).toBeInTheDocument();
    expect(screen.getByText('Skill Certifications')).toBeInTheDocument();
    expect(screen.getByText('Coding Problems Solved')).toBeInTheDocument();

    // 2. Verify Completion Text Math matches static data
    expect(screen.getByText('15 of 25 completed')).toBeInTheDocument();
    expect(screen.getByText('2 of 5 completed')).toBeInTheDocument();
    expect(screen.getByText('45 of 50 completed')).toBeInTheDocument();

    // 3. Verify Calculated Percentages are visible
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
    expect(screen.getByText('90%')).toBeInTheDocument();
  });

  test('progress bars have correct style widths and accessibility attributes', () => {
    render(<GoalTracker />);
    
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(3);

    // Job Applications (15/25 = 60%)
    expect(progressBars[0]).toHaveAttribute('aria-valuenow', '60');
    expect(progressBars[0]).toHaveStyle({ width: '60%' });

    // Skill Certifications (2/5 = 40%)
    expect(progressBars[1]).toHaveAttribute('aria-valuenow', '40');
    expect(progressBars[1]).toHaveStyle({ width: '40%' });

    // Coding Problems Solved (45/50 = 90%)
    expect(progressBars[2]).toHaveAttribute('aria-valuenow', '90');
    expect(progressBars[2]).toHaveStyle({ width: '90%' });
  });
});
