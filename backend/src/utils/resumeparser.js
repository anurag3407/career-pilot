const SKILLS_DB = [
  // Languages
  "javascript",
  "typescript",
  "java",
  "python",
  "c",
  "c++",
  "c#",
  "php",
  "go",
  "rust",
  "kotlin",
  "swift",
  "sql",

  // Frontend
  "react",
  "next.js",
  "nextjs",
  "vue",
  "angular",
  "redux",
  "tailwind",
  "tailwindcss",
  "bootstrap",
  "material ui",
  "html",
  "html5",
  "css",
  "css3",
  "sass",

  // Backend
  "node",
  "node.js",
  "express",
  "nestjs",
  "spring boot",
  "django",
  "flask",
  "fastapi",
  "laravel",

  // Databases
  "mongodb",
  "mysql",
  "postgresql",
  "postgres",
  "firebase",
  "redis",
  "sqlite",

  // DevOps & Cloud
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "gcp",
  "vercel",
  "netlify",
  "ci/cd",
  "github actions",

  // Tools
  "git",
  "github",
  "postman",
  "figma",
  "jira",
  "linux",
  "vscode",

  // AI / ML
  "machine learning",
  "deep learning",
  "tensorflow",
  "pytorch",
  "opencv",
  "langchain",
  "openai",
  "generative ai",

  // Mobile
  "react native",
  "flutter",
  "android",
  "ios",

  // APIs & Architecture
  "rest api",
  "graphql",
  "microservices",

  // Testing
  "jest",
  "cypress",
  "selenium",
];



function extractSkills(text) {
  const lowerText = text.toLowerCase();

  const foundSkills = SKILLS_DB.filter((skill) => {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(`\\b${escapedSkill}\\b`, "i");

    return regex.test(lowerText);
  });

  return [...new Set(foundSkills)];
}

export { extractSkills };