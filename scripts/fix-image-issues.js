const fs = require('fs');
const path = require('path');

// Read the products data file
const dataPath = path.join(__dirname, '../src/data/products/products-data.ts');
let content = fs.readFileSync(dataPath, 'utf8');

// Issues to fix:
const fixes = [
  // 1. Add lifestyle images to beanies (using the main image as lifestyle too)
  {
    find: /("slug":\s*"modern-arab-beanie-1"[\s\S]*?"Beige"[\s\S]*?"lifestyle":\s*\[)\s*(\])/,
    replace: '$1\n            "/images/modern-arab-beanie-1/beige-lifestyle-1.jpg"\n          $2'
  },
  {
    find: /("slug":\s*"fisherman-beanie"[\s\S]*?"Blue"[\s\S]*?"lifestyle":\s*\[)\s*(\])/,
    replace: '$1\n            "/images/fisherman-beanie/blue-lifestyle-1.jpg"\n          $2'
  },
  {
    find: /("slug":\s*"modern-arab-beanie-2"[\s\S]*?"Olive"[\s\S]*?"lifestyle":\s*\[)\s*(\])/,
    replace: '$1\n            "/images/modernarab-beanie/olive-lifestyle-1.jpg"\n          $2'
  },
  {
    find: /("slug":\s*"modern-arab-beanie-2"[\s\S]*?"Black"[\s\S]*?"lifestyle":\s*\[)\s*(\])/,
    replace: '$1\n            "/images/modernarab-beanie/faded-black-lifestyle-1.jpg"\n          $2'
  },
  
  // 2. Add back image for Modern Arab Cap - Green
  {
    find: /("slug":\s*"modern-arab-cap"[\s\S]*?"Green"[\s\S]*?"main":\s*"\/images\/modern-arab-cap\/green-lifestyle-1\.jpg",)\s*("lifestyle")/,
    replace: '$1\n          "back": "/images/modern-arab-cap/green-lifestyle-1.jpg",\n          $2'
  }
];

// Apply fixes
fixes.forEach((fix, index) => {
  const before = content.length;
  content = content.replace(fix.find, fix.replace);
  const after = content.length;
  
  if (before === after) {
    console.log(`Fix ${index + 1} did not match - pattern may need adjustment`);
  } else {
    console.log(`Fix ${index + 1} applied successfully`);
  }
});

// Write the updated content
fs.writeFileSync(dataPath, content);

console.log('\nImage issues fixed!');
console.log('- Added lifestyle images to 4 beanie products');
console.log('- Added back image for Modern Arab Cap (Green)');
console.log('\nNote: Some products intentionally use the same image for main and back (like beanies which look the same from both angles)');