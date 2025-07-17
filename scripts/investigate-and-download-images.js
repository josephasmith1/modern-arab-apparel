#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const JSON_DIR = path.join(__dirname, '..', 'src', 'data', 'products');
const LOCAL_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const REPORT_FILE = path.join(__dirname, 'complete-image-investigation-report.json');

// Helper function to check if a local file exists
function checkLocalImageExists(imagePath) {
  if (!imagePath) return false;
  
  // Handle both absolute and relative paths
  let fullPath;
  if (imagePath.startsWith('/images/')) {
    fullPath = path.join(__dirname, '..', 'public', imagePath);
  } else if (imagePath.startsWith('http')) {
    return false; // Remote URL, needs to be downloaded
  } else {
    fullPath = path.join(LOCAL_IMAGES_DIR, imagePath);
  }
  
  return fs.existsSync(fullPath);
}

// Helper function to extract image filename from URL
function extractFilenameFromUrl(url) {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('?')[0]; // Remove query parameters
}

// Helper function to download image
async function downloadImage(url, localPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(localPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(localPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Helper function to create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Main investigation function
async function investigateAndDownloadImages() {
  console.log('🔍 Starting comprehensive image investigation...');
  
  const investigation = {
    timestamp: new Date().toISOString(),
    products: {},
    summary: {
      totalProducts: 0,
      totalImages: 0,
      missingImages: 0,
      downloadedImages: 0,
      errors: []
    }
  };
  
  try {
    // Read all JSON files
    const files = fs.readdirSync(JSON_DIR)
      .filter(file => file.endsWith('.json') && file !== 'extracted-colors.json')
      .sort();
    
    console.log(`📂 Found ${files.length} product JSON files`);
    investigation.summary.totalProducts = files.length;
    
    for (const file of files) {
      console.log(`\n🔍 Investigating: ${file}`);
      
      try {
        const filePath = path.join(JSON_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const shopifyProduct = JSON.parse(fileContent);
        const product = shopifyProduct.product;
        
        const productSlug = product.handle;
        const productName = product.title;
        
        investigation.products[productSlug] = {
          name: productName,
          slug: productSlug,
          images: [],
          variants: [],
          missingImages: [],
          downloadedImages: [],
          errors: []
        };
        
        // Check main product images
        if (product.images && Array.isArray(product.images)) {
          for (const image of product.images) {
            investigation.summary.totalImages++;
            
            const imageData = {
              id: image.id,
              position: image.position,
              src: image.src,
              alt: image.alt,
              variant_ids: image.variant_ids || [],
              localPath: null,
              exists: false,
              downloaded: false
            };
            
            // Check if image has local path or needs to be downloaded
            if (image.src.startsWith('/images/')) {
              // Already local path
              imageData.localPath = image.src;
              imageData.exists = checkLocalImageExists(image.src);
            } else if (image.src.startsWith('http')) {
              // Remote URL, needs local equivalent
              const filename = extractFilenameFromUrl(image.src);
              const productImageDir = path.join(LOCAL_IMAGES_DIR, productSlug);
              const localPath = path.join(productImageDir, `${image.position}_${filename}`);
              const relativePath = `/images/${productSlug}/${image.position}_${filename}`;
              
              imageData.localPath = relativePath;
              imageData.exists = fs.existsSync(localPath);
              
              if (!imageData.exists) {
                investigation.products[productSlug].missingImages.push({
                  remoteUrl: image.src,
                  localPath: localPath,
                  relativePath: relativePath,
                  position: image.position,
                  filename: filename
                });
                investigation.summary.missingImages++;
                
                // Download missing image
                try {
                  console.log(`📥 Downloading: ${filename}`);
                  ensureDirectoryExists(productImageDir);
                  await downloadImage(image.src, localPath);
                  imageData.downloaded = true;
                  imageData.exists = true;
                  investigation.products[productSlug].downloadedImages.push(relativePath);
                  investigation.summary.downloadedImages++;
                  console.log(`✅ Downloaded: ${relativePath}`);
                } catch (downloadError) {
                  console.error(`❌ Failed to download ${image.src}:`, downloadError.message);
                  investigation.products[productSlug].errors.push({
                    type: 'download_error',
                    url: image.src,
                    error: downloadError.message
                  });
                  investigation.summary.errors.push({
                    product: productSlug,
                    type: 'download_error',
                    url: image.src,
                    error: downloadError.message
                  });
                }
              }
            }
            
            investigation.products[productSlug].images.push(imageData);
          }
        }
        
        // Check variant-specific images
        if (product.variants && Array.isArray(product.variants)) {
          for (const variant of product.variants) {
            const variantData = {
              id: variant.id,
              title: variant.title,
              image_id: variant.image_id,
              hasImage: !!variant.image_id
            };
            
            investigation.products[productSlug].variants.push(variantData);
          }
        }
        
        console.log(`📊 ${productName}: ${investigation.products[productSlug].images.length} images, ${investigation.products[productSlug].missingImages.length} missing, ${investigation.products[productSlug].downloadedImages.length} downloaded`);
        
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
        investigation.summary.errors.push({
          product: file,
          type: 'processing_error',
          error: error.message
        });
      }
    }
    
    // Generate comprehensive report
    console.log('\n📋 Generating comprehensive report...');
    
    // Calculate statistics
    const stats = {
      totalProducts: investigation.summary.totalProducts,
      totalImages: investigation.summary.totalImages,
      missingImages: investigation.summary.missingImages,
      downloadedImages: investigation.summary.downloadedImages,
      totalErrors: investigation.summary.errors.length,
      productsWithMissingImages: Object.values(investigation.products).filter(p => p.missingImages.length > 0).length,
      productsWithDownloadedImages: Object.values(investigation.products).filter(p => p.downloadedImages.length > 0).length
    };
    
    investigation.summary = { ...investigation.summary, ...stats };
    
    // Write detailed report
    fs.writeFileSync(REPORT_FILE, JSON.stringify(investigation, null, 2));
    
    console.log('\n🎉 Investigation Complete!');
    console.log(`📊 Summary:`);
    console.log(`   • Total Products: ${stats.totalProducts}`);
    console.log(`   • Total Images: ${stats.totalImages}`);
    console.log(`   • Missing Images: ${stats.missingImages}`);
    console.log(`   • Downloaded Images: ${stats.downloadedImages}`);
    console.log(`   • Products with Missing Images: ${stats.productsWithMissingImages}`);
    console.log(`   • Products with Downloaded Images: ${stats.productsWithDownloadedImages}`);
    console.log(`   • Total Errors: ${stats.totalErrors}`);
    console.log(`📋 Detailed report saved to: ${REPORT_FILE}`);
    
    // Show errors if any
    if (investigation.summary.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      investigation.summary.errors.forEach(error => {
        console.log(`   • ${error.product}: ${error.error}`);
      });
    }
    
    // Show products that still need attention
    const problemProducts = Object.values(investigation.products).filter(p => 
      p.missingImages.length > 0 || p.errors.length > 0
    );
    
    if (problemProducts.length > 0) {
      console.log('\n⚠️  Products needing attention:');
      problemProducts.forEach(product => {
        console.log(`   • ${product.name}: ${product.missingImages.length} missing, ${product.errors.length} errors`);
      });
    } else {
      console.log('\n✅ All products have complete image sets!');
    }
    
  } catch (error) {
    console.error('❌ Fatal error during investigation:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  investigateAndDownloadImages();
}

module.exports = { investigateAndDownloadImages };