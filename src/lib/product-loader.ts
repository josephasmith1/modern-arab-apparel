import fs from 'fs';
import path from 'path';
import { Product, ProductColor, ProductVariant } from '@/data/products/types';

const PRODUCTS_DIR = path.join(process.cwd(), 'src/data/products');

/**
 * Convert Shopify product JSON to our Product interface - EXACT MIRROR
 */
function convertShopifyToProduct(shopifyData: any): Product | null {
  try {
    const { product } = shopifyData;
    
    // Extract basic product info exactly as stored
    const slug = product.handle;
    const name = product.title;
    const vendor = product.vendor;
    const collection = product.product_type;
    const tags = product.tags ? product.tags.split(', ') : [];
    
    // Get price from first variant
    const firstVariant = product.variants?.[0];
    const price = firstVariant?.price ? `$${firstVariant.price}` : '$0.00';
    const originalPrice = firstVariant?.compare_at_price ? `$${firstVariant.compare_at_price}` : '';
    
    // Use full description exactly as stored
    const description = product.body_html || '';
    const fullDescription = product.body_html || '';
    
    // Extract features, specifications, etc.
    const features: string[] = [];
    const specifications: string[] = [];
    const origin: string[] = [];
    const careInstructions: string[] = [];
    
    // Get all unique sizes from variants
    const sizes: string[] = [];
    const sizeSet = new Set<string>();
    product.variants?.forEach((variant: any) => {
      if (variant.option2) {
        sizeSet.add(variant.option2);
      }
    });
    sizes.push(...Array.from(sizeSet));
    
    // Build colors from variants with CORRECT image mapping
    const colorMap = new Map<string, ProductColor>();
    
    // Group variants by color (option1)
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
        
        // Get images for this color using the CORRECT algorithm
        const colorImages = getImagesForColorCorrect(product, colorName);
        color.images = colorImages;
        
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
 * Get images for a specific color using the CORRECT Shopify variant mapping
 * Algorithm from SHOPIFY_JSON_IMPLEMENTATION_GUIDE.md:
 * 1. Get all variants with the same option1 (color name)
 * 2. Collect all variant IDs for this color
 * 3. Find all images where variant_ids includes ANY of these IDs
 * 4. Categorize images:
 *    - If URL contains "front" → Front image (HERO)
 *    - If URL contains "back" → Back image
 *    - All others → Lifestyle images
 * 5. Order: Front, Back, Lifestyle (by position)
 */
function getImagesForColorCorrect(product: any, colorName: string): {
  main: string;
  back: string;
  lifestyle: string[];
} {
  const result = {
    main: '',
    back: '',
    lifestyle: [] as string[]
  };
  
  // Step 1 & 2: Get all variant IDs for this color
  const colorVariantIds = product.variants
    ?.filter((v: any) => v.option1 === colorName)
    ?.map((v: any) => v.id) || [];
  
  console.log(`Color ${colorName} has variant IDs:`, colorVariantIds);
  
  // Step 3: Find all images that belong to this color
  const colorImages = product.images?.filter((img: any) => {
    // Image belongs to this color if:
    // 1. It has variant_ids that include ANY of our color's variant IDs
    // 2. OR it has empty variant_ids (lifestyle/general images)
    if (!img.variant_ids || img.variant_ids.length === 0) {
      // Lifestyle images have empty variant_ids
      return true;
    }
    // Check if any of this image's variant_ids match our color's variant IDs
    return img.variant_ids.some((vid: number) => colorVariantIds.includes(vid));
  }) || [];
  
  console.log(`Found ${colorImages.length} images for color ${colorName}`);
  
  // Step 4: Categorize images
  const frontImages: any[] = [];
  const backImages: any[] = [];
  const lifestyleImages: any[] = [];
  
  colorImages.forEach((img: any) => {
    const url = img.src.toLowerCase();
    
    if (img.variant_ids && img.variant_ids.length > 0) {
      // This is a product mockup (has variant IDs)
      if (url.includes('front')) {
        frontImages.push(img);
      } else if (url.includes('back')) {
        backImages.push(img);
      } else {
        // Other product images that aren't clearly front/back
        lifestyleImages.push(img);
      }
    } else {
      // This is a lifestyle image (no variant IDs)
      lifestyleImages.push(img);
    }
  });
  
  // Step 5: Sort by position and assign
  frontImages.sort((a, b) => a.position - b.position);
  backImages.sort((a, b) => a.position - b.position);
  lifestyleImages.sort((a, b) => a.position - b.position);
  
  // Assign the FRONT image as main (not the variant's image_id reference)
  if (frontImages.length > 0) {
    result.main = frontImages[0].src;
  } else if (backImages.length > 0) {
    // Fallback to back if no front image
    result.main = backImages[0].src;
  } else if (lifestyleImages.length > 0) {
    // Fallback to lifestyle if no product mockups
    result.main = lifestyleImages[0].src;
  }
  
  // Assign back image
  if (backImages.length > 0) {
    result.back = backImages[0].src;
  }
  
  // All lifestyle images
  result.lifestyle = lifestyleImages.map(img => img.src);
  
  console.log(`Images assigned for ${colorName}:`, {
    main: result.main ? 'assigned' : 'missing',
    back: result.back ? 'assigned' : 'missing',
    lifestyle: result.lifestyle.length,
    frontFound: frontImages.length,
    backFound: backImages.length
  });
  
  return result;
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
    'faded  khaki': '#BDB76B',
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
    const jsonFiles = files.filter(file => file.endsWith('.json') && file !== 'types.ts' && file !== 'products-data.ts');
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(PRODUCTS_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const shopifyData = JSON.parse(fileContent);
        
        const product = convertShopifyToProduct(shopifyData);
        if (product) {
          products.push(product);
          console.log(`Loaded product: ${product.name} with ${product.colors.length} colors`);
          product.colors.forEach(color => {
            const totalImages = (color.images.main ? 1 : 0) + 
                              (color.images.back ? 1 : 0) + 
                              color.images.lifestyle.length;
            console.log(`  - ${color.name}: ${totalImages} total images`);
          });
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