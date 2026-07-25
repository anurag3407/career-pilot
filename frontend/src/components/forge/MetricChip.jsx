import React from 'react';

/** Monospace metric chip used in hero stat rows. */
export default function MetricChip({ value, label, accent = false }) {
  return (
    <div className="forge-metric">
      <div className={`v ${accent ? 'accent' : ''}`}>{value}</div>
      <div className="l">{label}</div>
    </div>
  );
}
