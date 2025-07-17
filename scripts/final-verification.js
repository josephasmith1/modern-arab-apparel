#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const JSON_DIR = path.join(__dirname, '..', 'src', 'data', 'products');
const PRODUCTS_DATA_FILE = path.join(JSON_DIR, 'products-data.ts');
const PUBLIC_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

// Function to verify that all images referenced in JSON files exist locally
function verifyImageCompleteness() {
  console.log('🔍 Final verification of image completeness...\n');
  
  const results = {
    totalProducts: 0,
    totalImages: 0,
    missingImages: 0,
    existingImages: 0,
    brokenReferences: [],
    summary: {}
  };
  
  // Read all JSON files
  const files = fs.readdirSync(JSON_DIR)
    .filter(file => file.endsWith('.json') && file !== 'extracted-colors.json')
    .sort();
  
  results.totalProducts = files.length;
  
  for (const file of files) {
    try {
      const filePath = path.join(JSON_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const shopifyProduct = JSON.parse(fileContent);
      const product = shopifyProduct.product;
      
      const productName = product.title;
      const productSlug = product.handle;
      
      console.log(`📦 ${productName} (${productSlug})`);
      
      let productImageCount = 0;
      let productMissing = 0;
      let productExisting = 0;
      
      if (product.images && Array.isArray(product.images)) {
        for (const image of product.images) {
          results.totalImages++;
          productImageCount++;
          
          let imagePath = '';
          if (image.src.startsWith('/images/')) {
            imagePath = path.join(__dirname, '..', 'public', image.src);
          } else if (image.src.startsWith('http')) {
            console.log(`   ⚠️  Still has remote URL: ${image.src}`);
            results.brokenReferences.push({
              product: productSlug,
              issue: 'remote_url',
              url: image.src,
              position: image.position
            });
            results.missingImages++;
            productMissing++;
            continue;
          } else {
            imagePath = path.join(PUBLIC_IMAGES_DIR, image.src);
          }
          
          if (fs.existsSync(imagePath)) {
            results.existingImages++;
            productExisting++;
          } else {
            console.log(`   ❌ Missing: ${image.src}`);
            results.brokenReferences.push({
              product: productSlug,
              issue: 'missing_file',
              path: image.src,
              position: image.position
            });
            results.missingImages++;
            productMissing++;
          }
        }
      }
      
      console.log(`   📊 ${productImageCount} total images, ${productExisting} exist, ${productMissing} missing`);
      
      results.summary[productSlug] = {
        name: productName,
        total: productImageCount,
        existing: productExisting,
        missing: productMissing,
        complete: productMissing === 0
      };
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Final summary
  console.log('\n🎉 FINAL VERIFICATION SUMMARY');
  console.log('═══════════════════════════════');
  console.log(`📦 Total Products: ${results.totalProducts}`);
  console.log(`🖼️  Total Images: ${results.totalImages}`);
  console.log(`✅ Existing Images: ${results.existingImages}`);
  console.log(`❌ Missing Images: ${results.missingImages}`);
  console.log(`📊 Success Rate: ${((results.existingImages / results.totalImages) * 100).toFixed(1)}%`);
  
  const completeProducts = Object.values(results.summary).filter(p => p.complete);
  const incompleteProducts = Object.values(results.summary).filter(p => !p.complete);
  
  console.log(`\n✅ Complete Products: ${completeProducts.length}/${results.totalProducts}`);
  console.log(`❌ Incomplete Products: ${incompleteProducts.length}/${results.totalProducts}`);
  
  if (incompleteProducts.length > 0) {
    console.log('\n⚠️  Products with missing images:');
    incompleteProducts.forEach(product => {
      console.log(`   • ${product.name}: ${product.missing} missing out of ${product.total}`);
    });
  }
  
  if (results.brokenReferences.length > 0) {
    console.log('\n🔧 Issues found:');
    results.brokenReferences.forEach(issue => {
      if (issue.issue === 'remote_url') {
        console.log(`   • ${issue.product}: Remote URL still exists (position ${issue.position})`);
      } else {
        console.log(`   • ${issue.product}: Missing file ${issue.path} (position ${issue.position})`);
      }
    });
  }
  
  // Check if products-data.ts is up to date
  console.log('\n📝 Checking products-data.ts...');
  if (fs.existsSync(PRODUCTS_DATA_FILE)) {
    const stats = fs.statSync(PRODUCTS_DATA_FILE);
    const timeSinceUpdate = Date.now() - stats.mtime.getTime();
    const minutesSinceUpdate = Math.floor(timeSinceUpdate / (1000 * 60));
    
    console.log(`   📅 Last updated: ${minutesSinceUpdate} minutes ago`);
    
    if (minutesSinceUpdate < 5) {
      console.log('   ✅ products-data.ts appears to be current');
    } else {
      console.log('   ⚠️  products-data.ts may need regeneration');
    }
  } else {
    console.log('   ❌ products-data.ts not found!');
  }
  
  // Overall assessment
  console.log('\n🎯 OVERALL ASSESSMENT');
  console.log('═══════════════════════');
  
  if (results.missingImages === 0 && incompleteProducts.length === 0) {
    console.log('🌟 PERFECT! All products have complete image sets.');
    console.log('🚀 Ready for production!');
  } else if (results.missingImages < 5) {
    console.log('🟡 MOSTLY COMPLETE: Only a few images are missing.');
    console.log('🔧 Minor fixes needed before production.');
  } else {
    console.log('🔴 NEEDS WORK: Multiple images are missing.');
    console.log('🛠️  Significant fixes needed before production.');
  }
  
  // Save detailed report
  const reportPath = path.join(__dirname, 'final-verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📋 Detailed report saved to: ${reportPath}`);
  
  return results;
}

// Run verification
if (require.main === module) {
  verifyImageCompleteness();
}

module.exports = { verifyImageCompleteness };