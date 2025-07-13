# Scripts Directory

This directory contains scripts for managing product data and images from Shopify.

## Current Scripts

### 1. `download-final-images.sh`
Downloads all product images referenced in the data.ts file.
- Total images: 562
- Organized by product and color variant
- Run with: `./scripts/download-final-images.sh`

### 2. `handle-mapping.json`
Maps local product slugs to Shopify product handles for data synchronization.

### 3. `verify-setup.js`
Checks the current state of product data and images.
- Run with: `node scripts/verify-setup.js`

## Data Directory

### `shopify-data/`
Contains the raw product data fetched from modernarabapparel.com
- Individual product JSON files
- Consolidated product data

## Workflow

1. **Fetch latest data from Shopify**: Data is already fetched in `shopify-data/`
2. **Update product data**: Already completed - data.ts has been updated with all images
3. **Download images**: Run `./scripts/download-final-images.sh`
4. **Verify setup**: Run `node scripts/verify-setup.js`

## Notes

- All product images are properly mapped to their color variants
- Images include main product shots, back views, and lifestyle photos
- The product page will automatically display all available images for each color