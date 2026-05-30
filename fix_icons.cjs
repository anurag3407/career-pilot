const fs = require('fs');
const path = require('path');

const dir = './src';
const exts = ['.js', '.jsx', '.ts', '.tsx'];

const map = {
  Linkedin: 'Globe',
  Github: 'Code',
  Twitter: 'Zap',
  Facebook: 'Zap',
  Instagram: 'Zap',
  Youtube: 'Zap',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const [oldIcon, newIcon] of Object.entries(map)) {
    if (content.includes(oldIcon)) {
      const regexImport = new RegExp(`\\b${oldIcon}\\b`, 'g');
      content = content.replace(regexImport, newIcon);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function traverse(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (exts.includes(path.extname(fullPath))) {
      processFile(fullPath);
    }
  }
}

traverse(dir);
