import { NextResponse } from 'next/server';
import { products } from '@/data/products/sync';

export async function GET() {
  try {
    const slugs = products.map(p => p.slug);
    
    return NextResponse.json(slugs, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching product slugs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product slugs' },
      { status: 500 }
    );
  }
}