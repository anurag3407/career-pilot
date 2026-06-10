import fs from 'fs';
import path from 'path';

const base = './src/components/portfolio/templates';
const dirs = fs.readdirSync(base);

dirs.forEach(dir => {
  const filePath = path.join(base, dir, 'index.jsx');
  if (!fs.existsSync(filePath)) return;

  let code = fs.readFileSync(filePath, 'utf8');

  // Fix `function XYZ({ data }) { const { portfolioData: data } = usePortfolio();`
  // also handle variations like `{ data, somethingElse }` or `{ something, data }`
  
  // A generic way: if a function declares a parameter that is the same as the dataVar, and injects it.
  // Let's just do a regex replace on the parameter list. If `data` is in the param destructuring, and `const { portfolioData: data } = usePortfolio();` is inside:
  
  // It's simpler to just replace `{ data }` with `{}` or remove `data,` / `, data`
  const lines = code.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const { portfolioData:')) {
      // Extract the variable name
      const match = lines[i].match(/const \{ portfolioData: (\w+) \} = usePortfolio\(\);/);
      if (match) {
        const varName = match[1];
        // Look at previous line to see if it's a function declaration
        let prevLine = lines[i-1];
        if (prevLine && prevLine.includes(varName)) {
           // If it's something like `function Nav({ data }) {` or `function Nav({ data, ...props }) {`
           // Let's just remove `data` from the destructuring
           const regex1 = new RegExp(`\\{\\s*${varName}\\s*\\}`);
           const regex2 = new RegExp(`\\{\\s*${varName}\\s*,`);
           const regex3 = new RegExp(`,\\s*${varName}\\s*\\}`);
           
           if (regex1.test(prevLine)) {
              lines[i-1] = prevLine.replace(regex1, '()'); // Wait, if it's function Nav({ data }), replacing to Nav() is better, but maybe just `{}` 
              lines[i-1] = lines[i-1].replace(/\(\(\)\)/, '()'); // fix `Nav(())` -> `Nav()`
           } else if (regex2.test(prevLine)) {
              lines[i-1] = prevLine.replace(regex2, '{');
           } else if (regex3.test(prevLine)) {
              lines[i-1] = prevLine.replace(regex3, '}');
           }
        }
      }
    }
  }

  const newCode = lines.join('\n');
  if (code !== newCode) {
    fs.writeFileSync(filePath, newCode);
    console.log(`Fixed shadowing in ${dir}`);
  }
});
