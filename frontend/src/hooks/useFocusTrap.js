import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';

function getFocusableElements(container) {
  if (!container) return [];
  const elements = container.querySelectorAll(FOCUSABLE_SELECTOR);
  return Array.from(elements).filter(
    (el) => el.offsetParent !== null || el.tagName === 'INPUT' || el.tagName === 'BUTTON'
  );
}

function getTabIndex(el) {
  const value = el.getAttribute('tabindex');
  return value === null ? 0 : parseInt(value, 10);
}

function sortByTabIndex(elements) {
  return [...elements].sort((a, b) => {
    const aIndex = getTabIndex(a);
    const bIndex = getTabIndex(b);
    if (aIndex === bIndex) return 0;
    return aIndex - bIndex;
  });
}

function tryFocus(el) {
  if (el && typeof el.focus === 'function') {
    el.focus();
  }
}

export function useFocusTrap(containerRef, active = true) {
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!active || !containerRef?.current) return;

    previousActiveElement.current = document.activeElement;

    const container = containerRef.current;
    let focusableElements = sortByTabIndex(getFocusableElements(container));

    if (focusableElements.length > 0) {
      tryFocus(focusableElements[0]);
    }

    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      focusableElements = sortByTabIndex(getFocusableElements(container));

      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          tryFocus(lastElement);
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          tryFocus(firstElement);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (
        previousActiveElement.current &&
        document.contains(previousActiveElement.current)
      ) {
        tryFocus(previousActiveElement.current);
      }
      previousActiveElement.current = null;
    };
  }, [active, containerRef]);
}

export default useFocusTrap;
