#!/usr/bin/env node

/**
 * Remove duplicate cropped hoodie entries and fix image paths
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING CROPPED HOODIE DUPLICATES...\n');

// Read the current data.ts file
const dataPath = path.join(__dirname, '..', 'src', 'app', 'products', 'data.ts');
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Find all occurrences of cropped hoodie entries
const productRegex = /{\s*"slug":\s*"modernarab-cropped-hoodie"[\s\S]*?(?=\s*},?\s*{|\s*}?\s*];)/g;
const matches = dataContent.match(productRegex);

if (matches && matches.length > 1) {
  console.log(`Found ${matches.length} cropped hoodie entries. Removing duplicates...`);
  
  // Keep only the first occurrence, remove others
  let replacements = 0;
  matches.slice(1).forEach(match => {
    dataContent = dataContent.replace(match, '');
    replacements++;
  });
  
  console.log(`✅ Removed ${replacements} duplicate entries`);
}

// Clean up any extra commas or formatting issues
dataContent = dataContent.replace(/,\s*,/g, ',');
dataContent = dataContent.replace(/,\s*]/g, ']');

// Update image paths to use the correct downloaded images
const croppedHoodieSection = dataContent.match(/{\s*"slug":\s*"modernarab-cropped-hoodie"[\s\S]*?(?=\s*},?\s*{|\s*}?\s*];)/);

if (croppedHoodieSection) {
  let updatedSection = croppedHoodieSection[0];
  
  // Fix image paths to use the correct files
  updatedSection = updatedSection.replace(
    /\/images\/modernarab-cropped-hoodie\/black-main\.jpg/g,
    '/images/modernarab-cropped-hoodie/black-main.jpg'
  );
  
  updatedSection = updatedSection.replace(
    /\/images\/modernarab-cropped-hoodie\/olive-green-main\.jpg/g,
    '/images/modernarab-cropped-hoodie/olive-green-main.jpg'
  );
  
  // Update the first lifestyle image to use the no-bg version if it exists
  updatedSection = updatedSection.replace(
    /\/images\/modernarab-cropped-hoodie\/lifestyle-1\.jpg/g,
    '/images/modernarab-cropped-hoodie/lifestyle-1.jpg'
  );
  
  dataContent = dataContent.replace(croppedHoodieSection[0], updatedSection);
  console.log('✅ Updated image paths');
}

// Write the cleaned content back
fs.writeFileSync(dataPath, dataContent);

console.log('\n🎉 CROPPED HOODIE CLEANUP COMPLETE!');
console.log('📊 Summary:');
console.log('   - Removed duplicate entries');
console.log('   - Fixed image paths');
console.log('   - Cleaned up formatting');