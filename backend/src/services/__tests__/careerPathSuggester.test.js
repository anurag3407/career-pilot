import { describe, test } from "node:test";
import assert from "node:assert/strict";

import {
  suggestCareerPaths,
  deterministicCareerPathSuggestion,
} from "../careerPathSuggester.js";

describe("careerPathSuggester", () => {
  test("returns AI career suggestions successfully", async () => {
    const mockProvider = {
      generateContent: async () => ({
        text: JSON.stringify({
          currentProfileSummary:
            "Frontend Developer with strong React skills",

          careerPaths: [
            {
              title: "Full Stack Developer",
              matchScore: 88,
              reasoning:
                "Strong frontend foundation makes backend expansion natural.",
              requiredSkills: ["Node.js", "MongoDB"],
              learningRoadmap: [
                "Learn Node.js",
                "Build full stack projects",
              ],
            },
          ],

          recommendedNextSteps: [
            "Build production-grade projects",
          ],
        }),
      }),
    };

    const result = await suggestCareerPaths(
      "Frontend Developer",
      2,
      ["React", "JavaScript"],
      ["AI"],
      mockProvider,
    );

    assert.equal(
      result.currentProfileSummary,
      "Frontend Developer with strong React skills",
    );

    assert.equal(result.careerPaths.length, 1);

    assert.equal(
      result.careerPaths[0].title,
      "Full Stack Developer",
    );

    assert.equal(
      result.careerPaths[0].matchScore,
      88,
    );
  });

  test("parses AI responses wrapped in markdown", async () => {
    const mockProvider = {
      generateContent: async () => ({
        text: `\`\`\`json
{
  "currentProfileSummary": "Frontend Developer",
  "careerPaths": [
    {
      "title": "AI Engineer",
      "matchScore": 80,
      "reasoning": "Interest in AI aligns well.",
      "requiredSkills": ["Python"],
      "learningRoadmap": ["Learn Python"]
    }
  ],
  "recommendedNextSteps": [
    "Build AI projects"
  ]
}
\`\`\``,
      }),
    };

    const result = await suggestCareerPaths(
      "Frontend Developer",
      2,
      ["React"],
      ["AI"],
      mockProvider,
    );

    assert.equal(result.careerPaths.length, 1);

    assert.equal(
      result.careerPaths[0].title,
      "AI Engineer",
    );
  });

  test("falls back to deterministic suggestions when AI fails", async () => {
    const brokenProvider = {
      generateContent: async () => {
        throw new Error("Provider unavailable");
      },
    };

    const result = await suggestCareerPaths(
      "Frontend Developer",
      2,
      ["React", "JavaScript"],
      ["AI"],
      brokenProvider,
    );

    assert.ok(
      result.currentProfileSummary.length > 0,
    );

    assert.ok(
      Array.isArray(result.careerPaths),
    );

    assert.ok(
      result.careerPaths.length > 0,
    );
  });

  test("throws when current role is empty", async () => {
    await assert.rejects(
      async () => {
        await suggestCareerPaths(
          "",
          2,
          ["React"],
          ["AI"],
        );
      },
      /Current role is required/,
    );
  });

  test("clamps AI match scores to 0-100", async () => {
    const mockProvider = {
      generateContent: async () => ({
        text: JSON.stringify({
          currentProfileSummary: "Developer",
          careerPaths: [
            {
              title: "AI Engineer",
              matchScore: 500,
              reasoning: "Reason",
              requiredSkills: [],
              learningRoadmap: [],
            },
          ],
          recommendedNextSteps: [],
        }),
      }),
    };

    const result = await suggestCareerPaths(
      "Developer",
      2,
      [],
      [],
      mockProvider,
    );

    assert.equal(
      result.careerPaths[0].matchScore,
      100,
    );
  });

  test("filters malformed AI arrays", async () => {
    const mockProvider = {
      generateContent: async () => ({
        text: JSON.stringify({
          currentProfileSummary: "Developer",

          careerPaths: [
            {
              title: "AI Engineer",
              matchScore: 80,
              reasoning: "Reason",

              requiredSkills: [
                "Python",
                null,
                42,
              ],

              learningRoadmap: [
                "Learn ML",
                {},
              ],
            },
          ],

          recommendedNextSteps: [
            "Build projects",
            null,
            42,
          ],
        }),
      }),
    };

    const result = await suggestCareerPaths(
      "Developer",
      2,
      [],
      [],
      mockProvider,
    );

    assert.deepEqual(
      result.careerPaths[0].requiredSkills,
      ["Python"],
    );

    assert.deepEqual(
      result.careerPaths[0].learningRoadmap,
      ["Learn ML"],
    );

    assert.deepEqual(
      result.recommendedNextSteps,
      ["Build projects"],
    );
  });
});

describe(
  "deterministicCareerPathSuggestion",
  () => {
    test("returns career paths for known role", () => {
      const result =
        deterministicCareerPathSuggestion(
          "Frontend Developer",
          2,
          ["React", "JavaScript"],
          ["AI"],
        );

      assert.ok(
        result.careerPaths.length > 0,
      );

      assert.equal(
        result.careerPaths[0].title,
        "Full Stack Developer",
      );
    });

    test("returns default paths for unknown role", () => {
      const result =
        deterministicCareerPathSuggestion(
          "Unknown Role",
          5,
          [],
          [],
        );

      assert.ok(
        result.careerPaths.length > 0,
      );

      assert.equal(
        result.careerPaths[0].title,
        "Senior Specialist",
      );
    });

    test("returns recommended next steps", () => {
      const result =
        deterministicCareerPathSuggestion(
          "Backend Developer",
          3,
          ["Node.js"],
          [],
        );

      assert.ok(
        result.recommendedNextSteps.length > 0,
      );
    });
  },
);