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

// Products that have numbered images
const productsWithNumberedImages = [
  'modern-arab-cap-1',
  'modern-arab-bucket-hat-1',
  'fisherman-beanie',
  'modern-arab-beanie-1'
];

// Function to distribute numbered images among colors
function assignNumberedImages(product) {
  const imagesDir = path.join(__dirname, '../public/images', product.slug);
  
  if (!fs.existsSync(imagesDir) || !productsWithNumberedImages.includes(product.slug)) {
    return false;
  }
  
  const files = fs.readdirSync(imagesDir);
  const numberedImages = files
    .filter(f => /^\d+\.jpg$/.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(f => `/images/${product.slug}/${f}`);
  
  if (numberedImages.length === 0) return false;
  
  console.log(`\n${product.name} (${product.slug}): Found ${numberedImages.length} numbered images`);
  
  // Distribute images among colors
  const colorsCount = product.colors.length;
  const imagesPerColor = Math.floor(numberedImages.length / colorsCount);
  const extraImages = numberedImages.length % colorsCount;
  
  let imageIndex = 0;
  product.colors.forEach((color, colorIndex) => {
    // Calculate how many images this color should get
    const colorImageCount = imagesPerColor + (colorIndex < extraImages ? 1 : 0);
    
    // Assign images
    if (colorImageCount > 0) {
      // First image is the main image
      color.images.main = numberedImages[imageIndex];
      imageIndex++;
      
      // Rest are lifestyle images
      color.images.lifestyle = [];
      for (let i = 1; i < colorImageCount && imageIndex < numberedImages.length; i++) {
        color.images.lifestyle.push(numberedImages[imageIndex]);
        imageIndex++;
      }
      
      console.log(`  ✅ ${color.name}: main + ${color.images.lifestyle.length} lifestyle images`);
    }
  });
  
  return true;
}

// Process products with numbered images
let updatedCount = 0;
products.forEach(product => {
  if (assignNumberedImages(product)) {
    updatedCount++;
  }
});

// Generate the updated data.ts content
const updatedContent = dataContent.replace(
  /export const products: Product\[\] = \[[\s\S]*\];/,
  `export const products: Product[] = ${JSON.stringify(products, null, 2)};`
);

// Write the updated content back
fs.writeFileSync(dataPath, updatedContent);

console.log(`\n✅ Updated ${updatedCount} products with numbered images`);
console.log('   data.ts has been updated');