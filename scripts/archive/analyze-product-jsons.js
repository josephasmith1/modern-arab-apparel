const fs = require('fs');
const path = require('path');

// Files to exclude from product analysis
const excludeFiles = [
  'all-products.json',
  'handle-mapping.json',
  'shopify-collections.json',
  'rebuild-summary.json',
  'consolidated-products.json',
  'image-mappings.json'
];

// Function to safely read JSON
function readJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

// Analyze all JSON files
const scriptsDir = __dirname;
const allFiles = fs.readdirSync(scriptsDir).filter(file => file.endsWith('.json'));
const productFiles = allFiles.filter(file => !excludeFiles.includes(file));

console.log(`\nTotal JSON files found: ${allFiles.length}`);
console.log(`Excluded files: ${excludeFiles.length}`);
console.log(`Product files to analyze: ${productFiles.length}\n`);

const productAnalysis = [];
const duplicates = {};
const issues = [];

productFiles.forEach(file => {
  const filePath = path.join(scriptsDir, file);
  const data = readJSON(filePath);
  
  if (data && data.product) {
    const product = data.product;
    const analysis = {
      filename: file,
      handle: product.handle || 'NO_HANDLE',
      title: product.title || 'NO_TITLE',
      id: product.id || 'NO_ID',
      vendor: product.vendor,
      product_type: product.product_type,
      variantCount: product.variants ? product.variants.length : 0
    };
    
    productAnalysis.push(analysis);
    
    // Track duplicates by handle
    if (product.handle) {
      if (!duplicates[product.handle]) {
        duplicates[product.handle] = [];
      }
      duplicates[product.handle].push(file);
    }
  } else {
    issues.push({
      file,
      issue: 'Invalid structure or missing product object'
    });
  }
});

// Sort by handle for better readability
productAnalysis.sort((a, b) => a.handle.localeCompare(b.handle));

console.log('=== PRODUCT FILES ANALYSIS ===\n');
console.log('Filename | Handle | Title | Product ID | Variants');
console.log('-'.repeat(100));

productAnalysis.forEach(p => {
  console.log(`${p.filename.padEnd(40)} | ${p.handle.padEnd(35)} | ${p.title.padEnd(40)} | ${p.id} | ${p.variantCount}`);
});

console.log('\n=== DUPLICATE HANDLES ===\n');
Object.entries(duplicates).forEach(([handle, files]) => {
  if (files.length > 1) {
    console.log(`Handle: ${handle}`);
    files.forEach(file => console.log(`  - ${file}`));
    console.log('');
  }
});

console.log('\n=== NAMING PATTERNS OBSERVED ===\n');
const patterns = {
  'modern-arab-': [],
  'modernarab-': []
};

productFiles.forEach(file => {
  if (file.startsWith('modern-arab-')) {
    patterns['modern-arab-'].push(file);
  } else if (file.startsWith('modernarab-')) {
    patterns['modernarab-'].push(file);
  }
});

Object.entries(patterns).forEach(([pattern, files]) => {
  if (files.length > 0) {
    console.log(`Pattern "${pattern}": ${files.length} files`);
    files.forEach(file => console.log(`  - ${file}`));
    console.log('');
  }
});

if (issues.length > 0) {
  console.log('\n=== ISSUES FOUND ===\n');
  issues.forEach(issue => {
    console.log(`File: ${issue.file}`);
    console.log(`Issue: ${issue.issue}\n`);
  });
}

// Create summary
console.log('\n=== SUMMARY ===\n');
console.log(`Total product files: ${productAnalysis.length}`);
console.log(`Files with issues: ${issues.length}`);
console.log(`Unique handles: ${Object.keys(duplicates).length}`);
console.log(`Duplicate handles: ${Object.entries(duplicates).filter(([_, files]) => files.length > 1).length}`);

// Export mapping for reference
const productMapping = productAnalysis.map(p => ({
  filename: p.filename,
  handle: p.handle,
  title: p.title
}));

fs.writeFileSync(
  path.join(scriptsDir, 'product-files-mapping.json'),
  JSON.stringify(productMapping, null, 2)
);

console.log('\nProduct mapping saved to: product-files-mapping.json');