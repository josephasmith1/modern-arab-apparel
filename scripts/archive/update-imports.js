#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Define the replacements
const replacements = [
  {
    from: /import\s*{([^}]+)}\s*from\s*['"]@\/app\/products\/data['"]/g,
    to: 'import {$1} from \'@/data/products\''
  },
  {
    from: /import\s*{([^}]+)}\s*from\s*['"]\.\.\/products\/data['"]/g,
    to: 'import {$1} from \'@/data/products\''
  },
  {
    from: /import\s*{([^}]+)}\s*from\s*['"]\.\/data['"]/g,
    to: 'import {$1} from \'@/data/products\''
  }
];

// Files to exclude from updates
const excludePatterns = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.next/**',
  '**/backup-data.ts.bak',
  '**/data/products/**' // Don't update the new data structure itself
];

// Find all TypeScript and TypeScript React files
const files = glob.sync('src/**/*.{ts,tsx}', {
  ignore: excludePatterns,
  absolute: true
});

console.log(`Found ${files.length} files to check`);

let updatedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Apply all replacements
  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });
  
  // If content changed, write it back
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated: ${path.relative(process.cwd(), file)}`);
    updatedCount++;
  }
});

console.log(`\nUpdated ${updatedCount} files`);
console.log('\nNote: The old data.ts file can now be removed once you verify everything works correctly.');