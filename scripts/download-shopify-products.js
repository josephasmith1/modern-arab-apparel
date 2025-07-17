const fs = require('fs');
const path = require('path');
const https = require('https');

const PRODUCTS_DIR = path.join(process.cwd(), 'src/data/products');
const BACKUP_DIR = path.join(process.cwd(), 'src/data/products-backup');

// Product URLs from the sitemap
const PRODUCT_URLS = [
  'https://modernarabapparel.com/products/modernarab-tee',
  'https://modernarabapparel.com/products/modernarab-tee-white',
  'https://modernarabapparel.com/products/modernarab-tee-black',
  'https://modernarabapparel.com/products/modernarab-crewneck',
  'https://modernarabapparel.com/products/modernarab-crewneck-sand',
  'https://modernarabapparel.com/products/modern-arab-cap',
  'https://modernarabapparel.com/products/modern-arab-bucket-hat',
  'https://modernarabapparel.com/products/modernarab-beanie',
  'https://modernarabapparel.com/products/modernarab-hoodie',
  'https://modernarabapparel.com/products/modernarab-cropped-hoodie',
  'https://modernarabapparel.com/products/modern-arab-joggers',
  'https://modernarabapparel.com/products/modern-arab-hoodie',
  'https://modernarabapparel.com/products/modern-arab-cap-1',
  'https://modernarabapparel.com/products/modern-arab-bucket-hat-1',
  'https://modernarabapparel.com/products/modern-arab-beanie-1',
  'https://modernarabapparel.com/products/fisherman-beanie',
  'https://modernarabapparel.com/products/modern-arab-sweatpants',
  'https://modernarabapparel.com/products/modern-arab-premium-tee',
  'https://modernarabapparel.com/products/modern-arab-premium-tee-1',
  'https://modernarabapparel.com/products/modern-arab-premium-tee-faded-eucalyptus',
  'https://modernarabapparel.com/products/modern-arab-premium-tee-faded-khaki',
  'https://modernarabapparel.com/products/modern-arab-faded-tee-black-print'
];

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Function to download JSON from URL
function downloadJSON(url) {
  return new Promise((resolve, reject) => {
    const jsonUrl = url + '.json';
    console.log(`Downloading: ${jsonUrl}`);
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    };
    
    https.get(jsonUrl, options, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadJSON(response.headers.location.replace('.json', ''));
      }
      
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          if (data.startsWith('<!DOCTYPE') || data.startsWith('<html')) {
            reject(new Error(`Received HTML instead of JSON from ${jsonUrl}`));
            return;
          }
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON from ${jsonUrl}: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Failed to download ${jsonUrl}: ${error.message}`));
    });
  });
}

// Function to backup existing file
function backupFile(filePath) {
  if (fs.existsSync(filePath)) {
    const fileName = path.basename(filePath);
    const backupPath = path.join(BACKUP_DIR, fileName);
    fs.copyFileSync(filePath, backupPath);
    console.log(`Backed up: ${fileName}`);
  }
}

// Function to get slug from URL
function getSlugFromUrl(url) {
  return url.split('/').pop();
}

// Main function to download all products
async function downloadAllProducts() {
  try {
    console.log('Starting download of fresh Shopify product data...\n');
    
    // Get unique URLs (remove duplicates)
    const uniqueUrls = [...new Set(PRODUCT_URLS)];
    console.log(`Found ${uniqueUrls.length} unique product URLs\n`);
    
    for (const url of uniqueUrls) {
      try {
        const slug = getSlugFromUrl(url);
        const fileName = `${slug}.json`;
        const filePath = path.join(PRODUCTS_DIR, fileName);
        
        // Backup existing file
        backupFile(filePath);
        
        // Download fresh data
        const productData = await downloadJSON(url);
        
        // Verify the JSON has CDN URLs and not local paths
        const sampleImageSrc = productData.product?.images?.[0]?.src;
        if (sampleImageSrc && !sampleImageSrc.startsWith('https://cdn.shopify.com')) {
          console.log(`⚠️  Warning: ${fileName} has local paths instead of CDN URLs`);
          console.log(`   Sample image src: ${sampleImageSrc}`);
        }
        
        // Write the fresh JSON file
        fs.writeFileSync(filePath, JSON.stringify(productData, null, 2));
        console.log(`✅ Downloaded: ${fileName}`);
        console.log(`   Title: ${productData.product?.title || 'Unknown'}`);
        console.log(`   Images: ${productData.product?.images?.length || 0}`);
        console.log(`   Variants: ${productData.product?.variants?.length || 0}`);
        console.log(`   First image: ${sampleImageSrc}\n`);
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ Failed to download ${url}:`, error.message);
      }
    }
    
    console.log('✅ Finished downloading all products!');
    console.log('🔄 Now regenerating products-data.ts...');
    
    // Regenerate the products data file
    require('./generate-products-data.js');
    
  } catch (error) {
    console.error('Error downloading products:', error);
  }
}

// Run the script
downloadAllProducts();