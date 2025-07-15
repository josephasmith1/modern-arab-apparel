const fs = require('fs');
const path = require('path');

// Read the products data file
const dataPath = path.join(__dirname, '../src/data/products/products-data.ts');
let content = fs.readFileSync(dataPath, 'utf8');

// Get all available images
const imagesDir = path.join(__dirname, '../public/images');
const availableImages = new Set();

function getAllImages(dir, basePath = '') {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllImages(fullPath, path.join(basePath, file));
    } else if (file.match(/\.(jpg|png|webp)$/i)) {
      availableImages.add(path.join(basePath, file));
    }
  });
}

getAllImages(imagesDir);
console.log(`Found ${availableImages.size} images in public/images`);

// Image path fixes based on pattern matching
const fixes = [
  // Fix fisherman beanie paths
  { old: '/images/fisherman-beanie-ecru-front.jpg', new: '/images/fisherman-beanie/blue-lifestyle-1.jpg' },
  { old: '/images/fisherman-beanie-ecru-back.jpg', new: null }, // Remove, no back image
  { old: '/images/fisherman-beanie-petrol-blue-front.jpg', new: '/images/fisherman-beanie/blue-lifestyle-1.jpg' },
  { old: '/images/fisherman-beanie-petrol-blue-back.jpg', new: null }, // Remove, no back image
  
  // Remove non-existent MG_ and IMG_ files
  { old: /\/images\/IMG_\d+.*\.jpg/g, new: null },
  { old: /\/images\/MG_\d+\.jpg/g, new: null },
  { old: /\/images\/.*Facetune.*\.jpg/g, new: null },
];

// Apply fixes
fixes.forEach(fix => {
  if (fix.new === null) {
    // Remove the path from arrays
    if (typeof fix.old === 'string') {
      content = content.replace(new RegExp(`['"]${fix.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"],?\\s*`, 'g'), '');
    } else {
      content = content.replace(fix.old, '');
    }
  } else if (typeof fix.old === 'string') {
    content = content.replace(new RegExp(fix.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fix.new);
  }
});

// Fix empty strings in image arrays
content = content.replace(/['"]["'],?\s*/g, '');

// Clean up arrays with trailing commas
content = content.replace(/,(\s*])/g, '$1');

// Clean up empty arrays
content = content.replace(/images:\s*\[\s*\]/g, 'images: []');

// Remove multiple consecutive commas
content = content.replace(/,\s*,+/g, ',');

// Write the fixed content
fs.writeFileSync(dataPath, content);

// Verify all remaining image paths
const imagePathMatches = content.match(/\/images\/[^'"]+\.(jpg|png|webp)/g) || [];
const uniquePaths = [...new Set(imagePathMatches)];
const brokenPaths = [];

uniquePaths.forEach(imagePath => {
  const relativePath = imagePath.replace(/^\/images\//, '');
  if (!availableImages.has(relativePath)) {
    brokenPaths.push(imagePath);
  }
});

console.log(`\nFixed image paths in products-data.ts`);
console.log(`Remaining broken paths: ${brokenPaths.length}`);
if (brokenPaths.length > 0) {
  console.log('\nStill broken:');
  brokenPaths.forEach(p => console.log(`  ${p}`));
}