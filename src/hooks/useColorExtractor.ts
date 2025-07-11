import { useCallback } from 'react';
import ColorThief from 'colorthief';

export const useColorExtractor = () => {
  const extractBackgroundColor = useCallback((imageSrc: string, callback: (color: string) => void) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return callback('#f0edec');

      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      const edgePixels: number[][] = [];
      const edgeWidth = Math.floor(img.width * 0.1);
      const edgeHeight = Math.floor(img.height * 0.1);

      for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < edgeHeight; y++) {
          edgePixels.push(Array.from(context.getImageData(x, y, 1, 1).data));
          edgePixels.push(Array.from(context.getImageData(x, img.height - 1 - y, 1, 1).data));
        }
      }

      for (let y = edgeHeight; y < img.height - edgeHeight; y++) {
        for (let x = 0; x < edgeWidth; x++) {
          edgePixels.push(Array.from(context.getImageData(x, y, 1, 1).data));
          edgePixels.push(Array.from(context.getImageData(img.width - 1 - x, y, 1, 1).data));
        }
      }

      const avgColor = edgePixels.reduce((acc, pixel) => {
        acc[0] += pixel[0];
        acc[1] += pixel[1];
        acc[2] += pixel[2];
        return acc;
      }, [0, 0, 0]).map(c => Math.round(c / edgePixels.length));

      callback(`rgb(${avgColor[0]}, ${avgColor[1]}, ${avgColor[2]})`);
    };
    img.onerror = () => {
      console.error(`Failed to load image for background color extraction: ${imageSrc}`);
      callback('#f0edec'); // Fallback color
    };
  }, []);

  const extractImageColor = useCallback((imageSrc: string, callback: (color: string) => void) => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(img);
        callback(`rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`);
      } catch (error) {
        console.error('ColorThief error:', error);
        callback('#cccccc'); // Fallback color
      }
    };
    img.onerror = () => {
      console.error(`Failed to load image for garment color extraction: ${imageSrc}`);
      callback('#cccccc'); // Fallback color
    };
  }, []);

  return { extractBackgroundColor, extractImageColor };
};
