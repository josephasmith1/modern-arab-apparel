const fs = require('fs');
const path = require('path');

// Read the products data file
const filePath = path.join(__dirname, '../src/data/products/products-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Fixing type errors in products-data.ts...');

// Fix 1: Replace all null originalPrice values with empty string
const originalPricePattern = /"originalPrice":\s*null/g;
let count1 = 0;
content = content.replace(originalPricePattern, (match) => {
  count1++;
  return '"originalPrice": ""';
});
console.log(`Fixed ${count1} null originalPrice values`);

// Fix 2: Fix swatch object structure - extract hex value to separate field
// Pattern to match the current incorrect structure
const swatchPattern = /"swatch":\s*{\s*"hex":\s*"([^"]+)"\s*}/g;
let count2 = 0;
content = content.replace(swatchPattern, (match, hexValue) => {
  count2++;
  // Generate a swatch string from the hex value
  // You could also use color names here if you have a mapping
  return `"swatch": "${hexValue}",\n        "hex": "${hexValue}"`;
});
console.log(`Fixed ${count2} swatch/hex structures`);

// Write the fixed content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('All type errors fixed successfully!');
console.log(`Total fixes: ${count1 + count2}`);