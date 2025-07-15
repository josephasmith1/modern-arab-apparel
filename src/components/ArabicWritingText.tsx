"use client";

import { useState, useEffect } from 'react';

interface ArabicWritingTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
}

const ArabicWritingText = ({
  text = "ألا تخافون من الله",
  className = "",
  duration = 3,
  delay = 1,
}: ArabicWritingTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText("");
    setIsComplete(false);
    setShowCursor(true);

    const startTimer = setTimeout(() => {
      let currentIndex = 0;
      const chars = Array.from(text); // Properly handle Arabic characters
      
      const typeTimer = setInterval(() => {
        if (currentIndex < chars.length) {
          const nextChar = chars[currentIndex];
          if (nextChar !== undefined) {
            setDisplayedText(prev => prev + nextChar);
          }
          currentIndex++;
        } else {
          setIsComplete(true);
          clearInterval(typeTimer);
          // Hide cursor after completion
          setTimeout(() => setShowCursor(false), 500);
        }
      }, (duration * 1000) / chars.length);

      return () => clearInterval(typeTimer);
    }, delay * 1000);

    return () => clearTimeout(startTimer);
  }, [text, duration, delay]);

  // Cursor blinking effect
  useEffect(() => {
    if (!isComplete) {
      const cursorTimer = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      return () => clearInterval(cursorTimer);
    }
  }, [isComplete]);

  return (
    <div className={`${className} relative inline-block`} dir="rtl">
      <span 
        className="font-arabic text-lg leading-relaxed"
        style={{
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          letterSpacing: '0.5px'
        }}
      >
        {displayedText}
        {showCursor && !isComplete && (
          <span 
            className="ml-1 inline-block"
            style={{
              borderRight: '2px solid currentColor',
              height: '1em',
              opacity: showCursor ? 1 : 0,
              transition: 'opacity 0.1s'
            }}
          />
        )}
      </span>
    </div>
  );
};

export default ArabicWritingText;