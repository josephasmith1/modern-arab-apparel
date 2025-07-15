const fs = require('fs');
const path = require('path');

// Read the products data file
const dataPath = path.join(__dirname, '../src/app/products/data.ts');
const fileContent = fs.readFileSync(dataPath, 'utf8');

// Parse the products array from the file
const productsMatch = fileContent.match(/export const products: Product\[\] = \[([\s\S]*)\];/);
if (!productsMatch) {
  console.error('Could not find products array in data.ts');
  process.exit(1);
}

// Extract just the array content
const productsArrayString = '[' + productsMatch[1] + ']';

// Function to safely parse the products
function parseProducts(str) {
  // Remove TypeScript type annotations and convert to valid JSON
  let jsonStr = str
    .replace(/Product\[\]/g, '')
    .replace(/: string\[\]/g, '')
    .replace(/: string/g, '')
    .replace(/: number/g, '')
    .replace(/: boolean/g, '')
    .replace(/export interface.*?}/gs, '')
    .replace(/export const products.*?= /g, '')
    .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
    .replace(/'/g, '"'); // Replace single quotes with double quotes
  
  try {
    return eval('(' + jsonStr + ')');
  } catch (e) {
    console.error('Error parsing products:', e.message);
    return [];
  }
}

// Parse products
const products = parseProducts(productsArrayString);

// Size patterns to look for
const sizePatterns = ['S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', 'XXXL'];

// Find products with size-named colors
const affectedProducts = [];

products.forEach(product => {
  if (!product.colors) return;
  
  const sizeColors = product.colors.filter(color => 
    sizePatterns.includes(color.name)
  );
  
  if (sizeColors.length > 0) {
    affectedProducts.push({
      slug: product.slug,
      name: product.name,
      totalColors: product.colors.length,
      sizeColors: sizeColors.map(c => c.name),
      sizeColorCount: sizeColors.length
    });
  }
});

// Output results
console.log('\n=== PRODUCTS WITH SIZES AS COLORS ===\n');

affectedProducts.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name}`);
  console.log(`   Slug: ${product.slug}`);
  console.log(`   Total "colors": ${product.totalColors}`);
  console.log(`   Size-named colors: ${product.sizeColorCount} (${product.sizeColors.join(', ')})`);
  console.log('');
});

console.log(`\nTotal affected products: ${affectedProducts.length}`);

// Output just the slugs for easy copying
console.log('\n=== AFFECTED PRODUCT SLUGS ===\n');
affectedProducts.forEach(product => {
  console.log(product.slug);
});