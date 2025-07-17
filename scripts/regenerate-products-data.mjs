#!/usr/bin/env node

import { createRequire } from 'module';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_DIR = path.join(__dirname, '../src/data/products');

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
    'faded green': '#8FBC8F',
    'faded eucalyptus': '#8FBC8F',
    'faded khaki': '#BDB76B',
    'faded  khaki': '#BDB76B',
    'faded black': '#2F2F2F',
    'khaki': '#C3B091',
    'bone': '#F5F5DC',
    'sand': '#D2B48C',
    'faded sand': '#D2B48C',
    'heather dust': '#D3D3D3',
    'natural': '#FFF8DC',
    'military green': '#4E5B31',
    'vintage black': '#2B2B2B',
    'sky blue': '#87CEEB',
    'forest green': '#228B22'
  };
  
  return colorMap[colorName.toLowerCase()] || '#808080';
}

/**
 * Helper function to check if a URL contains any color name from the product
 */
function hasColorInUrl(url, product) {
  const colors = product.options?.[0]?.values || [];
  const urlLower = url.toLowerCase();
  
  for (const color of colors) {
    const colorLower = color.toLowerCase().replace(/\s+/g, '-');
    if (urlLower.includes(colorLower)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Map color names to their URL equivalents
 */
function getColorUrlPattern(colorName) {
  const mappings = {
    'Light Blue': 'light-blue',
    'Light Green': 'alpine-green',
    'Light Black': 'black',
    'Dark Blue': 'slate-blue',
    'Faded Green': 'faded-eucalyptus',
    'Faded  Khaki': 'faded-khaki',
    'Faded Khaki': 'faded-khaki',
    'Vintage Black': 'vintage-black',
    'Forest Green': 'forest-green',
    'Olive Green': 'olive-green',
    'Military Green': 'military-green'
  };
  
  return mappings[colorName] || colorName.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Get images for a specific color using the CORRECT Shopify variant mapping
 */
function getImagesForColorCorrect(product, colorName, isSingleColorProduct = false) {
  const result = {
    main: '',
    back: '',
    lifestyle: []
  };
  
  // Step 1 & 2: Get all variant IDs for this color
  const colorVariantIds = product.variants
    ?.filter((v) => v.option1 === colorName)
    ?.map((v) => v.id) || [];
  
  console.log(`  Color ${colorName} has variant IDs:`, colorVariantIds.length);
  
  // Step 2.5: Get all image IDs that variants of this color point to
  const colorImageIds = product.variants
    ?.filter((v) => {
      if (isSingleColorProduct) {
        return v.image_id; // For single color products, get all variant image IDs
      }
      return v.option1 === colorName && v.image_id;
    })
    ?.map((v) => v.image_id) || [];
  
  // Step 2.6: Get all image IDs that OTHER colors' variants point to (for exclusion)
  const otherColorImageIds = product.variants
    ?.filter((v) => {
      if (isSingleColorProduct) {
        return false; // Single color products don't have other colors
      }
      return v.option1 !== colorName && v.image_id;
    })
    ?.map((v) => v.image_id) || [];
  
  // Step 3: Find all images that belong to this color
  let colorImages = [];
  
  // First, get images specifically linked to this color
  const specificImages = product.images?.filter((img) => {
    // 1. Any variant of this color points to this image via image_id
    if (colorImageIds.includes(img.id)) {
      return true;
    }
    // 2. It has variant_ids that include ANY of our color's variant IDs
    if (img.variant_ids && img.variant_ids.length > 0) {
      return img.variant_ids.some((vid) => colorVariantIds.includes(vid));
    }
    return false;
  }) || [];
  
  // Then, get lifestyle images (empty variant_ids) but exclude other colors' mockups
  const generalLifestyleImages = product.images?.filter((img) => {
    // Must have empty variant_ids
    if (img.variant_ids && img.variant_ids.length > 0) {
      return false;
    }
    
    // Exclude if it's pointed to by another color's variant
    if (otherColorImageIds.includes(img.id)) {
      return false;
    }
    
    // Exclude if it looks like a product mockup (front/back) for another color
    const url = img.src.toLowerCase();
    if (url.includes('front') || url.includes('back')) {
      // Check if this might be a mockup for another color
      // Look for color names in the URL
      const otherColors = product.options?.[0]?.values?.filter(c => c !== colorName) || [];
      for (const otherColor of otherColors) {
        const otherColorLower = otherColor.toLowerCase().replace(/\s+/g, '-');
        if (url.includes(otherColorLower)) {
          return false; // This is a mockup for another color
        }
      }
    }
    
    return true;
  }) || [];
  
  // If we have specific images for this color, use them plus lifestyle images
  // If we have no specific images, include all images (fallback for problematic products)
  if (specificImages.length > 0) {
    colorImages = [...specificImages, ...generalLifestyleImages];
  } else {
    colorImages = product.images || [];
  }
  
  console.log(`  Found ${colorImages.length} images for color ${colorName}`);
  
  // Step 4: Categorize images
  const frontImages = [];
  const backImages = [];
  const lifestyleImages = [];
  
  colorImages.forEach((img) => {
    const url = img.src.toLowerCase();
    
    if (img.variant_ids && img.variant_ids.length > 0) {
      // This is a product mockup (has variant IDs)
      if (url.includes('front')) {
        frontImages.push(img);
      } else if (url.includes('back')) {
        backImages.push(img);
      } else {
        // Other product images that aren't clearly front/back
        lifestyleImages.push(img);
      }
    } else {
      // This is a lifestyle image (no variant IDs)
      lifestyleImages.push(img);
    }
  });
  
  // Step 5: Sort by position and assign
  frontImages.sort((a, b) => a.position - b.position);
  backImages.sort((a, b) => a.position - b.position);
  lifestyleImages.sort((a, b) => a.position - b.position);
  
  // Additional check: Look for front/back images in lifestyle array
  // This handles cases where front/back images have empty variant_ids
  // BUT only move them if they match our color
  const colorUrlPattern = getColorUrlPattern(colorName);
  
  const lifestyleFrontIndex = lifestyleImages.findIndex(img => {
    const url = img.src.toLowerCase();
    if (!url.includes('front')) return false;
    
    // Check if this front image is for our color
    return url.includes(colorUrlPattern) || !hasColorInUrl(url, product);
  });
  
  // First try to find a back image that matches our color pattern
  let lifestyleBackIndex = lifestyleImages.findIndex(img => {
    const url = img.src.toLowerCase();
    return url.includes('back') && url.includes(colorUrlPattern);
  });
  
  // If not found, look for a generic back image that doesn't belong to other colors
  if (lifestyleBackIndex === -1) {
    lifestyleBackIndex = lifestyleImages.findIndex(img => {
      const url = img.src.toLowerCase();
      if (!url.includes('back')) return false;
      
      // Check if this back image doesn't belong to any other color
      const otherColors = product.options?.[0]?.values?.filter(c => c !== colorName) || [];
      for (const otherColor of otherColors) {
        const otherPattern = getColorUrlPattern(otherColor);
        if (url.includes(otherPattern)) {
          return false; // This back image belongs to another color
        }
      }
      
      return true; // This back image doesn't belong to other colors
    });
  }
  
  if (lifestyleFrontIndex !== -1) {
    // Move front image from lifestyle to frontImages
    frontImages.push(lifestyleImages[lifestyleFrontIndex]);
    lifestyleImages.splice(lifestyleFrontIndex, 1);
  }
  
  if (lifestyleBackIndex !== -1) {
    // Adjust index if we removed a front image before it
    const adjustedIndex = lifestyleFrontIndex !== -1 && lifestyleFrontIndex < lifestyleBackIndex 
      ? lifestyleBackIndex - 1 
      : lifestyleBackIndex;
    // Move back image from lifestyle to backImages
    backImages.push(lifestyleImages[adjustedIndex]);
    lifestyleImages.splice(adjustedIndex, 1);
  }
  
  // Re-sort after moving images
  frontImages.sort((a, b) => a.position - b.position);
  backImages.sort((a, b) => a.position - b.position);
  
  // Priority 1: Use the image that the first variant of this color points to via image_id
  let mainImageAssigned = false;
  const firstColorVariant = product.variants?.find(v => v.option1 === colorName);
  if (firstColorVariant?.image_id) {
    const variantImage = product.images?.find(img => img.id === firstColorVariant.image_id);
    if (variantImage) {
      result.main = variantImage.src;
      mainImageAssigned = true;
    }
  }
  
  // Priority 2: Use front image if no variant image_id
  if (!mainImageAssigned && frontImages.length > 0) {
    result.main = frontImages[0].src;
  } else if (!mainImageAssigned && backImages.length > 0) {
    // Fallback to back if no front image
    result.main = backImages[0].src;
  } else if (!mainImageAssigned && lifestyleImages.length > 0) {
    // Fallback to lifestyle if no product mockups
    result.main = lifestyleImages[0].src;
  }
  
  // Assign back image
  if (backImages.length > 0) {
    result.back = backImages[0].src;
  } else if (backImages.length === 0 && frontImages.length > 0) {
    // If no back image found but we have a front image, look for a back image
    // in the lifestyle array that matches the pattern of the front image
    const frontUrl = frontImages[0].src;
    const frontPattern = frontUrl.match(/([^/]+)-front-/)?.[1];
    
    if (frontPattern) {
      // Look for corresponding back image with same pattern
      const matchingBack = lifestyleImages.find(img => {
        const url = img.src.toLowerCase();
        return url.includes(frontPattern) && url.includes('-back-');
      });
      
      if (matchingBack) {
        result.back = matchingBack.src;
        // Remove from lifestyle since it's actually a product image
        const backIndex = lifestyleImages.indexOf(matchingBack);
        if (backIndex > -1) {
          lifestyleImages.splice(backIndex, 1);
        }
      }
    }
  }
  
  // All lifestyle images
  result.lifestyle = lifestyleImages.map(img => img.src);
  
  console.log(`  Images assigned for ${colorName}: main=${result.main ? '✓' : '✗'}, back=${result.back ? '✓' : '✗'}, lifestyle=${result.lifestyle.length}`);
  
  return result;
}

/**
 * Convert Shopify product JSON to our Product interface
 */
function convertShopifyToProduct(shopifyData) {
  try {
    const { product } = shopifyData;
    
    // Extract basic product info exactly as stored
    const slug = product.handle;
    const name = product.title;
    const vendor = product.vendor;
    const collection = product.product_type;
    const tags = product.tags ? product.tags.split(', ') : [];
    
    // Get price from first variant
    const firstVar = product.variants?.[0];
    const price = firstVar?.price ? `$${firstVar.price}` : '$0.00';
    const originalPrice = firstVar?.compare_at_price ? `$${firstVar.compare_at_price}` : '';
    
    // Use full description exactly as stored
    const description = product.body_html || '';
    const fullDescription = product.body_html || '';
    
    // Extract features, specifications, etc.
    const features = [];
    const specifications = [];
    const origin = [];
    const careInstructions = [];
    
    // Get all unique sizes from variants
    const sizes = [];
    const sizeSet = new Set();
    product.variants?.forEach((variant) => {
      if (variant.option2) {
        sizeSet.add(variant.option2);
      }
    });
    sizes.push(...Array.from(sizeSet));
    
    // Build colors from variants with CORRECT image mapping
    const colorMap = new Map();
    
    // Check if this is a single-color product (where option1 is actually size)
    // This happens when all variants have the same color but different sizes
    const firstVariant = product.variants?.[0];
    const uniqueOption1Values = [...new Set(product.variants?.map(v => v.option1) || [])];
    const isSingleColorProduct = firstVariant && 
      ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'].includes(firstVariant.option1) &&
      uniqueOption1Values.every(val => ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'].includes(val));
    
    // Group variants by color (option1)
    product.variants?.forEach((variant) => {
      let colorName, size;
      
      if (isSingleColorProduct) {
        // For single-color products, derive color from product title or filename
        const title = product.title.toLowerCase();
        const handle = product.handle.toLowerCase();
        
        colorName = title.includes('faded green') || title.includes('faded eucalyptus') ? 'Faded Green' :
                   title.includes('faded khaki') ? 'Faded Khaki' :
                   title.includes('black') || handle.includes('-black') ? 'Black' :
                   title.includes('white') || handle.includes('-white') ? 'White' :
                   title.includes('sand') || handle.includes('-sand') ? 'Sand' :
                   title.includes('bone') ? 'Bone' :
                   title.includes('maroon') ? 'Maroon' :
                   title.includes('olive') ? 'Olive' :
                   title.includes('blue') ? 'Blue' :
                   title.includes('green') ? 'Green' :
                   'Natural'; // Better default than 'Default'
        size = variant.option1; // Size is in option1 for single-color products
      } else {
        // Normal multi-color products
        colorName = variant.option1 || 'Default';
        size = variant.option2 || variant.option1 || '';
      }
      
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
        
        // Get images for this color using the CORRECT algorithm
        const colorImages = getImagesForColorCorrect(product, colorName, isSingleColorProduct);
        color.images = colorImages;
        
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

async function regenerateProductsData() {
  try {
    console.log('Loading products from JSON files with CORRECT variant-to-image mapping...\n');
    
    const products = [];
    
    // Read all JSON files in the products directory
    const files = await fs.readdir(PRODUCTS_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json') && file !== 'types.ts' && file !== 'products-data.ts');
    
    for (const file of jsonFiles) {
      console.log(`Processing ${file}...`);
      const filePath = path.join(PRODUCTS_DIR, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const shopifyData = JSON.parse(fileContent);
      
      const product = convertShopifyToProduct(shopifyData);
      if (product) {
        products.push(product);
        console.log(`✓ Loaded: ${product.name} with ${product.colors.length} colors\n`);
      } else {
        console.error(`✗ Failed to convert product from file: ${file}\n`);
      }
    }
    
    // Sort products by name for consistency
    products.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(`\nLoaded ${products.length} products successfully`);
    
    // Generate the TypeScript file content
    const fileContent = `// This file is auto-generated by scripts/regenerate-products-data.mjs
// DO NOT EDIT MANUALLY - Run: node scripts/regenerate-products-data.mjs
import { Product } from './types';

export const products: Product[] = ${JSON.stringify(products, null, 2)};
`;
    
    // Write to products-data.ts
    const outputPath = path.join(PRODUCTS_DIR, 'products-data.ts');
    await fs.writeFile(outputPath, fileContent, 'utf-8');
    
    console.log(`\n✅ Successfully generated ${outputPath}`);
    console.log('\nSummary:');
    products.forEach(product => {
      console.log(`\n${product.name}: ${product.colors.length} colors`);
      product.colors.forEach(color => {
        const imageCount = (color.images.main ? 1 : 0) + 
                          (color.images.back ? 1 : 0) + 
                          color.images.lifestyle.length;
        console.log(`  - ${color.name}: ${imageCount} images`);
      });
    });
    
  } catch (error) {
    console.error('Error regenerating products data:', error);
    process.exit(1);
  }
}

regenerateProductsData();