import fs from 'fs';
import path from 'path';
import { ImageMetadata, ProductImageData } from './image-scanner';

export interface ValidationReport {
  totalProducts: number;
  totalVariants: number;
  totalImages: number;
  missingImages: string[];
  brokenReferences: ImageMapping[];
  suggestions: ImageMapping[];
  summary: {
    healthScore: number;
    criticalIssues: number;
    warnings: number;
  };
}

export interface ImageMapping {
  productSlug: string;
  colorName: string;
  expectedPaths: {
    main: string;
    back: string;
    lifestyle: string[];
  };
  actualPaths: {
    main: string | null;
    back: string | null;
    lifestyle: string[];
  };
  shopifyUrls: {
    main: string | null;
    back: string | null;
    lifestyle: string[];
  };
  confidence: number;
  issues: string[];
}

/**
 * Validate that all referenced images exist and are accessible
 */
export async function validateProductImages(
  availableImages: ImageMetadata[],
  productImageData: ProductImageData[]
): Promise<ValidationReport> {
  const missingImages: string[] = [];
  const brokenReferences: ImageMapping[] = [];
  const suggestions: ImageMapping[] = [];
  
  // Create lookup maps
  const imagePathMap = new Map<string, ImageMetadata>();
  availableImages.forEach(img => {
    imagePathMap.set(img.path, img);
  });
  
  let totalVariants = 0;
  let criticalIssues = 0;
  let warnings = 0;
  
  for (const productData of productImageData) {
    // Get variants from the first product file to count them
    const variants = await getProductVariants(productData.productSlug);
    totalVariants += variants.length;
    
    // Group Shopify images by color/variant
    const colorImageMappings = await analyzeProductImages(productData, imagePathMap);
    
    for (const mapping of colorImageMappings) {
      const hasMainImage = mapping.actualPaths.main !== null;
      const hasAnyImage = hasMainImage || 
                         mapping.actualPaths.back !== null || 
                         mapping.actualPaths.lifestyle.length > 0;
      
      if (!hasAnyImage) {
        criticalIssues++;
        mapping.issues.push('No images found for this color variant');
      } else if (!hasMainImage) {
        warnings++;
        mapping.issues.push('Missing main image');
      }
      
      // Check for missing expected images
      if (!imagePathMap.has(mapping.expectedPaths.main)) {
        missingImages.push(mapping.expectedPaths.main);
      }
      if (!imagePathMap.has(mapping.expectedPaths.back)) {
        missingImages.push(mapping.expectedPaths.back);
      }
      
      if (mapping.issues.length > 0) {
        brokenReferences.push(mapping);
      }
      
      // Generate suggestions for fixing issues
      if (mapping.confidence < 0.8) {
        suggestions.push(mapping);
      }
    }
  }
  
  const healthScore = Math.max(0, 100 - (criticalIssues * 10) - (warnings * 2));
  
  return {
    totalProducts: productImageData.length,
    totalVariants,
    totalImages: availableImages.length,
    missingImages: [...new Set(missingImages)], // Remove duplicates
    brokenReferences,
    suggestions,
    summary: {
      healthScore,
      criticalIssues,
      warnings
    }
  };
}

/**
 * Analyze images for a specific product
 */
async function analyzeProductImages(
  productData: ProductImageData,
  imagePathMap: Map<string, ImageMetadata>
): Promise<ImageMapping[]> {
  const mappings: ImageMapping[] = [];
  
  // Get product variants to understand color structure
  const variants = await getProductVariants(productData.productSlug);
  const colorGroups = groupVariantsByColor(variants);
  
  for (const [colorName, colorVariants] of colorGroups) {
    const mapping = await createImageMapping(
      productData.productSlug,
      colorName,
      productData.shopifyImages,
      imagePathMap,
      colorVariants
    );
    mappings.push(mapping);
  }
  
  return mappings;
}

/**
 * Create image mapping for a specific color variant
 */
async function createImageMapping(
  productSlug: string,
  colorName: string,
  shopifyImages: any[],
  imagePathMap: Map<string, ImageMetadata>,
  variants: any[]
): Promise<ImageMapping> {
  // Generate expected paths using the same logic as product loader
  const expectedPaths = generateExpectedPaths(productSlug, colorName);
  
  // Find actual paths that exist
  const actualPaths = {
    main: imagePathMap.has(expectedPaths.main) ? expectedPaths.main : null,
    back: imagePathMap.has(expectedPaths.back) ? expectedPaths.back : null,
    lifestyle: expectedPaths.lifestyle.filter(path => imagePathMap.has(path))
  };
  
  // Find corresponding Shopify URLs
  const shopifyUrls = findShopifyUrls(shopifyImages, variants, colorName);
  
  // Calculate confidence score
  const confidence = calculateConfidence(expectedPaths, actualPaths, shopifyUrls);
  
  // Identify issues
  const issues: string[] = [];
  if (!actualPaths.main && shopifyUrls.main) {
    issues.push(`Main image missing: expected ${expectedPaths.main}`);
  }
  if (!actualPaths.back && shopifyUrls.back) {
    issues.push(`Back image missing: expected ${expectedPaths.back}`);
  }
  if (actualPaths.lifestyle.length === 0 && shopifyUrls.lifestyle.length > 0) {
    issues.push(`Lifestyle images missing: expected ${expectedPaths.lifestyle.join(', ')}`);
  }
  
  return {
    productSlug,
    colorName,
    expectedPaths,
    actualPaths,
    shopifyUrls,
    confidence,
    issues
  };
}

/**
 * Generate expected image paths for a color variant
 */
function generateExpectedPaths(productSlug: string, colorName: string): {
  main: string;
  back: string;
  lifestyle: string[];
} {
  const folderName = getFolderName(productSlug);
  const colorSlug = generateColorSlug(colorName, productSlug);
  const basePath = `/images/${folderName}/${colorSlug}`;
  
  return {
    main: `${basePath}-main.jpg`,
    back: `${basePath}-back.jpg`,
    lifestyle: [`${basePath}-lifestyle-1.jpg`]
  };
}

/**
 * Find corresponding Shopify URLs for a color variant
 */
function findShopifyUrls(
  shopifyImages: any[],
  variants: any[],
  colorName: string
): {
  main: string | null;
  back: string | null;
  lifestyle: string[];
} {
  const variantIds = variants.map(v => v.id);
  
  // Find images associated with these variants
  const variantImages = shopifyImages.filter(img => 
    img.variant_ids.some((id: number) => variantIds.includes(id))
  );
  
  // If no variant-specific images, use general product images
  const relevantImages = variantImages.length > 0 ? variantImages : shopifyImages;
  
  const urls = {
    main: null as string | null,
    back: null as string | null,
    lifestyle: [] as string[]
  };
  
  // Sort by position to get consistent ordering
  const sortedImages = relevantImages.sort((a, b) => a.position - b.position);
  
  for (const img of sortedImages) {
    const url = img.src;
    const isBack = url.toLowerCase().includes('back');
    const isLifestyle = !url.toLowerCase().includes('front') && !isBack;
    
    if (isBack && !urls.back) {
      urls.back = url;
    } else if (!isBack && !urls.main && !isLifestyle) {
      urls.main = url;
    } else if (isLifestyle) {
      urls.lifestyle.push(url);
    }
  }
  
  // If no main image found, use first available image
  if (!urls.main && sortedImages.length > 0) {
    urls.main = sortedImages[0].src;
  }
  
  return urls;
}

/**
 * Calculate confidence score for image mapping
 */
function calculateConfidence(
  expectedPaths: any,
  actualPaths: any,
  shopifyUrls: any
): number {
  let score = 0;
  let total = 0;
  
  // Main image
  total += 3; // Main image is most important
  if (actualPaths.main) score += 3;
  else if (shopifyUrls.main) score += 1; // Partial credit if Shopify URL exists
  
  // Back image
  total += 2;
  if (actualPaths.back) score += 2;
  else if (shopifyUrls.back) score += 1;
  
  // Lifestyle images
  total += 1;
  if (actualPaths.lifestyle.length > 0) score += 1;
  else if (shopifyUrls.lifestyle.length > 0) score += 0.5;
  
  return total > 0 ? score / total : 0;
}

/**
 * Get product variants from JSON file
 */
async function getProductVariants(productSlug: string): Promise<any[]> {
  try {
    const filePath = path.join(process.cwd(), 'src/data/products', `${productSlug}.json`);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const shopifyData = JSON.parse(fileContent);
    return shopifyData.product?.variants || [];
  } catch (error) {
    console.error(`Error loading variants for ${productSlug}:`, error);
    return [];
  }
}

/**
 * Group variants by color
 */
function groupVariantsByColor(variants: any[]): Map<string, any[]> {
  const groups = new Map<string, any[]>();
  
  for (const variant of variants) {
    const colorName = variant.option1 || 'Default';
    if (!groups.has(colorName)) {
      groups.set(colorName, []);
    }
    groups.get(colorName)!.push(variant);
  }
  
  return groups;
}

/**
 * Helper functions (same as in image-scanner.ts)
 */
function getFolderName(productSlug: string): string {
  const FOLDER_MAPPINGS: Record<string, string> = {
    'modern-arab-beanie-2': 'modernarab-beanie',
    'modern-arab-crewneck-sand': 'modernarab-crewneck-sand',
    'modern-arab-hoodie-2': 'modernarab-hoodie',
    'modernarab-tee-black': 'modernarab-tee-black',
    'modernarab-tee-white': 'modernarab-tee-white'
  };
  
  return FOLDER_MAPPINGS[productSlug] || productSlug;
}

function generateColorSlug(colorName: string, productSlug?: string): string {
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
    'beige': 'beige'
  };
  
  const PRODUCT_COLOR_MAPPINGS: Record<string, Record<string, string>> = {
    'modern-arab-joggers': {
      'black': 'faded-black',
      'olive-green': 'green'
    },
    'modern-arab-beanie-2': {
      'black': 'faded-black'
    },
    'modern-arab-sweatpants': {
      'light-green': 'green',
      'light-blue': 'blue',
      'light-black': 'faded-black',
      'dark-blue': 'blue'
    }
  };
  
  const baseSlug = colorName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  if (productSlug && PRODUCT_COLOR_MAPPINGS[productSlug]?.[baseSlug]) {
    return PRODUCT_COLOR_MAPPINGS[productSlug][baseSlug];
  }
  
  return COLOR_MAPPINGS[baseSlug] || baseSlug;
}