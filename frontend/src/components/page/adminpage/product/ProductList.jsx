import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Eye, Filter, Search, X } from 'lucide-react';
import Pagination from '../../../common/Pagination';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 2,
    totalItems: 0,
    totalPages: 0,
  });

  // Fetch products from API
  const fetchProducts = async (filters = {}) => {
    try {
      // Construct query parameters
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString(),
      });

      // Add filters to query parameters
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }

      if (filters.priceRange && filters.priceRange !== 'all') {
        const [minPrice, maxPrice] = filters.priceRange.split('-').map(Number);
        params.append('minPrice', minPrice.toString());
        params.append('maxPrice', maxPrice.toString());
      }

      if (filters.dateRange?.start && filters.dateRange?.end) {
        params.append('dateStart', filters.dateRange.start);
        params.append('dateEnd', filters.dateRange.end);
      }

      if (filters.search) {
        params.append('search', filters.search);
      }

      if (filters.color && filters.color !== 'all') {
        params.append('color', filters.color);
      }

      const response = await fetch(
        `https://192.168.0.102:3000/api/products?${params.toString()}`
      );
      const result = await response.json();

      if (result.success) {
        setProducts(result.data.products);
        setFilteredProducts(result.data.products);
        setPagination((prev) => ({
          ...prev,
          totalItems: result.data.totalItems,
          totalPages: result.data.totalPages,
          currentPage: result.data.currentPage,
          itemsPerPage: result.data.itemsPerPage,
        }));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Update useEffect to use new fetchProducts function
  useEffect(() => {
    fetchProducts();
  }, [pagination.currentPage, pagination.itemsPerPage]);

  // Handle pagination changes
  const handlePageChange = (page, itemsPerPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
      itemsPerPage: itemsPerPage || prev.itemsPerPage,
    }));
  };

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const handleSearch = (value) => {
    setSearchQuery(value);
    applyFilters({ ...activeFilters, search: value });
  };

  const applyFilters = async (filters) => {
    const newActiveFilters = [];

    // Add filters to activeFilters array for UI display
    if (filters.status && filters.status !== 'all') {
      newActiveFilters.push({
        type: 'Trạng thái',
        value: filters.status === 'visible' ? 'Hiển thị' : 'Ẩn',
      });
    }

    if (filters.priceRange && filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      newActiveFilters.push({
        type: 'Giá',
        value: `${formatVND(min)}${max ? ` - ${formatVND(max)}` : '+'}`,
      });
    }

    if (filters.dateRange?.start && filters.dateRange?.end) {
      newActiveFilters.push({
        type: 'Ngày',
        value: `${formatDate(new Date(filters.dateRange.start))} - ${formatDate(new Date(filters.dateRange.end))}`,
      });
    }

    if (filters.search) {
      newActiveFilters.push({
        type: 'Tìm kiếm',
        value: filters.search,
      });
    }

    if (filters.color && filters.color !== 'all') {
      newActiveFilters.push({
        type: 'Màu sắc',
        value: filters.color,
      });
    }

    setActiveFilters(newActiveFilters);

    // Reset to first page when applying new filters
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));

    // Fetch filtered data from API
    await fetchProducts(filters);
  };

  const removeFilter = async (filterToRemove) => {
    const updatedFilters = activeFilters.filter(
      (filter) =>
        !(
          filter.type === filterToRemove.type &&
          filter.value === filterToRemove.value
        )
    );
    setActiveFilters(updatedFilters);

    // Create new filters object excluding the removed filter
    const newFilters = {};
    updatedFilters.forEach((filter) => {
      // Map filter type back to API parameter
      switch (filter.type) {
        case 'Trạng thái':
          newFilters.status =
            filter.value === 'Hiển thị' ? 'visible' : 'hidden';
          break;
        case 'Giá':
          // Parse price range from formatted string
          const prices = filter.value
            .split(' - ')
            .map((price) => parseFloat(price.replace(/[^\d]/g, '')));
          newFilters.priceRange = `${prices[0]}-${prices[1] || ''}`;
          break;
        // Add other filter types as needed
      }
    });

    if (updatedFilters.length === 0) {
      await fetchProducts();
    } else {
      await fetchProducts(newFilters);
    }
  };

  const clearAllFilters = async () => {
    setActiveFilters([]);
    setSearchQuery('');
    await fetchProducts();
  };

  // Get current products for pagination
  const indexOfLastProduct = pagination.currentPage * pagination.itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - pagination.itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className='w-full p-4'>
      <div className='bg-white rounded-lg shadow-md p-6'>
        {/* Header */}
        <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
          <h2 className='text-2xl font-bold'>Danh sách sản phẩm</h2>

          {/* Search Bar */}
          <div className='relative w-full md:w-96'>
            <input
              type='text'
              placeholder='Tìm kiếm sản phẩm...'
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className='w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
          </div>

          <div className='flex gap-4'>
            <button
              onClick={() => setShowFilterPanel(true)}
              className='px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center gap-2'
            >
              <Filter className='w-4 h-4' />
              Bộ lọc
            </button>
            <button className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
              Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className='mb-6'>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='text-sm text-gray-500'>
                Bộ lọc đang áp dụng:
              </span>
              {activeFilters.map((filter, index) => (
                <div
                  key={`${filter.type}-${index}`}
                  className='flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm'
                >
                  <span className='font-medium'>{filter.type}:</span>
                  <span>{filter.value}</span>
                  <button
                    onClick={() => removeFilter(filter)}
                    className='ml-1 hover:text-blue-900'
                  >
                    <X className='w-3 h-3' />
                  </button>
                </div>
              ))}
              <button
                onClick={clearAllFilters}
                className='text-sm text-gray-500 hover:text-gray-700'
              >
                Xóa tất cả
              </button>
            </div>
          </div>
        )}

        {/* Table Container with Horizontal Scroll */}
        <div className='overflow-x-auto'>
          <table className='min-w-full border-collapse'>
            <thead>
              <tr className='bg-gray-50'>
                <th className='p-4 text-left border-b whitespace-nowrap'>
                  Mã SP
                </th>
                <th className='p-4 text-left border-b whitespace-nowrap'>
                  Hình ảnh
                </th>
                <th className='p-4 text-left border-b whitespace-nowrap'>
                  Tên SP (EN/VN)
                </th>
                <th className='p-4 text-left border-b whitespace-nowrap'>
                  Kích thước
                </th>
                <th className='p-4 text-left border-b whitespace-nowrap'>
                  Giá bán
                </th>
                <th className='p-4 text-left border-b whitespace-nowrap'>
                  Ngày tạo
                </th>
                <th className='p-4 text-left border-b whitespace-nowrap'>
                  Màu sắc
                </th>
                <th className='p-4 text-left border-b whitespace-nowrap'>
                  Bảo hành
                </th>
                <th className='p-4 text-left border-b whitespace-nowrap'>
                  Chất liệu
                </th>
                <th className='p-4 text-left border-b whitespace-nowrap'>
                  Loại sản phẩm
                </th>
                <th className='p-4 text-left border-b whitespace-nowrap'>
                  Trạng thái
                </th>
                <th className='p-4 text-left border-b whitespace-nowrap'>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className='border-b hover:bg-gray-50'>
                  <td className='p-4 whitespace-nowrap'>
                    {product.product_code}
                  </td>
                  <td className='p-4'>
                    <img
                      src={
                        `${product.main_image}` ||
                        '/api/placeholder/48/48'
                      }
                      alt={product.product_name__en}
                      className='w-12 h-12 object-cover rounded'
                    />
                  </td>
                  <td className='p-4'>
                    <div className='min-w-[200px]'>
                      <p className='font-medium'>{product.product_name__en}</p>
                      <p className='text-sm text-gray-500'>
                        {product.product_name_vn}
                      </p>
                    </div>
                  </td>
                  <td className='p-4 whitespace-nowrap'>
                    <div className='text-sm'>
                      {`${product.length} × ${product.width} × ${product.height} cm`}
                    </div>
                  </td>
                  <td className='p-4 whitespace-nowrap'>
                    {product.price && formatVND(product.price)}
                  </td>
                  <td className='p-4 whitespace-nowrap'>
                    {formatDate(product.created_at)}
                  </td>
                  <td className='p-4 whitespace-nowrap'>{product.color}</td>
                  <td className='p-4 whitespace-nowrap'>
                    {product.warranty_period}
                  </td>
                  <td className='p-4 whitespace-nowrap'>{product.material}</td>
                  <td className='p-4 whitespace-nowrap'>
                    {product.productType.productType_name_vn}
                  </td>
                  <td className='p-4 whitespace-nowrap'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.visibility_status === 'visible'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.visibility_status === 'visible'
                        ? 'Hiển thị'
                        : 'Ẩn'}
                    </span>
                  </td>
                  <td className='p-4'>
                    <div className='flex gap-2 whitespace-nowrap'>
                      <button className='p-1.5 text-gray-600 hover:bg-gray-100 rounded'>
                        <Eye className='w-4 h-4' />
                      </button>
                      <button className='p-1.5 text-blue-600 hover:bg-blue-50 rounded'>
                        <Edit2 className='w-4 h-4' />
                      </button>
                      <button className='p-1.5 text-red-600 hover:bg-red-50 rounded'>
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='mt-4'>
          <Pagination
            totalItems={pagination.totalItems}
            itemsPerPageOptions={[
              '2 / trang',
              '5 / trang',
              '10 / trang',
              '20 / trang',
            ]}
            onPageChange={handlePageChange}
            currentPage={pagination.currentPage}
            itemsPerPage={pagination.itemsPerPage}
          />
        </div>

        {/* Show total items */}
        <div className='mt-4 text-sm text-gray-500'>
          Hiển thị {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{' '}
          -{' '}
          {Math.min(
            pagination.currentPage * pagination.itemsPerPage,
            pagination.totalItems
          )}
          trên tổng số {pagination.totalItems} sản phẩm
        </div>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50'>
          <div className='bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='text-lg font-semibold'>Bộ lọc nâng cao</h3>
              <button
                onClick={() => setShowFilterPanel(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Trạng thái
                </label>
                <select
                  onChange={(e) =>
                    applyFilters({ ...activeFilters, status: e.target.value })
                  }
                  className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
                >
                  <option value='all'>Tất cả trạng thái</option>
                  <option value='visible'>Hiển thị</option>
                  <option value='hidden'>Ẩn</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>
                  Loại sản phẩm
                </label>
                <select
                  onChange={(e) =>
                    applyFilters({ ...activeFilters, type: e.target.value })
                  }
                  className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
                >
                  <option value='all'>Tất cả loại</option>
                  <option value='retail'>Bán lẻ</option>
                  <option value='wholesale'>Bán sỉ</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>
                  Khu vực
                </label>
                <select
                  onChange={(e) =>
                    applyFilters({ ...activeFilters, location: e.target.value })
                  }
                  className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
                >
                  <option value='all'>Tất cả khu vực</option>
                  <option value='north'>Miền Bắc</option>
                  <option value='central'>Miền Trung</option>
                  <option value='south'>Miền Nam</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>
                  Khoảng giá
                </label>
                <select
                  onChange={(e) =>
                    applyFilters({
                      ...activeFilters,
                      priceRange: e.target.value,
                    })
                  }
                  className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
                >
                  <option value='all'>Tất cả giá</option>
                  <option value='0-2300000'>0 - 2.300.000đ</option>
                  <option value='2300000-11500000'>
                    2.300.000đ - 11.500.000đ
                  </option>
                  <option value='11500000-23000000'>
                    11.500.000đ - 23.000.000đ
                  </option>
                  <option value='23000000-999999999'>Trên 23.000.000đ</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div className='md:col-span-2 grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Từ ngày
                  </label>
                  <input
                    type='date'
                    onChange={(e) =>
                      applyFilters({
                        ...activeFilters,
                        dateRange: {
                          ...activeFilters.dateRange,
                          start: e.target.value,
                        },
                      })
                    }
                    className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Đến ngày
                  </label>
                  <input
                    type='date'
                    onChange={(e) =>
                      applyFilters({
                        ...activeFilters,
                        dateRange: {
                          ...activeFilters.dateRange,
                          end: e.target.value,
                        },
                      })
                    }
                    className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              {/* Material Filter */}
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Chất liệu
                </label>
                <select
                  onChange={(e) =>
                    applyFilters({ ...activeFilters, material: e.target.value })
                  }
                  className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
                >
                  <option value='all'>Tất cả chất liệu</option>
                  <option value='Wood'>Gỗ</option>
                  <option value='Metal'>Kim loại</option>
                  <option value='Glass'>Kính</option>
                  <option value='Plastic'>Nhựa</option>
                </select>
              </div>

              {/* Color Filter */}
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Màu sắc
                </label>
                <select
                  onChange={(e) =>
                    applyFilters({ ...activeFilters, color: e.target.value })
                  }
                  className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
                >
                  <option value='all'>Tất cả màu</option>
                  <option value='Brown'>Nâu</option>
                  <option value='Black'>Đen</option>
                  <option value='White'>Trắng</option>
                  <option value='Gray'>Xám</option>
                </select>
              </div>

              {/* Warranty Period Filter */}
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Bảo hành
                </label>
                <select
                  onChange={(e) =>
                    applyFilters({ ...activeFilters, warranty: e.target.value })
                  }
                  className='w-full p-2 border rounded focus:ring-2 focus:ring-blue-500'
                >
                  <option value='all'>Tất cả thời hạn</option>
                  <option value='0-12'>0-12 tháng</option>
                  <option value='13-24'>13-24 tháng</option>
                  <option value='25'>Trên 24 tháng</option>
                </select>
              </div>
            </div>

            <div className='flex justify-end gap-4'>
              <button
                onClick={() => {
                  setActiveFilters([]);
                  setFilteredProducts(products);
                  setShowFilterPanel(false);
                }}
                className='px-4 py-2 text-gray-600 border rounded hover:bg-gray-50'
              >
                Xóa bộ lọc
              </button>
              <button
                onClick={() => setShowFilterPanel(false)}
                className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
