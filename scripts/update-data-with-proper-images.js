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

// Function to get all available lifestyle images for a color
function getLifestyleImages(productSlug, colorName) {
  const lifestyle = [];
  const baseDir = `/images/${productSlug}`;
  const colorSlug = colorName.toLowerCase().replace(/\s+/g, '-');
  
  // Check for lifestyle images numbered 1-20
  for (let i = 1; i <= 20; i++) {
    const imagePath = `${baseDir}/${colorSlug}-lifestyle-${i}.jpg`;
    if (imageExists(imagePath)) {
      lifestyle.push(imagePath);
    } else {
      break; // Stop when we don't find the next number
    }
  }
  
  return lifestyle;
}

// Update each product
products.forEach(product => {
  console.log(`Updating product: ${product.name}`);
  
  // Update colors with proper image paths
  product.colors.forEach(color => {
    const colorSlug = color.name.toLowerCase().replace(/\s+/g, '-');
    const baseDir = `/images/${product.slug}`;
    
    // Set main image
    const mainImagePath = `${baseDir}/${colorSlug}-main.jpg`;
    if (imageExists(mainImagePath)) {
      color.images.main = mainImagePath;
    }
    
    // Set back image
    const backImagePath = `${baseDir}/${colorSlug}-back.jpg`;
    if (imageExists(backImagePath)) {
      color.images.back = backImagePath;
    }
    
    // Set lifestyle images
    color.images.lifestyle = getLifestyleImages(product.slug, color.name);
    
    console.log(`  - ${color.name}: main=${color.images.main}, back=${color.images.back}, lifestyle=${color.images.lifestyle.length} images`);
  });
});

// Generate the updated data.ts content
const updatedContent = dataContent.replace(
  /export const products: Product\[\] = \[[\s\S]*\];/,
  `export const products: Product[] = ${JSON.stringify(products, null, 2)};`
);

// Write the updated content back
fs.writeFileSync(dataPath, updatedContent);

console.log('\nSuccessfully updated data.ts with proper image paths!');

// Create a summary of what was updated
const summary = products.map(p => ({
  product: p.name,
  colors: p.colors.map(c => ({
    name: c.name,
    hasMain: !!c.images.main && c.images.main !== '',
    hasBack: !!c.images.back && c.images.back !== '',
    lifestyleCount: c.images.lifestyle.length
  }))
}));

console.log('\nUpdate Summary:');
console.log(JSON.stringify(summary, null, 2));