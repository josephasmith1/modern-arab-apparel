#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Product data directory
const productsDir = path.join(__dirname, '../src/data/products');
const publicImagesDir = path.join(__dirname, '../public/images');

// Analysis results
const analysis = {
  summary: {
    totalProducts: 0,
    productsWithOnlyShopifyUrls: 0,
    productsWithLocalPaths: 0,
    productsWithMixedPaths: 0,
    totalImageReferences: 0,
    shopifyUrlCount: 0,
    localPathCount: 0
  },
  productDetails: [],
  missingImageDirectories: [],
  emptyImageDirectories: [],
  recommendations: []
};

// Get all JSON product files
const productFiles = fs.readdirSync(productsDir)
  .filter(file => file.endsWith('.json'))
  .sort();

console.log(`\n🔍 Analyzing ${productFiles.length} product files...\n`);

// First, get all existing image directories
const existingImageDirs = fs.readdirSync(publicImagesDir)
  .filter(item => fs.statSync(path.join(publicImagesDir, item)).isDirectory());

productFiles.forEach(filename => {
  const filePath = path.join(productsDir, filename);
  const productData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const product = productData.product;
  
  if (!product) return;
  
  analysis.summary.totalProducts++;
  
  const productSlug = filename.replace('.json', '');
  const productAnalysis = {
    filename,
    productSlug,
    title: product.title,
    handle: product.handle,
    shopifyUrls: 0,
    localPaths: 0,
    missingImages: [],
    existingImages: [],
    imageDirectory: {
      expected: `/images/${productSlug}/`,
      exists: false,
      fileCount: 0,
      files: []
    },
    requiredImageTypes: {
      main: false,
      back: false,
      lifestyle: false
    },
    recommendations: []
  };
  
  // Check if image directory exists
  const imageDirPath = path.join(publicImagesDir, productSlug);
  if (fs.existsSync(imageDirPath)) {
    productAnalysis.imageDirectory.exists = true;
    const files = fs.readdirSync(imageDirPath).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
    productAnalysis.imageDirectory.fileCount = files.length;
    productAnalysis.imageDirectory.files = files;
    
    // Check what types of images exist
    productAnalysis.requiredImageTypes.main = files.some(f => f.includes('main'));
    productAnalysis.requiredImageTypes.back = files.some(f => f.includes('back'));
    productAnalysis.requiredImageTypes.lifestyle = files.some(f => f.includes('lifestyle'));
  }
  
  // Analyze all image references
  const allImageSrcs = [];
  
  // Main image
  if (product.image && product.image.src) {
    allImageSrcs.push(product.image.src);
  }
  
  // Images array
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach(img => {
      if (img.src) allImageSrcs.push(img.src);
    });
  }
  
  // Variant images
  if (product.variants && Array.isArray(product.variants)) {
    product.variants.forEach(variant => {
      if (variant.images && Array.isArray(variant.images)) {
        variant.images.forEach(img => {
          allImageSrcs.push(img.src || img);
        });
      }
    });
  }
  
  // Analyze each image source
  allImageSrcs.forEach(src => {
    if (src.includes('cdn.shopify.com')) {
      productAnalysis.shopifyUrls++;
      analysis.summary.shopifyUrlCount++;
    } else if (src.startsWith('/images/')) {
      productAnalysis.localPaths++;
      analysis.summary.localPathCount++;
      
      const fullPath = path.join(__dirname, '../public', src);
      if (fs.existsSync(fullPath)) {
        productAnalysis.existingImages.push(src);
      } else {
        productAnalysis.missingImages.push(src);
      }
    }
  });
  
  analysis.summary.totalImageReferences += allImageSrcs.length;
  
  // Categorize product
  if (productAnalysis.shopifyUrls > 0 && productAnalysis.localPaths === 0) {
    analysis.summary.productsWithOnlyShopifyUrls++;
  } else if (productAnalysis.shopifyUrls === 0 && productAnalysis.localPaths > 0) {
    analysis.summary.productsWithLocalPaths++;
  } else if (productAnalysis.shopifyUrls > 0 && productAnalysis.localPaths > 0) {
    analysis.summary.productsWithMixedPaths++;
  }
  
  // Generate recommendations
  if (!productAnalysis.imageDirectory.exists) {
    productAnalysis.recommendations.push(`Create directory: /public/images/${productSlug}/`);
  } else if (productAnalysis.imageDirectory.fileCount === 0) {
    productAnalysis.recommendations.push(`Directory exists but is empty: /public/images/${productSlug}/`);
    analysis.emptyImageDirectories.push(productSlug);
  }
  
  if (productAnalysis.shopifyUrls > 0) {
    productAnalysis.recommendations.push(`Convert ${productAnalysis.shopifyUrls} Shopify CDN URLs to local paths`);
  }
  
  if (productAnalysis.imageDirectory.exists) {
    if (!productAnalysis.requiredImageTypes.main) {
      productAnalysis.recommendations.push('Add main product images for each variant');
    }
    if (!productAnalysis.requiredImageTypes.back) {
      productAnalysis.recommendations.push('Add back/alternate view images');
    }
    if (!productAnalysis.requiredImageTypes.lifestyle) {
      productAnalysis.recommendations.push('Add lifestyle/model images');
    }
  }
  
  analysis.productDetails.push(productAnalysis);
});

// Check for orphaned image directories
console.log('\n📁 Checking for orphaned image directories...');
const productSlugs = new Set(productFiles.map(f => f.replace('.json', '')));
existingImageDirs.forEach(dir => {
  if (!productSlugs.has(dir) && !['featured', 'hero'].includes(dir)) {
    analysis.missingImageDirectories.push({
      directory: dir,
      reason: 'No matching product JSON file'
    });
  }
});

// Generate final report
console.log('\n' + '='.repeat(80));
console.log('📊 IMAGE ANALYSIS SUMMARY');
console.log('='.repeat(80));
console.log(`Total products: ${analysis.summary.totalProducts}`);
console.log(`Total image references: ${analysis.summary.totalImageReferences}`);
console.log(`  - Shopify CDN URLs: ${analysis.summary.shopifyUrlCount}`);
console.log(`  - Local paths: ${analysis.summary.localPathCount}`);
console.log(`\nProduct categorization:`);
console.log(`  - Products with ONLY Shopify URLs: ${analysis.summary.productsWithOnlyShopifyUrls}`);
console.log(`  - Products with ONLY local paths: ${analysis.summary.productsWithLocalPaths}`);
console.log(`  - Products with mixed paths: ${analysis.summary.productsWithMixedPaths}`);

console.log('\n' + '='.repeat(80));
console.log('❌ PRODUCTS NEEDING ATTENTION');
console.log('='.repeat(80));

// Products with only Shopify URLs
const needsAttention = analysis.productDetails.filter(p => p.shopifyUrls > 0);
if (needsAttention.length > 0) {
  console.log('\nProducts with Shopify CDN URLs:');
  needsAttention.forEach(p => {
    console.log(`\n📦 ${p.title} (${p.filename})`);
    console.log(`   Handle: ${p.handle}`);
    console.log(`   Shopify URLs: ${p.shopifyUrls}`);
    console.log(`   Local paths: ${p.localPaths}`);
    console.log(`   Image directory exists: ${p.imageDirectory.exists ? 'Yes (' + p.imageDirectory.fileCount + ' files)' : 'No'}`);
    
    if (p.imageDirectory.exists && p.imageDirectory.fileCount > 0) {
      console.log(`   Available local images:`);
      p.imageDirectory.files.slice(0, 5).forEach(f => console.log(`     - ${f}`));
      if (p.imageDirectory.files.length > 5) {
        console.log(`     ... and ${p.imageDirectory.files.length - 5} more`);
      }
    }
    
    if (p.recommendations.length > 0) {
      console.log(`   Recommendations:`);
      p.recommendations.forEach(r => console.log(`     • ${r}`));
    }
  });
}

// Empty directories
if (analysis.emptyImageDirectories.length > 0) {
  console.log('\n\n⚠️  Empty image directories:');
  analysis.emptyImageDirectories.forEach(dir => {
    console.log(`  - /public/images/${dir}/`);
  });
}

// Orphaned directories
if (analysis.missingImageDirectories.length > 0) {
  console.log('\n\n🗂️  Orphaned image directories (no matching product):');
  analysis.missingImageDirectories.forEach(item => {
    console.log(`  - /public/images/${item.directory}/`);
  });
}

// Directory name mismatches
console.log('\n' + '='.repeat(80));
console.log('🔍 DIRECTORY NAME ANALYSIS');
console.log('='.repeat(80));

const mismatchedProducts = analysis.productDetails.filter(p => {
  return p.handle !== p.productSlug && p.handle !== p.productSlug.replace('modern-arab-', '');
});

if (mismatchedProducts.length > 0) {
  console.log('\nProducts where handle doesn\'t match filename:');
  mismatchedProducts.forEach(p => {
    console.log(`  - ${p.filename}: handle="${p.handle}" (expected "${p.productSlug}")`);
    
    // Check if there's a directory matching the handle
    const handleDir = path.join(publicImagesDir, p.handle);
    if (fs.existsSync(handleDir)) {
      const files = fs.readdirSync(handleDir).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
      console.log(`    ✓ Directory exists at /images/${p.handle}/ with ${files.length} images`);
    }
  });
}

// Save detailed report
const reportPath = path.join(__dirname, 'detailed-image-analysis.json');
fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
console.log(`\n\n📄 Detailed report saved to: ${reportPath}`);

// Summary recommendations
console.log('\n' + '='.repeat(80));
console.log('🎯 NEXT STEPS');
console.log('='.repeat(80));
console.log('1. All products currently use Shopify CDN URLs and need to be updated');
console.log('2. Local image directories exist for most products with the following counts:');

const dirsWithImages = analysis.productDetails
  .filter(p => p.imageDirectory.exists && p.imageDirectory.fileCount > 0)
  .sort((a, b) => b.imageDirectory.fileCount - a.imageDirectory.fileCount);

dirsWithImages.slice(0, 10).forEach(p => {
  console.log(`   - ${p.productSlug}: ${p.imageDirectory.fileCount} images`);
});

console.log('\n3. To fix all products, you need to:');
console.log('   - Update all image URLs from Shopify CDN to local /images/[product-slug]/ paths');
console.log('   - Ensure each product has main, back, and lifestyle images where applicable');
console.log('   - Handle directory name mismatches (e.g., "fisherman-beanie" vs "modern-arab-beanie")');