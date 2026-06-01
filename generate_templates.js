const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'frontend/src/components/portfolio/templates');
const directories = fs.readdirSync(templatesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

console.log(`Found ${directories.length} directories.`);

const templatesData = directories.map((dir, index) => {
  // Try to find an entry point.
  const dirPath = path.join(templatesDir, dir);
  const files = fs.readdirSync(dirPath);
  
  return {
    id: dir,
    title: dir.replace(/_/g, ' '),
    category: "Portfolio",
    colorScheme: "Colorful", // Default
    layout: "Grid",
    author: "System",
    views: Math.floor(Math.random() * 2000) + 100,
    rating: (Math.random() * 1 + 4).toFixed(1),
    image: `/template-previews/${dir}.png`,
    createdAt: "2026-05-01",
    files: files
  };
});

fs.writeFileSync(path.join(__dirname, 'templates_meta.json'), JSON.stringify(templatesData, null, 2));
console.log('Written to templates_meta.json');
