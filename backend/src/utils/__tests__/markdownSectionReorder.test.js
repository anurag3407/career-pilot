import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { reorderMarkdownBySectionOrder, normalizeSectionHeader } from '../markdownSectionReorder.js';

describe('markdownSectionReorder', () => {
  const sampleMarkdown = `# Alan Turing
alan@example.com | +44 123456 | github.com/aturing

## SUMMARY
Father of modern computer science and artificial intelligence.

## EDUCATION
### Cambridge University
BA in Mathematics, 1934

## EXPERIENCE
### Bletchley Park
Senior Cryptanalyst, 1939 - 1945
* Broke the Enigma cipher
* Designed the Bombe machine

## PROJECTS
### Universal Turing Machine
Theoretical model of computation

## SKILLS
* Cryptanalysis
* Logic
* Mathematics
`;

  test('normalizes section headers properly', () => {
    assert.equal(normalizeSectionHeader('## Professional Summary'), 'summary');
    assert.equal(normalizeSectionHeader('### Work Experience:'), 'experience');
    assert.equal(normalizeSectionHeader('## Technical Skills'), 'skills');
    assert.equal(normalizeSectionHeader('## Academic Background'), 'education');
  });

  test('reorders markdown sections according to sectionOrder', () => {
    const reordered = reorderMarkdownBySectionOrder(sampleMarkdown, ['skills', 'experience', 'education', 'projects']);

    const summaryIdx = reordered.indexOf('## SUMMARY');
    const skillsIdx = reordered.indexOf('## SKILLS');
    const expIdx = reordered.indexOf('## EXPERIENCE');
    const eduIdx = reordered.indexOf('## EDUCATION');
    const projIdx = reordered.indexOf('## PROJECTS');

    assert.ok(summaryIdx < skillsIdx, 'Summary comes first');
    assert.ok(skillsIdx < expIdx, 'Skills comes before Experience');
    assert.ok(expIdx < eduIdx, 'Experience comes before Education');
    assert.ok(eduIdx < projIdx, 'Education comes before Projects');
  });

  test('appends custom sections when specified', () => {
    const customSections = [
      { id: 'honors', title: 'Honors & Awards', kind: 'list', items: ['OBE 1945', 'FRS 1951'], order: 1 }
    ];

    const reordered = reorderMarkdownBySectionOrder(sampleMarkdown, ['honors', 'skills'], customSections);

    assert.ok(reordered.includes('## HONORS & AWARDS'));
    assert.ok(reordered.includes('* OBE 1945'));
    assert.ok(reordered.includes('* FRS 1951'));

    const honorsIdx = reordered.indexOf('## HONORS & AWARDS');
    const skillsIdx = reordered.indexOf('## SKILLS');
    assert.ok(honorsIdx < skillsIdx, 'Honors placed in chosen sectionOrder position');
  });
});
