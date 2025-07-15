const fs = require('fs');
const path = require('path');

// Read the products data file
const dataPath = path.join(__dirname, '../src/data/products/products-data.ts');
let content = fs.readFileSync(dataPath, 'utf8');

// Create a comprehensive mapping of broken paths to correct paths
const pathMappings = {
  // Modernarab crewneck - Black should be Faded Black
  '/images/modernarab-crewneck/black-main.jpg': '/images/modernarab-crewneck/faded-black-main.jpg',
  '/images/modernarab-crewneck/black-back.jpg': '/images/modernarab-crewneck/faded-black-back.jpg',
  '/images/modernarab-crewneck/black-lifestyle-1.jpg': '/images/modernarab-crewneck/faded-black-lifestyle-1.jpg',
  
  // Modern Arab Crewneck Sand - Size-specific images don't exist, use the base faded-bone images
  '/images/modern-arab-crewneck-sand/s-main.jpg': '/images/modernarab-crewneck-sand/faded-bone-main.jpg',
  '/images/modern-arab-crewneck-sand/s-back.jpg': '/images/modernarab-crewneck-sand/faded-bone-back.jpg',
  '/images/modern-arab-crewneck-sand/s-lifestyle-1.jpg': '/images/modernarab-crewneck-sand/faded-bone-lifestyle-1.jpg',
  '/images/modern-arab-crewneck-sand/m-main.jpg': '/images/modernarab-crewneck-sand/faded-bone-main.jpg',
  '/images/modern-arab-crewneck-sand/m-back.jpg': '/images/modernarab-crewneck-sand/faded-bone-back.jpg',
  '/images/modern-arab-crewneck-sand/m-lifestyle-1.jpg': '/images/modernarab-crewneck-sand/faded-bone-lifestyle-1.jpg',
  '/images/modern-arab-crewneck-sand/l-main.jpg': '/images/modernarab-crewneck-sand/faded-bone-main.jpg',
  '/images/modern-arab-crewneck-sand/l-back.jpg': '/images/modernarab-crewneck-sand/faded-bone-back.jpg',
  '/images/modern-arab-crewneck-sand/l-lifestyle-1.jpg': '/images/modernarab-crewneck-sand/faded-bone-lifestyle-1.jpg',
  '/images/modern-arab-crewneck-sand/xl-main.jpg': '/images/modernarab-crewneck-sand/faded-bone-main.jpg',
  '/images/modern-arab-crewneck-sand/xl-back.jpg': '/images/modernarab-crewneck-sand/faded-bone-back.jpg',
  '/images/modern-arab-crewneck-sand/xl-lifestyle-1.jpg': '/images/modernarab-crewneck-sand/faded-bone-lifestyle-1.jpg',
  '/images/modern-arab-crewneck-sand/2xl-main.jpg': '/images/modernarab-crewneck-sand/faded-bone-main.jpg',
  '/images/modern-arab-crewneck-sand/2xl-back.jpg': '/images/modernarab-crewneck-sand/faded-bone-back.jpg',
  '/images/modern-arab-crewneck-sand/2xl-lifestyle-1.jpg': '/images/modernarab-crewneck-sand/faded-bone-lifestyle-1.jpg',
  '/images/modern-arab-crewneck-sand/3xl-main.jpg': '/images/modernarab-crewneck-sand/faded-bone-main.jpg',
  '/images/modern-arab-crewneck-sand/3xl-back.jpg': '/images/modernarab-crewneck-sand/faded-bone-back.jpg',
  '/images/modern-arab-crewneck-sand/3xl-lifestyle-1.jpg': '/images/modernarab-crewneck-sand/faded-bone-lifestyle-1.jpg',
  
  // Modernarab cropped hoodie
  '/images/modernarab-cropped-hoodie/black-lifestyle-1.jpg': '/images/modernarab-cropped-hoodie/faded-black-lifestyle-1.jpg',
  
  // Modern Arab Hoodie - Bone should be Faded Bone
  '/images/modern-arab-hoodie/bone-main.jpg': '/images/modern-arab-hoodie/faded-bone-main.jpg',
  '/images/modern-arab-hoodie/bone-back.jpg': '/images/modern-arab-hoodie/faded-bone-back.jpg',
  '/images/modern-arab-hoodie/bone-lifestyle-1.jpg': '/images/modern-arab-hoodie/faded-bone-lifestyle-1.jpg',
  
  // Modern Arab Hoodie 2 - Should use modernarab-hoodie paths
  '/images/modern-arab-hoodie-2/maroon-main.jpg': '/images/modernarab-hoodie/maroon-main.jpg',
  '/images/modern-arab-hoodie-2/maroon-back.jpg': '/images/modernarab-hoodie/maroon-back.jpg',
  '/images/modern-arab-hoodie-2/maroon-lifestyle-1.jpg': '/images/modernarab-hoodie/maroon-lifestyle-1.jpg',
  '/images/modern-arab-hoodie-2/green-main.jpg': '/images/modernarab-hoodie/green-main.jpg',
  '/images/modern-arab-hoodie-2/green-back.jpg': '/images/modernarab-hoodie/green-back.jpg',
  '/images/modern-arab-hoodie-2/green-lifestyle-1.jpg': '/images/modernarab-hoodie/green-lifestyle-1.jpg',
  '/images/modern-arab-hoodie-2/black-main.jpg': '/images/modernarab-hoodie/faded-black-main.jpg',
  '/images/modern-arab-hoodie-2/black-back.jpg': '/images/modernarab-hoodie/faded-black-back.jpg',
  '/images/modern-arab-hoodie-2/black-lifestyle-1.jpg': '/images/modernarab-hoodie/faded-black-lifestyle-1.jpg',
  '/images/modern-arab-hoodie-2/white-main.jpg': '/images/modernarab-hoodie/white-main.jpg',
  '/images/modern-arab-hoodie-2/white-back.jpg': '/images/modernarab-hoodie/white-back.jpg',
  '/images/modern-arab-hoodie-2/white-lifestyle-1.jpg': '/images/modernarab-hoodie/white-lifestyle-1.jpg',
  '/images/modern-arab-hoodie-2/vintage-black-main.jpg': '/images/modernarab-hoodie/faded-black-main.jpg',
  '/images/modern-arab-hoodie-2/vintage-black-back.jpg': '/images/modernarab-hoodie/faded-black-back.jpg',
  '/images/modern-arab-hoodie-2/vintage-black-lifestyle-1.jpg': '/images/modernarab-hoodie/faded-black-lifestyle-1.jpg',
  
  // Premium Tee - Faded Sand doesn't exist, use Faded Bone
  '/images/modern-arab-premium-tee-1/faded-sand-main.jpg': '/images/modern-arab-premium-tee-1/faded-bone-main.jpg',
  '/images/modern-arab-premium-tee-1/faded-sand-back.jpg': '/images/modern-arab-premium-tee-1/faded-bone-back.jpg',
  '/images/modern-arab-premium-tee-1/faded-sand-lifestyle-1.jpg': '/images/modern-arab-premium-tee-1/faded-bone-lifestyle-1.jpg',
  '/images/modern-arab-premium-tee/faded-sand-main.jpg': '/images/modern-arab-premium-tee/faded-bone-main.jpg',
  '/images/modern-arab-premium-tee/faded-sand-back.jpg': '/images/modern-arab-premium-tee/faded-bone-back.jpg',
  '/images/modern-arab-premium-tee/faded-sand-lifestyle-1.jpg': '/images/modern-arab-premium-tee/faded-bone-lifestyle-1.jpg',
  
  // Premium Tee Faded Eucalyptus - Size-specific images don't exist
  '/images/modern-arab-premium-tee-faded-eucalyptus/s-main.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-main.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/s-back.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-back.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/s-lifestyle-1.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-lifestyle-1.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/m-main.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-main.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/m-back.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-back.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/m-lifestyle-1.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-lifestyle-1.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/l-main.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-main.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/l-back.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-back.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/l-lifestyle-1.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-lifestyle-1.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/xl-main.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-main.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/xl-back.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-back.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/xl-lifestyle-1.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-lifestyle-1.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/2xl-main.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-main.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/2xl-back.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-back.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/2xl-lifestyle-1.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-lifestyle-1.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/3xl-main.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-main.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/3xl-back.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-back.jpg',
  '/images/modern-arab-premium-tee-faded-eucalyptus/3xl-lifestyle-1.jpg': '/images/modern-arab-premium-tee-faded-eucalyptus/faded-green-lifestyle-1.jpg',
  
  // Premium Tee Faded Khaki - Size-specific images don't exist
  '/images/modern-arab-premium-tee-faded-khaki/s-main.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-main.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/s-back.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-back.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/s-lifestyle-1.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-lifestyle-1.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/m-main.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-main.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/m-back.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-back.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/m-lifestyle-1.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-lifestyle-1.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/l-main.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-main.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/l-back.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-back.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/l-lifestyle-1.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-lifestyle-1.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/xl-main.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-main.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/xl-back.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-back.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/xl-lifestyle-1.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-lifestyle-1.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/2xl-main.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-main.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/2xl-back.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-back.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/2xl-lifestyle-1.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-lifestyle-1.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/3xl-main.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-main.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/3xl-back.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-back.jpg',
  '/images/modern-arab-premium-tee-faded-khaki/3xl-lifestyle-1.jpg': '/images/modern-arab-premium-tee-faded-khaki/faded-khaki-lifestyle-1.jpg',
  
  // Sweatpants - Light Black should be Faded Black
  '/images/modern-arab-sweatpants/light-black-main.jpg': '/images/modern-arab-sweatpants/faded-black-main.jpg',
  '/images/modern-arab-sweatpants/light-black-back.jpg': '/images/modern-arab-sweatpants/faded-black-back.jpg',
  '/images/modern-arab-sweatpants/light-black-lifestyle-1.jpg': '/images/modern-arab-sweatpants/faded-black-lifestyle-1.jpg',
  
  // Sweatpants - Dark Blue doesn't exist, should use Blue
  '/images/modern-arab-sweatpants/dark-blue-main.jpg': '/images/modern-arab-sweatpants/blue-main.jpg',
  '/images/modern-arab-sweatpants/dark-blue-back.jpg': '/images/modern-arab-sweatpants/blue-back.jpg',
  '/images/modern-arab-sweatpants/dark-blue-lifestyle-1.jpg': '/images/modern-arab-sweatpants/blue-lifestyle-1.jpg',
  
  // Modernarab Tee Black - Size-specific images don't exist
  '/images/modernarab-tee-black/s-main.jpg': '/images/modernarab-tee-black/faded-black-main.jpg',
  '/images/modernarab-tee-black/s-back.jpg': '/images/modernarab-tee-black/faded-black-back.jpg',
  '/images/modernarab-tee-black/s-lifestyle-1.jpg': '/images/modernarab-tee-black/faded-black-lifestyle-1.jpg',
  '/images/modernarab-tee-black/m-main.jpg': '/images/modernarab-tee-black/faded-black-main.jpg',
  '/images/modernarab-tee-black/m-back.jpg': '/images/modernarab-tee-black/faded-black-back.jpg',
  '/images/modernarab-tee-black/m-lifestyle-1.jpg': '/images/modernarab-tee-black/faded-black-lifestyle-1.jpg',
  '/images/modernarab-tee-black/l-main.jpg': '/images/modernarab-tee-black/faded-black-main.jpg',
  '/images/modernarab-tee-black/l-back.jpg': '/images/modernarab-tee-black/faded-black-back.jpg',
  '/images/modernarab-tee-black/l-lifestyle-1.jpg': '/images/modernarab-tee-black/faded-black-lifestyle-1.jpg',
  '/images/modernarab-tee-black/xl-main.jpg': '/images/modernarab-tee-black/faded-black-main.jpg',
  '/images/modernarab-tee-black/xl-back.jpg': '/images/modernarab-tee-black/faded-black-back.jpg',
  '/images/modernarab-tee-black/xl-lifestyle-1.jpg': '/images/modernarab-tee-black/faded-black-lifestyle-1.jpg',
  '/images/modernarab-tee-black/2xl-main.jpg': '/images/modernarab-tee-black/faded-black-main.jpg',
  '/images/modernarab-tee-black/2xl-back.jpg': '/images/modernarab-tee-black/faded-black-back.jpg',
  '/images/modernarab-tee-black/2xl-lifestyle-1.jpg': '/images/modernarab-tee-black/faded-black-lifestyle-1.jpg',
  '/images/modernarab-tee-black/3xl-main.jpg': '/images/modernarab-tee-black/faded-black-main.jpg',
  '/images/modernarab-tee-black/3xl-back.jpg': '/images/modernarab-tee-black/faded-black-back.jpg',
  '/images/modernarab-tee-black/3xl-lifestyle-1.jpg': '/images/modernarab-tee-black/faded-black-lifestyle-1.jpg',
  '/images/modernarab-tee-black/4xl-main.jpg': '/images/modernarab-tee-black/faded-black-main.jpg',
  '/images/modernarab-tee-black/4xl-back.jpg': '/images/modernarab-tee-black/faded-black-back.jpg',
  '/images/modernarab-tee-black/4xl-lifestyle-1.jpg': '/images/modernarab-tee-black/faded-black-lifestyle-1.jpg',
  
  // Modernarab Tee White - Size-specific images don't exist
  '/images/modernarab-tee-white/s-main.jpg': '/images/modernarab-tee-white/white-main.jpg',
  '/images/modernarab-tee-white/s-back.jpg': '/images/modernarab-tee-white/white-back.jpg',
  '/images/modernarab-tee-white/s-lifestyle-1.jpg': '/images/modernarab-tee-white/white-lifestyle-1.jpg',
  '/images/modernarab-tee-white/m-main.jpg': '/images/modernarab-tee-white/white-main.jpg',
  '/images/modernarab-tee-white/m-back.jpg': '/images/modernarab-tee-white/white-back.jpg',
  '/images/modernarab-tee-white/m-lifestyle-1.jpg': '/images/modernarab-tee-white/white-lifestyle-1.jpg',
  '/images/modernarab-tee-white/l-main.jpg': '/images/modernarab-tee-white/white-main.jpg',
  '/images/modernarab-tee-white/l-back.jpg': '/images/modernarab-tee-white/white-back.jpg',
  '/images/modernarab-tee-white/l-lifestyle-1.jpg': '/images/modernarab-tee-white/white-lifestyle-1.jpg',
  '/images/modernarab-tee-white/xl-main.jpg': '/images/modernarab-tee-white/white-main.jpg',
  '/images/modernarab-tee-white/xl-back.jpg': '/images/modernarab-tee-white/white-back.jpg',
  '/images/modernarab-tee-white/xl-lifestyle-1.jpg': '/images/modernarab-tee-white/white-lifestyle-1.jpg',
  '/images/modernarab-tee-white/2xl-main.jpg': '/images/modernarab-tee-white/white-main.jpg',
  '/images/modernarab-tee-white/2xl-back.jpg': '/images/modernarab-tee-white/white-back.jpg',
  '/images/modernarab-tee-white/2xl-lifestyle-1.jpg': '/images/modernarab-tee-white/white-lifestyle-1.jpg',
  '/images/modernarab-tee-white/3xl-main.jpg': '/images/modernarab-tee-white/white-main.jpg',
  '/images/modernarab-tee-white/3xl-back.jpg': '/images/modernarab-tee-white/white-back.jpg',
  '/images/modernarab-tee-white/3xl-lifestyle-1.jpg': '/images/modernarab-tee-white/white-lifestyle-1.jpg',
  '/images/modernarab-tee-white/4xl-main.jpg': '/images/modernarab-tee-white/white-main.jpg',
  '/images/modernarab-tee-white/4xl-back.jpg': '/images/modernarab-tee-white/white-back.jpg',
  '/images/modernarab-tee-white/4xl-lifestyle-1.jpg': '/images/modernarab-tee-white/white-lifestyle-1.jpg',
  
  // Modern Arab Tee Black/White - These don't exist, they should map to modernarab-tee
  '/images/modern-arab-tee-black/s-main.jpg': '/images/modernarab-tee/faded-black-main.jpg',
  '/images/modern-arab-tee-black/s-back.jpg': '/images/modernarab-tee/faded-black-back.jpg',
  '/images/modern-arab-tee-black/s-lifestyle-1.jpg': '/images/modernarab-tee/faded-black-lifestyle-1.jpg',
  '/images/modern-arab-tee-black/m-main.jpg': '/images/modernarab-tee/faded-black-main.jpg',
  '/images/modern-arab-tee-black/m-back.jpg': '/images/modernarab-tee/faded-black-back.jpg',
  '/images/modern-arab-tee-black/m-lifestyle-1.jpg': '/images/modernarab-tee/faded-black-lifestyle-1.jpg',
  '/images/modern-arab-tee-black/l-main.jpg': '/images/modernarab-tee/faded-black-main.jpg',
  '/images/modern-arab-tee-black/l-back.jpg': '/images/modernarab-tee/faded-black-back.jpg',
  '/images/modern-arab-tee-black/l-lifestyle-1.jpg': '/images/modernarab-tee/faded-black-lifestyle-1.jpg',
  '/images/modern-arab-tee-black/xl-main.jpg': '/images/modernarab-tee/faded-black-main.jpg',
  '/images/modern-arab-tee-black/xl-back.jpg': '/images/modernarab-tee/faded-black-back.jpg',
  '/images/modern-arab-tee-black/xl-lifestyle-1.jpg': '/images/modernarab-tee/faded-black-lifestyle-1.jpg',
  '/images/modern-arab-tee-black/2xl-main.jpg': '/images/modernarab-tee/faded-black-main.jpg',
  '/images/modern-arab-tee-black/2xl-back.jpg': '/images/modernarab-tee/faded-black-back.jpg',
  '/images/modern-arab-tee-black/2xl-lifestyle-1.jpg': '/images/modernarab-tee/faded-black-lifestyle-1.jpg',
  '/images/modern-arab-tee-black/3xl-main.jpg': '/images/modernarab-tee/faded-black-main.jpg',
  '/images/modern-arab-tee-black/3xl-back.jpg': '/images/modernarab-tee/faded-black-back.jpg',
  '/images/modern-arab-tee-black/3xl-lifestyle-1.jpg': '/images/modernarab-tee/faded-black-lifestyle-1.jpg',
  '/images/modern-arab-tee-black/4xl-main.jpg': '/images/modernarab-tee/faded-black-main.jpg',
  '/images/modern-arab-tee-black/4xl-back.jpg': '/images/modernarab-tee/faded-black-back.jpg',
  '/images/modern-arab-tee-black/4xl-lifestyle-1.jpg': '/images/modernarab-tee/faded-black-lifestyle-1.jpg',
  
  '/images/modern-arab-tee-white/s-main.jpg': '/images/modernarab-tee/faded-bone-main.jpg',
  '/images/modern-arab-tee-white/s-back.jpg': '/images/modernarab-tee/faded-bone-back.jpg',
  '/images/modern-arab-tee-white/s-lifestyle-1.jpg': '/images/modernarab-tee/faded-bone-lifestyle-1.jpg',
  '/images/modern-arab-tee-white/m-main.jpg': '/images/modernarab-tee/faded-bone-main.jpg',
  '/images/modern-arab-tee-white/m-back.jpg': '/images/modernarab-tee/faded-bone-back.jpg',
  '/images/modern-arab-tee-white/m-lifestyle-1.jpg': '/images/modernarab-tee/faded-bone-lifestyle-1.jpg',
  '/images/modern-arab-tee-white/l-main.jpg': '/images/modernarab-tee/faded-bone-main.jpg',
  '/images/modern-arab-tee-white/l-back.jpg': '/images/modernarab-tee/faded-bone-back.jpg',
  '/images/modern-arab-tee-white/l-lifestyle-1.jpg': '/images/modernarab-tee/faded-bone-lifestyle-1.jpg',
  '/images/modern-arab-tee-white/xl-main.jpg': '/images/modernarab-tee/faded-bone-main.jpg',
  '/images/modern-arab-tee-white/xl-back.jpg': '/images/modernarab-tee/faded-bone-back.jpg',
  '/images/modern-arab-tee-white/xl-lifestyle-1.jpg': '/images/modernarab-tee/faded-bone-lifestyle-1.jpg',
  '/images/modern-arab-tee-white/2xl-main.jpg': '/images/modernarab-tee/faded-bone-main.jpg',
  '/images/modern-arab-tee-white/2xl-back.jpg': '/images/modernarab-tee/faded-bone-back.jpg',
  '/images/modern-arab-tee-white/2xl-lifestyle-1.jpg': '/images/modernarab-tee/faded-bone-lifestyle-1.jpg',
  '/images/modern-arab-tee-white/3xl-main.jpg': '/images/modernarab-tee/faded-bone-main.jpg',
  '/images/modern-arab-tee-white/3xl-back.jpg': '/images/modernarab-tee/faded-bone-back.jpg',
  '/images/modern-arab-tee-white/3xl-lifestyle-1.jpg': '/images/modernarab-tee/faded-bone-lifestyle-1.jpg',
  '/images/modern-arab-tee-white/4xl-main.jpg': '/images/modernarab-tee/faded-bone-main.jpg',
  '/images/modern-arab-tee-white/4xl-back.jpg': '/images/modernarab-tee/faded-bone-back.jpg',
  '/images/modern-arab-tee-white/4xl-lifestyle-1.jpg': '/images/modernarab-tee/faded-bone-lifestyle-1.jpg'
};

// Apply all mappings
Object.keys(pathMappings).forEach(oldPath => {
  const newPath = pathMappings[oldPath];
  const escapedOldPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedOldPath, 'g');
  content = content.replace(regex, newPath);
});

// Write the updated content
fs.writeFileSync(dataPath, content);

console.log('Fixed all broken image paths using comprehensive mapping');
console.log(`Total mappings applied: ${Object.keys(pathMappings).length}`);

// Verify the results
const imagesDir = path.join(__dirname, '../public/images');
const availableImages = new Set();

function getAllImages(dir, basePath = '') {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllImages(fullPath, path.join(basePath, file));
    } else if (file.match(/\.(jpg|png|webp)$/i)) {
      availableImages.add(path.join(basePath, file));
    }
  });
}

getAllImages(imagesDir);

// Check for any remaining broken paths
const imagePathMatches = content.match(/\/images\/[^'"]+\.(jpg|png|webp)/g) || [];
const uniquePaths = [...new Set(imagePathMatches)];
const stillBrokenPaths = [];

uniquePaths.forEach(imagePath => {
  const relativePath = imagePath.replace(/^\/images\//, '');
  if (!availableImages.has(relativePath)) {
    stillBrokenPaths.push(imagePath);
  }
});

console.log(`\nRemaining broken paths: ${stillBrokenPaths.length}`);
if (stillBrokenPaths.length > 0) {
  console.log('\nStill broken (these may need to be downloaded or created):');
  stillBrokenPaths.forEach(p => console.log(`  ${p}`));
}