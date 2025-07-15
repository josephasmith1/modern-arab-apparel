const fs = require('fs');
const path = require('path');

// Read the products data file
const dataPath = path.join(__dirname, '../src/data/products/products-data.ts');
const content = fs.readFileSync(dataPath, 'utf8');

// Extract all image paths from the TypeScript file
const imageMatches = content.match(/\/images\/[^'"]+\.(jpg|png|webp)/g) || [];
const uniqueImages = [...new Set(imageMatches)];

// Check if each image exists
const missing = [];
const existing = [];

uniqueImages.forEach(imagePath => {
  const fullPath = path.join(__dirname, '../public', imagePath);
  if (fs.existsSync(fullPath)) {
    existing.push(imagePath);
  } else {
    missing.push(imagePath);
  }
});

console.log('='.repeat(80));
console.log('FINAL IMAGE VALIDATION REPORT');
console.log('='.repeat(80));
console.log(`Total unique images referenced: ${uniqueImages.length}`);
console.log(`Images that exist: ${existing.length}`);
console.log(`Missing images: ${missing.length}`);

if (missing.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('MISSING IMAGES');
  console.log('='.repeat(80));
  missing.forEach((img, index) => {
    console.log(`${index + 1}. ${img}`);
  });
  console.log('\n❌ There are still missing images that need to be addressed.');
} else {
  console.log('\n✅ All image references are valid! No 400 errors should occur.');
}

// Check for commonly problematic patterns
console.log('\n' + '='.repeat(80));
console.log('PATTERN CHECK');
console.log('='.repeat(80));

const problemPatterns = [
  '/images/modern-arab-tee-black/',
  '/images/modern-arab-tee-white/',
  '/images/fisherman-beanie-',
  '/images/IMG_',
  '/images/MG_'
];

problemPatterns.forEach(pattern => {
  const matches = uniqueImages.filter(img => img.includes(pattern));
  if (matches.length > 0) {
    console.log(`\n${pattern} references found: ${matches.length}`);
    matches.forEach(match => console.log(`  - ${match}`));
  }
});

console.log('\n' + '='.repeat(80));
console.log('VALIDATION COMPLETE');
console.log('='.repeat(80));