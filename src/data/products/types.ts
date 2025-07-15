// Product type definitions
export interface ProductVariant {
  size: string;
  price: number;
  sku: string;
  available: boolean;
}

export interface ProductColor {
  name: string;
  swatch: string;
  hex: string;
  images: {
    main: string;
    back: string;
    lifestyle: string[];
  };
  variants: ProductVariant[];
}

export interface Product {
  slug: string;
  name: string;
  vendor: string;
  collection: string;
  tags: string[];
  price: string;
  originalPrice: string;
  description: string;
  fullDescription: string;
  features: string[];
  specifications: string[];
  origin: string[];
  careInstructions: string[];
  sizes?: string[];
  colors: ProductColor[];
}