<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductImageController extends Controller
{
    /**
     * Get all images for a specific product
     */
    public function index($productId): JsonResponse
    {
        try {
            $product = Product::findOrFail($productId);
            
            $images = $product->activeImages()
                ->select('id', 'image_url', 'alt_text', 'title', 'sort_order', 'is_primary', 'is_featured', 'image_type', 'metadata')
                ->get()
                ->map(function ($image) {
                    return [
                        'id' => $image->id,
                        'image_url' => $image->full_image_url,
                        'alt_text' => $image->alt_text,
                        'title' => $image->title,
                        'sort_order' => $image->sort_order,
                        'is_primary' => $image->is_primary,
                        'is_featured' => $image->is_featured,
                        'image_type' => $image->image_type,
                        'dimensions' => $image->image_dimensions,
                        'size' => $image->formatted_size,
                        'metadata' => $image->metadata,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $images
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch product images',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload multiple images for a product
     */
    public function store(Request $request, $productId): JsonResponse
    {
        try {
            $request->validate([
                'images' => 'required|array|max:10',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp,svg|max:5120',
                'alt_texts' => 'sometimes|array',
                'alt_texts.*' => 'string|max:255',
                'titles' => 'sometimes|array',
                'titles.*' => 'string|max:255',
                'is_primary' => 'sometimes|boolean',
                'image_type' => 'sometimes|string|in:product,variant,detail,gallery'
            ]);

            $product = Product::findOrFail($productId);
            $uploadedImages = [];
            $altTexts = $request->get('alt_texts', []);
            $titles = $request->get('titles', []);
            $imageType = $request->get('image_type', 'product');

            foreach ($request->file('images') as $index => $image) {
                $filename = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                
                $uploadPath = 'images/products/' . $productId;
                if (!Storage::disk('public')->exists($uploadPath)) {
                    Storage::disk('public')->makeDirectory($uploadPath);
                }
                
                $imagePath = $image->storeAs($uploadPath, $filename, 'public');
                $imageUrl = '/storage/' . $imagePath;

                $fullPath = Storage::disk('public')->path($imagePath);
                $imageInfo = getimagesize($fullPath);
                $fileSize = filesize($fullPath);

                $productImage = ProductImage::create([
                    'product_id' => $productId,
                    'image_url' => $imageUrl,
                    'alt_text' => $altTexts[$index] ?? $product->name . ' - Image ' . ($index + 1),
                    'title' => $titles[$index] ?? $product->name,
                    'is_primary' => $index === 0 && $request->get('is_primary', false),
                    'image_type' => $imageType,
                    'metadata' => [
                        'width' => $imageInfo[0] ?? null,
                        'height' => $imageInfo[1] ?? null,
                        'size' => $fileSize,
                        'mime_type' => $imageInfo['mime'] ?? $image->getMimeType(),
                        'original_name' => $image->getClientOriginalName(),
                    ]
                ]);

                $uploadedImages[] = [
                    'id' => $productImage->id,
                    'image_url' => $productImage->full_image_url,
                    'alt_text' => $productImage->alt_text,
                    'title' => $productImage->title,
                    'sort_order' => $productImage->sort_order,
                    'is_primary' => $productImage->is_primary,
                    'image_type' => $productImage->image_type,
                    'dimensions' => $productImage->image_dimensions,
                    'size' => $productImage->formatted_size,
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $uploadedImages,
                'message' => 'Images uploaded successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload images',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update image details
     */
    public function update(Request $request, $productId, $imageId): JsonResponse
    {
        try {
            $request->validate([
                'alt_text' => 'sometimes|string|max:255',
                'title' => 'sometimes|string|max:255',
                'sort_order' => 'sometimes|integer|min:0',
                'is_primary' => 'sometimes|boolean',
                'is_featured' => 'sometimes|boolean',
                'is_active' => 'sometimes|boolean',
                'image_type' => 'sometimes|string|in:product,variant,detail,gallery'
            ]);

            $image = ProductImage::where('product_id', $productId)
                ->where('id', $imageId)
                ->firstOrFail();

            $image->update($request->only([
                'alt_text', 'title', 'sort_order', 'is_primary', 
                'is_featured', 'is_active', 'image_type'
            ]));

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $image->id,
                    'image_url' => $image->full_image_url,
                    'alt_text' => $image->alt_text,
                    'title' => $image->title,
                    'sort_order' => $image->sort_order,
                    'is_primary' => $image->is_primary,
                    'is_featured' => $image->is_featured,
                    'image_type' => $image->image_type,
                ],
                'message' => 'Image updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an image
     */
    public function destroy($productId, $imageId): JsonResponse
    {
        try {
            $image = ProductImage::where('product_id', $productId)
                ->where('id', $imageId)
                ->firstOrFail();

            $image->delete();

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Set an image as primary
     */
    public function setPrimary($productId, $imageId): JsonResponse
    {
        try {
            $image = ProductImage::where('product_id', $productId)
                ->where('id', $imageId)
                ->firstOrFail();

            $image->setPrimary();

            return response()->json([
                'success' => true,
                'message' => 'Primary image updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to set primary image',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}