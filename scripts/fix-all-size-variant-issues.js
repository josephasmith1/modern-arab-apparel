#!/usr/bin/env node

/**
 * Fix all products that have size variants incorrectly set up as color variants
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING ALL PRODUCTS WITH SIZE VARIANT ISSUES...\n');

// Read the current data.ts file
const dataPath = path.join(__dirname, '..', 'src', 'app', 'products', 'data.ts');
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Products to fix
const productsToFix = [
  {
    slug: 'modern-arab-premium-tee-faded-eucalyptus',
    name: 'Modern Arab Premium Tee (Faded Green)',
    colorName: 'Faded Green',
    hex: '#8B7355',
    sizes: ['M', 'L', 'XL', '2XL', '3XL'],
    skus: {
      'M': '3386030_9319',
      'L': '3386030_9314',
      'XL': '3386030_9324',
      '2XL': '3386030_9329',
      '3XL': '3386030_9334'
    },
    prices: {
      'M': 45,
      'L': 45,
      'XL': 45,
      '2XL': 50,
      '3XL': 55
    }
  },
  {
    slug: 'modernarab-tee-black',
    name: 'Modern Arab Tee (Black)',
    colorName: 'Faded Black',
    hex: '#4A4A4A',
    sizes: ['M', 'L', 'XL', '2XL', '3XL', '4XL'],
    skus: {
      'M': '11259590_20421',
      'L': '11259590_20426',
      'XL': '11259590_20431',
      '2XL': '11259590_20436',
      '3XL': '11259590_20441',
      '4XL': '11259590_20446'
    },
    prices: {
      'M': 40,
      'L': 40,
      'XL': 40,
      '2XL': 45,
      '3XL': 50,
      '4XL': 55
    }
  },
  {
    slug: 'modernarab-tee-white',
    name: 'Modern Arab Tee (White)',
    colorName: 'White',
    hex: '#FFFFFF',
    sizes: ['M', 'L', 'XL', '2XL', '3XL', '4XL'],
    skus: {
      'M': '11259590_20451',
      'L': '11259590_20456',
      'XL': '11259590_20461',
      '2XL': '11259590_20466',
      '3XL': '11259590_20471',
      '4XL': '11259590_20476'
    },
    prices: {
      'M': 40,
      'L': 40,
      'XL': 40,
      '2XL': 45,
      '3XL': 50,
      '4XL': 55
    }
  }
];

// Function to extract existing product data
function extractProductData(slug) {
  const productStart = dataContent.indexOf(`"slug": "${slug}"`);
  if (productStart === -1) {
    return null;
  }
  
  // Find the end of this product
  const searchStart = productStart + 100;
  const nextProductStart = dataContent.indexOf('{\n    "slug":', searchStart);
  const arrayEnd = dataContent.indexOf(']\n;', searchStart);
  
  let endPos;
  if (nextProductStart !== -1 && (arrayEnd === -1 || nextProductStart < arrayEnd)) {
    endPos = nextProductStart;
  } else {
    endPos = arrayEnd;
  }
  
  const productSection = dataContent.substring(productStart, endPos);
  
  // Extract fullDescription and other fields
  const descMatch = productSection.match(/"description":\s*"([^"]+)"/);
  const fullDescMatch = productSection.match(/"fullDescription":\s*"((?:[^"\\]|\\.)*)"/);
  const priceMatch = productSection.match(/"price":\s*"([^"]+)"/);
  const collectionMatch = productSection.match(/"collection":\s*"([^"]+)"/);
  const vendorMatch = productSection.match(/"vendor":\s*"([^"]+)"/);
  const tagsMatch = productSection.match(/"tags":\s*\[([\s\S]*?)\]/);
  
  // Extract image paths
  const imageMatch = productSection.match(/"images":\s*{\s*"main":\s*"([^"]*)"[^}]*}/);
  const mainImage = imageMatch ? imageMatch[1] : '';
  
  return {
    start: productStart - 10,
    end: endPos,
    description: descMatch ? descMatch[1] : '',
    fullDescription: fullDescMatch ? fullDescMatch[1] : '',
    price: priceMatch ? priceMatch[1] : '',
    collection: collectionMatch ? collectionMatch[1] : 'Upperwear',
    vendor: vendorMatch ? vendorMatch[1] : 'Modern Arab Apparel',
    tags: tagsMatch ? tagsMatch[1] : '',
    mainImage: mainImage
  };
}

// Fix each product
let fixedCount = 0;

productsToFix.forEach(product => {
  console.log(`🔍 Fixing ${product.name}...`);
  
  const existingData = extractProductData(product.slug);
  if (!existingData) {
    console.log(`❌ Could not find product: ${product.slug}`);
    return;
  }
  
  // Build the fixed product structure
  const variants = product.sizes.map(size => ({
    size: size,
    price: product.prices[size],
    sku: product.skus[size],
    available: true
  }));
  
  const fixedProduct = `{
    "slug": "${product.slug}",
    "name": "${product.name}",
    "vendor": "${existingData.vendor}",
    "collection": "${existingData.collection}",
    "tags": [${existingData.tags}],
    "price": "${existingData.price}",
    "originalPrice": "",
    "description": "${existingData.description}",
    "fullDescription": "${existingData.fullDescription}",
    "features": [],
    "specifications": [],
    "origin": [],
    "careInstructions": [],
    "sizes": ${JSON.stringify(product.sizes)},
    "colors": [
      {
        "name": "${product.colorName}",
        "swatch": "",
        "hex": "${product.hex}",
        "images": {
          "main": "${existingData.mainImage}",
          "back": "",
          "lifestyle": []
        },
        "variants": ${JSON.stringify(variants, null, 10).replace(/^/gm, '        ').trim()}
      }
    ]
  }`;
  
  // Replace the old product with the fixed one
  dataContent = dataContent.substring(0, existingData.start) + 
                fixedProduct + 
                dataContent.substring(existingData.end);
  
  console.log(`✅ Fixed ${product.name}`);
  console.log(`   - Consolidated ${product.sizes.length} size variants into 1 color`);
  console.log(`   - Color: ${product.colorName}`);
  console.log(`   - Sizes: ${product.sizes.join(', ')}`);
  
  fixedCount++;
});

// Write the updated content back
fs.writeFileSync(dataPath, dataContent);

console.log('\n🎉 ALL SIZE VARIANT ISSUES FIXED!');
console.log('📊 Summary:');
console.log(`   - Fixed ${fixedCount} products`);
console.log('   - Removed duplicate color swatches');
console.log('   - Size selection will now work properly');
console.log('   - Products now show actual colors instead of sizes');