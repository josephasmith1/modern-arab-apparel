const fs = require('fs');
const path = require('path');

// Read the current data file
const dataFilePath = path.join(__dirname, 'src', 'app', 'products', 'data.ts');
let dataFileContent = fs.readFileSync(dataFilePath, 'utf8');

// Price corrections mapping
const priceCorrections = {
  'modern-arab-faded-tee': { price: '$45.00', originalPrice: '$45.00' },
  'modern-arab-hoodie': { price: '$60.00 - $70.00', originalPrice: '$60.00 - $70.00' },
  'modern-arab-joggers': { price: '$50.00 - $60.00', originalPrice: '$50.00 - $60.00' },
  'modern-arab-cap': { price: '$30.00', originalPrice: '$30.00' },
  'modern-arab-bucket-hat': { price: '$30.00', originalPrice: '$30.00' },
  'modern-arab-sweatpants': { price: '$60.00 - $70.00', originalPrice: '$60.00 - $70.00' },
  'modern-arab-crewneck': { price: '$45.00 - $60.00', originalPrice: '$45.00 - $60.00' },
  'modern-arab-cropped-hoodie': { price: '$65.00 - $75.00', originalPrice: '$65.00 - $75.00' }
};

// Apply corrections
Object.keys(priceCorrections).forEach(slug => {
  const { price, originalPrice } = priceCorrections[slug];
  
  // Fix price
  dataFileContent = dataFileContent.replace(
    new RegExp(`("slug": "${slug}"[\\s\\S]*?)"price": "\\$[0-9.]+( - \\$[0-9.]+)?"`),
    `$1"price": "${price}"`
  );
  
  // Fix original price
  dataFileContent = dataFileContent.replace(
    new RegExp(`("slug": "${slug}"[\\s\\S]*?)"originalPrice": "\\$[0-9.]+( - \\$[0-9.]+)?"`),
    `$1"originalPrice": "${originalPrice}"`
  );
});

// Fix pricing object for faded tee
dataFileContent = dataFileContent.replace(
  /"pricing": {\s*"S": "\$0\.45",\s*"M": "\$0\.45",\s*"L": "\$0\.45",\s*"XL": "\$0\.45",\s*"2XL": "\$0\.45",\s*"3XL": "\$0\.45"\s*}/,
  `"pricing": {
      "S": "$45.00",
      "M": "$45.00",
      "L": "$45.00",
      "XL": "$45.00",
      "2XL": "$45.00",
      "3XL": "$45.00"
    }`
);

// Write corrected data back
fs.writeFileSync(dataFilePath, dataFileContent);

console.log('✅ Price corrections applied successfully!');
console.log('✅ Data file updated with correct pricing.');