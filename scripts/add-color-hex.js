const fs = require('fs');

// Read current data
const dataContent = fs.readFileSync('../src/app/products/data.ts', 'utf8');
const products = JSON.parse(dataContent.match(/export const products = (\[[\s\S]*?\]);/)[1]);

// Color hex mapping
const colorHexMap = {
  'Faded Bone': '#E8E4E0',
  'Faded Green': '#A4B5A0',
  'Faded Eucalyptus': '#A4B5A0',
  'Faded Khaki': '#C4A575',
  'Faded Black': '#4A4A4A',
  'Faded Sand': '#D4C4A8',
  'Olive': '#708238',
  'Olive Green': '#708238',
  'Black': '#000000',
  'White': '#FFFFFF',
  'Beige': '#F5F5DC',
  'Blue': '#4169E1',
  'Green': '#228B22',
  'Maroon': '#800000',
  'Khaki': '#F0E68C',
  'Vintage Black': '#2B2B2B',
  'Bone': '#F5F5DC',
  'Light Green': '#90EE90',
  'Light Blue': '#ADD8E6',
  'Light Black': '#555555',
  'Dark Blue': '#00008B'
};

// Update products with hex values
products.forEach(product => {
  product.colors.forEach(color => {
    if (!color.hex || color.hex === '') {
      color.hex = colorHexMap[color.name] || '#808080';
    }
  });
});

// Write updated data
const output = `export const products = ${JSON.stringify(products, null, 2)};`;
fs.writeFileSync('../src/app/products/data.ts', output);

console.log('✅ Added hex values to all colors');
console.log('📊 Color statistics:');

const allColors = new Set();
products.forEach(p => {
  p.colors.forEach(c => allColors.add(c.name));
});

console.log(`   - ${allColors.size} unique colors found`);
console.log(`   - ${products.length} products updated`);