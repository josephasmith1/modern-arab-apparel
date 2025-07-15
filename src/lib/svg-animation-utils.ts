/**
 * Utilities for SVG path animations, specifically for Arabic handwriting effects
 */

export interface AnimationConfig {
  duration: number;
  delay: number;
  easing: string;
  strokeWidth: number;
}

export interface PathAnimationData {
  pathLength: number;
  dashArray: string;
  dashOffset: string;
  animationDuration: string;
  animationDelay: string;
  animationTimingFunction: string;
}

/**
 * Calculates the total length of an SVG path
 */
export function getPathLength(pathElement: SVGPathElement): number {
  return pathElement.getTotalLength();
}

/**
 * Creates animation data for stroke-dasharray animation
 */
export function createStrokeAnimation(
  pathLength: number,
  config: AnimationConfig
): PathAnimationData {
  return {
    pathLength,
    dashArray: `${pathLength} ${pathLength}`,
    dashOffset: pathLength.toString(),
    animationDuration: `${config.duration}s`,
    animationDelay: `${config.delay}s`,
    animationTimingFunction: config.easing
  };
}

/**
 * Calculates timing for right-to-left Arabic text animation
 */
export function calculateRTLTiming(
  characterCount: number,
  totalDuration: number,
  overlapFactor: number = 0.2
): AnimationConfig[] {
  const configs: AnimationConfig[] = [];
  const baseDuration = totalDuration / characterCount;
  const delayIncrement = baseDuration * (1 - overlapFactor);

  for (let i = 0; i < characterCount; i++) {
    configs.push({
      duration: baseDuration,
      delay: i * delayIncrement,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Smooth easing
      strokeWidth: 2
    });
  }

  return configs;
}

/**
 * Creates CSS keyframes for stroke animation
 */
export function createStrokeKeyframes(animationName: string): string {
  return `
    @keyframes ${animationName} {
      0% {
        stroke-dashoffset: var(--path-length);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      100% {
        stroke-dashoffset: 0;
        opacity: 1;
      }
    }
  `;
}

/**
 * Positions characters for right-to-left layout
 */
export function calculateRTLPositions(
  characterWidths: number[],
  totalWidth: number,
  spacing: number = 0
): number[] {
  const positions: number[] = [];
  let currentX = totalWidth;

  for (let i = 0; i < characterWidths.length; i++) {
    const width = characterWidths[i];
    currentX -= width;
    positions.push(currentX - spacing);
    currentX -= spacing;
  }

  return positions;
}

/**
 * Creates smooth easing functions for natural handwriting
 */
export const HANDWRITING_EASINGS = {
  natural: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  linear: 'linear'
} as const;

/**
 * Utility to create staggered animation delays
 */
export function createStaggeredDelays(
  count: number,
  baseDelay: number,
  staggerAmount: number
): number[] {
  return Array.from({ length: count }, (_, i) => baseDelay + (i * staggerAmount));
}

/**
 * Calculates optimal stroke width based on font size
 */
export function calculateStrokeWidth(fontSize: number): number {
  // Scale stroke width with font size, with reasonable bounds
  return Math.max(1, Math.min(4, fontSize / 12));
}

/**
 * Creates animation styles for a path element
 */
export function createPathAnimationStyles(
  pathLength: number,
  config: AnimationConfig
): React.CSSProperties {
  return {
    strokeDasharray: `${pathLength} ${pathLength}`,
    strokeDashoffset: pathLength,
    animation: `drawPath ${config.duration}s ${config.easing} ${config.delay}s forwards`,
    strokeWidth: config.strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none'
  };
}

/**
 * Utility for responsive animation scaling
 */
export function scaleAnimationForViewport(
  baseConfig: AnimationConfig,
  viewportWidth: number
): AnimationConfig {
  // Adjust animation speed based on viewport size
  const scaleFactor = viewportWidth < 768 ? 1.2 : 1; // Slightly slower on mobile
  
  return {
    ...baseConfig,
    duration: baseConfig.duration * scaleFactor,
    strokeWidth: baseConfig.strokeWidth * (viewportWidth < 768 ? 0.8 : 1)
  };
}

/**
 * Creates CSS custom properties for animation
 */
export function createAnimationCSSVars(pathLength: number): Record<string, string> {
  return {
    '--path-length': pathLength.toString(),
    '--dash-array': `${pathLength} ${pathLength}`,
    '--dash-offset': pathLength.toString()
  };
}