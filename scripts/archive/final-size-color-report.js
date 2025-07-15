const fs = require('fs');
const path = require('path');

// Read the file
const filePath = path.join(__dirname, '../src/app/products/data.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Size patterns to look for
const sizePatterns = ['S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', 'XXXL', 'XS', '2XS'];

// Find all matches
const lines = content.split('\n');
const results = new Map();

let currentSlug = null;
let currentName = null;
let inColorsArray = false;
let bracketDepth = 0;
let colorEntries = [];
let currentColorEntry = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Track slug
  if (line.includes('"slug":')) {
    const slugMatch = line.match(/"slug":\s*"([^"]+)"/);
    if (slugMatch) {
      // Save previous product if it had issues
      if (currentSlug && colorEntries.some(c => sizePatterns.includes(c.name))) {
        results.set(currentSlug, {
          name: currentName,
          colorEntries: colorEntries,
          sizeColors: colorEntries.filter(c => sizePatterns.includes(c.name)),
          normalColors: colorEntries.filter(c => !sizePatterns.includes(c.name))
        });
      }
      
      currentSlug = slugMatch[1];
      inColorsArray = false;
      colorEntries = [];
    }
  }
  
  // Track product name
  if (line.includes('"name":') && currentSlug && !inColorsArray) {
    const nameMatch = line.match(/"name":\s*"([^"]+)"/);
    if (nameMatch) {
      currentName = nameMatch[1];
    }
  }
  
  // Track when we enter colors array
  if (line.includes('"colors":') && line.includes('[')) {
    inColorsArray = true;
    bracketDepth = 0;
  }
  
  // Track bracket depth
  if (inColorsArray) {
    bracketDepth += (line.match(/\[/g) || []).length;
    bracketDepth -= (line.match(/\]/g) || []).length;
    
    if (bracketDepth <= 0) {
      inColorsArray = false;
    }
  }
  
  // Look for color names
  if (inColorsArray && line.includes('"name":')) {
    const nameMatch = line.match(/"name":\s*"([^"]+)"/);
    if (nameMatch) {
      colorEntries.push({
        name: nameMatch[1],
        line: i + 1
      });
    }
  }
}

// Check last product
if (currentSlug && colorEntries.some(c => sizePatterns.includes(c.name))) {
  results.set(currentSlug, {
    name: currentName,
    colorEntries: colorEntries,
    sizeColors: colorEntries.filter(c => sizePatterns.includes(c.name)),
    normalColors: colorEntries.filter(c => !sizePatterns.includes(c.name))
  });
}

// Display comprehensive results
console.log('=== FINAL COMPREHENSIVE REPORT: PRODUCTS WITH SIZES AS COLORS ===\n');

let index = 1;
for (const [slug, data] of results) {
  console.log(`${index}. ${data.name}`);
  console.log(`   Slug: ${slug}`);
  console.log(`   Total color entries: ${data.colorEntries.length}`);
  console.log(`   Correct color entries: ${data.normalColors.length} (${data.normalColors.map(c => c.name).join(', ')})`);
  console.log(`   Size-named "colors": ${data.sizeColors.length} (${data.sizeColors.map(c => c.name).join(', ')})`);
  console.log(`   Issue severity: ${(data.sizeColors.length / data.colorEntries.length * 100).toFixed(0)}% of colors are actually sizes`);
  console.log('');
  index++;
}

console.log('=== SUMMARY ===\n');
console.log(`Total affected products: ${results.size}`);

const totalSizeEntries = Array.from(results.values()).reduce((sum, p) => sum + p.sizeColors.length, 0);
console.log(`Total size entries incorrectly set as colors: ${totalSizeEntries}`);

console.log('\n=== AFFECTED PRODUCT SLUGS ===\n');
for (const slug of results.keys()) {
  console.log(slug);
}

// Additional analysis
console.log('\n=== ADDITIONAL INSIGHTS ===\n');
for (const [slug, data] of results) {
  if (data.normalColors.length === 0) {
    console.log(`⚠️  ${data.name} (${slug}) has NO actual color variants - only sizes!`);
  } else if (data.normalColors.length === 1) {
    console.log(`📌 ${data.name} (${slug}) has only 1 real color: ${data.normalColors[0].name}`);
  }
}