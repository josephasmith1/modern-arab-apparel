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

async function downloadImage(imageUrl, saveDir, baseName) {
  try {
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'arraybuffer',
    });
    const fileBuffer = Buffer.from(response.data, 'binary');

    // Clean the image URL to get proper extension
    const cleanUrl = imageUrl.split('?')[0]; // Remove query parameters
    const extension = path.extname(cleanUrl) || '.jpg'; // Default to .jpg if no extension

    const finalImageName = `${baseName}${extension}`;
    const finalPath = path.join(saveDir, finalImageName);

    if (fs.existsSync(finalPath)) {
      console.log(`  - Skipping, already exists: ${finalImageName}`);
    } else {
      fs.writeFileSync(finalPath, fileBuffer);
      console.log(`  - Downloaded: ${finalImageName}`);
    }
    return finalImageName;
  } catch (error) {
    console.error(`  - ERROR downloading ${imageUrl}: ${error.message}`);
    return null;
  }
}

function getColorHex(colorName) {
  const lowerColor = colorName.toLowerCase();
  const colorMap = {
    'black': '#000000',
    'white': '#FFFFFF',
    'bone': '#E3DED8',
    'sand': '#C2B280',
    'khaki': '#C3B091',
    'green': '#228B22',
    'olive': '#556B2F',
    'blue': '#0000FF',
    'maroon': '#800000',
    'beige': '#F5F5DC',
    'gray': '#808080',
    'grey': '#808080',
    'vintage black': '#2c2c2c',
    'light green': '#90EE90',
    'light blue': '#ADD8E6',
    'dark blue': '#00008B',
  };

  for (const key in colorMap) {
    if (lowerColor.includes(key)) {
      return colorMap[key];
    }
  }

  return '#CCCCCC'; // Default gray
}

function findImagesByColor(productData, colorName) {
  const lowerColorName = colorName.toLowerCase();
  const associatedImageIds = new Set();

  // Step 1: Get all variant IDs for the given color.
  const colorOption = productData.options.find(opt => opt.name.toLowerCase() === 'color');
  if (!colorOption) return [];

  const variantIdsForColor = productData.variants
    .filter(variant => {
      const variantColor = variant[`option${colorOption.position}`];
      return variantColor && variantColor.toLowerCase() === lowerColorName;
    })
    .map(variant => variant.id);

  // Step 2: Collect images using the explicit `variant_ids` array on each image.
  productData.images.forEach(image => {
    if (image.variant_ids.some(vid => variantIdsForColor.includes(vid))) {
      associatedImageIds.add(image.id);
    }
  });

  // Step 3: Collect images using the `image_id` on each variant.
  productData.variants.forEach(variant => {
    const variantColor = variant[`option${colorOption.position}`];
    if (variantColor && variantColor.toLowerCase() === lowerColorName && variant.image_id) {
      associatedImageIds.add(variant.image_id);
    }
  });

  // Step 4: Fallback to text matching if no images are found via explicit linking.
  if (associatedImageIds.size === 0) {
    console.warn(`  - WARNING: No images found for color '${colorName}' via explicit linking. Falling back to text matching.`);
    productData.images.forEach(image => {
      const altText = (image.alt || '').toLowerCase();
      if (altText.includes(lowerColorName)) {
        associatedImageIds.add(image.id);
      }
    });
  }

  // Step 5: Map IDs to image objects and sort by position.
  const colorImages = [...associatedImageIds]
    .map(id => productData.images.find(img => img.id === id))
    .filter(Boolean) // Remove any nulls if an image ID wasn't found
    .sort((a, b) => a.position - b.position);

  return colorImages;
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
    origin: extractSection(productData.body_html, 'Source'),
    careInstructions: extractSection(productData.body_html, 'Care Instructions'),
    sizes: productData.options.find(opt => opt.name.toLowerCase() === 'size')?.values || [],
    colors: [],
  };

  const imageDir = path.join(__dirname, 'public', 'images');
  ensureDirectoryExists(imageDir);

  const variantsByColor = productData.variants.reduce((acc, variant) => {
    const colorOption = productData.options.find(opt => opt.name.toLowerCase() === 'color');
    const sizeOption = productData.options.find(opt => opt.name.toLowerCase() === 'size');

    if (!colorOption) return acc; // Skip if no color option

    const colorValue = variant[`option${colorOption.position}`];
    const sizeValue = sizeOption ? variant[`option${sizeOption.position}`] : null;

    if (!acc[colorValue]) {
      acc[colorValue] = { variants: [] };
    }

    acc[colorValue].variants.push({
      size: sizeValue,
      price: parseFloat(variant.price),
      sku: variant.sku,
      available: variant.available,
    });

    return acc;
  }, {});

  for (const colorName in variantsByColor) {
    const group = variantsByColor[colorName];
    
    // Use enhanced image discovery
    const colorImages = findImagesByColor(productData, colorName);
    const uniqueImageUrls = [...new Set(colorImages.map(img => img.src))].filter(Boolean);
    
    if (uniqueImageUrls.length === 0) {
      console.warn(`  - WARNING: No images found for color '${colorName}' in product '${productData.title}'`);
    }

    const downloadedImagePaths = [];
    const imageDirForSlug = path.join(imageDir, slug);
    ensureDirectoryExists(imageDirForSlug);

    for (let i = 0; i < uniqueImageUrls.length; i++) {
      const imageUrl = uniqueImageUrls[i];
      const baseName = sanitizeFilename(`${colorName}-${i + 1}`);
      const finalImageName = await downloadImage(imageUrl, imageDirForSlug, baseName);
      if (finalImageName) {
        // Store clean path without query parameters
        downloadedImagePaths.push(`/images/${slug}/${finalImageName}`);
      }
    }

    // If no images were downloaded, try to find a fallback
    if (downloadedImagePaths.length === 0 && productData.images.length > 0) {
      console.warn(`  - WARNING: Using fallback image for color '${colorName}'`);
      const fallbackImage = productData.images[0];
      const baseName = sanitizeFilename(`${colorName}-fallback`);
      const finalImageName = await downloadImage(fallbackImage.src, imageDirForSlug, baseName);
      if (finalImageName) {
        // Store clean path without query parameters
        downloadedImagePaths.push(`/images/${slug}/${finalImageName}`);
      }
    }

    // Assign images based on their sorted position
    const mainImage = downloadedImagePaths.find(p => p.includes('front') || p.includes('main')) || downloadedImagePaths[0] || '';
    const backImage = downloadedImagePaths.find(p => p.includes('back')) || downloadedImagePaths[1] || '';
    
    const lifestyleImages = downloadedImagePaths.filter(
      p => p !== mainImage && p !== backImage
    );

    const colorImageSet = {
      main: mainImage,
      back: backImage,
      lifestyle: lifestyleImages,
    };

    product.colors.push({
      name: colorName,
      swatch: '',
      hex: getColorHex(colorName),
      images: colorImageSet,
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

    let page = 1;
    let productsData = [];
    let allProducts = [];

    do {
      const response = await axios.get(`https://modernarabapparel.com/products.json?limit=250&page=${page}`);
      productsData = response.data.products;
      allProducts = allProducts.concat(productsData);
      page++;
    } while (productsData.length > 0);

    const scrapedProducts = [];

    for (const productSummary of allProducts) {
      try {
        // Fetch the detailed product data using its handle
        console.log(`Fetching details for: ${productSummary.handle}`);
        const detailResponse = await axios.get(`https://modernarabapparel.com/products/${productSummary.handle}.json`);
        const productData = detailResponse.data.product;

        const product = await processProduct(productData);
        if (product) {
          scrapedProducts.push(product);
        }
        // Add a delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 250));
      } catch (error) {
        console.error(`\n--- ERROR processing product: ${productSummary.title} ---`);
        console.error(error.message);
        console.log('Product Summary:', JSON.stringify(productSummary, null, 2));
        console.log('--- Continuing to next product ---\n');
      }
    }

    // Ensure all slugs are unique before writing to file
    const uniqueProducts = [];
    const slugCounts = {};

    for (const product of scrapedProducts) {
      let newSlug = product.slug;
      if (slugCounts[newSlug]) {
        slugCounts[newSlug]++;
        newSlug = `${newSlug}-${slugCounts[newSlug]}`;
      } else {
        slugCounts[newSlug] = 1;
      }
      product.slug = newSlug;
      uniqueProducts.push(product);
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

export const products: Product[] = ${JSON.stringify(uniqueProducts, null, 2)};`;
    fs.writeFileSync(dataFilePath, dataFileContent);

    console.log(`\n--- SCRAPE COMPLETE ---`);
    console.log(`${scrapedProducts.length} products processed.`);
    console.log(`Data file saved to: ${dataFilePath}`);

  } catch (error) {
    console.error(`FATAL ERROR: Could not fetch or process products.json. ${error.message}`);
  }
}

main();
