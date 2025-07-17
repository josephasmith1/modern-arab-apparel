const fs = require('fs');
const path = require('path');

const PRODUCTS_DIR = path.join(process.cwd(), 'src/data/products');
const IMAGES_DIR = path.join(process.cwd(), 'public/images');

// Function to map image filename to correct path in existing folder structure
function mapImageToCorrectPath(productSlug, imageSrc) {
  // If it's already a proper local path, return as is
  if (imageSrc.startsWith('/images/') && !imageSrc.includes('/products/')) {
    return imageSrc;
  }
  
  // Extract filename from the generated path
  const filename = path.basename(imageSrc);
  
  // Try to find the image in the existing folder structure
  const possibleFolders = [
    productSlug,
    `${productSlug}-1`,
    `${productSlug}-2`,
    productSlug.replace('-', ''), // modernarab-crewneck -> modernarabcrewneck
  ];
  
  for (const folder of possibleFolders) {
    const folderPath = path.join(IMAGES_DIR, folder);
    if (fs.existsSync(folderPath)) {
      // Look for matching image files in this folder
      const files = fs.readdirSync(folderPath);
      
      // Try to find exact match first
      if (files.includes(filename)) {
        return `/images/${folder}/${filename}`;
      }
      
      // Try to find similar match by extracting meaningful parts
      const baseFilename = filename.replace(/^[^_]*_\d+_/, ''); // Remove prefix like "modern-arab-joggers_1_"
      const matchingFile = files.find(file => file.includes(baseFilename) || baseFilename.includes(file));
      
      if (matchingFile) {
        return `/images/${folder}/${matchingFile}`;
      }
    }
  }
  
  // If not found, return the original path (might be external URL)
  return imageSrc;
}

// Function to update JSON with correct image paths
function updateProductJSON(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  
  if (!data.product?.images) {
    console.log(`No images found in ${path.basename(filePath)}`);
    return;
  }
  
  const productSlug = data.product.handle;
  let updatedCount = 0;
  
  // Update image URLs in the product data
  data.product.images.forEach((image) => {
    const originalSrc = image.src;
    
    // Force update any /images/products/ paths
    if (originalSrc.includes('/images/products/')) {
      const newSrc = mapImageToCorrectPath(productSlug, originalSrc);
      console.log(`Updating ${originalSrc} → ${newSrc}`);
      image.src = newSrc;
      updatedCount++;
    } else {
      const newSrc = mapImageToCorrectPath(productSlug, originalSrc);
      if (originalSrc !== newSrc) {
        console.log(`Updating ${originalSrc} → ${newSrc}`);
        image.src = newSrc;
        updatedCount++;
      }
    }
  });
  
  if (updatedCount > 0) {
    // Write back the updated JSON
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${updatedCount} images in ${path.basename(filePath)}`);
  } else {
    console.log(`No updates needed for ${path.basename(filePath)}`);
  }
}

// Main function to process all products
async function fixAllImagePaths() {
  try {
    const files = fs.readdirSync(PRODUCTS_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json') && !file.includes('types') && !file.includes('products-data'));
    
    console.log(`Processing ${jsonFiles.length} product files...\n`);
    
    for (const file of jsonFiles) {
      const filePath = path.join(PRODUCTS_DIR, file);
      console.log(`Processing ${file}:`);
      updateProductJSON(filePath);
      console.log('');
    }
    
    console.log('✅ All image paths fixed!');
    console.log('🔄 Regenerating products-data.ts...');
    
    // Regenerate the products data
    require('./generate-products-data.js');
    
  } catch (error) {
    console.error('Error fixing image paths:', error);
  }
}

// Run the script
fixAllImagePaths();