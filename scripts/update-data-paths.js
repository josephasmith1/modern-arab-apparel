#!/usr/bin/env node

/**
 * Update data.ts with correct image paths based on actual files
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 UPDATING DATA.TS WITH ACTUAL IMAGE PATHS...\n');

// Read the current data.ts file
const dataPath = path.join(__dirname, '..', 'src', 'app', 'products', 'data.ts');
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Map product slugs to their actual image directories
const slugToDirectory = {
  'fisherman-beanie': 'fisherman-beanie',
  'modern-arab-beanie': 'modern-arab-beanie-1', // Changed from modern-arab-beanie
  'modern-arab-bucket-hat': 'modern-arab-bucket-hat',
  'modern-arab-cap': 'modern-arab-cap',
  'modern-arab-crewneck': 'modernarab-crewneck',
  'modern-arab-hoodie': 'modern-arab-hoodie',
  'modern-arab-joggers': 'modern-arab-joggers',
  'modern-arab-sweatpants': 'modern-arab-sweatpants',
  'modern-arab-tee': 'modernarab-tee',
  'modernarab-tee': 'modernarab-tee',
  'modern-arab-faded-tee': 'modern-arab-faded-tee-black-print'
};

// Function to get available images for a directory
function getAvailableImages(dir) {
  const fullPath = path.join(__dirname, '..', 'public', 'images', dir);
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ Directory not found: ${dir}`);
    return [];
  }
  
  const files = fs.readdirSync(fullPath);
  return files.filter(f => f.match(/\.(jpg|jpeg|png)$/i));
}

// Function to find best image match for a color and type
function findImageMatch(images, color, type = 'main') {
  const colorLower = color.toLowerCase().replace(/\s+/g, '-');
  
  // Try exact matches first
  const exactMatch = images.find(img => {
    const imgLower = img.toLowerCase();
    return imgLower.includes(colorLower) && imgLower.includes(type);
  });
  
  if (exactMatch) return exactMatch;
  
  // Try partial matches
  const partialMatch = images.find(img => {
    const imgLower = img.toLowerCase();
    return imgLower.includes(colorLower);
  });
  
  if (partialMatch) return partialMatch;
  
  // Fallback to any image with the type
  return images.find(img => img.toLowerCase().includes(type)) || images[0] || '';
}

// Process each product directory
Object.entries(slugToDirectory).forEach(([slug, directory]) => {
  console.log(`📂 Processing: ${slug} -> ${directory}`);
  
  const images = getAvailableImages(directory);
  console.log(`   Found ${images.length} images: ${images.slice(0, 3).join(', ')}${images.length > 3 ? '...' : ''}`);
  
  if (images.length === 0) return;
  
  // Common color mappings
  const colors = ['black', 'white', 'blue', 'green', 'olive', 'khaki', 'bone', 'beige', 'faded-black', 'faded-bone', 'faded-green', 'faded-khaki', 'vintage-black', 'maroon'];
  
  colors.forEach(color => {
    // Update main image paths
    const oldMainPattern = new RegExp(`"/images/${slug}/${color}-1\\.jpg"`, 'g');
    const oldMainPattern2 = new RegExp(`"/images/${directory}/${color}-1\\.jpg"`, 'g');
    
    const mainImage = findImageMatch(images, color, 'main') || findImageMatch(images, color, 'lifestyle');
    if (mainImage) {
      const newMainPath = `/images/${directory}/${mainImage}`;
      dataContent = dataContent.replace(oldMainPattern, `"${newMainPath}"`);
      dataContent = dataContent.replace(oldMainPattern2, `"${newMainPath}"`);
      console.log(`   ✅ Updated ${color} main: ${mainImage}`);
    }
    
    // Update back image paths
    const backImage = findImageMatch(images, color, 'back');
    if (backImage) {
      const oldBackPattern = new RegExp(`"/images/${slug}/${color}-back\\.jpg"`, 'g');
      const oldBackPattern2 = new RegExp(`"/images/${directory}/${color}-back\\.jpg"`, 'g');
      const newBackPath = `/images/${directory}/${backImage}`;
      dataContent = dataContent.replace(oldBackPattern, `"${newBackPath}"`);
      dataContent = dataContent.replace(oldBackPattern2, `"${newBackPath}"`);
    }
  });
});

// Special case: Fix any remaining broken paths
const brokenPaths = [
  { old: '/images/modern-arab-beanie/olive-lifestyle-1.jpg', new: '/images/modern-arab-beanie-1/beige-lifestyle-1.jpg' },
  { old: '/images/modern-arab-beanie/black-1.jpg', new: '/images/modern-arab-beanie-1/beige-lifestyle-1.jpg' }
];

brokenPaths.forEach(({ old, new: newPath }) => {
  if (dataContent.includes(old)) {
    dataContent = dataContent.replace(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
    console.log(`🔧 Fixed broken path: ${old} -> ${newPath}`);
  }
});

// Write the updated content back
fs.writeFileSync(dataPath, dataContent);
console.log('\n✅ DATA.TS UPDATED WITH CORRECT IMAGE PATHS!');