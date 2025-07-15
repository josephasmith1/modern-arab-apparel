import { Product, ProductColor, ProductVariant } from '@/data/products';

// Shopify interfaces
interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  template_suffix: string | null;
  published_scope: string;
  tags: string;
  variants: ShopifyVariant[];
  options: ShopifyOption[];
  images: ShopifyImage[];
  image: ShopifyImage;
}

interface ShopifyVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  compare_at_price: string;
  fulfillment_service: string;
  inventory_management: string;
  option1: string;
  option2: string | null;
  option3: string | null;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: string | null;
  grams: number;
  image_id: number | null;
  weight: number;
  weight_unit: string;
  requires_shipping: boolean;
  price_currency: string;
  compare_at_price_currency: string;
}

interface ShopifyOption {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

interface ShopifyImage {
  id: number;
  product_id: number;
  position: number;
  created_at: string;
  updated_at: string;
  alt: string | null;
  width: number;
  height: number;
  src: string;
  variant_ids: number[];
}

interface ShopifyProductWrapper {
  product: ShopifyProduct;
}

// Color mappings
const COLOR_HEX_MAP: Record<string, string> = {
  'faded bone': '#F5F5DC',
  'faded green': '#8FBC8F',
  'faded eucalyptus': '#8FBC8F',
  'faded khaki': '#BDB76B',
  'faded black': '#2F2F2F',
  'black': '#000000',
  'white': '#FFFFFF',
  'blue': '#4169E1',
  'beige': '#F5E9D0',
  'olive': '#808000',
  'olive green': '#808000',
  'sand': '#C2B280',
  'grey': '#808080',
  'gray': '#808080',
  'red': '#FF0000',
  'navy': '#000080',
  'brown': '#8B4513',
  'green': '#008000',
  'pink': '#FFC0CB',
  'purple': '#800080',
  'orange': '#FFA500',
  'yellow': '#FFFF00',
  'charcoal': '#36454F',
  'cream': '#FFFDD0',
  'maroon': '#800000',
  'teal': '#008080',
  'indigo': '#4B0082',
  'turquoise': '#40E0D0',
  'coral': '#FF7F50',
  'mint': '#3EB489',
  'lavender': '#E6E6FA',
  'rose': '#FF007F',
  'gold': '#FFD700',
  'silver': '#C0C0C0',
  'bronze': '#CD7F32',
  'copper': '#B87333',
  'peach': '#FFE5B4',
  'salmon': '#FA8072',
  'plum': '#DDA0DD',
  'rust': '#B7410E',
  'mustard': '#FFDB58',
  'emerald': '#50C878',
  'sapphire': '#0F52BA',
  'ruby': '#E0115F',
  'amber': '#FFBF00',
  'jade': '#00A86B',
  'onyx': '#353839',
  'pearl': '#F8F8FF',
  'ivory': '#FFFFF0',
  'mahogany': '#C04000',
  'burgundy': '#800020',
  'mauve': '#E0B0FF',
  'taupe': '#483C32',
  'slate': '#708090',
  'ash': '#B2BEB5',
  'smoke': '#738276',
  'fog': '#F0F0F0',
  'mist': '#F5F5F5',
  'shadow': '#8B8989',
  'dust': '#B8A99A',
  'stone': '#ADA485',
  'pebble': '#C9C0BB',
  'clay': '#B66A3C',
  'brick': '#CB4154',
  'rust red': '#AA4A44',
  'burnt orange': '#CC5500',
  'forest green': '#228B22',
  'sky blue': '#87CEEB',
  'royal blue': '#4169E1',
  'midnight blue': '#191970',
  'deep purple': '#673AB7',
  'hot pink': '#FF69B4',
  'lime green': '#32CD32',
  'electric blue': '#7DF9FF',
  'neon green': '#39FF14',
  'pastel pink': '#FFD1DC',
  'pastel blue': '#AEC6CF',
  'pastel yellow': '#FDFD96',
  'pastel green': '#77DD77',
  'pastel purple': '#B19CD9',
  'dark grey': '#A9A9A9',
  'dark gray': '#A9A9A9',
  'light grey': '#D3D3D3',
  'light gray': '#D3D3D3',
  'dark green': '#006400',
  'light green': '#90EE90',
  'dark blue': '#00008B',
  'light blue': '#ADD8E6',
  'dark red': '#8B0000',
  'light red': '#FFA07A',
  'dark brown': '#654321',
  'light brown': '#A0522D',
  'off white': '#FAF9F6',
  'eggshell': '#F0EAD6',
  'vanilla': '#F3E5AB',
  'linen': '#FAF0E6',
  'khaki': '#C3B091',
  'tan': '#D2B48C',
  'camel': '#C19A6B',
  'mocha': '#967969',
  'chocolate': '#7B3F00',
  'coffee': '#6F4E37',
  'espresso': '#4E3B31',
  'walnut': '#5D4E37',
  'chestnut': '#954535',
  'sienna': '#A0522D',
  'umber': '#635147',
  'ochre': '#CC7722',
  'sepia': '#704214',
  'crimson': '#DC143C',
  'scarlet': '#FF2400',
  'vermillion': '#E34234',
  'cardinal': '#C41E3A',
  'cherry': '#DE3163',
  'raspberry': '#E30B5D',
  'strawberry': '#FC5A8D',
  'blush': '#F5B7B1',
  'fuchsia': '#FF00FF',
  'magenta': '#FF00FF',
  'violet': '#EE82EE',
  'orchid': '#DA70D6',
  'lilac': '#C8A2C8',
  'periwinkle': '#CCCCFF',
  'aqua': '#00FFFF',
  'cyan': '#00FFFF',
  'seafoam': '#93E9BE',
  'cerulean': '#007BA7',
  'cobalt': '#0047AB',
  'azure': '#007FFF',
  'denim': '#1560BD',
  'steel blue': '#4682B4',
  'powder blue': '#B0E0E6',
  'baby blue': '#89CFF0',
  'robin egg': '#00CCCC',
  'sage': '#87A96B',
  'olive drab': '#6B8E23',
  'moss': '#8A9A5B',
  'fern': '#4F7942',
  'pine': '#01796F',
  'spruce': '#4A5D23',
  'evergreen': '#05472A',
  'shamrock': '#009E60',
  'kelly green': '#4CBB17',
  'grass': '#7CFC00',
  'chartreuse': '#7FFF00',
  'lime': '#00FF00',
  'citrus': '#9FB70A',
  'lemon': '#FFF700',
  'butter': '#FFF8DC',
  'honey': '#FFB30F',
  'blonde': '#FBF0BE',
  'wheat': '#F5DEB3',
  'sand dollar': '#C5B783',
  'champagne': '#F7E7CE',
  'nude': '#E1BC9E',
  'buff': '#F0DC82',
  'bisque': '#FFE4C4',
  'apricot': '#FBCEB1',
  'cantaloupe': '#FFA07A',
  'tangerine': '#F28500',
  'clementine': '#FFA600',
  'papaya': '#FFEFD5',
  'mango': '#FDBE02',
  'saffron': '#F4C430',
  'turmeric': '#E3D026',
  'ginger': '#BC9A6A',
  'cinnamon': '#D27D2D',
  'nutmeg': '#AF6E4E',
  'paprika': '#E25E3E',
  'cayenne': '#CE1620',
  'chili': '#C21807',
  'terracotta': '#E2725B',
  'clay pot': '#CC6633',
  'adobe': '#BD6330',
  'burnt sienna': '#E97451',
  'raw sienna': '#D68A59',
  'cadmium': '#FFC600'
};

// Normalize color names for matching
function normalizeColorName(color: string): string {
  return color.toLowerCase().trim().replace(/\s+/g, ' ');
}

// Get hex color from name
function getHexColor(colorName: string): string {
  const normalized = normalizeColorName(colorName);
  return COLOR_HEX_MAP[normalized] || '#808080'; // Default to gray if not found
}

// Extract description from HTML
function extractDescription(html: string): string {
  if (!html) return '';
  
  // Remove HTML tags and get first paragraph
  const textContent = html.replace(/<[^>]*>/g, ' ').trim();
  const firstParagraph = textContent.split(/\n\n/)[0];
  
  // Truncate to reasonable length for description
  const maxLength = 200;
  if (firstParagraph.length > maxLength) {
    return firstParagraph.substring(0, maxLength).trim() + '...';
  }
  
  return firstParagraph;
}

// Extract features from HTML
function extractFeatures(html: string): string[] {
  if (!html) return [];
  
  const features: string[] = [];
  
  // Look for bullet points with specific markers
  const bulletRegex = /[•●]\s*([^•●\n]+)/g;
  let match;
  while ((match = bulletRegex.exec(html)) !== null) {
    const feature = match[1].trim();
    if (feature && !feature.includes('Size guide')) {
      features.push(feature);
    }
  }
  
  // Also look for features in lists
  const listItemRegex = /<li>([^<]+)<\/li>/g;
  while ((match = listItemRegex.exec(html)) !== null) {
    const feature = match[1].trim();
    if (feature && !features.includes(feature) && !feature.includes('inches') && !feature.includes('cm')) {
      features.push(feature);
    }
  }
  
  return features.slice(0, 10); // Limit to 10 features
}

// Extract specifications from HTML
function extractSpecifications(html: string): string[] {
  if (!html) return [];
  
  const specs: string[] = [];
  
  // Look for material/fabric specifications
  const materialRegex = /(\d+%\s+\w+)/g;
  let match;
  while ((match = materialRegex.exec(html)) !== null) {
    specs.push(match[1]);
  }
  
  // Look for weight specifications
  const weightRegex = /(\d+(?:\.\d+)?\s*oz\.?\s*\/?\s*yd\.?\s*²?|\d+\s*g\/m²)/gi;
  while ((match = weightRegex.exec(html)) !== null) {
    if (!specs.includes(match[1])) {
      specs.push(`Fabric weight: ${match[1]}`);
    }
  }
  
  return specs;
}

// Extract origin information
function extractOrigin(html: string): string[] {
  if (!html) return [];
  
  const origin: string[] = [];
  
  // Look for sourcing/origin information
  const patterns = [
    /sourced from ([^,.]+)/gi,
    /made in ([^,.]+)/gi,
    /designed in ([^,.]+)/gi,
    /printed in ([^,.]+)/gi,
    /manufactured in ([^,.]+)/gi
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(html)) !== null) {
      const location = match[1].trim();
      if (location && !origin.includes(location)) {
        origin.push(location);
      }
    }
  });
  
  return origin;
}

// Extract care instructions
function extractCareInstructions(html: string): string[] {
  if (!html) return [];
  
  const care: string[] = [];
  
  // Common care instruction patterns
  const patterns = [
    /machine wash/gi,
    /hand wash/gi,
    /dry clean/gi,
    /do not bleach/gi,
    /tumble dry/gi,
    /iron/gi,
    /do not iron/gi,
    /wash cold/gi,
    /wash warm/gi,
    /lay flat to dry/gi,
    /hang dry/gi,
    /do not wring/gi
  ];
  
  patterns.forEach(pattern => {
    if (pattern.test(html)) {
      care.push(pattern.source.replace(/\\/g, ''));
    }
  });
  
  return care;
}

// Generate image path
function generateImagePath(slug: string, colorName: string, imageType: 'main' | 'back' | 'lifestyle', index?: number): string {
  const normalizedColor = normalizeColorName(colorName).replace(/\s+/g, '-');
  
  if (imageType === 'lifestyle' && index !== undefined) {
    return `/images/${slug}/${normalizedColor}-lifestyle-${index + 1}.jpg`;
  }
  
  return `/images/${slug}/${normalizedColor}-${imageType}.jpg`;
}

// Group variants by color
function groupVariantsByColor(variants: ShopifyVariant[]): Map<string, ShopifyVariant[]> {
  const colorMap = new Map<string, ShopifyVariant[]>();
  
  variants.forEach(variant => {
    const colorName = variant.option1 || 'Default';
    if (!colorMap.has(colorName)) {
      colorMap.set(colorName, []);
    }
    colorMap.get(colorName)!.push(variant);
  });
  
  return colorMap;
}

// Get unique sizes from variants
function extractSizes(variants: ShopifyVariant[]): string[] {
  const sizes = new Set<string>();
  
  variants.forEach(variant => {
    if (variant.option2) {
      sizes.add(variant.option2);
    }
  });
  
  // Sort sizes in standard order
  const sizeOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
  return Array.from(sizes).sort((a, b) => {
    const aIndex = sizeOrder.indexOf(a);
    const bIndex = sizeOrder.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });
}

// Transform Shopify product to app Product
export function transformShopifyProduct(shopifyData: ShopifyProductWrapper | ShopifyProduct): Product {
  // Handle both wrapper and direct product formats
  const product = 'product' in shopifyData ? shopifyData.product : shopifyData;
  
  // Extract basic fields
  const slug = product.handle || '';
  const name = product.title || 'Untitled Product';
  const vendor = product.vendor || 'Unknown Vendor';
  const collection = product.product_type || 'General';
  const tags = product.tags ? product.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
  
  // Extract description and full description
  const fullDescription = product.body_html || '';
  const description = extractDescription(fullDescription);
  
  // Extract additional information
  const features = extractFeatures(fullDescription);
  const specifications = extractSpecifications(fullDescription);
  const origin = extractOrigin(fullDescription);
  const careInstructions = extractCareInstructions(fullDescription);
  
  // Group variants by color
  const colorGroups = groupVariantsByColor(product.variants || []);
  
  // Extract all unique sizes
  const sizes = extractSizes(product.variants || []);
  
  // Find min and max prices
  let minPrice = Infinity;
  let maxPrice = 0;
  let hasComparePrice = false;
  let comparePrice = '';
  
  (product.variants || []).forEach(variant => {
    const price = parseFloat(variant.price);
    if (price < minPrice) minPrice = price;
    if (price > maxPrice) maxPrice = price;
    if (variant.compare_at_price && !hasComparePrice) {
      hasComparePrice = true;
      comparePrice = variant.compare_at_price;
    }
  });
  
  // Format price
  const price = minPrice === maxPrice ? `$${minPrice.toFixed(2)}` : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
  const originalPrice = hasComparePrice ? `$${comparePrice}` : '';
  
  // Transform colors
  const colors: ProductColor[] = Array.from(colorGroups.entries()).map(([colorName, colorVariants]) => {
    // Find images associated with this color's variants
    const variantIds = colorVariants.map(v => v.id);
    const colorImages = (product.images || []).filter(img => 
      img.variant_ids.some(id => variantIds.includes(id))
    );
    
    // Generate lifestyle images (assume up to 4 lifestyle shots)
    const lifestyleImages: string[] = [];
    for (let i = 0; i < Math.min(colorImages.length, 4); i++) {
      lifestyleImages.push(generateImagePath(slug, colorName, 'lifestyle', i));
    }
    
    // If no lifestyle images, add at least one
    if (lifestyleImages.length === 0) {
      lifestyleImages.push(generateImagePath(slug, colorName, 'lifestyle', 0));
    }
    
    // Transform variants for this color
    const variants: ProductVariant[] = colorVariants.map(variant => ({
      size: variant.option2 || '',
      price: parseFloat(variant.price),
      sku: variant.sku || '',
      available: true // Shopify doesn't provide availability in this format
    }));
    
    return {
      name: colorName,
      swatch: '', // Would need additional mapping
      hex: getHexColor(colorName),
      images: {
        main: generateImagePath(slug, colorName, 'main'),
        back: generateImagePath(slug, colorName, 'back'),
        lifestyle: lifestyleImages
      },
      variants
    };
  });
  
  // If no colors found, create a default one
  if (colors.length === 0) {
    colors.push({
      name: 'Default',
      swatch: '',
      hex: '#808080',
      images: {
        main: generateImagePath(slug, 'default', 'main'),
        back: generateImagePath(slug, 'default', 'back'),
        lifestyle: [generateImagePath(slug, 'default', 'lifestyle', 0)]
      },
      variants: [{
        size: '',
        price: minPrice || 0,
        sku: product.variants?.[0]?.sku || '',
        available: true
      }]
    });
  }
  
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
}

// Transform multiple products
export function transformShopifyProducts(shopifyProducts: (ShopifyProductWrapper | ShopifyProduct)[]): Product[] {
  return shopifyProducts.map(transformShopifyProduct);
}

// Load and transform from JSON file
export async function loadAndTransformShopifyProduct(filePath: string): Promise<Product> {
  const fs = await import('fs/promises');
  const content = await fs.readFile(filePath, 'utf-8');
  const shopifyData = JSON.parse(content);
  return transformShopifyProduct(shopifyData);
}

// Load and transform multiple products from directory
export async function loadAndTransformShopifyProducts(dirPath: string): Promise<Product[]> {
  const fs = await import('fs/promises');
  const path = await import('path');
  
  const files = await fs.readdir(dirPath);
  const jsonFiles = files.filter(file => file.endsWith('.json'));
  
  const products = await Promise.all(
    jsonFiles.map(async file => {
      const filePath = path.join(dirPath, file);
      return loadAndTransformShopifyProduct(filePath);
    })
  );
  
  return products;
}