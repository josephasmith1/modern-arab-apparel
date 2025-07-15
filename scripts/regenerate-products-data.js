/**
 * Script to regenerate the products-data.ts file using the corrected product loader
 */

const fs = require('fs');
const path = require('path');

// Since we can't import TypeScript modules directly in Node.js without compilation,
// I'll create a simpler approach by reading the JSON files and applying the logic

const PRODUCTS_DIR = path.join(process.cwd(), 'src/data/products');
const OUTPUT_FILE = path.join(PRODUCTS_DIR, 'products-data.ts');

/**
 * Mapping for product handle to image folder name mismatches
 */
const FOLDER_MAPPINGS = {
  'modern-arab-beanie-2': 'modernarab-beanie'
};

/**
 * Mapping for color names that don't match the actual file naming convention
 */
const COLOR_MAPPINGS = {
  'olive-green': 'green',
  'faded-black': 'faded-black',
  'faded-bone': 'faded-bone',
  'faded-green': 'faded-green',
  'faded-khaki': 'faded-khaki',
  'olive': 'olive',
  'maroon': 'maroon',
  'white': 'white',
  'blue': 'blue',
  'beige': 'beige',
  'navy': 'navy',
  'gray': 'gray',
  'grey': 'grey'
};

/**
 * Product-specific color mappings
 */
const PRODUCT_COLOR_MAPPINGS = {
  'modern-arab-joggers': {
    'black': 'faded-black',
    'olive-green': 'green'
  },
  'modern-arab-beanie-2': {
    'black': 'faded-black'
  },
  'modern-arab-cap': {
    'khaki': 'faded-khaki',
    'black': 'faded-black',
    'green': 'green' // This only has lifestyle, will be handled below
  },
  'modernarab-crewneck': {
    'vintage-black': 'faded-black',
    'faded-black': 'faded-black'
  },
  'modern-arab-sweatpants': {
    'light-green': 'green',
    'light-blue': 'blue'
  }
};

/**
 * Generate color slug that matches the actual file naming convention
 */
function generateColorSlug(colorName, productSlug) {
  const baseSlug = colorName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  // Check for product-specific mapping first
  if (productSlug && PRODUCT_COLOR_MAPPINGS[productSlug]?.[baseSlug]) {
    return PRODUCT_COLOR_MAPPINGS[productSlug][baseSlug];
  }
  
  // Fall back to general color mapping
  return COLOR_MAPPINGS[baseSlug] || baseSlug;
}

/**
 * Get the correct image folder name for a product slug
 */
function getImageFolderName(productSlug) {
  return FOLDER_MAPPINGS[productSlug] || productSlug;
}

/**
 * Generate image paths with fallback logic for missing images
 */
function generateImagePaths(colorSlug, folderName) {
  const basePath = `/images/${folderName}/${colorSlug}`;
  
  // Default paths
  const paths = {
    main: `${basePath}-main.jpg`,
    back: `${basePath}-back.jpg`,
    lifestyle: [`${basePath}-lifestyle-1.jpg`]
  };
  
  // For products that commonly only have lifestyle images, use lifestyle as main
  const lifestyleOnlyProducts = [
    'modern-arab-beanie-1',
    'fisherman-beanie',
    'modernarab-beanie'
  ];
  
  // For specific color/product combinations that only have lifestyle images
  const lifestyleOnlyColors = {
    'modern-arab-cap': ['green'] // green cap only has lifestyle image
  };
  
  if (lifestyleOnlyProducts.includes(folderName)) {
    // Use lifestyle image as main if main doesn't exist
    paths.main = `${basePath}-lifestyle-1.jpg`;
    // Don't set back image for lifestyle-only products since they don't exist
    paths.back = `${basePath}-lifestyle-1.jpg`;
  } else if (lifestyleOnlyColors[folderName]?.includes(colorSlug)) {
    // Use lifestyle as main for specific color combinations
    paths.main = `${basePath}-lifestyle-1.jpg`;
    paths.back = ''; // No back image
  }
  
  return paths;
}

/**
 * Get hex color code for common color names
 */
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

/**
 * Convert Shopify product JSON to our Product interface
 */
function convertShopifyToProduct(shopifyData) {
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
    const originalPrice = firstVariant?.compare_at_price ? `$${firstVariant.compare_at_price}` : '';
    
    // Extract description (first paragraph before any HTML)
    const description = product.body_html
      ? product.body_html.replace(/<[^>]*>/g, ' ').trim().split('.')[0] + '...'
      : '';
    
    const fullDescription = product.body_html || '';
    
    // Initialize arrays
    const features = [];
    const specifications = [];
    const origin = [];
    const careInstructions = [];
    
    // Extract sizes from variants if they have size options
    const sizes = [];
    const sizeSet = new Set();
    product.variants?.forEach((variant) => {
      if (variant.option2) {
        sizeSet.add(variant.option2);
      }
    });
    if (sizeSet.size > 0) {
      sizes.push(...Array.from(sizeSet));
    }
    
    // Build colors array from variants
    const colorMap = new Map();
    
    product.variants?.forEach((variant) => {
      const colorName = variant.option1 || 'Default';
      const size = variant.option2 || '';
      
      if (!colorMap.has(colorName)) {
        // Create new color entry
        const color = {
          name: colorName,
          swatch: '',
          hex: getColorHex(colorName),
          images: {
            main: '',
            back: '',
            lifestyle: []
          },
          variants: []
        };
        
        // Generate image paths based on actual folder structure
        const colorSlug = generateColorSlug(colorName, slug);
        const folderName = getImageFolderName(slug);
        
        // Generate paths using the correct folder and color mappings with fallbacks
        const imagePaths = generateImagePaths(colorSlug, folderName);
        color.images.main = imagePaths.main;
        color.images.back = imagePaths.back;
        color.images.lifestyle = imagePaths.lifestyle;
        
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
      originalPrice,
      description,
      fullDescription,
      features,
      specifications,
      origin,
      careInstructions,
      sizes,
      colors
    };
  } catch (error) {
    console.error(`Error converting product:`, error);
    return null;
  }
}

async function main() {
  try {
    console.log('🔄 Regenerating products-data.ts with corrected image paths...');
    
    // Read all JSON files in the products directory
    const files = fs.readdirSync(PRODUCTS_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const products = [];
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(PRODUCTS_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const shopifyData = JSON.parse(fileContent);
        
        const product = convertShopifyToProduct(shopifyData);
        if (product) {
          products.push(product);
          console.log(`✅ Processed: ${product.name} (${product.slug})`);
        } else {
          console.error(`❌ Failed to convert product from file: ${file}`);
        }
      } catch (error) {
        console.error(`❌ Error loading product file ${file}:`, error);
      }
    }
    
    // Sort products by name for consistency
    products.sort((a, b) => a.name.localeCompare(b.name));
    
    // Generate the TypeScript file
    const tsContent = `/**
 * Generated product data - DO NOT EDIT MANUALLY
 * This file is auto-generated from the JSON product files
 */

import { Product } from './types';

export const products: Product[] = ${JSON.stringify(products, null, 2)};
`;
    
    // Write the file
    fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf-8');
    
    console.log(`🎉 Successfully regenerated ${OUTPUT_FILE}`);
    console.log(`📊 Processed ${products.length} products`);
    
    // Show some examples of corrected paths
    console.log('\n🔧 Examples of corrected image paths:');
    products.slice(0, 3).forEach(product => {
      product.colors.forEach(color => {
        console.log(`   ${product.slug} / ${color.name}:`);
        console.log(`     Main: ${color.images.main}`);
        if (color.images.lifestyle.length > 0) {
          console.log(`     Lifestyle: ${color.images.lifestyle[0]}`);
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Error regenerating products data:', error);
    process.exit(1);
  }
}

main();