const fs = require('fs');
const path = require('path');

// Read the products data file
const filePath = path.join(__dirname, '../src/data/products/products-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Fixing image mappings in products-data.ts...');

// Define specific image fixes based on what's actually available
const imageFixes = [
  {
    // Fix the green cap that currently has null back image
    pattern: /"images":\s*{\s*"main":\s*"\/images\/modern-arab-cap\/green-main\.jpg",\s*"back":\s*null,/,
    replacement: '"images": {\n          "main": "/images/modern-arab-cap/green-main.jpg",\n          "back": "/images/modern-arab-cap/green-main.jpg",',
  },
  // Add more specific fixes as needed
];

// Apply all fixes
imageFixes.forEach((fix, index) => {
  const before = content;
  content = content.replace(fix.pattern, fix.replacement);
  if (before !== content) {
    console.log(`Applied fix ${index + 1}: ${fix.pattern.source.substring(0, 50)}...`);
  }
});

// Also check for any remaining null values in image paths and report them
const nullImageMatches = content.match(/"(main|back)":\s*null/g);
if (nullImageMatches) {
  console.log(`\nFound ${nullImageMatches.length} remaining null image references:`);
  nullImageMatches.forEach(match => console.log(`  - ${match}`));
}

// Write the fixed content back
fs.writeFileSync(filePath, content, 'utf8');

console.log('\nImage mapping fixes completed!');

// Now let's also create a more comprehensive mapping based on available images
console.log('\nScanning available images...');

const imagesDir = path.join(__dirname, '../public/images');
const productFolders = fs.readdirSync(imagesDir).filter(f => 
  fs.statSync(path.join(imagesDir, f)).isDirectory() && 
  !['featured', 'hero-1.jpg', 'hero-2.jpg', 'hero-3.jpg', 'hero-4.jpg'].includes(f)
);

const availableImages = {};

productFolders.forEach(folder => {
  const folderPath = path.join(imagesDir, folder);
  const images = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  
  availableImages[folder] = {};
  
  images.forEach(image => {
    // Extract color and type from filename
    const match = image.match(/^(.+?)-(main|back|lifestyle-\d+)\.(jpg|png)$/);
    if (match) {
      const [, color, type] = match;
      if (!availableImages[folder][color]) {
        availableImages[folder][color] = {};
      }
      availableImages[folder][color][type] = `/images/${folder}/${image}`;
    }
  });
});

// Save the available images mapping for reference
fs.writeFileSync(
  path.join(__dirname, 'available-images-mapping.json'),
  JSON.stringify(availableImages, null, 2)
);

console.log('Created available-images-mapping.json for reference');