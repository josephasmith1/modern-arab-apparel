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

// Map of current slugs to actual directory names
const slugMapping = {
  // Beanies
  'modern-arab-beanie': 'modernarab-beanie',  // maps to modernarab-beanie directory
  'modern-arab-beanie-2': 'modern-arab-beanie-1',  // maps to modern-arab-beanie-1 directory
  'modern-arab-beanie-3': 'fisherman-beanie',  // maps to fisherman-beanie directory
  
  // Caps
  'modern-arab-cap-2': 'modern-arab-cap-1',  // maps to modern-arab-cap-1 directory
  
  // Bucket hats
  'modern-arab-bucket-hat-2': 'modern-arab-bucket-hat-1',  // maps to modern-arab-bucket-hat-1 directory
  
  // Tees - need to check if these have directories
  'modern-arab-faded-tee-2': 'modern-arab-faded-tee-black-print',
  'modern-arab-premium-tee-2': 'modern-arab-premium-tee-1',
  
  // Hoodies
  'modern-arab-hoodie-2': 'modern-arab-hoodie',  // Might share the same directory
  
  // Crewnecks
  'modern-arab-crewneck-2': 'modernarab-crewneck',
  
  // Tees
  'modern-arab-tee': 'modernarab-tee',
  'modern-arab-tee-2': 'modernarab-tee-white'  // Check if this exists
};

// Get list of actual image directories
const imagesDir = path.join(__dirname, '../public/images');
const actualDirs = fs.readdirSync(imagesDir).filter(item => {
  const fullPath = path.join(imagesDir, item);
  return fs.statSync(fullPath).isDirectory();
});

console.log('Available image directories:');
actualDirs.sort().forEach(dir => console.log(`  - ${dir}`));
console.log('');

// Update product slugs
let updatedCount = 0;
products.forEach(product => {
  const oldSlug = product.slug;
  
  if (slugMapping[oldSlug]) {
    const newSlug = slugMapping[oldSlug];
    
    // Check if the new slug directory exists
    if (actualDirs.includes(newSlug)) {
      product.slug = newSlug;
      updatedCount++;
      console.log(`✅ Updated: ${oldSlug} → ${newSlug}`);
    } else {
      console.log(`⚠️  No directory found for: ${newSlug} (keeping ${oldSlug})`);
    }
  }
});

// Generate the updated data.ts content
const updatedContent = dataContent.replace(
  /export const products: Product\[\] = \[[\s\S]*\];/,
  `export const products: Product[] = ${JSON.stringify(products, null, 2)};`
);

// Write the updated content back
fs.writeFileSync(dataPath, updatedContent);

console.log(`\n✅ Updated ${updatedCount} product slugs`);
console.log('   data.ts has been updated');

// List products that still might not have matching directories
console.log('\nChecking for products without matching directories:');
products.forEach(product => {
  if (!actualDirs.includes(product.slug)) {
    console.log(`  ⚠️  ${product.name} (${product.slug}) - no matching directory`);
  }
});