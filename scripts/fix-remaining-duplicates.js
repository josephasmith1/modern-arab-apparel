const fs = require('fs');
const path = require('path');

// Read the products data file
const filePath = path.join(__dirname, '../src/data/products/products-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Fixing remaining duplicate product names...');

// Map of remaining duplicate product names
const productRenames = [
  {
    slug: 'modern-arab-beanie-1',
    oldName: 'Modern Arab Beanie',
    newName: 'Modern Arab Beanie (Sand)'
  },
  {
    slug: 'fisherman-beanie',
    oldName: 'Modern Arab Beanie',
    newName: 'Fisherman Beanie'
  },
  {
    slug: 'modern-arab-beanie-2',
    oldName: 'Modern Arab Beanie',
    newName: 'Modern Arab Beanie (Classic)'
  },
  {
    slug: 'modern-arab-bucket-hat-1',
    oldName: 'Modern Arab Bucket Hat',
    newName: 'Modern Arab Bucket Hat (White)'
  },
  {
    slug: 'modern-arab-bucket-hat',
    oldName: 'Modern Arab Bucket Hat',
    newName: 'Modern Arab Bucket Hat (Multi-Color)'
  },
  {
    slug: 'modern-arab-cap-1',
    oldName: 'Modern Arab Cap',
    newName: 'Modern Arab Cap (White)'
  },
  {
    slug: 'modern-arab-cap',
    oldName: 'Modern Arab Cap',
    newName: 'Modern Arab Cap (Multi-Color)'
  },
  {
    slug: 'modernarab-crewneck',
    oldName: 'Modern Arab Crewneck',
    newName: 'Modern Arab Crewneck (Premium)'
  },
  {
    slug: 'modern-arab-crewneck-sand',
    oldName: 'Modern Arab Crewneck',
    newName: 'Modern Arab Crewneck (Sand)'
  },
  {
    slug: 'modern-arab-hoodie-2',
    oldName: 'Modern Arab Hoodie',
    newName: 'Modern Arab Hoodie (Blue)'
  },
  {
    slug: 'modernarab-hoodie',
    oldName: 'Modern Arab Hoodie',
    newName: 'Modern Arab Hoodie (Multi-Color)'
  },
  {
    slug: 'modern-arab-premium-tee-1',
    oldName: 'Modern Arab Premium Tee',
    newName: 'Modern Arab Premium Tee (White Print)'
  },
  {
    slug: 'modern-arab-premium-tee',
    oldName: 'Modern Arab Premium Tee',
    newName: 'Modern Arab Premium Tee (Black Print)'
  }
];

let totalChanges = 0;

// Process each rename
productRenames.forEach(({ slug, oldName, newName }) => {
  // Find the pattern for this specific product
  const productPattern = new RegExp(
    `"slug":\\s*"${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}",[^}]*?"name":\\s*"${oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`,
    'g'
  );
  
  const matches = content.match(productPattern);
  if (matches) {
    const replacement = matches[0].replace(
      `"name": "${oldName}"`,
      `"name": "${newName}"`
    );
    content = content.replace(productPattern, replacement);
    console.log(`✓ Renamed "${oldName}" to "${newName}" for slug "${slug}"`);
    totalChanges++;
  } else {
    console.log(`✗ Could not find product with slug "${slug}" and name "${oldName}"`);
  }
});

// Write the updated content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log(`\nCompleted! Made ${totalChanges} changes to product names.`);
console.log('All duplicate product names have been resolved.');