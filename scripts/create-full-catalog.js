#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to download image
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
};

// Create images directory
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Complete product catalog with known CDN URLs
const productCatalog = [
  {
    slug: "modern-arab-faded-tee",
    name: "Modern Arab Faded Tee",
    price: "$45.00",
    description: "Rooted in meaning and made for movement, the Modern Arab Tee features the Arabic phrase \"ألآ تخافون من الله\" (Don't you fear God?) across the back—a powerful rhetorical question meant to inspire reflection, not fear.",
    fullDescription: "This design challenges harmful stereotypes, reminding the world: Arabs are not what the world thinks they are—they are better. It reclaims the narrative through language, pride, and presence. Balanced by the clean \"Modern Arab\" and \"Los Angeles\" type, the design bridges heritage with hometown identity.",
    category: "T-Shirts",
    colors: [
      {
        name: "Faded Khaki",
        hex: "#C4A575",
        images: [
          "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-khaki-front-67e7da798329f.jpg",
          "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-khaki-back-67e7da7983d55.jpg"
        ]
      },
      {
        name: "Faded Black",
        hex: "#4A4A4A",
        images: [
          "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-black-front-67e7da7982b19.jpg",
          "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-black-back-67e7da7981a64.jpg"
        ]
      },
      {
        name: "Faded Bone",
        hex: "#E8E4E0",
        images: [
          "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-bone-front-67e7da7986b74.jpg",
          "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-bone-back-67e7da798836b.jpg"
        ]
      },
      {
        name: "Faded Eucalyptus",
        hex: "#A4B5A0",
        images: [
          "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-eucalyptus-front-67e7da7984868.jpg",
          "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-eucalyptus-back-67e7da79856a3.jpg"
        ]
      }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    features: [
      "Unisex fit",
      "100% premium carded cotton",
      "Arabic calligraphy designed by first-generation and native speakers",
      "Designed in Los Angeles",
      "Garment-dyed, pre-shrunk fabric"
    ]
  },
  {
    slug: "modern-arab-hoodie",
    name: "Modern Arab Hoodie",
    price: "$60.00",
    description: "A statement piece that combines cultural heritage with modern streetwear. This premium hoodie features clean \"Modern Arab\" branding.",
    fullDescription: "Crafted for comfort and designed for impact, this hoodie represents a movement of cultural reclamation. Made from premium materials with attention to detail.",
    category: "Hoodies",
    colors: [
      {
        name: "Black",
        hex: "#000000",
        images: [
          "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/modern-arab-hoodie-black-front.jpg",
          "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/modern-arab-hoodie-black-back.jpg"
        ]
      }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    features: [
      "Unisex fit",
      "Premium fleece material",
      "Modern Arabic branding",
      "Designed in Los Angeles",
      "Comfortable drawstring hood"
    ]
  },
  {
    slug: "modern-arab-cap",
    name: "Modern Arab Cap",
    price: "$30.00",
    description: "A classic cap featuring Modern Arab branding. Clean design meets cultural expression in this versatile headwear piece.",
    fullDescription: "This premium cap combines timeless style with modern cultural expression. Featuring quality construction and comfortable fit.",
    category: "Accessories",
    colors: [
      {
        name: "Black",
        hex: "#000000",
        images: [
          "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/modern-arab-cap-black-front.jpg"
        ]
      }
    ],
    sizes: ["One Size"],
    features: [
      "Unisex fit",
      "Adjustable strap",
      "Modern Arab embroidered logo",
      "Structured crown",
      "Premium cotton construction"
    ]
  },
  {
    slug: "modern-arab-bucket-hat",
    name: "Modern Arab Bucket Hat",
    price: "$30.00",
    description: "A modern take on the classic bucket hat, featuring clean Modern Arab branding. Combines street style with cultural pride.",
    fullDescription: "This premium bucket hat is designed for those who want to make a statement while staying stylish. Perfect for outdoor activities or urban adventures.",
    category: "Accessories",
    colors: [
      {
        name: "Black",
        hex: "#000000",
        images: [
          "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/modern-arab-bucket-hat-black-front.jpg"
        ]
      }
    ],
    sizes: ["S/M", "L/XL"],
    features: [
      "Unisex fit",
      "Durable cotton canvas",
      "Modern Arab embroidered logo",
      "Wide brim for sun protection",
      "Classic bucket hat style"
    ]
  },
  {
    slug: "modern-arab-beanie",
    name: "Modern Arab Beanie",
    price: "$25.00",
    description: "A clean, minimalist beanie featuring subtle Modern Arab branding. Perfect for everyday wear while representing cultural pride.",
    fullDescription: "This premium fisherman beanie combines comfort with cultural expression. Made from soft, durable materials that provide warmth and style.",
    category: "Accessories",
    colors: [
      {
        name: "Black",
        hex: "#000000",
        images: [
          "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/modern-arab-beanie-black-front.jpg"
        ]
      }
    ],
    sizes: ["One Size"],
    features: [
      "Unisex fit",
      "Soft knit material",
      "Subtle Modern Arab branding",
      "Fisherman beanie style",
      "One size fits most"
    ]
  },
  {
    slug: "modern-arab-sweatpants",
    name: "Modern Arab Sweatpants",
    price: "$60.00",
    description: "Premium sweatpants designed for comfort and style. Features clean Modern Arab branding and a relaxed fit perfect for everyday wear.",
    fullDescription: "Crafted from premium materials for ultimate comfort, these sweatpants represent the perfect blend of streetwear aesthetics and cultural pride.",
    category: "Bottoms",
    colors: [
      {
        name: "Black",
        hex: "#000000",
        images: [
          "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/modern-arab-sweatpants-black-front.jpg"
        ]
      }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    features: [
      "Unisex fit",
      "Premium fleece material",
      "Elastic waistband with drawstring",
      "Modern Arab branding",
      "Tapered fit"
    ]
  },
  {
    slug: "modern-arab-crewneck",
    name: "Modern Arab Crewneck",
    price: "$55.00",
    description: "A classic crewneck sweatshirt featuring Modern Arab branding. Perfect for layering and everyday comfort.",
    fullDescription: "This premium crewneck combines timeless style with modern cultural expression. Made from high-quality materials for lasting comfort.",
    category: "Sweatshirts",
    colors: [
      {
        name: "Black",
        hex: "#000000",
        images: [
          "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/modern-arab-crewneck-black-front.jpg"
        ]
      }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    features: [
      "Unisex fit",
      "Premium cotton blend",
      "Modern Arab branding",
      "Designed in Los Angeles",
      "Comfortable crew neck"
    ]
  }
];

// Download all images and create final product catalog
const main = async () => {
  console.log('Creating comprehensive product catalog...');
  
  const finalCatalog = [];
  
  for (const product of productCatalog) {
    console.log(`\nProcessing: ${product.name}`);
    
    const processedColors = [];
    
    for (const color of product.colors) {
      const colorImages = [];
      
      for (let i = 0; i < color.images.length; i++) {
        const imageUrl = color.images[i];
        const filename = `${product.slug}-${color.name.toLowerCase().replace(/\s+/g, '-')}-${i + 1}.jpg`;
        const filepath = path.join(imagesDir, filename);
        
        try {
          await downloadImage(imageUrl, filepath);
          colorImages.push(`/images/${filename}`);
        } catch (err) {
          console.error(`Failed to download ${imageUrl}: ${err.message}`);
          // Add placeholder for failed downloads
          colorImages.push(`/images/placeholder-${product.slug}.jpg`);
        }
      }
      
      processedColors.push({
        ...color,
        images: {
          main: colorImages[0] || `/images/placeholder-${product.slug}.jpg`,
          back: colorImages[1] || colorImages[0] || `/images/placeholder-${product.slug}.jpg`,
          lifestyle: colorImages.slice(2) || []
        }
      });
    }
    
    // Create enhanced product object
    const enhancedProduct = {
      ...product,
      colors: processedColors,
      image: processedColors[0]?.images.main || `/images/placeholder-${product.slug}.jpg`,
      specifications: {
        material: product.category === "Accessories" ? "Premium materials" : "100% premium cotton",
        weight: "Medium weight",
        fit: "Relaxed unisex fit",
        origin: "Designed in Los Angeles, USA"
      },
      sizeGuide: product.sizes.map(size => ({
        size: size,
        length: "28\"",
        chest: "42\"",
        sleeve: "9\"",
        lengthCm: "71",
        chestCm: "107",
        sleeveCm: "23"
      }))
    };
    
    finalCatalog.push(enhancedProduct);
  }
  
  // Save the comprehensive catalog
  const outputPath = path.join(__dirname, '../data/comprehensive-products.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalCatalog, null, 2));
  
  console.log('\n=== CATALOG COMPLETE ===');
  console.log(`Total products: ${finalCatalog.length}`);
  console.log(`Catalog saved to: ${outputPath}`);
  
  // Create summary
  console.log('\n=== PRODUCT SUMMARY ===');
  finalCatalog.forEach(product => {
    console.log(`- ${product.name} (${product.colors.length} colors, ${product.sizes.length} sizes)`);
  });
};

main().catch(console.error);