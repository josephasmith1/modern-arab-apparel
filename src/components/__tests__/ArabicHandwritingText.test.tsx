/**
 * Comprehensive tests for ArabicHandwritingText component
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { jest } from '@jest/globals';
import ArabicHandwritingText from '../ArabicHandwritingText';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>{children}</div>
    ))
  },
  useReducedMotion: jest.fn(() => false)
}));

// Mock the Arabic text-to-SVG utility
jest.mock('../../lib/arabic-text-to-svg', () => ({
  convertArabicTextToSVG: jest.fn(() => Promise.resolve({
    characters: [
      {
        character: 'أ',
        path: 'M 10 20 L 30 20',
        viewBox: '0 0 40 30',
        width: 20,
        height: 30,
        strokeOrder: 0
      },
      {
        character: 'ل',
        path: 'M 5 20 Q 15 10 25 20',
        viewBox: '0 0 30 30',
        width: 25,
        height: 30,
        strokeOrder: 1
      }
    ],
    totalWidth: 45,
    totalHeight: 30,
    rtlPositions: [25, 0],
    text: 'أل'
  }))
}));

// Mock SVG animation utilities
jest.mock('../../lib/svg-animation-utils', () => ({
  calculateRTLTiming: jest.fn(() => [
    { duration: 1, delay: 0, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', strokeWidth: 2 },
    { duration: 1, delay: 0.8, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', strokeWidth: 2 }
  ]),
  scaleAnimationForViewport: jest.fn((config) => config),
  HANDWRITING_EASINGS: {
    natural: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    linear: 'linear'
  }
}));

// Mock SVGPathElement.getTotalLength
Object.defineProperty(SVGPathElement.prototype, 'getTotalLength', {
  value: jest.fn(() => 100),
  writable: true
});

describe('ArabicHandwritingText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('should render with default props', async () => {
      render(<ArabicHandwritingText text="أل" />);
      
      await waitFor(() => {
        expect(screen.getByRole('text')).toBeInTheDocument();
      });
    });

    it('should render with custom className', async () => {
      render(<ArabicHandwritingText text="أل" className="custom-class" />);
      
      await waitFor(() => {
        const element = screen.getByRole('text');
        expect(element).toHaveClass('custom-class');
      });
    });

    it('should have proper RTL direction', async () => {
      render(<ArabicHandwritingText text="أل" />);
      
      await waitFor(() => {
        const element = screen.getByRole('text');
        expect(element).toHaveAttribute('dir', 'rtl');
      });
    });

    it('should have proper aria-label', async () => {
      const testText = "أل";
      render(<ArabicHandwritingText text={testText} />);
      
      await waitFor(() => {
        const element = screen.getByRole('text');
        expect(element).toHaveAttribute('aria-label', testText);
      });
    });
  });

  describe('SVG Generation', () => {
    it('should render SVG with correct dimensions', async () => {
      render(<ArabicHandwritingText text="أل" />);
      
      await waitFor(() => {
        const svg = document.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('width', '65'); // 45 + 20 padding
        expect(svg).toHaveAttribute('height', '40'); // 30 + 10 padding
      });
    });

    it('should render paths for each character', async () => {
      render(<ArabicHandwritingText text="أل" />);
      
      await waitFor(() => {
        const paths = document.querySelectorAll('path');
        expect(paths).toHaveLength(2);
      });
    });

    it('should apply correct stroke properties', async () => {
      render(
        <ArabicHandwritingText 
          text="أل" 
          strokeColor="red" 
          strokeWidth={3}
        />
      );
      
      await waitFor(() => {
        const paths = document.querySelectorAll('path');
        paths.forEach(path => {
          expect(path).toHaveAttribute('stroke', 'red');
          expect(path).toHaveAttribute('stroke-width', '3');
          expect(path).toHaveAttribute('fill', 'none');
          expect(path).toHaveAttribute('stroke-linecap', 'round');
          expect(path).toHaveAttribute('stroke-linejoin', 'round');
        });
      });
    });
  });

  describe('Animation Behavior', () => {
    it('should start animation after delay', async () => {
      render(<ArabicHandwritingText text="أل" delay={1} />);
      
      // Initially should be in idle state
      await waitFor(() => {
        const paths = document.querySelectorAll('path');
        paths.forEach(path => {
          expect(path.style.opacity).toBe('0');
        });
      });

      // Fast-forward past the delay
      act(() => {
        jest.advanceTimersByTime(1100);
      });

      await waitFor(() => {
        const paths = document.querySelectorAll('path');
        expect(paths.length).toBeGreaterThan(0);
      });
    });

    it('should apply animation styles during writing state', async () => {
      render(<ArabicHandwritingText text="أل" delay={0.1} />);
      
      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        const paths = document.querySelectorAll('path');
        paths.forEach(path => {
          expect(path.style.strokeDasharray).toBe('var(--dash-array)');
          expect(path.style.strokeDashoffset).toBe('var(--dash-offset)');
        });
      });
    });

    it('should complete animation after total duration', async () => {
      render(<ArabicHandwritingText text="أل" delay={0.1} duration={2} />);
      
      // Fast-forward past delay + animation duration
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        const paths = document.querySelectorAll('path');
        expect(paths.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Accessibility', () => {
    it('should include screen reader text', async () => {
      const testText = "أل";
      render(<ArabicHandwritingText text={testText} />);
      
      await waitFor(() => {
        const srText = document.querySelector('.sr-only');
        expect(srText).toBeInTheDocument();
        expect(srText).toHaveTextContent(testText);
      });
    });

    it('should mark SVG as aria-hidden', async () => {
      render(<ArabicHandwritingText text="أل" />);
      
      await waitFor(() => {
        const svg = document.querySelector('svg');
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('should show static text when reduced motion is preferred', async () => {
      const { useReducedMotion } = require('framer-motion');
      useReducedMotion.mockReturnValue(true);

      render(<ArabicHandwritingText text="أل" className="test-class" />);
      
      const element = screen.getByText('أل');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('test-class');
      expect(element).toHaveClass('font-arabic');
      expect(element).toHaveAttribute('dir', 'rtl');
    });
  });

  describe('Error Handling', () => {
    it('should show fallback text on SVG generation error', async () => {
      const { convertArabicTextToSVG } = require('../../lib/arabic-text-to-svg');
      convertArabicTextToSVG.mockRejectedValue(new Error('SVG generation failed'));

      render(<ArabicHandwritingText text="أل" className="test-class" />);
      
      await waitFor(() => {
        const element = screen.getByText('أل');
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass('test-class');
        expect(element).toHaveClass('font-arabic');
      });
    });

    it('should handle empty text gracefully', async () => {
      render(<ArabicHandwritingText text="" />);
      
      await waitFor(() => {
        const element = screen.getByRole('text');
        expect(element).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should set will-change property during animation', async () => {
      render(<ArabicHandwritingText text="أل" delay={0.1} />);
      
      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        const svg = document.querySelector('svg');
        expect(svg?.style.willChange).toBe('transform');
        
        const paths = document.querySelectorAll('path');
        paths.forEach(path => {
          expect(path.style.willChange).toBe('stroke-dashoffset, opacity');
        });
      });
    });

    it('should clean up timeouts on unmount', async () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
      
      const { unmount } = render(<ArabicHandwritingText text="أل" />);
      
      unmount();
      
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle viewport width changes', async () => {
      const { scaleAnimationForViewport } = require('../../lib/svg-animation-utils');
      
      render(<ArabicHandwritingText text="أل" />);
      
      // Simulate window resize
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 768,
        });
        window.dispatchEvent(new Event('resize'));
      });

      await waitFor(() => {
        expect(scaleAnimationForViewport).toHaveBeenCalledWith(
          expect.any(Object),
          768
        );
      });
    });
  });

  describe('Custom Props', () => {
    it('should accept custom duration and delay', async () => {
      render(
        <ArabicHandwritingText 
          text="أل" 
          duration={5} 
          delay={2}
        />
      );
      
      await waitFor(() => {
        const { calculateRTLTiming } = require('../../lib/svg-animation-utils');
        expect(calculateRTLTiming).toHaveBeenCalledWith(2, 5);
      });
    });

    it('should accept custom easing', async () => {
      render(
        <ArabicHandwritingText 
          text="أل" 
          easing="bouncy"
          delay={0.1}
        />
      );
      
      act(() => {
        jest.advanceTimersByTime(200);
      });

      await waitFor(() => {
        const paths = document.querySelectorAll('path');
        paths.forEach(path => {
          expect(path.style.animation).toContain('cubic-bezier(0.68, -0.55, 0.265, 1.55)');
        });
      });
    });

    it('should accept custom fontSize', async () => {
      render(<ArabicHandwritingText text="أل" fontSize={32} />);
      
      await waitFor(() => {
        const { convertArabicTextToSVG } = require('../../lib/arabic-text-to-svg');
        expect(convertArabicTextToSVG).toHaveBeenCalledWith('أل', 32);
      });
    });
  });
});