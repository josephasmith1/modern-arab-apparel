const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, '../src/data/products/products-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Fixing syntax errors in products-data.ts...');

// Fix 1: Replace all instances of "originalPrice": "description": with proper structure
const originalPricePattern = /"originalPrice":\s*"description":/g;
let count1 = 0;
content = content.replace(originalPricePattern, (match) => {
  count1++;
  return '"originalPrice": null,\n    "description":';
});
console.log(`Fixed ${count1} originalPrice/description errors`);

// Fix 2: Replace all instances of "swatch": "hex": with proper object structure
const swatchPattern = /"swatch":\s*"hex":\s*"([^"]+)"/g;
let count2 = 0;
content = content.replace(swatchPattern, (match, hex) => {
  count2++;
  return `"swatch": {\n          "hex": "${hex}"\n        }`;
});
console.log(`Fixed ${count2} swatch/hex errors`);

// Fix 3: Replace all instances of "size": "price": with proper structure
const sizePricePattern = /"size":\s*"price":\s*(\d+)/g;
let count3 = 0;
content = content.replace(sizePricePattern, (match, price) => {
  count3++;
  // Determine size based on context - this is a simplified approach
  // In a real scenario, you'd want to look at the surrounding context
  return `"size": "One Size",\n            "price": ${price}`;
});
console.log(`Fixed ${count3} size/price errors`);

// Write the fixed content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('All syntax errors fixed successfully!');
console.log(`Total fixes: ${count1 + count2 + count3}`);