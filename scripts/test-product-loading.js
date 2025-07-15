#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('=== Testing Product Loading System ===\n');

const PRODUCTS_DIR = path.join(__dirname, '..', 'src/data/products');
const IMAGE_MAPPINGS_PATH = path.join(__dirname, 'image-mappings.json');

// Load image mappings
let imageMappings = {};
try {
  if (fs.existsSync(IMAGE_MAPPINGS_PATH)) {
    const mappingsContent = fs.readFileSync(IMAGE_MAPPINGS_PATH, 'utf-8');
    imageMappings = JSON.parse(mappingsContent);
    console.log('✅ Loaded image mappings\n');
  }
} catch (error) {
  console.warn('Could not load image mappings:', error);
}

function getColorHex(colorName) {
  const colorMap = {
    'black': '#000000',
    'white': '#FFFFFF',
    'blue': '#4169E1',
    'navy': '#000080',
    'dark blue': '#00008B',
    'red': '#FF0000',
    'green': '#008000',
    'olive': '#808000',
    'olive green': '#6B8E23',
    'gray': '#808080',
    'grey': '#808080',
    'brown': '#A52A2A',
    'beige': '#F5F5DC',
    'cream': '#FFFDD0',
    'pink': '#FFC0CB',
    'purple': '#800080',
    'orange': '#FFA500',
    'yellow': '#FFFF00',
    'gold': '#FFD700',
    'silver': '#C0C0C0',
    'maroon': '#800000',
    'faded bone': '#F5F5DC',
    'heather dust': '#D3D3D3',
    'natural': '#FFF8DC'
  };
  
  return colorMap[colorName.toLowerCase()] || '#808080';
}

function convertShopifyToProduct(shopifyData, filename) {
  try {
    const { product } = shopifyData;
    
    // Extract basic product info
    const slug = product.handle;
    const name = product.title;
    const vendor = product.vendor;
    const collection = product.product_type;
    const tags = product.tags ? product.tags.split(', ') : [];
    
    // Get price from first variant
    const firstVariant = product.variants?.[0];
    const price = firstVariant?.price ? `$${firstVariant.price}` : '$0.00';
    
    // Build colors array from variants
    const colorMap = new Map();
    
    product.variants?.forEach((variant) => {
      const colorName = variant.option1 || 'Default';
      const size = variant.option2 || '';
      
      if (!colorMap.has(colorName)) {
        // Create new color entry
        const color = {
          name: colorName,
          hex: getColorHex(colorName),
          images: {
            main: '',
            back: '',
            lifestyle: []
          },
          variants: []
        };
        
        // Try to find images for this color
        const colorSlug = colorName.toLowerCase().replace(/\s+/g, '-');
        
        // Check if we have image mappings for this product and color
        if (imageMappings[slug] && imageMappings[slug][colorName]) {
          const mapping = imageMappings[slug][colorName];
          color.images.main = mapping.main || `/images/${slug}/${colorSlug}-main.jpg`;
          color.images.back = mapping.back || '';
          color.images.lifestyle = mapping.lifestyle || [`/images/${slug}/${colorSlug}-lifestyle-1.jpg`];
        } else {
          // Fallback to constructed paths
          color.images.main = `/images/${slug}/${colorSlug}-main.jpg`;
          color.images.back = '';
          color.images.lifestyle = [`/images/${slug}/${colorSlug}-lifestyle-1.jpg`];
        }
        
        colorMap.set(colorName, color);
      }
      
      // Add variant to color
      const color = colorMap.get(colorName);
      color.variants.push({
        size: size,
        price: parseFloat(variant.price || '0'),
        sku: variant.sku || '',
        available: variant.available !== false
      });
    });
    
    const colors = Array.from(colorMap.values());
    
    return {
      slug,
      name,
      vendor,
      collection,
      tags,
      price,
      colors,
      filename
    };
  } catch (error) {
    console.error(`Error converting product from ${filename}:`, error);
    return null;
  }
}

async function testProductLoading() {
  let totalErrors = 0;
  let totalWarnings = 0;
  const products = [];
  
  try {
    // Read all JSON files in the products directory
    const files = fs.readdirSync(PRODUCTS_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    console.log(`Found ${jsonFiles.length} JSON files in products directory\n`);
    
    // Load and test each product
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(PRODUCTS_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const shopifyData = JSON.parse(fileContent);
        
        const product = convertShopifyToProduct(shopifyData, file);
        if (product) {
          products.push(product);
        } else {
          console.error(`❌ Failed to convert product from file: ${file}`);
          totalErrors++;
        }
      } catch (error) {
        console.error(`❌ Error loading product file ${file}:`, error.message);
        totalErrors++;
      }
    }
    
    // Sort products by name for consistency
    products.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`\nSuccessfully loaded ${products.length} products\n`);
    
    // Test each product
    for (const product of products) {
      console.log(`\n--- Testing: ${product.name} ---`);
      console.log(`File: ${product.filename}`);
      console.log(`Slug: ${product.slug}`);
      console.log(`Collection: ${product.collection}`);
      console.log(`Price: ${product.price}`);
      console.log(`Colors: ${product.colors.length}`);
      
      // Check color mappings
      const colorNames = product.colors.map(c => c.name);
      console.log(`Color names: ${colorNames.join(', ')}`);
      
      // Check for missing images
      console.log('\nChecking images:');
      let missingImages = 0;
      
      for (const color of product.colors) {
        // Check main image
        if (color.images.main) {
          const imagePath = path.join(__dirname, '..', 'public', color.images.main);
          if (!fs.existsSync(imagePath)) {
            console.error(`❌ Missing main image: ${color.images.main} (${color.name})`);
            missingImages++;
            totalErrors++;
          }
        } else {
          console.warn(`⚠️  No main image specified for ${color.name}`);
          totalWarnings++;
        }
        
        // Check back image
        if (color.images.back) {
          const imagePath = path.join(__dirname, '..', 'public', color.images.back);
          if (!fs.existsSync(imagePath)) {
            console.error(`❌ Missing back image: ${color.images.back} (${color.name})`);
            missingImages++;
            totalErrors++;
          }
        }
        
        // Check lifestyle images
        for (const image of color.images.lifestyle || []) {
          const imagePath = path.join(__dirname, '..', 'public', image);
          if (!fs.existsSync(imagePath)) {
            console.error(`❌ Missing lifestyle image: ${image} (${color.name})`);
            missingImages++;
            totalErrors++;
          }
        }
      }
      
      if (missingImages === 0) {
        console.log('✅ All specified images found');
      } else {
        console.log(`❌ ${missingImages} images missing`);
      }
      
      // Check color structure
      console.log('\nColor details:');
      for (const color of product.colors) {
        console.log(`  ${color.name}:`);
        console.log(`    - Hex: ${color.hex || 'Not set'}`);
        console.log(`    - Main image: ${color.images.main ? 'Yes' : 'No'}`);
        console.log(`    - Back image: ${color.images.back ? 'Yes' : 'No'}`);
        console.log(`    - Lifestyle images: ${color.images.lifestyle?.length || 0}`);
        console.log(`    - Variants: ${color.variants.length}`);
        
        // Check variant details
        const sizes = color.variants.map(v => v.size).filter(s => s);
        if (sizes.length > 0) {
          console.log(`    - Sizes: ${sizes.join(', ')}`);
        }
      }
    }
    
    // Check for duplicate slugs
    console.log('\n=== Checking for Duplicate Slugs ===');
    const slugCounts = {};
    for (const product of products) {
      slugCounts[product.slug] = (slugCounts[product.slug] || 0) + 1;
    }
    
    let duplicates = 0;
    for (const [slug, count] of Object.entries(slugCounts)) {
      if (count > 1) {
        console.error(`❌ Duplicate slug found: "${slug}" appears ${count} times`);
        duplicates++;
        totalErrors++;
      }
    }
    
    if (duplicates === 0) {
      console.log('✅ No duplicate slugs found');
    }
    
    // Summary
    console.log('\n=== SUMMARY ===');
    console.log(`Total products: ${products.length}`);
    console.log(`Total colors: ${products.reduce((sum, p) => sum + p.colors.length, 0)}`);
    console.log(`Total variants: ${products.reduce((sum, p) => sum + p.colors.reduce((s, c) => s + c.variants.length, 0), 0)}`);
    console.log(`Total errors: ${totalErrors}`);
    console.log(`Total warnings: ${totalWarnings}`);
    
    if (totalErrors === 0) {
      console.log('\n✅ All tests passed! Products are loading correctly.');
    } else {
      console.log(`\n❌ Found ${totalErrors} errors. Please fix before proceeding.`);
    }
    
    // List products by collection
    console.log('\n=== Products by Collection ===');
    const collections = {};
    for (const product of products) {
      if (!collections[product.collection]) {
        collections[product.collection] = [];
      }
      collections[product.collection].push(product.name);
    }
    
    for (const [collection, productNames] of Object.entries(collections)) {
      console.log(`\n${collection}:`);
      productNames.forEach(name => console.log(`  - ${name}`));
    }
    
  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
  
  process.exit(totalErrors > 0 ? 1 : 0);
}

// Run the test
testProductLoading();