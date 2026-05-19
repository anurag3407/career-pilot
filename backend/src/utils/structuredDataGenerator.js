export const generateStructuredData = (portfolio = {}) => {
  const structuredData = [];

  // Person Schema
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "Person",
    name: portfolio.name || "",
    jobTitle: portfolio.jobTitle || portfolio.title || "",
    url: portfolio.url || "",
    sameAs: [
      portfolio.github,
      portfolio.linkedin,
      portfolio.twitter,
      portfolio.website
    ].filter(Boolean)
  });

  // WebSite Schema
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: portfolio.name
      ? `${portfolio.name}'s Portfolio`
      : "Portfolio",
    url: portfolio.url || portfolio.website || ""
  });

  // ItemList Schema for Projects
  if (portfolio.projects && Array.isArray(portfolio.projects)) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: portfolio.projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.name || project.title || "",
        url: project.url || project.link || ""
      }))
    });
  }

  return structuredData;
};