/**
 * fix-button-types.js
 * Walks every .jsx file under frontend/src and adds type="button"
 * to any <button element that is missing an explicit type attribute.
 * Buttons that already have type= are left completely untouched.
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
let totalFiles = 0;
let patchedFiles = 0;
let totalPatches = 0;

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((entry) => {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      walkDir(full, callback);
    } else if (entry.endsWith('.jsx')) {
      callback(full);
    }
  });
}

function patchFile(filePath) {
  totalFiles++;
  const original = fs.readFileSync(filePath, 'utf8');

  /**
   * Match an opening <button tag that does NOT already contain type=
   * The regex matches:
   *   <button          — literal opening
   *   (?![^>]*type=)   — negative lookahead: no type= anywhere before >
   *   ([^>]*)          — capture any other attributes
   *   (>|\/>|\s)       — end of opening tag or whitespace leading into next line
   *
   * We insert type="button" immediately after <button so it is the first prop.
   */
  const patched = original.replace(
    /<button(?![^>]*\btype=)(\s)/g,
    (match, whitespace) => {
      totalPatches++;
      return `<button type="button"${whitespace}`;
    }
  );

  if (patched !== original) {
    fs.writeFileSync(filePath, patched, 'utf8');
    patchedFiles++;
    console.log(`  patched: ${path.relative(SRC_DIR, filePath)}`);
  }
}

console.log('🔧  Patching <button> elements missing type=...\n');
walkDir(SRC_DIR, patchFile);
console.log(`\n✅  Done. Scanned ${totalFiles} files, patched ${patchedFiles} files, applied ${totalPatches} fixes.`);
