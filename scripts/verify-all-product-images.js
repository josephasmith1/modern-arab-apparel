const fs = require('fs');
const path = require('path');

// Read the products data file
const dataPath = path.join(__dirname, '../src/data/products/products-data.ts');
const content = fs.readFileSync(dataPath, 'utf8');

// Extract the products array from the TypeScript file
const productsMatch = content.match(/export const products: Product\[\] = (\[[\s\S]*\]);/);
if (!productsMatch) {
  console.error('Could not find products array in data file');
  process.exit(1);
}

// Parse the products data (careful with the JSON-like but not quite JSON format)
let productsData;
try {
  // Clean up the TypeScript syntax to make it valid JSON
  let cleanData = productsMatch[1]
    .replace(/^\s*"([^"]+)":/gm, '"$1":') // Remove extra quotes around keys
    .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
    .replace(/hex: "#/g, '"hex": "#') // Fix hex color format
    .replace(/price: /g, '"price": ')
    .replace(/size: "price"/g, '"size": "", "price"')
    .replace(/swatch: "hex"/g, '"swatch": "", "hex"')
    .replace(/originalPrice: "description"/g, '"originalPrice": "", "description"');
    
  productsData = eval('(' + cleanData + ')');
} catch (e) {
  console.error('Error parsing products data:', e);
  process.exit(1);
}

// Function to check if a file exists
function fileExists(imagePath) {
  const fullPath = path.join(__dirname, '../public', imagePath);
  return fs.existsSync(fullPath);
}

// Function to get file size
function getFileSize(imagePath) {
  const fullPath = path.join(__dirname, '../public', imagePath);
  try {
    const stats = fs.statSync(fullPath);
    return stats.size;
  } catch (e) {
    return 0;
  }
}

// Analyze all products
const report = {
  totalProducts: 0,
  totalColors: 0,
  issues: [],
  summary: {
    missingMain: 0,
    missingBack: 0,
    emptyLifestyle: 0,
    brokenImages: 0,
    suspiciouslySmall: 0
  }
};

console.log('Verifying all product images...\n');
console.log('='.repeat(80));

productsData.forEach((product, productIndex) => {
  report.totalProducts++;
  const productIssues = [];
  
  console.log(`\nProduct ${productIndex + 1}: ${product.name} (${product.slug})`);
  console.log('-'.repeat(60));
  
  product.colors.forEach((color, colorIndex) => {
    report.totalColors++;
    const colorIssues = [];
    
    console.log(`  Color ${colorIndex + 1}: ${color.name}`);
    
    // Check main image
    if (!color.images || !color.images.main) {
      colorIssues.push('Missing main image property');
      report.summary.missingMain++;
    } else if (!fileExists(color.images.main)) {
      colorIssues.push(`Main image not found: ${color.images.main}`);
      report.summary.brokenImages++;
    } else {
      const size = getFileSize(color.images.main);
      console.log(`    ✓ Main: ${color.images.main} (${(size/1024).toFixed(1)}KB)`);
      if (size < 10000) { // Less than 10KB is suspicious
        colorIssues.push(`Main image suspiciously small: ${color.images.main} (${(size/1024).toFixed(1)}KB)`);
        report.summary.suspiciouslySmall++;
      }
    }
    
    // Check back image
    if (!color.images || !color.images.back) {
      colorIssues.push('Missing back image property');
      report.summary.missingBack++;
    } else if (!fileExists(color.images.back)) {
      colorIssues.push(`Back image not found: ${color.images.back}`);
      report.summary.brokenImages++;
    } else {
      const size = getFileSize(color.images.back);
      console.log(`    ✓ Back: ${color.images.back} (${(size/1024).toFixed(1)}KB)`);
      if (size < 10000) {
        colorIssues.push(`Back image suspiciously small: ${color.images.back} (${(size/1024).toFixed(1)}KB)`);
        report.summary.suspiciouslySmall++;
      }
    }
    
    // Check lifestyle images
    if (!color.images || !color.images.lifestyle || color.images.lifestyle.length === 0) {
      colorIssues.push('No lifestyle images');
      report.summary.emptyLifestyle++;
      console.log('    ✗ Lifestyle: No images');
    } else {
      const lifestyleIssues = [];
      color.images.lifestyle.forEach((img, idx) => {
        if (!fileExists(img)) {
          lifestyleIssues.push(`Image ${idx + 1} not found: ${img}`);
          report.summary.brokenImages++;
        } else {
          const size = getFileSize(img);
          if (size < 10000) {
            lifestyleIssues.push(`Image ${idx + 1} suspiciously small: ${img} (${(size/1024).toFixed(1)}KB)`);
            report.summary.suspiciouslySmall++;
          }
        }
      });
      
      if (lifestyleIssues.length > 0) {
        colorIssues.push(...lifestyleIssues);
        console.log(`    ✗ Lifestyle: ${lifestyleIssues.join(', ')}`);
      } else {
        console.log(`    ✓ Lifestyle: ${color.images.lifestyle.length} image(s)`);
      }
    }
    
    // Add color issues to product issues
    if (colorIssues.length > 0) {
      productIssues.push({
        color: color.name,
        issues: colorIssues
      });
    }
  });
  
  // Add product issues to report
  if (productIssues.length > 0) {
    report.issues.push({
      product: product.name,
      slug: product.slug,
      colorIssues: productIssues
    });
  }
});

// Print summary report
console.log('\n' + '='.repeat(80));
console.log('VERIFICATION SUMMARY');
console.log('='.repeat(80));
console.log(`Total Products: ${report.totalProducts}`);
console.log(`Total Color Variants: ${report.totalColors}`);
console.log(`\nIssues Found:`);
console.log(`  - Missing Main Images: ${report.summary.missingMain}`);
console.log(`  - Missing Back Images: ${report.summary.missingBack}`);
console.log(`  - Empty Lifestyle Arrays: ${report.summary.emptyLifestyle}`);
console.log(`  - Broken Image Links: ${report.summary.brokenImages}`);
console.log(`  - Suspiciously Small Images: ${report.summary.suspiciouslySmall}`);

// Write detailed report
const reportPath = path.join(__dirname, 'product-images-verification-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\nDetailed report saved to: ${reportPath}`);

// Print products with issues
if (report.issues.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('PRODUCTS WITH ISSUES');
  console.log('='.repeat(80));
  
  report.issues.forEach(productIssue => {
    console.log(`\n${productIssue.product} (${productIssue.slug}):`);
    productIssue.colorIssues.forEach(colorIssue => {
      console.log(`  ${colorIssue.color}:`);
      colorIssue.issues.forEach(issue => {
        console.log(`    - ${issue}`);
      });
    });
  });
} else {
  console.log('\n✅ All product images verified successfully!');
}