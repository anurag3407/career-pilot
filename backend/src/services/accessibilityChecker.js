import { JSDOM } from 'jsdom';
import axe from 'axe-core';

export const analyzeAccessibility = async (html) => {
  const dom = new JSDOM(html);

  const { window } = dom;

  global.window = window;
  global.document = window.document;
  global.Node = window.Node;
  global.Element = window.Element;
  global.HTMLElement = window.HTMLElement;

  const results = await axe.run(window.document);

  return {
    violations: results.violations,
    passes: results.passes.length,
  };
};