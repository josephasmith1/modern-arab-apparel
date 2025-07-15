const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const ColorThief = require('colorthief');

// Helper function to extract dominant color from an image
async function extractDominantColor(imagePath) {
  try {
    const img = await loadImage(imagePath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const colorThief = new ColorThief();
    const dominantColor = await colorThief.getColor(img);
    return `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
  } catch (error) {
    console.error(`Error extracting color from ${imagePath}:`, error.message);
    return null;
  }
}

// Helper function to extract background color (edge pixels)
async function extractBackgroundColor(imagePath) {
  try {
    const img = await loadImage(imagePath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    const edgePixels = [];
    const edgeWidth = Math.floor(img.width * 0.1);
    const edgeHeight = Math.floor(img.height * 0.1);
    
    // Top and bottom edges
    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < edgeHeight; y++) {
        const topPixel = ctx.getImageData(x, y, 1, 1).data;
        const bottomPixel = ctx.getImageData(x, img.height - 1 - y, 1, 1).data;
        edgePixels.push([topPixel[0], topPixel[1], topPixel[2]]);
        edgePixels.push([bottomPixel[0], bottomPixel[1], bottomPixel[2]]);
      }
    }
    
    // Left and right edges
    for (let y = edgeHeight; y < img.height - edgeHeight; y++) {
      for (let x = 0; x < edgeWidth; x++) {
        const leftPixel = ctx.getImageData(x, y, 1, 1).data;
        const rightPixel = ctx.getImageData(img.width - 1 - x, y, 1, 1).data;
        edgePixels.push([leftPixel[0], leftPixel[1], leftPixel[2]]);
        edgePixels.push([rightPixel[0], rightPixel[1], rightPixel[2]]);
      }
    }
    
    // Calculate average color
    const avgColor = edgePixels.reduce((acc, pixel) => {
      acc[0] += pixel[0];
      acc[1] += pixel[1];
      acc[2] += pixel[2];
      return acc;
    }, [0, 0, 0]).map(c => Math.round(c / edgePixels.length));
    
    return `rgb(${avgColor[0]}, ${avgColor[1]}, ${avgColor[2]})`;
  } catch (error) {
    console.error(`Error extracting background color from ${imagePath}:`, error.message);
    return '#f0edec'; // Default fallback
  }
}

async function extractAllProductColors() {
  console.log('Starting color extraction for all products...');
  
  const productsDir = path.join(__dirname, '../src/data/products');
  const publicDir = path.join(__dirname, '../public');
  const colorMap = {};
  
  // Read all product JSON files
  const productFiles = fs.readdirSync(productsDir).filter(file => file.endsWith('.json'));
  
  for (const file of productFiles) {
    const productPath = path.join(productsDir, file);
    const productData = JSON.parse(fs.readFileSync(productPath, 'utf8'));
    
    if (!productData.product) continue;
    
    const product = productData.product;
    const productSlug = product.handle;
    
    console.log(`\nProcessing: ${product.title} (${productSlug})`);
    
    colorMap[productSlug] = {
      title: product.title,
      colors: {},
      backgroundColors: {}
    };
    
    // Process each variant
    for (const variant of product.variants || []) {
      const colorName = variant.option1 || 'Default';
      const variantData = productData.variantData?.[variant.id];
      
      if (variantData?.images?.main) {
        const imagePath = path.join(publicDir, variantData.images.main);
        
        if (fs.existsSync(imagePath)) {
          console.log(`  Extracting colors for ${colorName}...`);
          
          // Extract dominant color for the swatch
          const dominantColor = await extractDominantColor(imagePath);
          if (dominantColor) {
            colorMap[productSlug].colors[colorName] = dominantColor;
          }
          
          // Extract background color for the first variant only
          if (Object.keys(colorMap[productSlug].backgroundColors).length === 0) {
            const bgColor = await extractBackgroundColor(imagePath);
            colorMap[productSlug].backgroundColors[colorName] = bgColor;
          }
        } else {
          console.log(`  Warning: Image not found at ${imagePath}`);
        }
      }
    }
  }
  
  // Save the color map
  const outputPath = path.join(__dirname, '../src/data/extracted-colors.json');
  fs.writeFileSync(outputPath, JSON.stringify(colorMap, null, 2));
  
  console.log(`\nColor extraction complete! Saved to ${outputPath}`);
  console.log(`Processed ${Object.keys(colorMap).length} products`);
}

// Run the extraction
extractAllProductColors().catch(console.error);