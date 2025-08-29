'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { authStorage } from '../../../lib/localStorage-utils';
import { productsAPI, categoriesAPI } from '../../../lib/api';
import ProductModalNew from '../../../components/admin/ProductModalNew';
import ProductCertificationsManager from '../../../components/admin/ProductCertificationsManager';
import ProductImagesManager from '../../../components/admin/ProductImagesManager';
import ProductMaterialsManager from '../../../components/admin/ProductMaterialsManager';

export default function AdminProducts() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // State for products data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // State for certifications modal
  const [showCertificationsModal, setShowCertificationsModal] = useState(false);
  const [selectedProductForCertifications, setSelectedProductForCertifications] = useState(null);

  // State for images modal
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [selectedProductForImages, setSelectedProductForImages] = useState(null);
  
  // State for materials modal
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [selectedProductForMaterials, setSelectedProductForMaterials] = useState(null);


  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Authentication check
  useEffect(() => {
    if (!authStorage.isAuthenticatedAdmin()) {
      console.log('❌ Products page - Not authenticated admin, redirecting...');
      router.replace('/admin/login');
    } else {
      console.log('✅ Products page - User is authenticated admin');
    }
  }, [router]);
  const [totalProducts, setTotalProducts] = useState(0);

  // Handle manage certifications
  const handleManageCertifications = (product) => {
    setSelectedProductForCertifications(product);
    setShowCertificationsModal(true);
  };

  const handleCloseCertificationsModal = () => {
    setShowCertificationsModal(false);
    setSelectedProductForCertifications(null);
  };

  // Handle manage images
  const handleManageImages = (product) => {
    setSelectedProductForImages(product);
    setShowImagesModal(true);
  };

  const handleCloseImagesModal = () => {
    setShowImagesModal(false);
    setSelectedProductForImages(null);
  };

  // Handle manage materials
  const handleManageMaterials = (product) => {
    setSelectedProductForMaterials(product);
    setShowMaterialsModal(true);
  };

  const handleCloseMaterialsModal = () => {
    setShowMaterialsModal(false);
    setSelectedProductForMaterials(null);
  };

  // Load products and categories
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const filters = {
        page: currentPage,
        limit: 10
      };

      if (searchQuery.trim()) filters.search = searchQuery;
      if (selectedCategory) filters.category = selectedCategory;
      if (selectedStatus) filters.status = selectedStatus;

      const response = await productsAPI.getAdminAll(filters);

      if (response.success) {
        setProducts(response.data || []);
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
          setTotalProducts(response.pagination.total);
        }
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadProducts();
    }
  }, [isAuthenticated, user, currentPage, searchQuery, selectedCategory, selectedStatus]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      loadCategories();
    }
  }, [isAuthenticated, user]);

  // Handle add product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Handle save product (add or edit)
  const handleSaveProduct = async (productData) => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Starting product save...');
      console.log('📄 Product data:', productData);
      console.log('✏️ Selected product:', selectedProduct);

      // التحقق من authentication قبل العملية
      const token = authStorage.getToken();
      const isAdminAuth = authStorage.isAuthenticatedAdmin();
      console.log('🔐 Auth check - Token exists:', !!token);
      console.log('🔐 Auth check - Is admin:', isAdminAuth);
      console.log('🔐 Auth check - User from context:', user);

      if (!token || !isAdminAuth) {
        throw new Error('Authentication required. Please login again.');
      }

      // Prepare data for API
      const apiData = {
        name: productData.name,
        description: productData.description,
        short_description: productData.short_description,
        specifications: productData.specifications,
        model: productData.model,
        sku: productData.sku,
        category_id: productData.category_id,
        image: productData.image,
        status: productData.status,
        is_featured: productData.is_featured,
        sort_order: productData.sort_order
      };

      let response;
      if (selectedProduct) {
        // Update existing product
        console.log('📝 Updating existing product...');
        response = await productsAPI.update(selectedProduct.id, apiData);
      } else {
        // Create new product
        console.log('➕ Creating new product...');
        response = await productsAPI.create(apiData);
      }

      console.log('📥 API Response:', response);

      if (response.success) {
        const productId = response.data?.id || selectedProduct?.id;
        
        // Save property values if any
        if (productData.property_values && Object.keys(productData.property_values).length > 0) {
          console.log('🔗 Saving property values...');
          try {
            // Flatten property values for API
            const propertyValueIds = [];
            Object.values(productData.property_values).forEach(valueIds => {
              propertyValueIds.push(...valueIds);
            });
            
            if (propertyValueIds.length > 0) {
              await productsAPI.updateProperties(productId, { property_value_ids: propertyValueIds });
              console.log('✅ Property values saved successfully');
            }
          } catch (propertyError) {
            console.error('❌ Error saving property values:', propertyError);
            // Don't fail the entire operation for property errors
          }
        }

        await loadProducts();
        setShowModal(false);
        setSelectedProduct(null);
        
        const successMessage = selectedProduct 
          ? '✅ Product updated successfully!' 
          : '🎉 Product created successfully!';
        alert(successMessage);
      } else {
        // Handle validation errors
        if (response.errors) {
          console.error('Validation errors:', response.errors);
          const errorMessages = Object.values(response.errors).flat().join(', ');
          setError(`Validation errors: ${errorMessages}`);
        } else {
          setError(response.message || 'Failed to save product');
        }
      }
    } catch (err) {
      console.error('Product save error:', err);
      setError(err.message || 'Failed to save product. An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (product) => {
    if (!confirm(`⚠️ Are you sure you want to delete the product "${product.name}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);

      // التحقق من authentication قبل العملية
      const token = authStorage.getToken();
      const isAdminAuth = authStorage.isAuthenticatedAdmin();
      console.log('🔐 Delete Auth check - Token exists:', !!token);
      console.log('🔐 Delete Auth check - Is admin:', isAdminAuth);

      if (!token || !isAdminAuth) {
        alert('Authentication required. Please login again.');
        router.push('/admin/login');
        return;
      }

      const response = await productsAPI.delete(product.id);
      
      if (response.success) {
        await loadProducts();
        alert('🗑️ Product deleted successfully!');
      } else {
        setError(response.message || 'Failed to delete product');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  // Authentication check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products" style={{ fontFamily: 'Quasimoda, Inter, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
    <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog</p>
        </div>
        <button 
          onClick={handleAddProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, model, or description..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="min-w-32">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadProducts}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Search
            </button>
            {(searchQuery || selectedCategory || selectedStatus) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedStatus('');
                  setCurrentPage(1);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="text-red-600">⚠️ {error}</div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-500 text-lg mb-4">📦 No products found</div>
            <p className="text-gray-400 mb-4">
              {searchQuery || selectedCategory || selectedStatus 
                ? 'No products match your search criteria.' 
                : 'No products have been created yet.'
              }
            </p>
          <button 
              onClick={handleAddProduct}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add First Product
          </button>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="col-span-3">Product</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Properties</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Created</div>
                <div className="col-span-2">Actions</div>
              </div>
        </div>
        
            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {products.map((product) => (
                <div key={product.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Product Info */}
                    <div className="col-span-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 object-cover rounded-lg"
                            src={product.image || "/products/product-tbale-1.jpg"}
                      alt={product.name}
                            onError={(e) => {
                              e.target.src = "/products/product-tbale-1.jpg";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {product.model && (
                            <div className="text-xs text-gray-500">Model: {product.model}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="col-span-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.category_name}
                      </span>
                    </div>

                    {/* Properties */}
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        {product.property_values && product.property_values.length > 0 ? (
                          product.property_values.slice(0, 3).map((value, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {value.display_name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No properties</span>
                        )}
                        {product.property_values && product.property_values.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{product.property_values.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                    </span>
                    </div>

                    {/* Created Date */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-500">
                        {new Date(product.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2">
                      <div className="flex space-x-2">
                      <button 
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Edit
                      </button>
                      <button 
                          onClick={() => handleManageCertifications(product)}
                          className="text-green-600 hover:text-green-900 text-sm font-medium"
                        >
                          Certifications
                      </button>
                      <button 
                          onClick={() => handleManageImages(product)}
                          className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                        >
                          Images
                      </button>
                      <button 
                          onClick={() => handleManageMaterials(product)}
                          className="text-orange-600 hover:text-orange-900 text-sm font-medium"
                        >
                          Materials
                      </button>
                      <button 
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Delete
                      </button>
                    </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalProducts)} of {totalProducts} products
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
        </div>
      </div>
    </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal */}
      <ProductModalNew
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
        categories={categories}
        loading={loading}
      />

      {/* Product Certifications Modal */}
      {showCertificationsModal && selectedProductForCertifications && (
        <ProductCertificationsManager
          productId={selectedProductForCertifications.id}
          productName={selectedProductForCertifications.name}
          onClose={handleCloseCertificationsModal}
        />
      )}

      {/* Product Images Modal */}
      {showImagesModal && selectedProductForImages && (
        <ProductImagesManager
          productId={selectedProductForImages.id}
          onClose={handleCloseImagesModal}
        />
      )}

      {/* Product Materials Modal */}
      {showMaterialsModal && selectedProductForMaterials && (
        <ProductMaterialsManager
          productId={selectedProductForMaterials.id}
          onClose={handleCloseMaterialsModal}
        />
      )}
    </div>
  );
}