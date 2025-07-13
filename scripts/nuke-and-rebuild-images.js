#!/usr/bin/env node

/**
 * NUKE AND REBUILD IMAGES SCRIPT
 * 
 * This script will:
 * 1. Delete ALL incorrect/duplicate images
 * 2. Delete old broken scripts 
 * 3. Download fresh, correct images from Shopify CDN
 * 4. Organize them properly by product and color
 * 5. Generate updated data.ts structure
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load the original Shopify data
const allProductsPath = path.join(__dirname, 'all-products.json');
const allProducts = JSON.parse(fs.readFileSync(allProductsPath, 'utf8'));

console.log('🚀 NUKE AND REBUILD IMAGES SCRIPT STARTING...\n');

// Step 1: Clean up old images and scripts
function nukeOldStuff() {
  console.log('💥 STEP 1: NUKING OLD IMAGES AND SCRIPTS...\n');
  
  const imagesToNuke = [
    '/Users/josephsmith/CascadeProjects/modern-arab-apparel/public/images',
    '/Users/josephsmith/CascadeProjects/modern-arab-apparel/test-faded-green-v2',
    '/Users/josephsmith/CascadeProjects/modern-arab-apparel/test-faded-black',
    '/Users/josephsmith/CascadeProjects/modern-arab-apparel/test-shopify-black-print',
    '/Users/josephsmith/CascadeProjects/modern-arab-apparel/test-shopify-modernarab-tee',
    '/Users/josephsmith/CascadeProjects/modern-arab-apparel/FINAL-IMAGE-TEST'
  ];
  
  const scriptsToNuke = [
    'fix-image-mapping.js',
    'image-mapping-results.json',
    'add-color-hex.js',
    'clean-missing-images.js',
    'consolidate-duplicate-products.js',
    'direct-shopify-sync.js',
    'download-all-images.sh',
    'download-all-shopify-images.sh',
    'download-color-specific-images.sh',
    'download-final-images.sh',
    'download-shopify-images-direct.sh',
    'fast-download.sh',
    'fix-all-image-paths.js',
    'fix-color-images.js',
    'fix-image-mappings-final.js',
    'fix-missing-directories.js',
    'fix-numbered-images-properly.js',
    'fix-product-colors.js',
    'fix-product-display.js',
    'fix-product-images-complete.js',
    'fix-product-slugs.js',
    'fix-slugs-and-images-final.js',
    'map-numbered-images.js',
    'missing-images.json',
    'sync-images-properly.js',
    'update-data-with-proper-images.js'
  ];
  
  // Nuke image directories
  imagesToNuke.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`🗑️  Nuked: ${path.basename(dir)}`);
    }
  });
  
  // Nuke old scripts
  scriptsToNuke.forEach(script => {
    const scriptPath = path.join(__dirname, script);
    if (fs.existsSync(scriptPath)) {
      fs.unlinkSync(scriptPath);
      console.log(`🗑️  Nuked script: ${script}`);
    }
  });
  
  console.log('\n✅ Cleanup completed!\n');
}

// Step 2: Download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    // Create directory if it doesn't exist
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
      file.on('error', reject);
    }).on('error', reject);
  });
}

// Step 3: Identify color from filename
function identifyColor(filename, variantTitle = '') {
  const lowerFilename = filename.toLowerCase();
  const lowerVariant = variantTitle.toLowerCase();
  
  // Check filename first - look for specific patterns
  if (lowerFilename.includes('faded-bone') || lowerFilename.includes('bone')) return 'faded-bone';
  if (lowerFilename.includes('faded-green') || lowerFilename.includes('eucalyptus')) return 'faded-green';
  if (lowerFilename.includes('faded-khaki') || lowerFilename.includes('khaki')) return 'faded-khaki';
  if (lowerFilename.includes('faded-black') || lowerFilename.includes('black')) return 'faded-black';
  if (lowerFilename.includes('faded-sand') || lowerFilename.includes('sand')) return 'faded-sand';
  
  // Check variant title
  if (lowerVariant.includes('faded bone') || lowerVariant.includes('bone')) return 'faded-bone';
  if (lowerVariant.includes('faded green') || lowerVariant.includes('eucalyptus')) return 'faded-green';
  if (lowerVariant.includes('faded khaki') || lowerVariant.includes('khaki')) return 'faded-khaki';
  if (lowerVariant.includes('faded black') || lowerVariant.includes('black')) return 'faded-black';
  if (lowerVariant.includes('faded sand') || lowerVariant.includes('sand')) return 'faded-sand';
  
  // Additional color mappings for other products
  if (lowerFilename.includes('blue') || lowerVariant.includes('blue')) return 'blue';
  if (lowerFilename.includes('white') || lowerVariant.includes('white')) return 'white';
  if (lowerFilename.includes('olive') || lowerVariant.includes('olive')) return 'olive';
  if (lowerFilename.includes('maroon') || lowerVariant.includes('maroon')) return 'maroon';
  if (lowerFilename.includes('vintage-black') || lowerVariant.includes('vintage black')) return 'vintage-black';
  if (lowerFilename.includes('beige') || lowerVariant.includes('beige')) return 'beige';
  if (lowerFilename.includes('green') || lowerVariant.includes('green')) return 'green';
  
  return 'unknown';
}

// Step 4: Categorize image type
function getImageType(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('-back-') || lower.includes('back')) return 'back';
  if (lower.includes('-front-') || lower.includes('front')) return 'front';
  if (lower.includes('lifestyle') || lower.includes('model') || lower.includes('_dsc') || lower.includes('img')) return 'lifestyle';
  return 'main';
}

// Step 5: Clean filename for local storage
function getCleanFilename(originalFilename, color, type, index = null) {
  const ext = path.extname(originalFilename) || '.jpg';
  const colorSlug = color.toLowerCase().replace(/\s+/g, '-');
  
  if (index !== null && type === 'lifestyle') {
    return `${colorSlug}-lifestyle-${index}${ext}`;
  }
  return `${colorSlug}-${type}${ext}`;
}

// Step 6: Process a single product
async function processProduct(product) {
  console.log(`\n📦 Processing: ${product.title} (${product.handle})`);
  console.log(`🖼️  Images: ${product.images.length} | Variants: ${product.variants.length}`);
  
  // Create variant ID to variant info mapping
  const variantMap = {};
  product.variants.forEach(variant => {
    variantMap[variant.id] = variant;
  });
  
  // Organize images by color and type
  const imagesByColor = {};
  const unknownImages = [];
  
  // Process each image
  for (let i = 0; i < product.images.length; i++) {
    const image = product.images[i];
    const originalFilename = path.basename(image.src.split('?')[0]);
    
    // Try to identify color from filename first
    let color = identifyColor(originalFilename);
    
    // If color not found in filename, check variant mapping
    if (color === 'unknown' && image.variant_ids && image.variant_ids.length > 0) {
      const variant = variantMap[image.variant_ids[0]];
      if (variant) {
        color = identifyColor(originalFilename, variant.title);
      }
    }
    
    const imageType = getImageType(originalFilename);
    
    if (color === 'unknown') {
      unknownImages.push({ image, originalFilename, imageType });
      console.log(`  ❓ ${originalFilename} -> UNKNOWN (${imageType})`);
    } else {
      if (!imagesByColor[color]) {
        imagesByColor[color] = { main: [], back: [], front: [], lifestyle: [] };
      }
      
      imagesByColor[color][imageType].push({
        image,
        originalFilename,
        color,
        imageType
      });
      
      console.log(`  ✅ ${originalFilename} -> ${color} (${imageType})`);
    }
  }
  
  // Download organized images
  const downloadPromises = [];
  const productDir = path.join(__dirname, '..', 'public', 'images', product.handle);
  
  // Ensure product directory exists
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir, { recursive: true });
  }
  
  // Download color-specific images
  Object.keys(imagesByColor).forEach(color => {
    const colorImages = imagesByColor[color];
    
    // Download main images (take first 1)
    if (colorImages.main.length > 0) {
      const img = colorImages.main[0];
      const filename = getCleanFilename(img.originalFilename, color, 'main');
      const filepath = path.join(productDir, filename);
      downloadPromises.push(
        downloadImage(img.image.src, filepath).then(() => 
          console.log(`  ⬇️  Downloaded: ${filename}`)
        )
      );
    } else if (colorImages.back.length > 0) {
      // Use back image as main if no main image
      const img = colorImages.back[0];
      const filename = getCleanFilename(img.originalFilename, color, 'main');
      const filepath = path.join(productDir, filename);
      downloadPromises.push(
        downloadImage(img.image.src, filepath).then(() => 
          console.log(`  ⬇️  Downloaded: ${filename} (back as main)`)
        )
      );
    }
    
    // Download back images (take first 1)
    colorImages.back.slice(0, 1).forEach(img => {
      const filename = getCleanFilename(img.originalFilename, color, 'back');
      const filepath = path.join(productDir, filename);
      downloadPromises.push(
        downloadImage(img.image.src, filepath).then(() => 
          console.log(`  ⬇️  Downloaded: ${filename}`)
        )
      );
    });
    
    // Download lifestyle images (take first 5)
    colorImages.lifestyle.slice(0, 5).forEach((img, idx) => {
      const filename = getCleanFilename(img.originalFilename, color, 'lifestyle', idx + 1);
      const filepath = path.join(productDir, filename);
      downloadPromises.push(
        downloadImage(img.image.src, filepath).then(() => 
          console.log(`  ⬇️  Downloaded: ${filename}`)
        )
      );
    });
  });
  
  // Distribute unknown images as lifestyle images across colors
  if (unknownImages.length > 0 && Object.keys(imagesByColor).length > 0) {
    const colors = Object.keys(imagesByColor);
    let colorIndex = 0;
    
    unknownImages.slice(0, 10).forEach((unknownImg, idx) => {
      const color = colors[colorIndex];
      const lifestyleCount = imagesByColor[color].lifestyle.length;
      const filename = getCleanFilename(unknownImg.originalFilename, color, 'lifestyle', lifestyleCount + 1);
      const filepath = path.join(productDir, filename);
      
      downloadPromises.push(
        downloadImage(unknownImg.image.src, filepath).then(() => 
          console.log(`  ⬇️  Downloaded: ${filename} (unknown as lifestyle)`)
        )
      );
      
      colorIndex = (colorIndex + 1) % colors.length;
    });
  }
  
  try {
    await Promise.all(downloadPromises);
    console.log(`  ✅ ${product.handle} completed! Downloaded ${downloadPromises.length} images`);
  } catch (error) {
    console.error(`  ❌ Error downloading images for ${product.handle}:`, error.message);
  }
  
  return {
    handle: product.handle,
    title: product.title,
    imagesByColor: imagesByColor,
    downloadCount: downloadPromises.length
  };
}

// Main execution
async function main() {
  // Step 1: Nuke old stuff
  nukeOldStuff();
  
  // Step 2: Download fresh images
  console.log('📥 STEP 2: DOWNLOADING FRESH IMAGES FROM SHOPIFY...\n');
  
  const results = [];
  let totalDownloaded = 0;
  
  // Process each product
  for (const product of allProducts.products) {
    const result = await processProduct(product);
    results.push(result);
    totalDownloaded += result.downloadCount;
  }
  
  // Step 3: Generate summary
  console.log('\n📊 STEP 3: GENERATING SUMMARY...\n');
  
  const summary = {
    timestamp: new Date().toISOString(),
    totalProducts: results.length,
    totalImagesDownloaded: totalDownloaded,
    products: results
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'rebuild-summary.json'),
    JSON.stringify(summary, null, 2)
  );
  
  console.log('🎉 NUKE AND REBUILD COMPLETED!\n');
  console.log(`📦 Processed: ${results.length} products`);
  console.log(`🖼️  Downloaded: ${totalDownloaded} images`);
  console.log('📋 Summary saved to: scripts/rebuild-summary.json\n');
  
  console.log('🔥 ALL OLD IMAGES AND SCRIPTS NUKED!');
  console.log('✨ FRESH IMAGES DOWNLOADED FROM SHOPIFY!');
  console.log('🚀 READY TO UPDATE DATA.TS!\n');
}

main().catch(console.error);