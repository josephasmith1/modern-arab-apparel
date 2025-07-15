const fs = require('fs');
const path = require('path');

// Read the available images mapping
const availableImages = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'available-images-mapping.json'), 'utf8')
);

// Read the products data file
const filePath = path.join(__dirname, '../src/data/products/products-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Fixing all image mappings in products-data.ts...');

// Function to find the best available image for a given type
function findBestImage(productFolder, color, type) {
  const colorKey = color.toLowerCase().replace(/\s+/g, '-');
  
  if (!availableImages[productFolder] || !availableImages[productFolder][colorKey]) {
    return null;
  }
  
  const colorImages = availableImages[productFolder][colorKey];
  
  // If the exact type exists, use it
  if (colorImages[type]) {
    return colorImages[type];
  }
  
  // If looking for back image and it doesn't exist, use main
  if (type === 'back' && colorImages['main']) {
    return colorImages['main'];
  }
  
  return null;
}

// Pattern to match image objects
const imageBlockPattern = /"images":\s*{\s*"main":\s*"([^"]+)",\s*"back":\s*(?:null|"([^"]*)")/g;

let fixCount = 0;

// Replace all image blocks
content = content.replace(imageBlockPattern, (match, mainPath, backPath) => {
  // Extract product folder and color from the main path
  const pathMatch = mainPath.match(/\/images\/([^\/]+)\/([^-]+)(?:-|\/)/);
  if (!pathMatch) return match;
  
  const [, productFolder, colorPart] = pathMatch;
  
  // Try to determine the color from the path
  let color = colorPart;
  
  // Check if we need to fix the back image
  if (!backPath || backPath === 'null') {
    const bestBackImage = findBestImage(productFolder, color, 'back');
    if (bestBackImage) {
      fixCount++;
      return `"images": {\n          "main": "${mainPath}",\n          "back": "${bestBackImage}"`;
    }
  }
  
  return match;
});

console.log(`Fixed ${fixCount} null/missing back image references`);

// Now let's also fix any incorrect image paths based on what's actually available
// This is a more complex operation that would need careful mapping of product slugs to folders

// Pattern to find product objects
const productPattern = /"slug":\s*"([^"]+)"/g;
const productSlugs = [];
let match;

while ((match = productPattern.exec(content)) !== null) {
  productSlugs.push(match[1]);
}

console.log(`Found ${productSlugs.length} products to verify`);

// Map product slugs to image folders (based on common patterns)
const slugToFolder = {
  'modern-arab-beanie-1': 'modern-arab-beanie-1',
  'fisherman-beanie': 'fisherman-beanie',
  'modern-arab-beanie-2': 'modern-arab-beanie-2',
  'modern-arab-bucket-hat-1': 'modern-arab-bucket-hat-1',
  'modern-arab-bucket-hat': 'modern-arab-bucket-hat',
  'modern-arab-cap-1': 'modern-arab-cap-1',
  'modern-arab-cap': 'modern-arab-cap',
  'modern-arab-crewneck-sand': 'modern-arab-crewneck-sand',
  'modernarab-crewneck': 'modernarab-crewneck',
  'modernarab-cropped-hoodie': 'modernarab-cropped-hoodie',
  'modernarab-tee': 'modernarab-tee',
  'modernarab-tee-black': 'modernarab-tee-black',
  'modernarab-tee-white': 'modernarab-tee-white',
  'modernarab-hoodie': 'modernarab-hoodie',
  'modern-arab-hoodie-2': 'modern-arab-hoodie-2',
  'modern-arab-hoodie': 'modern-arab-hoodie',
  'modern-arab-joggers': 'modern-arab-joggers',
  'modern-arab-premium-tee-1': 'modern-arab-premium-tee-1',
  'modern-arab-faded-tee-black-print': 'modern-arab-faded-tee-black-print',
  'modern-arab-premium-tee': 'modern-arab-premium-tee',
  'modern-arab-premium-tee-faded-eucalyptus': 'modern-arab-premium-tee-faded-eucalyptus',
  'modern-arab-premium-tee-faded-khaki': 'modern-arab-premium-tee-faded-khaki',
  'modern-arab-sweatpants': 'modern-arab-sweatpants'
};

// Write the fixed content back
fs.writeFileSync(filePath, content, 'utf8');

console.log('\nAll image mapping fixes completed!');

// Generate a report of what images are available vs what's being used
const report = {
  timestamp: new Date().toISOString(),
  availableImageFolders: Object.keys(availableImages),
  productSlugs: productSlugs,
  fixesApplied: fixCount
};

fs.writeFileSync(
  path.join(__dirname, 'image-mapping-fix-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('Created image-mapping-fix-report.json');