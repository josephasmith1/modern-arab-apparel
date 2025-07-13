const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all image paths to match downloaded images...\n');

// Read current product data
const dataContent = fs.readFileSync('../src/app/products/data.ts', 'utf8');
const products = JSON.parse(dataContent.match(/export const products = (\[[\s\S]*?\]);/)[1]);

// Get all available image directories
const imageDir = '../public/images';
const availableImageDirs = fs.readdirSync(imageDir).filter(f => 
  fs.statSync(path.join(imageDir, f)).isDirectory()
);

console.log(`📁 Found ${availableImageDirs.length} image directories`);

// Helper function to find matching image directory
function findMatchingImageDir(productSlug) {
  // Direct match
  if (availableImageDirs.includes(productSlug)) {
    return productSlug;
  }
  
  // Try without suffix variants
  const baseSlug = productSlug.replace(/-black-print$/, '').replace(/-1$/, '');
  if (availableImageDirs.includes(baseSlug)) {
    return baseSlug;
  }
  
  // Try with suffix variants
  for (const dir of availableImageDirs) {
    if (dir.includes(baseSlug) || baseSlug.includes(dir)) {
      return dir;
    }
  }
  
  return null;
}

// Helper function to get available images in a directory
function getAvailableImages(imageDir) {
  const fullPath = path.join('../public/images', imageDir);
  if (!fs.existsSync(fullPath)) return [];
  
  return fs.readdirSync(fullPath)
    .filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'))
    .sort();
}

// Helper function to sanitize color name for filename matching
function sanitizeColor(colorName) {
  return colorName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

let totalUpdates = 0;

// Process each product
products.forEach(product => {
  console.log(`\n📦 Processing: ${product.name} (${product.slug})`);
  
  const matchingDir = findMatchingImageDir(product.slug);
  if (!matchingDir) {
    console.log(`   ⚠️  No matching image directory found`);
    return;
  }
  
  console.log(`   ✓ Using image directory: ${matchingDir}`);
  const availableImages = getAvailableImages(matchingDir);
  console.log(`   📸 ${availableImages.length} images available`);
  
  // Update each color's images
  product.colors.forEach((color, colorIndex) => {
    const colorSlug = sanitizeColor(color.name);
    console.log(`   🎨 Fixing color: ${color.name} (${colorSlug})`);
    
    // Find main image
    let mainImage = null;
    const mainCandidates = [
      `${colorSlug}-1.jpg`,
      `${colorSlug}-main.jpg`,
      `${colorSlug}.jpg`
    ];
    
    for (const candidate of mainCandidates) {
      if (availableImages.includes(candidate)) {
        mainImage = `/images/${matchingDir}/${candidate}`;
        break;
      }
    }
    
    // If no color-specific main image, use first available or fallback to numbered
    if (!mainImage) {
      if (availableImages.length > colorIndex) {
        mainImage = `/images/${matchingDir}/${availableImages[colorIndex]}`;
      } else if (availableImages.length > 0) {
        mainImage = `/images/${matchingDir}/${availableImages[0]}`;
      }
    }
    
    // Find back image
    let backImage = '';
    const backCandidates = [
      `${colorSlug}-back.jpg`,
      `${colorSlug}-2.jpg`
    ];
    
    for (const candidate of backCandidates) {
      if (availableImages.includes(candidate)) {
        backImage = `/images/${matchingDir}/${candidate}`;
        break;
      }
    }
    
    // Find lifestyle images
    const lifestyleImages = [];
    availableImages.forEach(img => {
      if (img.includes(`${colorSlug}-lifestyle`) || 
          img.includes(`${colorSlug}-`)) {
        if (!img.includes('-main') && !img.includes('-back') && !img.includes('-1.jpg')) {
          lifestyleImages.push(`/images/${matchingDir}/${img}`);
        }
      }
    });
    
    // Update color images
    const oldImages = JSON.stringify(color.images);
    color.images = {
      main: mainImage || color.images.main,
      back: backImage,
      lifestyle: lifestyleImages
    };
    
    if (JSON.stringify(color.images) !== oldImages) {
      totalUpdates++;
      console.log(`     ✓ Updated: main=${mainImage ? '✓' : '✗'}, back=${backImage ? '✓' : '✗'}, lifestyle=${lifestyleImages.length}`);
    }
  });
});

// Write updated data
const output = `export const products = ${JSON.stringify(products, null, 2)};`;
fs.writeFileSync('../src/app/products/data.ts', output);

console.log(`\n✅ Fix complete!`);
console.log(`📊 Updated ${totalUpdates} color image sets`);
console.log(`📁 Processed ${products.length} products`);
console.log(`\n🔄 All image paths now match downloaded images`);