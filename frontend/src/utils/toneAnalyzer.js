export const analyzeResumeTone = (text = "") => {
  let score = 100;
  const suggestions = [];

  const weakPhrases = {
    helped: "contributed to",
    "worked on": "developed",
    stuff: "tasks",
    things: "responsibilities",
    awesome: "exceptional",
    cool: "innovative",
    good: "effective",
    nice: "valuable"
  };

  Object.entries(weakPhrases).forEach(([weak, replacement]) => {
    if (text.toLowerCase().includes(weak.toLowerCase())) {
      score -= 10;
      suggestions.push(
        `Replace "${weak}" with "${replacement}" for a more professional tone.`
      );
    }
  });

  const strongActionVerbs = [
    "developed",
    "implemented",
    "created",
    "led",
    "optimized",
    "improved",
    "designed",
    "engineered",
    "managed",
    "delivered"
  ];

  const hasStrongVerb = strongActionVerbs.some((verb) =>
    text.toLowerCase().includes(verb)
  );

  if (!hasStrongVerb) {
    score -= 15;
    suggestions.push(
      "Use stronger action verbs such as Developed, Implemented, Led, or Optimized."
    );
  }

  if (text.includes("was") || text.includes("were")) {
    score -= 5;
    suggestions.push(
      "Reduce passive voice and use more direct professional statements."
    );
  }

  return {
    score: Math.max(score, 0),
    suggestions,
  };
};