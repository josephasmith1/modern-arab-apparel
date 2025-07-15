/**
 * Tests for Arabic text-to-SVG conversion utilities
 */

import {
  convertArabicTextToSVG,
  calculateRTLAnimationTiming
} from '../arabic-text-to-svg';

// Mock canvas and context
const mockContext = {
  font: '',
  textAlign: '',
  direction: '',
  measureText: jest.fn(() => ({
    width: 100
  }))
};

const mockCanvas = {
  getContext: jest.fn(() => mockContext)
};

// Mock document.createElement
Object.defineProperty(document, 'createElement', {
  value: jest.fn((tagName: string) => {
    if (tagName === 'canvas') {
      return mockCanvas;
    }
    return {};
  }),
  writable: true
});

describe('Arabic Text-to-SVG Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('convertArabicTextToSVG', () => {
    it('should convert Arabic text to SVG path data', async () => {
      const result = await convertArabicTextToSVG('أل', 24);

      expect(result).toHaveProperty('characters');
      expect(result).toHaveProperty('totalWidth');
      expect(result).toHaveProperty('totalHeight');
      expect(result).toHaveProperty('rtlPositions');
      expect(result).toHaveProperty('text');
      expect(result.text).toBe('أل');
    });

    it('should handle different font sizes', async () => {
      const result = await convertArabicTextToSVG('أل', 32);

      expect(mockContext.font).toBe('32px Noto Naskh Arabic, Amiri, serif');
      expect(result.totalHeight).toBe(32 * 1.2); // fontSize * 1.2
    });

    it('should handle custom font family', async () => {
      await convertArabicTextToSVG('أل', 24, 'Custom Arabic Font');

      expect(mockContext.font).toBe('24px Custom Arabic Font');
    });

    it('should create proper RTL positions', async () => {
      mockContext.measureText.mockImplementation((text) => ({
        width: text.length * 20 // Mock width based on character count
      }));

      const result = await convertArabicTextToSVG('أل', 24);

      expect(result.rtlPositions).toHaveLength(2);
      expect(result.rtlPositions[0]).toBeGreaterThan(result.rtlPositions[1]);
    });

    it('should handle empty text', async () => {
      const result = await convertArabicTextToSVG('', 24);

      expect(result.characters).toHaveLength(0);
      expect(result.totalWidth).toBe(0);
    });

    it('should handle spaces in text', async () => {
      const result = await convertArabicTextToSVG('أ ل', 24);

      expect(result.characters).toHaveLength(3);
      expect(result.characters[1].character).toBe(' ');
      expect(result.characters[1].path).toBe(''); // Space should have empty path
    });

    it('should throw error when canvas context is not available', async () => {
      mockCanvas.getContext.mockReturnValue(null);

      await expect(convertArabicTextToSVG('أل', 24))
        .rejects.toThrow('Could not create canvas context');
    });
  });

  describe('calculateRTLAnimationTiming', () => {
    it('should calculate correct timing for RTL animation', () => {
      const characters = [
        { character: 'أ', path: 'M 0 0 L 10 10', viewBox: '0 0 20 20', width: 20, height: 20, strokeOrder: 0 },
        { character: 'ل', path: 'M 0 0 Q 10 5 20 10', viewBox: '0 0 30 20', width: 30, height: 20, strokeOrder: 1 }
      ];

      const result = calculateRTLAnimationTiming(characters, 3);

      expect(result).toHaveLength(2);
      expect(result[0].delay).toBe(0);
      expect(result[1].delay).toBe(0.8); // 1 * (1 * 0.8)
      
      result.forEach(timing => {
        expect(timing.duration).toBe(1.5); // 3 / 2
      });
    });

    it('should handle single character', () => {
      const characters = [
        { character: 'أ', path: 'M 0 0 L 10 10', viewBox: '0 0 20 20', width: 20, height: 20, strokeOrder: 0 }
      ];

      const result = calculateRTLAnimationTiming(characters, 2);

      expect(result).toHaveLength(1);
      expect(result[0].delay).toBe(0);
      expect(result[0].duration).toBe(2);
    });

    it('should handle empty character array', () => {
      const result = calculateRTLAnimationTiming([], 3);

      expect(result).toHaveLength(0);
    });
  });

  describe('Character Path Generation', () => {
    it('should create different paths for different Arabic characters', async () => {
      const alif = await convertArabicTextToSVG('أ', 24);
      const lam = await convertArabicTextToSVG('ل', 24);

      expect(alif.characters[0].path).not.toBe(lam.characters[0].path);
    });

    it('should handle mixed Arabic and non-Arabic characters', async () => {
      const result = await convertArabicTextToSVG('أa', 24);

      expect(result.characters).toHaveLength(2);
      expect(result.characters[0].path).toBeTruthy();
      expect(result.characters[1].path).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle measureText errors gracefully', async () => {
      mockContext.measureText.mockImplementation(() => {
        throw new Error('measureText failed');
      });

      await expect(convertArabicTextToSVG('أل', 24))
        .rejects.toThrow();
    });
  });

  describe('Performance', () => {
    it('should handle long text efficiently', async () => {
      const longText = 'أ'.repeat(100);
      const startTime = Date.now();
      
      await convertArabicTextToSVG(longText, 24);
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});

// Helper function tests (if exported)
describe('Helper Functions', () => {
  // Note: These would need to be exported from the module to test directly
  describe('isArabicCharacter', () => {
    it('should identify Arabic characters correctly', () => {
      // This test assumes the function is exported
      // expect(isArabicCharacter('أ')).toBe(true);
      // expect(isArabicCharacter('a')).toBe(false);
      // expect(isArabicCharacter('1')).toBe(false);
    });
  });
});