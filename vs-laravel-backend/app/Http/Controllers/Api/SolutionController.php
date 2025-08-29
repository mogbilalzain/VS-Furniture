<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Solution;
use App\Models\SolutionImage;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SolutionController extends Controller
{
    /**
     * عرض جميع الحلول (public)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->get('per_page', 10);
            $search = $request->get('search');

            $query = Solution::active()->withRelations();

            // البحث في العنوان والوصف
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            $solutions = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $solutions->items(),
                'pagination' => [
                    'current_page' => $solutions->currentPage(),
                    'last_page' => $solutions->lastPage(),
                    'per_page' => $solutions->perPage(),
                    'total' => $solutions->total(),
                    'has_more' => $solutions->hasMorePages()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch solutions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض جميع الحلول للادمن (تشمل غير النشطة)
     */
    public function adminIndex(): JsonResponse
    {
        try {
            $solutions = Solution::withRelations()
                ->withCount('products')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $solutions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch solutions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض حل محدد
     */
    public function show($id): JsonResponse
    {
        try {
            $solution = Solution::with(['images', 'products.category', 'products.images'])
                ->findOrFail($id);

            // جلب حلول أخرى مقترحة (عشوائية)
            $relatedSolutions = Solution::active()
                ->where('id', '!=', $id)
                ->inRandomOrder()
                ->limit(4)
                ->get(['id', 'title', 'cover_image']);

            return response()->json([
                'success' => true,
                'data' => [
                    'solution' => $solution,
                    'related_solutions' => $relatedSolutions
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Solution not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * إنشاء حل جديد
     */
    public function store(Request $request): JsonResponse
    {
        try {
            \Log::info('🔄 Creating solution', [
                'request_data' => $request->except(['images']),
                'user' => auth()->user() ? auth()->user()->id : 'no_user'
            ]);

            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'cover_image' => 'nullable|string',
                'is_active' => 'boolean',
                'product_ids' => 'nullable|array',
                'product_ids.*' => 'exists:products,id',
                'images' => 'nullable|array',
                'images.*.image_path' => 'required|string',
                'images.*.alt_text' => 'nullable|string',
                'images.*.sort_order' => 'nullable|integer'
            ]);

            DB::beginTransaction();

            // إنشاء الحل
            $solution = Solution::create([
                'title' => $request->title,
                'description' => $request->description,
                'cover_image' => $request->cover_image,
                'is_active' => $request->get('is_active', true)
            ]);

            // ربط المنتجات
            if ($request->has('product_ids')) {
                $solution->products()->sync($request->product_ids);
            }

            // إضافة الصور
            if ($request->has('images')) {
                foreach ($request->images as $imageData) {
                    SolutionImage::create([
                        'solution_id' => $solution->id,
                        'image_path' => $imageData['image_path'],
                        'alt_text' => $imageData['alt_text'] ?? null,
                        'sort_order' => $imageData['sort_order'] ?? 0
                    ]);
                }
            }

            DB::commit();

            $solution->load(['images', 'products']);
            
            \Log::info('✅ Solution created successfully', ['solution_id' => $solution->id]);

            return response()->json([
                'success' => true,
                'data' => $solution,
                'message' => 'Solution created successfully'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('❌ Failed to create solution', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create solution',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث حل
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $solution = Solution::findOrFail($id);

            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'cover_image' => 'nullable|string',
                'is_active' => 'boolean',
                'product_ids' => 'nullable|array',
                'product_ids.*' => 'exists:products,id',
                'images' => 'nullable|array',
                'images.*.image_path' => 'required|string',
                'images.*.alt_text' => 'nullable|string',
                'images.*.sort_order' => 'nullable|integer'
            ]);

            DB::beginTransaction();

            // تحديث بيانات الحل
            $solution->update([
                'title' => $request->title,
                'description' => $request->description,
                'cover_image' => $request->cover_image,
                'is_active' => $request->get('is_active', true)
            ]);

            // تحديث المنتجات المرتبطة
            if ($request->has('product_ids')) {
                $solution->products()->sync($request->product_ids);
            }

            // تحديث الصور (حذف القديمة وإضافة الجديدة)
            if ($request->has('images')) {
                // حذف الصور القديمة
                $solution->images()->delete();
                
                // إضافة الصور الجديدة
                foreach ($request->images as $imageData) {
                    SolutionImage::create([
                        'solution_id' => $solution->id,
                        'image_path' => $imageData['image_path'],
                        'alt_text' => $imageData['alt_text'] ?? null,
                        'sort_order' => $imageData['sort_order'] ?? 0
                    ]);
                }
            }

            DB::commit();

            $solution->load(['images', 'products']);

            return response()->json([
                'success' => true,
                'data' => $solution,
                'message' => 'Solution updated successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update solution',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف حل
     */
    public function destroy($id): JsonResponse
    {
        try {
            $solution = Solution::findOrFail($id);
            
            DB::beginTransaction();
            
            // حذف الصور المرتبطة (cascade delete سيتولى الأمر)
            // حذف ارتباطات المنتجات (cascade delete سيتولى الأمر)
            
            $solution->delete();
            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Solution deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete solution',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * رفع صورة للحل
     */
    public function uploadImage(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120', // 5MB max
                'type' => 'nullable|string|in:cover,gallery'
            ]);

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $type = $request->get('type', 'gallery');
                
                // تحديد مجلد الحفظ
                $folder = $type === 'cover' ? 'solutions/covers' : 'solutions/gallery';
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                
                // إنشاء المجلد إذا لم يكن موجوداً
                $uploadPath = public_path("images/{$folder}");
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }
                
                // نقل الملف
                $image->move($uploadPath, $imageName);
                
                // نسخ إلى مجلد Next.js أيضاً
                $nextjsPath = 'C:/Users/HP/Desktop/VS/vs-frontEnd/vs-nextjs/public/images/' . $folder . '/';
                if (!file_exists($nextjsPath)) {
                    mkdir($nextjsPath, 0755, true);
                }
                copy($uploadPath . '/' . $imageName, $nextjsPath . $imageName);
                
                $imageUrl = "/images/{$folder}/" . $imageName;
                
                return response()->json([
                    'success' => true,
                    'data' => [
                        'image_url' => $imageUrl,
                        'filename' => $imageName,
                        'type' => $type
                    ],
                    'message' => 'Image uploaded successfully'
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'No image file provided'
            ], 400);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * جلب المنتجات المتاحة للربط
     */
    public function getAvailableProducts(): JsonResponse
    {
        try {
            $products = Product::active()
                ->with('category')
                ->select('id', 'name', 'model', 'category_id', 'image')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}