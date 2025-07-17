const fs = require('fs');
const path = require('path');
const { scanAvailableImages } = require('./image-audit-utils');

// Simple CommonJS version of the image matcher for testing
class ImageMatcher {
  constructor(availableImages) {
    this.availableImages = new Map();
    availableImages.forEach(img => {
      this.availableImages.set(img.path, img);
    });
  }
  
  async matchProductImages(productSlug) {
    const productData = await this.loadProductData(productSlug);
    if (!productData) {
      return [];
    }
    
    const variants = productData.product.variants || [];
    const shopifyImages = productData.product.images || [];
    
    // Group variants by color
    const colorGroups = this.groupVariantsByColor(variants);
    const results = [];
    
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
  
  async matchColorVariant(productSlug, colorName, variants, shopifyImages) {
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
  
  matchShopifyImages(shopifyImages, variantIds, colorName) {
    const matches = [];
    
    // First, find images specifically associated with these variants
    const variantSpecificImages = shopifyImages.filter(img =>
      img.variant_ids && img.variant_ids.some(id => variantIds.includes(id))
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
  
  matchLocalImages(productSlug, colorName) {
    const matches = [];
    const folderName = this.getFolderName(productSlug);
    const colorSlug = this.generateColorSlug(colorName, productSlug);
    
    // Expected paths
    const expectedPaths = [
      `/images/${folderName}/${colorSlug}-main.jpg`,
      `/images/${folderName}/${colorSlug}-back.jpg`,
      `/images/${folderName}/${colorSlug}-lifestyle-1.jpg`
    ];
    
    const imageTypes = ['main', 'back', 'lifestyle'];
    
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
    
    return matches;
  }
  
  generateMappingSuggestions(productSlug, colorName, shopifyMatches, localMatches) {
    const suggestions = [];
    
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
    
    // Suggest using Shopify URLs as fallback if no local images exist
    if (!hasLocalMain && !hasLocalBack && shopifyMatches.length > 0) {
      suggestions.push({
        action: 'use_shopify',
        description: `Use Shopify CDN URLs directly for ${colorName} (no local images found)`,
        priority: 'high'
      });
    }
    
    return suggestions;
  }
  
  classifyShopifyImageType(img, colorName) {
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
    
    // Default classification based on position
    if (img.position === 1) {
      return 'main';
    } else if (img.position === 2) {
      return 'back';
    } else {
      return 'lifestyle';
    }
  }
  
  calculateShopifyImageConfidence(img, variantIds, colorName) {
    let confidence = 0.5; // Base confidence
    
    // Higher confidence if image is associated with specific variants
    if (img.variant_ids && img.variant_ids.some(id => variantIds.includes(id))) {
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
  
  calculateMatchConfidence(shopifyMatches, localMatches) {
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
  
  async loadProductData(productSlug) {
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
  
  groupVariantsByColor(variants) {
    const groups = new Map();
    
    for (const variant of variants) {
      const colorName = variant.option1 || 'Default';
      if (!groups.has(colorName)) {
        groups.set(colorName, []);
      }
      groups.get(colorName).push(variant);
    }
    
    return groups;
  }
  
  getFolderName(productSlug) {
    const FOLDER_MAPPINGS = {
      'modern-arab-beanie-2': 'modernarab-beanie',
      'modern-arab-crewneck-sand': 'modernarab-crewneck-sand',
      'modern-arab-hoodie-2': 'modernarab-hoodie',
      'modernarab-tee-black': 'modernarab-tee-black',
      'modernarab-tee-white': 'modernarab-tee-white'
    };
    
    return FOLDER_MAPPINGS[productSlug] || productSlug;
  }
  
  generateColorSlug(colorName, productSlug) {
    const COLOR_MAPPINGS = {
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
    
    const PRODUCT_COLOR_MAPPINGS = {
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

async function testImageMatcher() {
  console.log('🔍 Testing Image Matcher...\n');
  
  try {
    // Load available images
    console.log('Loading available images...');
    const availableImages = await scanAvailableImages();
    
    // Create matcher
    const matcher = new ImageMatcher(availableImages);
    
    // Test with the joggers product (the one you mentioned)
    console.log('Testing with modern-arab-joggers...\n');
    const joggersResults = await matcher.matchProductImages('modern-arab-joggers');
    
    for (const result of joggersResults) {
      console.log(`🎨 Color: ${result.colorName}`);
      console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      
      console.log(`   Shopify Images (${result.shopifyImages.length}):`);
      result.shopifyImages.slice(0, 3).forEach(img => {
        console.log(`     ${img.imageType}: ${img.src.substring(0, 80)}... (confidence: ${(img.confidence * 100).toFixed(1)}%)`);
      });
      
      console.log(`   Local Images:`);
      result.localImages.forEach(img => {
        const status = img.exists ? '✅' : '❌';
        console.log(`     ${status} ${img.imageType}: ${img.path}`);
      });
      
      if (result.mappingSuggestions.length > 0) {
        console.log(`   Suggestions:`);
        result.mappingSuggestions.forEach(suggestion => {
          console.log(`     ${suggestion.priority.toUpperCase()}: ${suggestion.description}`);
          if (suggestion.shopifyUrl) {
            console.log(`       Shopify URL: ${suggestion.shopifyUrl.substring(0, 80)}...`);
          }
          if (suggestion.expectedLocalPath) {
            console.log(`       Expected Path: ${suggestion.expectedLocalPath}`);
          }
        });
      }
      
      console.log('');
    }
    
    // Test with a few more problematic products
    const testProducts = ['modern-arab-hoodie', 'modern-arab-crewneck-sand', 'modernarab-tee-black'];
    
    for (const productSlug of testProducts) {
      console.log(`\n📦 Testing ${productSlug}...`);
      const results = await matcher.matchProductImages(productSlug);
      
      let totalSuggestions = 0;
      let highPrioritySuggestions = 0;
      
      for (const result of results) {
        totalSuggestions += result.mappingSuggestions.length;
        highPrioritySuggestions += result.mappingSuggestions.filter(s => s.priority === 'high').length;
      }
      
      console.log(`   Colors: ${results.length}`);
      console.log(`   Total Suggestions: ${totalSuggestions}`);
      console.log(`   High Priority: ${highPrioritySuggestions}`);
      
      // Show first high priority suggestion
      const firstHighPriority = results
        .flatMap(r => r.mappingSuggestions)
        .find(s => s.priority === 'high');
      
      if (firstHighPriority) {
        console.log(`   Example: ${firstHighPriority.description}`);
      }
    }
    
    console.log('\n✅ Image matcher test complete!');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testImageMatcher();
}

module.exports = { ImageMatcher, testImageMatcher };