import React from 'react';
import FeatureLandingPage from '../../components/landing/FeatureLandingPage';
import { FEATURES_BY_SLUG } from '../../data/featuresConfig';

export default function MockInterviewLanding() {
  return <FeatureLandingPage config={FEATURES_BY_SLUG['mock-interview']} />;
}
