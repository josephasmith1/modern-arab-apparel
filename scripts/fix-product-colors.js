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

// Check which products have multiple entries with same name
const productsByName = {};
products.forEach(p => {
  if (!productsByName[p.name]) productsByName[p.name] = [];
  productsByName[p.name].push(p);
});

// Find products with multiple entries
console.log('\nProducts with multiple entries:');
Object.entries(productsByName).forEach(([name, prods]) => {
  if (prods.length > 1) {
    console.log(`- ${name}: ${prods.length} entries`);
    prods.forEach(p => {
      console.log(`  - ${p.slug}: ${p.colors.length} colors (${p.colors.map(c => c.name).join(', ')})`);
    });
  }
});

// For products with multiple entries that have the same colors, we should keep them separate
// but ensure each one only shows its primary color
const fixedProducts = products.map(product => {
  // Check if this product has multiple entries with same name
  const sameNameProducts = productsByName[product.name];
  
  if (sameNameProducts.length > 1) {
    // Check if all have the same colors
    const firstColors = JSON.stringify(sameNameProducts[0].colors.map(c => c.name).sort());
    const allSameColors = sameNameProducts.every(p => 
      JSON.stringify(p.colors.map(c => c.name).sort()) === firstColors
    );
    
    if (allSameColors && product.colors.length > 1) {
      console.log(`\nFixing ${product.name} (${product.slug}):`);
      
      // Determine which color this variant should show based on slug or other info
      let primaryColor = null;
      
      // Try to determine primary color from slug
      const slugLower = product.slug.toLowerCase();
      product.colors.forEach(color => {
        const colorNameLower = color.name.toLowerCase().replace(/\s+/g, '-');
        if (slugLower.includes(colorNameLower)) {
          primaryColor = color;
        }
      });
      
      // If we can't determine from slug, check the main image
      if (!primaryColor && product.colors[0].images.main) {
        const mainImage = product.colors[0].images.main;
        product.colors.forEach(color => {
          if (color.images.main === mainImage) {
            primaryColor = color;
          }
        });
      }
      
      // Default to first color if we still can't determine
      if (!primaryColor) {
        primaryColor = product.colors[0];
      }
      
      console.log(`  Primary color: ${primaryColor.name}`);
      
      // Return product with only the primary color
      return {
        ...product,
        colors: [primaryColor]
      };
    }
  }
  
  // Keep product as is
  return product;
});

// Generate the new data.ts file
const newDataContent = `export const products = ${JSON.stringify(fixedProducts, null, 2)};`;

// Write backup
fs.writeFileSync(
  path.join(__dirname, '../src/app/products/data-before-color-fix.ts'),
  productsData
);

// Write the new data
fs.writeFileSync(
  path.join(__dirname, '../src/app/products/data.ts'),
  newDataContent
);

console.log('\n✅ Product colors fixed successfully!');
console.log('Backup saved to: data-before-color-fix.ts');