const fs = require('fs');
const path = require('path');

// Read the product mapping
const productMapping = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'product-files-mapping.json'), 'utf8')
);

// Group products by title
const productsByTitle = {};
productMapping.forEach(product => {
  const title = product.title;
  if (!productsByTitle[title]) {
    productsByTitle[title] = [];
  }
  productsByTitle[title].push(product);
});

// Analyze duplicates and patterns
console.log('=== PRODUCTS GROUPED BY TITLE ===\n');

Object.entries(productsByTitle)
  .sort(([a], [b]) => a.localeCompare(b))
  .forEach(([title, products]) => {
    console.log(`\n${title} (${products.length} file${products.length > 1 ? 's' : ''}):`);
    products.forEach(p => {
      console.log(`  - ${p.filename} → handle: ${p.handle}`);
    });
  });

// Identify potential issues
console.log('\n\n=== POTENTIAL ISSUES & OBSERVATIONS ===\n');

// 1. Multiple files for same product
console.log('1. Products with multiple JSON files:');
Object.entries(productsByTitle).forEach(([title, products]) => {
  if (products.length > 1) {
    console.log(`\n   ${title}:`);
    products.forEach(p => {
      console.log(`     - ${p.filename}`);
    });
  }
});

// 2. Inconsistent naming patterns
console.log('\n2. Naming pattern inconsistencies:');
console.log('   - Some files use "modern-arab-" prefix (with hyphens)');
console.log('   - Some files use "modernarab-" prefix (no hyphen)');
console.log('   - "fisherman-beanie.json" doesn\'t follow either pattern');

// 3. Handle-filename mismatches
console.log('\n3. Files where handle doesn\'t match filename:');
productMapping.forEach(p => {
  const expectedHandle = p.filename.replace('.json', '');
  if (p.handle !== expectedHandle && expectedHandle !== 'fisherman-beanie') {
    console.log(`   - ${p.filename} has handle "${p.handle}"`);
  }
});

// 4. Numbered variants
console.log('\n4. Products with numbered variants (-1 suffix):');
productMapping.forEach(p => {
  if (p.handle.endsWith('-1') || p.filename.includes('-1.json')) {
    console.log(`   - ${p.filename}`);
  }
});

// Create recommendations
console.log('\n\n=== RECOMMENDATIONS ===\n');
console.log('1. Consolidate duplicate product files:');
console.log('   - Modern Arab Beanie has 3 files (fisherman-beanie, modern-arab-beanie-1, modernarab-beanie)');
console.log('   - Modern Arab Bucket Hat has 2 files');
console.log('   - Modern Arab Cap has 2 files');
console.log('   - Modern Arab Hoodie has 2 files (modern-arab-hoodie, modernarab-hoodie)');
console.log('   - Modern Arab Premium Tee has 2 base files plus 2 color variants');
console.log('   - Modern Arab Crewneck has 2 files (base + sand color)');
console.log('   - Modern Arab Tee has multiple files with confusing titles');

console.log('\n2. Standardize naming convention:');
console.log('   - Choose either "modern-arab-" or "modernarab-" and stick to it');
console.log('   - Rename fisherman-beanie.json to follow the pattern');

console.log('\n3. Clarify product variants:');
console.log('   - Determine if files with "-1" suffix are different products or duplicates');
console.log('   - Consider organizing color variants differently');

// Export detailed analysis
const detailedAnalysis = {
  totalFiles: productMapping.length,
  uniqueProducts: Object.keys(productsByTitle).length,
  productsWithMultipleFiles: Object.entries(productsByTitle)
    .filter(([_, products]) => products.length > 1)
    .map(([title, products]) => ({
      title,
      files: products.map(p => p.filename)
    })),
  namingPatterns: {
    'modern-arab-': productMapping.filter(p => p.filename.startsWith('modern-arab-')).length,
    'modernarab-': productMapping.filter(p => p.filename.startsWith('modernarab-')).length,
    'other': productMapping.filter(p => !p.filename.startsWith('modern-arab-') && !p.filename.startsWith('modernarab-')).length
  }
};

fs.writeFileSync(
  path.join(__dirname, 'product-analysis-detailed.json'),
  JSON.stringify(detailedAnalysis, null, 2)
);

console.log('\n\nDetailed analysis saved to: product-analysis-detailed.json');