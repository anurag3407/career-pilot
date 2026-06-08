import React from "react";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

const AXE_CONFIG = {
  runOnly: {
    type: "tag",
    values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
  },
};

async function renderAndAnalyze(ui, axeOptions = AXE_CONFIG) {
  const { container } = render(ui);
  const results = await axe(container, axeOptions);
  return results;
}

// ─── Sample Components ───────────────────────────────────────────────────────

const AccessibleButton = () => (
  <button type="button" aria-label="Submit form">
    Submit
  </button>
);

const AccessibleForm = () => (
  <form aria-label="Login form">
    <div>
      <label htmlFor="email">Email address</label>
      <input
        id="email"
        type="email"
        name="email"
        autoComplete="email"
        aria-required="true"
        placeholder="you@example.com"
      />
    </div>
    <div>
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        name="password"
        autoComplete="current-password"
        aria-required="true"
      />
    </div>
    <button type="submit">Log in</button>
  </form>
);

const AccessibleNav = () => (
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
);

const AccessibleImage = () => (
  <figure>
    <img
      src="https://picsum.photos/400/300"
      alt="A sample landscape photograph"
      width={400}
      height={300}
    />
    <figcaption>A sample landscape photograph used for testing.</figcaption>
  </figure>
);

const AccessibleModal = () => (
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    aria-describedby="modal-desc"
  >
    <h2 id="modal-title">Confirm Action</h2>
    <p id="modal-desc">Are you sure you want to delete this item?</p>
    <button type="button">Cancel</button>
    <button type="button">Delete</button>
  </div>
);

const AccessibleTable = () => (
  <table>
    <caption>Monthly sales data</caption>
    <thead>
      <tr>
        <th scope="col">Month</th>
        <th scope="col">Revenue</th>
        <th scope="col">Units Sold</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">January</th>
        <td>$10,000</td>
        <td>200</td>
      </tr>
      <tr>
        <th scope="row">February</th>
        <td>$12,500</td>
        <td>250</td>
      </tr>
    </tbody>
  </table>
);

const SkipNavigationLayout = () => (
  <div>
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
    <header>
      <nav aria-label="Site navigation">
        <a href="/">Home</a>
      </nav>
    </header>
    <main id="main-content" tabIndex={-1}>
      <h1>Page Title</h1>
      <p>Main content area.</p>
    </main>
  </div>
);

const AccessibleAlert = () => (
  <div>
    <div role="alert" aria-live="assertive">
      <strong>Error:</strong> Please fix the issues below.
    </div>
    <div role="status" aria-live="polite">
      Form saved successfully.
    </div>
  </div>
);

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("Accessibility Tests — axe-core (WCAG 2.1 AA)", () => {

  describe("Button Component", () => {
    it("should have no accessibility violations", async () => {
      const results = await renderAndAnalyze(<AccessibleButton />);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Form Component", () => {
    it("should have no accessibility violations", async () => {
      const results = await renderAndAnalyze(<AccessibleForm />);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Navigation Component", () => {
    it("should have no accessibility violations", async () => {
      const results = await renderAndAnalyze(<AccessibleNav />);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Image Component", () => {
    it("should have no accessibility violations", async () => {
      const results = await renderAndAnalyze(<AccessibleImage />);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Modal / Dialog Component", () => {
    it("should have no accessibility violations", async () => {
      const results = await renderAndAnalyze(<AccessibleModal />);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Table Component", () => {
    it("should have no accessibility violations", async () => {
      const results = await renderAndAnalyze(<AccessibleTable />);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Page Layout", () => {
    it("should have no accessibility violations", async () => {
      const results = await renderAndAnalyze(<SkipNavigationLayout />);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Alert / Live Region", () => {
    it("should have no accessibility violations", async () => {
      const results = await renderAndAnalyze(<AccessibleAlert />);
      expect(results).toHaveNoViolations();
    });
  });

});