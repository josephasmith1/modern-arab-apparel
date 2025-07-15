export interface Product {
  slug: string;
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  url: string;
  images: string[];
  image: string | null;
  variants: unknown[]; 
  sizes: string[];
  scraped: boolean;
  scrapedAt: string;
  colors: Color[];
}

export interface Color {
  name: string;
  hex: string;
  images: {
    main: string;
    thumbnail?: string;
  };
}
