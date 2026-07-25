import React from 'react';

/**
 * Forge signature status chip — operational/SLA style pill.
 * variant: 'ok' | 'warn' | 'danger'
 */
export default function StatusBadge({ label = 'OPERATIONAL', variant = 'ok', className = '' }) {
  const v = variant === 'danger' ? 'danger' : variant === 'warn' ? 'warn' : 'ok';
  return (
    <span className={`forge-status ${v} ${className}`}>
      <span className="pulse" />
      {label}
    </span>
  );
}
