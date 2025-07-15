/**
 * Utility functions for converting Arabic text to SVG paths for handwriting animation
 */

export interface ArabicCharacterPath {
  character: string;
  path: string;
  viewBox: string;
  width: number;
  height: number;
  strokeOrder: number;
}

export interface TextPathData {
  characters: ArabicCharacterPath[];
  totalWidth: number;
  totalHeight: number;
  rtlPositions: number[];
  text: string;
}

/**
 * Creates an SVG path from text using canvas measurement and font rendering
 * This is a simplified approach that creates stroke-based paths for animation
 */
export async function convertArabicTextToSVG(
  text: string,
  fontSize: number = 24,
  fontFamily: string = 'Noto Naskh Arabic, Amiri, serif'
): Promise<TextPathData> {
  // Create a temporary canvas to measure text
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  // Set font properties
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'right'; // Arabic is RTL
  ctx.direction = 'rtl';

  // Measure the full text
  const textMetrics = ctx.measureText(text);
  const totalWidth = textMetrics.width;
  const totalHeight = fontSize * 1.2; // Add some padding

  // For Arabic handwriting animation, we'll create simplified stroke paths
  // This approach creates a path that follows the text baseline for each character
  const characters: ArabicCharacterPath[] = [];
  const rtlPositions: number[] = [];
  
  // Split text into characters (handling Arabic properly)
  const chars = Array.from(text);
  let currentX = totalWidth;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const charMetrics = ctx.measureText(char);
    const charWidth = charMetrics.width;
    
    // Create a simple path for each character
    // This creates a stroke path that can be animated
    const path = createCharacterStrokePath(char, charWidth, totalHeight, fontSize);
    
    characters.push({
      character: char,
      path,
      viewBox: `0 0 ${charWidth + 10} ${totalHeight}`,
      width: charWidth,
      height: totalHeight,
      strokeOrder: i
    });

    rtlPositions.push(currentX - charWidth);
    currentX -= charWidth;
  }

  return {
    characters,
    totalWidth,
    totalHeight,
    rtlPositions,
    text
  };
}

/**
 * Creates a stroke path for a character that can be animated
 * This is a simplified approach that creates paths suitable for handwriting animation
 */
function createCharacterStrokePath(
  char: string,
  width: number,
  height: number,
  fontSize: number
): string {
  // For Arabic characters, we create simplified stroke paths
  // This is a basic implementation - in a real scenario, you might want
  // to use actual font path data or more sophisticated path generation
  
  const baselineY = height * 0.75; // Arabic baseline position
  const centerX = width / 2;
  
  // Create different path patterns based on character type
  if (char === ' ') {
    // Space character - no visible path
    return '';
  }
  
  // For Arabic characters, create flowing stroke patterns
  // This is a simplified approach - real Arabic calligraphy would need
  // more sophisticated path generation
  if (isArabicCharacter(char)) {
    return createArabicCharacterPath(char, width, height, baselineY, centerX);
  }
  
  // Fallback for other characters
  return `M 5 ${baselineY} Q ${centerX} ${baselineY - 10} ${width - 5} ${baselineY}`;
}

/**
 * Creates stroke paths for Arabic characters with flowing, calligraphic style
 */
function createArabicCharacterPath(
  char: string,
  width: number,
  height: number,
  baselineY: number,
  centerX: number
): string {
  // This is a simplified mapping of Arabic characters to stroke paths
  // In a production app, you'd want more sophisticated path generation
  
  const charCode = char.charCodeAt(0);
  const startX = Math.max(2, width * 0.1);
  const endX = Math.min(width - 2, width * 0.9);
  
  // Create more sophisticated paths based on Arabic character types
  switch (char) {
    case 'أ':
    case 'ا': // Alif
      return `M ${centerX} ${baselineY - height * 0.6} L ${centerX} ${baselineY}`;
    
    case 'ل': // Lam
      return `M ${startX} ${baselineY} Q ${centerX} ${baselineY - height * 0.4} ${endX} ${baselineY - height * 0.6}`;
    
    case 'ت':
    case 'ث': // Teh/Theh
      return `M ${startX} ${baselineY - height * 0.2} Q ${centerX} ${baselineY - height * 0.4} ${endX} ${baselineY - height * 0.2}`;
    
    case 'خ':
    case 'ح': // Hah/Khah
      return `M ${startX} ${baselineY - height * 0.3} Q ${centerX} ${baselineY - height * 0.1} ${endX} ${baselineY - height * 0.3}`;
    
    case 'ف': // Feh
      return `M ${startX} ${baselineY - height * 0.2} Q ${centerX} ${baselineY - height * 0.5} ${endX} ${baselineY - height * 0.2} M ${centerX} ${baselineY - height * 0.7} L ${centerX} ${baselineY - height * 0.6}`;
    
    case 'و': // Waw
      return `M ${centerX} ${baselineY} Q ${startX} ${baselineY - height * 0.3} ${centerX} ${baselineY - height * 0.4} Q ${endX} ${baselineY - height * 0.3} ${centerX} ${baselineY}`;
    
    case 'ن': // Noon
      return `M ${startX} ${baselineY - height * 0.2} Q ${centerX} ${baselineY - height * 0.4} ${endX} ${baselineY - height * 0.2} M ${centerX} ${baselineY - height * 0.6} L ${centerX + 2} ${baselineY - height * 0.5}`;
    
    case 'م': // Meem
      return `M ${startX} ${baselineY} Q ${startX + width * 0.2} ${baselineY - height * 0.3} ${centerX} ${baselineY - height * 0.2} Q ${endX - width * 0.2} ${baselineY - height * 0.3} ${endX} ${baselineY}`;
    
    case 'ه': // Heh
      return `M ${startX} ${baselineY - height * 0.2} Q ${centerX} ${baselineY - height * 0.4} ${endX} ${baselineY - height * 0.2} Q ${centerX} ${baselineY} ${startX} ${baselineY - height * 0.2}`;
    
    default:
      // For other Arabic characters, create flowing curves
      if (charCode >= 0x0600 && charCode <= 0x06FF) {
        const midY = baselineY - (height * 0.25);
        const controlY = baselineY - (height * 0.4);
        return `M ${startX} ${baselineY} Q ${centerX} ${controlY} ${endX} ${midY}`;
      }
      
      // Fallback for non-Arabic characters
      return `M ${startX} ${baselineY} L ${endX} ${baselineY}`;
  }
}

/**
 * Checks if a character is Arabic
 */
function isArabicCharacter(char: string): boolean {
  const charCode = char.charCodeAt(0);
  return (charCode >= 0x0600 && charCode <= 0x06FF) || // Arabic block
         (charCode >= 0x0750 && charCode <= 0x077F) || // Arabic Supplement
         (charCode >= 0x08A0 && charCode <= 0x08FF);   // Arabic Extended-A
}

/**
 * Calculates animation timing for right-to-left text flow
 */
export function calculateRTLAnimationTiming(
  characters: ArabicCharacterPath[],
  totalDuration: number
): { delay: number; duration: number }[] {
  const timingData: { delay: number; duration: number }[] = [];
  const charDuration = totalDuration / characters.length;
  
  // For RTL animation, start from the rightmost character
  for (let i = 0; i < characters.length; i++) {
    const delay = i * (charDuration * 0.8); // Slight overlap
    timingData.push({
      delay,
      duration: charDuration
    });
  }
  
  return timingData;
}