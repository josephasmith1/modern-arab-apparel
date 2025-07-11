#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Product URLs from the sitemap
const productUrls = [
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
  'https://modernarabapparel.com/products/modern-arab-premium-tee-faded-khaki'
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

// Function to create slug from URL
const createSlug = (url) => {
  return url.split('/').pop();
};

// Function to scrape product details
const scrapeProduct = async (productUrl) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log(`Scraping: ${productUrl}`);
    await page.goto(productUrl, { waitUntil: 'networkidle2' });
    
    // Wait for content to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Extract product data
    const productData = await page.evaluate(() => {
      // Get product title
      const title = document.querySelector('h1')?.textContent?.trim() || 
                   document.querySelector('[data-testid="product-title"]')?.textContent?.trim() ||
                   document.querySelector('.product-title')?.textContent?.trim() ||
                   document.querySelector('.product__title')?.textContent?.trim();
      
      // Get price
      const price = document.querySelector('.price')?.textContent?.trim() ||
                   document.querySelector('.product__price')?.textContent?.trim() ||
                   document.querySelector('[data-testid="price"]')?.textContent?.trim() ||
                   document.querySelector('.money')?.textContent?.trim();
      
      // Get description
      const description = document.querySelector('.product__description')?.textContent?.trim() ||
                         document.querySelector('.product-description')?.textContent?.trim() ||
                         document.querySelector('[data-testid="description"]')?.textContent?.trim() ||
                         document.querySelector('.rte')?.textContent?.trim();
      
      // Get all images
      const images = [];
      const imgElements = document.querySelectorAll('img');
      imgElements.forEach(img => {
        const src = img.src;
        if (src && 
            (src.includes('cdn.shopify.com') || 
             src.includes('product') || 
             src.includes('modernarab') ||
             src.includes('files')) &&
            img.naturalWidth > 200 && img.naturalHeight > 200) {
          images.push(src);
        }
      });
      
      // Get variants/colors if available
      const variants = [];
      const variantElements = document.querySelectorAll('.product-form__buttons .variant-input') ||
                             document.querySelectorAll('.product__variants .variant-input') ||
                             document.querySelectorAll('[data-testid="variant"]');
      
      variantElements.forEach(variant => {
        const label = variant.querySelector('label')?.textContent?.trim();
        if (label) {
          variants.push(label);
        }
      });
      
      // Get size options
      const sizes = [];
      const sizeElements = document.querySelectorAll('.product-form__buttons .size-input') ||
                          document.querySelectorAll('.product__variants .size-input') ||
                          document.querySelectorAll('[data-testid="size"]');
      
      sizeElements.forEach(size => {
        const label = size.querySelector('label')?.textContent?.trim();
        if (label) {
          sizes.push(label);
        }
      });
      
      return {
        title,
        price,
        description,
        images: [...new Set(images)], // Remove duplicates
        variants,
        sizes
      };
    });
    
    await browser.close();
    return productData;
    
  } catch (error) {
    console.error(`Error scraping ${productUrl}:`, error.message);
    await browser.close();
    return null;
  }
};

// Main execution
const main = async () => {
  console.log('Starting comprehensive product import...');
  
  const allProducts = [];
  
  for (const url of productUrls) {
    const slug = createSlug(url);
    console.log(`\nProcessing: ${slug}`);
    
    const productData = await scrapeProduct(url);
    
    if (productData) {
      // Download images
      const downloadedImages = [];
      for (let i = 0; i < Math.min(productData.images.length, 8); i++) {
        const imageUrl = productData.images[i];
        try {
          const extension = imageUrl.split('.').pop().split('?')[0] || 'jpg';
          const filename = `${slug}-${i + 1}.${extension}`;
          const filepath = path.join(imagesDir, filename);
          
          await downloadImage(imageUrl, filepath);
          downloadedImages.push(`/images/${filename}`);
        } catch (err) {
          console.error(`Failed to download image: ${err.message}`);
        }
      }
      
      // Create product object
      const product = {
        slug: slug,
        name: productData.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        price: productData.price || '$45.00',
        description: productData.description || '',
        url: url,
        images: downloadedImages,
        image: downloadedImages[0] || null,
        variants: productData.variants || [],
        sizes: productData.sizes || ['S', 'M', 'L', 'XL'],
        scraped: true,
        scrapedAt: new Date().toISOString()
      };
      
      allProducts.push(product);
      console.log(`✓ Successfully processed: ${product.name}`);
    } else {
      console.log(`✗ Failed to process: ${slug}`);
    }
    
    // Wait between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // Save all products to JSON
  const outputPath = path.join(__dirname, '../data/all-products.json');
  fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
  
  console.log('\n=== IMPORT COMPLETE ===');
  console.log(`Total products imported: ${allProducts.length}`);
  console.log(`Products saved to: ${outputPath}`);
  console.log(`Images saved to: ${imagesDir}`);
  
  // Create a summary
  console.log('\n=== PRODUCT SUMMARY ===');
  allProducts.forEach(product => {
    console.log(`- ${product.name} (${product.images.length} images)`);
  });
};

// Run the script
main().catch(console.error);