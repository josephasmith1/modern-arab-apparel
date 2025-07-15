const fs = require('fs');
const path = require('path');

const productsDataPath = path.join(__dirname, '../src/data/products/products-data.ts');

// Read the current products data
let productsData = fs.readFileSync(productsDataPath, 'utf8');

// Define the replacements
const replacements = [
  // Modern Arab Crewneck Sand - fix default to faded-bone
  {
    from: '/images/modernarab-crewneck-sand/default-main.jpg',
    to: '/images/modernarab-crewneck-sand/faded-bone-main.jpg'
  },
  
  // ModernArab Crewneck - fix black and vintage-black to faded-black
  {
    from: '/images/modernarab-crewneck/black-main.jpg',
    to: '/images/modernarab-crewneck/faded-black-main.jpg'
  },
  {
    from: '/images/modernarab-crewneck/vintage-black-main.jpg',
    to: '/images/modernarab-crewneck/faded-black-main.jpg'
  },
  
  // Modern Arab Hoodie - these should point to modernarab-hoodie folder
  {
    from: '/images/modern-arab-hoodie/maroon-main.jpg',
    to: '/images/modernarab-hoodie/maroon-main.jpg'
  },
  {
    from: '/images/modern-arab-hoodie/green-main.jpg',
    to: '/images/modernarab-hoodie/green-main.jpg'
  },
  {
    from: '/images/modern-arab-hoodie/black-main.jpg',
    to: '/images/modernarab-hoodie/faded-black-main.jpg'
  },
  {
    from: '/images/modern-arab-hoodie/white-main.jpg',
    to: '/images/modernarab-hoodie/white-main.jpg'
  },
  
  // ModernArab Hoodie - fix black and vintage-black to faded-black
  {
    from: '/images/modernarab-hoodie/black-main.jpg',
    to: '/images/modernarab-hoodie/faded-black-main.jpg'
  },
  {
    from: '/images/modernarab-hoodie/vintage-black-main.jpg',
    to: '/images/modernarab-hoodie/faded-black-main.jpg'
  }
];

// Apply all replacements
let changeCount = 0;
replacements.forEach(({ from, to }) => {
  const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const matches = productsData.match(regex);
  if (matches) {
    productsData = productsData.replace(regex, to);
    changeCount += matches.length;
    console.log(`Replaced ${matches.length} instances of "${from}" with "${to}"`);
  }
});

if (changeCount > 0) {
  // Write the updated data back
  fs.writeFileSync(productsDataPath, productsData);
  console.log(`\nTotal replacements: ${changeCount}`);
  console.log('Products data updated successfully!');
} else {
  console.log('No replacements needed - all paths appear to be correct.');
}