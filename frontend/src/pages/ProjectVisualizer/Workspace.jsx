import React from 'react';
import ProjectVisualizerLanding from './Landing';

/**
 * Authenticated workflow entry for the Project Visualizer.
 *
 * The landing component owns the analysis flow (input, history, presets, and
 * navigation to the session dashboard). `embedded` keeps AppLayout chrome from
 * duplicating the product navigation while still preserving the complete
 * workflow users expect after signing in.
 */
export default function ProjectVisualizerWorkspace() {
  return <ProjectVisualizerLanding embedded />;
}
