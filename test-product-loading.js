// Test product loading to debug issues
const fs = require('fs');
const path = require('path');

// Read and parse a specific product JSON
const productFile = path.join(__dirname, 'src/data/products/modernarab-tee-black.json');
const productData = JSON.parse(fs.readFileSync(productFile, 'utf8'));
const product = productData.product;

console.log('Product:', product.title);
console.log('Handle:', product.handle);
console.log('Options:', JSON.stringify(product.options, null, 2));

// Check the first option
const firstOption = product.options[0];
const sizeValues = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
const isSingleColorProduct = firstOption && 
  firstOption.values.every(v => sizeValues.includes(v));

console.log('\nFirst option name:', firstOption?.name);
console.log('First option values:', firstOption?.values);
console.log('Is single color product?', isSingleColorProduct);

// Count unique colors
const colorSet = new Set();
product.variants.forEach(variant => {
  colorSet.add(variant.option1);
});

console.log('\nUnique colors found:', Array.from(colorSet));
console.log('Total variants:', product.variants.length);