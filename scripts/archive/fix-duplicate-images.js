#!/usr/bin/env node

/**
 * Fix duplicate image paths and ensure all paths point to existing files
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING DUPLICATE IMAGES AND BROKEN PATHS...\n');

// Read the current data.ts file
const dataPath = path.join(__dirname, '..', 'src', 'app', 'products', 'data.ts');
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Function to check if file exists
function imageExists(imagePath) {
  const fullPath = path.join(__dirname, '..', 'public', imagePath);
  return fs.existsSync(fullPath);
}

// Function to get available images in a directory
function getAvailableImages(dir) {
  const fullPath = path.join(__dirname, '..', 'public', 'images', dir);
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  return fs.readdirSync(fullPath).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
}

// Function to find the best replacement image
function findBestReplacement(originalPath) {
  const pathParts = originalPath.split('/');
  const dir = pathParts[2]; // /images/directory/file.jpg
  const filename = pathParts[3];
  
  // Check if original exists
  if (imageExists(originalPath)) {
    return originalPath;
  }
  
  // Get available images in the directory
  const availableImages = getAvailableImages(dir);
  if (availableImages.length === 0) {
    console.log(`❌ No images found in directory: ${dir}`);
    return null;
  }
  
  // Try to find a similar image
  const colorMatch = filename.match(/(faded-black|faded-bone|faded-green|faded-khaki|black|white|blue|green|khaki|bone|beige)/);
  const typeMatch = filename.match(/(main|back|lifestyle)/);
  
  if (colorMatch && typeMatch) {
    const color = colorMatch[1];
    const type = typeMatch[1];
    
    // Look for exact match
    const exactMatch = availableImages.find(img => 
      img.includes(color) && img.includes(type)
    );
    if (exactMatch) {
      return `/images/${dir}/${exactMatch}`;
    }
    
    // Look for color match
    const colorMatchImg = availableImages.find(img => img.includes(color));
    if (colorMatchImg) {
      return `/images/${dir}/${colorMatchImg}`;
    }
  }
  
  // Fallback to first available image
  return `/images/${dir}/${availableImages[0]}`;
}

// Function to clean and deduplicate lifestyle arrays
function cleanLifestyleArray(lifestyleStr) {
  // Extract the array content
  const arrayMatch = lifestyleStr.match(/\[(.*)\]/s);
  if (!arrayMatch) return lifestyleStr;
  
  const arrayContent = arrayMatch[1];
  const paths = [];
  
  // Extract all quoted paths
  const pathMatches = arrayContent.match(/"[^"]+"/g) || [];
  
  // Deduplicate and validate paths
  const uniquePaths = [];
  const seenPaths = new Set();
  
  for (const pathMatch of pathMatches) {
    const path = pathMatch.slice(1, -1); // Remove quotes
    
    if (!seenPaths.has(path)) {
      seenPaths.add(path);
      const replacement = findBestReplacement(path);
      if (replacement && !uniquePaths.includes(replacement)) {
        uniquePaths.push(replacement);
      }
    }
  }
  
  // Limit to maximum 5 lifestyle images
  const limitedPaths = uniquePaths.slice(0, 5);
  
  // Format back to array string
  if (limitedPaths.length === 0) {
    return '[]';
  }
  
  return '[\n            ' + limitedPaths.map(p => `"${p}"`).join(',\n            ') + '\n          ]';
}

// Function to fix main and back image paths
function fixImagePath(imagePath) {
  if (!imagePath || imagePath === '""') return '""';
  
  const path = imagePath.slice(1, -1); // Remove quotes
  const replacement = findBestReplacement(path);
  
  return replacement ? `"${replacement}"` : '""';
}

// Fix lifestyle arrays with duplicates
console.log('🔍 Finding and fixing duplicate lifestyle arrays...');
const lifestyleArrayRegex = /"lifestyle":\s*\[[^\]]*\]/g;
const lifestyleMatches = dataContent.match(lifestyleArrayRegex) || [];

let fixedArrays = 0;
lifestyleMatches.forEach(match => {
  const cleanedArray = cleanLifestyleArray(match);
  if (cleanedArray !== match) {
    dataContent = dataContent.replace(match, `"lifestyle": ${cleanedArray}`);
    fixedArrays++;
  }
});

console.log(`✅ Fixed ${fixedArrays} lifestyle arrays with duplicates`);

// Fix main image paths
console.log('🔍 Fixing main image paths...');
const mainImageRegex = /"main":\s*"[^"]*"/g;
const mainMatches = dataContent.match(mainImageRegex) || [];

let fixedMains = 0;
mainMatches.forEach(match => {
  const pathMatch = match.match(/"main":\s*(".*")/);
  if (pathMatch) {
    const originalPath = pathMatch[1];
    const fixedPath = fixImagePath(originalPath);
    if (fixedPath !== originalPath) {
      dataContent = dataContent.replace(match, `"main": ${fixedPath}`);
      fixedMains++;
    }
  }
});

console.log(`✅ Fixed ${fixedMains} main image paths`);

// Fix back image paths
console.log('🔍 Fixing back image paths...');
const backImageRegex = /"back":\s*"[^"]*"/g;
const backMatches = dataContent.match(backImageRegex) || [];

let fixedBacks = 0;
backMatches.forEach(match => {
  const pathMatch = match.match(/"back":\s*(".*")/);
  if (pathMatch) {
    const originalPath = pathMatch[1];
    const fixedPath = fixImagePath(originalPath);
    if (fixedPath !== originalPath) {
      dataContent = dataContent.replace(match, `"back": ${fixedPath}`);
      fixedBacks++;
    }
  }
});

console.log(`✅ Fixed ${fixedBacks} back image paths`);

// Write the updated content
fs.writeFileSync(dataPath, dataContent);

console.log('\n🎉 DUPLICATE IMAGE CLEANUP COMPLETE!');
console.log(`📊 Summary:`);
console.log(`   - Fixed ${fixedArrays} lifestyle arrays`);
console.log(`   - Fixed ${fixedMains} main images`);
console.log(`   - Fixed ${fixedBacks} back images`);
console.log(`   - Removed duplicate entries`);
console.log(`   - Ensured all paths point to existing files\n`);