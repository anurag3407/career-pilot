import React, { useRef, useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { describe, test, expect, beforeEach, afterEach } from 'vitest';

// Helper to wait for useEffect setFocus timers
const waitTick = async () => {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

describe('useFocusTrap hook', () => {
  let triggerButton;

  beforeEach(() => {
    // Create an element that initiates focus before the trap activates
    triggerButton = document.createElement('button');
    triggerButton.setAttribute('data-testid', 'trigger');
    document.body.appendChild(triggerButton);
    triggerButton.focus();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  const TrapTestComponent = ({ active = true, options = {} }) => {
    const containerRef = useFocusTrap({ active, ...options });

    return (
      <div ref={containerRef} data-testid="container" tabIndex={-1}>
        <button data-testid="btn1">Button 1</button>
        <input data-testid="input1" placeholder="Input 1" />
        <button data-testid="btn-disabled" disabled>Disabled Button</button>
        <div style={{ display: 'none' }}>
          <button data-testid="btn-hidden">Hidden Button</button>
        </div>
        <a href="#test" data-testid="link1">Link 1</a>
      </div>
    );
  };

  test('should set initial focus to the first focusable element by default', async () => {
    render(<TrapTestComponent />);
    await waitTick();

    const btn1 = screen.getByTestId('btn1');
    expect(document.activeElement).toBe(btn1);
  });

  test('should set initial focus to the container if initialFocus is "container"', async () => {
    render(<TrapTestComponent options={{ initialFocus: 'container' }} />);
    await waitTick();

    const container = screen.getByTestId('container');
    expect(document.activeElement).toBe(container);
  });

  test('should set initial focus to a specific element ref if provided', async () => {
    const CustomRefComponent = () => {
      const inputRef = useRef(null);
      const containerRef = useFocusTrap({ initialFocus: inputRef });

      return (
        <div ref={containerRef} data-testid="container">
          <button data-testid="btn1">Button 1</button>
          <input ref={inputRef} data-testid="input-target" />
        </div>
      );
    };

    render(<CustomRefComponent />);
    await waitTick();

    const inputTarget = screen.getByTestId('input-target');
    expect(document.activeElement).toBe(inputTarget);
  });

  test('should not change focus if initialFocus is false', async () => {
    render(<TrapTestComponent options={{ initialFocus: false }} />);
    await waitTick();

    expect(document.activeElement).toBe(triggerButton);
  });

  test('should wrap focus to first element when Tab is pressed on last element', async () => {
    render(<TrapTestComponent />);
    await waitTick();

    const btn1 = screen.getByTestId('btn1');
    const link1 = screen.getByTestId('link1');

    // Move focus to last element manually
    act(() => {
      link1.focus();
    });
    expect(document.activeElement).toBe(link1);

    // Press Tab
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    document.dispatchEvent(tabEvent);

    expect(document.activeElement).toBe(btn1);
  });

  test('should wrap focus to last element when Shift + Tab is pressed on first element', async () => {
    render(<TrapTestComponent />);
    await waitTick();

    const btn1 = screen.getByTestId('btn1');
    const link1 = screen.getByTestId('link1');

    expect(document.activeElement).toBe(btn1);

    // Press Shift + Tab
    const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
    document.dispatchEvent(shiftTabEvent);

    expect(document.activeElement).toBe(link1);
  });

  test('should return focus to the trigger element when the trap is unmounted', async () => {
    const { unmount } = render(<TrapTestComponent />);
    await waitTick();

    const btn1 = screen.getByTestId('btn1');
    expect(document.activeElement).toBe(btn1);

    unmount();
    await waitTick();

    expect(document.activeElement).toBe(triggerButton);
  });

  test('should return focus to custom element if returnFocus is a DOM element/ref', async () => {
    const customReturnTarget = document.createElement('button');
    customReturnTarget.setAttribute('data-testid', 'custom-return');
    document.body.appendChild(customReturnTarget);

    const { unmount } = render(
      <TrapTestComponent options={{ returnFocus: customReturnTarget }} />
    );
    await waitTick();

    unmount();
    await waitTick();

    expect(document.activeElement).toBe(customReturnTarget);
  });

  test('should not return focus if returnFocus is false', async () => {
    const { unmount } = render(<TrapTestComponent options={{ returnFocus: false }} />);
    await waitTick();

    const btn1 = screen.getByTestId('btn1');
    expect(document.activeElement).toBe(btn1);

    unmount();
    await waitTick();

    // Focus should remain on the last element or document body, but not return to trigger
    expect(document.activeElement).not.toBe(triggerButton);
  });

  test('should skip disabled and hidden elements', async () => {
    render(<TrapTestComponent />);
    await waitTick();

    // Verify first focus is button 1 (since disabled/hidden button should be skipped)
    const btn1 = screen.getByTestId('btn1');
    expect(document.activeElement).toBe(btn1);

    // Button 1 is first element, link 1 is last element.
    // Let's verify shift tab from btn1 goes to link1 (skipping hidden and disabled)
    const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
    document.dispatchEvent(shiftTabEvent);

    const link1 = screen.getByTestId('link1');
    expect(document.activeElement).toBe(link1);
  });

  test('should handle nested focus traps (only topmost trap intercepts Tab)', async () => {
    const NestedTraps = () => {
      const [parentActive, setParentActive] = useState(true);
      const [childActive, setChildActive] = useState(true);

      const parentRef = useFocusTrap({ active: parentActive });
      const childRef = useFocusTrap({ active: childActive });

      return (
        <div ref={parentRef} data-testid="parent" tabIndex={-1}>
          <button data-testid="parent-btn1">Parent Button 1</button>
          <button data-testid="parent-btn2">Parent Button 2</button>
          
          {childActive && (
            <div ref={childRef} data-testid="child" tabIndex={-1}>
              <button data-testid="child-btn1">Child Button 1</button>
              <button data-testid="child-btn2">Child Button 2</button>
            </div>
          )}
          
          <button data-testid="deactivate-child" onClick={() => setChildActive(false)}>Deactivate Child</button>
        </div>
      );
    };

    render(<NestedTraps />);
    await waitTick();

    // Topmost trap is the child, so child-btn1 should receive initial focus
    const childBtn1 = screen.getByTestId('child-btn1');
    const childBtn2 = screen.getByTestId('child-btn2');
    expect(document.activeElement).toBe(childBtn1);

    // Set focus to child-btn2 (last element of child trap)
    act(() => {
      childBtn2.focus();
    });

    // Fire Tab key down on childBtn2
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    document.dispatchEvent(tabEvent);

    // It should wrap inside child to child-btn1, NOT parent button
    expect(document.activeElement).toBe(childBtn1);

    // Deactivate child trap
    const deactivateBtn = screen.getByTestId('deactivate-child');
    act(() => {
      deactivateBtn.click();
    });
    await waitTick();

    // Now parent focus trap is topmost. Parent button 1 should receive focus
    const parentBtn1 = screen.getByTestId('parent-btn1');
    const parentBtn2 = screen.getByTestId('parent-btn2');
    
    // Move to parentBtn2
    act(() => {
      parentBtn2.focus();
    });

    // Press Tab on parentBtn2 (the button before the deactivation button, let's focus deactivateBtn which is last element now)
    act(() => {
      deactivateBtn.focus();
    });
    
    document.dispatchEvent(tabEvent);
    expect(document.activeElement).toBe(parentBtn1);
  });
});
