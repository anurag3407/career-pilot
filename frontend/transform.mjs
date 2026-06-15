import fs from 'fs';
import path from 'path';

const base = './src/components/portfolio/templates';
const dirs = fs.readdirSync(base);

dirs.forEach(dir => {
  const filePath = path.join(base, dir, 'index.jsx');
  if (!fs.existsSync(filePath)) return;

  let code = fs.readFileSync(filePath, 'utf8');
  if (!code.includes('dummy_data.json')) return;

  // Find the exact import variable
  const importMatch = code.match(/import\s+(\w+)\s+from\s+['"](?:\.\.\/)+data\/dummy_data\.json['"]/);
  if (!importMatch) return;
  const dataVar = importMatch[1]; // e.g. "data" or "dummyData"

  // Remove the old dummy data import
  code = code.replace(/import\s+\w+\s+from\s+['"](?:\.\.\/)+data\/dummy_data\.json['"];?\n?/, '');

  // Add the PortfolioContext import if missing
  if (!code.includes('usePortfolio')) {
    code = `import { usePortfolio } from "../../../../context/PortfolioContext";\n` + code;
  }

  // Regex to inject `const { portfolioData: data } = usePortfolio();` into functions
  // Matches `function XYZ(...) {` or `const XYZ = (...) => {`
  const functionRegex = /(?:function\s+\w+\s*\([^)]*\)\s*\{|const\s+\w+\s*=\s*(?:\([^)]*\)|\w+)\s*=>\s*\{)/g;
  
  code = code.replace(functionRegex, match => {
    // We unconditionally inject it into every function block that seems like a React component.
    // To be safe, we check if the function body uses `dataVar` before injecting, but regex doesn't easily allow checking body content without balancing braces.
    // As a heuristic, we can inject it into EVERY function whose name starts with an uppercase letter (React component).
    
    // Check if it's a component
    const nameMatch = match.match(/function\s+([A-Z]\w+)/) || match.match(/const\s+([A-Z]\w+)\s*=/);
    if (nameMatch) {
      // It's a React component! Safe to inject.
      return `${match}\n  const { portfolioData: ${dataVar} } = usePortfolio();\n`;
    }
    return match;
  });

  fs.writeFileSync(filePath, code);
  console.log(`Updated ${dir}`);
});
