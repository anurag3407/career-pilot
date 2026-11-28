import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import {
  createDocument,
  fromGithubPortfolioBuild,
  hasCustomLayout,
  normalizeDocument,
} from '../components/portfolio/studio/portfolioDocument';
import ResizableBox, {
  snapColSpan,
  snapSectionWidth,
  snapStep,
} from '../components/portfolio/studio/ResizableBox';
import StudioSite from '../components/portfolio/studio/StudioSite';
import PortfolioPreview from '../components/githubPortfolio/PortfolioPreview';

describe('Portfolio Document Layout & GitHub Conversion', () => {
  test('normalizeDocument preserves section, card, media, and avatar sizes', () => {
    const doc = normalizeDocument({
      personal: { name: 'Ada Lovelace', title: 'Systems Engineer' },
      projects: [
        { title: 'Engine', colSpan: 2, cardHeight: 420, mediaHeight: 220 },
      ],
      stats: [{ value: '5', suffix: '+', label: 'Years', colSpan: 2, cardHeight: 160 }],
      pf: {
        sections: [{ id: 'projects', type: 'projects', visible: true, maxWidth: 'wide', paddingY: 96 }],
        design: { avatarSize: 400, skillGroupLayouts: { Core: { colSpan: 2, cardHeight: 240 } } },
      },
    });

    expect(doc.projects[0].colSpan).toBe(2);
    expect(doc.projects[0].cardHeight).toBe(420);
    expect(doc.projects[0].mediaHeight).toBe(220);
    expect(doc.stats[0].colSpan).toBe(2);
    expect(doc.stats[0].cardHeight).toBe(160);
    const projSec = doc.pf.sections.find((s) => s.id === 'projects');
    expect(projSec.maxWidth).toBe('wide');
    expect(projSec.paddingY).toBe(96);
    expect(doc.pf.design.avatarSize).toBe(400);
    expect(doc.pf.design.skillGroupLayouts.Core).toEqual({ colSpan: 2, cardHeight: 240 });
    expect(hasCustomLayout(doc)).toBe(true);
  });

  test('hasCustomLayout returns false for default document', () => {
    const doc = createDocument({ sample: true });
    expect(hasCustomLayout(doc)).toBe(false);
  });

  test('fromGithubPortfolioBuild converts AI GitHub build into Studio document with layout', () => {
    const studioDoc = fromGithubPortfolioBuild({
      username: 'octocat',
      profile: { name: 'The Octocat', location: 'San Francisco', htmlUrl: 'https://github.com/octocat' },
      sections: {
        hero: { headline: 'Cloud & AI Engineer', subheadline: 'Building tools', availableFor: 'Open to work' },
        about: 'I build distributed systems.',
        projects: [
          { name: 'hello-world', title: 'Hello World', summary: 'First repo', highlights: ['Fast'], tech: ['Go'], url: 'https://github.com/octocat/hello-world' },
        ],
        skills: { languages: [{ name: 'Go', level: 5 }], tools: ['Docker'], domains: ['Cloud'] },
        callToAction: 'Reach out anytime.',
      },
      layout: { projects: { 'hello-world': { colSpan: 2, cardHeight: 340 } } },
      aggregateStats: { stars: 42, forks: 10, reposAnalyzed: 1 },
    });

    expect(studioDoc.personal.name).toBe('The Octocat');
    expect(studioDoc.projects[0].colSpan).toBe(2);
    expect(studioDoc.projects[0].cardHeight).toBe(340);
    expect(studioDoc.skills.some((s) => s.name === 'Go' && s.level === 100)).toBe(true);
    expect(studioDoc.socials.github).toBe('https://github.com/octocat');
  });
});

describe('ResizableBox Snapping & Drag Interaction', () => {
  test('snapping utilities clamp and snap predictably', () => {
    expect(snapStep(249, 20, 180, 520)).toBe(240);
    expect(snapStep(100, 20, 180, 520)).toBe(180);
    expect(snapColSpan(1, 300, 280, 2)).toBe(2);
    expect(snapColSpan(2, 600, -280, 2)).toBe(1);
    expect(snapSectionWidth(800, 240)).toBe('wide');
  });

  test('pointer drag on right and bottom handles invokes resize callbacks', () => {
    const onResizeX = vi.fn();
    const onResizeY = vi.fn();
    const onResizeEnd = vi.fn();

    render(
      <ResizableBox
        enabled
        label="Card"
        sizeLabel="1 col"
        onResizeX={onResizeX}
        onResizeY={onResizeY}
        onResizeEnd={onResizeEnd}
      >
        <div>Content</div>
      </ResizableBox>,
    );

    const widthHandle = screen.getByRole('separator', { name: /resize card width/i });
    fireEvent.pointerDown(widthHandle, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(window, { clientX: 220, clientY: 100 });
    fireEvent.pointerUp(window);

    expect(onResizeX).toHaveBeenCalled();
    expect(onResizeX.mock.calls[0][0]).toBe(120);
    expect(onResizeEnd).toHaveBeenCalledTimes(1);

    const heightHandle = screen.getByRole('separator', { name: /resize card height/i });
    fireEvent.pointerDown(heightHandle, { clientX: 100, clientY: 100 });
    fireEvent.pointerMove(window, { clientX: 100, clientY: 180 });
    fireEvent.pointerUp(window);

    expect(onResizeY).toHaveBeenCalled();
    expect(onResizeY.mock.calls[0][0]).toBe(80);
  });
});

describe('PortfolioPreview - Same-Window Edit & Resize', () => {
  const sampleGithubResult = {
    id: 'build-1',
    username: 'ada',
    profile: { login: 'ada', name: 'Ada Lovelace', avatarUrl: 'https://example.com/a.png', htmlUrl: 'https://github.com/ada' },
    aggregateStats: { stars: 10, forks: 2, reposAnalyzed: 1 },
    sections: {
      hero: { headline: 'Analytical Engine Architect', subheadline: 'Computing pioneer', location: 'London', availableFor: 'Open to advisory' },
      about: 'First programmer.',
      projects: [
        { name: 'engine', title: 'Analytical Engine', summary: 'Symbolic computation notes', highlights: ['Algorithm G'], tech: ['Math'], url: 'https://github.com/ada/engine', stars: 10, forks: 2 },
      ],
      skills: { languages: [{ name: 'Python', level: 4 }], tools: ['Git'], domains: ['Algorithms'] },
      callToAction: 'Let us collaborate.',
    },
    layout: {},
  };

  test('supports inline text edit, adding a project, and drag-resizing a project card', () => {
    const onChange = vi.fn();
    render(<PortfolioPreview data={sampleGithubResult} editable onChange={onChange} />);

    // Edit headline inline
    const headlineNode = screen.getByText('Analytical Engine Architect');
    headlineNode.innerText = 'Systems Architect';
    fireEvent.blur(headlineNode);

    expect(onChange).toHaveBeenCalled();
    const afterHeadline = onChange.mock.calls[0][0];
    expect(afterHeadline.sections.hero.headline).toBe('Systems Architect');

    // Add a project
    onChange.mockClear();
    fireEvent.click(screen.getByRole('button', { name: /add project/i }));
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0].sections.projects).toHaveLength(2);

    // Drag project card height handle
    onChange.mockClear();
    const cardHeightHandle = screen.getByRole('separator', { name: /resize card height/i });
    fireEvent.pointerDown(cardHeightHandle, { clientX: 0, clientY: 100 });
    fireEvent.pointerMove(window, { clientX: 0, clientY: 340 });
    fireEvent.pointerUp(window);

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0].layout.projects.engine.cardHeight).toBe(240);
  });
});

describe('StudioSite - In-Canvas Edit & Resize', () => {
  test('renders resize handles and fires onEdit/onAction in editable mode', () => {
    const doc = createDocument({ sample: true });
    const onEdit = vi.fn();
    const onAction = vi.fn();

    render(<StudioSite doc={doc} editable onEdit={onEdit} onAction={onAction} />);

    // Add project button triggers onAction
    fireEvent.click(screen.getByRole('button', { name: /\+ add project/i }));
    expect(onAction).toHaveBeenCalledWith('addItem', expect.objectContaining({ path: 'projects' }));

    // Drag first project card height handle
    const projectHeightHandles = screen.getAllByRole('separator', { name: /resize project height/i });
    fireEvent.pointerDown(projectHeightHandles[0], { clientX: 0, clientY: 0 });
    fireEvent.pointerMove(window, { clientX: 0, clientY: 300 });
    fireEvent.pointerUp(window);

    expect(onEdit).toHaveBeenCalledWith(
      'projects.0.cardHeight',
      300,
      expect.objectContaining({ mergeKey: 'resize:projects.0:y' }),
    );
  });
});
