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

console.log(`Found ${products.length} products total\n`);

// Fix products with incorrect color data
const fixedProducts = products.map(product => {
  const fixedProduct = { ...product };
  
  // Check if colors are actually sizes
  const colorNames = product.colors.map(c => c.name);
  const sizePattern = /^(XS|S|M|L|XL|2XL|3XL|4XL|XXL|XXXL)$/;
  const hasOnlySizes = colorNames.every(name => sizePattern.test(name));
  
  if (hasOnlySizes) {
    console.log(`Fixing ${product.name} (${product.slug}) - has sizes as colors`);
    
    // Determine actual color from slug or name
    let actualColor = 'Default';
    let hex = '#808080'; // Default gray
    
    const slugLower = product.slug.toLowerCase();
    const nameLower = product.name.toLowerCase();
    
    if (slugLower.includes('white') || nameLower.includes('white')) {
      actualColor = 'White';
      hex = '#FFFFFF';
    } else if (slugLower.includes('black') || nameLower.includes('black')) {
      actualColor = 'Black';
      hex = '#000000';
    } else if (slugLower.includes('sand')) {
      actualColor = 'Sand';
      hex = '#F5DEB3';
    }
    
    // Keep first color's data but fix the name and hex
    fixedProduct.colors = [{
      ...product.colors[0],
      name: actualColor,
      hex: hex
    }];
    
    console.log(`  Set color to: ${actualColor}`);
  }
  
  // For products with multiple legitimate colors that appear multiple times
  // We'll handle this differently - by ensuring unique product names
  const productGroup = products.filter(p => p.name === product.name);
  if (productGroup.length > 1 && product.colors.length > 1) {
    // Check if all products in group have same colors
    const firstColors = JSON.stringify(productGroup[0].colors.map(c => c.name).sort());
    const allSameColors = productGroup.every(p => 
      JSON.stringify(p.colors.map(c => c.name).sort()) === firstColors
    );
    
    if (allSameColors) {
      // These are duplicates that should be differentiated
      // Add a variant identifier to the name
      const index = productGroup.indexOf(product);
      if (index > 0) {
        fixedProduct.name = `${product.name} - Variant ${index + 1}`;
        console.log(`Renamed duplicate: ${product.name} -> ${fixedProduct.name}`);
      }
    }
  }
  
  return fixedProduct;
});

// Generate the new data.ts file
const newDataContent = `export const products = ${JSON.stringify(fixedProducts, null, 2)};`;

// Write backup
fs.writeFileSync(
  path.join(__dirname, '../src/app/products/data-before-display-fix.ts'),
  productsData
);

// Write the new data
fs.writeFileSync(
  path.join(__dirname, '../src/app/products/data.ts'),
  newDataContent
);

console.log('\n✅ Product display fixed successfully!');
console.log('Backup saved to: data-before-display-fix.ts');

// Summary
const singleColorProducts = fixedProducts.filter(p => p.colors.length === 1).length;
const multiColorProducts = fixedProducts.filter(p => p.colors.length > 1).length;
console.log(`\nSummary:`);
console.log(`- Single color products: ${singleColorProducts}`);
console.log(`- Multi-color products: ${multiColorProducts}`);
console.log(`- Total products: ${fixedProducts.length}`);