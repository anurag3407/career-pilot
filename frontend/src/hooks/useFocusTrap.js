import { useEffect, useRef } from 'react';

// Selectors for standard focusable elements according to HTML/A11y guidelines
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]:not([contenteditable="false"])',
  'audio[controls]',
  'video[controls]',
  'summary'
].join(',');

/**
 * Checks if an element is focusable (not disabled, negative tabindex, etc.)
 */
const isFocusable = (element) => {
  if (!element) return false;
  if (element.disabled) return false;
  if (element.getAttribute('tabindex') === '-1') return false;
  if (element.tagName === 'INPUT' && element.type === 'hidden') return false;
  return true;
};

/**
 * Traverses up the DOM to ensure the element and all parents are visible
 */
const isVisible = (element) => {
  if (!element) return false;
  try {
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }

    // Traverse up ancestors
    let parent = element.parentElement;
    while (parent) {
      const parentStyle = window.getComputedStyle(parent);
      if (parentStyle.display === 'none' || parentStyle.visibility === 'hidden') {
        return false;
      }
      parent = parent.parentElement;
    }
  } catch (e) {
    // Fallback if computedStyle is not supported or errors
  }
  return true;
};

// Global stack to support nested focus traps (only the topmost trap is active)
const activeTraps = [];

/**
 * Custom hook to trap focus within a container element.
 * Useful for modals, dialogs, drawers, and other overlay components.
 *
 * @param {Object} options - Hook configuration options.
 * @param {boolean} [options.active=true] - Whether the focus trap is currently active.
 * @param {React.RefObject} [options.containerRef] - Optional existing ref. If not provided, a new one will be created and returned.
 * @param {string|React.RefObject|boolean} [options.initialFocus='first'] - What to focus when the trap is activated:
 *   - 'first' (default): Focuses the first focusable element inside the container.
 *   - 'container': Focuses the container element itself.
 *   - A React ref or HTML element: Focuses that specific element.
 *   - false: Does not set initial focus automatically.
 * @param {boolean|React.RefObject} [options.returnFocus=true] - Whether to return focus when the trap is deactivated:
 *   - true (default): Returns focus to the element that had focus before the trap was activated.
 *   - A React ref or HTML element: Returns focus to that specific element.
 *   - false: Does not return focus.
 * @returns {React.RefObject} Ref to be attached to the container element.
 */
export function useFocusTrap({
  active = true,
  containerRef,
  initialFocus = 'first',
  returnFocus = true,
} = {}) {
  const backupRef = useRef(null);
  const internalRef = containerRef || backupRef;

  // Manage active traps stack to handle nested modals correctly
  useEffect(() => {
    if (!active) return;

    const container = internalRef.current;
    if (!container) return;

    activeTraps.push(container);

    return () => {
      const index = activeTraps.indexOf(container);
      if (index !== -1) {
        activeTraps.splice(index, 1);
      }
    };
  }, [active, internalRef]);

  // Set initial focus & return focus on deactivate
  useEffect(() => {
    if (!active) return;

    const container = internalRef.current;
    if (!container) return;

    // Capture currently focused element to return focus to later
    const elementBeforeTrap = document.activeElement;

    const setFocus = () => {
      const currentContainer = internalRef.current;
      if (!currentContainer) return;

      if (initialFocus === 'container') {
        if (currentContainer.getAttribute('tabindex') === null) {
          currentContainer.setAttribute('tabindex', '-1');
        }
        currentContainer.focus();
      } else if (initialFocus === 'first') {
        const focusables = Array.from(currentContainer.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
          (el) => isFocusable(el) && isVisible(el)
        );
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          // Fallback to container focus if no focusable elements found
          if (currentContainer.getAttribute('tabindex') === null) {
            currentContainer.setAttribute('tabindex', '-1');
          }
          currentContainer.focus();
        }
      } else if (initialFocus && typeof initialFocus === 'object' && 'current' in initialFocus) {
        if (initialFocus.current) {
          initialFocus.current.focus();
        }
      } else if (initialFocus instanceof HTMLElement) {
        initialFocus.focus();
      }
    };

    // Defer execution using setTimeout to ensure DOM is fully painted/hydrated
    const timerId = setTimeout(setFocus, 0);

    return () => {
      clearTimeout(timerId);

      // Return focus on cleanup
      if (returnFocus) {
        if (returnFocus === true) {
          if (elementBeforeTrap && typeof elementBeforeTrap.focus === 'function' && document.body.contains(elementBeforeTrap)) {
            elementBeforeTrap.focus();
          }
        } else if (returnFocus && typeof returnFocus === 'object' && 'current' in returnFocus) {
          if (returnFocus.current && typeof returnFocus.current.focus === 'function') {
            returnFocus.current.focus();
          }
        } else if (returnFocus instanceof HTMLElement && typeof returnFocus.focus === 'function') {
          returnFocus.focus();
        }
      }
    };
  }, [active, initialFocus, returnFocus, internalRef]);

  // Trap focus on Tab key press
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const container = internalRef.current;
      if (!container) return;

      // Only trap focus if this container is the topmost active trap
      const topmost = activeTraps[activeTraps.length - 1];
      if (topmost !== container) {
        return;
      }

      const focusables = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => isFocusable(el) && isVisible(el)
      );

      if (focusables.length === 0) {
        // Prevent focus from leaving if no focusable elements are present
        e.preventDefault();
        if (container.getAttribute('tabindex') === null) {
          container.setAttribute('tabindex', '-1');
        }
        container.focus();
        return;
      }

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      if (e.shiftKey) {
        // Shift + Tab (Backward navigation)
        if (document.activeElement === firstElement || !container.contains(document.activeElement)) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab (Forward navigation)
        if (document.activeElement === lastElement || !container.contains(document.activeElement)) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active, internalRef]);

  return internalRef;
}
