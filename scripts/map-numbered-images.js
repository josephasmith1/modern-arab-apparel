const fs = require('fs');
const path = require('path');

// Function to rename numbered images to proper names
function renameNumberedImages() {
  const imagesDir = path.join(__dirname, '../public/images');
  
  // Mapping of numbered images to proper names based on typical order
  const imageMapping = {
    'modern-arab-premium-tee-1': {
      // If there are lifestyle images for colors without them
      addToColors: ['Faded Bone', 'Faded Green', 'Faded Sand', 'Faded Black']
    },
    'modern-arab-faded-tee-black-print': {
      addToColors: ['Faded Bone', 'Faded Green', 'Faded Khaki', 'Faded Black']
    }
  };
  
  // For each product directory
  Object.keys(imageMapping).forEach(productDir => {
    const dirPath = path.join(imagesDir, productDir);
    if (!fs.existsSync(dirPath)) return;
    
    // Get all numbered images
    const files = fs.readdirSync(dirPath);
    const numberedImages = files.filter(f => /^\d+\.jpg$/.test(f)).sort((a, b) => {
      return parseInt(a) - parseInt(b);
    });
    
    console.log(`Found ${numberedImages.length} numbered images in ${productDir}`);
    
    // If we have numbered images but they're not being used, 
    // add them as additional lifestyle images
    if (numberedImages.length > 0) {
      // Read current data.ts to add these images
      const dataPath = path.join(__dirname, '../src/app/products/data.ts');
      const dataContent = fs.readFileSync(dataPath, 'utf8');
      
      // Extract products array
      const productsMatch = dataContent.match(/export const products: Product\[\] = (\[[\s\S]*\]);/);
      if (!productsMatch) return;
      
      const products = JSON.parse(productsMatch[1]);
      
      // Find the product
      const product = products.find(p => p.slug === productDir);
      if (!product) return;
      
      // Distribute numbered images among colors that need more images
      const colors = imageMapping[productDir].addToColors;
      let imageIndex = 0;
      
      colors.forEach(colorName => {
        const color = product.colors.find(c => c.name === colorName);
        if (!color) return;
        
        // Add up to 3 numbered images per color as additional lifestyle images
        for (let i = 0; i < 3 && imageIndex < numberedImages.length; i++) {
          const imagePath = `/images/${productDir}/${numberedImages[imageIndex]}`;
          if (!color.images.lifestyle.includes(imagePath)) {
            color.images.lifestyle.push(imagePath);
            console.log(`Added ${imagePath} to ${colorName} lifestyle images`);
          }
          imageIndex++;
        }
      });
      
      // Save updated data
      const updatedContent = dataContent.replace(
        /export const products: Product\[\] = \[[\s\S]*\];/,
        `export const products: Product[] = ${JSON.stringify(products, null, 2)};`
      );
      
      fs.writeFileSync(dataPath, updatedContent);
      console.log(`Updated data.ts with additional lifestyle images for ${productDir}`);
    }
  });
}

// Run the mapping
renameNumberedImages();