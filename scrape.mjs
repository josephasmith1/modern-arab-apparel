import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- HELPER FUNCTIONS ---

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9._-]/gi, '-').toLowerCase();
}

async function downloadImage(imageUrl, savePath) {
  if (fs.existsSync(savePath)) {
    console.log(`  - Skipping, already exists: ${path.basename(savePath)}`);
    return;
  }
  try {
    const response = await axios({ method: 'GET', url: imageUrl, responseType: 'stream' });
    const writer = fs.createWriteStream(savePath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`  - ERROR downloading ${imageUrl}: ${error.message}`);
  }
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
}

// --- MAIN PROCESSING LOGIC ---

const extractSection = (html, title) => {
  const regex = new RegExp(`<strong>${title}:<\/strong>(.*?)(<p><strong>|$)`, 's');
  const match = html.match(regex);
  if (!match || !match[1]) return []; // Return empty array if no section found
  const sectionHtml = match[1].trim();
  const listMatch = sectionHtml.match(/<ul>(.*?)<\/ul>/s);
  if (listMatch && listMatch[1]) {
    const items = listMatch[1].match(/<li>(.*?)<\/li>/gs)?.map(item => item.replace(/<\/?li>/g, '').trim());
    return items || [];
  }
  const text = sectionHtml.replace(/<[^>]*>/g, '').trim();
  return text ? [text] : []; // Return array with text or empty array
};

async function processProduct(productData) {
  console.log(`Processing: ${productData.title}`);

  // Basic product info
  const slug = generateSlug(productData.title);
  const prices = productData.variants.map(v => parseFloat(v.price));
  const priceDisplay = prices.length > 1 && Math.min(...prices) !== Math.max(...prices)
    ? `$${Math.min(...prices).toFixed(2)} - $${Math.max(...prices).toFixed(2)}`
    : `$${prices[0].toFixed(2)}`;

  const product = {
    slug,
    name: productData.title || '',
    price: priceDisplay,
    originalPrice: priceDisplay,
    vendor: productData.vendor || '',
    collection: productData.product_type || '',
    tags: typeof productData.tags === 'string' ? productData.tags.split(',').map(t => t.trim()) : (Array.isArray(productData.tags) ? productData.tags : []),
    description: (productData.body_html.split('<p><strong>')[0].replace(/<[^>]*>/g, '').trim().substring(0, 150) + '...') || '',
    fullDescription: productData.body_html || '',
    features: extractSection(productData.body_html, 'Features'),
    specifications: extractSection(productData.body_html, 'Specifications'),
    origin: extractSection(productData.body_html, 'Origin'),
    careInstructions: extractSection(productData.body_html, 'Care Instructions'),
    sizes: [...new Set(productData.variants.map(v => v.option2).filter(Boolean))],
    colors: [],
  };

  // Map images by ID for easy lookup
  const imageMap = productData.images.reduce((acc, img) => {
    acc[img.id] = img.src;
    return acc;
  }, {});

  // Group variants by color to gather images
  // Group variants by color to gather images and variant details
  const colorGroups = {};
  productData.variants.forEach(variant => {
    const color = variant.option1 || 'Default';
    if (!colorGroups[color]) {
      colorGroups[color] = { image_ids: new Set(), variants: [] };
    }
    if (variant.image_id) {
      colorGroups[color].image_ids.add(variant.image_id);
    }
    colorGroups[color].variants.push({
      size: variant.option2 || '',
      price: parseFloat(variant.price) || 0,
      sku: variant.sku || '',
      available: variant.available || false,
    });
  });

  // Process each color group
  const imageDir = path.join(__dirname, 'public', 'images', slug);
  ensureDirectoryExists(imageDir);

  for (const colorName in colorGroups) {
    const group = colorGroups[colorName];
    const imageIds = Array.from(group.image_ids);

    // Fallback to first product image if a color group has no specific images
    if (imageIds.length === 0 && productData.images.length > 0) {
      imageIds.push(productData.images[0].id);
    }

    const colorImages = { main: '', back: '', lifestyle: [] };
    const downloadedImagePaths = [];

    for (const [index, imageId] of imageIds.entries()) {
      const imageUrl = imageMap[imageId];
      if (!imageUrl) continue;

      const imageName = `${sanitizeFilename(colorName)}-${index + 1}${path.extname(imageUrl).split('?')[0]}`;
      const savePath = path.join(imageDir, imageName);

      await downloadImage(imageUrl, savePath);
      console.log(`  - Downloaded: ${imageName}`);
      downloadedImagePaths.push(`/images/${slug}/${imageName}`);
    }

    if (downloadedImagePaths.length > 0) colorImages.main = downloadedImagePaths[0];
    if (downloadedImagePaths.length > 1) colorImages.back = downloadedImagePaths[1];
    if (downloadedImagePaths.length > 2) colorImages.lifestyle = downloadedImagePaths.slice(2);

    product.colors.push({
      name: colorName,
      swatch: '', // Simplified
      hex: '', // Simplified
      images: colorImages,
      variants: group.variants,
    });
  }

  return product;
}

async function cleanupOldImages() {
  const imageDir = path.join(__dirname, 'public', 'images');
  console.log(`Cleaning up old images in: ${imageDir}`);
  if (fs.existsSync(imageDir)) {
    fs.rmSync(imageDir, { recursive: true, force: true });
  }
  ensureDirectoryExists(imageDir);
}

async function main() {
  try {
    console.log(`--- Starting New Product Scrape ---`);
    await cleanupOldImages();

    const response = await axios.get('https://modernarabapparel.com/products.json?limit=250');
    const productsData = response.data.products;
    const scrapedProducts = [];

    for (const productData of productsData) {
      try {
        const product = await processProduct(productData);
        if (product) {
          scrapedProducts.push(product);
        }
      } catch (error) {
        console.error(`\n--- ERROR processing product: ${productData.title} ---`);
        console.error(error.message);
        console.log('Product Data:', JSON.stringify(productData, null, 2));
        console.log('--- Continuing to next product ---\n');
      }
    }

    const dataFilePath = path.join(__dirname, 'src', 'app', 'products', 'data.ts');
    const dataFileContent = `// Generated by scrape.mjs on ${new Date().toISOString()}\nexport interface ProductVariant {
  size: string;
  price: number;
  sku: string;
  available: boolean;
}

export interface ProductColor {
  name: string;
  swatch: string;
  hex: string;
  images: {
    main: string;
    back: string;
    lifestyle: string[];
  };
  variants: ProductVariant[];
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
  specifications: string[];
  origin: string[];
  careInstructions: string[];
  sizes?: string[];
  colors: ProductColor[];
}

export const products: Product[] = ${JSON.stringify(scrapedProducts, null, 2)};`;
    fs.writeFileSync(dataFilePath, dataFileContent);

    console.log(`\n--- SCRAPE COMPLETE ---`);
    console.log(`${scrapedProducts.length} products processed.`);
    console.log(`Data file saved to: ${dataFilePath}`);

  } catch (error) {
    console.error(`FATAL ERROR: Could not fetch or process products.json. ${error.message}`);
  }
}

main();
