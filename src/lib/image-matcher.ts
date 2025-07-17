import fs from 'fs';
import path from 'path';
import { ImageMetadata } from './image-scanner';

export interface ImageMatchResult {
  productSlug: string;
  colorName: string;
  shopifyImages: ShopifyImageMatch[];
  localImages: LocalImageMatch[];
  mappingSuggestions: ImageMappingSuggestion[];
  confidence: number;
}

export interface ShopifyImageMatch {
  id: number;
  src: string;
  alt: string | null;
  position: number;
  variant_ids: number[];
  imageType: 'main' | 'back' | 'lifestyle';
  confidence: number;
}

export interface LocalImageMatch {
  path: string;
  imageType: 'main' | 'back' | 'lifestyle';
  exists: boolean;
  confidence: number;
}

export interface ImageMappingSuggestion {
  action: 'use_shopify' | 'download_missing' | 'fix_path' | 'create_fallback';
  description: string;
  shopifyUrl?: string;
  expectedLocalPath?: string;
  actualLocalPath?: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Intelligent image matcher that analyzes Shopify images and local images
 * to create optimal mappings for product variants
 */
export class ImageMatcher {
  private availableImages: Map<string, ImageMetadata>;
  
  constructor(availableImages: ImageMetadata[]) {
    this.availableImages = new Map();
    availableImages.forEach(img => {
      this.availableImages.set(img.path, img);
    });
  }
  
  /**
   * Match images for a specific product
   */
  async matchProductImages(productSlug: string): Promise<ImageMatchResult[]> {
    const productData = await this.loadProductData(productSlug);
    if (!productData) {
      return [];
    }
    
    const variants = productData.product.variants || [];
    const shopifyImages = productData.product.images || [];
    
    // Group variants by color
    const colorGroups = this.groupVariantsByColor(variants);
    const results: ImageMatchResult[] = [];
    
    for (const [colorName, colorVariants] of colorGroups) {
      const result = await this.matchColorVariant(
        productSlug,
        colorName,
        colorVariants,
        shopifyImages
      );
      results.push(result);
    }
    
    return results;
  }
  
  /**
   * Match images for a specific color variant
   */
  private async matchColorVariant(
    productSlug: string,
    colorName: string,
    variants: any[],
    shopifyImages: any[]
  ): Promise<ImageMatchResult> {
    // Find Shopify images for this color variant
    const variantIds = variants.map(v => v.id);
    const shopifyMatches = this.matchShopifyImages(shopifyImages, variantIds, colorName);
    
    // Find local images for this color variant
    const localMatches = this.matchLocalImages(productSlug, colorName);
    
    // Generate mapping suggestions
    const mappingSuggestions = this.generateMappingSuggestions(
      productSlug,
      colorName,
      shopifyMatches,
      localMatches
    );
    
    // Calculate overall confidence
    const confidence = this.calculateMatchConfidence(shopifyMatches, localMatches);
    
    return {
      productSlug,
      colorName,
      shopifyImages: shopifyMatches,
      localImages: localMatches,
      mappingSuggestions,
      confidence
    };
  }
  
  /**
   * Match Shopify images to a color variant
   */
  private matchShopifyImages(
    shopifyImages: any[],
    variantIds: number[],
    colorName: string
  ): ShopifyImageMatch[] {
    const matches: ShopifyImageMatch[] = [];
    
    // First, find images specifically associated with these variants
    const variantSpecificImages = shopifyImages.filter(img =>
      img.variant_ids && img.variant_ids.some((id: number) => variantIds.includes(id))
    );
    
    // If no variant-specific images, use general product images
    const relevantImages = variantSpecificImages.length > 0 ? variantSpecificImages : shopifyImages;
    
    for (const img of relevantImages) {
      const imageType = this.classifyShopifyImageType(img, colorName);
      const confidence = this.calculateShopifyImageConfidence(img, variantIds, colorName);
      
      matches.push({
        id: img.id,
        src: img.src,
        alt: img.alt,
        position: img.position,
        variant_ids: img.variant_ids || [],
        imageType,
        confidence
      });
    }
    
    // Sort by confidence and position
    matches.sort((a, b) => {
      if (a.confidence !== b.confidence) {
        return b.confidence - a.confidence;
      }
      return a.position - b.position;
    });
    
    return matches;
  }
  
  /**
   * Match local images to a color variant
   */
  private matchLocalImages(productSlug: string, colorName: string): LocalImageMatch[] {
    const matches: LocalImageMatch[] = [];
    const folderName = this.getFolderName(productSlug);
    const colorSlug = this.generateColorSlug(colorName, productSlug);
    
    // Expected paths
    const expectedPaths = [
      `/images/${folderName}/${colorSlug}-main.jpg`,
      `/images/${folderName}/${colorSlug}-back.jpg`,
      `/images/${folderName}/${colorSlug}-lifestyle-1.jpg`
    ];
    
    const imageTypes: ('main' | 'back' | 'lifestyle')[] = ['main', 'back', 'lifestyle'];
    
    expectedPaths.forEach((expectedPath, index) => {
      const exists = this.availableImages.has(expectedPath);
      const confidence = exists ? 1.0 : 0.0;
      
      matches.push({
        path: expectedPath,
        imageType: imageTypes[index],
        exists,
        confidence
      });
    });
    
    // Also check for alternative paths that might exist
    const alternativePaths = this.findAlternativeLocalPaths(productSlug, colorName);
    alternativePaths.forEach(altPath => {
      if (this.availableImages.has(altPath.path) && !matches.find(m => m.path === altPath.path)) {
        matches.push({
          path: altPath.path,
          imageType: altPath.imageType,
          exists: true,
          confidence: 0.8 // Lower confidence for alternative paths
        });
      }
    });
    
    return matches;
  }
  
  /**
   * Generate mapping suggestions for fixing image issues
   */
  private generateMappingSuggestions(
    productSlug: string,
    colorName: string,
    shopifyMatches: ShopifyImageMatch[],
    localMatches: LocalImageMatch[]
  ): ImageMappingSuggestion[] {
    const suggestions: ImageMappingSuggestion[] = [];
    
    // Check for missing main image
    const hasLocalMain = localMatches.some(m => m.imageType === 'main' && m.exists);
    const hasShopifyMain = shopifyMatches.some(m => m.imageType === 'main');
    
    if (!hasLocalMain && hasShopifyMain) {
      const shopifyMain = shopifyMatches.find(m => m.imageType === 'main');
      const expectedLocalPath = localMatches.find(m => m.imageType === 'main')?.path;
      
      suggestions.push({
        action: 'download_missing',
        description: `Download main image for ${colorName}`,
        shopifyUrl: shopifyMain?.src,
        expectedLocalPath,
        priority: 'high'
      });
    }
    
    // Check for missing back image
    const hasLocalBack = localMatches.some(m => m.imageType === 'back' && m.exists);
    const hasShopifyBack = shopifyMatches.some(m => m.imageType === 'back');
    
    if (!hasLocalBack && hasShopifyBack) {
      const shopifyBack = shopifyMatches.find(m => m.imageType === 'back');
      const expectedLocalPath = localMatches.find(m => m.imageType === 'back')?.path;
      
      suggestions.push({
        action: 'download_missing',
        description: `Download back image for ${colorName}`,
        shopifyUrl: shopifyBack?.src,
        expectedLocalPath,
        priority: 'medium'
      });
    }
    
    // Check for missing lifestyle images
    const hasLocalLifestyle = localMatches.some(m => m.imageType === 'lifestyle' && m.exists);
    const hasShopifyLifestyle = shopifyMatches.some(m => m.imageType === 'lifestyle');
    
    if (!hasLocalLifestyle && hasShopifyLifestyle) {
      const shopifyLifestyle = shopifyMatches.filter(m => m.imageType === 'lifestyle');
      const expectedLocalPath = localMatches.find(m => m.imageType === 'lifestyle')?.path;
      
      suggestions.push({
        action: 'download_missing',
        description: `Download lifestyle images for ${colorName}`,
        shopifyUrl: shopifyLifestyle[0]?.src,
        expectedLocalPath,
        priority: 'low'
      });
    }
    
    // Suggest using Shopify URLs as fallback if no local images exist
    if (!hasLocalMain && !hasLocalBack && !hasLocalLifestyle && shopifyMatches.length > 0) {
      suggestions.push({
        action: 'use_shopify',
        description: `Use Shopify CDN URLs directly for ${colorName} (no local images found)`,
        priority: 'high'
      });
    }
    
    return suggestions;
  }
  
  /**
   * Classify Shopify image type based on URL and metadata
   */
  private classifyShopifyImageType(img: any, colorName: string): 'main' | 'back' | 'lifestyle' {
    const url = img.src.toLowerCase();
    const alt = (img.alt || '').toLowerCase();
    
    // Check for back image indicators
    if (url.includes('back') || alt.includes('back')) {
      return 'back';
    }
    
    // Check for front/main image indicators
    if (url.includes('front') || url.includes('main') || alt.includes('front') || alt.includes('main')) {
      return 'main';
    }
    
    // Check for lifestyle indicators
    if (url.includes('lifestyle') || alt.includes('lifestyle') || 
        url.includes('model') || alt.includes('model')) {
      return 'lifestyle';
    }
    
    // Default classification based on position
    if (img.position === 1) {
      return 'main';
    } else if (img.position === 2) {
      return 'back';
    } else {
      return 'lifestyle';
    }
  }
  
  /**
   * Calculate confidence score for Shopify image match
   */
  private calculateShopifyImageConfidence(img: any, variantIds: number[], colorName: string): number {
    let confidence = 0.5; // Base confidence
    
    // Higher confidence if image is associated with specific variants
    if (img.variant_ids && img.variant_ids.some((id: number) => variantIds.includes(id))) {
      confidence += 0.3;
    }
    
    // Higher confidence if URL contains color name
    const url = img.src.toLowerCase();
    const colorSlug = colorName.toLowerCase().replace(/\s+/g, '-');
    if (url.includes(colorSlug)) {
      confidence += 0.2;
    }
    
    // Higher confidence for lower position numbers (primary images)
    if (img.position <= 3) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }
  
  /**
   * Calculate overall match confidence
   */
  private calculateMatchConfidence(
    shopifyMatches: ShopifyImageMatch[],
    localMatches: LocalImageMatch[]
  ): number {
    const totalPossible = 3; // main, back, lifestyle
    let score = 0;
    
    // Score for having main image
    const hasMain = localMatches.some(m => m.imageType === 'main' && m.exists) ||
                   shopifyMatches.some(m => m.imageType === 'main');
    if (hasMain) score += 1;
    
    // Score for having back image
    const hasBack = localMatches.some(m => m.imageType === 'back' && m.exists) ||
                   shopifyMatches.some(m => m.imageType === 'back');
    if (hasBack) score += 0.5;
    
    // Score for having lifestyle image
    const hasLifestyle = localMatches.some(m => m.imageType === 'lifestyle' && m.exists) ||
                        shopifyMatches.some(m => m.imageType === 'lifestyle');
    if (hasLifestyle) score += 0.5;
    
    return score / totalPossible;
  }
  
  /**
   * Find alternative local paths that might exist
   */
  private findAlternativeLocalPaths(productSlug: string, colorName: string): Array<{path: string, imageType: 'main' | 'back' | 'lifestyle'}> {
    const alternatives: Array<{path: string, imageType: 'main' | 'back' | 'lifestyle'}> = [];
    const folderName = this.getFolderName(productSlug);
    
    // Try different color slug variations
    const colorVariations = this.getColorSlugVariations(colorName, productSlug);
    
    for (const colorSlug of colorVariations) {
      const basePath = `/images/${folderName}/${colorSlug}`;
      
      // Check different file extensions
      const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const types = ['main', 'back', 'lifestyle-1'];
      
      for (const ext of extensions) {
        for (const type of types) {
          const path = `${basePath}-${type}${ext}`;
          const imageType = type.startsWith('lifestyle') ? 'lifestyle' : type as 'main' | 'back';
          alternatives.push({ path, imageType });
        }
      }
    }
    
    return alternatives;
  }
  
  /**
   * Get color slug variations to try
   */
  private getColorSlugVariations(colorName: string, productSlug: string): string[] {
    const variations = new Set<string>();
    
    // Add the standard generated slug
    variations.add(this.generateColorSlug(colorName, productSlug));
    
    // Add the raw color name as slug
    const rawSlug = colorName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    variations.add(rawSlug);
    
    // Add common variations
    const commonMappings: Record<string, string[]> = {
      'olive-green': ['green', 'olive', 'military-green'],
      'faded-black': ['black', 'vintage-black'],
      'faded-bone': ['bone', 'sand', 'cream'],
      'light-green': ['green'],
      'light-blue': ['blue'],
      'dark-blue': ['blue', 'navy']
    };
    
    if (commonMappings[rawSlug]) {
      commonMappings[rawSlug].forEach(v => variations.add(v));
    }
    
    return Array.from(variations);
  }
  
  /**
   * Load product data from JSON file
   */
  private async loadProductData(productSlug: string): Promise<any | null> {
    try {
      const filePath = path.join(process.cwd(), 'src/data/products', `${productSlug}.json`);
      if (!fs.existsSync(filePath)) {
        return null;
      }
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error(`Error loading product data for ${productSlug}:`, error);
      return null;
    }
  }
  
  /**
   * Group variants by color
   */
  private groupVariantsByColor(variants: any[]): Map<string, any[]> {
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
   * Helper functions (same as in other files)
   */
  private getFolderName(productSlug: string): string {
    const FOLDER_MAPPINGS: Record<string, string> = {
      'modern-arab-beanie-2': 'modernarab-beanie',
      'modern-arab-crewneck-sand': 'modernarab-crewneck-sand',
      'modern-arab-hoodie-2': 'modernarab-hoodie',
      'modernarab-tee-black': 'modernarab-tee-black',
      'modernarab-tee-white': 'modernarab-tee-white'
    };
    
    return FOLDER_MAPPINGS[productSlug] || productSlug;
  }
  
  private generateColorSlug(colorName: string, productSlug?: string): string {
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
}