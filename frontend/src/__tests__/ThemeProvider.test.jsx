import { render, screen, act } from '@testing-library/react';
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
    window.localStorage.clear();
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Access denied');
    });
    
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

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
