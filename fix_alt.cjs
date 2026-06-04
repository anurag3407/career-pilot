const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'frontend/src'));

let fixedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Match <img ... > or <Image ... > tags exactly
    const imgRegex = /<(img|Image)\b([^>]*?)(\/?)>/g;
    
    content = content.replace(imgRegex, (match, tag, attrs, slash) => {
        if (!attrs.includes('alt=')) {
            let altText = "";
            const srcMatch = attrs.match(/src=\{([^}]+)\}/) || attrs.match(/src="([^"]+)"/) || attrs.match(/src='([^']+)'/);
            if (srcMatch) {
                const src = srcMatch[1];
                if (src.includes('logo')) altText = "logo";
                else if (src.includes('icon')) altText = "icon";
                else if (src.includes('avatar') || src.includes('profile')) altText = "profile avatar";
                else if (src.includes('banner')) altText = "banner image";
            }
            fixedCount++;
            return `<${tag}${attrs} alt="${altText}"${slash}>`;
        }
        return match;
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Fixed missing alt in: ${file}`);
    }
});

console.log(`\nTotal tags fixed: ${fixedCount}`);
