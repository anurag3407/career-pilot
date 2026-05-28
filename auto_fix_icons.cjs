const { execSync } = require('child_process');
const fs = require('fs');

let success = false;
let iterations = 0;
while (!success && iterations < 20) {
  iterations++;
  try {
    console.log(`Iteration ${iterations}...`);
    execSync('npm run build', { stdio: 'pipe' });
    success = true;
    console.log('Build succeeded!');
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString() : '';
    const stdout = error.stdout ? error.stdout.toString() : '';
    const output = stdout + stderr;
    
    // Parse error: "Chrome" is not exported by ... imported by "src/pages/InterviewPrep.jsx"
    const match = output.match(/"([^"]+)" is not exported by "[^"]+", imported by "([^"]+)"/);
    if (match) {
      const missingIcon = match[1];
      const file = match[2];
      console.log(`Missing icon ${missingIcon} in ${file}. Fixing...`);
      let content = fs.readFileSync(file, 'utf8');
      
      // Replace missingIcon import with Globe, and uses of missingIcon with Globe
      // But wait, what if it's already importing Globe?
      const regexImport = new RegExp(`\\b${missingIcon}\\b`, 'g');
      content = content.replace(regexImport, 'Globe');
      
      // Fix duplicate Globe imports
      content = content.replace(/Globe,\s*Globe/g, 'Globe');
      content = content.replace(/Globe,\s*Globe/g, 'Globe');
      
      fs.writeFileSync(file, content, 'utf8');
    } else {
      console.log('Could not parse error. Exiting.');
      console.log(output);
      break;
    }
  }
}
