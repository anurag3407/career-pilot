const fs = require('fs');

const files = [
  "src/pages/UserProfile.jsx"
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/Globe, Code, Globe/g, 'Globe, Code');
  fs.writeFileSync(f, content, 'utf8');
});
