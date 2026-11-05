import { describe, test, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  normalizePortfolioData,
  PortfolioProvider,
} from '../context/PortfolioContext';
import SwissTypography from '../components/portfolio/templates/Swiss_Typography';
import MidnightGradient from '../components/portfolio/templates/Midnight_Gradient';
import PlayingCards from '../components/portfolio/templates/Playing_Cards';

beforeAll(() => {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.IntersectionObserver = MockIntersectionObserver;
});

describe('Portfolio Studio - Data Isolation & Integrity', () => {
  const realUserData = {
    personal: {
      name: 'Anurag Mishra',
      title: 'Senior Systems Architect',
      tagline: 'Building resilient cloud & AI systems',
      bio: 'NIT Patna CSE alumni with 4+ years of production engineering.',
      email: 'anurag@sayalabs.in',
      location: 'San Francisco, CA',
    },
    skills: ['TypeScript', 'Rust', 'Kubernetes', 'PostgreSQL'],
    projects: [
      {
        title: 'CareerPilot Engine',
        description: 'Autonomous resume & portfolio studio',
        techStack: ['React', 'Node.js'],
        liveUrl: 'https://careerpilot.io',
      },
    ],
  };

  test('normalizePortfolioData isolates user data and never injects dummy strangers when isDeploy is true', () => {
    const normalized = normalizePortfolioData(realUserData, { isDeploy: true });

    // Personal details match user input
    expect(normalized.personal.name).toBe('Anurag Mishra');
    expect(normalized.personal.title).toBe('Senior Systems Architect');
    expect(normalized.personal.email).toBe('anurag@sayalabs.in');
    expect(normalized.personal.bio).toContain('NIT Patna');

    // Never inject stranger dummy data
    expect(normalized.personal.name).not.toBe('Alex Rivera');
    expect(normalized.testimonials).toEqual([]);
    expect(normalized.experience).toEqual([]);
    expect(JSON.stringify(normalized)).not.toContain('Sarah Chen');
    expect(JSON.stringify(normalized)).not.toContain('NeuralDash');
  });

  test('normalizePortfolioData isolates user data when user content is present even without isDeploy flag', () => {
    const userMinimal = {
      personal: {
        name: 'Jordan Lee',
      },
    };
    const normalized = normalizePortfolioData(userMinimal);

    expect(normalized.personal.name).toBe('Jordan Lee');
    expect(normalized.testimonials).toEqual([]);
    expect(normalized.projects).toEqual([]);
    expect(JSON.stringify(normalized)).not.toContain('Alex Rivera');
  });

  test('normalizePortfolioData computes deterministic skill levels without Math.random', () => {
    const dataWithSkills = {
      personal: { name: 'Test Developer' },
      skills: ['React', 'Node', 'Go', 'Docker'],
    };

    const run1 = normalizePortfolioData(dataWithSkills, { isDeploy: true });
    const run2 = normalizePortfolioData(dataWithSkills, { isDeploy: true });

    expect(run1.skills.length).toBe(4);
    // Deterministic levels must match identically across runs
    expect(run1.skills).toEqual(run2.skills);
    run1.skills.forEach((skill) => {
      expect(typeof skill.level).toBe('number');
      expect(skill.level).toBeGreaterThanOrEqual(80);
      expect(skill.level).toBeLessThanOrEqual(95);
    });
  });

  test('normalizePortfolioData provides dummyData for empty gallery preview', () => {
    const emptyPreview = normalizePortfolioData({}, { isDeploy: false });
    expect(emptyPreview.personal.name).toBe('Alex Rivera');
    expect(emptyPreview.testimonials.length).toBeGreaterThan(0);
  });
});

describe('Portfolio Templates - Component Render Safety', () => {
  const testUser = {
    personal: {
      name: 'Priya Sharma',
      title: 'Full Stack Engineer',
      bio: 'Specialist in cloud-native microservices.',
      email: 'priya@example.com',
      location: 'Bangalore, India',
    },
    skills: ['Python', 'Docker', 'React'],
    projects: [
      {
        title: 'MicroCloud',
        description: 'Serverless deployment engine',
        techStack: ['Python', 'AWS'],
        liveUrl: 'https://example.com/microcloud',
      },
    ],
    experience: [],
    testimonials: [],
  };

  test('Swiss_Typography renders user data safely without crashing on empty testimonials or experience', () => {
    const { container } = render(
      <PortfolioProvider portfolioData={testUser} isDeploy={true}>
        <SwissTypography data={testUser} />
      </PortfolioProvider>
    );

    expect(container).toBeTruthy();
    expect(screen.getAllByText(/Priya Sharma/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Sarah Chen/i)).toBeNull();
    expect(screen.queryByText(/Alex Rivera/i)).toBeNull();
  });

  test('Midnight_Gradient renders user data and wires contact form to mailto', () => {
    const { container } = render(
      <PortfolioProvider portfolioData={testUser} isDeploy={true}>
        <MidnightGradient data={testUser} />
      </PortfolioProvider>
    );

    expect(container).toBeTruthy();
    expect(screen.getAllByText(/Priya Sharma/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Alex Rivera/i)).toBeNull();

    // Check contact form exists and has mailto target or email input
    const emailLink = container.querySelector('a[href^="mailto:priya@example.com"]');
    expect(emailLink).toBeTruthy();
  });

  test('Playing_Cards renders user data without crashing and without stranger testimonials', () => {
    const { container } = render(
      <PortfolioProvider portfolioData={testUser} isDeploy={true}>
        <PlayingCards data={testUser} />
      </PortfolioProvider>
    );

    expect(container).toBeTruthy();
    expect(screen.getAllByText(/Priya Sharma/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Alex Rivera/i)).toBeNull();
    expect(screen.queryByText(/Sarah Chen/i)).toBeNull();
  });
});
