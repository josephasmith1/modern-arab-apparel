const fs = require('fs');
const path = require('path');

// Read the current data.ts
const dataPath = path.join(__dirname, '../src/app/products/data.ts');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Extract the products array from the file
const productsMatch = dataContent.match(/export const products: Product\[\] = (\[[\s\S]*\]);/);
if (!productsMatch) {
  console.error('Could not find products array in data.ts');
  process.exit(1);
}

const products = JSON.parse(productsMatch[1]);

// Function to check if an image file exists
function imageExists(imagePath) {
  const fullPath = path.join(__dirname, '../public', imagePath);
  return fs.existsSync(fullPath);
}

let removedCount = 0;
let updatedProducts = 0;

// Clean each product
products.forEach(product => {
  let productUpdated = false;
  
  // Check each color variant
  product.colors.forEach(color => {
    // Check main image
    if (color.images.main && !imageExists(color.images.main)) {
      console.log(`Removing missing main image: ${color.images.main}`);
      color.images.main = '';
      removedCount++;
      productUpdated = true;
    }
    
    // Check back image
    if (color.images.back && !imageExists(color.images.back)) {
      console.log(`Removing missing back image: ${color.images.back}`);
      color.images.back = '';
      removedCount++;
      productUpdated = true;
    }
    
    // Check lifestyle images
    const validLifestyle = [];
    color.images.lifestyle.forEach(img => {
      if (imageExists(img)) {
        validLifestyle.push(img);
      } else {
        console.log(`Removing missing lifestyle image: ${img}`);
        removedCount++;
        productUpdated = true;
      }
    });
    color.images.lifestyle = validLifestyle;
  });
  
  if (productUpdated) {
    updatedProducts++;
  }
});

// Generate the updated data.ts content
const updatedContent = dataContent.replace(
  /export const products: Product\[\] = \[[\s\S]*\];/,
  `export const products: Product[] = ${JSON.stringify(products, null, 2)};`
);

// Write the updated content back
fs.writeFileSync(dataPath, updatedContent);

console.log(`\n✅ Cleaned up missing images:`);
console.log(`   - Removed ${removedCount} missing image references`);
console.log(`   - Updated ${updatedProducts} products`);

// Also create a mapping of images we need to download from Shopify
const missingImages = [];
products.forEach(product => {
  product.colors.forEach(color => {
    if (!color.images.main && color.variants.length > 0) {
      missingImages.push({
        product: product.name,
        color: color.name,
        type: 'main'
      });
    }
    if (!color.images.back) {
      missingImages.push({
        product: product.name,
        color: color.name,
        type: 'back'
      });
    }
  });
});

if (missingImages.length > 0) {
  console.log(`\n⚠️  Found ${missingImages.length} products/colors missing images`);
  fs.writeFileSync(
    path.join(__dirname, 'missing-images.json'), 
    JSON.stringify(missingImages, null, 2)
  );
}