#!/usr/bin/env node

/**
 * Fix cropped hoodie image paths in data.ts
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING CROPPED HOODIE IMAGE PATHS...\n');

// Read the current data.ts file
const dataPath = path.join(__dirname, '..', 'src', 'app', 'products', 'data.ts');
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Find the cropped hoodie section
const croppedHoodieStart = dataContent.indexOf('"slug": "modernarab-cropped-hoodie"');
if (croppedHoodieStart === -1) {
  console.error('❌ Could not find cropped hoodie in data.ts');
  process.exit(1);
}

// Find the end of this product entry
const nextProductStart = dataContent.indexOf('{\n    "slug":', croppedHoodieStart + 100);
const arrayEnd = dataContent.indexOf(']\n;', croppedHoodieStart);
const endPos = nextProductStart !== -1 ? nextProductStart : arrayEnd;

const croppedHoodieSection = dataContent.substring(croppedHoodieStart - 10, endPos);

// Fix the Black variant images
let updatedSection = croppedHoodieSection;

// Replace empty image paths for Black variant
updatedSection = updatedSection.replace(
  /"name": "Black",[\s\S]*?"images": \{[\s\S]*?"main": "",[\s\S]*?"back": "",[\s\S]*?"lifestyle": \[\]/,
  `"name": "Black",
        "swatch": "",
        "hex": "#000000",
        "images": {
          "main": "/images/modernarab-cropped-hoodie/black-main.jpg",
          "back": "/images/modernarab-cropped-hoodie/black-back.jpg",
          "lifestyle": [
            "/images/modernarab-cropped-hoodie/lifestyle-1.jpg",
            "/images/modernarab-cropped-hoodie/lifestyle-2.jpg",
            "/images/modernarab-cropped-hoodie/lifestyle-3.jpg",
            "/images/modernarab-cropped-hoodie/lifestyle-4.jpg"
          ]
        }`
);

// Update the original content with the fixed section
dataContent = dataContent.substring(0, croppedHoodieStart - 10) + 
              updatedSection + 
              dataContent.substring(endPos);

// Write the updated content back
fs.writeFileSync(dataPath, dataContent);

console.log('✅ Fixed cropped hoodie image paths');

// Verify the images exist
const imageDir = path.join(__dirname, '..', 'public', 'images', 'modernarab-cropped-hoodie');
const requiredImages = [
  'black-main.jpg',
  'black-back.jpg',
  'olive-green-main.jpg',
  'olive-green-back.jpg',
  'lifestyle-1.jpg',
  'lifestyle-2.jpg',
  'lifestyle-3.jpg',
  'lifestyle-4.jpg'
];

console.log('\n🔍 Verifying image files...');
let missingCount = 0;
requiredImages.forEach(img => {
  const imagePath = path.join(imageDir, img);
  if (fs.existsSync(imagePath)) {
    console.log(`✅ ${img}`);
  } else {
    console.log(`❌ ${img} - MISSING`);
    missingCount++;
  }
});

console.log(`\n🎉 CROPPED HOODIE IMAGES FIXED!`);
console.log(`📊 Summary:`);
console.log(`   - Updated Black variant image paths`);
console.log(`   - Verified ${requiredImages.length - missingCount}/${requiredImages.length} images exist`);
if (missingCount === 0) {
  console.log(`   - All required images are available!`);
}