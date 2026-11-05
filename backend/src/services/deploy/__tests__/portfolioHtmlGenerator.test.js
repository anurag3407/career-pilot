import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildPortfolioBundle } from '../portfolioHtmlGenerator.js';
import { scoreKeywordMatch } from '../../atsScorer.js';

describe('portfolioHtmlGenerator security & integrity', () => {
  it('escapes </script> tag in user data to prevent tag breakout', async () => {
    const maliciousPayload = {
      personal: {
        name: 'Evil Attacker</script><script>alert("pwned")</script>',
        bio: 'Hello </script><img src=x onerror=alert(1)>',
      },
    };

    const bundle = await buildPortfolioBundle(maliciousPayload, 'Cherry_Blossom');
    assert.ok(bundle && bundle.html, 'Generated bundle should include HTML');

    // Assert that raw unescaped </script> from user bio does NOT appear in the script injection
    // JSON stringifies < as \u003c
    assert.ok(
      !bundle.html.includes('Evil Attacker</script>'),
      'Raw </script> tag must not appear unescaped in output'
    );
    assert.ok(
      bundle.html.includes('\\u003c/script>'),
      'Tag open bracket must be escaped as unicode sequence \\u003c'
    );
  });

  it('safely handles replacement patterns like $&, $1, $\' without corrupting output', async () => {
    const payloadWithSpecialTokens = {
      personal: {
        name: 'Regex $& Token',
        title: 'Engineer $1 with $\' quote',
        bio: 'Price is $100 and bonus is $& or $\'',
      },
    };

    const bundle = await buildPortfolioBundle(payloadWithSpecialTokens, 'Swiss_Typography');
    assert.ok(bundle.html.includes('Regex $& Token'));
    assert.ok(bundle.html.includes('Engineer $1 with $\\\' quote') || bundle.html.includes('Engineer $1 with $\' quote'));
    assert.ok(bundle.html.includes('window.__TEMPLATE_ID__ = "Swiss_Typography"'));
  });

  it('safely escapes special characters in document <title>', async () => {
    const xssTitlePayload = {
      personal: {
        name: 'Dev <script>alert(1)</script>',
        title: 'Lead "Hacker" & Architect',
      },
    };

    const bundle = await buildPortfolioBundle(xssTitlePayload, 'Midnight_Gradient');
    assert.ok(bundle.html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
    assert.ok(bundle.html.includes('&quot;Hacker&quot;'));
  });
});

describe('atsScorer word boundary & role matching', () => {
  it('does not falsely match "go" in "Google" or "Django"', () => {
    // Resume text contains "Google" and "Django", but NOT standalone "go" or "golang"
    const resumeWithoutGo = 'Backend developer with expertise in Python, Node, SQL, Docker, Redis, REST APIs, and AWS at Google using Django.';
    const scoreWithoutGo = scoreKeywordMatch(resumeWithoutGo, 'backend developer');

    // Resume text with standalone "Go"
    const resumeWithGo = 'Backend developer with expertise in Python, Node, SQL, Docker, Redis, REST APIs, AWS, and Go at Google using Django.';
    const scoreWithGo = scoreKeywordMatch(resumeWithGo, 'backend developer');

    // Having standalone Go should score strictly higher than only Google/Django
    assert.ok(
      scoreWithGo > scoreWithoutGo,
      `Expected score with Go (${scoreWithGo}) to be strictly higher than score without Go (${scoreWithoutGo})`
    );
  });

  it('matches full stack developer keyword dictionary correctly', () => {
    const fullStackResume = `
      Full Stack Developer proficient in TypeScript, React, Next.js, Node, Express,
      PostgreSQL, Tailwind, Docker, and Git.
    `;
    const score = scoreKeywordMatch(fullStackResume, 'full stack developer');
    assert.ok(score >= 70, `Expected full stack match score >= 70, got ${score}`);
  });
});
