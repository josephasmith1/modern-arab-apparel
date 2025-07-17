/**
 * Color extraction utility for product images
 * Implements caching and batch processing for performance
 */

import { ProductColor } from '@/data/products/types';

// Cache for extracted colors to avoid repeated API calls
const colorCache = new Map<string, string>();

// Queue for batch processing
interface ColorExtractionJob {
  imageUrl: string;
  colorName: string;
  resolve: (color: string) => void;
  reject: (error: any) => void;
}

let extractionQueue: ColorExtractionJob[] = [];
let isProcessing = false;

/**
 * Extract color from image URL with caching and rate limiting
 */
export async function extractColorFromImage(imageUrl: string, colorName: string): Promise<string> {
  // Check cache first
  const cacheKey = `${colorName}-${imageUrl}`;
  if (colorCache.has(cacheKey)) {
    console.log(`Using cached color for ${colorName}`);
    return colorCache.get(cacheKey)!;
  }

  // Return a promise that will be resolved when the job is processed
  return new Promise((resolve, reject) => {
    extractionQueue.push({
      imageUrl,
      colorName,
      resolve,
      reject
    });
    
    // Start processing if not already running
    if (!isProcessing) {
      processExtractionQueue();
    }
  });
}

/**
 * Process the extraction queue with rate limiting (max 3 concurrent)
 */
async function processExtractionQueue() {
  if (isProcessing || extractionQueue.length === 0) {
    return;
  }
  
  isProcessing = true;
  
  try {
    // Process up to 3 jobs concurrently
    while (extractionQueue.length > 0) {
      const batch = extractionQueue.splice(0, 3);
      
      await Promise.all(
        batch.map(async (job) => {
          try {
            const color = await fetchColorFromAPI(job.imageUrl);
            const cacheKey = `${job.colorName}-${job.imageUrl}`;
            colorCache.set(cacheKey, color);
            job.resolve(color);
          } catch (error) {
            console.error(`Failed to extract color for ${job.colorName}:`, error);
            // Fallback to a reasonable default based on color name
            const fallbackColor = getFallbackColor(job.colorName);
            job.resolve(fallbackColor);
          }
        })
      );
      
      // Small delay between batches to avoid overwhelming the API
      if (extractionQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  } finally {
    isProcessing = false;
  }
}

/**
 * Fetch color from the extraction API
 */
async function fetchColorFromAPI(imageUrl: string): Promise<string> {
  try {
    // Use the existing API endpoint
    const response = await fetch(`/api/extract-color?imageUrl=${encodeURIComponent(imageUrl)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    return data.color || 'rgb(128, 128, 128)';
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

/**
 * Get a reasonable fallback color based on the color name
 */
function getFallbackColor(colorName: string): string {
  const colorMap: Record<string, string> = {
    'black': 'rgb(0, 0, 0)',
    'white': 'rgb(255, 255, 255)',
    'blue': 'rgb(65, 105, 225)',
    'sky blue': 'rgb(135, 206, 235)',
    'navy': 'rgb(0, 0, 128)',
    'dark blue': 'rgb(0, 0, 139)',
    'red': 'rgb(255, 0, 0)',
    'green': 'rgb(0, 128, 0)',
    'forest green': 'rgb(34, 139, 34)',
    'olive': 'rgb(128, 128, 0)',
    'olive green': 'rgb(107, 142, 35)',
    'gray': 'rgb(128, 128, 128)',
    'grey': 'rgb(128, 128, 128)',
    'brown': 'rgb(165, 42, 42)',
    'beige': 'rgb(245, 245, 220)',
    'cream': 'rgb(255, 253, 208)',
    'pink': 'rgb(255, 192, 203)',
    'purple': 'rgb(128, 0, 128)',
    'orange': 'rgb(255, 165, 0)',
    'yellow': 'rgb(255, 255, 0)',
    'gold': 'rgb(255, 215, 0)',
    'silver': 'rgb(192, 192, 192)',
    'maroon': 'rgb(128, 0, 0)',
    'faded bone': 'rgb(245, 245, 220)',
    'faded green': 'rgb(143, 188, 143)',
    'faded eucalyptus': 'rgb(143, 188, 143)',
    'faded khaki': 'rgb(189, 183, 107)',
    'faded  khaki': 'rgb(189, 183, 107)',
    'faded black': 'rgb(47, 47, 47)',
    'khaki': 'rgb(195, 176, 145)',
    'bone': 'rgb(245, 245, 220)',
    'sand': 'rgb(210, 180, 140)',
    'faded sand': 'rgb(210, 180, 140)',
    'heather dust': 'rgb(211, 211, 211)',
    'natural': 'rgb(255, 248, 220)',
    'military green': 'rgb(78, 91, 49)',
    'vintage black': 'rgb(43, 43, 43)'
  };
  
  return colorMap[colorName.toLowerCase()] || 'rgb(128, 128, 128)';
}

/**
 * Extract colors for all color variants of a product
 * Used during build time or server-side rendering
 */
export async function extractColorsForProduct(colors: ProductColor[]): Promise<ProductColor[]> {
  console.log(`Extracting colors for ${colors.length} variants`);
  
  // Process all colors with rate limiting
  const updatedColors = await Promise.all(
    colors.map(async (color) => {
      if (color.images.main) {
        try {
          const extractedColor = await extractColorFromImage(color.images.main, color.name);
          return {
            ...color,
            swatch: extractedColor,
            hex: rgbToHex(extractedColor)
          };
        } catch (error) {
          console.error(`Failed to extract color for ${color.name}:`, error);
          // Use fallback
          const fallback = getFallbackColor(color.name);
          return {
            ...color,
            swatch: fallback,
            hex: rgbToHex(fallback)
          };
        }
      }
      
      // No main image, use fallback
      const fallback = getFallbackColor(color.name);
      return {
        ...color,
        swatch: fallback,
        hex: rgbToHex(fallback)
      };
    })
  );
  
  return updatedColors;
}

/**
 * Convert RGB string to hex color
 */
function rgbToHex(rgb: string): string {
  // Parse rgb(r, g, b) format
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) {
    return '#808080'; // Fallback gray
  }
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Clear the color cache (useful for development)
 */
export function clearColorCache() {
  colorCache.clear();
}

/**
 * Get cache statistics (useful for debugging)
 */
export function getCacheStats() {
  return {
    size: colorCache.size,
    entries: Array.from(colorCache.entries())
  };
}