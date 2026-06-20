export const analyzePerformance = (sessions) => {
  if (!sessions || sessions.length === 0) {
    return {
  weaknesses: [],
  recurringWeaknesses: [],
  strengths: [],
  recommendations: [],
  improvement: 0,
  averages: {
    communication: 0,
    technical: 0,
    confidence: 0
  }
};
  }

  const avgCommunication =
    sessions.reduce(
      (sum, session) => sum + (session.communication || 0),
      0
    ) / sessions.length;

  const avgTechnical =
    sessions.reduce(
      (sum, session) => sum + (session.technicalAccuracy || 0),
      0
    ) / sessions.length;

  const avgConfidence =
    sessions.reduce(
      (sum, session) => sum + (session.confidence || 0),
      0
    ) / sessions.length;

  const weaknesses = [];
  const strengths = [];
  const recommendations = [];
  const recurringWeaknesses = [];

  // Communication Analysis
  if (avgCommunication < 70) {
  recurringWeaknesses.push("Communication");
    weaknesses.push("Communication");

    recommendations.push(
      "Practice speaking clearly and structure your answers better."
    );
  } else if (avgCommunication >= 80) {
    strengths.push("Communication");
  }

  // Technical Analysis
  if (avgTechnical < 70) {
  recurringWeaknesses.push("Technical Accuracy");
    weaknesses.push("Technical Accuracy");

    recommendations.push(
      "Review core technical concepts and solve more practice questions."
    );
  } else if (avgTechnical >= 80) {
    strengths.push("Technical Knowledge");
  }

  // Confidence Analysis
  if (avgConfidence < 70) {
  recurringWeaknesses.push("Confidence");
    weaknesses.push("Confidence");

    recommendations.push(
      "Participate in more mock interviews to improve confidence."
    );
  } else if (avgConfidence >= 80) {
    strengths.push("Confidence");
  }
  const improvement =
  sessions.length > 1
    ? (
        (
          (sessions[sessions.length - 1].communication || 0) +
          (sessions[sessions.length - 1].technicalAccuracy || 0) +
          (sessions[sessions.length - 1].confidence || 0)
        ) / 3 -
        (
          (sessions[0].communication || 0) +
          (sessions[0].technicalAccuracy || 0) +
          (sessions[0].confidence || 0)
        ) / 3
      ).toFixed(1)
    : 0;

  return {
  weaknesses,
  recurringWeaknesses,
  strengths,
  recommendations,
  improvement,
  averages: {
      communication: avgCommunication.toFixed(1),
      technical: avgTechnical.toFixed(1),
      confidence: avgConfidence.toFixed(1)
    }
  };
};