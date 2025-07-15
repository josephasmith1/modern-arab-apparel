const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, '../src/app/products/data.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Size patterns to look for
const sizePatterns = ['S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', 'XXXL', 'XS', '2XS'];

// Find all matches of size names in color context
const lines = content.split('\n');
const results = new Map();

let currentSlug = null;
let currentName = null;
let inColorsArray = false;
let bracketDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Track slug
  if (line.includes('"slug":')) {
    const slugMatch = line.match(/"slug":\s*"([^"]+)"/);
    if (slugMatch) {
      currentSlug = slugMatch[1];
      inColorsArray = false;
    }
  }
  
  // Track product name (first name after slug)
  if (line.includes('"name":') && currentSlug && !inColorsArray) {
    const nameMatch = line.match(/"name":\s*"([^"]+)"/);
    if (nameMatch && !results.has(currentSlug)) {
      currentName = nameMatch[1];
    }
  }
  
  // Track when we enter colors array
  if (line.includes('"colors":') && line.includes('[')) {
    inColorsArray = true;
    bracketDepth = 0;
  }
  
  // Track bracket depth in colors array
  if (inColorsArray) {
    bracketDepth += (line.match(/\[/g) || []).length;
    bracketDepth -= (line.match(/\]/g) || []).length;
    
    if (bracketDepth <= 0) {
      inColorsArray = false;
    }
  }
  
  // Look for size names within colors array
  if (inColorsArray && line.includes('"name":')) {
    const nameMatch = line.match(/"name":\s*"([^"]+)"/);
    if (nameMatch && sizePatterns.includes(nameMatch[1])) {
      if (!results.has(currentSlug)) {
        results.set(currentSlug, {
          name: currentName,
          sizeColors: [],
          lineNumbers: []
        });
      }
      results.get(currentSlug).sizeColors.push(nameMatch[1]);
      results.get(currentSlug).lineNumbers.push(i + 1);
    }
  }
}

// Display results
console.log('=== PRODUCTS WITH SIZES AS COLOR NAMES ===\n');

let index = 1;
for (const [slug, data] of results) {
  console.log(`${index}. ${data.name}`);
  console.log(`   Slug: ${slug}`);
  console.log(`   Size-named colors found: ${data.sizeColors.length}`);
  console.log(`   Sizes: ${data.sizeColors.join(', ')}`);
  console.log(`   Line numbers: ${data.lineNumbers.join(', ')}`);
  console.log('');
  index++;
}

console.log(`Total affected products: ${results.size}`);
console.log(`Total size entries to fix: ${Array.from(results.values()).reduce((sum, p) => sum + p.sizeColors.length, 0)}`);

console.log('\n=== AFFECTED PRODUCT SLUGS ===\n');
for (const slug of results.keys()) {
  console.log(slug);
}