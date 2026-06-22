export function getSectionOrderSuggestions({
  experience,
  projects,
  education,
  skills,
}) {
  const suggestions = [];

  const hasExperience = experience.some(
    (e) => e.title?.trim()
  );

  const hasProjects = projects.some(
    (p) => p.name?.trim()
  );

  if (!hasExperience && hasProjects) {
    suggestions.push(
      "Place Projects before Education to highlight practical experience."
    );
  }

  if (hasExperience) {
    suggestions.push(
      "Place Experience immediately after Summary."
    );
  }

  if (skills.trim()) {
    suggestions.push(
      "Place Skills before Projects for better ATS visibility."
    );
  }

  return suggestions;
}