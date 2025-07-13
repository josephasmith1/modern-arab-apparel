const fs = require('fs');
const path = require('path');

console.log('🚀 Syncing ALL data from Shopify...\n');

// Read the consolidated Shopify data
const shopifyData = JSON.parse(fs.readFileSync('consolidated-products.json', 'utf8'));
const handleMapping = JSON.parse(fs.readFileSync('handle-mapping.json', 'utf8'));

// Helper to sanitize filenames
function sanitizeFilename(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Helper to extract text from HTML
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').trim();
}

// Helper to extract features from HTML description
function extractFeatures(html) {
  const features = [];
  const bulletPoints = html.match(/[•·]\s*([^<\n•·]+)/g) || [];
  bulletPoints.forEach(point => {
    const cleaned = point.replace(/[•·]\s*/, '').trim();
    if (cleaned && cleaned.length > 5) features.push(cleaned);
  });
  
  // Also extract from lists
  const listItems = html.match(/<li>([^<]+)<\/li>/g) || [];
  listItems.forEach(item => {
    const cleaned = item.replace(/<\/?li>/g, '').trim();
    if (cleaned && cleaned.length > 5 && !features.includes(cleaned)) features.push(cleaned);
  });
  
  return features;
}

// Process all products with complete data
const completeProducts = [];

// Create a reverse mapping (shopify handle -> our slug)
const reverseMapping = {};
Object.entries(handleMapping).forEach(([ourSlug, data]) => {
  reverseMapping[data.shopifyHandle] = ourSlug;
});

// Process each Shopify product
shopifyData.products.forEach(shopifyProduct => {
  const ourSlug = reverseMapping[shopifyProduct.handle];
  if (!ourSlug) {
    console.log(`⚠️  No mapping for Shopify product: ${shopifyProduct.handle}`);
    return;
  }
  
  console.log(`\n📦 Processing: ${shopifyProduct.title}`);
  console.log(`   Handle: ${shopifyProduct.handle} -> ${ourSlug}`);
  
  // Create variant to color mapping
  const variantColorMap = {};
  shopifyProduct.variants.forEach(variant => {
    variantColorMap[variant.id] = variant.option1 || 'Default';
  });
  
  // Group variants by color
  const colorGroups = {};
  shopifyProduct.variants.forEach(variant => {
    const colorName = variant.option1 || 'Default';
    if (!colorGroups[colorName]) {
      colorGroups[colorName] = {
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
    }
    
    colorGroups[colorName].variants.push({
      size: variant.option2 || variant.title,
      price: parseFloat(variant.price),
      sku: variant.sku || '',
      available: variant.available
    });
  });
  
  // Process images
  const processedImages = new Set(); // Track processed images to avoid duplicates
  
  shopifyProduct.images.forEach((image, index) => {
    const imageType = getImageType(image, index);
    
    if (image.variant_ids && image.variant_ids.length > 0) {
      // Variant-specific image
      image.variant_ids.forEach(variantId => {
        const colorName = variantColorMap[variantId];
        if (colorName && colorGroups[colorName]) {
          const color = colorGroups[colorName];
          const localPath = getLocalImagePath(ourSlug, colorName, imageType, color.images);
          
          switch(imageType) {
            case 'main':
              if (!color.images.main) color.images.main = localPath;
              break;
            case 'back':
              if (!color.images.back) color.images.back = localPath;
              break;
            case 'lifestyle':
              if (!processedImages.has(image.src)) {
                color.images.lifestyle.push(localPath);
                processedImages.add(image.src);
              }
              break;
          }
        }
      });
    } else {
      // General product image - distribute to all colors
      Object.values(colorGroups).forEach(color => {
        const localPath = getLocalImagePath(ourSlug, color.name, imageType, color.images);
        
        if (imageType === 'lifestyle' && !processedImages.has(image.src)) {
          color.images.lifestyle.push(localPath);
        } else if (imageType === 'main' && !color.images.main) {
          color.images.main = localPath;
        }
      });
      
      if (imageType === 'lifestyle') {
        processedImages.add(image.src);
      }
    }
  });
  
  // Ensure all colors have at least a main image
  Object.values(colorGroups).forEach(color => {
    if (!color.images.main && shopifyProduct.images.length > 0) {
      color.images.main = `/images/${ourSlug}/${sanitizeFilename(color.name)}-1.jpg`;
    }
  });
  
  // Extract price range
  const prices = shopifyProduct.variants.map(v => parseFloat(v.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceStr = minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
  
  // Extract sizes
  const sizes = [...new Set(shopifyProduct.variants.map(v => v.option2 || v.title).filter(s => s && s !== 'Default'))];
  
  // Create complete product object
  const completeProduct = {
    slug: ourSlug,
    name: shopifyProduct.title,
    vendor: shopifyProduct.vendor || 'Modern Arab Apparel',
    collection: shopifyProduct.product_type || 'Apparel',
    tags: shopifyProduct.tags || [],
    price: priceStr,
    originalPrice: priceStr,
    description: stripHtml(shopifyProduct.body_html).substring(0, 200) + '...',
    fullDescription: shopifyProduct.body_html,
    features: extractFeatures(shopifyProduct.body_html),
    specifications: [],
    origin: [],
    careInstructions: extractCareInstructions(shopifyProduct.body_html),
    sizes: sizes,
    colors: Object.values(colorGroups)
  };
  
  completeProducts.push(completeProduct);
  
  console.log(`   ✓ ${Object.keys(colorGroups).length} colors`);
  console.log(`   ✓ ${shopifyProduct.images.length} images`);
  console.log(`   ✓ ${sizes.length} sizes`);
});

// Sort products by name for consistency
completeProducts.sort((a, b) => a.name.localeCompare(b.name));

// Generate the complete data file
let dataContent = `// Generated from Shopify data on ${new Date().toISOString()}
// Total products: ${completeProducts.length}

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

export const products: Product[] = ${JSON.stringify(completeProducts, null, 2)};
`;

fs.writeFileSync('../src/app/products/data-shopify-complete.ts', dataContent);

// Skip collections for now as we don't have the data file

// Generate download script for ALL images
const imageDownloads = [];
shopifyData.products.forEach(shopifyProduct => {
  const ourSlug = reverseMapping[shopifyProduct.handle];
  if (!ourSlug) return;
  
  shopifyProduct.images.forEach((image, index) => {
    const imageType = getImageType(image, index);
    
    // For variant-specific images
    if (image.variant_ids && image.variant_ids.length > 0) {
      image.variant_ids.forEach(variantId => {
        const variant = shopifyProduct.variants.find(v => v.id === variantId);
        if (variant) {
          const colorName = variant.option1 || 'Default';
          const colorSlug = sanitizeFilename(colorName);
          const filename = getImageFilename(imageType, colorSlug, index);
          
          imageDownloads.push({
            url: image.src,
            path: `public/images/${ourSlug}/${filename}`,
            product: ourSlug
          });
        }
      });
    } else {
      // For general images, save once with first color or general name
      const firstColor = shopifyProduct.variants[0]?.option1 || 'default';
      const colorSlug = sanitizeFilename(firstColor);
      const filename = getImageFilename(imageType, colorSlug, index);
      
      imageDownloads.push({
        url: image.src,
        path: `public/images/${ourSlug}/${filename}`,
        product: ourSlug
      });
    }
  });
});

// Generate download script
let downloadScript = '#!/bin/bash\n\n';
downloadScript += '# Complete Shopify image download script\n';
downloadScript += `# Total images: ${imageDownloads.length}\n\n`;

const byProduct = {};
imageDownloads.forEach(dl => {
  if (!byProduct[dl.product]) byProduct[dl.product] = [];
  byProduct[dl.product].push(dl);
});

Object.entries(byProduct).forEach(([product, dls]) => {
  downloadScript += `echo "\\nDownloading ${dls.length} images for ${product}..."\n`;
  downloadScript += `mkdir -p public/images/${product}\n`;
  
  dls.forEach((dl, i) => {
    downloadScript += `curl -s -L "${dl.url}" -o "${dl.path}"\n`;
    if ((i + 1) % 5 === 0) {
      downloadScript += `echo "  Progress: ${i + 1}/${dls.length}"\n`;
    }
  });
  
  downloadScript += '\n';
});

downloadScript += 'echo "\\n✅ All images downloaded!"\n';

fs.writeFileSync('download-all-shopify-images.sh', downloadScript);
fs.chmodSync('download-all-shopify-images.sh', '755');

console.log('\n✅ Complete sync finished!');
console.log('\nGenerated files:');
console.log('- src/app/products/data-shopify-complete.ts (complete product data)');
console.log('- src/app/collections/shopify-collections.ts (collections data)');
console.log('- scripts/download-all-shopify-images.sh (download ALL images)');
console.log(`\nTotal products: ${completeProducts.length}`);
console.log(`Total images to download: ${imageDownloads.length}`);

// Helper functions
function getColorHex(colorName) {
  const colorMap = {
    'Faded Bone': '#E8E4E0',
    'Faded Green': '#A4B5A0',
    'Faded Eucalyptus': '#A4B5A0',
    'Faded Khaki': '#C4A575',
    'Faded Black': '#4A4A4A',
    'Faded Sand': '#D4C4A8',
    'Olive': '#708238',
    'Olive Green': '#708238',
    'Black': '#000000',
    'White': '#FFFFFF',
    'Beige': '#F5F5DC',
    'Blue': '#4169E1',
    'Green': '#228B22',
    'Maroon': '#800000',
    'Khaki': '#F0E68C',
    'Vintage Black': '#2B2B2B',
    'Bone': '#F5F5DC',
    'Light Green': '#90EE90',
    'Light Blue': '#ADD8E6',
    'Light Black': '#555555',
    'Dark Blue': '#00008B'
  };
  return colorMap[colorName] || '#808080';
}

function getImageType(image, position) {
  const url = image.src.toLowerCase();
  const alt = (image.alt || '').toLowerCase();
  
  if (url.includes('back') || alt.includes('back')) return 'back';
  if (url.includes('lifestyle') || url.includes('_mg_') || url.includes('_img_') || position > 5) return 'lifestyle';
  if (position <= 2) return 'main';
  return 'lifestyle';
}

function getLocalImagePath(slug, colorName, imageType, existingImages) {
  const colorSlug = sanitizeFilename(colorName);
  
  switch(imageType) {
    case 'main':
      return `/images/${slug}/${colorSlug}-1.jpg`;
    case 'back':
      return `/images/${slug}/${colorSlug}-back.jpg`;
    case 'lifestyle':
      const count = existingImages.lifestyle.length + 1;
      return `/images/${slug}/${colorSlug}-lifestyle-${count}.jpg`;
    default:
      return `/images/${slug}/${colorSlug}-${imageType}.jpg`;
  }
}

function getImageFilename(imageType, colorSlug, index) {
  switch(imageType) {
    case 'main':
      return `${colorSlug}-1.jpg`;
    case 'back':
      return `${colorSlug}-back.jpg`;
    case 'lifestyle':
      return `${colorSlug}-lifestyle-${index}.jpg`;
    default:
      return `${colorSlug}-${index}.jpg`;
  }
}

function extractCareInstructions(html) {
  const instructions = [];
  
  // Look for care instructions section
  const careMatch = html.match(/care[^<]*:([^<]+)/i);
  if (careMatch) {
    instructions.push(...careMatch[1].split(/[,;]/).map(i => i.trim()).filter(Boolean));
  }
  
  // Look for specific care keywords
  const keywords = ['Machine wash', 'Hand wash', 'Dry clean', 'Do not', 'Iron', 'Tumble dry'];
  keywords.forEach(keyword => {
    const match = html.match(new RegExp(`${keyword}[^<.]*`, 'gi'));
    if (match) {
      match.forEach(m => {
        if (!instructions.includes(m)) instructions.push(m);
      });
    }
  });
  
  return instructions;
}