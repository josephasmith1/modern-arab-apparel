const fs = require('fs');
const path = require('path');

// Read the current product data
const dataPath = path.join(__dirname, '../src/app/products/data.ts');
let content = fs.readFileSync(dataPath, 'utf8');

// Extract the products array from the TypeScript file
const productsMatch = content.match(/export const products[^=]*=([^;]+);/s);
if (!productsMatch) {
    console.error('Could not find products array in data.ts');
    process.exit(1);
}

let products;
try {
    // Remove TypeScript-specific syntax and parse as JSON
    const jsonString = productsMatch[1]
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":') // Quote object keys
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/'/g, '"'); // Replace single quotes with double quotes
    
    products = JSON.parse(jsonString);
} catch (error) {
    console.error('Error parsing products data:', error);
    process.exit(1);
}

// Function to scan for available images for a product
function getAvailableImages(productSlug) {
    const imagesDir = path.join(__dirname, '../public/images', productSlug);
    
    if (!fs.existsSync(imagesDir)) {
        console.log(`No images directory found for ${productSlug}`);
        return {};
    }
    
    const files = fs.readdirSync(imagesDir);
    const imagesByColor = {};
    
    files.forEach(file => {
        if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) return;
        
        // Parse filename to extract color and type
        // Format: {color}-{type}.jpg or {color}-{type}-{number}.jpg
        const parts = file.replace(/\.(jpg|jpeg|png|webp)$/i, '').split('-');
        
        let colorName, imageType, imageNumber;
        
        // Handle different filename patterns
        if (parts.length >= 2) {
            // For multi-word colors like "olive-green"
            if (parts.length >= 3 && (parts[parts.length - 1] === 'main' || parts[parts.length - 1] === 'back' || parts[parts.length - 1].startsWith('lifestyle'))) {
                imageType = parts[parts.length - 1];
                colorName = parts.slice(0, -1).join('-');
            } else if (parts.length >= 4 && parts[parts.length - 2].startsWith('lifestyle')) {
                imageType = parts[parts.length - 2];
                imageNumber = parts[parts.length - 1];
                colorName = parts.slice(0, -2).join('-');
            } else {
                colorName = parts[0];
                imageType = parts.slice(1).join('-');
            }
        }
        
        if (!colorName || !imageType) return;
        
        // Normalize color names
        const colorMap = {
            'faded-black': 'Faded Black',
            'faded-bone': 'Faded Bone', 
            'faded-green': 'Faded Green',
            'faded-khaki': 'Faded Khaki',
            'olive-green': 'Olive Green',
            'blue': 'Blue',
            'green': 'Green',
            'black': 'Black',
            'white': 'White',
            'maroon': 'Maroon',
            'beige': 'Beige',
            'olive': 'Olive',
            'khaki': 'Khaki'
        };
        
        const normalizedColor = colorMap[colorName] || colorName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        
        if (!imagesByColor[normalizedColor]) {
            imagesByColor[normalizedColor] = {
                main: '',
                back: '',
                lifestyle: []
            };
        }
        
        const imagePath = `/images/${productSlug}/${file}`;
        
        if (imageType === 'main') {
            imagesByColor[normalizedColor].main = imagePath;
        } else if (imageType === 'back') {
            imagesByColor[normalizedColor].back = imagePath;
        } else if (imageType.startsWith('lifestyle')) {
            imagesByColor[normalizedColor].lifestyle.push(imagePath);
        }
    });
    
    // Sort lifestyle images
    Object.keys(imagesByColor).forEach(color => {
        imagesByColor[color].lifestyle.sort();
    });
    
    return imagesByColor;
}

// Update each product with correct image mappings
let updatedCount = 0;

products.forEach(product => {
    const availableImages = getAvailableImages(product.slug);
    
    if (Object.keys(availableImages).length === 0) {
        console.log(`No images found for ${product.slug}`);
        return;
    }
    
    console.log(`Updating images for ${product.slug}...`);
    
    product.colors.forEach(color => {
        const colorImages = availableImages[color.name];
        
        if (colorImages) {
            // Update images if they exist
            if (colorImages.main) color.images.main = colorImages.main;
            if (colorImages.back) color.images.back = colorImages.back;
            if (colorImages.lifestyle.length > 0) color.images.lifestyle = colorImages.lifestyle;
            
            console.log(`  Updated ${color.name}: main=${!!colorImages.main}, back=${!!colorImages.back}, lifestyle=${colorImages.lifestyle.length}`);
            updatedCount++;
        } else {
            console.log(`  No images found for color: ${color.name}`);
        }
    });
});

// Convert back to TypeScript format and write to file
const updatedProductsJson = JSON.stringify(products, null, 2)
    .replace(/"([a-zA-Z_][a-zA-Z0-9_]*)"/g, '$1') // Remove quotes from object keys
    .replace(/"/g, '"'); // Keep string quotes

const newContent = content.replace(
    /export const products[^=]*=([^;]+);/s,
    `export const products: Product[] = ${updatedProductsJson};`
);

// Write the updated file
fs.writeFileSync(dataPath, newContent, 'utf8');

console.log(`\nImage mapping complete! Updated ${updatedCount} color variants across ${products.length} products.`);
console.log('Please verify the changes and test the application.');