import React from 'react';
import FeatureLandingPage from '../../components/landing/FeatureLandingPage';
import { FEATURES_BY_SLUG } from '../../data/featuresConfig';

export default function JobFinderLanding() {
  return <FeatureLandingPage config={FEATURES_BY_SLUG['job-finder']} />;
}
