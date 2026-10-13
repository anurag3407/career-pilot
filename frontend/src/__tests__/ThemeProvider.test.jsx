import { render, screen, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { ThemeProvider } from '../context/ThemeProvider';
import { useTheme } from '../hooks/useTheme';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-display">{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    if (window.localStorage && typeof window.localStorage.clear === 'function') {
      window.localStorage.clear();
    }
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('provides default light theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-display').textContent).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  test('cycles theme light -> dark -> highContrast -> light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    // Initial: light
    expect(screen.getByTestId('theme-display').textContent).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
    
    // Cycle 1: dark
    act(() => {
      screen.getByText('Toggle Theme').click();
    });
    expect(screen.getByTestId('theme-display').textContent).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    
    // Cycle 2: highContrast
    act(() => {
      screen.getByText('Toggle Theme').click();
    });
    expect(screen.getByTestId('theme-display').textContent).toBe('highContrast');
    expect(document.documentElement.classList.contains('highContrast')).toBe(true);
    
    // Cycle 3: light
    act(() => {
      screen.getByText('Toggle Theme').click();
    });
    expect(screen.getByTestId('theme-display').textContent).toBe('light');
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  test('handles localStorage errors gracefully', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Access denied');
    });
    
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-display').textContent).toBe('light');
    expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to read from localStorage:', expect.any(Error));

    getItemSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });
});
