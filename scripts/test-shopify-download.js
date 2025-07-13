#!/usr/bin/env node

/**
 * Test Shopify Direct Download Script
 * 
 * Downloads images directly from Shopify for specific products to test folders
 * to verify we're getting the correct images before rebuilding everything
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load local JSON data
const allProductsPath = path.join(__dirname, 'all-products.json');
const allProducts = JSON.parse(fs.readFileSync(allProductsPath, 'utf8'));

// Test products to download
const testProducts = [
  {
    name: 'modern-arab-faded-tee-black-print',
    handle: 'modern-arab-faded-tee-black-print',
    testFolder: 'test-shopify-black-print'
  },
  {
    name: 'modernarab-tee', 
    handle: 'modernarab-tee',
    testFolder: 'test-shopify-modernarab-tee'
  }
];

// Function to fetch JSON from URL
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (error) {
          console.error('JSON Parse Error:', error.message);
          console.error('First 500 chars of response:', data.substring(0, 500));
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Function to download image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${path.basename(filepath)}`);
        resolve();
      });
      file.on('error', reject);
    }).on('error', reject);
  });
}

// Function to clean filename
function getCleanFilename(url, prefix = '') {
  const urlParts = url.split('/');
  let filename = urlParts[urlParts.length - 1];
  
  // Remove query parameters
  filename = filename.split('?')[0];
  
  // Add prefix if provided
  if (prefix) {
    filename = `${prefix}-${filename}`;
  }
  
  return filename;
}

// Function to identify color from filename or variant
function identifyColor(filename, variantTitle = '') {
  const lowerFilename = filename.toLowerCase();
  const lowerVariant = variantTitle.toLowerCase();
  
  // Check filename first
  if (lowerFilename.includes('faded-bone') || lowerFilename.includes('bone')) return 'faded-bone';
  if (lowerFilename.includes('faded-green') || lowerFilename.includes('eucalyptus')) return 'faded-green';
  if (lowerFilename.includes('faded-khaki') || lowerFilename.includes('khaki')) return 'faded-khaki';
  if (lowerFilename.includes('faded-black') || lowerFilename.includes('black')) return 'faded-black';
  
  // Check variant title
  if (lowerVariant.includes('faded bone') || lowerVariant.includes('bone')) return 'faded-bone';
  if (lowerVariant.includes('faded green') || lowerVariant.includes('eucalyptus')) return 'faded-green';
  if (lowerVariant.includes('faded khaki') || lowerVariant.includes('khaki')) return 'faded-khaki';
  if (lowerVariant.includes('faded black') || lowerVariant.includes('black')) return 'faded-black';
  
  return 'unknown';
}

// Function to categorize image type
function getImageType(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('-back-') || lower.includes('back')) return 'back';
  if (lower.includes('-front-') || lower.includes('front')) return 'front';
  if (lower.includes('lifestyle') || lower.includes('model')) return 'lifestyle';
  return 'main';
}

async function processProduct(productConfig) {
  console.log(`\n🔄 Processing ${productConfig.name}...`);
  
  try {
    // Find product in local data
    console.log(`📥 Finding product with handle: ${productConfig.handle}`);
    const product = allProducts.products.find(p => p.handle === productConfig.handle);
    
    if (!product) {
      throw new Error(`Product with handle "${productConfig.handle}" not found`);
    }
    
    console.log(`📦 Product: ${product.title}`);
    console.log(`🖼️  Total images: ${product.images.length}`);
    console.log(`🎨 Variants: ${product.variants.length}`);
    
    // Create test folder
    const testDir = path.join(__dirname, '..', productConfig.testFolder);
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
    
    // Organize images by color and type
    const organizedImages = {
      'faded-bone': { main: [], back: [], front: [], lifestyle: [] },
      'faded-green': { main: [], back: [], front: [], lifestyle: [] },
      'faded-khaki': { main: [], back: [], front: [], lifestyle: [] },
      'faded-black': { main: [], back: [], front: [], lifestyle: [] },
      'unknown': { main: [], back: [], front: [], lifestyle: [] }
    };
    
    // Create variant ID to variant info mapping
    const variantMap = {};
    product.variants.forEach(variant => {
      variantMap[variant.id] = variant;
    });
    
    // Process each image
    product.images.forEach((image, index) => {
      const filename = getCleanFilename(image.src);
      
      // Try to identify color from filename first
      let color = identifyColor(filename);
      
      // If color not found in filename, check variant mapping
      if (color === 'unknown' && image.variant_ids && image.variant_ids.length > 0) {
        const variant = variantMap[image.variant_ids[0]];
        if (variant) {
          color = identifyColor(filename, variant.title);
        }
      }
      
      const imageType = getImageType(filename);
      
      organizedImages[color][imageType].push({
        src: image.src,
        filename: filename,
        position: image.position || index,
        variant_ids: image.variant_ids || []
      });
      
      console.log(`📷 Image ${index + 1}: ${filename} -> ${color} (${imageType})`);
    });
    
    // Download organized images
    const downloadPromises = [];
    
    Object.keys(organizedImages).forEach(color => {
      if (color === 'unknown') return; // Skip unknown for now
      
      const colorImages = organizedImages[color];
      
      // Download main images (limit to 2)
      colorImages.main.slice(0, 2).forEach((img, idx) => {
        const filename = `${color}-main-${idx + 1}-${img.filename}`;
        const filepath = path.join(testDir, filename);
        downloadPromises.push(downloadImage(img.src, filepath));
      });
      
      // Download back images (limit to 2)
      colorImages.back.slice(0, 2).forEach((img, idx) => {
        const filename = `${color}-back-${idx + 1}-${img.filename}`;
        const filepath = path.join(testDir, filename);
        downloadPromises.push(downloadImage(img.src, filepath));
      });
      
      // Download front images (limit to 2)
      colorImages.front.slice(0, 2).forEach((img, idx) => {
        const filename = `${color}-front-${idx + 1}-${img.filename}`;
        const filepath = path.join(testDir, filename);
        downloadPromises.push(downloadImage(img.src, filepath));
      });
      
      // Download lifestyle images (limit to 3)
      colorImages.lifestyle.slice(0, 3).forEach((img, idx) => {
        const filename = `${color}-lifestyle-${idx + 1}-${img.filename}`;
        const filepath = path.join(testDir, filename);
        downloadPromises.push(downloadImage(img.src, filepath));
      });
    });
    
    // Also save the analysis
    const analysis = {
      productName: product.title,
      totalImages: product.images.length,
      organizedImages: organizedImages,
      downloadedCount: downloadPromises.length
    };
    
    fs.writeFileSync(
      path.join(testDir, 'analysis.json'),
      JSON.stringify(analysis, null, 2)
    );
    
    await Promise.all(downloadPromises);
    
    console.log(`✅ ${productConfig.name} completed! Downloaded ${downloadPromises.length} images to ${productConfig.testFolder}/`);
    
  } catch (error) {
    console.error(`❌ Error processing ${productConfig.name}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Starting Shopify direct download test...\n');
  
  for (const productConfig of testProducts) {
    await processProduct(productConfig);
  }
  
  console.log('\n🎉 Test download completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Check the test folders for correct images');
  console.log('2. Verify colors are properly identified and organized');
  console.log('3. If correct, we can use this logic to rebuild all images');
}

main().catch(console.error);