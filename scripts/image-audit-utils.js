const fs = require('fs');
const path = require('path');

/**
 * Scan all available images in the public/images directory
 */
async function scanAvailableImages() {
  const imagesDir = path.join(process.cwd(), 'public/images');
  const images = [];
  
  if (!fs.existsSync(imagesDir)) {
    console.error('Images directory not found:', imagesDir);
    return images;
  }
  
  // Recursively scan all subdirectories
  function scanDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativeItemPath = relativePath ? path.join(relativePath, item) : item;
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip certain directories
        if (item === 'featured' || item === 'product-images') {
          continue;
        }
        scanDirectory(fullPath, relativeItemPath);
      } else if (stat.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(item)) {
        // Parse image metadata from filename and path
        const metadata = parseImageMetadata(relativeItemPath, fullPath, stat);
        if (metadata) {
          images.push(metadata);
        }
      }
    }
  }
  
  scanDirectory(imagesDir);
  return images;
}

/**
 * Parse image metadata from filename and path
 */
function parseImageMetadata(relativePath, fullPath, stat) {
  const filename = path.basename(relativePath);
  const pathParts = relativePath.split(path.sep);
  
  // Skip if not in a product directory structure
  if (pathParts.length < 2) {
    return null;
  }
  
  const productSlug = pathParts[0];
  const filenameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  
  // Parse color and image type from filename
  let colorSlug = '';
  let imageType = 'main';
  let lifestyleIndex;
  
  // Common patterns:
  // color-main.jpg, color-back.jpg, color-lifestyle-1.jpg
  // size-main.jpg (for single-color products)
  const parts = filenameWithoutExt.split('-');
  
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    const secondLastPart = parts[parts.length - 2];
    
    if (lastPart === 'main') {
      imageType = 'main';
      colorSlug = parts.slice(0, -1).join('-');
    } else if (lastPart === 'back') {
      imageType = 'back';
      colorSlug = parts.slice(0, -1).join('-');
    } else if (secondLastPart === 'lifestyle' && /^\d+$/.test(lastPart)) {
      imageType = 'lifestyle';
      lifestyleIndex = parseInt(lastPart);
      colorSlug = parts.slice(0, -2).join('-');
    } else {
      // Default to main image
      colorSlug = filenameWithoutExt;
    }
  } else {
    colorSlug = filenameWithoutExt;
  }
  
  return {
    path: `/images/${relativePath}`,
    filename,
    productSlug,
    colorSlug,
    imageType,
    lifestyleIndex,
    exists: true,
    fileSize: stat.size
  };
}

/**
 * Scan all product JSON files and extract image data
 */
async function scanProductImageData() {
  const productsDir = path.join(process.cwd(), 'src/data/products');
  const productImageData = [];
  
  if (!fs.existsSync(productsDir)) {
    console.error('Products directory not found:', productsDir);
    return productImageData;
  }
  
  const files = fs.readdirSync(productsDir);
  const jsonFiles = files.filter(file => file.endsWith('.json'));
  
  for (const file of jsonFiles) {
    try {
      const filePath = path.join(productsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const shopifyData = JSON.parse(fileContent);
      
      const productSlug = shopifyData.product?.handle;
      if (!productSlug) continue;
      
      const shopifyImages = shopifyData.product?.images || [];
      
      // Extract expected local paths (what the product loader generates)
      const expectedLocalPaths = extractExpectedLocalPaths(shopifyData);
      
      productImageData.push({
        productSlug,
        shopifyImages: shopifyImages.map(img => ({
          id: img.id,
          src: img.src,
          alt: img.alt,
          position: img.position,
          variant_ids: img.variant_ids || []
        })),
        expectedLocalPaths,
        actualLocalPaths: [], // Will be filled by comparing with available images
        missingImages: []     // Will be filled by comparing with available images
      });
      
    } catch (error) {
      console.error(`Error processing product file ${file}:`, error);
    }
  }
  
  return productImageData;
}

/**
 * Extract expected local paths that the product loader would generate
 */
function extractExpectedLocalPaths(shopifyData) {
  const paths = [];
  const product = shopifyData.product;
  
  if (!product) return paths;
  
  const productSlug = product.handle;
  const folderName = getFolderName(productSlug);
  
  // Get unique colors from variants
  const colors = new Set();
  product.variants?.forEach(variant => {
    const colorName = variant.option1 || 'Default';
    colors.add(colorName);
  });
  
  // Generate expected paths for each color
  for (const colorName of colors) {
    const colorSlug = generateColorSlug(colorName, productSlug);
    const basePath = `/images/${folderName}/${colorSlug}`;
    
    paths.push(`${basePath}-main.jpg`);
    paths.push(`${basePath}-back.jpg`);
    paths.push(`${basePath}-lifestyle-1.jpg`);
  }
  
  return paths;
}

/**
 * Get folder name (same logic as product loader)
 */
function getFolderName(productSlug) {
  const FOLDER_MAPPINGS = {
    'modern-arab-beanie-2': 'modernarab-beanie',
    'modern-arab-crewneck-sand': 'modernarab-crewneck-sand',
    'modern-arab-hoodie-2': 'modernarab-hoodie',
    'modernarab-tee-black': 'modernarab-tee-black',
    'modernarab-tee-white': 'modernarab-tee-white'
  };
  
  return FOLDER_MAPPINGS[productSlug] || productSlug;
}

/**
 * Generate color slug (same logic as product loader)
 */
function generateColorSlug(colorName, productSlug) {
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
    'beige': 'beige'
  };
  
  const PRODUCT_COLOR_MAPPINGS = {
    'modern-arab-joggers': {
      'black': 'faded-black',
      'olive-green': 'green'
    },
    'modern-arab-beanie-2': {
      'black': 'faded-black'
    },
    'modern-arab-sweatpants': {
      'light-green': 'green',
      'light-blue': 'blue',
      'light-black': 'faded-black',
      'dark-blue': 'blue'
    }
  };
  
  const baseSlug = colorName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  if (productSlug && PRODUCT_COLOR_MAPPINGS[productSlug]?.[baseSlug]) {
    return PRODUCT_COLOR_MAPPINGS[productSlug][baseSlug];
  }
  
  return COLOR_MAPPINGS[baseSlug] || baseSlug;
}

/**
 * Generate comprehensive image audit report
 */
async function generateImageAuditReport() {
  console.log('Scanning available images...');
  const availableImages = await scanAvailableImages();
  
  console.log('Scanning product image data...');
  const productImageData = await scanProductImageData();
  
  // Create a map of available images by path for quick lookup
  const availableImageMap = new Map();
  availableImages.forEach(img => {
    availableImageMap.set(img.path, img);
  });
  
  // Compare expected vs actual images for each product
  let totalMissingImages = 0;
  const productsWithIssues = [];
  
  for (const productData of productImageData) {
    const actualPaths = [];
    const missingPaths = [];
    
    for (const expectedPath of productData.expectedLocalPaths) {
      if (availableImageMap.has(expectedPath)) {
        actualPaths.push(expectedPath);
      } else {
        missingPaths.push(expectedPath);
        totalMissingImages++;
      }
    }
    
    productData.actualLocalPaths = actualPaths;
    productData.missingImages = missingPaths;
    
    if (missingPaths.length > 0) {
      productsWithIssues.push(productData.productSlug);
    }
  }
  
  const summary = {
    totalProducts: productImageData.length,
    totalShopifyImages: productImageData.reduce((sum, p) => sum + p.shopifyImages.length, 0),
    totalLocalImages: availableImages.length,
    totalMissingImages,
    productsWithIssues
  };
  
  return {
    availableImages,
    productImageData,
    summary
  };
}

module.exports = {
  scanAvailableImages,
  scanProductImageData,
  generateImageAuditReport
};