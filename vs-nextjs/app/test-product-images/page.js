'use client';

import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../lib/api';
import ProductCard from '../../components/ProductCard';

export default function TestProductImagesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Test with meeting-tables category
      const response = await productsAPI.filterByProperties({
        category: 'meeting-tables',
        limit: 6
      });
      
      console.log('🔍 Products API response:', response);
      
      if (response.success) {
        setProducts(response.data || []);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">🖼️ Product Images Test</h1>
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">🖼️ Product Images Test</h1>
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🖼️ Product Images Test</h1>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Testing the updated ProductCard component with real product images instead of color swatches.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Found {products.length} products from meeting-tables category
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
          />
        ))}
      </div>

      {/* Debug Info */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">🔍 Debug Information</h3>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product.id} className="bg-white p-4 rounded border">
              <h4 className="font-medium mb-2">
                {index + 1}. {product.name}
              </h4>
              <div className="text-sm space-y-1">
                <p><strong>ID:</strong> {product.id}</p>
                <p><strong>Legacy Image:</strong> {product.image || 'N/A'}</p>
                <p><strong>Images Array:</strong> {product.images ? `${product.images.length} images` : 'No images array'}</p>
                {product.images && product.images.length > 0 && (
                  <div className="mt-2">
                    <p><strong>Image URLs:</strong></p>
                    <ul className="list-disc list-inside ml-4 text-xs">
                      {product.images.slice(0, 3).map((img, i) => (
                        <li key={i}>{img.image_url}</li>
                      ))}
                      {product.images.length > 3 && <li>... and {product.images.length - 3} more</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">📋 What to Look For:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• <strong>Bottom left of each product:</strong> Should show small product images instead of colored squares</li>
          <li>• <strong>Image thumbnails:</strong> 24x24px with white border and shadow</li>
          <li>• <strong>Hover effect:</strong> Images should scale slightly on hover</li>
          <li>• <strong>Multiple images:</strong> Up to 4 images shown, with "+X" indicator if more exist</li>
          <li>• <strong>Fallback:</strong> If no images, the section should be hidden</li>
        </ul>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => window.location.href = '/products/category/meeting-tables'}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-4"
        >
          Go to Meeting Tables Category
        </button>
        <button
          onClick={fetchProducts}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Refresh Test
        </button>
      </div>
    </div>
  );
}
