import fs from 'fs';
const file = './src/data/templates.js';
let content = fs.readFileSync(file, 'utf8');

const idsToMark = [
  'Comic_Book', 'Culinary_Restaurant', 'CyberSecurity_Hacker', 'Cyberpunk', 'Dark_Mystery', 'Deep_Ocean', 'Developer_IDE', 'Ecommerce_Style', 'F1_Racing', 'Fantasy_RPG', 'Finance_Corporate', 'Geometric_Shapes', 'Glassmorphism', 'Graffiti_StreetArt', 'High_Fashion', 'Holographic', 'MacOS_Desktop', 'Magazine_Editorial', 'Medical_Clean', 'Minimalist_White', 'Monospace_Minimal', 'Music_Vinyl', 'Nature_Forest', 'Neon_Noir', 'Neumorphism', 'Origami_Paper', 'Pastel_Soft', 'Photography_Focus', 'SciFi_HUD', 'Scrapbook', 'Space_Galaxy', 'Sports_Athletic', 'Steampunk', 'Tech_Startup', 'Terminal_CLI', 'Typographic_Heavy', 'Vaporwave', 'Vintage_Newspaper', 'Watercolor_Artistic', 'Windows_98'
];

idsToMark.forEach(id => {
  const regex = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?)isComplete:\\s*false`, 'g');
  content = content.replace(regex, '$1isComplete: true');
});

fs.writeFileSync(file, content);
console.log('Marked remaining 40 templates as complete!');
