const fs = require('fs');
const path = require('path');

// Read the current data.ts
const dataPath = path.join(__dirname, '../src/app/products/data.ts');
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Get list of actual image directories
const imagesDir = path.join(__dirname, '../public/images');
const actualDirs = fs.readdirSync(imagesDir).filter(item => {
  const fullPath = path.join(imagesDir, item);
  return fs.statSync(fullPath).isDirectory();
});

console.log('Available image directories:');
actualDirs.sort().forEach(dir => console.log(`  - ${dir}`));
console.log('');

// Manual slug replacements based on actual directories
const replacements = [
  // Tees
  { old: '"slug": "modern-arab-tee"', new: '"slug": "modernarab-tee"' },
  { old: '"slug": "modern-arab-tee-2"', new: '"slug": "modernarab-tee-white"' },
  { old: '"slug": "modern-arab-faded-tee-2"', new: '"slug": "modern-arab-faded-tee-black-print"' },
  { old: '"slug": "modern-arab-premium-tee-2"', new: '"slug": "modern-arab-premium-tee-1"' },
  
  // Beanies
  { old: '"slug": "modern-arab-beanie-2"', new: '"slug": "modern-arab-beanie-1"' },
  { old: '"slug": "modern-arab-beanie-3"', new: '"slug": "fisherman-beanie"' },
  
  // Caps
  { old: '"slug": "modern-arab-cap-2"', new: '"slug": "modern-arab-cap-1"' },
  
  // Bucket hats
  { old: '"slug": "modern-arab-bucket-hat-2"', new: '"slug": "modern-arab-bucket-hat-1"' },
  
  // Crewnecks
  { old: '"slug": "modern-arab-crewneck-2"', new: '"slug": "modernarab-crewneck"' },
  
  // Remove duplicate hoodies (keep only one)
  { old: '"slug": "modern-arab-hoodie-2"', new: '"slug": "modern-arab-hoodie"' }
];

// Apply replacements
replacements.forEach(({ old, new: newVal }) => {
  if (dataContent.includes(old)) {
    dataContent = dataContent.replace(old, newVal);
    console.log(`✅ Replaced: ${old} → ${newVal}`);
  }
});

// Write the updated content
fs.writeFileSync(dataPath, dataContent);

console.log('\n✅ Slugs updated. Now fixing image mappings...\n');

// Re-read and parse products
const productsMatch = dataContent.match(/export const products: Product\[\] = (\[[\s\S]*\]);/);
const products = JSON.parse(productsMatch[1]);

// Function to find images for a product
function findImagesForProduct(productSlug, colorName) {
  const imagesDir = path.join(__dirname, '../public/images', productSlug);
  
  if (!fs.existsSync(imagesDir)) {
    return { main: '', back: '', lifestyle: [] };
  }
  
  const files = fs.readdirSync(imagesDir);
  
  // Normalize color name
  const normalizedColor = colorName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
  
  let mainImage = '';
  let backImage = '';
  const lifestyleImages = [];
  
  // For products with numbered images only
  const numberedImages = files
    .filter(f => /^\d+\.jpg$/.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b));
  
  if (numberedImages.length > 0 && files.filter(f => f.includes(normalizedColor)).length === 0) {
    // This product only has numbered images, distribute them
    return { 
      main: numberedImages[0] ? `/images/${productSlug}/${numberedImages[0]}` : '',
      back: '',
      lifestyle: numberedImages.slice(1).map(f => `/images/${productSlug}/${f}`)
    };
  }
  
  // Look for color-specific images
  files.forEach(file => {
    const lowerFile = file.toLowerCase();
    
    if (!lowerFile.includes(normalizedColor) && 
        !lowerFile.includes(normalizedColor.split('-').pop())) {
      return;
    }
    
    const imagePath = `/images/${productSlug}/${file}`;
    
    if (lowerFile.includes('-main') || lowerFile.endsWith('-1.jpg')) {
      if (!mainImage) mainImage = imagePath;
    } else if (lowerFile.includes('-back')) {
      if (!backImage) backImage = imagePath;
    } else if (lowerFile.includes('-lifestyle-')) {
      lifestyleImages.push(imagePath);
    }
  });
  
  // Sort lifestyle images
  lifestyleImages.sort((a, b) => {
    const numA = parseInt(a.match(/[-](\d+)\.jpg$/)?.[1] || '0');
    const numB = parseInt(b.match(/[-](\d+)\.jpg$/)?.[1] || '0');
    return numA - numB;
  });
  
  return { main: mainImage, back: backImage, lifestyle: lifestyleImages };
}

// Update all product images
let totalUpdated = 0;
products.forEach(product => {
  console.log(`Processing ${product.name} (${product.slug}):`);
  
  product.colors.forEach(color => {
    const newImages = findImagesForProduct(product.slug, color.name);
    
    if (newImages.main || newImages.back || newImages.lifestyle.length > 0) {
      color.images = newImages;
      totalUpdated++;
      console.log(`  ✅ ${color.name}: Updated with ${newImages.main ? 'main' : ''} ${newImages.back ? 'back' : ''} ${newImages.lifestyle.length ? `${newImages.lifestyle.length} lifestyle` : ''}`);
    } else {
      console.log(`  ⏩ ${color.name}: No images found`);
    }
  });
});

// Save the updated products
const updatedContent = dataContent.replace(
  /export const products: Product\[\] = \[[\s\S]*\];/,
  `export const products: Product[] = ${JSON.stringify(products, null, 2)};`
);

fs.writeFileSync(dataPath, updatedContent);

console.log(`\n✅ Complete! Updated ${totalUpdated} color variants`);