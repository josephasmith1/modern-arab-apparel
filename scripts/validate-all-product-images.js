const fs = require('fs');
const path = require('path');

// Import the product loader module
const productLoaderPath = path.join(process.cwd(), 'src/lib/product-loader.ts');
const productLoader = require('ts-node/register');
const { loadAllProducts } = require('../src/lib/product-loader.ts');

async function validateProductImages() {
  console.log('Loading all products...\n');
  
  const products = await loadAllProducts();
  const results = {
    totalProducts: products.length,
    totalColors: 0,
    validProducts: [],
    productsWithIssues: [],
    missingImages: [],
    shopifyUrls: []
  };

  for (const product of products) {
    const productIssues = {
      name: product.name,
      slug: product.slug,
      colors: []
    };
    let hasIssues = false;

    console.log(`\n========================================`);
    console.log(`Checking: ${product.name} (${product.slug})`);
    console.log(`========================================`);

    for (const color of product.colors) {
      results.totalColors++;
      const colorIssues = {
        name: color.name,
        issues: []
      };

      console.log(`\n  Color: ${color.name}`);
      
      // Check main image
      console.log(`    Main: ${color.images.main}`);
      if (!color.images.main) {
        colorIssues.issues.push('Missing main image path');
      } else if (color.images.main.includes('cdn.shopify.com')) {
        colorIssues.issues.push(`Main image is Shopify URL: ${color.images.main}`);
        results.shopifyUrls.push(`${product.slug}/${color.name}/main: ${color.images.main}`);
      } else if (!color.images.main.startsWith('/images/')) {
        colorIssues.issues.push(`Main image has incorrect path format: ${color.images.main}`);
      } else {
        // Check if file exists
        const mainPath = path.join(process.cwd(), 'public', color.images.main);
        if (!fs.existsSync(mainPath)) {
          colorIssues.issues.push(`Main image file does not exist: ${color.images.main}`);
          results.missingImages.push(color.images.main);
        }
      }

      // Check back image
      console.log(`    Back: ${color.images.back}`);
      if (!color.images.back) {
        colorIssues.issues.push('Missing back image path');
      } else if (color.images.back.includes('cdn.shopify.com')) {
        colorIssues.issues.push(`Back image is Shopify URL: ${color.images.back}`);
        results.shopifyUrls.push(`${product.slug}/${color.name}/back: ${color.images.back}`);
      } else if (!color.images.back.startsWith('/images/')) {
        colorIssues.issues.push(`Back image has incorrect path format: ${color.images.back}`);
      } else {
        // Check if file exists
        const backPath = path.join(process.cwd(), 'public', color.images.back);
        if (!fs.existsSync(backPath)) {
          colorIssues.issues.push(`Back image file does not exist: ${color.images.back}`);
          results.missingImages.push(color.images.back);
        }
      }

      // Check lifestyle images
      console.log(`    Lifestyle: ${color.images.lifestyle.length} images`);
      if (!color.images.lifestyle || color.images.lifestyle.length === 0) {
        colorIssues.issues.push('No lifestyle images');
      } else {
        color.images.lifestyle.forEach((lifestyle, index) => {
          console.log(`      [${index}]: ${lifestyle}`);
          if (lifestyle.includes('cdn.shopify.com')) {
            colorIssues.issues.push(`Lifestyle image ${index} is Shopify URL: ${lifestyle}`);
            results.shopifyUrls.push(`${product.slug}/${color.name}/lifestyle[${index}]: ${lifestyle}`);
          } else if (!lifestyle.startsWith('/images/')) {
            colorIssues.issues.push(`Lifestyle image ${index} has incorrect path format: ${lifestyle}`);
          } else {
            // Check if file exists
            const lifestylePath = path.join(process.cwd(), 'public', lifestyle);
            if (!fs.existsSync(lifestylePath)) {
              colorIssues.issues.push(`Lifestyle image ${index} file does not exist: ${lifestyle}`);
              results.missingImages.push(lifestyle);
            }
          }
        });
      }

      if (colorIssues.issues.length > 0) {
        hasIssues = true;
        productIssues.colors.push(colorIssues);
        console.log(`    ⚠️  Issues found for ${color.name}:`);
        colorIssues.issues.forEach(issue => console.log(`       - ${issue}`));
      } else {
        console.log(`    ✅ All images valid for ${color.name}`);
      }
    }

    if (hasIssues) {
      results.productsWithIssues.push(productIssues);
    } else {
      results.validProducts.push(product.name);
    }
  }

  // Print summary
  console.log('\n\n========================================');
  console.log('VALIDATION SUMMARY');
  console.log('========================================');
  console.log(`Total products checked: ${results.totalProducts}`);
  console.log(`Total color variants: ${results.totalColors}`);
  console.log(`Products with valid images: ${results.validProducts.length}`);
  console.log(`Products with issues: ${results.productsWithIssues.length}`);
  console.log(`Missing image files: ${results.missingImages.length}`);
  console.log(`Shopify URLs found: ${results.shopifyUrls.length}`);

  if (results.shopifyUrls.length > 0) {
    console.log('\n❌ SHOPIFY URLs DETECTED:');
    results.shopifyUrls.forEach(url => console.log(`  - ${url}`));
  }

  if (results.missingImages.length > 0) {
    console.log('\n❌ MISSING IMAGE FILES:');
    const uniqueMissing = [...new Set(results.missingImages)];
    uniqueMissing.forEach(img => console.log(`  - ${img}`));
  }

  if (results.productsWithIssues.length > 0) {
    console.log('\n❌ PRODUCTS WITH ISSUES:');
    results.productsWithIssues.forEach(product => {
      console.log(`\n  ${product.name} (${product.slug}):`);
      product.colors.forEach(color => {
        console.log(`    ${color.name}:`);
        color.issues.forEach(issue => console.log(`      - ${issue}`));
      });
    });
  } else {
    console.log('\n✅ All products have valid local image paths!');
  }

  // Save detailed report
  const reportPath = path.join(process.cwd(), 'scripts/image-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);
}

validateProductImages().catch(console.error);