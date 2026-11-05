import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Pricing from '../pages/Pricing';

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}));

vi.mock('../components/Navbar', () => ({
  default: () => <div>Mock Navbar</div>,
}));

describe('Pricing Page', () => {
  test('renders pricing plans and feature cards', () => {
    render(
      <MemoryRouter>
        <Pricing />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /supercharge your job hunt/i })).toBeInTheDocument();
    expect(screen.getByText(/Free Starter/i)).toBeInTheDocument();
    expect(screen.getByText(/Pro Career Builder/i)).toBeInTheDocument();
    expect(screen.getByText(/Executive & Fellowship/i)).toBeInTheDocument();
    expect(screen.getByText(/\$15/i)).toBeInTheDocument();
    expect(screen.getByText(/\$49/i)).toBeInTheDocument();
  });
});
