# Agent Guidelines for Modern Arab Apparel

## Build/Lint/Test Commands
- `npm run dev` - Start development server (kills existing port 3000 process)
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint
- `npm start` - Start production server
- No test framework configured

## Code Style Guidelines
- **TypeScript**: Strict mode enabled, use proper types
- **Imports**: Use `@/` alias for src imports, group by external/internal
- **Components**: Use default exports, PascalCase naming
- **Formatting**: Use double quotes, semicolons, 2-space indentation
- **Fonts**: Use CSS variables for fonts (e.g., `font-my-soul`, `font-montserrat`)
- **Styling**: Tailwind CSS with inline styles for specific values
- **Client Components**: Use `"use client"` directive when needed
- **Error Handling**: Handle async operations properly
- **File Structure**: Follow Next.js 13+ app directory structure
- **Naming**: camelCase for variables/functions, kebab-case for files/folders

## Framework Specifics
- Next.js 15 with App Router
- React 19 with TypeScript
- Tailwind CSS v4 for styling
- Framer Motion for animations