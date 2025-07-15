const fs = require('fs');
const path = require('path');

// Read the current products data
const productsDataPath = path.join(__dirname, '../src/data/products/products-data.ts');
const productsData = fs.readFileSync(productsDataPath, 'utf8');

// Extract the products array from the TypeScript file
const productsMatch = productsData.match(/export const products: Product\[\] = (\[[\s\S]*\]);/);
if (!productsMatch) {
  console.error('Could not find products array in products-data.ts');
  process.exit(1);
}

// Parse the products JSON
const productsJson = productsMatch[1];
const products = eval(productsJson);

// List of products that need fixing (single-color products with sizes as color names)
const productsToFix = [
  'modern-arab-crewneck-sand',
  'modern-arab-premium-tee-faded-eucalyptus', 
  'modern-arab-premium-tee-faded-khaki',
  'modernarab-tee-black',
  'modernarab-tee-white',
  'modern-arab-tee-black',
  'modern-arab-tee-white'
];

let fixedCount = 0;

products.forEach(product => {
  if (productsToFix.includes(product.slug)) {
    // Check if this product has size names as colors
    const hasSizeAsColor = product.colors.some(color => 
      ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'].includes(color.name)
    );
    
    if (hasSizeAsColor) {
      console.log(`\nFixing product: ${product.name} (${product.slug})`);
      fixedCount++;
      
      // Determine the actual color based on product info
      let colorName = 'Default';
      const slug = product.slug.toLowerCase();
      const tags = product.tags.map(t => t.toLowerCase());
      const description = product.description.toLowerCase();
      
      if (slug.includes('black') || tags.includes('black') || description.includes('black')) {
        colorName = 'Black';
      } else if (slug.includes('white') || tags.includes('white') || description.includes('white')) {
        colorName = 'White';
      } else if (slug.includes('eucalyptus') || description.includes('eucalyptus')) {
        colorName = 'Faded Eucalyptus';
      } else if (slug.includes('khaki') || description.includes('khaki')) {
        colorName = 'Faded Khaki';
      } else if (slug.includes('sand') || description.includes('sand')) {
        colorName = 'Faded Sand';
      }
      
      // Get the first color's images (they should all be the same for single-color products)
      const firstColor = product.colors[0];
      const images = firstColor.images;
      
      // Collect all size variants
      const variants = [];
      const sizeOrder = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
      
      product.colors.forEach(colorItem => {
        if (sizeOrder.includes(colorItem.name) && colorItem.variants[0]) {
          variants.push({
            size: colorItem.name,
            price: colorItem.variants[0].price,
            sku: colorItem.variants[0].sku,
            available: colorItem.variants[0].available
          });
        }
      });
      
      // Sort variants by size order
      variants.sort((a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size));
      
      // Replace the colors array with a single color containing all size variants
      product.colors = [{
        name: colorName,
        swatch: {
          hex: firstColor.swatch.hex || '#808080'
        },
        images: images,
        variants: variants
      }];
      
      console.log(`  - Fixed to single color: ${colorName} with ${variants.length} size variants`);
    }
  }
});

console.log(`\nFixed ${fixedCount} products`);

// Write the fixed products back to the file
const newContent = `/**
 * Generated product data - DO NOT EDIT MANUALLY
 * This file is auto-generated from the JSON product files
 */

import { Product } from './types';

export const products: Product[] = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync(productsDataPath, newContent);
console.log('\nSuccessfully updated products-data.ts');