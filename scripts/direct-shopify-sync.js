const fs = require('fs');

// Read Shopify data
const shopifyData = JSON.parse(fs.readFileSync('all-products.json', 'utf8'));

// Direct conversion - no fancy mapping, just use the data as is
const products = shopifyData.products.map(product => {
  // Group variants by color
  const colorMap = {};
  
  product.variants.forEach(variant => {
    const color = variant.option1;
    if (!colorMap[color]) {
      colorMap[color] = {
        name: color,
        swatch: '',
        hex: '', // We'll use a simple color map
        images: {
          main: '',
          back: '',
          lifestyle: []
        },
        variants: []
      };
    }
    
    colorMap[color].variants.push({
      size: variant.option2,
      price: parseFloat(variant.price),
      sku: variant.sku,
      available: variant.available
    });
  });
  
  // Assign images to colors
  product.images.forEach((image, index) => {
    // If image has variant IDs, assign to those colors
    if (image.variant_ids && image.variant_ids.length > 0) {
      image.variant_ids.forEach(variantId => {
        const variant = product.variants.find(v => v.id === variantId);
        if (variant) {
          const color = colorMap[variant.option1];
          if (color && !color.images.main) {
            color.images.main = `/images/${product.handle}/${index}.jpg`;
          }
        }
      });
    } else {
      // General product images - assign to all colors as lifestyle
      Object.values(colorMap).forEach(color => {
        if (index === 0 && !color.images.main) {
          color.images.main = `/images/${product.handle}/${index}.jpg`;
        } else {
          color.images.lifestyle.push(`/images/${product.handle}/${index}.jpg`);
        }
      });
    }
  });
  
  return {
    slug: product.handle,
    name: product.title,
    vendor: product.vendor,
    collection: product.product_type,
    tags: product.tags,
    price: `$${product.variants[0].price}`,
    originalPrice: `$${product.variants[0].price}`,
    description: product.body_html.substring(0, 200) + '...',
    fullDescription: product.body_html,
    features: [],
    specifications: [],
    origin: [],
    careInstructions: [],
    sizes: [...new Set(product.variants.map(v => v.option2))],
    colors: Object.values(colorMap)
  };
});

// Write the data file
const output = `export const products = ${JSON.stringify(products, null, 2)};`;
fs.writeFileSync('../src/app/products/shopify-direct-data.ts', output);

// Generate image download script
let downloadScript = '#!/bin/bash\n\n';
shopifyData.products.forEach(product => {
  downloadScript += `mkdir -p ../public/images/${product.handle}\n`;
  product.images.forEach((image, index) => {
    downloadScript += `curl -s -L "${image.src}" -o "../public/images/${product.handle}/${index}.jpg"\n`;
  });
  downloadScript += '\n';
});

fs.writeFileSync('download-shopify-images-direct.sh', downloadScript);
fs.chmodSync('download-shopify-images-direct.sh', '755');

console.log('✅ Done! Created:');
console.log('- src/app/products/shopify-direct-data.ts');
console.log('- scripts/download-shopify-images-direct.sh');
console.log(`\nTotal products: ${products.length}`);
console.log(`Total images: ${shopifyData.products.reduce((sum, p) => sum + p.images.length, 0)}`);