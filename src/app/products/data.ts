export interface Product {
  slug: string;
  name: string;
  price: string;
  originalPrice: string;
  description: string;
  fullDescription: string;
  features: string[];
  specifications: {
    material: string;
    weight: string;
    fit: string;
    origin: string;
  };
  sizeGuide: {
    size: string;
    length: string;
    chest: string;
    sleeve: string;
    lengthCm: string;
    chestCm: string;
    sleeveCm: string;
  }[];
  pricing?: Record<string, string>;
  colors: {
    name: string;
    swatch: string;
    hex: string;
    images: {
      main: string;
      back: string;
      lifestyle: string[];
    };
  }[];
}

export const products: Product[] = [
  {
    "slug": "modern-arab-faded-tee",
    "name": "Modern Arab Faded Tee",
    "price": "$45.00 - $55.00",
    "originalPrice": "$45.00 - $55.00",
    "description": "Premium quality apparel with modern Arabic design.",
    "fullDescription": "Rooted in meaning and made for movement, the Modern Arab Tee features the Arabic phrase \"ألآ تخافون من الله\" (Don’t you fear God?) across the back—a powerful rhetorical question meant to inspire reflection, not fear. More than a religious reminder, it’s a call to conscience, self-accountability, and spiritual responsibility—blending warning with love, guilt with redemption, and tradition with grace. This design challenges harmful stereotypes, reminding the world: Arabs are not what the world thinks they are—they are better. It reclaims the narrative through language, pride, and presence. Balanced by the clean \"Modern Arab\" and \"Los Angeles\" type, the design bridges heritage with hometown identity. Crafted from heavyweight carded cotton with a relaxed unisex fit, this tee pairs cultural depth with everyday comfort. Finished with the subtle \"MA\" logo on the front chest, it’s a staple piece that speaks volumes—without needing to shout. Unisex fit 100% premium carded cotton Arabic calligraphy designed by first-generation and native speakers Designed in Los Angeles Model wears size L Disclaimer: This tee runs Small. For the perfect oversized fit, we recommend ordering one larger than your usual size. • 100% carded cotton • Fabric weight: 7.1 oz. /yd. ² (240 g/m²) • Garment-dyed, pre-shrunk fabric • Boxy, oversized fit • Dropped shoulders • Wide neck ribbing • Tear-away label • Blank product sourced from China• Final product design &amp; printed in the USA Size guide LENGTH (inches) CHEST (inches) SLEEVE LENGTH (inches) S 27 ¾ 39 9 M 29 ⅛ 43 9 ½ L 30 ½ 47 9 ½ XL 31 ⅞ 51 10 ¼ 2XL 33 ¼ 55 10 ⅝ 3XL 34 59 11 LENGTH (cm) CHEST (cm) SLEEVE LENGTH (cm) S 70.5 99 23 M 74 109.2 24 L 77.5 119.4 24 XL 81 129.5 26 2XL 84.5 139.7 27 3XL 86.5 149.9 28",
    "features": [
      "Unisex fit",
      "Premium quality materials",
      "Modern Arabic branding",
      "Designed in Los Angeles",
      "Pre-shrunk fabric",
      "Oversized fit",
      "Arabic calligraphy designed by native speakers"
    ],
    "specifications": {
      "material": "100% carded cotton",
      "weight": "7.1 oz. /yd. ² (240 g/m²)",
      "fit": "Boxy, oversized fit",
      "origin": "Designed in Los Angeles, USA"
    },
    "sizeGuide": [
      {
        "size": "M",
        "length": "29 ⅛",
        "chest": "43",
        "sleeve": "9 ½",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "L",
        "length": "30 ½",
        "chest": "47",
        "sleeve": "9 ½",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "XL",
        "length": "31 ⅞",
        "chest": "51",
        "sleeve": "10 ¼",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "2XL",
        "length": "33 ¼",
        "chest": "55",
        "sleeve": "10 ⅝",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "3XL",
        "length": "34",
        "chest": "59",
        "sleeve": "11",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      }
    ],
    "colors": [
      {
        "name": "Faded Bone",
        "swatch": "bg-stone-200",
        "hex": "#E8E4E0",
        "images": {
          "main": "/images/modern-arab-faded-tee/faded-bone-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Faded Green",
        "swatch": "bg-teal-800",
        "hex": "#A4B5A0",
        "images": {
          "main": "/images/modern-arab-faded-tee/faded-green-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Faded  Khaki",
        "swatch": "bg-stone-500",
        "hex": "#C4A575",
        "images": {
          "main": "/images/modern-arab-faded-tee/faded--khaki-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Faded Black",
        "swatch": "bg-black",
        "hex": "#000000",
        "images": {
          "main": "/images/modern-arab-faded-tee/faded-black-1.jpg",
          "back": "",
          "lifestyle": []
        }
      }
    ],
    "pricing": {
      "S": "$45.00",
      "M": "$45.00",
      "L": "$45.00",
      "XL": "$45.00",
      "2XL": "$45.00",
      "3XL": "$45.00"
    }
  },
  {
    "slug": "modern-arab-hoodie",
    "name": "Modern Arab Hoodie",
    "price": "$60.00 - $70.00",
    "originalPrice": "$60.00 - $70.00",
    "description": "Premium quality apparel with modern Arabic design.",
    "fullDescription": "Rooted in meaning and made for movement, the Modern Arab Hoodie features the Arabic phrase \"ألآ تخافون من الله\" (Don’t you fear God?) across the back—a powerful rhetorical question meant to inspire reflection, not fear. More than a religious reminder, it’s a call to conscience, self-accountability, and spiritual responsibility—blending warning with love, guilt with redemption, and tradition with grace. This design challenges harmful stereotypes, reminding the world: Arabs are not what the world thinks they are—they are better. It reclaims the narrative through language, pride, and presence. Balanced by the clean \"Modern Arab\" and \"Los Angeles\" type, the design bridges heritage with hometown identity. Crafted from heavyweight carded cotton with a relaxed unisex fit, this tee pairs cultural depth with everyday comfort. Finished with the subtle \"MA\" logo on the front chest, it’s a staple piece that speaks volumes—without needing to shout. Unisex fit 100% premium cotton Arabic calligraphy designed by first-generation and native speakers Designed in Los Angeles Model wears size L Disclaimer: This hoodie runs small. For the perfect fit, we recommend ordering one size larger than your usual size.• 100% cotton face• 65% ring-spun cotton, 35% polyester• Front pouch pocket• Self-fabric patch on the back• Matching flat drawstrings• 3-panel hood• Blank product sourced from Pakistan• Final product designed and printed in the USA Size guide CHEST WIDTH (inches) LENGTH (inches) S 20 27 M 21 28 L 23 29 XL 25 30 2XL 26 ½ 31 3XL 28 32 CHEST WIDTH (cm) LENGTH (cm) S 50.8 68.6 M 53.3 71.1 L 58.4 73.7 XL 63.5 76.2 2XL 67.3 78.7 3XL 71.1 81.3",
    "features": [
      "Unisex fit",
      "Premium quality materials",
      "Modern Arabic branding",
      "Designed in Los Angeles",
      "100% premium cotton",
      "Arabic calligraphy designed by native speakers"
    ],
    "specifications": {
      "material": "100% cotton",
      "weight": "Heavyweight",
      "fit": "Relaxed unisex fit",
      "origin": "Designed in Los Angeles, USA"
    },
    "sizeGuide": [
      {
        "size": "S",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "M",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "L",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "2XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "3XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      }
    ],
    "colors": [
      {
        "name": "Bone",
        "swatch": "bg-stone-200",
        "hex": "#E8E4E0",
        "images": {
          "main": "/images/modern-arab-hoodie/bone-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Blue",
        "swatch": "bg-blue-400",
        "hex": "#87CEEB",
        "images": {
          "main": "/images/modern-arab-hoodie/blue-1.jpg",
          "back": "",
          "lifestyle": []
        }
      }
    ]
  },
  {
    "slug": "modern-arab-joggers",
    "name": "Modern Arab Joggers",
    "price": "$50.00 - $60.00",
    "originalPrice": "$50.00 - $60.00",
    "description": "Premium quality apparel with modern Arabic design.",
    "fullDescription": "The Modern Arab Fleece Joggers—where streetwear meets heritage. Designed for ultimate comfort and effortless style, these joggers are a staple for everyday wear. The subtle \"MA\" embroidery in soft grey represents the Modern Arab identity, blending cultural roots with contemporary fashion.Design Inspiration:Crafted to embody Modern Arab’s vision of redefining Arabic fashion, these joggers reflect a commitment to cultural pride and modern minimalism. The design brings a refined yet relaxed feel, offering a versatile piece that seamlessly complements any outfit.Features:• Premium Fabric: Soft, durable blend of cotton and polyester for all-day comfort.• Tailored Fit: Ribbed ankle cuffs and an elastic waistband with adjustable drawstrings for a perfect fit.• Functional Design: Side pockets and a back pocket for added practicality.• Subtle Branding: Elegant \"MA\" embroidery in soft grey, a signature of Modern Arab’s aesthetic.• Unisex Appeal: A versatile silhouette that fits seamlessly into any wardrobe.Why Choose the Modern Arab Joggers?More than just sweatpants, these joggers are a statement of Arab heritage reimagined through modern streetwear. Whether you’re out on the go or lounging at home, they embody the perfect balance of style, comfort, and cultural authenticity.Perfect For:• Those seeking high-quality, comfortable joggers with a modern aesthetic.• Supporters of LA-based brands championing Arab culture and inclusivity.• Streetwear lovers who appreciate minimalist, culturally inspired designs.Pair them with the Modern Arab Hoodie, Crewneck, or Cropped Hoodie for a complete look that represents who you are and where you come from.• 100% cotton face• 65% cotton, 35% polyester• Charcoal Heather is 55% cotton, 45% polyester• Tightly knit 3-end fleece• 5-thread stitching• Cuffed and side-seamed legs• Elastic inside the waistband• Flat drawstrings in a matching color• 2 cross pockets in front• 1 top-stitched patch pocket on the back of the right leg• Ribbed waist, cuffs, and gusset at crotch• Blank product sourced from Pakistan• Final product designed and printed in the USA Disclaimer: These joggers run small. For the perfect fit, we recommend ordering one size larger than your usual size. Size guide WAIST (inches) INSEAM LENGTH (inches) XS 28 28 S 30 29 M 32 30 L 34 31 XL 36 32 2XL 38 33 WAIST (cm) INSEAM LENGTH (cm) XS 71.1 71.1 S 76.2 73.7 M 81.3 76.2 L 86.4 78.7 XL 91.4 81.3 2XL 96.5 83.8",
    "features": [
      "Unisex fit",
      "Premium quality materials",
      "Modern Arabic branding",
      "Designed in Los Angeles",
      "100% premium cotton",
      "Premium fleece material"
    ],
    "specifications": {
      "material": "100% cotton",
      "weight": "Medium weight",
      "fit": "Relaxed unisex fit",
      "origin": "Designed in Los Angeles, USA"
    },
    "sizeGuide": [
      {
        "size": "S",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "M",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "L",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "2XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "3XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      }
    ],
    "colors": [
      {
        "name": "Olive Green",
        "swatch": "bg-green-800",
        "hex": "#556B2F",
        "images": {
          "main": "/images/modern-arab-joggers/olive-green-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Maroon",
        "swatch": "bg-red-900",
        "hex": "#800000",
        "images": {
          "main": "/images/modern-arab-joggers/maroon-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Black",
        "swatch": "bg-black",
        "hex": "#000000",
        "images": {
          "main": "/images/modern-arab-joggers/black-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "White",
        "swatch": "bg-white",
        "hex": "#FFFFFF",
        "images": {
          "main": "/images/modern-arab-joggers/white-1.jpg",
          "back": "",
          "lifestyle": []
        }
      }
    ]
  },
  {
    "slug": "modern-arab-cap",
    "name": "Modern Arab Cap",
    "price": "$30.00",
    "originalPrice": "$30.00",
    "description": "Premium quality apparel with modern Arabic design.",
    "fullDescription": "Featuring the Modern Arab Cap, a premium accessory that seamlessly blends minimalist design with bold, cultural significance. Crafted from 100% chino cotton twill, this cap embodies the Modern Arab spirit—stylish, inclusive, and forward-thinking.Design Inspiration:Featuring the iconic \"MA\" brand symbol in soft white embroidery, the cap represents a modern take on Arab identity—bold yet subtle, with a focus on representing Arab pride through contemporary style. Inspired by the values of the Modern Arab brand, this cap serves as a nod to cultural heritage while remaining sleek and versatile.Features:• Premium Quality Material: 100% chino cotton twill for durability and comfort.• Modern, Low-Profile Fit: Unstructured, 6-panel design with a relaxed silhouette for an effortlessly cool look.• Cultural Significance: Grey embroidery of the \"MA\" brand symbol, representing a modern, bold take on Arab identity.• Adjustable Strap: Antique buckle with adjustable fit for maximum comfort and style.• Versatile Style: Classic (color) finish makes it a perfect accessory for any outfit, from streetwear to casual days.Why Choose the Modern Arab Cap?As part of Modern Arab’s commitment to redefining cultural identity through fashion, this cap combines heritage with modern design. It’s more than just a cap; it’s a statement of pride, confidence, and inclusion. Perfect for individuals seeking a unique accessory that speaks to their cultural roots while embracing the future.Perfect For:• Those who appreciate minimalist, cultural fashion.• Streetwear enthusiasts looking for bold accessories with meaning.• Supporters of LA-based brands celebrating diversity and modern Arab identity.Make a statement with the Modern Arab Cap—where culture, style, and modern identity converge.• 100% chino cotton twill• Green Camo color is 35% chino cotton twill, 65% polyester• Unstructured, 6-panel, low-profile• 6 embroidered eyelets• 3 ⅛\" (7.6 cm) crown• Adjustable strap with antique buckle• Blank product sourced from Vietnam or Bangladesh• Final product designed and printed in the USA Size guide A (inches) B (inches) C (inches) D (inches) One size 20 ½-24 ⅜ 4 ¾ 3 ⅛ 7 ½ A (cm) B (cm) C (cm) D (cm) One size 52-62 12 8 19",
    "features": [
      "Unisex fit",
      "Premium quality materials",
      "Modern Arabic branding",
      "Designed in Los Angeles"
    ],
    "specifications": {
      "material": "Premium quality blend",
      "weight": "Medium weight",
      "fit": "Relaxed unisex fit",
      "origin": "Designed in Los Angeles, USA"
    },
    "sizeGuide": [
      {
        "size": "S",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "M",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "L",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "2XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "3XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      }
    ],
    "colors": [
      {
        "name": "Khaki",
        "swatch": "bg-stone-500",
        "hex": "#C4A575",
        "images": {
          "main": "/images/modern-arab-cap/khaki-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Blue",
        "swatch": "bg-blue-400",
        "hex": "#87CEEB",
        "images": {
          "main": "/images/modern-arab-cap/blue-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Green",
        "swatch": "bg-teal-800",
        "hex": "#A4B5A0",
        "images": {
          "main": "/images/modern-arab-cap/green-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Black",
        "swatch": "bg-black",
        "hex": "#000000",
        "images": {
          "main": "/images/modern-arab-cap/black-1.jpg",
          "back": "",
          "lifestyle": []
        }
      }
    ]
  },
  {
    "slug": "modern-arab-bucket-hat",
    "name": "Modern Arab Bucket Hat",
    "price": "$30.00",
    "originalPrice": "$30.00",
    "description": "Premium quality apparel with modern Arabic design.",
    "fullDescription": "Make a bold statement with the Modern Arab Bucket Hat, a modern twist on a classic design. Featuring the iconic \"MA\" brand symbol in soft grey embroidery, this bucket hat represents Modern Arab’s commitment to style, culture, and quality. Crafted from 100% cotton twill, this eco-friendly bucket hat combines comfort with street-savvy appeal.Design Inspiration:The Modern Arab Bucket Hat features sleek white embroidery of the \"MA\" logo, a minimalist design that captures modern Arab identity in a way that’s both timeless and contemporary. Inspired by urban culture and designed to be versatile, this hat is perfect for casual outings or adding a touch of street style to any outfit.Features:• Premium Material: 100% cotton twill for breathable, lightweight comfort.• Stylish &amp; Functional: 6 embroidered eyelets for ventilation, keeping you cool throughout the day.• Cultural Significance: Grey embroidery of the \"MA\" logo, a symbol of modern Arab identity.• Sleek Design: (Color) base with minimalist branding for effortless style.• Eco-Friendly Choice: Crafted from organic cotton, combining sustainability with modern fashion.Why Choose the Modern Arab Bucket Hat?This bucket hat isn’t just an accessory; it’s a statement of cultural pride, urban style, and sustainability. Perfect for those who want to make a stylish impact while supporting a brand that blends heritage and contemporary fashion.Perfect For:• Cultural fashion enthusiasts looking for minimalist streetwear.• Those seeking eco-friendly fashion accessories with meaning.• Fans of LA-based brands shaping modern Arab identity.• Make a bold move with the Modern Arab Bucket Hat—where style, sustainability, and cultural pride meet.• 100% cotton twill• 6 embroidered eyelets• Blank product sourced from China• Final product designed and printed in USA Size guide A (inches) B (inches) C (inches) One size 24 3 ½ 2 A (cm) B (cm) C (cm) One size 61 8.9 5",
    "features": [
      "Unisex fit",
      "Premium quality materials",
      "Modern Arabic branding",
      "Designed in Los Angeles",
      "100% premium cotton"
    ],
    "specifications": {
      "material": "100% cotton",
      "weight": "Lightweight",
      "fit": "Unisex fit",
      "origin": "Designed in Los Angeles, USA"
    },
    "sizeGuide": [
      {
        "size": "S",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "M",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "L",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "2XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "3XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      }
    ],
    "colors": [
      {
        "name": "Olive",
        "swatch": "bg-green-800",
        "hex": "#556B2F",
        "images": {
          "main": "/images/modern-arab-bucket-hat/olive-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Blue",
        "swatch": "bg-blue-400",
        "hex": "#87CEEB",
        "images": {
          "main": "/images/modern-arab-bucket-hat/blue-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Black",
        "swatch": "bg-black",
        "hex": "#000000",
        "images": {
          "main": "/images/modern-arab-bucket-hat/black-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Khaki",
        "swatch": "bg-stone-500",
        "hex": "#C4A575",
        "images": {
          "main": "/images/modern-arab-bucket-hat/khaki-1.jpg",
          "back": "",
          "lifestyle": []
        }
      }
    ]
  },
  {
    "slug": "modern-arab-sweatpants",
    "name": "Modern Arab Sweatpants",
    "price": "$60.00 - $70.00",
    "originalPrice": "$60.00 - $70.00",
    "description": "Premium quality apparel with modern Arabic design.",
    "fullDescription": "The Modern Arab Dyed Sweatpants—where streetwear meets heritage. Designed for ultimate comfort and effortless style, these sweats are a staple for everyday wear. The subtle \"MA\" embroidery in soft white represents the Modern Arab identity, blending cultural roots with contemporary fashion.Design Inspiration:Crafted to embody Modern Arab’s vision of redefining Arabic fashion, these sweats reflect a commitment to cultural pride and modern minimalism. The design brings a refined yet relaxed feel, offering a versatile piece that seamlessly complements any outfit.Features:• Premium Fabric: Soft, durable blend of cotton face and polyester for all-day comfort.• Tailored Fit: Ribbed ankle cuffs and an elastic waistband with adjustable drawstrings for a perfect fit.• Functional Design: Side woven pockets and a back woven pocket for added practicality.• Subtle Branding: Elegant \"MA\" embroidery in soft white, a signature of Modern Arab’s aesthetic.• Unisex Appeal: A versatile silhouette that fits seamlessly into any wardrobe.Why Choose the Modern Arab Sweatpants?More than just sweatpants, these sweats are a statement of Arab heritage reimagined through modern streetwear. Whether you’re out on the go or lounging at home, they embody the perfect balance of style, comfort, and cultural authenticity.Perfect For:• Those seeking high-quality, comfortable sweatpants with a modern aesthetic.• Supporters of LA-based brands championing Arab culture and inclusivity.• Streetwear lovers who appreciate minimalist, culturally inspired designs.Pair them with the Modern Arab Hoodie, Crewneck, or Crop Hoodie for a complete look that represents who you are and where you come from.• 80% ring-spun cotton and 20% polyester• 100% cotton face• Yarn diameter: 30 singles• Fabric weight: 9 oz./yd² (305.15 g/m²)• Relaxed fit• Sewn eyelets and fly detail• Elastic waistband • Flat, color-matching drawstrings• 1x1 rib at ankle cuffs• Jersey-lined slash pockets• Back pocket• Woven label• Blank product sourced from China• Final product designed and printed in the USA Size guide WAIST (inches) INSEAM LENGTH (inches) S 28-31 29 ½ M 31-33 30 L 33-35 30 XL 35-38 30 ½ 2XL 38-42 30 ½ WAIST (cm) INSEAM LENGTH (cm) S 71.1-78.7 75 M 78.7-83.8 76.2 L 83.8-89 76.2 XL 89-96.5 77.5 2XL 96.5-106.7 77.5",
    "features": [
      "Unisex fit",
      "Premium quality materials",
      "Modern Arabic branding",
      "Designed in Los Angeles",
      "100% premium cotton"
    ],
    "specifications": {
      "material": "100% cotton",
      "weight": "Medium weight",
      "fit": "Relaxed unisex fit",
      "origin": "Designed in Los Angeles, USA"
    },
    "sizeGuide": [
      {
        "size": "S",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "M",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "L",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "2XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "3XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      }
    ],
    "colors": [
      {
        "name": "Light Green",
        "swatch": "bg-green-800",
        "hex": "#556B2F",
        "images": {
          "main": "/images/modern-arab-sweatpants/light-green-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Light Blue",
        "swatch": "bg-blue-500",
        "hex": "#4F81BD",
        "images": {
          "main": "/images/modern-arab-sweatpants/light-blue-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Light Black",
        "swatch": "bg-black",
        "hex": "#000000",
        "images": {
          "main": "/images/modern-arab-sweatpants/light-black-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Dark Blue",
        "swatch": "bg-blue-500",
        "hex": "#4F81BD",
        "images": {
          "main": "/images/modern-arab-sweatpants/dark-blue-1.jpg",
          "back": "",
          "lifestyle": []
        }
      }
    ]
  },
  {
    "slug": "modern-arab-crewneck",
    "name": "Modern Arab Crewneck",
    "price": "$45.00 - $60.00",
    "originalPrice": "$45.00 - $60.00",
    "description": "Premium quality apparel with modern Arabic design.",
    "fullDescription": "Rooted in meaning and made for movement, the Modern Arab Crewneck features the Arabic phrase \"ألآ تخافون من الله\" (Don’t you fear God?) across the back—a powerful rhetorical question meant to inspire reflection, not fear. More than a religious reminder, it’s a call to conscience, self-accountability, and spiritual responsibility—blending warning with love, guilt with redemption, and tradition with grace. This design challenges harmful stereotypes, reminding the world: Arabs are not what the world thinks they are—they are better. It reclaims the narrative through language, pride, and presence. Balanced by the clean \"Modern Arab\" and \"Los Angeles\" type, the design bridges heritage with hometown identity. Crafted from heavyweight carded cotton with a relaxed unisex fit, this tee pairs cultural depth with everyday comfort. Finished with the subtle \"MA\" logo on the front chest, it’s a staple piece that speaks volumes—without needing to shout. Unisex fit 100% premium cotton face Arabic calligraphy designed by first-generation and native speakers Designed in Los Angeles Model wears size L Disclaimer: This crewneck runs Small. For the perfect fit, we recommend ordering one larger than your usual size.• 100% cotton face• 65% cotton, 35% polyester• Charcoal Heather is 55% cotton, 45% polyester• Fabric weight: 8.5 oz/y² (288.2 g/m²)• Tightly knit 3-end fleece • Side-seamed construction• Self-fabric patch on the back• Double-needle stitched rib collar, cuffs, and hem• Blank product sourced from Pakistan• Final product designed and printed in the USA Size guide BODY LENGTH (inches) CHEST WIDTH (inches) SLEEVE LENGTH (inches) S 27 20 23 ½ M 28 21 24 L 29 23 24 XL 30 25 24 2XL 31 26 ½ 24 3XL 32 28 24 BODY LENGTH (cm) CHEST WIDTH (cm) SLEEVE LENGTH (cm) S 68.6 50.8 59.7 M 71.1 53.3 61 L 73.7 58.4 61 XL 76.2 63.5 61 2XL 78.7 67.3 61 3XL 81.3 71.1 61",
    "features": [
      "Unisex fit",
      "Premium quality materials",
      "Modern Arabic branding",
      "Designed in Los Angeles",
      "100% premium cotton",
      "Premium fleece material",
      "Arabic calligraphy designed by native speakers"
    ],
    "specifications": {
      "material": "100% cotton",
      "weight": "Heavyweight",
      "fit": "Relaxed unisex fit",
      "origin": "Designed in Los Angeles, USA"
    },
    "sizeGuide": [
      {
        "size": "M",
        "length": "28",
        "chest": "21",
        "sleeve": "24",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "L",
        "length": "29",
        "chest": "23",
        "sleeve": "24",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "XL",
        "length": "30",
        "chest": "25",
        "sleeve": "24",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "2XL",
        "length": "31",
        "chest": "26 ½",
        "sleeve": "24",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "3XL",
        "length": "32",
        "chest": "28",
        "sleeve": "24",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      }
    ],
    "colors": [
      {
        "name": "Green",
        "swatch": "bg-teal-800",
        "hex": "#A4B5A0",
        "images": {
          "main": "/images/modern-arab-crewneck/green-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Vintage Black",
        "swatch": "bg-black",
        "hex": "#000000",
        "images": {
          "main": "/images/modern-arab-crewneck/vintage-black-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "White",
        "swatch": "bg-white",
        "hex": "#FFFFFF",
        "images": {
          "main": "/images/modern-arab-crewneck/white-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Black",
        "swatch": "bg-black",
        "hex": "#000000",
        "images": {
          "main": "/images/modern-arab-crewneck/black-1.jpg",
          "back": "",
          "lifestyle": []
        }
      }
    ]
  },
  {
    "slug": "modern-arab-cropped-hoodie",
    "name": "Modern Arab Cropped Hoodie",
    "price": "$65.00 - $75.00",
    "originalPrice": "$65.00 - $75.00",
    "description": "Premium quality apparel with modern Arabic design.",
    "fullDescription": "Rooted in meaning and made for movement, the Modern Arab Cropped Hoodie features the Arabic phrase \"ألآ تخافون من الله\" (Don’t you fear God?) across the back—a powerful rhetorical question meant to inspire reflection, not fear. More than a religious reminder, it’s a call to conscience, self-accountability, and spiritual responsibility—blending warning with love, guilt with redemption, and tradition with grace. This design challenges harmful stereotypes, reminding the world: Arabs are not what the world thinks they are—they are better. It reclaims the narrative through language, pride, and presence. Balanced by the clean \"Modern Arab\" and \"Los Angeles\" type, the design bridges heritage with hometown identity. Crafted from heavyweight carded cotton with a relaxed unisex fit, this tee pairs cultural depth with everyday comfort. Finished with the subtle \"MA\" logo on the front chest, it’s a staple piece that speaks volumes—without needing to shout. Unisex fit 100% premium cotton Arabic calligraphy designed by first-generation and native speakers Designed in Los Angeles Model in olive wears size M Model in black wears size L Disclaimer: This cropped hoodie runs true to size. For the perfect fit, we recommend ordering your usual size. • 52% airlume combed and ring-spun cotton, 48% poly fleece• Fabric weight: 6.5 oz/yd² (220.39 g/m²)• Dyed-to-match drawstrings• Dropped shoulder cut• Cropped body with a raw hem• Blank product sourced from Mexico, Nicaragua or the United States• Final product designed and printed in the USA Size guide WIDTH (inches) LENGTH (inches) S 22 18 ⅝ M 23 ½ 19 ⅜ L 25 ½ 21 ⅜ XL 27 ½ 22 ⅛ 2XL 29 ½ 22 ⅞ WIDTH (cm) LENGTH (cm) S 55.9 47.2 M 59.7 49.3 L 64.8 54.4 XL 69.9 56.1 2XL 75 58.2",
    "features": [
      "Unisex fit",
      "Premium quality materials",
      "Modern Arabic branding",
      "Designed in Los Angeles",
      "Premium fleece material",
      "Arabic calligraphy designed by native speakers"
    ],
    "specifications": {
      "material": "Premium fleece cotton blend",
      "weight": "Heavyweight",
      "fit": "Relaxed unisex fit",
      "origin": "Designed in Los Angeles, USA"
    },
    "sizeGuide": [
      {
        "size": "S",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "M",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "L",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "2XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      },
      {
        "size": "3XL",
        "length": "N/A",
        "chest": "N/A",
        "sleeve": "N/A",
        "lengthCm": "N/A",
        "chestCm": "N/A",
        "sleeveCm": "N/A"
      }
    ],
    "colors": [
      {
        "name": "Black",
        "swatch": "bg-black",
        "hex": "#000000",
        "images": {
          "main": "/images/modern-arab-cropped-hoodie/black-1.jpg",
          "back": "",
          "lifestyle": []
        }
      },
      {
        "name": "Olive Green",
        "swatch": "bg-green-800",
        "hex": "#556B2F",
        "images": {
          "main": "/images/modern-arab-cropped-hoodie/olive-green-1.jpg",
          "back": "",
          "lifestyle": []
        }
      }
    ]
  }
];