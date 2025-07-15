import { NextResponse } from 'next/server';
import { products, findProductBySlug, getCollections, getTags } from '@/data/products/sync';

export async function GET() {
  try {
    const summary = {
      totalProducts: products.length,
      collections: getCollections(),
      totalTags: getTags().length,
      sampleProducts: products.slice(0, 3).map(p => ({
        slug: p.slug,
        name: p.name,
        collection: p.collection,
        price: p.price,
        colorCount: p.colors.length,
        variantCount: p.colors.reduce((sum, c) => sum + c.variants.length, 0)
      })),
      testFindBySlug: findProductBySlug('fisherman-beanie') ? 'Found beanie' : 'Beanie not found'
    };
    
    return NextResponse.json({
      success: true,
      summary,
      message: 'Products loaded successfully from JSON files'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}