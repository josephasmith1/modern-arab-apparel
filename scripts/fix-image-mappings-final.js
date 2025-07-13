const fs = require('fs');
const path = require('path');

// Read the current data.ts
const dataPath = path.join(__dirname, '../src/app/products/data.ts');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Extract the products array
const productsMatch = dataContent.match(/export const products: Product\[\] = (\[[\s\S]*\]);/);
if (!productsMatch) {
  console.error('Could not find products array in data.ts');
  process.exit(1);
}

const products = JSON.parse(productsMatch[1]);

// Function to find matching images for a product and color
function findImagesForColor(productSlug, colorName) {
  const imagesDir = path.join(__dirname, '../public/images', productSlug);
  
  if (!fs.existsSync(imagesDir)) {
    console.log(`No images directory for ${productSlug}`);
    return { main: '', back: '', lifestyle: [] };
  }
  
  const files = fs.readdirSync(imagesDir);
  
  // Normalize color name for matching (remove extra spaces, convert to lowercase)
  const normalizedColor = colorName.toLowerCase()
    .replace(/\s+/g, '-')  // Replace spaces with hyphens
    .replace(/--+/g, '-')  // Replace multiple hyphens with single
    .trim();
  
  // Special cases for color name variations
  const colorVariations = {
    'faded-khaki': ['faded-khaki', 'faded--khaki', 'khaki'],
    'faded-bone': ['faded-bone', 'bone'],
    'faded-green': ['faded-green', 'green'],
    'faded-black': ['faded-black', 'black'],
    'faded-sand': ['faded-sand', 'sand'],
    'faded-eucalyptus': ['faded-eucalyptus', 'eucalyptus']
  };
  
  const possibleColorNames = colorVariations[normalizedColor] || [normalizedColor];
  
  let mainImage = '';
  let backImage = '';
  const lifestyleImages = [];
  
  files.forEach(file => {
    const lowerFile = file.toLowerCase();
    
    // Check if this file matches any of the color variations
    const matchesColor = possibleColorNames.some(colorVariant => {
      // For files like "faded-black-1.jpg" or "faded-black-main.jpg"
      if (lowerFile.startsWith(colorVariant + '-')) return true;
      // For files like "black-main.jpg" when looking for "faded-black"
      if (colorVariant.includes('-') && lowerFile.startsWith(colorVariant.split('-').pop() + '-')) return true;
      return false;
    });
    
    if (!matchesColor) return;
    
    const imagePath = `/images/${productSlug}/${file}`;
    
    // Categorize the image
    if (lowerFile.includes('-main') || lowerFile.endsWith('-1.jpg')) {
      if (!mainImage) mainImage = imagePath;
    } else if (lowerFile.includes('-back')) {
      if (!backImage) backImage = imagePath;
    } else if (lowerFile.includes('-lifestyle-')) {
      lifestyleImages.push(imagePath);
    } else if (/^[a-z-]+-\d+\.jpg$/.test(lowerFile) && !lowerFile.endsWith('-1.jpg')) {
      // Other numbered images as lifestyle
      lifestyleImages.push(imagePath);
    }
  });
  
  // Sort lifestyle images by number
  lifestyleImages.sort((a, b) => {
    const numA = parseInt(a.match(/[-](\d+)\.jpg$/)?.[1] || '0');
    const numB = parseInt(b.match(/[-](\d+)\.jpg$/)?.[1] || '0');
    return numA - numB;
  });
  
  return { main: mainImage, back: backImage, lifestyle: lifestyleImages };
}

// Update each product's color images
let totalUpdated = 0;
let totalColors = 0;

products.forEach(product => {
  console.log(`\nProcessing ${product.name} (${product.slug}):`);
  
  product.colors.forEach(color => {
    totalColors++;
    const oldImages = { ...color.images };
    const newImages = findImagesForColor(product.slug, color.name);
    
    // Update the images
    color.images = newImages;
    
    // Log what changed
    if (oldImages.main !== newImages.main || 
        oldImages.back !== newImages.back || 
        oldImages.lifestyle.length !== newImages.lifestyle.length) {
      totalUpdated++;
      console.log(`  ✅ ${color.name}:`);
      if (newImages.main) console.log(`     Main: ${newImages.main}`);
      if (newImages.back) console.log(`     Back: ${newImages.back}`);
      if (newImages.lifestyle.length > 0) {
        console.log(`     Lifestyle: ${newImages.lifestyle.length} images`);
      }
    } else {
      console.log(`  ⏩ ${color.name}: No changes needed`);
    }
  });
});

// Generate the updated data.ts content
const updatedContent = dataContent.replace(
  /export const products: Product\[\] = \[[\s\S]*\];/,
  `export const products: Product[] = ${JSON.stringify(products, null, 2)};`
);

// Write the updated content back
fs.writeFileSync(dataPath, updatedContent);

console.log(`\n✅ Updated image mappings:`);
console.log(`   - Processed ${products.length} products`);
console.log(`   - Updated ${totalUpdated} of ${totalColors} color variants`);
console.log(`   - data.ts has been updated`);

// Also check for any colors that still have no images
const missingImages = [];
products.forEach(product => {
  product.colors.forEach(color => {
    if (!color.images.main) {
      missingImages.push({
        product: product.name,
        slug: product.slug,
        color: color.name
      });
    }
  });
});

if (missingImages.length > 0) {
  console.log(`\n⚠️  ${missingImages.length} colors still missing main images:`);
  missingImages.forEach(item => {
    console.log(`   - ${item.product} (${item.slug}): ${item.color}`);
  });
}