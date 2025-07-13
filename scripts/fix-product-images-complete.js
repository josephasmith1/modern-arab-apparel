const fs = require('fs');
const path = require('path');

// Read the all-products.json file
const allProductsPath = path.join(__dirname, 'all-products.json');
const allProducts = JSON.parse(fs.readFileSync(allProductsPath, 'utf8'));

// Read the current data.ts file
const dataPath = path.join(__dirname, '../src/app/products/data.ts');
const currentData = fs.readFileSync(dataPath, 'utf8');

// Function to extract color from variant title
function extractColorFromVariant(variantTitle) {
  // Split by '/' and take the first part (color)
  const parts = variantTitle.trim().split('/');
  return parts[0].trim();
}

// Function to download and save images locally
async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const imagePath = path.join(__dirname, '../public', filename);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(imagePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(imagePath, Buffer.from(buffer));
    return filename;
  } catch (error) {
    console.error(`Failed to download ${url}:`, error);
    return null;
  }
}

// Function to get filename from URL
function getFilenameFromUrl(url) {
  const urlParts = url.split('/');
  const filename = urlParts[urlParts.length - 1].split('?')[0];
  return filename;
}

// Function to create color-to-images mapping for a product
function createColorImageMapping(shopifyProduct) {
  const colorImages = {};
  const processedImages = new Set();
  
  // First, map images that have variant_ids to specific colors
  shopifyProduct.images.forEach(image => {
    if (image.variant_ids && image.variant_ids.length > 0) {
      // Find which color this image belongs to
      const variant = shopifyProduct.variants.find(v => image.variant_ids.includes(v.id));
      if (variant) {
        const color = extractColorFromVariant(variant.title);
        if (!colorImages[color]) {
          colorImages[color] = [];
        }
        
        const filename = `/images/${shopifyProduct.handle}/${getFilenameFromUrl(image.src)}`;
        colorImages[color].push({
          src: image.src,
          filename: filename,
          position: image.position,
          alt: image.alt || `${shopifyProduct.title} - ${color}`
        });
        processedImages.add(image.id);
      }
    }
  });
  
  // Then, distribute remaining images (lifestyle shots) to all colors or use them as general images
  const generalImages = shopifyProduct.images.filter(image => !processedImages.has(image.id));
  
  // Add general images to each color that doesn't have enough images
  Object.keys(colorImages).forEach(color => {
    if (colorImages[color].length < 3) {
      // Add some general images to this color
      generalImages.slice(0, 3 - colorImages[color].length).forEach(image => {
        const filename = `/images/${shopifyProduct.handle}/${getFilenameFromUrl(image.src)}`;
        colorImages[color].push({
          src: image.src,
          filename: filename,
          position: image.position,
          alt: image.alt || `${shopifyProduct.title} - ${color}`
        });
      });
    }
  });
  
  return { colorImages, generalImages };
}

// Function to format product data for data.ts
function formatProductForDataTs(shopifyProduct) {
  const { colorImages, generalImages } = createColorImageMapping(shopifyProduct);
  
  // Get all unique colors from variants
  const colors = [...new Set(shopifyProduct.variants.map(v => extractColorFromVariant(v.title)))];
  
  // Create color objects
  const colorObjects = colors.map(colorName => {
    const colorVariants = shopifyProduct.variants.filter(v => extractColorFromVariant(v.title) === colorName);
    const images = colorImages[colorName] || [];
    
    // Sort images by position
    images.sort((a, b) => a.position - b.position);
    
    // Determine main, back, and lifestyle images
    let mainImage = '';
    let backImage = '';
    const lifestyleImages = [];
    
    images.forEach((img, index) => {
      const filename = img.filename;
      
      // First image is main
      if (index === 0) {
        mainImage = filename;
      }
      // If filename contains 'back', use as back image
      else if (filename.toLowerCase().includes('back') && !backImage) {
        backImage = filename;
      }
      // Rest are lifestyle images
      else {
        lifestyleImages.push(filename);
      }
    });
    
    // If no back image was found in the named files, use the second image if available
    if (!backImage && images.length > 1) {
      backImage = images[1].filename;
      // Remove it from lifestyle if it was added there
      const backIndex = lifestyleImages.indexOf(images[1].filename);
      if (backIndex > -1) {
        lifestyleImages.splice(backIndex, 1);
      }
    }
    
    // Add some general lifestyle images if needed
    if (lifestyleImages.length < 2 && generalImages.length > 0) {
      generalImages.slice(0, 2 - lifestyleImages.length).forEach(img => {
        const filename = `/images/${shopifyProduct.handle}/${getFilenameFromUrl(img.src)}`;
        lifestyleImages.push(filename);
      });
    }
    
    return {
      name: colorName,
      swatch: '',
      hex: getColorHex(colorName),
      images: {
        main: mainImage,
        back: backImage,
        lifestyle: lifestyleImages
      },
      variants: colorVariants.map(v => ({
        size: v.option2,
        price: parseFloat(v.price),
        sku: v.sku,
        available: v.available
      }))
    };
  });
  
  // Get sizes from all variants
  const sizes = [...new Set(shopifyProduct.variants.map(v => v.option2))];
  
  return {
    slug: shopifyProduct.handle,
    name: shopifyProduct.title,
    vendor: shopifyProduct.vendor,
    collection: shopifyProduct.product_type,
    tags: shopifyProduct.tags,
    price: `$${shopifyProduct.variants[0].price}`,
    originalPrice: shopifyProduct.variants[0].compare_at_price ? `$${shopifyProduct.variants[0].compare_at_price}` : `$${shopifyProduct.variants[0].price}`,
    description: shopifyProduct.body_html.substring(0, 200) + '...',
    fullDescription: shopifyProduct.body_html,
    features: [],
    specifications: [],
    origin: [],
    careInstructions: [],
    sizes: sizes,
    colors: colorObjects,
    images: {
      shopifyImages: shopifyProduct.images.map(img => ({
        src: img.src,
        alt: img.alt,
        position: img.position,
        filename: `/images/${shopifyProduct.handle}/${getFilenameFromUrl(img.src)}`
      }))
    }
  };
}

// Function to get color hex codes
function getColorHex(colorName) {
  const colorMap = {
    'Faded Bone': '#E8E4E0',
    'Faded Green': '#A4B5A0',
    'Faded Eucalyptus': '#A4B5A0',
    'Faded Khaki': '#C4A575',
    'Faded  Khaki': '#C4A575',
    'Faded Black': '#4A4A4A',
    'Faded Sand': '#D4C4A8',
    'Black': '#000000',
    'White': '#FFFFFF',
    'Sand': '#D4C4A8',
    'Light Green': '#90EE90',
    'Stone Blue': '#5F7A8B',
    'Sage': '#87A96B',
    'Forest Green': '#228B22',
    'Military Green': '#4B5320',
    'Navy': '#000080',
    'Desert Tan': '#C19A6B',
    'Charcoal': '#36454F',
    'Olive': '#808000',
    'Ash': '#B2BEB5',
    'Bone': '#E3DAC9'
  };
  
  return colorMap[colorName] || '#808080';
}

// Main function to process all products
async function processAllProducts() {
  const products = allProducts.products.map(formatProductForDataTs);
  
  // Generate the new data.ts content
  const dataContent = `// Auto-generated from Shopify data - ${new Date().toISOString()}
export interface ProductColor {
  name: string;
  swatch: string;
  hex: string;
  images: {
    main: string;
    back: string;
    lifestyle: string[];
  };
  variants: {
    size: string;
    price: number;
    sku: string;
    available: boolean;
  }[];
}

export interface Product {
  slug: string;
  name: string;
  vendor: string;
  collection: string;
  tags: string[];
  price: string;
  originalPrice: string;
  description: string;
  fullDescription: string;
  features: string[];
  specifications: any;
  origin: string[];
  careInstructions: string[];
  sizes: string[];
  colors: ProductColor[];
  images?: {
    shopifyImages: {
      src: string;
      alt: string;
      position: number;
      filename: string;
    }[];
  };
}

export const products: Product[] = ${JSON.stringify(products, null, 2)};
`;
  
  // Write the new data.ts file
  fs.writeFileSync(dataPath, dataContent);
  
  console.log('Successfully updated data.ts with complete image mappings!');
  
  // Create a download script for all images
  const downloadScript = products.flatMap(product => 
    product.images.shopifyImages.map(img => 
      `wget -O "../public${img.filename}" "${img.src}"`
    )
  ).join('\n');
  
  fs.writeFileSync(path.join(__dirname, 'download-all-images.sh'), downloadScript);
  console.log('Created download-all-images.sh script');
}

// Run the process
processAllProducts().catch(console.error);