"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { convertArabicTextToSVG, TextPathData } from '@/lib/arabic-text-to-svg';
import { 
  calculateRTLTiming, 
  HANDWRITING_EASINGS,
  scaleAnimationForViewport,
  AnimationConfig
} from '@/lib/svg-animation-utils';

export interface ArabicHandwritingTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  strokeWidth?: number;
  strokeColor?: string;
  fontSize?: number;
  easing?: keyof typeof HANDWRITING_EASINGS;
}

type AnimationState = 'idle' | 'writing' | 'complete';

const ArabicHandwritingText = ({
  text = "ألا تخافون من الله",
  className = "",
  duration = 3,
  delay = 1,
  strokeWidth = 2,
  strokeColor = "currentColor",
  fontSize = 24,
  easing = 'natural'
}: ArabicHandwritingTextProps) => {
  const [pathData, setPathData] = useState<TextPathData | null>(null);
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [animationConfigs, setAnimationConfigs] = useState<AnimationConfig[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(1024);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const animationTimeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Handle viewport width for responsive animations
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate SVG paths from text
  useEffect(() => {
    const generatePaths = async () => {
      try {
        setError(null);
        setAnimationState('idle');
        
        const data = await convertArabicTextToSVG(text, fontSize);
        setPathData(data);
        
        // Calculate animation timing for RTL flow
        const baseConfigs = calculateRTLTiming(data.characters.length, duration);
        const scaledConfigs = baseConfigs.map(config => 
          scaleAnimationForViewport(config, viewportWidth)
        );
        
        setAnimationConfigs(scaledConfigs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate SVG paths');
        setPathData(null);
      }
    };

    generatePaths();
  }, [text, fontSize, duration, viewportWidth]);

  // Start animation after delay with cleanup
  useEffect(() => {
    if (!pathData || animationConfigs.length === 0) return;

    // Clear any existing timeouts
    animationTimeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    animationTimeoutRefs.current = [];

    const startTimer = setTimeout(() => {
      setAnimationState('writing');
      
      // Set completion timer based on the last character's animation
      const totalAnimationTime = Math.max(
        ...animationConfigs.map(config => config.delay + config.duration)
      );
      
      const completeTimer = setTimeout(() => {
        setAnimationState('complete');
      }, (totalAnimationTime + 0.5) * 1000); // Add small buffer

      animationTimeoutRefs.current.push(completeTimer);
    }, delay * 1000);

    animationTimeoutRefs.current.push(startTimer);

    return () => {
      animationTimeoutRefs.current.forEach(timeout => clearTimeout(timeout));
      animationTimeoutRefs.current = [];
    };
  }, [pathData, animationConfigs, delay]);

  // Update path lengths when animation starts
  useEffect(() => {
    if (animationState === 'writing' && pathRefs.current.length > 0) {
      pathRefs.current.forEach((pathEl) => {
        if (pathEl) {
          const pathLength = pathEl.getTotalLength();
          pathEl.style.setProperty('--path-length', pathLength.toString());
          pathEl.style.setProperty('--dash-array', `${pathLength} ${pathLength}`);
          pathEl.style.setProperty('--dash-offset', pathLength.toString());
        }
      });
    }
  }, [animationState]);

  // Use Framer Motion's reduced motion hook
  const prefersReducedMotion = useReducedMotion();

  if (error) {
    // Fallback to regular text on error
    return (
      <div className={`${className} font-arabic`} dir="rtl">
        {text}
      </div>
    );
  }

  if (!pathData) {
    return (
      <div className={`${className} font-arabic opacity-0`} dir="rtl">
        {text}
      </div>
    );
  }

  // If user prefers reduced motion, show static text
  if (prefersReducedMotion) {
    return (
      <div className={`${className} font-arabic`} dir="rtl">
        {text}
      </div>
    );
  }

  // Framer Motion variants for container animation
  const containerVariants = {
    idle: { 
      opacity: 0,
      scale: 0.98
    },
    writing: { 
      opacity: 1,
      scale: 1
    },
    complete: { 
      opacity: 1,
      scale: 1
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className={`${className} relative inline-block`} 
      dir="rtl"
      role="text"
      aria-label={text}
      variants={containerVariants}
      initial="idle"
      animate={animationState}
      style={{
        transformOrigin: 'center right' // RTL transform origin
      }}
    >
      <svg
        width={pathData.totalWidth + 20}
        height={pathData.totalHeight + 10}
        viewBox={`0 0 ${pathData.totalWidth + 20} ${pathData.totalHeight + 10}`}
        className="overflow-visible"
        style={{
          maxWidth: '100%',
          height: 'auto',
          willChange: animationState === 'writing' ? 'transform' : 'auto'
        }}
        aria-hidden="true"
      >
        {/* Define the animation keyframes */}
        <defs>
          <style>
            {`
              @keyframes drawPath {
                0% {
                  stroke-dashoffset: var(--path-length);
                  opacity: 0;
                }
                5% {
                  opacity: 1;
                }
                100% {
                  stroke-dashoffset: 0;
                  opacity: 1;
                }
              }
              
              @keyframes fadeIn {
                0% {
                  opacity: 0;
                  transform: translateY(2px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}
          </style>
        </defs>

        {pathData.characters.map((char, index) => {
          if (!char.path) return null;

          const config = animationConfigs[index];
          const xPosition = pathData.rtlPositions[index] + 10;
          
          return (
            <g key={index} transform={`translate(${xPosition}, 5)`}>
              <path
                ref={el => {
                  pathRefs.current[index] = el;
                  // Calculate actual path length when element is available
                  if (el && animationState === 'writing') {
                    const pathLength = el.getTotalLength();
                    el.style.setProperty('--path-length', pathLength.toString());
                    el.style.setProperty('--dash-array', `${pathLength} ${pathLength}`);
                    el.style.setProperty('--dash-offset', pathLength.toString());
                  }
                }}
                d={char.path}
                stroke={strokeColor}
                strokeWidth={config?.strokeWidth || strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: animationState === 'writing' ? 'var(--dash-array)' : 'none',
                  strokeDashoffset: animationState === 'writing' ? 'var(--dash-offset)' : '0',
                  animation: animationState === 'writing' 
                    ? `drawPath ${config?.duration || 1}s ${HANDWRITING_EASINGS[easing]} ${config?.delay || 0}s forwards`
                    : 'none',
                  opacity: animationState === 'idle' ? 0 : 1,
                  transition: animationState === 'complete' ? 'opacity 0.3s ease' : 'none',
                  willChange: animationState === 'writing' ? 'stroke-dashoffset, opacity' : 'auto'
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Screen reader accessible text */}
      <span className="sr-only">{text}</span>
    </motion.div>
  );
};

export default ArabicHandwritingText;