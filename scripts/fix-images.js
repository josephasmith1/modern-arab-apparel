#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Define the files that need to be fixed
const filesToFix = [
  'src/app/products/page.tsx',
  'src/app/collections/all/page.tsx',
  'src/app/collections/t-shirts/page.tsx',
  'src/app/collections/hoodies/page.tsx',
  'src/app/collections/accessories/page.tsx',
  'src/app/products/[slug]/page.tsx'
];

// Function to add comprehensive products import if missing
function addComprehensiveImport(content) {
  if (!content.includes('comprehensiveProducts')) {
    // Find the import section
    const importMatch = content.match(/(import.*from.*;\n)(\n|export)/s);
    if (importMatch) {
      const importSection = importMatch[1];
      const newImport = "import comprehensiveProducts from '../../../data/comprehensive-products.json';\n";
      
      // Add the import if it doesn't exist
      if (!importSection.includes('comprehensive-products.json')) {
        return content.replace(importMatch[1], importSection + newImport);
      }
    }
  }
  return content;
}

// Function to fix image fallbacks
function fixImageFallbacks(content) {
  // Replace placeholder.jpg with actual image
  content = content.replace(/\/images\/placeholder\.jpg/g, '/images/modern-arab-faded-tee-faded-khaki-1.jpg');
  
  // Fix comprehensive products usage in product arrays
  if (content.includes('allProducts') && !content.includes('...comprehensiveProducts')) {
    content = content.replace(
      /const allProducts = \[\s*\.\.\.products,/g,
      'const allProducts = [\n    ...comprehensiveProducts,\n    ...products.filter(p => !comprehensiveProducts.find(cp => cp.slug === p.slug)),'
    );
  }
  
  return content;
}

// Fix each file
filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`Fixing: ${filePath}`);
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Add comprehensive import
    content = addComprehensiveImport(content);
    
    // Fix image fallbacks
    content = fixImageFallbacks(content);
    
    // Write back to file
    fs.writeFileSync(fullPath, content);
    
    console.log(`✓ Fixed: ${filePath}`);
  } else {
    console.log(`✗ File not found: ${filePath}`);
  }
});

console.log('\nImage fixing complete!');