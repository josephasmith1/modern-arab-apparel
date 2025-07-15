# Technology Stack

## Framework & Runtime
- **Next.js 15.3.5** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript 5.8.3** - Type safety and development experience
- **Node.js** - Runtime environment

## Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion 12.23.3** - Animation library
- **Google Fonts** - Typography (Geist, Montserrat, Bodoni, Arabic fonts)
- **Lucide React** - Icon library

## Data & State Management
- **React Context** - Cart state management
- **JSON files** - Product data storage in `/src/data/products/`
- **File system** - Server-side data loading

## Development Tools
- **ESLint** - Code linting
- **Playwright** - End-to-end testing
- **Nodemon** - Development file watching
- **Puppeteer** - Web scraping and automation

## Image Handling
- **Next.js Image** - Optimized image loading
- **ColorThief** - Dynamic color extraction from images
- Local image storage in `/public/images/`

## Common Commands

### Development
```bash
npm run dev          # Start development server on port 3000
npm run dev:watch    # Start with nodemon file watching
npm run stop         # Kill process on port 3000
```

### Build & Deploy
```bash
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # TypeScript type checking
npm run lint         # Run ESLint
```

### Data Management
```bash
npm run regenerate-products  # Regenerate product data from JSON files
```

## Configuration Files
- `next.config.ts` - Next.js configuration with image domains
- `tailwind.config.ts` - Tailwind CSS customization
- `tsconfig.json` - TypeScript configuration with path aliases
- `eslint.config.mjs` - ESLint rules and settings