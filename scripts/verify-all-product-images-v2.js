const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// First, let's use the TypeScript compiler to extract the data
const dataPath = path.join(__dirname, '../src/data/products/products-data.ts');

// Create a temporary file to extract the products
const tempFile = path.join(__dirname, 'temp-products.js');
const extractScript = `
const fs = require('fs');
const path = require('path');

// Import the products data
const productsModule = require('../src/data/products/products-data.ts');
const products = productsModule.products || productsModule.default || [];

// Write to file
fs.writeFileSync(path.join(__dirname, 'temp-products.json'), JSON.stringify(products, null, 2));
`;

// Try a different approach - read and process the TypeScript file directly
const content = fs.readFileSync(dataPath, 'utf8');

// Extract products array more carefully
const startIndex = content.indexOf('export const products: Product[] = [');
const endIndex = content.lastIndexOf('];') + 2;
const productsArrayStr = content.substring(startIndex, endIndex);

// Clean up the TypeScript to make it parseable
let cleanedData = productsArrayStr
  .replace('export const products: Product[] = ', '')
  .replace(/^\s*"([^"]+)":/gm, '"$1":')
  .replace(/,(\s*[}\]])/g, '$1')
  .replace(/(\w+):\s*"/g, '"$1": "')
  .replace(/(\w+):\s*\[/g, '"$1": [')
  .replace(/(\w+):\s*\{/g, '"$1": {')
  .replace(/(\w+):\s*(\d+)/g, '"$1": $2')
  .replace(/(\w+):\s*(true|false)/g, '"$1": $2')
  .replace(/(\w+):\s*null/g, '"$1": null');

// Write cleaned data to temp file for inspection
fs.writeFileSync(path.join(__dirname, 'temp-cleaned-data.json'), cleanedData);

// Use a more robust approach - import the actual data
console.log('Loading products data...');

// Read the products data and manually parse it
const productsData = [];
const lines = content.split('\n');
let currentProduct = null;
let currentColor = null;
let inProduct = false;
let inColor = false;
let inImages = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line.includes('"slug":')) {
    if (currentProduct) productsData.push(currentProduct);
    currentProduct = { colors: [] };
    currentProduct.slug = line.match(/"slug":\s*"([^"]+)"/)?.[1] || '';
    inProduct = true;
  } else if (inProduct && line.includes('"name":') && !line.includes('"name": "')) {
    currentProduct.name = line.match(/"name":\s*"([^"]+)"/)?.[1] || '';
  } else if (inProduct && line === '"colors": [') {
    inColor = true;
  } else if (inColor && line.includes('"name":')) {
    currentColor = { images: {} };
    currentColor.name = line.match(/"name":\s*"([^"]+)"/)?.[1] || '';
  } else if (inColor && line === '"images": {') {
    inImages = true;
  } else if (inImages && line.includes('"main":')) {
    currentColor.images.main = line.match(/"main":\s*"([^"]+)"/)?.[1] || '';
  } else if (inImages && line.includes('"back":')) {
    currentColor.images.back = line.match(/"back":\s*"([^"]+)"/)?.[1] || '';
  } else if (inImages && line === '"lifestyle": [') {
    currentColor.images.lifestyle = [];
    // Look ahead for lifestyle images
    for (let j = i + 1; j < lines.length && !lines[j].includes(']'); j++) {
      const imgMatch = lines[j].match(/"([^"]+\.(jpg|png|webp))"/);
      if (imgMatch) {
        currentColor.images.lifestyle.push(imgMatch[1]);
      }
    }
  } else if (inImages && line === '},') {
    inImages = false;
    if (currentColor) currentProduct.colors.push(currentColor);
    currentColor = null;
  }
}

// Add the last product
if (currentProduct) productsData.push(currentProduct);

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
    suspiciouslySmall: 0,
    duplicateImages: 0
  }
};

console.log('Verifying all product images...\n');
console.log('='.repeat(80));

// Track duplicate images
const imageUsage = new Map();

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
      
      // Track image usage
      const usage = imageUsage.get(color.images.main) || [];
      usage.push(`${product.name} - ${color.name} (main)`);
      imageUsage.set(color.images.main, usage);
      
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
      
      // Track image usage
      const usage = imageUsage.get(color.images.back) || [];
      usage.push(`${product.name} - ${color.name} (back)`);
      imageUsage.set(color.images.back, usage);
      
      if (size < 10000) {
        colorIssues.push(`Back image suspiciously small: ${color.images.back} (${(size/1024).toFixed(1)}KB)`);
        report.summary.suspiciouslySmall++;
      }
      
      // Check if main and back are the same
      if (color.images.main === color.images.back) {
        colorIssues.push('Main and back images are identical');
        report.summary.duplicateImages++;
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
          
          // Track image usage
          const usage = imageUsage.get(img) || [];
          usage.push(`${product.name} - ${color.name} (lifestyle ${idx + 1})`);
          imageUsage.set(img, usage);
          
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

// Find images used multiple times
const duplicateImages = [];
imageUsage.forEach((usage, image) => {
  if (usage.length > 1) {
    duplicateImages.push({ image, usage });
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
console.log(`  - Main/Back Duplicate Images: ${report.summary.duplicateImages}`);

// Print duplicate image usage
if (duplicateImages.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('IMAGES USED MULTIPLE TIMES');
  console.log('='.repeat(80));
  duplicateImages.forEach(({ image, usage }) => {
    console.log(`\n${image}:`);
    usage.forEach(u => console.log(`  - ${u}`));
  });
}

// Write detailed report
const reportPath = path.join(__dirname, 'product-images-verification-report.json');
fs.writeFileSync(reportPath, JSON.stringify({
  ...report,
  duplicateImages
}, null, 2));
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

// Clean up temp files
if (fs.existsSync(path.join(__dirname, 'temp-cleaned-data.json'))) {
  fs.unlinkSync(path.join(__dirname, 'temp-cleaned-data.json'));
}