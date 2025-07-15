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

// Fix products where sizes are used as color names
let fixedCount = 0;
products.forEach(product => {
  // Check if this product has size names as colors
  const hasSizeAsColor = product.colors.some(color => 
    ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'].includes(color.name)
  );
  
  if (hasSizeAsColor) {
    console.log(`\nFixing product: ${product.name} (${product.slug})`);
    fixedCount++;
    
    // Group colors by actual color (hex value)
    const colorGroups = new Map();
    
    product.colors.forEach(color => {
      const hex = color.swatch.hex;
      if (!colorGroups.has(hex)) {
        colorGroups.set(hex, {
          hex: hex,
          items: []
        });
      }
      colorGroups.get(hex).items.push(color);
    });
    
    // Create new colors array with proper color names and all size variants
    const newColors = [];
    
    colorGroups.forEach((group, hex) => {
      // Determine the color name based on hex or product info
      let colorName = 'Default';
      
      // Check product slug and tags for color hints
      const slug = product.slug.toLowerCase();
      const tags = product.tags.map(t => t.toLowerCase());
      const description = product.description.toLowerCase();
      
      if (slug.includes('black') || tags.includes('black') || description.includes('black')) {
        colorName = 'Black';
      } else if (slug.includes('white') || tags.includes('white') || description.includes('white')) {
        colorName = 'White';
      } else if (slug.includes('bone') || description.includes('bone')) {
        colorName = 'Faded Bone';
      } else if (slug.includes('eucalyptus') || description.includes('eucalyptus')) {
        colorName = 'Faded Eucalyptus';
      } else if (slug.includes('khaki') || description.includes('khaki')) {
        colorName = 'Faded Khaki';
      } else if (slug.includes('sand') || description.includes('sand')) {
        colorName = 'Faded Sand';
      }
      
      // Use the first item's images as the main images for this color
      const firstItem = group.items[0];
      
      // Collect all size variants for this color
      const variants = [];
      const sizeOrder = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
      
      group.items.forEach(item => {
        // If the item name is a size, use it; otherwise use the variant size
        let size = item.name;
        if (!sizeOrder.includes(size) && item.variants[0]) {
          size = item.variants[0].size;
        }
        
        if (sizeOrder.includes(size)) {
          variants.push({
            size: size,
            price: item.variants[0].price,
            sku: item.variants[0].sku,
            available: item.variants[0].available
          });
        }
      });
      
      // Sort variants by size order
      variants.sort((a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size));
      
      newColors.push({
        name: colorName,
        swatch: {
          hex: hex
        },
        images: firstItem.images,
        variants: variants.length > 0 ? variants : firstItem.variants
      });
    });
    
    // Update the product's colors
    product.colors = newColors;
    console.log(`  - Fixed ${colorGroups.size} color(s) with proper names`);
    console.log(`  - Colors: ${newColors.map(c => c.name).join(', ')}`);
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