export interface Collection {
  name: string;
  slug: string;
  description: string;
  image: string;
  url: string;
  lastmod: string;
  changefreq: string;
  category: 'apparel' | 'accessories' | 'featured' | 'upcoming';
}

export const collections: Collection[] = [
  {
    name: "Modern Arab Collection",
    slug: "frontpage",
    description: "Shop our Products - Our main collection featuring the best of Modern Arab Apparel",
    image: "https://cdn.shopify.com/s/files/1/0656/3512/3366/collections/White_MA.png?v=1741698160",
    url: "/collections/frontpage",
    lastmod: "2025-06-27T23:38:57-07:00",
    changefreq: "daily",
    category: "featured"
  },
  {
    name: "Tops",
    slug: "do-not-fear-god-tee",
    description: "Premium tees and tops featuring authentic Arabic calligraphy and modern designs",
    image: "https://cdn.shopify.com/s/files/1/0656/3512/3366/collections/DSC8846.jpg?v=1741691164",
    url: "/collections/do-not-fear-god-tee",
    lastmod: "2025-06-27T23:38:57-07:00",
    changefreq: "daily",
    category: "apparel"
  },
  {
    name: "Layers",
    slug: "dont-fear-the-name-allah-premium-oversized-crewneck",
    description: "Comfortable layers including hoodies, crewnecks, and premium oversized pieces",
    image: "https://cdn.shopify.com/s/files/1/0656/3512/3366/collections/6-_DSC9192.jpg?v=1741692123",
    url: "/collections/dont-fear-the-name-allah-premium-oversized-crewneck",
    lastmod: "2025-06-01T13:20:36-07:00",
    changefreq: "daily",
    category: "apparel"
  },
  {
    name: "Headwear",
    slug: "modern-arab-cap",
    description: "Complete your look with caps, beanies, and premium headwear accessories",
    image: "https://cdn.shopify.com/s/files/1/0656/3512/3366/collections/6-_DSC9239.jpg?v=1741698420",
    url: "/collections/modern-arab-cap",
    lastmod: "2025-05-04T03:54:08-07:00",
    changefreq: "daily",
    category: "accessories"
  },
  {
    name: "Arrivals",
    slug: "coming-soon",
    description: "Latest arrivals and upcoming releases from Modern Arab Apparel",
    image: "https://cdn.shopify.com/s/files/1/0656/3512/3366/collections/IMG_1584.jpg?v=1741754027",
    url: "/collections/coming-soon",
    lastmod: "2025-06-27T23:38:57-07:00",
    changefreq: "daily",
    category: "upcoming"
  },
  {
    name: "Bottoms",
    slug: "legwear",
    description: "Premium joggers, sweatpants, and other bottom wear for complete comfort",
    image: "https://cdn.shopify.com/s/files/1/0656/3512/3366/collections/A631FEBC-A3B9-4973-ABF3-6679E61B24C6.jpg?v=1741699146",
    url: "/collections/legwear",
    lastmod: "2025-05-04T02:20:44-07:00",
    changefreq: "daily",
    category: "apparel"
  }
];

export const getCollectionBySlug = (slug: string): Collection | undefined => {
  return collections.find(collection => collection.slug === slug);
};

export const getCollectionsByCategory = (category: Collection['category']): Collection[] => {
  return collections.filter(collection => collection.category === category);
};