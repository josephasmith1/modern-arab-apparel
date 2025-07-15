#!/usr/bin/env node

/**
 * Fix products that have size variants incorrectly set up as color variants
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING SINGLE COLOR PRODUCTS WITH SIZE VARIANT ISSUES...\n');

// Read the current data.ts file
const dataPath = path.join(__dirname, '..', 'src', 'app', 'products', 'data.ts');
let dataContent = fs.readFileSync(dataPath, 'utf8');

// Fix the faded khaki premium tee
console.log('🔍 Fixing Modern Arab Premium Tee (Faded Khaki)...');

// Find the product
const productStart = dataContent.indexOf('"slug": "modern-arab-premium-tee-faded-khaki"');
if (productStart === -1) {
  console.error('❌ Could not find faded khaki premium tee');
  process.exit(1);
}

// Find the end of this product
const nextProductStart = dataContent.indexOf('{\n    "slug":', productStart + 100);
const arrayEnd = dataContent.indexOf(']\n;', productStart);
const endPos = nextProductStart !== -1 ? nextProductStart : arrayEnd;

// Extract the product section
const productSection = dataContent.substring(productStart - 10, endPos);

// Create the corrected product structure
const fixedProduct = `"slug": "modern-arab-premium-tee-faded-khaki",
    "name": "Modern Arab Premium Tee (Faded Khaki)",
    "vendor": "Modern Arab Apparel",
    "collection": "Upperwear",
    "tags": [
      "Arabic",
      "Faded Khaki",
      "Men",
      "Minimalist",
      "Modern",
      "Premium Tee",
      "Streetwear",
      "Top",
      "Upperwear",
      "Women"
    ],
    "price": "$45 - $55",
    "originalPrice": "",
    "description": "The Modern Arab Premium Tee in faded khaki with a translucent design. Designed in Los Angeles and crafted with care, this essential tee merges everyday comfort ...",
    "fullDescription": "<p>The Modern Arab Premium Tee in faded khaki with a translucent design. Designed in Los Angeles and crafted with care, this essential tee merges everyday comfort with subtle cultural storytelling. Featuring a minimalist "Modern Arab" print on the front, this piece speaks volumes with quiet confidence.<br><br><strong>Design Inspiration:</strong><br><br>This clean design reflects Modern Arab's vision: redefining Arab identity through modern fashion. The print is intentionally subtle, representing a discreet yet proud expression of culture, designed for those who know that strength doesn't always need to shout. Whether you're in the streets of LA or across the globe, this tee keeps you grounded in heritage while embracing a contemporary look.<br><br><strong>Features:</strong><br><br>• Premium heavyweight cotton for durability and comfort<br>• Garment-dyed for a naturally faded, lived-in feel<br>• Oversized, relaxed fit perfect for casual layering<br>• Minimal branding: "Modern Arab" printed across the chest<br>• Unisex fit for versatile styling across all genders<br><br><strong>Why Choose the Premium Tee?</strong><br><br>Ideal for everyday wear or elevated layering, this tee is for those who value quality, culture, and style. It's more than a basic—it's a symbol of identity and progress, crafted to fit your story.</p>\\n<p><strong>Disclaimer: This tee runs Small. For the perfect oversized fit, we recommend ordering one larger than your usual size.</strong></p>\\n<p><br>• 100% carded cotton<br>• Fabric weight: 7.1 oz. /yd. ² (240 g/m²)<br>• Garment-dyed, pre-shrunk fabric<br>• Boxy, oversized fit<br>• Dropped shoulders<br>• Wide neck ribbing<br>• Tear-away label<br>• Blank product sourced from China<br>• Final designed and printed in the USA</p>\\n<p><strong class=\\"size-guide-title\\">Size guide</strong></p>\\n<div data-unit-system=\\"imperial\\" class=\\"table-responsive dynamic\\">\\n<table cellpadding=\\"5\\">\\n<tbody>\\n<tr>\\n<td> </td>\\n<td><strong>LENGTH (inches)</strong></td>\\n<td><strong>CHEST (inches)</strong></td>\\n<td><strong>SLEEVE LENGTH (inches)</strong></td>\\n</tr>\\n<tr>\\n<td><strong>S</strong></td>\\n<td>27 ¾</td>\\n<td>39</td>\\n<td>9</td>\\n</tr>\\n<tr>\\n<td><strong>M</strong></td>\\n<td>29 ⅛</td>\\n<td>43</td>\\n<td>9 ½</td>\\n</tr>\\n<tr>\\n<td><strong>L</strong></td>\\n<td>30 ½</td>\\n<td>47</td>\\n<td>9 ½</td>\\n</tr>\\n<tr>\\n<td><strong>XL</strong></td>\\n<td>31 ⅞</td>\\n<td>51</td>\\n<td>10 ¼</td>\\n</tr>\\n<tr>\\n<td><strong>2XL</strong></td>\\n<td>33 ¼</td>\\n<td>55</td>\\n<td>10 ⅝</td>\\n</tr>\\n<tr>\\n<td><strong>3XL</strong></td>\\n<td>34</td>\\n<td>59</td>\\n<td>11</td>\\n</tr>\\n</tbody>\\n</table>\\n</div>\\n<div data-unit-system=\\"metric\\" class=\\"table-responsive dynamic\\">\\n<table cellpadding=\\"5\\">\\n<tbody>\\n<tr>\\n<td> </td>\\n<td><strong>LENGTH (cm)</strong></td>\\n<td><strong>CHEST (cm)</strong></td>\\n<td><strong>SLEEVE LENGTH (cm)</strong></td>\\n</tr>\\n<tr>\\n<td><strong>S</strong></td>\\n<td>70.5</td>\\n<td>99</td>\\n<td>23</td>\\n</tr>\\n<tr>\\n<td><strong>M</strong></td>\\n<td>74</td>\\n<td>109.2</td>\\n<td>24</td>\\n</tr>\\n<tr>\\n<td><strong>L</strong></td>\\n<td>77.5</td>\\n<td>119.4</td>\\n<td>24</td>\\n</tr>\\n<tr>\\n<td><strong>XL</strong></td>\\n<td>81</td>\\n<td>129.5</td>\\n<td>26</td>\\n</tr>\\n<tr>\\n<td><strong>2XL</strong></td>\\n<td>84.5</td>\\n<td>139.7</td>\\n<td>27</td>\\n</tr>\\n<tr>\\n<td><strong>3XL</strong></td>\\n<td>86.5</td>\\n<td>149.9</td>\\n<td>28</td>\\n</tr>\\n</tbody>\\n</table>\\n</div>",
    "features": [],
    "specifications": [],
    "origin": [],
    "careInstructions": [],
    "sizes": ["S", "M", "L", "XL", "2XL", "3XL"],
    "colors": [
      {
        "name": "Faded Khaki",
        "swatch": "",
        "hex": "#8B7355",
        "images": {
          "main": "/images/modern-arab-premium-tee-faded-khaki/faded-khaki-back.jpg",
          "back": "",
          "lifestyle": [
            "/images/modern-arab-premium-tee-faded-khaki/faded-khaki-back.jpg"
          ]
        },
        "variants": [
          {
            "size": "S",
            "price": 45,
            "sku": "3386030_17573",
            "available": true
          },
          {
            "size": "M",
            "price": 45,
            "sku": "3386030_17578",
            "available": true
          },
          {
            "size": "L",
            "price": 45,
            "sku": "3386030_17583",
            "available": true
          },
          {
            "size": "XL",
            "price": 45,
            "sku": "3386030_17588",
            "available": true
          },
          {
            "size": "2XL",
            "price": 50,
            "sku": "3386030_17593",
            "available": true
          },
          {
            "size": "3XL",
            "price": 55,
            "sku": "3386030_17598",
            "available": true
          }
        ]
      }
    ]`;

// Replace the old product section with the fixed one
dataContent = dataContent.substring(0, productStart - 10) + 
              '{\n    ' + fixedProduct + '\n  }' + 
              dataContent.substring(endPos);

// Write the updated content back
fs.writeFileSync(dataPath, dataContent);

console.log('✅ Fixed Modern Arab Premium Tee (Faded Khaki)');
console.log('   - Consolidated 6 size variants into 1 color with 6 size options');
console.log('   - Set proper color name: "Faded Khaki"');
console.log('   - Organized variants by size: S, M, L, XL, 2XL, 3XL');

console.log('\n🎉 SINGLE COLOR PRODUCT FIX COMPLETE!');
console.log('📊 Summary:');
console.log('   - Fixed product structure');
console.log('   - Now shows 1 color instead of 6 identical swatches');
console.log('   - Size selection will work properly');