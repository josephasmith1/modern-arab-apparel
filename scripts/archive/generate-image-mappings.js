const fs = require('fs');
const path = require('path');

// Function to scan for available images for a product
function getAvailableImages(productSlug) {
    const imagesDir = path.join(__dirname, '../public/images', productSlug);
    
    if (!fs.existsSync(imagesDir)) {
        return null;
    }
    
    const files = fs.readdirSync(imagesDir);
    const imagesByColor = {};
    
    files.forEach(file => {
        if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) return;
        
        // Parse filename to extract color and type
        const parts = file.replace(/\.(jpg|jpeg|png|webp)$/i, '').split('-');
        
        let colorName, imageType;
        
        // Handle different filename patterns
        if (parts.length >= 2) {
            // For multi-word colors like "olive-green"
            if (parts[parts.length - 1] === 'main' || parts[parts.length - 1] === 'back') {
                imageType = parts[parts.length - 1];
                colorName = parts.slice(0, -1).join('-');
            } else if (parts.length >= 3 && parts[parts.length - 2] === 'lifestyle') {
                imageType = 'lifestyle';
                colorName = parts.slice(0, -2).join('-');
            } else {
                // Handle cases like "lifestyle-1", "lifestyle-2"
                if (parts[parts.length - 2] && parts[parts.length - 2].startsWith('lifestyle')) {
                    imageType = 'lifestyle';
                    colorName = parts.slice(0, -2).join('-');
                } else {
                    colorName = parts[0];
                    imageType = parts.slice(1).join('-');
                }
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
        } else if (imageType.includes('lifestyle')) {
            imagesByColor[normalizedColor].lifestyle.push(imagePath);
        }
    });
    
    // Sort lifestyle images
    Object.keys(imagesByColor).forEach(color => {
        imagesByColor[color].lifestyle.sort();
    });
    
    return imagesByColor;
}

// Get all product directories
const imagesDir = path.join(__dirname, '../public/images');
const productDirs = fs.readdirSync(imagesDir).filter(dir => {
    return fs.statSync(path.join(imagesDir, dir)).isDirectory();
});

console.log('Found product directories:', productDirs);

// Generate mapping for each product
const mappings = {};
productDirs.forEach(productSlug => {
    const images = getAvailableImages(productSlug);
    if (images) {
        mappings[productSlug] = images;
        console.log(`\\n${productSlug}:`);
        Object.keys(images).forEach(color => {
            console.log(`  ${color}:`);
            console.log(`    main: ${images[color].main || 'none'}`);
            console.log(`    back: ${images[color].back || 'none'}`);
            console.log(`    lifestyle: [${images[color].lifestyle.join(', ')}]`);
        });
    }
});

// Save the mappings to a JSON file
fs.writeFileSync(
    path.join(__dirname, 'image-mappings.json'), 
    JSON.stringify(mappings, null, 2),
    'utf8'
);

console.log('\\nImage mappings saved to scripts/image-mappings.json');
console.log('Now I will update the specific problematic products manually...');