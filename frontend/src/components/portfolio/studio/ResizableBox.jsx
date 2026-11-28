import React, { useEffect, useRef, useState } from 'react';

export const SECTION_WIDTH_STEPS = [
  { id: 'narrow', label: 'Narrow', max: 760 },
  { id: 'regular', label: 'Regular', max: 1080 },
  { id: 'wide', label: 'Wide', max: 1280 },
  { id: 'full', label: 'Full', max: 1440 },
];

export function snapStep(value, step, min, max) {
  const snapped = Math.round(value / step) * step;
  return Math.max(min, Math.min(max, snapped));
}

export function snapColSpan(currentSpan, startWidth, deltaX, maxCols = 3) {
  const safeSpan = Math.max(1, Number(currentSpan) || 1);
  const unit = Math.max(120, startWidth / safeSpan);
  const target = Math.round((startWidth + deltaX) / unit);
  return Math.max(1, Math.min(maxCols, target));
}

export function snapSectionWidth(startWidth, deltaX) {
  // Centered sections expand symmetrically on both sides when dragging one edge
  const targetPx = startWidth + deltaX * 2;
  let best = SECTION_WIDTH_STEPS[1];
  let bestDiff = Infinity;
  for (const step of SECTION_WIDTH_STEPS) {
    const diff = Math.abs(step.max - targetPx);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = step;
    }
  }
  return best.id;
}

/**
 * Reusable drag-to-resize wrapper for portfolio sections, cards, and media.
 * Uses pointer events + CSS-agnostic inline styles so it works inside both
 * the Studio iframe and the GitHub Portfolio Builder preview window.
 */
export default function ResizableBox({
  enabled = false,
  label = '',
  sizeLabel = '',
  isCustomized = false,
  onResizeX,
  onResizeY,
  onResizeXY,
  onResizeEnd,
  onReset,
  actions = null,
  variant = 'card',
  className = '',
  style,
  children,
  accentColor = '#34d399',
  ...rest
}) {
  const boxRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(null); // 'x' | 'y' | 'xy' | null

  const callbacksRef = useRef({ onResizeX, onResizeY, onResizeXY, onResizeEnd });
  useEffect(() => {
    callbacksRef.current = { onResizeX, onResizeY, onResizeXY, onResizeEnd };
  }, [onResizeX, onResizeY, onResizeXY, onResizeEnd]);

  const handlePointerDown = (axis, event) => {
    if (!enabled || !boxRef.current) return;
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startY = event.clientY;
    const startRect = boxRef.current.getBoundingClientRect();
    setDragging(axis);

    const handleMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (axis === 'x') callbacksRef.current.onResizeX?.(dx, startRect);
      if (axis === 'y') callbacksRef.current.onResizeY?.(dy, startRect);
      if (axis === 'xy') {
        if (callbacksRef.current.onResizeXY) {
          callbacksRef.current.onResizeXY(dx, dy, startRect);
        } else {
          callbacksRef.current.onResizeX?.(dx, startRect);
          callbacksRef.current.onResizeY?.(dy, startRect);
        }
      }
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      setDragging(null);
      callbacksRef.current.onResizeEnd?.();
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  if (!enabled) {
    return (
      <div ref={boxRef} className={className} style={style} {...rest}>
        {children}
      </div>
    );
  }

  const active = hovered || Boolean(dragging);
  const canX = Boolean(onResizeX || onResizeXY);
  const canY = Boolean(onResizeY || onResizeXY);
  const canXY = Boolean(onResizeXY || (onResizeX && onResizeY));
  const isSection = variant === 'section';

  const pillStyle = {
    position: 'absolute',
    top: isSection ? 8 : 6,
    right: isSection ? 12 : 6,
    zIndex: 25,
    display: active ? 'inline-flex' : 'none',
    alignItems: 'center',
    gap: 6,
    padding: '3px 8px',
    borderRadius: 999,
    background: 'rgba(15, 23, 42, 0.88)',
    color: '#f8fafc',
    border: `1px solid ${dragging ? accentColor : 'rgba(255,255,255,0.18)'}`,
    fontSize: 11,
    fontWeight: 600,
    lineHeight: 1.2,
    backdropFilter: 'blur(8px)',
    boxShadow: '0 6px 20px -6px rgba(0,0,0,0.45)',
    pointerEvents: 'auto',
    userSelect: 'none',
  };

  const handleBase = {
    position: 'absolute',
    zIndex: 24,
    opacity: active ? 1 : 0,
    transition: 'opacity 120ms ease',
    pointerEvents: 'auto',
    touchAction: 'none',
  };

  return (
    <div
      ref={boxRef}
      className={className}
      style={{
        position: 'relative',
        outline: active ? `1.5px ${dragging ? 'solid' : 'dashed'} ${accentColor}` : '1px solid transparent',
        outlineOffset: isSection ? -2 : 2,
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      {children}

      {/* Floating dimension + quick-action toolbar */}
      <div style={pillStyle} data-pf-chrome="1" onClick={(e) => e.stopPropagation()}>
        {label && <span style={{ opacity: 0.72, fontSize: 10 }}>{label}</span>}
        {sizeLabel && (
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: accentColor }}>
            {sizeLabel}
          </span>
        )}
        {actions}
        {isCustomized && onReset && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            title="Reset size"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              borderRadius: 999,
              padding: '2px 6px',
              color: '#fff',
              fontSize: 10,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Right edge horizontal handle */}
      {canX && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={`Resize ${label || 'item'} width`}
          title="Drag horizontally to resize width / span"
          data-pf-chrome="1"
          onPointerDown={(event) => handlePointerDown('x', event)}
          style={{
            ...handleBase,
            top: '20%',
            bottom: '20%',
            right: -5,
            width: 10,
            cursor: 'ew-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              width: 4,
              height: 28,
              borderRadius: 999,
              background: accentColor,
              boxShadow: '0 0 0 2px rgba(15,23,42,0.85)',
            }}
          />
        </div>
      )}

      {/* Bottom edge vertical handle */}
      {canY && (
        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label={`Resize ${label || 'item'} height`}
          title="Drag vertically to resize height / padding"
          data-pf-chrome="1"
          onPointerDown={(event) => handlePointerDown('y', event)}
          style={{
            ...handleBase,
            left: '25%',
            right: '25%',
            bottom: -5,
            height: 10,
            cursor: 'ns-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              height: 4,
              width: 32,
              borderRadius: 999,
              background: accentColor,
              boxShadow: '0 0 0 2px rgba(15,23,42,0.85)',
            }}
          />
        </div>
      )}

      {/* Bottom-right corner handle */}
      {canXY && (
        <div
          role="button"
          tabIndex={-1}
          aria-label={`Resize ${label || 'item'} diagonally`}
          title="Drag corner to resize"
          data-pf-chrome="1"
          onPointerDown={(event) => handlePointerDown('xy', event)}
          style={{
            ...handleBase,
            right: -6,
            bottom: -6,
            width: 14,
            height: 14,
            borderRadius: 4,
            background: accentColor,
            border: '2px solid rgba(15,23,42,0.9)',
            cursor: 'nwse-resize',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
          }}
        />
      )}
    </div>
  );
}
