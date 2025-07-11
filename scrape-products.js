const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Product URLs to scrape
const productUrls = [
  'https://modernarabapparel.com/products/modern-arab-faded-tee-black-print',
  'https://modernarabapparel.com/products/modern-arab-hoodie',
  'https://modernarabapparel.com/products/modern-arab-joggers',
  'https://modernarabapparel.com/products/modern-arab-cap',
  'https://modernarabapparel.com/products/modern-arab-beanie',
  'https://modernarabapparel.com/products/modern-arab-bucket-hat',
  'https://modernarabapparel.com/products/modern-arab-sweatpants',
  'https://modernarabapparel.com/products/modernarab-crewneck',
  'https://modernarabapparel.com/products/modernarab-cropped-hoodie'
];

// Helper function to create directories if they don't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper function to sanitize filename
function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}

// Helper function to download image
async function downloadImage(imageUrl, savePath) {
  try {
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream'
    });
    
    const writer = fs.createWriteStream(savePath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading image ${imageUrl}:`, error.message);
    throw error;
  }
}

// Helper function to extract color from variant option
function extractColorInfo(variantOption) {
  const colorName = variantOption.toLowerCase();
  
  // Color mapping based on common color names
  const colorMap = {
    'black': '#000000',
    'white': '#FFFFFF',
    'faded-black': '#4A4A4A',
    'faded-khaki': '#C4A575',
    'faded-bone': '#E8E4E0',
    'faded-eucalyptus': '#A4B5A0',
    'maroon': '#800000',
    'olive-green': '#556B2F',
    'military-green': '#556B2F',
    'bone': '#E8E4E0',
    'sky-blue': '#87CEEB',
    'light-blue': '#ADD8E6',
    'blue': '#4F81BD',
    'slate-blue': '#4F81BD',
    'beige': '#F5F5DC',
    'ecru': '#F5F5DC',
    'khaki': '#C3B091',
    'spruce': '#0F5132',
    'dill': '#556B2F',
    'light-green': '#90EE90',
    'pigment-alpine-green': '#90EE90',
    'pigment-light-blue': '#ADD8E6',
    'pigment-black': '#4A4A4A'
  };
  
  // Find matching color
  const matchedColor = Object.keys(colorMap).find(key => 
    colorName.includes(key) || key.includes(colorName)
  );
  
  return {
    name: variantOption,
    hex: colorMap[matchedColor] || '#000000',
    swatch: getSwatch(colorMap[matchedColor] || '#000000')
  };
}

// Helper function to get Tailwind swatch class
function getSwatch(hex) {
  const swatchMap = {
    '#000000': 'bg-black',
    '#FFFFFF': 'bg-white',
    '#4A4A4A': 'bg-gray-700',
    '#C4A575': 'bg-stone-500',
    '#E8E4E0': 'bg-stone-200',
    '#A4B5A0': 'bg-teal-800',
    '#800000': 'bg-red-900',
    '#556B2F': 'bg-green-800',
    '#87CEEB': 'bg-blue-400',
    '#ADD8E6': 'bg-blue-300',
    '#4F81BD': 'bg-blue-500',
    '#F5F5DC': 'bg-stone-300',
    '#C3B091': 'bg-yellow-700',
    '#0F5132': 'bg-green-800',
    '#90EE90': 'bg-green-400'
  };
  
  return swatchMap[hex] || 'bg-gray-500';
}

// Helper function to generate size guide from variants
function generateSizeGuide(variants, productType) {
  const sizeGuide = [];
  const sizeSet = new Set();
  
  variants.forEach(variant => {
    if (variant.option2) { // Size is usually option2
      sizeSet.add(variant.option2);
    } else if (variant.option1 && !variant.option1.toLowerCase().includes('color')) {
      sizeSet.add(variant.option1);
    }
  });
  
  // Convert to array and sort
  const sizes = Array.from(sizeSet).sort((a, b) => {
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'One Size', 'S/M', 'L/XL'];
    return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
  });
  
  // Generate placeholder measurements for each size
  sizes.forEach(size => {
    sizeGuide.push({
      size: size,
      length: 'N/A',
      chest: 'N/A',
      sleeve: 'N/A',
      lengthCm: 'N/A',
      chestCm: 'N/A',
      sleeveCm: 'N/A'
    });
  });
  
  return sizeGuide;
}

// Helper function to generate product slug
function generateSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Main scraping function
async function scrapeProduct(productUrl) {
  try {
    console.log(`Scraping product: ${productUrl}`);
    
    // Get product JSON data from Shopify API
    const jsonUrl = productUrl + '.json';
    const response = await axios.get(jsonUrl);
    const productData = response.data.product;
    
    console.log(`Found product: ${productData.title}`);
    
    // Extract basic product info
    const product = {
      slug: generateSlug(productData.title),
      name: productData.title,
      price: `$${(productData.variants[0].price / 100).toFixed(2)}`,
      originalPrice: `$${(productData.variants[0].price / 100).toFixed(2)}`,
      description: productData.description || 'Premium quality apparel with modern Arabic design.',
      fullDescription: productData.body_html ? productData.body_html.replace(/<[^>]*>/g, '') : 'Premium quality apparel representing modern Arabic culture and heritage.',
      features: [
        "Unisex fit",
        "Premium quality materials",
        "Modern Arabic branding",
        "Designed in Los Angeles",
        "Comfortable fit"
      ],
      specifications: {
        material: "Premium quality blend",
        weight: "Medium weight",
        fit: "Unisex fit",
        origin: "Designed in Los Angeles, USA"
      },
      sizeGuide: generateSizeGuide(productData.variants, productData.product_type),
      colors: []
    };
    
    // Check if product has size-based pricing
    const pricingMap = {};
    let hasSizePricing = false;
    
    productData.variants.forEach(variant => {
      const size = variant.option2 || variant.option1;
      const price = `$${(variant.price / 100).toFixed(2)}`;
      
      if (pricingMap[size] && pricingMap[size] !== price) {
        hasSizePricing = true;
      }
      pricingMap[size] = price;
    });
    
    if (hasSizePricing) {
      product.pricing = pricingMap;
    }
    
    // Group variants by color
    const colorGroups = {};
    
    productData.variants.forEach(variant => {
      const colorOption = variant.option1; // Color is usually option1
      
      if (!colorGroups[colorOption]) {
        colorGroups[colorOption] = {
          variants: [],
          images: []
        };
      }
      
      colorGroups[colorOption].variants.push(variant);
    });
    
    // Process images for each color
    const imageDir = path.join(__dirname, 'public', 'images', product.slug);
    ensureDirectoryExists(imageDir);
    
    for (const [colorName, colorData] of Object.entries(colorGroups)) {
      const colorInfo = extractColorInfo(colorName);
      
      // Find images for this color variant
      const colorImages = {
        main: '',
        back: '',
        lifestyle: []
      };
      
      // Get variant-specific images
      const variantImages = colorData.variants
        .filter(v => v.featured_image)
        .map(v => v.featured_image.src);
      
      // Also get general product images
      const productImages = productData.images.map(img => img.src);
      
      // Combine and deduplicate
      const allImages = [...new Set([...variantImages, ...productImages])];
      
      // Download images and organize them
      for (let i = 0; i < allImages.length; i++) {
        const imageUrl = allImages[i];
        const imageExtension = path.extname(imageUrl).split('?')[0] || '.jpg';
        const imageName = `${sanitizeFilename(colorName)}-${i + 1}${imageExtension}`;
        const imagePath = path.join(imageDir, imageName);
        
        try {
          await downloadImage(imageUrl, imagePath);
          console.log(`Downloaded: ${imageName}`);
          
          // Assign to appropriate category
          if (i === 0) {
            colorImages.main = `/images/${product.slug}/${imageName}`;
          } else if (i === 1) {
            colorImages.back = `/images/${product.slug}/${imageName}`;
          } else {
            colorImages.lifestyle.push(`/images/${product.slug}/${imageName}`);
          }
        } catch (error) {
          console.error(`Failed to download image ${imageUrl}:`, error.message);
        }
      }
      
      // Add color to product
      product.colors.push({
        name: colorInfo.name,
        swatch: colorInfo.swatch,
        hex: colorInfo.hex,
        images: colorImages
      });
    }
    
    return product;
    
  } catch (error) {
    console.error(`Error scraping product ${productUrl}:`, error.message);
    throw error;
  }
}

// Main execution function
async function main() {
  const scrapedProducts = [];
  
  console.log('Starting product scraping...');
  
  // Ensure images directory exists
  ensureDirectoryExists(path.join(__dirname, 'public', 'images'));
  
  // Scrape each product
  for (const productUrl of productUrls) {
    try {
      const product = await scrapeProduct(productUrl);
      scrapedProducts.push(product);
      
      // Add delay to be respectful to the server
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`Failed to scrape ${productUrl}:`, error.message);
    }
  }
  
  // Generate the data.ts file
  const dataFileContent = `export const products = ${JSON.stringify(scrapedProducts, null, 2)};`;
  
  const dataFilePath = path.join(__dirname, 'src', 'app', 'products', 'data.ts');
  fs.writeFileSync(dataFilePath, dataFileContent);
  
  console.log(`\nScraping complete! Generated ${scrapedProducts.length} products.`);
  console.log(`Data file saved to: ${dataFilePath}`);
  console.log(`Images downloaded to: ${path.join(__dirname, 'public', 'images')}`);
  
  // Generate summary report
  console.log('\n=== SCRAPING SUMMARY ===');
  scrapedProducts.forEach(product => {
    console.log(`\n${product.name}:`);
    console.log(`  - Slug: ${product.slug}`);
    console.log(`  - Colors: ${product.colors.length}`);
    console.log(`  - Sizes: ${product.sizeGuide.length}`);
    console.log(`  - Total Images: ${product.colors.reduce((sum, color) => {
      return sum + 1 + (color.images.back ? 1 : 0) + color.images.lifestyle.length;
    }, 0)}`);
  });
}

// Run the scraper
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { scrapeProduct, main };