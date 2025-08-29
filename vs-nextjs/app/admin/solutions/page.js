'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { apiClient } from '../../../lib/api';

const SolutionsManager = () => {
  const [solutions, setSolutions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSolution, setEditingSolution] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_image: '',
    is_active: true,
    product_ids: [],
    images: []
  });
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSolutions();
    fetchProducts();
  }, []);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/solutions');
      if (response.success) {
        setSolutions(response.data);
        console.log('✅ Solutions loaded:', response.data.length, 'items');
      }
    } catch (err) {
      console.error('❌ Error fetching solutions:', err);
      setError(err.message);
      
      // Fallback data for testing
      setSolutions([
        {
          id: 1,
          title: 'Modern Office Workspace',
          description: 'Create a contemporary office environment that promotes productivity and collaboration.',
          cover_image: '/images/placeholder-product.jpg',
          is_active: true,
          products_count: 5,
          images: [],
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Interactive Learning Environment',
          description: 'Transform traditional classrooms into dynamic learning spaces that engage students.',
          cover_image: '/images/placeholder-product.jpg',
          is_active: true,
          products_count: 8,
          images: [],
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      // Try the specific route first, fallback to general products if needed
      let response;
      try {
        response = await apiClient.get('/admin/solutions/available-products');
      } catch (routeError) {
        console.log('⚠️ Specific route failed, trying general products route');
        try {
          response = await apiClient.get('/admin/products');
        } catch (generalError) {
          console.log('⚠️ General products route also failed, using fallback data');
          // Use fallback data
          setProducts([
            { id: 1, name: 'Sample Product 1', category: { name: 'Desks' }, image: '/images/placeholder-product.jpg' },
            { id: 2, name: 'Sample Product 2', category: { name: 'Chairs' }, image: '/images/placeholder-product.jpg' },
            { id: 3, name: 'Sample Product 3', category: { name: 'Tables' }, image: '/images/placeholder-product.jpg' }
          ]);
          return;
        }
      }
      
      if (response && response.success) {
        setProducts(response.data);
        console.log('✅ Products loaded:', response.data.length, 'items');
      } else {
        console.log('⚠️ API response not successful, using fallback data');
        setProducts([
          { id: 1, name: 'Sample Product 1', category: { name: 'Desks' }, image: '/images/placeholder-product.jpg' },
          { id: 2, name: 'Sample Product 2', category: { name: 'Chairs' }, image: '/images/placeholder-product.jpg' },
          { id: 3, name: 'Sample Product 3', category: { name: 'Tables' }, image: '/images/placeholder-product.jpg' }
        ]);
      }
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      // Fallback: set sample data so the component doesn't break
      setProducts([
        { id: 1, name: 'Sample Product 1', category: { name: 'Desks' }, image: '/images/placeholder-product.jpg' },
        { id: 2, name: 'Sample Product 2', category: { name: 'Chairs' }, image: '/images/placeholder-product.jpg' },
        { id: 3, name: 'Sample Product 3', category: { name: 'Tables' }, image: '/images/placeholder-product.jpg' }
      ]);
    }
  };

  const handleAddNew = () => {
    setEditingSolution(null);
    setFormData({
      title: '',
      description: '',
      cover_image: '',
      is_active: true,
      product_ids: [],
      images: []
    });
    setSelectedCoverFile(null);
    setSelectedGalleryFiles([]);
    setShowModal(true);
  };

  const handleEdit = (solution) => {
    setEditingSolution(solution);
    setFormData({
      title: solution.title,
      description: solution.description,
      cover_image: solution.cover_image,
      is_active: solution.is_active,
      product_ids: solution.products ? solution.products.map(p => p.id) : [],
      images: solution.images || []
    });
    setSelectedCoverFile(null);
    setSelectedGalleryFiles([]);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this solution? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiClient.delete(`/admin/solutions/${id}`);
      if (response.success) {
        setSolutions(solutions.filter(s => s.id !== id));
        alert('Solution deleted successfully!');
      }
    } catch (err) {
      console.error('❌ Error deleting solution:', err);
      alert('Failed to delete solution: ' + err.message);
    }
  };

  const uploadImage = async (file, type = 'gallery') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    try {
      const response = await apiClient.postFormData('/admin/solutions/upload-image', formData);
      if (response.success) {
        return response.data.image_url;
      }
      throw new Error('Upload failed');
    } catch (err) {
      console.error('❌ Error uploading image:', err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let coverImageUrl = formData.cover_image;
      let galleryImages = [...formData.images];

      // رفع صورة الغلاف إذا تم اختيار صورة جديدة
      if (selectedCoverFile) {
        coverImageUrl = await uploadImage(selectedCoverFile, 'cover');
      }

      // رفع الصور الإضافية إذا تم اختيار صور جديدة
      if (selectedGalleryFiles.length > 0) {
        const uploadPromises = selectedGalleryFiles.map((file, index) => 
          uploadImage(file, 'gallery').then(url => ({
            image_path: url,
            alt_text: `${formData.title} - Image ${index + 1}`,
            sort_order: galleryImages.length + index + 1
          }))
        );
        const newImages = await Promise.all(uploadPromises);
        galleryImages = [...galleryImages, ...newImages];
      }

      const solutionData = {
        ...formData,
        cover_image: coverImageUrl,
        images: galleryImages
      };

      let response;
      if (editingSolution) {
        response = await apiClient.put(`/admin/solutions/${editingSolution.id}`, solutionData);
      } else {
        response = await apiClient.post('/admin/solutions', solutionData);
      }

      if (response.success) {
        await fetchSolutions();
        setShowModal(false);
        alert(editingSolution ? 'Solution updated successfully!' : 'Solution created successfully!');
      }
    } catch (err) {
      console.error('❌ Error saving solution:', err);
      alert('Failed to save solution: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleProductToggle = (productId) => {
    const currentIds = formData.product_ids;
    const newIds = currentIds.includes(productId)
      ? currentIds.filter(id => id !== productId)
      : [...currentIds, productId];
    
    setFormData({ ...formData, product_ids: newIds });
  };

  const removeGalleryImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading solutions...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Solutions Management</h1>
          <p className="text-gray-600">Manage your solutions and their associated products</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Solution
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={fetchSolutions}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Solutions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Solution
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {solutions.map((solution) => (
              <tr key={solution.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16">
                      {solution.cover_image ? (
                        <Image
                          src={solution.cover_image}
                          alt={solution.title}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{solution.title}</div>
                      <div className="text-sm text-gray-500">
                        {solution.description ? solution.description.substring(0, 60) + '...' : 'No description'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {solution.products_count || 0} products
                  </div>
                  <div className="text-sm text-gray-500">
                    {solution.images?.length || 0} images
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    solution.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {solution.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(solution.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(solution)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(solution.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {solutions.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No solutions</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new solution.</p>
            <div className="mt-6">
              <button
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Solution
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingSolution ? 'Edit Solution' : 'Add New Solution'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe this solution..."
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image
                </label>
                <div className="flex items-center space-x-4">
                  {formData.cover_image && (
                    <Image
                      src={formData.cover_image}
                      alt="Cover preview"
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedCoverFile(e.target.files[0])}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                {selectedCoverFile && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {selectedCoverFile.name}
                  </div>
                )}
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gallery Images
                </label>
                
                {/* Existing Images */}
                {formData.images.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image.image_path}
                            alt={image.alt_text || `Image ${index + 1}`}
                            width={100}
                            height={100}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setSelectedGalleryFiles(Array.from(e.target.files))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                {selectedGalleryFiles.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected {selectedGalleryFiles.length} new images
                  </div>
                )}
              </div>

              {/* Products Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Associated Products ({formData.product_ids.length} selected)
                </label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {products.map((product) => (
                      <label key={product.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.product_ids.includes(product.id)}
                          onChange={() => handleProductToggle(product.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center space-x-2 flex-1">
                          {product.image && (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={32}
                              height={32}
                              className="w-8 h-8 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.category?.name}</div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={uploading}
                >
                  {uploading ? 'Saving...' : (editingSolution ? 'Update Solution' : 'Create Solution')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionsManager;
