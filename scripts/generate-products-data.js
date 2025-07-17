import path from 'path';
import fs from 'fs';
import { exit } from 'process';

const productsDirectory = path.join(process.cwd(), 'src/data/products');
const outputFilePath = path.join(process.cwd(), 'src/data/products-data.ts');

/**
 * Extracts the color from a variant title.
 * Handles formats like 'Size / Color' or 'Size (Color)'
 */
function getVariantColor(variantTitle) {
  // Matches 'Color', 'Size / Color', or 'Size (Color)'
  const match = variantTitle.match(/(?:\/|\()\s*([^/()]+?)\s*(?:\)|$)/);
  if (match && match[1]) {
    return match[1].trim();
  }
  // Fallback for titles that are just the color name or 'Color / Size'
  const parts = variantTitle.split(' / ');
  return parts[parts.length - 1].trim();
}

/**
 * Assigns main, back, and lifestyle images for a color variant from a single product file.
 */
function getImagesForColor(color, productData) {
  const allImages = productData.images;
  const variantImageIds = new Set();

  // Find all image IDs associated with this color variant
  productData.variants.forEach(variant => {
    if (getVariantColor(variant.title).toLowerCase() === color.toLowerCase() && variant.image_id) {
      variantImageIds.add(variant.image_id);
    }
  });

  const images = [...variantImageIds].map(id => allImages.find(img => img.id === id)).filter(Boolean);

  // Determine main and back images based on alt tags or position
  let mainImage = images.find(img => /main/i.test(img.alt)) || images.find(img => /front/i.test(img.alt)) || images[0] || null;
  let backImage = images.find(img => /back/i.test(img.alt));

  // If no explicit back image, use the second image if available and not the main one
  if (!backImage && images.length > 1 && images[1] !== mainImage) {
    backImage = images[1];
  }

  const usedImageIds = new Set();
  if (mainImage) usedImageIds.add(mainImage.id);
  if (backImage) usedImageIds.add(backImage.id);

  // All other images for this variant are lifestyle images
  const lifestyleImages = images.filter(img => !usedImageIds.has(img.id));

  return {
    main: mainImage,
    back: backImage,
    lifestyle: lifestyleImages,
  };
}

/**
 * Main function to generate a 1:1 mapping from JSON files to product data.
 */
function generateProductData() {
  const filenames = fs.readdirSync(productsDirectory);
  const allProducts = [];

  filenames.forEach(filename => {
    if (path.extname(filename) !== '.json') return;

    console.log(`--- Processing file: ${filename} ---`);
    const filePath = path.join(productsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const productData = JSON.parse(fileContents).product;

    if (!productData || !productData.variants || productData.variants.length === 0) {
      console.warn(`⚠️  No product data or variants in ${filename}, skipping.`);
      return;
    }

    // Extract all unique colors from the variants in this file
    const uniqueColors = [...new Set(productData.variants.map(v => getVariantColor(v.title)))];
    const colors = [];
    const imagesByColor = {};

    uniqueColors.forEach(color => {
      const images = getImagesForColor(color, productData);
      if (images.main) {
        colors.push({
          name: color,
          swatch: '', // Placeholder, can be populated later
          hex: '', // Placeholder, can be populated later
          images: {
            main: images.main ? images.main.src : '',
            back: images.back ? images.back.src : '',
            lifestyle: images.lifestyle.map(img => img.src)
          },
          variants: [] // Placeholder, can be populated later
        });
        imagesByColor[color] = images;
      } else {
        console.warn(`-  No main image for color ${color} in ${filename}. Variant will be skipped.`);
      }
    });

    if (colors.length === 0) {
      console.warn(`-  No valid color variants with main images found for ${productData.title}. Product will not be generated.`);
      return;
    }

    // Populate variants for each color
    colors.forEach(color => {
      color.variants = productData.variants
        .filter(v => getVariantColor(v.title).toLowerCase() === color.name.toLowerCase())
        .map(v => ({
          size: v.option1,
          price: parseFloat(v.price),
          sku: v.sku,
          available: v.available ?? true, // Default to true if undefined
        }));
    });

    const shortDescription = productData.body_html.split('<p>')[1]?.replace(/<[^>]+>/g, '').trim() || '';

    // Create a single product entry for this JSON file
    const productEntry = {
      slug: productData.handle,
      name: productData.title,
      vendor: productData.vendor,
      collection: productData.product_type,
      tags: productData.tags.split(',').map(t => t.trim()),
      price: productData.variants[0].price,
      originalPrice: productData.variants[0].compare_at_price || productData.variants[0].price,
      description: shortDescription,
      fullDescription: productData.body_html,
      features: [], // Placeholder
      specifications: [], // Placeholder
      origin: [], // Placeholder
      careInstructions: [], // Placeholder
      sizes: productData.options.find(opt => opt.name === 'Size')?.values || [],
      colors: colors,
    };

    allProducts.push(productEntry);
    console.log(`✅ Generated product: ${productData.title} (slug: ${productData.handle}) with ${colors.length} colors`);
  });

  const finalOutput = `// This file is auto-generated by scripts/generate-products-data.js
import { Product } from './products/types';

export const productsData: Product[] = ${JSON.stringify(allProducts, null, 2)};
`;

  fs.writeFileSync(outputFilePath, finalOutput);
  console.log(`\nGenerated ${outputFilePath} with ${allProducts.length} products`);
}

try {
  generateProductData();
} catch (error) {
  console.error('Error generating product data:', error);
  exit(1);
}