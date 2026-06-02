import { render, screen, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';

function TestComponent({ active = true }) {
  const ref = useRef(null);
  useFocusTrap(ref, active);
  return (
    <div ref={ref} data-testid="trap-container">
      <button data-testid="btn1">First</button>
      <button data-testid="btn2">Middle</button>
      <button data-testid="btn3">Last</button>
      <input data-testid="input" />
    </div>
  );
}

function SingleFocusable({ active = true }) {
  const ref = useRef(null);
  useFocusTrap(ref, active);
  return (
    <div ref={ref} data-testid="single-container">
      <button data-testid="only">Only</button>
    </div>
  );
}

function NoFocusable({ active = true }) {
  const ref = useRef(null);
  useFocusTrap(ref, active);
  return (
    <div ref={ref} data-testid="empty-container">
      <p>No interactive elements</p>
    </div>
  );
}

function NullContainer() {
  useFocusTrap({ current: null }, true);
  return <div data-testid="null-container">No ref</div>;
}

describe('useFocusTrap', () => {
  test('focuses the first focusable element on mount', () => {
    render(<TestComponent />);
    expect(document.activeElement).toBe(screen.getByTestId('btn1'));
  });

  test('cycles focus forward from last to first element on Tab', () => {
    render(<TestComponent />);
    const lastEl = screen.getByTestId('input');
    lastEl.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(screen.getByTestId('btn1'));
  });

  test('cycles focus backward from first to last element on Shift+Tab', () => {
    render(<TestComponent />);
    const firstEl = screen.getByTestId('btn1');
    firstEl.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(screen.getByTestId('input'));
  });

  test('does not trap focus when active is false', () => {
    render(<TestComponent active={false} />);
    expect(document.activeElement).not.toBe(screen.getByTestId('btn1'));
  });

  test('keeps single focusable element focused on Tab', () => {
    render(<SingleFocusable />);
    expect(document.activeElement).toBe(screen.getByTestId('only'));
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(screen.getByTestId('only'));
  });

  test('handles container with no focusable elements', () => {
    render(<NoFocusable />);
    expect(document.activeElement).not.toBeNull();
  });

  test('handles null container ref without error', () => {
    expect(() => render(<NullContainer />)).not.toThrow();
  });

  test('restores focus to previous active element on unmount', () => {
    const outside = document.createElement('button');
    outside.setAttribute('data-testid', 'outside');
    document.body.appendChild(outside);
    outside.focus();
    expect(document.activeElement).toBe(outside);

    const { unmount } = render(<TestComponent />);
    expect(document.activeElement).toBe(screen.getByTestId('btn1'));

    unmount();
    expect(document.activeElement).toBe(outside);
    document.body.removeChild(outside);
  });

  test('does not throw when Tab pressed with no focusable elements', () => {
    render(<NoFocusable />);
    expect(() => {
      fireEvent.keyDown(document, { key: 'Tab' });
    }).not.toThrow();
  });
});
