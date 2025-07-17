const fs = require('fs');
const path = require('path');

// Import the scanner and validator functions
// Note: We'll implement these as CommonJS for the script
const { scanAvailableImages, scanProductImageData, generateImageAuditReport } = require('./image-audit-utils');

async function runComprehensiveAudit() {
  console.log('🔍 Starting comprehensive image audit...\n');
  
  try {
    // Generate the full audit report
    const report = await generateImageAuditReport();
    
    console.log('📊 AUDIT SUMMARY');
    console.log('================');
    console.log(`Total Products: ${report.summary.totalProducts}`);
    console.log(`Total Shopify Images: ${report.summary.totalShopifyImages}`);
    console.log(`Total Local Images: ${report.summary.totalLocalImages}`);
    console.log(`Missing Images: ${report.summary.totalMissingImages}`);
    console.log(`Products with Issues: ${report.summary.productsWithIssues.length}`);
    console.log('');
    
    // Show products with issues
    if (report.summary.productsWithIssues.length > 0) {
      console.log('🚨 PRODUCTS WITH MISSING IMAGES');
      console.log('================================');
      for (const productSlug of report.summary.productsWithIssues) {
        const productData = report.productImageData.find(p => p.productSlug === productSlug);
        if (productData) {
          console.log(`\n📦 ${productSlug}`);
          console.log(`   Shopify Images: ${productData.shopifyImages.length}`);
          console.log(`   Expected Local: ${productData.expectedLocalPaths.length}`);
          console.log(`   Actual Local: ${productData.actualLocalPaths.length}`);
          console.log(`   Missing: ${productData.missingImages.length}`);
          
          if (productData.missingImages.length > 0) {
            console.log('   Missing Images:');
            productData.missingImages.forEach(img => {
              console.log(`     ❌ ${img}`);
            });
          }
          
          if (productData.shopifyImages.length > 0) {
            console.log('   Available Shopify URLs:');
            productData.shopifyImages.slice(0, 5).forEach((img, index) => {
              console.log(`     🌐 ${img.src}`);
            });
            if (productData.shopifyImages.length > 5) {
              console.log(`     ... and ${productData.shopifyImages.length - 5} more`);
            }
          }
        }
      }
    }
    
    // Show available local images summary
    console.log('\n📁 LOCAL IMAGES BY PRODUCT');
    console.log('===========================');
    const imagesByProduct = {};
    report.availableImages.forEach(img => {
      if (!imagesByProduct[img.productSlug]) {
        imagesByProduct[img.productSlug] = [];
      }
      imagesByProduct[img.productSlug].push(img);
    });
    
    Object.keys(imagesByProduct).sort().forEach(productSlug => {
      const images = imagesByProduct[productSlug];
      console.log(`${productSlug}: ${images.length} images`);
      
      // Group by color
      const colorGroups = {};
      images.forEach(img => {
        if (!colorGroups[img.colorSlug]) {
          colorGroups[img.colorSlug] = [];
        }
        colorGroups[img.colorSlug].push(img);
      });
      
      Object.keys(colorGroups).forEach(colorSlug => {
        const colorImages = colorGroups[colorSlug];
        const types = colorImages.map(img => img.imageType).join(', ');
        console.log(`  ${colorSlug}: ${colorImages.length} (${types})`);
      });
    });
    
    // Save detailed report to file
    const reportPath = path.join(__dirname, 'comprehensive-image-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Detailed report saved to: ${reportPath}`);
    
    // Generate actionable recommendations
    console.log('\n💡 RECOMMENDATIONS');
    console.log('==================');
    
    if (report.summary.totalMissingImages > 0) {
      console.log('1. Download missing images from Shopify CDN URLs');
      console.log('2. Update product loader to use Shopify URLs as fallback');
      console.log('3. Implement image download automation script');
    }
    
    if (report.summary.productsWithIssues.length > 0) {
      console.log('4. Fix image path mappings in product loader');
      console.log('5. Update color slug generation logic');
      console.log('6. Add fallback image handling');
    }
    
    console.log('\n✅ Audit complete!');
    
  } catch (error) {
    console.error('❌ Error during audit:', error);
    process.exit(1);
  }
}

// Run the audit
if (require.main === module) {
  runComprehensiveAudit();
}

module.exports = { runComprehensiveAudit };