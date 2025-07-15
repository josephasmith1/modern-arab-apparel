#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Product data directory
const productsDir = path.join(__dirname, '../src/data/products');
const publicImagesDir = path.join(__dirname, '../public/images');

// Results tracking
const results = {
  totalProducts: 0,
  productsWithShopifyUrls: [],
  productsWithMissingImages: [],
  productsWithCorrectPaths: [],
  imagePathsAnalysis: {}
};

// Get all JSON product files
const productFiles = fs.readdirSync(productsDir)
  .filter(file => file.endsWith('.json'));

console.log(`\n🔍 Checking ${productFiles.length} product files...\n`);

productFiles.forEach(filename => {
  const filePath = path.join(productsDir, filename);
  const productData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const product = productData.product;
  
  if (!product) {
    console.log(`❌ ${filename}: No product data found`);
    return;
  }
  
  results.totalProducts++;
  
  const productSlug = filename.replace('.json', '');
  const analysis = {
    filename,
    title: product.title,
    handle: product.handle,
    images: [],
    hasShopifyUrls: false,
    missingLocalImages: [],
    correctLocalPaths: [],
    expectedImageDir: `/images/${productSlug}/`
  };
  
  // Check main image
  if (product.image && product.image.src) {
    const imageInfo = {
      type: 'main',
      src: product.image.src,
      isShopifyUrl: product.image.src.includes('cdn.shopify.com'),
      isLocal: product.image.src.startsWith('/images/')
    };
    
    if (imageInfo.isShopifyUrl) {
      analysis.hasShopifyUrls = true;
    }
    
    if (imageInfo.isLocal) {
      const fullPath = path.join(__dirname, '../public', product.image.src);
      imageInfo.exists = fs.existsSync(fullPath);
      if (!imageInfo.exists) {
        analysis.missingLocalImages.push(product.image.src);
      } else {
        analysis.correctLocalPaths.push(product.image.src);
      }
    }
    
    analysis.images.push(imageInfo);
  }
  
  // Check all images
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach((img, index) => {
      const imageInfo = {
        type: `image_${index}`,
        src: img.src,
        isShopifyUrl: img.src.includes('cdn.shopify.com'),
        isLocal: img.src.startsWith('/images/')
      };
      
      if (imageInfo.isShopifyUrl) {
        analysis.hasShopifyUrls = true;
      }
      
      if (imageInfo.isLocal) {
        const fullPath = path.join(__dirname, '../public', img.src);
        imageInfo.exists = fs.existsSync(fullPath);
        if (!imageInfo.exists) {
          analysis.missingLocalImages.push(img.src);
        } else {
          analysis.correctLocalPaths.push(img.src);
        }
      }
      
      analysis.images.push(imageInfo);
    });
  }
  
  // Check variants for images
  if (product.variants && Array.isArray(product.variants)) {
    product.variants.forEach((variant, vIndex) => {
      if (variant.images && Array.isArray(variant.images)) {
        variant.images.forEach((img, iIndex) => {
          const imageInfo = {
            type: `variant_${vIndex}_image_${iIndex}`,
            variantTitle: variant.title,
            src: img.src || img,
            isShopifyUrl: (img.src || img).includes('cdn.shopify.com'),
            isLocal: (img.src || img).startsWith('/images/')
          };
          
          if (imageInfo.isShopifyUrl) {
            analysis.hasShopifyUrls = true;
          }
          
          if (imageInfo.isLocal) {
            const fullPath = path.join(__dirname, '../public', img.src || img);
            imageInfo.exists = fs.existsSync(fullPath);
            if (!imageInfo.exists) {
              analysis.missingLocalImages.push(img.src || img);
            } else {
              analysis.correctLocalPaths.push(img.src || img);
            }
          }
          
          analysis.images.push(imageInfo);
        });
      }
    });
  }
  
  // Categorize the product
  if (analysis.hasShopifyUrls) {
    results.productsWithShopifyUrls.push(analysis);
  } else if (analysis.missingLocalImages.length > 0) {
    results.productsWithMissingImages.push(analysis);
  } else if (analysis.correctLocalPaths.length > 0) {
    results.productsWithCorrectPaths.push(analysis);
  }
  
  results.imagePathsAnalysis[productSlug] = analysis;
});

// Check what image folders exist in public/images
console.log('\n📁 Available image directories in public/images:');
const imageDirs = fs.readdirSync(publicImagesDir)
  .filter(item => fs.statSync(path.join(publicImagesDir, item)).isDirectory())
  .sort();

imageDirs.forEach(dir => {
  const dirPath = path.join(publicImagesDir, dir);
  const imageCount = fs.readdirSync(dirPath).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f)).length;
  console.log(`  - ${dir}/ (${imageCount} images)`);
});

// Generate report
console.log('\n📊 SUMMARY REPORT');
console.log('=================');
console.log(`Total products analyzed: ${results.totalProducts}`);
console.log(`Products with Shopify CDN URLs: ${results.productsWithShopifyUrls.length}`);
console.log(`Products with missing local images: ${results.productsWithMissingImages.length}`);
console.log(`Products with correct local paths: ${results.productsWithCorrectPaths.length}`);

if (results.productsWithShopifyUrls.length > 0) {
  console.log('\n❌ PRODUCTS WITH SHOPIFY CDN URLS:');
  results.productsWithShopifyUrls.forEach(p => {
    console.log(`\n  📦 ${p.title} (${p.filename})`);
    console.log(`     Handle: ${p.handle}`);
    console.log(`     Expected local dir: ${p.expectedImageDir}`);
    console.log(`     Shopify URLs found: ${p.images.filter(i => i.isShopifyUrl).length}`);
    p.images.filter(i => i.isShopifyUrl).forEach(img => {
      console.log(`       - ${img.type}: ${img.src}`);
    });
  });
}

if (results.productsWithMissingImages.length > 0) {
  console.log('\n⚠️  PRODUCTS WITH MISSING LOCAL IMAGES:');
  results.productsWithMissingImages.forEach(p => {
    console.log(`\n  📦 ${p.title} (${p.filename})`);
    console.log(`     Missing images:`);
    p.missingLocalImages.forEach(img => {
      console.log(`       - ${img}`);
    });
  });
}

// Check for directory mismatches
console.log('\n🔍 DIRECTORY NAMING ANALYSIS:');
const productSlugs = productFiles.map(f => f.replace('.json', ''));
const imageDirSet = new Set(imageDirs);

console.log('\nProducts without matching image directories:');
productSlugs.forEach(slug => {
  if (!imageDirSet.has(slug)) {
    console.log(`  - ${slug} (no directory /images/${slug}/)`);
    // Check for similar directories
    const similar = imageDirs.filter(dir => 
      dir.includes(slug.replace(/-/g, '')) || 
      slug.includes(dir.replace(/-/g, ''))
    );
    if (similar.length > 0) {
      console.log(`    Possible matches: ${similar.join(', ')}`);
    }
  }
});

console.log('\nImage directories without matching products:');
imageDirs.forEach(dir => {
  if (!productSlugs.includes(dir) && !['featured', 'hero'].includes(dir)) {
    console.log(`  - /images/${dir}/`);
  }
});

// Save detailed report
const reportPath = path.join(__dirname, 'image-verification-report.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n📄 Detailed report saved to: ${reportPath}`);

// Suggest required image types
console.log('\n🖼️  REQUIRED IMAGE TYPES BY PRODUCT:');
Object.entries(results.imagePathsAnalysis).forEach(([slug, analysis]) => {
  if (analysis.hasShopifyUrls || analysis.missingLocalImages.length > 0) {
    console.log(`\n${analysis.title}:`);
    const imageDirPath = path.join(publicImagesDir, slug);
    const hasDir = fs.existsSync(imageDirPath);
    
    if (!hasDir) {
      console.log('  ❌ No image directory exists');
      console.log(`  📁 Create directory: /public/images/${slug}/`);
    } else {
      const existingImages = fs.readdirSync(imageDirPath);
      console.log(`  ✅ Directory exists with ${existingImages.length} files`);
      
      // Suggest missing image types
      const hasMain = existingImages.some(f => f.includes('main'));
      const hasBack = existingImages.some(f => f.includes('back'));
      const hasLifestyle = existingImages.some(f => f.includes('lifestyle'));
      
      if (!hasMain) console.log('  ⚠️  Missing: main product images');
      if (!hasBack) console.log('  ⚠️  Missing: back/alternate view images');
      if (!hasLifestyle) console.log('  ⚠️  Missing: lifestyle images');
    }
  }
});