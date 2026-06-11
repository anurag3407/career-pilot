import fs from 'fs';
const file = './src/data/templates.js';
let content = fs.readFileSync(file, 'utf8');

const idsToMark = [
  '2D_Retro_8bit', '3D_Isometric', 'Abstract_Art', 'Anime_Manga',
  'Architecture_Blueprint', 'Brutalism', 'Casino_Vegas',
  'Chalkboard_Education', 'Cinematic', 'Coffee_Shop'
];

idsToMark.forEach(id => {
  // Find the block for this id and replace isComplete: false with isComplete: true
  // Note: we can use a regex that matches the ID line and then looks for isComplete
  const regex = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?)isComplete:\\s*false`, 'g');
  content = content.replace(regex, '$1isComplete: true');
});

fs.writeFileSync(file, content);
console.log('Marked 10 templates as complete!');
