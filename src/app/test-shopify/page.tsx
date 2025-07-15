import { products } from '@/data/products/sync';
import Image from 'next/image';

export default function TestShopifyPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Shopify Data Test</h1>
      
      <div className="space-y-8">
        {products.slice(0, 3).map((product) => (
          <div key={product.slug} className="border p-4">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p>Slug: {product.slug}</p>
            <p>Price: {product.price}</p>
            <p>Collection: {product.collection}</p>
            <p>Colors: {product.colors.length}</p>
            
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.colors.map((color) => (
                <div key={color.name} className="border p-2">
                  <p className="font-semibold">{color.name}</p>
                  <p>Sizes: {color.variants.length}</p>
                  {color.images.main && (
                    <div className="relative w-20 h-20 mt-2">
                      <Image
                        src={color.images.main}
                        alt={`${product.name} - ${color.name}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="text-xs">Main: {color.images.main || 'none'}</p>
                  <p className="text-xs">Lifestyle: {color.images.lifestyle.length}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}