#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Product URLs from products.json
const products = [
  {
    "name": "Modern Arab Faded Tee",
    "url": "https://modernarabapparel.com/collections/all/products/modernarab-tee",
    "slug": "modern-arab-faded-tee"
  },
  {
    "name": "Modern Arab Premium Tee (Faded Green)",
    "url": "https://modernarabapparel.com/collections/all/products/modern-arab-premium-tee-faded-eucalyptus",
    "slug": "modern-arab-premium-tee-faded-eucalyptus"
  },
  {
    "name": "Modern Arab Tee (White)",
    "url": "https://modernarabapparel.com/collections/all/products/modernarab-tee-white",
    "slug": "modernarab-tee-white"
  },
  {
    "name": "Modern Arab Premium Tee",
    "url": "https://modernarabapparel.com/collections/all/products/modern-arab-premium-tee-1",
    "slug": "modern-arab-premium-tee-1"
  },
  {
    "name": "Modern Arab Tee (Black)",
    "url": "https://modernarabapparel.com/collections/all/products/modernarab-tee-black",
    "slug": "modernarab-tee-black"
  },
  {
    "name": "Modern Arab Premium Tee (Faded Khaki)",
    "url": "https://modernarabapparel.com/collections/all/products/modern-arab-premium-tee-faded-khaki",
    "slug": "modern-arab-premium-tee-faded-khaki"
  },
  {
    "name": "Modern Arab Premium Tee (Original)",
    "url": "https://modernarabapparel.com/collections/all/products/modern-arab-premium-tee",
    "slug": "modern-arab-premium-tee"
  },
  {
    "name": "Modern Arab Faded Tee (Black Print)",
    "url": "https://modernarabapparel.com/collections/all/products/modern-arab-faded-tee-black-print",
    "slug": "modern-arab-faded-tee-black-print"
  }
];

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to download image
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filename);
    
    protocol.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file async
      reject(err);
    });
  });
};

// Function to scrape product images
const scrapeProductImages = async (productUrl, slug) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(productUrl, { waitUntil: 'networkidle2' });
    
    // Wait for images to load
    await page.waitForSelector('img', { timeout: 10000 });
    
    // Extract product images
    const images = await page.evaluate(() => {
      const imgElements = document.querySelectorAll('img');
      const imageUrls = [];
      
      imgElements.forEach(img => {
        const src = img.src;
        // Look for product images (usually contain the product name or are from CDN)
        if (src && 
            (src.includes('cdn.shopify.com') || 
             src.includes('product') || 
             src.includes('modernarab') ||
             src.includes('files'))) {
          // Skip very small images (likely icons)
          if (img.naturalWidth > 200 && img.naturalHeight > 200) {
            imageUrls.push(src);
          }
        }
      });
      
      return [...new Set(imageUrls)]; // Remove duplicates
    });
    
    console.log(`Found ${images.length} images for ${slug}`);
    
    // Download images
    const productImages = [];
    for (let i = 0; i < Math.min(images.length, 5); i++) { // Limit to 5 images per product
      const imageUrl = images[i];
      const extension = imageUrl.split('.').pop().split('?')[0] || 'jpg';
      const filename = `${slug}-${i + 1}.${extension}`;
      const filepath = path.join(imagesDir, filename);
      
      try {
        await downloadImage(imageUrl, filepath);
        productImages.push(`/images/${filename}`);
      } catch (err) {
        console.error(`Failed to download ${imageUrl}:`, err.message);
      }
    }
    
    await browser.close();
    return productImages;
    
  } catch (error) {
    console.error(`Error scraping ${productUrl}:`, error.message);
    await browser.close();
    return [];
  }
};

// Main execution
const main = async () => {
  console.log('Starting image download process...');
  
  const updatedProducts = [];
  
  for (const product of products) {
    console.log(`\nProcessing: ${product.name}`);
    console.log(`URL: ${product.url}`);
    
    const images = await scrapeProductImages(product.url, product.slug);
    
    updatedProducts.push({
      ...product,
      images: images,
      image: images[0] || null // Set first image as main image
    });
    
    // Wait a bit between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Write updated products to JSON file
  const outputPath = path.join(__dirname, '../data/products-with-images.json');
  fs.writeFileSync(outputPath, JSON.stringify(updatedProducts, null, 2));
  
  console.log('\nImage download process completed!');
  console.log(`Updated products saved to: ${outputPath}`);
  console.log(`Images saved to: ${imagesDir}`);
};

// Check if puppeteer is installed
try {
  require('puppeteer');
  main().catch(console.error);
} catch (err) {
  console.error('Puppeteer is not installed. Please run: npm install puppeteer');
  process.exit(1);
}