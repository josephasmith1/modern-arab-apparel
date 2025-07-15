const fs = require('fs');
const path = require('path');

// Read the products data file
const filePath = path.join(__dirname, '../src/data/products/products-data.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Fixing duplicate product names...');

// Map of duplicate product names with their slugs and what they should be renamed to
const productRenames = [
  {
    slug: 'modern-arab-faded-tee-black-print',
    oldName: 'Modern Arab Faded Tee',
    newName: 'Modern Arab Faded Tee (Black Print)'
  },
  {
    slug: 'modernarab-tee',
    oldName: 'Modern Arab Faded Tee',
    newName: 'Modern Arab Tee (Faded)'
  },
  {
    slug: 'modernarab-tee-black',
    oldName: 'Modern Arab Tee',
    newName: 'Modern Arab Tee (Black)'
  },
  {
    slug: 'modernarab-tee-white',
    oldName: 'Modern Arab Tee',
    newName: 'Modern Arab Tee (White)'
  },
  {
    slug: 'modern-arab-tee-black',
    oldName: 'Modern Arab Tee',
    newName: 'Modern Arab Tee - Black'
  },
  {
    slug: 'modern-arab-tee-white',
    oldName: 'Modern Arab Tee',
    newName: 'Modern Arab Tee - White'
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
console.log('Duplicate product names have been resolved.');