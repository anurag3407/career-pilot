export const generateStructuredData = (portfolio = {}) => {
  const structuredData = [];

  const sameAs = [
    portfolio.github,
    portfolio.linkedin,
    portfolio.twitter,
    portfolio.website
  ].filter(Boolean);

  const person = {
    "@context": "https://schema.org",
    "@type": "Person"
  };

  if (portfolio.name) person.name = portfolio.name;
  if (portfolio.jobTitle || portfolio.title) {
    person.jobTitle = portfolio.jobTitle || portfolio.title;
  }
  if (portfolio.url || portfolio.website) {
    person.url = portfolio.url || portfolio.website;
  }
  if (sameAs.length > 0) {
    person.sameAs = sameAs;
  }

  structuredData.push(person);

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite"
  };

  if (portfolio.name) {
    website.name = `${portfolio.name}'s Portfolio`;
  } else {
    website.name = "Portfolio";
  }

  if (portfolio.url || portfolio.website) {
    website.url = portfolio.url || portfolio.website;
  }

  structuredData.push(website);

  if (Array.isArray(portfolio.projects) && portfolio.projects.length > 0) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: portfolio.projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        ...(project.name || project.title
          ? { name: project.name || project.title }
          : {}),
        ...(project.url || project.link
          ? { url: project.url || project.link }
          : {})
      }))
    });
  }

  return structuredData;
};