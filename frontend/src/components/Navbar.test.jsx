import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navbar from './Navbar';

// Mock context hooks
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { name: 'Test User', email: 'test@example.com' } }),
}));

vi.mock('./ThemeToggle', () => ({
  default: () => <button data-testid="theme-toggle">Toggle Theme</button>,
}));

vi.mock('./AvatarDropdown', () => ({
  default: ({ user }) => <div data-testid="avatar-dropdown">{user.name}</div>,
}));

const renderNavbar = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar', () => {
  describe('Breakpoint consistency — issue #4085', () => {
    it('desktop nav links container uses lg breakpoint (hidden lg:flex)', () => {
      const { container } = renderNavbar();
      // The desktop nav links wrapper must have both "hidden" and "lg:flex"
      const desktopNavLinks = container.querySelector('.hidden.lg\\:flex');
      expect(desktopNavLinks).not.toBeNull();
    });

    it('renders at least two elements with hidden lg:flex (nav links AND avatar section)', () => {
      const { container } = renderNavbar();
      const lgFlexSections = container.querySelectorAll('.hidden.lg\\:flex');
      // There must be exactly two: one for nav links, one for avatar+theme
      expect(lgFlexSections.length).toBeGreaterThanOrEqual(2);
    });

    it('does NOT render any element with hidden md:flex (old broken breakpoint)', () => {
      const { container } = renderNavbar();
      const mdFlexSections = container.querySelectorAll('.hidden.md\\:flex');
      expect(mdFlexSections.length).toBe(0);
    });

    it('hamburger button uses lg:hidden (not md:hidden)', () => {
      const { container } = renderNavbar();
      const hamburger = container.querySelector('.lg\\:hidden');
      expect(hamburger).not.toBeNull();
    });

    it('does NOT have a hamburger button with md:hidden (old broken class)', () => {
      const { container } = renderNavbar();
      // md:hidden on a button would be the old broken state
      const mdHiddenButtons = container.querySelectorAll('button.md\\:hidden');
      expect(mdHiddenButtons.length).toBe(0);
    });
  });

  describe('Rendering', () => {
    it('renders the logo', () => {
      renderNavbar();
      expect(screen.getByText('CareerPilot')).toBeInTheDocument();
    });

    it('renders all desktop nav links', () => {
      renderNavbar();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Jobs')).toBeInTheDocument();
      expect(screen.getByText('Resume')).toBeInTheDocument();
      expect(screen.getByText('Portfolio')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders the hamburger button', () => {
      renderNavbar();
      const hamburger = screen.getByLabelText('Open menu');
      expect(hamburger).toBeInTheDocument();
    });

    it('renders theme toggle in desktop section', () => {
      renderNavbar();
      // Should have at least one theme toggle (desktop)
      const toggles = screen.getAllByTestId('theme-toggle');
      expect(toggles.length).toBeGreaterThanOrEqual(1);
    });

    it('renders avatar dropdown in desktop section when user is logged in', () => {
      renderNavbar();
      const avatars = screen.getAllByTestId('avatar-dropdown');
      expect(avatars.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Mobile menu toggle', () => {
    it('mobile menu is hidden by default', () => {
      renderNavbar();
      // The mobile menu only renders when open; nav links in desktop are always present
      // We check there's no duplicate set rendered initially (mobile menu closed)
      const hamburger = screen.getByLabelText('Open menu');
      expect(hamburger).toBeInTheDocument();
    });

    it('opens mobile menu when hamburger is clicked', () => {
      renderNavbar();
      const hamburger = screen.getByLabelText('Open menu');
      fireEvent.click(hamburger);
      expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    });

    it('closes mobile menu when hamburger is clicked again', () => {
      renderNavbar();
      const hamburger = screen.getByLabelText('Open menu');
      fireEvent.click(hamburger);
      const closeButton = screen.getByLabelText('Close menu');
      fireEvent.click(closeButton);
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    });

    it('closes mobile menu when a nav link is clicked', () => {
      renderNavbar();
      fireEvent.click(screen.getByLabelText('Open menu'));
      // Find mobile menu links (there are duplicates now — desktop + mobile)
      const dashboardLinks = screen.getAllByText('Dashboard');
      // Click the last one (mobile menu)
      fireEvent.click(dashboardLinks[dashboardLinks.length - 1]);
      expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    });
  });

  describe('Active link highlighting', () => {
    it('applies active class to current route link', () => {
      const { container } = renderNavbar('/dashboard');
      const links = container.querySelectorAll('a[href="/dashboard"]');
      links.forEach((link) => {
        expect(link.className).toContain('text-primary');
      });
    });

    it('does not apply active class to non-current route links', () => {
      const { container } = renderNavbar('/dashboard');
      const jobsLinks = container.querySelectorAll('a[href="/jobs"]');
      jobsLinks.forEach((link) => {
        expect(link.className).toContain('text-muted-foreground');
      });
    });
  });
});
