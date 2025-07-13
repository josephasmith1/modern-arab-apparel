const fs = require('fs');

console.log('🔧 Fixing color-specific images...\n');

// Read Shopify data and current products
const shopifyData = JSON.parse(fs.readFileSync('consolidated-products.json', 'utf8'));
const dataContent = fs.readFileSync('../src/app/products/data.ts', 'utf8');
const products = JSON.parse(dataContent.match(/export const products = (\[[\s\S]*?\]);/)[1]);

// Helper to sanitize color names for file paths
function sanitizeColor(colorName) {
  return colorName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Process each product
const downloadCommands = [];
let totalUpdates = 0;

products.forEach(product => {
  const shopifyProduct = shopifyData.products.find(p => p.handle === product.slug);
  if (!shopifyProduct) {
    console.log(`⚠️  No Shopify data for ${product.slug}`);
    return;
  }
  
  console.log(`\n📦 Processing: ${product.name}`);
  
  // Create variant to color mapping
  const variantColorMap = {};
  shopifyProduct.variants.forEach(variant => {
    variantColorMap[variant.id] = variant.option1;
  });
  
  // Track which images belong to which colors
  const colorImageMap = {};
  product.colors.forEach(color => {
    colorImageMap[color.name] = {
      main: null,
      back: null,
      lifestyle: []
    };
  });
  
  // Process each Shopify image
  shopifyProduct.images.forEach((image, index) => {
    const imageUrl = image.src;
    const isBackImage = imageUrl.toLowerCase().includes('back');
    const isLifestyleImage = imageUrl.toLowerCase().includes('_mg_') || 
                           imageUrl.toLowerCase().includes('_img_') || 
                           index > 5;
    
    if (image.variant_ids && image.variant_ids.length > 0) {
      // Image is color-specific
      image.variant_ids.forEach(variantId => {
        const colorName = variantColorMap[variantId];
        const matchingColor = product.colors.find(c => c.name === colorName);
        
        if (matchingColor) {
          const colorSlug = sanitizeColor(colorName);
          let localPath;
          
          if (isBackImage) {
            localPath = `/images/${product.slug}/${colorSlug}-back.jpg`;
            colorImageMap[colorName].back = localPath;
          } else if (isLifestyleImage) {
            const lifestyleIndex = colorImageMap[colorName].lifestyle.length + 1;
            localPath = `/images/${product.slug}/${colorSlug}-lifestyle-${lifestyleIndex}.jpg`;
            colorImageMap[colorName].lifestyle.push(localPath);
          } else {
            localPath = `/images/${product.slug}/${colorSlug}-main.jpg`;
            colorImageMap[colorName].main = localPath;
          }
          
          downloadCommands.push({
            url: imageUrl,
            path: `public${localPath}`,
            product: product.slug,
            color: colorName
          });
        }
      });
    } else {
      // General product image - assign to all colors as lifestyle
      product.colors.forEach(color => {
        const colorSlug = sanitizeColor(color.name);
        const lifestyleIndex = colorImageMap[color.name].lifestyle.length + 1;
        const localPath = `/images/${product.slug}/${colorSlug}-lifestyle-${lifestyleIndex}.jpg`;
        colorImageMap[color.name].lifestyle.push(localPath);
        
        downloadCommands.push({
          url: imageUrl,
          path: `public${localPath}`,
          product: product.slug,
          color: color.name
        });
      });
    }
  });
  
  // Update product colors with new image paths
  product.colors.forEach(color => {
    const images = colorImageMap[color.name];
    
    // Ensure each color has at least a main image
    if (!images.main && shopifyProduct.images.length > 0) {
      const colorSlug = sanitizeColor(color.name);
      images.main = `/images/${product.slug}/${colorSlug}-main.jpg`;
      
      // Use first image as main for colors without specific images
      downloadCommands.push({
        url: shopifyProduct.images[0].src,
        path: `public/images/${product.slug}/${colorSlug}-main.jpg`,
        product: product.slug,
        color: color.name
      });
    }
    
    color.images = {
      main: images.main || color.images.main,
      back: images.back || '',
      lifestyle: images.lifestyle
    };
    
    totalUpdates++;
  });
  
  console.log(`   ✓ ${product.colors.length} colors updated`);
});

// Write updated product data
const output = `export const products = ${JSON.stringify(products, null, 2)};`;
fs.writeFileSync('../src/app/products/data.ts', output);

// Generate download script for color-specific images
let downloadScript = '#!/bin/bash\n\n';
downloadScript += '# Color-specific image download script\n';
downloadScript += `# Total images: ${downloadCommands.length}\n\n`;

const byProduct = {};
downloadCommands.forEach(cmd => {
  if (!byProduct[cmd.product]) byProduct[cmd.product] = [];
  byProduct[cmd.product].push(cmd);
});

Object.entries(byProduct).forEach(([product, commands]) => {
  downloadScript += `echo "Downloading ${commands.length} images for ${product}..."\n`;
  downloadScript += `mkdir -p public/images/${product}\n`;
  
  commands.forEach(cmd => {
    downloadScript += `curl -s -L "${cmd.url}" -o "${cmd.path}"\n`;
  });
  
  downloadScript += '\n';
});

downloadScript += 'echo "✅ Color-specific images downloaded!"\n';

fs.writeFileSync('download-color-specific-images.sh', downloadScript);
fs.chmodSync('download-color-specific-images.sh', '755');

console.log('\n✅ Fix complete!');
console.log(`📊 Updated ${totalUpdates} color variants`);
console.log(`📸 Generated download script for ${downloadCommands.length} images`);
console.log('\n📋 Next steps:');
console.log('1. Run: ./scripts/download-color-specific-images.sh');
console.log('2. Each color will now have its own specific images');
console.log('3. Product pages will show different images for each color variant');