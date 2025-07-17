#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const JSON_DIR = path.join(__dirname, '..', 'src', 'data', 'products');
const OUTPUT_FILE = path.join(JSON_DIR, 'products-data.ts');

// Collection mapping based on product type
const COLLECTION_MAPPING = {
  'Headwear': 'Headwear',
  'Layers': 'Upperwear',
  'Upperwear': 'Upperwear',
  'Tees': 'Upperwear',
  'Bottoms': 'Bottoms'
};

// Helper function to extract color from variant option1 or title
function extractColorFromVariant(variant) {
  if (variant.option1 && variant.option1 !== variant.option2) {
    return variant.option1;
  }
  // Fallback to parsing title if option1 is not a color
  const titleParts = variant.title.split(' / ');
  return titleParts[0];
}

// Helper function to extract size from variant
function extractSizeFromVariant(variant) {
  if (variant.option2) {
    return variant.option2;
  }
  const titleParts = variant.title.split(' / ');
  return titleParts.length > 1 ? titleParts[1] : titleParts[0];
}

// Helper function to get collection based on product type
function getCollection(productType) {
  return COLLECTION_MAPPING[productType] || 'Upperwear';
}

// Helper function to find image for variant
function findImageForVariant(images, variantImageId) {
  if (!variantImageId) return null;
  return images.find(img => img.id === variantImageId);
}

// Helper function to find lifestyle images for a color
function findLifestyleImages(images, color) {
  return images
    .filter(img => {
      const src = img.src.toLowerCase();
      const colorName = color.toLowerCase().replace(/\s+/g, '-');
      return src.includes('lifestyle') && src.includes(colorName);
    })
    .map(img => img.src)
    .slice(0, 3); // Limit to 3 lifestyle images
}

// Helper function to find back image for a color
function findBackImage(images, color) {
  const colorName = color.toLowerCase().replace(/\s+/g, '-');
  const backImage = images.find(img => {
    const src = img.src.toLowerCase();
    return src.includes('back') && src.includes(colorName);
  });
  return backImage ? backImage.src : '';
}

// Helper function to generate hex color approximation
function generateHexColor(colorName) {
  const colorMap = {
    'black': '#000000',
    'white': '#FFFFFF',
    'blue': '#4169E1',
    'green': '#228B22',
    'red': '#DC143C',
    'yellow': '#FFD700',
    'orange': '#FF8C00',
    'purple': '#800080',
    'pink': '#FFC0CB',
    'brown': '#8B4513',
    'gray': '#808080',
    'grey': '#808080',
    'beige': '#F5F5DC',
    'khaki': '#C3B091',
    'olive': '#808000',
    'navy': '#000080',
    'maroon': '#800000',
    'bone': '#F9F6EE',
    'faded black': '#333333',
    'faded bone': '#EDE8DC',
    'faded green': '#6B8E23',
    'faded khaki': '#9B8B4D',
    'eucalyptus': '#6B8E23',
    'sand': '#C2B280',
    'vintage black': '#2C2C2C'
  };
  
  const normalizedColor = colorName.toLowerCase();
  return colorMap[normalizedColor] || '#808080';
}

// Main transformation function
function transformProductData(shopifyProduct) {
  const product = shopifyProduct.product;
  
  // Group variants by color
  const colorGroups = {};
  
  product.variants.forEach(variant => {
    const color = extractColorFromVariant(variant);
    const size = extractSizeFromVariant(variant);
    
    if (!colorGroups[color]) {
      colorGroups[color] = {
        variants: [],
        images: []
      };
    }
    
    colorGroups[color].variants.push({
      size: size,
      price: parseFloat(variant.price),
      sku: variant.sku,
      available: true // Assuming available for now
    });
    
    // Find main image for this variant
    const variantImage = findImageForVariant(product.images, variant.image_id);
    if (variantImage && !colorGroups[color].images.includes(variantImage.src)) {
      colorGroups[color].images.push(variantImage.src);
    }
  });
  
  // Transform color groups into ProductColor objects
  const colors = Object.keys(colorGroups).map(colorName => {
    const colorGroup = colorGroups[colorName];
    const mainImage = colorGroup.images[0] || '';
    const backImage = findBackImage(product.images, colorName);
    const lifestyleImages = findLifestyleImages(product.images, colorName);
    
    return {
      name: colorName,
      swatch: '',
      hex: generateHexColor(colorName),
      images: {
        main: mainImage,
        back: backImage,
        lifestyle: lifestyleImages
      },
      variants: colorGroup.variants
    };
  });
  
  // Calculate price range
  const prices = product.variants.map(v => parseFloat(v.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceDisplay = minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
  
  // Transform to our Product interface
  return {
    slug: product.handle,
    name: product.title,
    vendor: product.vendor,
    collection: getCollection(product.product_type),
    tags: product.tags.split(', ').filter(tag => tag.trim()),
    price: priceDisplay,
    originalPrice: '',
    description: product.body_html,
    fullDescription: product.body_html,
    features: [],
    specifications: [],
    origin: [],
    careInstructions: [],
    sizes: [],
    colors: colors
  };
}

// Main execution
async function regenerateProductsData() {
  console.log('🔄 Regenerating products-data.ts from individual JSON files...');
  
  try {
    // Read all JSON files in the products directory
    const files = fs.readdirSync(JSON_DIR)
      .filter(file => file.endsWith('.json') && file !== 'extracted-colors.json')
      .sort();
    
    console.log(`📂 Found ${files.length} product JSON files`);
    
    const products = [];
    
    for (const file of files) {
      try {
        const filePath = path.join(JSON_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const shopifyProduct = JSON.parse(fileContent);
        
        const transformedProduct = transformProductData(shopifyProduct);
        products.push(transformedProduct);
        
        console.log(`✅ Processed: ${transformedProduct.name} (${transformedProduct.colors.length} colors)`);
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }
    
    // Generate TypeScript file content
    const tsContent = `/**
 * Generated product data - DO NOT EDIT MANUALLY
 * This file is auto-generated from the JSON product files
 * Generated on: ${new Date().toISOString()}
 */

import { Product } from './types';

export const products: Product[] = ${JSON.stringify(products, null, 2)};

export default products;
`;
    
    // Write the output file
    fs.writeFileSync(OUTPUT_FILE, tsContent);
    
    console.log(`🎉 Successfully generated ${OUTPUT_FILE}`);
    console.log(`📊 Total products: ${products.length}`);
    console.log(`📊 Total colors across all products: ${products.reduce((sum, p) => sum + p.colors.length, 0)}`);
    
    // Generate summary report
    const report = {
      totalProducts: products.length,
      totalColors: products.reduce((sum, p) => sum + p.colors.length, 0),
      collections: [...new Set(products.map(p => p.collection))],
      productsByCollection: {},
      generatedAt: new Date().toISOString()
    };
    
    // Group products by collection
    products.forEach(product => {
      if (!report.productsByCollection[product.collection]) {
        report.productsByCollection[product.collection] = [];
      }
      report.productsByCollection[product.collection].push({
        name: product.name,
        slug: product.slug,
        colors: product.colors.length
      });
    });
    
    const reportPath = path.join(__dirname, 'regeneration-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📋 Report saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ Fatal error during regeneration:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  regenerateProductsData();
}

module.exports = { regenerateProductsData, transformProductData };