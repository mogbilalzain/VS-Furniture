'use client';

import { useState, useEffect } from 'react';
import { productImagesAPI } from '../lib/api';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  XMarkIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

export default function ProductImageGallery({ productId, product }) {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (productId) {
      fetchImages();
    }
  }, [productId]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await productImagesAPI.getProductImages(productId);
      
      if (response.success && response.data.length > 0) {
        setImages(response.data);
      } else {
        // Fallback to legacy image field
        if (product?.image) {
          setImages([{
            id: 'legacy',
            image_url: product.image,
            alt_text: product.name || 'Product image',
            is_primary: true
          }]);
        } else {
          setImages([{
            id: 'placeholder',
            image_url: '/images/placeholder-product.jpg',
            alt_text: 'Product placeholder',
            is_primary: true
          }]);
        }
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      // Fallback to legacy image or placeholder
      const fallbackImage = product?.image || '/images/placeholder-product.jpg';
      setImages([{
        id: 'fallback',
        image_url: fallbackImage,
        alt_text: product?.name || 'Product image',
        is_primary: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = '/images/placeholder-product.jpg';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];
  const hasMultipleImages = images.length > 1;

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative group">
          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
            <img
              src={currentImage?.image_url || '/images/placeholder-product.jpg'}
              alt={currentImage?.alt_text || 'Product image'}
              onError={handleImageError}
              className="w-full h-full object-contain cursor-pointer"
              onClick={() => openLightbox(currentImageIndex)}
            />
          </div>

          {/* Zoom Icon */}
          <button
            onClick={() => openLightbox(currentImageIndex)}
            className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Grid */}
        {hasMultipleImages && (
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentImageIndex(index)}
                className={`aspect-square bg-gray-50 rounded border-2 overflow-hidden transition-all ${
                  index === currentImageIndex 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text}
                  onError={handleImageError}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-gray-300 z-10"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 text-white text-lg z-10">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Main Lightbox Image */}
          <div className="relative max-w-5xl max-h-[90vh] mx-auto p-4">
            <img
              src={images[lightboxIndex]?.image_url}
              alt={images[lightboxIndex]?.alt_text}
              onError={handleImageError}
              className="max-w-full max-h-full object-contain"
            />

            {/* Navigation in Lightbox */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevLightboxImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-3 transition-all"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={nextLightboxImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-3 transition-all"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Strip in Lightbox */}
          {hasMultipleImages && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-md overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setLightboxIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                    index === lightboxIndex 
                      ? 'border-white' 
                      : 'border-transparent opacity-60 hover:opacity-80'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={image.alt_text}
                    onError={handleImageError}
                    className="w-full h-full object-contain bg-white bg-opacity-20"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Keyboard Navigation Instructions */}
          <div className="absolute bottom-6 right-6 text-white text-sm opacity-60">
            Use ← → arrow keys to navigate
          </div>
        </div>
      )}

      {/* Keyboard Navigation */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-40"
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevLightboxImage();
            if (e.key === 'ArrowRight') nextLightboxImage();
          }}
          tabIndex={0}
        />
      )}
    </>
  );
}