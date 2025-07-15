const fs = require('fs');
const path = require('path');

// Color hex mapping
const colorHexMap = {
  'Faded Bone': '#E8E4E0',
  'Faded Green': '#A4B5A0',
  'Faded Khaki': '#C4A575',
  'Faded  Khaki': '#C4A575', // Handle double space
  'faded khaki': '#C4A575',
  'Faded Black': '#4A4A4A',
  'Faded Sand': '#D4C4A8',
  'Faded Eucalyptus': '#A4B5A0',
  'Light Green': '#C8D5B9',
  'Light Blue': '#B8D4E3',
  'Light Black': '#696969',
  'Dark Blue': '#2C3E50',
  'Bone': '#E8E4E0',
  'Blue': '#4169E1',
  'White': '#FFFFFF',
  'Green': '#50C878',
  'Vintage Black': '#2F2F2F',
  'Black': '#000000',
  'Maroon': '#800000',
  'Olive Green': '#708238',
  'Olive': '#808000',
  'Khaki': '#C3B091',
  'Beige': '#F5E6CA'
};

// Function to extract description text from HTML
function extractDescription(html) {
  // Simple extraction - just get the first paragraph text
  const match = html.match(/<p>([^<]+)/);
  return match ? match[1].substring(0, 160) + '...' : '';
}

// Function to get unique colors from variants
function getUniqueColors(variants) {
  const colors = {};
  variants.forEach(variant => {
    const color = variant.option1;
    if (color && !colors[color]) {
      colors[color] = {
        name: color,
        swatch: '',
        hex: colorHexMap[color] || '#8B7355',
        images: {
          main: '',
          back: '',
          lifestyle: []
        },
        variants: []
      };
    }
    // Add variant to color
    if (color && colors[color]) {
      colors[color].variants.push({
        size: variant.option2 || '',
        price: parseFloat(variant.price),
        sku: variant.sku,
        available: true
      });
    }
  });
  return Object.values(colors);
}

// Function to find images for a product/color
function findImagesForProductColor(handle, colorName) {
  const imagesDir = path.join(__dirname, '../public/images', handle);
  
  if (!fs.existsSync(imagesDir)) {
    console.log(`  ⚠️  No image directory found for ${handle}`);
    return { main: '', back: '', lifestyle: [] };
  }
  
  const files = fs.readdirSync(imagesDir);
  const normalizedColor = colorName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
  
  let mainImage = '';
  let backImage = '';
  const lifestyleImages = [];
  
  // First, look for color-specific images
  files.forEach(file => {
    const lowerFile = file.toLowerCase();
    
    // Check if file matches this color
    if (!lowerFile.includes(normalizedColor)) {
      // Also check for partial matches (e.g., "black" matches "faded-black")
      const colorParts = normalizedColor.split('-');
      const mainColorPart = colorParts[colorParts.length - 1]; // Get last part (e.g., "black" from "faded-black")
      if (!lowerFile.includes(mainColorPart)) {
        return;
      }
    }
    
    const imagePath = `/images/${handle}/${file}`;
    
    if (lowerFile.includes('-main')) {
      mainImage = imagePath;
    } else if (lowerFile.includes('-back')) {
      backImage = imagePath;
    } else if (lowerFile.includes('-lifestyle-')) {
      lifestyleImages.push(imagePath);
    } else if (lowerFile === normalizedColor + '-1.jpg') {
      // Use color-1.jpg as main if no -main exists
      if (!mainImage) mainImage = imagePath;
    }
  });
  
  // Sort lifestyle images by number
  lifestyleImages.sort((a, b) => {
    const numA = parseInt(a.match(/lifestyle-(\d+)/)?.[1] || '0');
    const numB = parseInt(b.match(/lifestyle-(\d+)/)?.[1] || '0');
    return numA - numB;
  });
  
  // If no color-specific images found, check for numbered images
  if (!mainImage && !backImage && lifestyleImages.length === 0) {
    const numberedImages = files
      .filter(f => /^\d+\.jpg$/.test(f))
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(f => `/images/${handle}/${f}`);
    
    if (numberedImages.length > 0) {
      mainImage = numberedImages[0];
      lifestyleImages.push(...numberedImages.slice(1));
    }
  }
  
  return { main: mainImage, back: backImage, lifestyle: lifestyleImages };
}

// Main function to build products
async function rebuildProducts() {
  console.log('🔨 Starting complete product rebuild from scratch...\n');
  
  // Get all individual product JSON files
  const scriptsDir = path.join(__dirname);
  const jsonFiles = fs.readdirSync(scriptsDir)
    .filter(file => file.endsWith('.json') && 
                   !file.includes('all-products') && 
                   !file.includes('consolidated') &&
                   !file.includes('handle-mapping') &&
                   !file.includes('shopify-collections') &&
                   !file.includes('missing-images'))
    .sort();
  
  console.log(`Found ${jsonFiles.length} product JSON files\n`);
  
  const products = [];
  const processedHandles = new Set(); // Track processed handles to avoid duplicates
  
  // Process each product JSON
  for (const jsonFile of jsonFiles) {
    const filePath = path.join(scriptsDir, jsonFile);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const product = data.product;
    
    if (!product) continue;
    
    // Skip if we've already processed this handle
    if (processedHandles.has(product.handle)) {
      console.log(`⏩ Skipping duplicate: ${product.handle}`);
      continue;
    }
    
    processedHandles.add(product.handle);
    
    console.log(`Processing: ${product.title} (${product.handle})`);
    
    // Get unique colors from variants
    const colors = getUniqueColors(product.variants);
    
    // Find images for each color
    colors.forEach(color => {
      const images = findImagesForProductColor(product.handle, color.name);
      color.images = images;
      console.log(`  ✅ ${color.name}: ${images.main ? '✓ main' : '✗ main'} ${images.back ? '✓ back' : '✗ back'} ${images.lifestyle.length} lifestyle`);
    });
    
    // Get available sizes
    const sizes = [...new Set(product.variants.map(v => v.option2).filter(Boolean))];
    
    // Build the product object
    const productData = {
      slug: product.handle,
      name: product.title,
      vendor: product.vendor || 'Modern Arab Apparel',
      collection: product.product_type || 'Apparel',
      tags: product.tags ? product.tags.split(', ') : [],
      price: product.variants.length > 0 ? 
        (product.variants.length === 1 ? 
          `$${product.variants[0].price}` : 
          `$${Math.min(...product.variants.map(v => parseFloat(v.price)))} - $${Math.max(...product.variants.map(v => parseFloat(v.price)))}`) 
        : '$0',
      originalPrice: '', // Not provided in source data
      description: extractDescription(product.body_html),
      fullDescription: product.body_html,
      features: [],
      specifications: [],
      origin: [],
      careInstructions: [],
      sizes: sizes,
      colors: colors
    };
    
    products.push(productData);
  }
  
  console.log(`\n✅ Processed ${products.length} unique products`);
  
  // Sort products alphabetically by name
  products.sort((a, b) => a.name.localeCompare(b.name));
  
  // Generate the TypeScript file content
  const tsContent = `// Generated by rebuild-products-from-scratch.js on ${new Date().toISOString()}
// This file contains clean product data built from individual Shopify product JSON files

export interface ProductVariant {
  size: string;
  price: number;
  sku: string;
  available: boolean;
}

export interface ProductColor {
  name: string;
  swatch: string;
  hex: string;
  images: {
    main: string;
    back: string;
    lifestyle: string[];
  };
  variants: ProductVariant[];
}

export interface Product {
  slug: string;
  name: string;
  vendor: string;
  collection: string;
  tags: string[];
  price: string;
  originalPrice: string;
  description: string;
  fullDescription: string;
  features: string[];
  specifications: string[];
  origin: string[];
  careInstructions: string[];
  sizes?: string[];
  colors: ProductColor[];
}

export const products: Product[] = ${JSON.stringify(products, null, 2)};
`;
  
  // Write the new data.ts file
  const outputPath = path.join(__dirname, '../src/app/products/data.ts');
  fs.writeFileSync(outputPath, tsContent);
  
  console.log('\n✅ Successfully generated new data.ts file!');
  console.log(`   Total products: ${products.length}`);
  console.log(`   Output: ${outputPath}`);
  
  // Summary of missing images
  const missingMainImages = [];
  products.forEach(product => {
    product.colors.forEach(color => {
      if (!color.images.main) {
        missingMainImages.push(`${product.name} - ${color.name}`);
      }
    });
  });
  
  if (missingMainImages.length > 0) {
    console.log(`\n⚠️  ${missingMainImages.length} color variants missing main images:`);
    missingMainImages.forEach(item => console.log(`   - ${item}`));
  }
}

// Run the rebuild
rebuildProducts().catch(console.error);