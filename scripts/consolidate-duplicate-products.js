const fs = require('fs');
const path = require('path');

// Read the current products data
const productsData = fs.readFileSync(path.join(__dirname, '../src/app/products/data.ts'), 'utf8');

// Extract the products array from the file
const productsMatch = productsData.match(/export const products = (\[[\s\S]*\]);/);
if (!productsMatch) {
  console.error('Could not find products array in data.ts');
  process.exit(1);
}

// Parse the products
const products = eval(productsMatch[1]);

console.log(`Found ${products.length} products total`);

// Group products by name
const productGroups = {};
products.forEach(product => {
  const name = product.name;
  if (!productGroups[name]) {
    productGroups[name] = [];
  }
  productGroups[name].push(product);
});

// Find and log duplicates
console.log('\nDuplicate products found:');
Object.entries(productGroups).forEach(([name, group]) => {
  if (group.length > 1) {
    console.log(`- ${name}: ${group.length} variants`);
    group.forEach(p => console.log(`  - ${p.slug} (${p.colors.length} colors)`));
  }
});

// Consolidate duplicates
const consolidatedProducts = [];
Object.entries(productGroups).forEach(([name, group]) => {
  if (group.length === 1) {
    // No duplicates, keep as is
    consolidatedProducts.push(group[0]);
  } else {
    // Merge duplicates
    console.log(`\nConsolidating ${name}...`);
    
    // Use the first product as base
    const baseProduct = group[0];
    const mergedProduct = { ...baseProduct };
    
    // Collect all unique colors from all variants
    const allColors = [];
    const colorMap = new Map();
    
    group.forEach(product => {
      product.colors.forEach(color => {
        const key = color.name.toLowerCase();
        if (!colorMap.has(key)) {
          colorMap.set(key, color);
          allColors.push(color);
        }
      });
    });
    
    mergedProduct.colors = allColors;
    console.log(`  Merged ${group.length} products into 1 with ${allColors.length} colors`);
    
    // Merge tags (unique)
    const allTags = new Set();
    group.forEach(product => {
      product.tags.forEach(tag => allTags.add(tag));
    });
    mergedProduct.tags = Array.from(allTags);
    
    consolidatedProducts.push(mergedProduct);
  }
});

console.log(`\nConsolidated from ${products.length} to ${consolidatedProducts.length} products`);

// Generate the new data.ts file
const newDataContent = `export const products = ${JSON.stringify(consolidatedProducts, null, 2)};`;

// Write backup
fs.writeFileSync(
  path.join(__dirname, '../src/app/products/data-before-consolidation.ts'),
  productsData
);

// Write the new data
fs.writeFileSync(
  path.join(__dirname, '../src/app/products/data.ts'),
  newDataContent
);

console.log('\n✅ Products consolidated successfully!');
console.log('Backup saved to: data-before-consolidation.ts');