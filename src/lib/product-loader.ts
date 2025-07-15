import fs from 'fs';
import path from 'path';
import { Product, ProductColor, ProductVariant } from '@/data/products/types';

const PRODUCTS_DIR = path.join(process.cwd(), 'src/data/products');

/**
 * Find images for a specific variant from the product images array
 */
function findImagesForVariant(product: any, variant: any, colorName: string): {
  main: string;
  back: string;
  lifestyle: string[];
} {
  const result = {
    main: '',
    back: '',
    lifestyle: [] as string[]
  };
  
  // Get variant-specific images
  const variantId = variant.id;
  const variantImages = product.images?.filter((img: any) => 
    img.variant_ids?.includes(variantId)
  ) || [];
  
  // If we have variant-specific images, use the first one as main
  if (variantImages.length > 0) {
    result.main = variantImages[0].src;
    // Use additional variant images as lifestyle
    result.lifestyle = variantImages.slice(1).map((img: any) => img.src);
  }
  
  // Also get general product images (not tied to specific variants)
  const generalImages = product.images?.filter((img: any) => 
    !img.variant_ids || img.variant_ids.length === 0
  ) || [];
  
  // If we don't have a main image yet, use first general image
  if (!result.main && generalImages.length > 0) {
    result.main = generalImages[0].src;
    // Add remaining general images to lifestyle
    result.lifestyle.push(...generalImages.slice(1).map((img: any) => img.src));
  } else if (result.main && generalImages.length > 0) {
    // If we have a main, add all general images to lifestyle
    result.lifestyle.push(...generalImages.map((img: any) => img.src));
  }
  
  // Try to identify back image from lifestyle images (look for 'back' in URL)
  const backImageIndex = result.lifestyle.findIndex(url => 
    url.toLowerCase().includes('back')
  );
  if (backImageIndex !== -1) {
    result.back = result.lifestyle[backImageIndex];
    result.lifestyle.splice(backImageIndex, 1);
  }
  
  // Limit lifestyle images to prevent too many
  result.lifestyle = result.lifestyle.slice(0, 6);
  
  return result;
}

/**
 * Converts a Shopify product JSON to our Product interface
 */
function convertShopifyToProduct(shopifyData: any): Product | null {
  try {
    const { product } = shopifyData;
    
    // Extract basic product info
    const slug = product.handle;
    const name = product.title;
    const vendor = product.vendor;
    const collection = product.product_type;
    const tags = product.tags ? product.tags.split(', ') : [];
    
    // Get price from first variant
    const firstVariant = product.variants?.[0];
    const price = firstVariant?.price ? `$${firstVariant.price}` : '$0.00';
    const originalPrice = firstVariant?.compare_at_price ? `$${firstVariant.compare_at_price}` : '';
    
    // Extract description (first paragraph before any HTML)
    const description = product.body_html
      ? product.body_html.replace(/<[^>]*>/g, ' ').trim().split('.')[0] + '...'
      : '';
    
    const fullDescription = product.body_html || '';
    
    // Initialize arrays for features, specifications, etc.
    const features: string[] = [];
    const specifications: string[] = [];
    const origin: string[] = [];
    const careInstructions: string[] = [];
    
    // Extract sizes from variants if they have size options
    const sizes: string[] = [];
    const sizeSet = new Set<string>();
    product.variants?.forEach((variant: any) => {
      if (variant.option2) {
        sizeSet.add(variant.option2);
      }
    });
    if (sizeSet.size > 0) {
      sizes.push(...Array.from(sizeSet));
    }
    
    // Build colors array from variants
    const colorMap = new Map<string, ProductColor>();
    
    // First, check if this product has only one color option with size values
    const productOptions = product.options || [];
    const firstOption = productOptions[0];
    const sizeValues = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
    
    // Check if the first option has size values (indicating a single-color product)
    const isSingleColorProduct = firstOption && 
      (firstOption.values.every((v: string) => sizeValues.includes(v)) || firstOption.name === 'Size');
    
    if (isSingleColorProduct) {
      // This is a single-color product
      let colorName = firstOption.name; // e.g., "Black", "White"
      
      // If option name is "Size", extract color from product title or tags
      if (firstOption.name === 'Size') {
        // Extract color from title, tags, or handle
        const title = product.title.toLowerCase();
        const handle = product.handle.toLowerCase();
        const tags = product.tags ? product.tags.split(', ').map((t: string) => t.toLowerCase()) : [];
        
        if (title.includes('faded green') || title.includes('eucalyptus') || tags.includes('faded eucalyptus')) {
          colorName = 'Faded Eucalyptus';
        } else if (title.includes('faded khaki') || tags.includes('faded khaki')) {
          colorName = 'Faded Khaki';
        } else if (title.includes('faded bone') || tags.includes('faded bone')) {
          colorName = 'Faded Bone';
        } else if (title.includes('faded black') || tags.includes('faded black')) {
          colorName = 'Faded Black';
        } else if (title.includes('sand') || handle.includes('sand') || tags.includes('sand')) {
          colorName = 'Sand';
        } else {
          colorName = 'Default';
        }
      }
      const color: ProductColor = {
        name: colorName,
        swatch: '',
        hex: getColorHex(colorName),
        images: {
          main: '',
          back: '',
          lifestyle: []
        },
        variants: []
      };
      
      // Find images for this color
      const firstVariant = product.variants?.[0];
      if (firstVariant) {
        const variantImages = findImagesForVariant(product, firstVariant, colorName);
        const colorSlug = generateColorSlug(colorName, slug);
        const folderName = getImageFolderName(slug);
        const imagePaths = generateImagePaths(colorSlug, folderName);
        color.images.main = imagePaths.main;
        color.images.back = imagePaths.back;
        color.images.lifestyle = imagePaths.lifestyle;
      }
      
      // Add all variants as size variants for this single color
      product.variants?.forEach((variant: any) => {
        color.variants.push({
          size: variant.option1, // The size is in option1 for single-option products
          price: parseFloat(variant.price || '0'),
          sku: variant.sku || '',
          available: variant.available !== false
        });
      });
      
      colorMap.set(colorName, color);
    } else {
      // Multi-color or multi-option product
      product.variants?.forEach((variant: any) => {
        const colorName = variant.option1 || 'Default';
        const size = variant.option2 || variant.option1 || '';
        
        if (!colorMap.has(colorName)) {
          // Create new color entry
          const color: ProductColor = {
            name: colorName,
            swatch: '',
            hex: getColorHex(colorName),
            images: {
              main: '',
              back: '',
              lifestyle: []
            },
            variants: []
          };
          
          // Try to find images for this color variant from product images array
          const variantImages = findImagesForVariant(product, variant, colorName);
          
          // Always use local image paths, never Shopify CDN URLs
          const colorSlug = generateColorSlug(colorName, slug);
          const folderName = getImageFolderName(slug);
          const imagePaths = generateImagePaths(colorSlug, folderName);
          color.images.main = imagePaths.main;
          color.images.back = imagePaths.back;
          color.images.lifestyle = imagePaths.lifestyle;
          
          colorMap.set(colorName, color);
        }
        
        // Add variant to color
        const color = colorMap.get(colorName)!;
        color.variants.push({
          size: size,
          price: parseFloat(variant.price || '0'),
          sku: variant.sku || '',
          available: variant.available !== false
        });
      });
    }
    
    const colors = Array.from(colorMap.values());
    
    return {
      slug,
      name,
      vendor,
      collection,
      tags,
      price,
      originalPrice,
      description,
      fullDescription,
      features,
      specifications,
      origin,
      careInstructions,
      sizes,
      colors
    };
  } catch (error) {
    console.error(`Error converting product:`, error);
    return null;
  }
}

/**
 * Mapping for product handle to image folder name mismatches
 */
const FOLDER_MAPPINGS: Record<string, string> = {
  'modern-arab-beanie-2': 'modernarab-beanie',  // Handle differs from folder name
  'modern-arab-crewneck-sand': 'modernarab-crewneck-sand',  // Different prefix
  'modern-arab-hoodie-2': 'modernarab-hoodie',  // Handle differs from folder name
  'modernarab-tee-black': 'modernarab-tee-black',  // Use correct handle
  'modernarab-tee-white': 'modernarab-tee-white'   // Use correct handle
};

/**
 * Mapping for color names that don't match the actual file naming convention
 * Key: the color slug generated from product JSON
 * Value: the actual file prefix used in image names
 */
const COLOR_MAPPINGS: Record<string, string> = {
  'olive-green': 'green',
  'faded-black': 'faded-black',
  'faded-bone': 'faded-bone',
  'faded-green': 'faded-green',
  'faded-khaki': 'faded-khaki',
  'olive': 'olive',
  'maroon': 'maroon',
  'white': 'white',
  'blue': 'blue',
  'beige': 'beige',
  'navy': 'navy',
  'gray': 'gray',
  'grey': 'grey'
};

/**
 * Product-specific color mappings for cases where colors are named differently per product
 */
const PRODUCT_COLOR_MAPPINGS: Record<string, Record<string, string>> = {
  'modern-arab-joggers': {
    'black': 'faded-black',  // Black variant in joggers uses faded-black files
    'olive-green': 'green'   // Olive Green variant uses green files
  },
  'modern-arab-beanie-2': {
    'black': 'faded-black'   // Black variant uses faded-black files
  },
  'modern-arab-sweatpants': {
    'light-green': 'green',  // Light Green variant uses green files
    'light-blue': 'blue',    // Light Blue variant uses blue files
    'light-black': 'faded-black',  // Light Black variant uses faded-black files
    'dark-blue': 'blue'      // Dark Blue variant uses blue files
  },
  'modern-arab-hoodie': {
    'bone': 'faded-bone'     // Bone variant uses faded-bone files
  },
  'modern-arab-crewneck-sand': {
    'sand': 'faded-bone',    // Sand color maps to faded-bone files
    'bone': 'faded-bone',    // Bone color maps to faded-bone files
    's': 'faded-bone',       // All size variants should map to faded-bone color
    'm': 'faded-bone',
    'l': 'faded-bone',
    'xl': 'faded-bone',
    '2xl': 'faded-bone',
    '3xl': 'faded-bone'
  },
  'modernarab-tee-black': {
    'black': 'faded-black'   // Black tee uses faded-black files
  },
  'modernarab-tee-white': {
    'white': 'white'         // White tee uses white files
  },
  'modern-arab-tee': {
    'faded-bone': 'faded-bone' // Faded bone tee
  },
  'modernarab-tee': {
    'faded-bone': 'faded-bone' // Faded bone tee
  },
  'modern-arab-premium-tee-faded-eucalyptus': {
    'faded-eucalyptus': 's',  // Maps to size-based file names
    'size': 's'               // For when it detects "Size" as color
  },
  'modern-arab-premium-tee-faded-khaki': {
    'faded-khaki': 's',       // Maps to size-based file names
    'size': 's'               // For when it detects "Size" as color
  }
};

/**
 * Generate color slug that matches the actual file naming convention
 */
function generateColorSlug(colorName: string, productSlug?: string): string {
  const baseSlug = colorName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  // Check for product-specific mapping first
  if (productSlug && PRODUCT_COLOR_MAPPINGS[productSlug]?.[baseSlug]) {
    return PRODUCT_COLOR_MAPPINGS[productSlug][baseSlug];
  }
  
  // Fall back to general color mapping
  return COLOR_MAPPINGS[baseSlug] || baseSlug;
}

/**
 * Get the correct image folder name for a product slug
 */
function getImageFolderName(productSlug: string): string {
  return FOLDER_MAPPINGS[productSlug] || productSlug;
}

/**
 * Generate image paths with fallback logic for missing images
 */
function generateImagePaths(colorSlug: string, folderName: string): {
  main: string;
  back: string;
  lifestyle: string[];
} {
  const basePath = `/images/${folderName}/${colorSlug}`;
  
  // Default paths
  const paths = {
    main: `${basePath}-main.jpg`,
    back: `${basePath}-back.jpg`,
    lifestyle: [`${basePath}-lifestyle-1.jpg`]
  };
  
  // For products that commonly only have lifestyle images, use lifestyle as main
  const lifestyleOnlyProducts = [
    'modern-arab-beanie-1',
    'fisherman-beanie',
    'modernarab-beanie'
  ];
  
  if (lifestyleOnlyProducts.includes(folderName)) {
    // Use lifestyle image as main if main doesn't exist
    paths.main = `${basePath}-lifestyle-1.jpg`;
    // Keep back as is (may not exist but won't break)
    paths.back = `${basePath}-back.jpg`;
  }
  
  return paths;
}

/**
 * Get hex color code for common color names
 */
function getColorHex(colorName: string): string {
  const colorMap: Record<string, string> = {
    'black': '#000000',
    'white': '#FFFFFF',
    'blue': '#4169E1',
    'navy': '#000080',
    'dark blue': '#00008B',
    'red': '#FF0000',
    'green': '#008000',
    'olive': '#808000',
    'olive green': '#6B8E23',
    'gray': '#808080',
    'grey': '#808080',
    'brown': '#A52A2A',
    'beige': '#F5F5DC',
    'cream': '#FFFDD0',
    'pink': '#FFC0CB',
    'purple': '#800080',
    'orange': '#FFA500',
    'yellow': '#FFFF00',
    'gold': '#FFD700',
    'silver': '#C0C0C0',
    'maroon': '#800000',
    'faded bone': '#F5F5DC',
    'faded green': '#8FBC8F',
    'faded eucalyptus': '#8FBC8F',
    'faded khaki': '#BDB76B',
    'faded  khaki': '#BDB76B', // Note the double space
    'faded black': '#2F2F2F',
    'khaki': '#C3B091',
    'bone': '#F5F5DC',
    'sand': '#D2B48C',
    'faded sand': '#D2B48C',
    'heather dust': '#D3D3D3',
    'natural': '#FFF8DC'
  };
  
  return colorMap[colorName.toLowerCase()] || '#808080';
}

/**
 * Load all products from JSON files
 */
export async function loadAllProducts(): Promise<Product[]> {
  const products: Product[] = [];
  
  try {
    // Check if products directory exists
    if (!fs.existsSync(PRODUCTS_DIR)) {
      console.error(`Products directory not found: ${PRODUCTS_DIR}`);
      return products;
    }
    
    // Read all JSON files in the products directory
    const files = fs.readdirSync(PRODUCTS_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(PRODUCTS_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const shopifyData = JSON.parse(fileContent);
        
        const product = convertShopifyToProduct(shopifyData);
        if (product) {
          products.push(product);
        } else {
          console.error(`Failed to convert product from file: ${file}`);
        }
      } catch (error) {
        console.error(`Error loading product file ${file}:`, error);
      }
    }
    
    // Sort products by name for consistency
    products.sort((a, b) => a.name.localeCompare(b.name));
    
  } catch (error) {
    console.error('Error loading products:', error);
  }
  
  return products;
}

/**
 * Load a single product by slug
 */
export async function loadProductBySlug(slug: string): Promise<Product | null> {
  try {
    const products = await loadAllProducts();
    return products.find(p => p.slug === slug) || null;
  } catch (error) {
    console.error(`Error loading product with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get all product slugs
 */
export async function getProductSlugs(): Promise<string[]> {
  try {
    const products = await loadAllProducts();
    return products.map(p => p.slug);
  } catch (error) {
    console.error('Error getting product slugs:', error);
    return [];
  }
}