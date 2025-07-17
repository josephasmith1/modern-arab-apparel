import { useCallback, useRef } from 'react';
import ColorThief from 'colorthief';

// In-memory cache for extracted colors with size limit
const colorCache = new Map<string, string>();
const MAX_CACHE_SIZE = 100;

// Clean up old cache entries
const cleanupCache = () => {
  if (colorCache.size > MAX_CACHE_SIZE) {
    const entriesToDelete = colorCache.size - MAX_CACHE_SIZE + 10; // Delete 10 extra to avoid frequent cleanup
    const keys = Array.from(colorCache.keys());
    for (let i = 0; i < entriesToDelete; i++) {
      colorCache.delete(keys[i]);
    }
  }
};

export const useColorExtractor = () => {
  // Use a ref to track ongoing extractions to prevent duplicates
  const ongoingExtractions = useRef(new Set<string>());

  const extractBackgroundColor = useCallback((imageSrc: string, callback: (color: string) => void) => {
    const cacheKey = `bg_${imageSrc}`;
    
    // Check cache first
    if (colorCache.has(cacheKey)) {
      callback(colorCache.get(cacheKey)!);
      return;
    }

    // Check if extraction is already in progress
    if (ongoingExtractions.current.has(cacheKey)) {
      return;
    }

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      callback('#f0edec'); // Return fallback color on server
      return;
    }

    ongoingExtractions.current.add(cacheKey);

    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) {
          const fallbackColor = '#f0edec';
          colorCache.set(cacheKey, fallbackColor);
          ongoingExtractions.current.delete(cacheKey);
          callback(fallbackColor);
          return;
        }

        // Use smaller canvas for performance
        const scale = Math.min(1, 200 / Math.max(img.width, img.height));
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        const edgePixels: number[][] = [];
        const sampleSize = 5; // Sample fewer pixels for performance
        const edgeWidth = Math.floor(canvas.width * 0.1);
        const edgeHeight = Math.floor(canvas.height * 0.1);

        // Sample edges with step size for performance
        for (let x = 0; x < canvas.width; x += sampleSize) {
          for (let y = 0; y < edgeHeight; y += sampleSize) {
            edgePixels.push(Array.from(context.getImageData(x, y, 1, 1).data));
            edgePixels.push(Array.from(context.getImageData(x, canvas.height - 1 - y, 1, 1).data));
          }
        }

        for (let y = edgeHeight; y < canvas.height - edgeHeight; y += sampleSize) {
          for (let x = 0; x < edgeWidth; x += sampleSize) {
            edgePixels.push(Array.from(context.getImageData(x, y, 1, 1).data));
            edgePixels.push(Array.from(context.getImageData(canvas.width - 1 - x, y, 1, 1).data));
          }
        }

        const avgColor = edgePixels.reduce((acc, pixel) => {
          acc[0] += pixel[0];
          acc[1] += pixel[1];
          acc[2] += pixel[2];
          return acc;
        }, [0, 0, 0]).map(c => Math.round(c / edgePixels.length));

        const color = `rgb(${avgColor[0]}, ${avgColor[1]}, ${avgColor[2]})`;
        colorCache.set(cacheKey, color);
        cleanupCache();
        ongoingExtractions.current.delete(cacheKey);
        callback(color);
      } catch (error) {
        console.error('Background color extraction error:', error);
        const fallbackColor = '#f0edec';
        colorCache.set(cacheKey, fallbackColor);
        ongoingExtractions.current.delete(cacheKey);
        callback(fallbackColor);
      }
    };
    img.onerror = () => {
      console.error(`Failed to load image for background color extraction: ${imageSrc}`);
      const fallbackColor = '#f0edec';
      colorCache.set(cacheKey, fallbackColor);
      ongoingExtractions.current.delete(cacheKey);
      callback(fallbackColor);
    };
  }, []);

  const extractImageColor = useCallback(async (imageSrc: string, callback: (color: string) => void) => {
    const cacheKey = `img_${imageSrc}`;
    
    // Check cache first
    if (colorCache.has(cacheKey)) {
      callback(colorCache.get(cacheKey)!);
      return;
    }

    // Check if extraction is already in progress
    if (ongoingExtractions.current.has(cacheKey)) {
      return;
    }

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      callback('#cccccc'); // Return fallback color on server
      return;
    }

    ongoingExtractions.current.add(cacheKey);

    try {
      // Use the server-side API to avoid CORS issues
      const response = await fetch('/api/extract-color', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: imageSrc }),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.color) {
        colorCache.set(cacheKey, data.color);
        cleanupCache();
        ongoingExtractions.current.delete(cacheKey);
        callback(data.color);
      } else {
        throw new Error('No color returned from API');
      }
    } catch (error) {
      console.error('Color extraction API error:', error);
      // Try fallback color based on URL or default
      const fallbackColor = imageSrc.includes('black') ? 'rgb(0, 0, 0)' :
                           imageSrc.includes('white') ? 'rgb(255, 255, 255)' :
                           imageSrc.includes('bone') ? 'rgb(245, 245, 220)' :
                           imageSrc.includes('khaki') ? 'rgb(195, 176, 145)' :
                           imageSrc.includes('green') ? 'rgb(34, 139, 34)' :
                           imageSrc.includes('blue') ? 'rgb(70, 130, 180)' :
                           'rgb(128, 128, 128)';
      colorCache.set(cacheKey, fallbackColor);
      ongoingExtractions.current.delete(cacheKey);
      callback(fallbackColor);
    }
  }, []);

  return { extractBackgroundColor, extractImageColor };
};