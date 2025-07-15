# Project Structure

## Root Directory
- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - Git ignore rules

## Source Code (`/src`)

### App Router (`/src/app`)
- `layout.tsx` - Root layout with fonts and providers
- `page.tsx` - Homepage component
- `globals.css` - Global styles
- `/about` - About page
- `/api` - API routes
- `/cart` - Shopping cart page
- `/collections` - Collection pages
- `/contact` - Contact page
- `/products` - Product pages
- `/fonts` - Custom font definitions

### Components (`/src/components`)
- `Header.tsx` - Navigation header
- `Footer.tsx` - Site footer
- `ArabicHandwritingText.tsx` - Arabic handwriting animation
- `ProductCard*.tsx` - Various product card designs
- `/cart` - Cart-related components
- `/product` - Product-specific components

### Data Layer (`/src/data`)
- `collections.ts` - Collection definitions and utilities
- `/products` - Individual product JSON files from Shopify

### Business Logic (`/src/lib`)
- `product-loader.ts` - Server-side product data loading
- `product-loader.client.ts` - Client-side product utilities
- `product-transformer.ts` - Data transformation utilities

### Hooks (`/src/hooks`)
- `useColorExtractor.ts` - Color extraction from images
- `useProducts.ts` - Product data management

### Context (`/src/context`)
- `CartContext.tsx` - Shopping cart state management

## Public Assets (`/public`)
- `/images` - Product images organized by product folders
- `/product-images` - Additional product imagery
- Static assets (SVGs, icons)

## Scripts (`/scripts`)
- Data processing and migration scripts
- Image verification and validation tools
- Shopify data synchronization utilities
- `/archive` - Historical scripts and backups

## Data Files (`/data`)
- `products.json` - Consolidated product data
- `all-products.json` - Complete product catalog
- Various product data exports

## Naming Conventions
- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Files**: kebab-case for pages, camelCase for utilities
- **Images**: `product-slug/color-variant-type.jpg`
- **Product slugs**: kebab-case matching Shopify handles
- **Color variants**: kebab-case (e.g., `faded-black`, `olive-green`)

## Key Patterns
- Server Components for data fetching
- Client Components for interactivity
- TypeScript interfaces for type safety
- Tailwind for styling with custom font variables
- Framer Motion for animations
- Next.js Image for optimized loading