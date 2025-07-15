import { NextRequest, NextResponse } from 'next/server';
import { findProductBySlug } from '@/data/products/sync';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Product slug is required' },
        { status: 400 }
      );
    }
    
    const product = findProductBySlug(slug);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error loading product:', error);
    
    return NextResponse.json(
      { error: 'Failed to load product' },
      { status: 500 }
    );
  }
}