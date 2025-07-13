#!/usr/bin/env node

/**
 * Fix remaining broken image paths in data.ts
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING REMAINING BROKEN IMAGE PATHS...\n');

// Read the current data.ts file
const dataPath = path.join(__dirname, '..', 'src', 'app', 'products', 'data.ts');
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Function to check if file exists
function imageExists(imagePath) {
  const fullPath = path.join(__dirname, '..', 'public', imagePath);
  return fs.existsSync(fullPath);
}

// Function to find all available images in a directory
function getAvailableImages(dir) {
  const fullPath = path.join(__dirname, '..', 'public', 'images', dir);
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  return fs.readdirSync(fullPath).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
}

// Fix specific broken paths
const fixes = [
  // Fisherman beanie - only has blue-lifestyle-1.jpg
  { pattern: /\/images\/fisherman-beanie\/blue-lifestyle-[2-4]\.jpg/g, replacement: '/images/fisherman-beanie/blue-lifestyle-1.jpg' },
  
  // Modern Arab Beanie 1 - only has beige-lifestyle-1.jpg  
  { pattern: /\/images\/modern-arab-beanie-1\/beige-lifestyle-[2-5]\.jpg/g, replacement: '/images/modern-arab-beanie-1/beige-lifestyle-1.jpg' },
  
  // Modern Arab Bucket Hat 1 - only has white-lifestyle-1.jpg
  { pattern: /\/images\/modern-arab-bucket-hat-1\/white-lifestyle-[2-7]\.jpg/g, replacement: '/images/modern-arab-bucket-hat-1/white-lifestyle-1.jpg' },
];

let fixCount = 0;

fixes.forEach(({ pattern, replacement }) => {
  const matches = dataContent.match(pattern);
  if (matches) {
    dataContent = dataContent.replace(pattern, replacement);
    fixCount += matches.length;
    console.log(`✅ Fixed ${matches.length} broken paths: ${matches[0]} -> ${replacement}`);
  }
});

// Check for any remaining broken image paths
const imagePathRegex = /["']\/images\/[^"']+["']/g;
const imagePaths = dataContent.match(imagePathRegex) || [];
const uniquePaths = [...new Set(imagePaths)];

console.log(`\n🔍 Checking ${uniquePaths.length} unique image paths...`);

let brokenPaths = 0;
uniquePaths.forEach(pathWithQuotes => {
  const imagePath = pathWithQuotes.slice(1, -1); // Remove quotes
  if (!imageExists(imagePath)) {
    console.log(`❌ Broken path: ${imagePath}`);
    brokenPaths++;
    
    // Try to find a replacement
    const pathParts = imagePath.split('/');
    const dir = pathParts[2]; // /images/directory/file.jpg
    const availableImages = getAvailableImages(dir);
    
    if (availableImages.length > 0) {
      const replacement = `/images/${dir}/${availableImages[0]}`;
      dataContent = dataContent.replace(new RegExp(imagePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
      console.log(`  🔧 Auto-fixed to: ${replacement}`);
      fixCount++;
    }
  }
});

if (brokenPaths === 0) {
  console.log('✅ All image paths are valid!');
} else {
  console.log(`⚠️  Found ${brokenPaths} broken paths`);
}

// Write the updated content back
fs.writeFileSync(dataPath, dataContent);
console.log(`\n✅ Fixed ${fixCount} total broken image paths!`);