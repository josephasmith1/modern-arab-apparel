/**
 * Unit tests for SVG animation utilities
 */

import {
  createStrokeAnimation,
  calculateRTLTiming,
  calculateRTLPositions,
  createStaggeredDelays,
  calculateStrokeWidth,
  scaleAnimationForViewport,
  createAnimationCSSVars,
  HANDWRITING_EASINGS
} from '../svg-animation-utils';

describe('SVG Animation Utils', () => {
  describe('createStrokeAnimation', () => {
    it('should create correct stroke animation data', () => {
      const pathLength = 100;
      const config = {
        duration: 2,
        delay: 0.5,
        easing: 'ease-in-out',
        strokeWidth: 2
      };

      const result = createStrokeAnimation(pathLength, config);

      expect(result.pathLength).toBe(100);
      expect(result.dashArray).toBe('100 100');
      expect(result.dashOffset).toBe('100');
      expect(result.animationDuration).toBe('2s');
      expect(result.animationDelay).toBe('0.5s');
      expect(result.animationTimingFunction).toBe('ease-in-out');
    });
  });

  describe('calculateRTLTiming', () => {
    it('should calculate correct timing for RTL animation', () => {
      const result = calculateRTLTiming(3, 3, 0.2);

      expect(result).toHaveLength(3);
      expect(result[0].delay).toBe(0);
      expect(result[1].delay).toBe(0.8); // 1 * (1 * 0.8)
      expect(result[2].delay).toBe(1.6); // 2 * (1 * 0.8)
      
      result.forEach(config => {
        expect(config.duration).toBe(1);
        expect(config.strokeWidth).toBe(2);
        expect(config.easing).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
      });
    });
  });

  describe('calculateRTLPositions', () => {
    it('should calculate correct RTL positions', () => {
      const characterWidths = [20, 30, 25];
      const totalWidth = 100;
      const spacing = 5;

      const result = calculateRTLPositions(characterWidths, totalWidth, spacing);

      expect(result).toHaveLength(3);
      expect(result[0]).toBe(75); // 100 - 20 - 5
      expect(result[1]).toBe(40); // 75 - 30 - 5
      expect(result[2]).toBe(10); // 40 - 25 - 5
    });

    it('should handle zero spacing', () => {
      const characterWidths = [20, 30];
      const totalWidth = 50;

      const result = calculateRTLPositions(characterWidths, totalWidth, 0);

      expect(result[0]).toBe(30); // 50 - 20
      expect(result[1]).toBe(0);  // 30 - 30
    });
  });

  describe('createStaggeredDelays', () => {
    it('should create correct staggered delays', () => {
      const result = createStaggeredDelays(4, 0.5, 0.2);

      expect(result).toHaveLength(4);
      expect(result[0]).toBe(0.5);
      expect(result[1]).toBe(0.7);
      expect(result[2]).toBe(0.9);
      expect(result[3]).toBe(1.1);
    });
  });

  describe('calculateStrokeWidth', () => {
    it('should calculate appropriate stroke width', () => {
      expect(calculateStrokeWidth(12)).toBe(1);
      expect(calculateStrokeWidth(24)).toBe(2);
      expect(calculateStrokeWidth(48)).toBe(4);
      expect(calculateStrokeWidth(6)).toBe(1); // minimum
      expect(calculateStrokeWidth(100)).toBe(4); // maximum
    });
  });

  describe('scaleAnimationForViewport', () => {
    const baseConfig = {
      duration: 2,
      delay: 0,
      easing: 'ease',
      strokeWidth: 2
    };

    it('should scale for mobile viewport', () => {
      const result = scaleAnimationForViewport(baseConfig, 600);

      expect(result.duration).toBe(2.4); // 2 * 1.2
      expect(result.strokeWidth).toBe(1.6); // 2 * 0.8
    });

    it('should not scale for desktop viewport', () => {
      const result = scaleAnimationForViewport(baseConfig, 1024);

      expect(result.duration).toBe(2);
      expect(result.strokeWidth).toBe(2);
    });
  });

  describe('createAnimationCSSVars', () => {
    it('should create correct CSS variables', () => {
      const result = createAnimationCSSVars(150);

      expect(result['--path-length']).toBe('150');
      expect(result['--dash-array']).toBe('150 150');
      expect(result['--dash-offset']).toBe('150');
    });
  });

  describe('HANDWRITING_EASINGS', () => {
    it('should have all expected easing functions', () => {
      expect(HANDWRITING_EASINGS.natural).toBe('cubic-bezier(0.25, 0.46, 0.45, 0.94)');
      expect(HANDWRITING_EASINGS.smooth).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
      expect(HANDWRITING_EASINGS.bouncy).toBe('cubic-bezier(0.68, -0.55, 0.265, 1.55)');
      expect(HANDWRITING_EASINGS.linear).toBe('linear');
    });
  });
});