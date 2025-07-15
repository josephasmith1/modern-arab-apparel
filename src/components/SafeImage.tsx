'use client';

import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends ImageProps {
  src: string;
  alt: string;
}

export default function SafeImage({ src, alt, ...props }: SafeImageProps) {
  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        if (target.src !== '/images/placeholder.svg') {
          target.src = '/images/placeholder.svg';
        }
      }}
    />
  );
}