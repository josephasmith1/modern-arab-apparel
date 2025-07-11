import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  if (fs.existsSync(savePath)) {
    console.log(`Skipping download, file already exists: ${path.basename(savePath)}`);
    return;
  }
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
  const colorName = variantOption.toLowerCase().replace(/\s+/g, '-');
  
  // Color mapping based on common color names
  const colorMap = {
    'black': '#000000',
    'white': '#FFFFFF',
    'faded-black': '#4A4A4A',
    'faded-khaki': '#C4A575',
    'faded-bone': '#E8E4E0',
    'faded-eucalyptus': '#A4B5A0',
    'faded-green': '#A4B5A0',
    'maroon': '#800000',
    'olive-green': '#556B2F',
    'military-green': '#556B2F',
    'bone': '#E8E4E0',
    'sky-blue': '#87CEEB',
    'blue': '#4F81BD',
    'light-blue': '#ADD8E6',
    'slate-blue': '#4F81BD',
    'beige': '#F5F5DC',
    'ecru': '#F5F5DC',
    'khaki': '#C3B091',
    'spruce': '#0F5132',
    'green': '#556B2F',
    'dill': '#556B2F',
    'olive': '#556B2F',
    'light-green': '#90EE90',
    'pigment-alpine-green': '#90EE90',
    'pigment-light-blue': '#ADD8E6',
    'pigment-black': '#4A4A4A',
    'light-black': '#4A4A4A',
    'dark-blue': '#1E3A8A',
    'vintage-black': '#2C2C2C'
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
    '#90EE90': 'bg-green-400',
    '#1E3A8A': 'bg-blue-800',
    '#2C2C2C': 'bg-gray-800'
  };
  
  return swatchMap[hex] || 'bg-gray-500';
}

// Helper function to parse size guide from description
function parseSizeGuide(description) {
  const sizeGuide = [];
  
  // Extract size table from description HTML
  const sizeTableMatch = description.match(/<table[^>]*>[\s\S]*?<\/table>/gi);
  
  if (sizeTableMatch) {
    // This is a simplified parser - in real implementation, you'd want to use a proper HTML parser
    const tableContent = sizeTableMatch[0];
    
    // Extract size data (this is a basic regex approach)
    const sizeRows = tableContent.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi);
    
    if (sizeRows && sizeRows.length > 2) {
      // Skip header rows and process size rows
      for (let i = 2; i < sizeRows.length; i++) {
        const cells = sizeRows[i].match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
        if (cells && cells.length >= 4) {
          const size = cells[0].replace(/<[^>]*>/g, '').trim();
          const length = cells[1].replace(/<[^>]*>/g, '').trim();
          const chest = cells[2].replace(/<[^>]*>/g, '').trim();
          const sleeve = cells[3].replace(/<[^>]*>/g, '').trim();
          
          sizeGuide.push({
            size: size,
            length: length,
            chest: chest,
            sleeve: sleeve,
            lengthCm: 'N/A',
            chestCm: 'N/A',
            sleeveCm: 'N/A'
          });
        }
      }
    }
  }
  
  // If no size guide found, generate basic one
  if (sizeGuide.length === 0) {
    const basicSizes = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
    basicSizes.forEach(size => {
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
  }
  
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

// Helper function to extract features from description
function extractFeatures(description) {
  const features = [
    "Unisex fit",
    "Premium quality materials",
    "Modern Arabic branding",
    "Designed in Los Angeles"
  ];
  
  // Extract specific features from description
  if (description.includes('100% cotton')) {
    features.push('100% premium cotton');
  }
  if (description.includes('fleece')) {
    features.push('Premium fleece material');
  }
  if (description.includes('garment-dyed')) {
    features.push('Garment-dyed fabric');
  }
  if (description.includes('pre-shrunk')) {
    features.push('Pre-shrunk fabric');
  }
  if (description.includes('oversized')) {
    features.push('Oversized fit');
  }
  if (description.includes('Arabic calligraphy')) {
    features.push('Arabic calligraphy designed by native speakers');
  }
  
  return features;
}

// Helper function to extract specifications from description
function extractSpecifications(description) {
  const specs = {
    material: "Premium quality blend",
    weight: "Medium weight",
    fit: "Unisex fit",
    origin: "Designed in Los Angeles, USA"
  };
  
  // Extract material info
  if (description.includes('100% carded cotton')) {
    specs.material = '100% carded cotton';
  } else if (description.includes('100% cotton')) {
    specs.material = '100% cotton';
  } else if (description.includes('fleece')) {
    specs.material = 'Premium fleece cotton blend';
  }
  
  // Extract weight info
  if (description.includes('7.1 oz')) {
    specs.weight = '7.1 oz. /yd. ² (240 g/m²)';
  } else if (description.includes('heavyweight')) {
    specs.weight = 'Heavyweight';
  } else if (description.includes('lightweight')) {
    specs.weight = 'Lightweight';
  }
  
  // Extract fit info
  if (description.includes('oversized')) {
    specs.fit = 'Boxy, oversized fit';
  } else if (description.includes('relaxed')) {
    specs.fit = 'Relaxed unisex fit';
  } else if (description.includes('tailored')) {
    specs.fit = 'Tailored fit with ribbed ankle cuffs';
  }
  
  return specs;
}

// Main processing function for a single product's data
async function processProduct(productData) {
  try {
    
    console.log(`Found product: ${productData.title}`);
    
    // Extract pricing information
    const prices = productData.variants.map(v => parseFloat(v.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const priceDisplay = minPrice === maxPrice ? 
      `$${minPrice.toFixed(2)}` : 
      `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
    
    // Extract basic product info
    const product = {
      slug: generateSlug(productData.title),
      name: productData.title,
      price: priceDisplay,
      originalPrice: priceDisplay,
      description: productData.description || 'Premium quality apparel with modern Arabic design.',
      fullDescription: productData.body_html 
        ? productData.body_html
            .replace(/<[^>]*>/g, '') // Strip HTML tags
            .replace(/[“”]/g, '"')   // Replace smart quotes with standard quotes
            .replace(/\n/g, ' ')
            .replace(/\t/g, ' ')
            .replace(/\r/g, ' ')
            .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
            .trim()
        : 'Premium quality apparel representing modern Arabic culture and heritage.',
      features: extractFeatures(productData.body_html || ''),
      specifications: extractSpecifications(productData.body_html || ''),
      sizeGuide: parseSizeGuide(productData.body_html || ''),
      colors: []
    };
    
    // Check if product has size-based pricing
    const pricingMap = {};
    let hasSizePricing = false;
    
    productData.variants.forEach(variant => {
      const size = variant.option2 || variant.option1;
      const price = `$${parseFloat(variant.price).toFixed(2)}`;
      
      if (pricingMap[size] && pricingMap[size] !== price) {
        hasSizePricing = true;
      }
      pricingMap[size] = price;
    });
    
    if (hasSizePricing) {
      product.pricing = pricingMap;
    }
    
    // Create a map of image IDs to image URLs for efficient lookup
    const imageMap = {};
    productData.images.forEach(img => {
      imageMap[img.id] = img.src;
    });

    // Group variants by color and collect their associated images using the image_id
    const colorGroups = {};
    productData.variants.forEach(variant => {
      const colorOption = variant.option1; // Assuming color is option1
      if (!colorGroups[colorOption]) {
        colorGroups[colorOption] = {
          name: colorOption,
          imageUrls: new Set() // Use a Set to store unique image URLs
        };
      }
      if (variant.image_id && imageMap[variant.image_id]) {
        colorGroups[colorOption].imageUrls.add(imageMap[variant.image_id]);
      }
    });

    // Process each color group to download images and structure the data
    const imageDir = path.join(__dirname, 'public', 'images', product.slug);
    ensureDirectoryExists(imageDir);

    for (const colorName in colorGroups) {
      const colorGroup = colorGroups[colorName];
      const colorInfo = extractColorInfo(colorName);
      const allImages = Array.from(colorGroup.imageUrls);

      const colorImages = {
        main: '',
        back: '',
        lifestyle: []
      };

      // Download up to 10 images per color
      for (let i = 0; i < Math.min(allImages.length, 10); i++) {
        const imageUrl = allImages[i];
        const imageExtension = path.extname(imageUrl).split('?')[0] || '.jpg';
        const imageName = `${sanitizeFilename(colorName)}-${i + 1}${imageExtension}`;
        const imagePath = path.join(imageDir, imageName);

        try {
          await downloadImage(imageUrl, imagePath);
          console.log(`Downloaded: ${imageName}`);
          const localImagePath = `/images/${product.slug}/${imageName}`;

          // Assign images to main, back, and lifestyle categories
          if (i === 0) {
            colorImages.main = localImagePath;
          } else if (i === 1) {
            colorImages.back = localImagePath;
          } else {
            colorImages.lifestyle.push(localImagePath);
          }
        } catch (error) {
          console.error(`Failed to download image ${imageUrl}:`, error.message);
        }
      }

      // Add the processed color data to the product
      product.colors.push({
        name: colorInfo.name,
        swatch: colorInfo.swatch,
        hex: colorInfo.hex,
        images: colorImages
      });
    }
    
    return product;
    
  } catch (error) {
    console.error(`Error scraping product ${productData.title}:`, error.message);
    throw error;
  }
}

// Main execution function
async function main() {
  // Clean up existing images directory for a fresh start
  const imageDir = path.join(__dirname, 'public', 'images');
  console.log(`Cleaning up directory: ${imageDir}`);
  if (fs.existsSync(imageDir)) {
    fs.rmSync(imageDir, { recursive: true, force: true });
  }
  ensureDirectoryExists(imageDir);

  const scrapedProducts = [];
  
  console.log('Starting improved product scraping from products.json...');
  
  try {
    // Fetch all products from the single JSON endpoint
    const response = await axios.get('https://modernarabapparel.com/products.json');
    const allProductsData = response.data.products;

    // Process all products
    for (const productData of allProductsData) {
      try {
        const product = await processProduct(productData);
        if (product) {
          scrapedProducts.push(product);
        }
      } catch (error) {
        console.error(`Skipping product due to error: ${productData.title}`);
      }
    }
  }
  
  // Generate the data.ts file with proper TypeScript formatting
  const dataFileContent = `export interface Product {
  slug: string;
  name: string;
  price: string;
  originalPrice: string;
  description: string;
  fullDescription: string;
  features: string[];
  specifications: {
    material: string;
    weight: string;
    fit: string;
    origin: string;
  };
  sizeGuide: {
    size: string;
    length: string;
    chest: string;
    sleeve: string;
    lengthCm: string;
    chestCm: string;
    sleeveCm: string;
  }[];
  pricing?: Record<string, string>;
  colors: {
    name: string;
    swatch: string;
    hex: string;
    images: {
      main: string;
      back: string;
      lifestyle: string[];
    };
  }[];
}

export const products: Product[] = ${JSON.stringify(scrapedProducts, null, 2)};`;
  
  const dataFilePath = path.join(__dirname, 'src', 'app', 'products', 'data.ts');
  fs.writeFileSync(dataFilePath, dataFileContent);
  
  console.log(`\nScraping complete! Generated ${scrapedProducts.length} products.`);
  console.log(`Data file saved to: ${dataFilePath}`);
  console.log(`Images downloaded to: ${path.join(__dirname, 'public', 'images')}`);
  
  // Generate summary report
  console.log('\n=== IMPROVED SCRAPING SUMMARY ===');
  scrapedProducts.forEach(product => {
    console.log(`\n${product.name}:`);
    console.log(`  - Slug: ${product.slug}`);
    console.log(`  - Price: ${product.price}`);
    console.log(`  - Colors: ${product.colors.length}`);
    console.log(`  - Sizes: ${product.sizeGuide.length}`);
    console.log(`  - Features: ${product.features.length}`);
    console.log(`  - Total Images: ${product.colors.reduce((sum, color) => {
      return sum + 1 + (color.images.back ? 1 : 0) + color.images.lifestyle.length;
    }, 0)}`);
  });
}

// Run the scraper
main().catch(console.error);

export { scrapeProduct, main };