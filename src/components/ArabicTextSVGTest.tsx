"use client";

import { useState, useEffect } from 'react';
import { convertArabicTextToSVG, TextPathData } from '@/lib/arabic-text-to-svg';

interface ArabicTextSVGTestProps {
  text: string;
}

const ArabicTextSVGTest = ({ text }: ArabicTextSVGTestProps) => {
  const [pathData, setPathData] = useState<TextPathData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generatePaths = async () => {
      try {
        const data = await convertArabicTextToSVG(text, 24);
        setPathData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setPathData(null);
      }
    };

    generatePaths();
  }, [text]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!pathData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-2">Arabic Text SVG Test</h3>
      <p className="mb-2">Text: {text}</p>
      <p className="mb-2">Total Width: {pathData.totalWidth}px</p>
      <p className="mb-4">Characters: {pathData.characters.length}</p>
      
      <svg 
        width={pathData.totalWidth + 20} 
        height={pathData.totalHeight + 20}
        className="border bg-gray-50"
      >
        {pathData.characters.map((char, index) => (
          <g key={index} transform={`translate(${pathData.rtlPositions[index]}, 10)`}>
            {char.path && (
              <path
                d={char.path}
                stroke="black"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </g>
        ))}
      </svg>
      
      <div className="mt-4">
        <h4 className="font-semibold">Character Details:</h4>
        {pathData.characters.map((char, index) => (
          <div key={index} className="text-sm">
            {char.character}: {char.path ? 'Has path' : 'No path'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArabicTextSVGTest;