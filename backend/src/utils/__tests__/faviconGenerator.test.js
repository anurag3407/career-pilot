import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { generateFavicon } from "../faviconGenerator.js";

describe("faviconGenerator", () => {
  test("exports generateFavicon as an ES module utility", () => {
    assert.equal(typeof generateFavicon, "function");
  });

  test("generates an SVG favicon data URI from a name", () => {
    const favicon = generateFavicon("John Doe");

    assert.match(favicon.svg, /<svg[^>]+width="32"[^>]+height="32"/);
    assert.match(favicon.svg, />JD<\/text>/);
    assert.ok(favicon.dataUri.startsWith("data:image/svg+xml;base64,"));
  });

  test("uses U as a fallback initial for empty or whitespace-only names", () => {
    assert.match(generateFavicon().svg, />U<\/text>/);
    assert.match(generateFavicon("").svg, />U<\/text>/);
    assert.match(generateFavicon("   ").svg, />U<\/text>/);
  });

  test("uses the first initial for a single-word name", () => {
    assert.match(generateFavicon("Alice").svg, />A<\/text>/);
  });

  test("uses first and last initials for names with extra spacing", () => {
    assert.match(generateFavicon("  Ada   Lovelace  Byron  ").svg, />AB<\/text>/);
  });

  test("escapes SVG-special characters in initials", () => {
    const favicon = generateFavicon("<script Doe");

    assert.match(favicon.svg, /&lt;D<\/text>/);
    assert.doesNotMatch(favicon.svg, /><D<\/text>/);
  });

  test("generates deterministic output for the same name", () => {
    assert.deepEqual(generateFavicon("Grace Hopper"), generateFavicon("Grace Hopper"));
  });
});
