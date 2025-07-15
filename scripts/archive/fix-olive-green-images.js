#!/usr/bin/env node

/**
 * Fix Olive Green image paths in modernarab-cropped-hoodie
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING OLIVE GREEN IMAGE PATHS...\n');

// Read the current data.ts file
const dataPath = path.join(__dirname, '..', 'src', 'app', 'products', 'data.ts');
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Replace the empty Olive Green images with correct paths
const updatedContent = dataContent.replace(
  /"name": "Olive Green",\s*"swatch": "",\s*"hex": "#708238",\s*"images": \{\s*"main": "",\s*"back": "",\s*"lifestyle": \[\]\s*\}/,
  `"name": "Olive Green",
        "swatch": "",
        "hex": "#708238",
        "images": {
          "main": "/images/modernarab-cropped-hoodie/olive-green-main.jpg",
          "back": "/images/modernarab-cropped-hoodie/olive-green-back.jpg",
          "lifestyle": [
            "/images/modernarab-cropped-hoodie/lifestyle-1.jpg",
            "/images/modernarab-cropped-hoodie/lifestyle-2.jpg",
            "/images/modernarab-cropped-hoodie/lifestyle-3.jpg",
            "/images/modernarab-cropped-hoodie/lifestyle-4.jpg"
          ]
        }`
);

// Write the updated content back
fs.writeFileSync(dataPath, updatedContent);

console.log('✅ Fixed Olive Green image paths in cropped hoodie');

// Verify the fix
const updatedData = fs.readFileSync(dataPath, 'utf8');
if (updatedData.includes('/images/modernarab-cropped-hoodie/olive-green-main.jpg')) {
  console.log('✅ Verification: Olive Green main image path found');
} else {
  console.log('❌ Verification: Fix may not have worked');
}

console.log('\n🎉 OLIVE GREEN IMAGES FIXED!');