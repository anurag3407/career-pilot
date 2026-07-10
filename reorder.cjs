const fs = require('fs');
const path = require('path');

const filePath = 'frontend/src/data/templates.js';
const raw = fs.readFileSync(filePath, 'utf-8');
const asCJS = raw.replace('export const templates =', 'module.exports =');
fs.writeFileSync('temp_templates.cjs', asCJS);

const templates = require('./temp_templates.cjs');
const idsToTop = [
    'Live_Satellite_Imagery_Feed',
    'Low_Poly_Terrain',
    'Magnetic_Dock',
    'Magnifying_Glass_Hidden_Reveal',
    'Matte_Clay',
    'Medium_Article',
    'Memphis_Pop',
    'Michelin_Star_Chef_Plating',
    'Minimal_Dark_Fluid',
    'Morphing_Blobs'
];

const topTemplates = [];
const otherTemplates = [];

for (const t of templates) {
    if (idsToTop.includes(t.id)) {
        t.isComplete = true; // ensure it is marked complete
        topTemplates.push(t);
    } else {
        otherTemplates.push(t);
    }
}

// Ensure the requested templates are actually at the top, matching the array order
const sortedTop = idsToTop.map(id => topTemplates.find(t => t.id === id)).filter(Boolean);
const reordered = [...sortedTop, ...otherTemplates];

const outString = 'export const templates = ' + JSON.stringify(reordered, null, 2) + ';\n';
fs.writeFileSync(filePath, outString);
fs.unlinkSync('temp_templates.cjs');
