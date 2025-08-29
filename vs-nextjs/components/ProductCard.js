import React from 'react';
import Link from 'next/link';
import { DocumentIcon, StarIcon, EyeIcon } from '@heroicons/react/24/outline';

const ProductCard = ({ product, showProperties = true, className = "" }) => {
  const handleImageError = (e) => {
    e.target.src = '/images/placeholder-product.jpg';
  };

  // Mock color variants (since not in product data)
  const colorVariants = [
    { color: '#8B5A2B', image: '/products/variant1.jpg' },
    { color: '#D4AF37', image: '/products/variant2.jpg' },
    { color: '#C0C0C0', image: '/products/variant3.jpg' },
    { color: '#DAA520', image: '/products/variant4.jpg' }
  ];

  return (
    <div className={`bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group ${className}`}>
      {/* Product Image */}
      <div className="relative">
        {/* Favorite Icon */}
        <button className="absolute top-3 right-3 z-10 text-gray-400 hover:text-yellow-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.329 1.176l1.519 4.674c.3.921-.755 1.688-1.539 1.176l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.512-1.839-.255-1.539-1.176l1.519-4.674a1 1 0 00-.329-1.176l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69l1.519-4.674z"/>
          </svg>
        </button>

        <Link href={`/products/${product.id}`}>
          <img 
            src={product.image || '/images/placeholder-product.jpg'} 
            alt={product.name}
            onError={handleImageError}
            className="w-full h-64 object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </Link>

        {/* Color Variants */}
        <div className="absolute bottom-3 left-3 flex space-x-2">
          {colorVariants.slice(0, 4).map((variant, index) => (
            <div
              key={index}
              className="w-6 h-6 border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: variant.color }}
            />
          ))}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        {/* Model Number */}
        <div className="text-xs text-gray-500 mb-1">
          Model: {product.model || product.sku || 'N/A'}
        </div>
        
        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        {/* Product Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.short_description || product.description || 'No description available'}
        </p>
        
        {/* Product Specifications */}
        <div className="text-xs text-gray-500 mb-3">
          <div>W: 38.2" x D: 21.3"</div>
          <div>Available in 7 fixed heights or step height adjustable 23.25" - 32.3"</div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;