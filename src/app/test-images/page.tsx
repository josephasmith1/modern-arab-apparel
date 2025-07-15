import { loadAllProducts } from '@/lib/product-loader';

export default async function TestImagesPage() {
  const products = await loadAllProducts();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Product Image Analysis</h1>
      <p className="mb-4">Total products: {products.length}</p>
      
      <div className="space-y-8">
        {products.map(product => (
          <div key={product.slug} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{product.name} ({product.slug})</h2>
            <p className="text-sm text-gray-600 mb-2">Colors: {product.colors.length}</p>
            
            <div className="space-y-4">
              {product.colors.map((color, idx) => {
                const hasLocalImages = 
                  color.images.main.startsWith('/images/') ||
                  color.images.back.startsWith('/images/') ||
                  color.images.lifestyle.some(img => img.startsWith('/images/'));
                
                return (
                  <div key={idx} className="ml-4 p-2 bg-gray-50 rounded">
                    <h3 className="font-medium">{color.name} {hasLocalImages ? '✓' : '✗'}</h3>
                    <ul className="text-sm space-y-1 mt-2">
                      <li>Main: <code className="text-xs bg-gray-200 px-1">{color.images.main}</code></li>
                      <li>Back: <code className="text-xs bg-gray-200 px-1">{color.images.back}</code></li>
                      <li>Lifestyle: {color.images.lifestyle.map((img, i) => (
                        <code key={i} className="text-xs bg-gray-200 px-1 ml-1">{img}</code>
                      ))}</li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}