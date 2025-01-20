import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  X,
  Package,
  Search,
  Filter,
  Plus,
  FileDown,
  Edit2,
  Trash2,
  Factory,
  Warehouse,
  Phone,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'received':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'Chờ xử lý';
    case 'received':
      return 'Đã nhận';
    case 'completed':
      return 'Hoàn thành';
    default:
      return 'Không xác định';
  }
};

const BatchListView = () => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    minTotalPrice: '',
    maxTotalPrice: '',
    dateStart: '',
    dateEnd: '',
    manufacturer_id: '',
    warehouse_id: '',
    page: 1,
    limit: 10,
  });

  // Fetch batches with filters
  const fetchBatches = async (useAllEndpoint = false) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();

      if (!useAllEndpoint) {
        // Only add these params for paginated endpoint
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }

      const endpoint = useAllEndpoint ? '/api/batches' : '/api/batches';
      const response = await fetch(
        `https://192.168.0.102:3000${endpoint}?${queryParams}`
      );

      if (!response.ok) throw new Error('Failed to fetch batches');

      const data = await response.json();

      if (data.success) {
        if (useAllEndpoint) {
          setBatches(data.data);
        } else {
          setBatches(data.data.batches);
          setPagination({
            currentPage: data.data.currentPage,
            totalPages: data.data.totalPages,
            totalItems: data.data.totalItems,
            itemsPerPage: data.data.itemsPerPage,
          });
        }
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [filters.page, filters.limit]);

  // Handle filter changes with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (filters.page !== 1) {
        setFilters((prev) => ({ ...prev, page: 1 }));
      } else {
        fetchBatches();
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [
    filters.search,
    filters.minTotalPrice,
    filters.maxTotalPrice,
    filters.dateStart,
    filters.dateEnd,
    filters.manufacturer_id,
    filters.warehouse_id,
  ]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleViewDetail = (batch) => {
    setSelectedBatch(batch);
    setShowDetail(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };
  const PaginationControls = () => (
    <div className='flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6'>
      <div className='flex items-center'>
        <p className='text-sm text-gray-700'>
          Hiển thị{' '}
          <span className='font-medium'>
            {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
          </span>{' '}
          -{' '}
          <span className='font-medium'>
            {Math.min(
              pagination.currentPage * pagination.itemsPerPage,
              pagination.totalItems
            )}
          </span>{' '}
          trong <span className='font-medium'>{pagination.totalItems}</span> kết
          quả
        </p>
      </div>
      <div className='flex items-center space-x-2'>
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-md ${
            pagination.currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft className='w-5 h-5' />
        </button>
        {/* Page numbers */}
        <div className='flex items-center space-x-2'>
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                pagination.currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-md ${
            pagination.currentPage === pagination.totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ChevronRightIcon className='w-5 h-5' />
        </button>
      </div>
    </div>
  );
  return (
    <div className='max-w-7xl mx-auto p-6'>
      {/* Header with actions */}
      <div className='flex flex-col space-y-4 mb-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold'>Danh Sách Lô Hàng</h2>
          <div className='flex space-x-3'>
            <button className='flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'>
              <Plus className='w-4 h-4 mr-2' />
              Thêm Lô Hàng
            </button>
            <button className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
              <FileDown className='w-4 h-4 mr-2' />
              Xuất CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className='flex space-x-4 items-center'>
          <div className='flex-1'>
            <div className='relative'>
              <input
                type='text'
                name='search'
                value={filters.search}
                onChange={handleFilterChange}
                placeholder='Tìm kiếm lô hàng...'
                className='w-full pl-10 pr-4 py-2 border rounded-lg'
              />
              <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50'
          >
            <Filter className='w-4 h-4 mr-2' />
            Bộ lọc
          </button>
        </div>

        {showFilters && (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Từ ngày
              </label>
              <input
                type='date'
                name='dateStart'
                value={filters.dateStart}
                onChange={handleFilterChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Đến ngày
              </label>
              <input
                type='date'
                name='dateEnd'
                value={filters.dateEnd}
                onChange={handleFilterChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Giá trị từ
              </label>
              <input
                type='number'
                name='minTotalPrice'
                value={filters.minTotalPrice}
                onChange={handleFilterChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Giá trị đến
              </label>
              <input
                type='number'
                name='maxTotalPrice'
                value={filters.maxTotalPrice}
                onChange={handleFilterChange}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
              />
            </div>
          </div>
        )}
      </div>

      {/* Loading and Error states */}
      {loading && (
        <div className='text-center py-4'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
        </div>
      )}

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative'>
          {error}
        </div>
      )}

      {/* Main Table */}
      <div className='overflow-x-auto bg-white rounded-lg shadow'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                Lô Hàng
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                Kho
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                Nhà Sản Xuất
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                Tổng SL
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                Tổng Giá Trị
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                Trạng Thái
              </th>
              <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase'>
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {batches.map((batch) => (
              <tr key={batch.batch_id} className='hover:bg-gray-50'>
                <td className='px-6 py-4'>
                  <div className='flex items-center'>
                    <Package className='h-5 w-5 text-gray-400 mr-2' />
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        {batch.batch_name}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {formatDate(batch.created_at)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex items-center'>
                    <Warehouse className='h-4 w-4 text-gray-400 mr-2' />
                    <div>
                      <div className='text-sm text-gray-900'>
                        {batch.warehouse.name}
                      </div>
                      <div className='text-xs text-gray-500'>
                        {batch.warehouse.address}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex items-center'>
                    <Factory className='h-4 w-4 text-gray-400 mr-2' />
                    <div>
                      <div className='text-sm text-gray-900'>
                        {batch.manufacturer.manufacturer_name}
                      </div>
                      <div className='flex items-center text-xs text-gray-500'>
                        <Phone className='h-3 w-3 mr-1' />
                        {batch.manufacturer.phone_number}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 text-sm text-gray-900'>
                  {batch.total_products.toLocaleString()}
                </td>
                <td className='px-6 py-4 text-sm text-gray-900'>
                  {formatCurrency(batch.total_price)}
                </td>
                <td className='px-6 py-4'>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(batch.status)}`}
                  >
                    {getStatusText(batch.status)}
                  </span>
                </td>
                <td className='px-6 py-4'>
                  <div className='flex justify-center space-x-2'>
                    <button
                      onClick={() => handleViewDetail(batch)}
                      className='text-blue-600 hover:text-blue-900'
                      title='Xem chi tiết'
                    >
                      <ChevronRight className='h-5 w-5' />
                    </button>
                    <button
                      className='text-yellow-600 hover:text-yellow-900'
                      title='Chỉnh sửa'
                    >
                      <Edit2 className='h-5 w-5' />
                    </button>
                    <button
                      className='text-red-600 hover:text-red-900'
                      title='Xóa'
                    >
                      <Trash2 className='h-5 w-5' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {showDetail && selectedBatch && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
          <div className='relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-xl font-bold'>
                Chi tiết lô hàng: {selectedBatch.batch_name}
              </h3>
              <button
                onClick={() => setShowDetail(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='h-6 w-6' />
              </button>
            </div>

            <div className='grid grid-cols-2 gap-4 mb-6'>
              <div>
                <p className='text-sm text-gray-600'>Kho:</p>
                <p className='font-medium'>{selectedBatch.warehouse.name}</p>
                <p className='text-sm text-gray-500'>
                  {selectedBatch.warehouse.address}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Nhà sản xuất:</p>
                <p className='font-medium'>
                  {selectedBatch.manufacturer.manufacturer_name}
                </p>
                <p className='text-sm text-gray-500'>
                  {selectedBatch.manufacturer.phone_number}
                </p>
              </div>
            </div>

            <div className='mt-4'>
              <h4 className='font-medium mb-2'>Danh sách sản phẩm</h4>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Mã SP
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Tên sản phẩm
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Số lượng
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Đơn giá
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {selectedBatch.items.map((item) => (
                      <tr key={item.id}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {item.product.product_code}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {item.product.product_name_vn}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {item.quantity.toLocaleString()}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {formatCurrency(parseFloat(item.unit_price))}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {formatCurrency(parseFloat(item.total_price))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className='bg-gray-50'>
                    <tr>
                      <td
                        colSpan='2'
                        className='px-6 py-4 text-sm font-medium text-gray-900'
                      >
                        Tổng cộng
                      </td>
                      <td className='px-6 py-4 text-sm font-medium text-gray-900'>
                        {selectedBatch.total_products.toLocaleString()}
                      </td>
                      <td className='px-6 py-4 text-sm font-medium text-gray-900'></td>
                      <td className='px-6 py-4 text-sm font-medium text-gray-900'>
                        {formatCurrency(selectedBatch.total_price)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Additional batch details */}
            <div className='mt-6 border-t pt-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-600'>Ngày nhận:</p>
                  <p className='font-medium'>
                    {formatDate(selectedBatch.received_date)}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Trạng thái:</p>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedBatch.status)}`}
                  >
                    {getStatusText(selectedBatch.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className='mt-6 flex justify-end space-x-3'>
              <button
                onClick={() => setShowDetail(false)}
                className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
              >
                Đóng
              </button>
              <button className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700'>
                Xuất PDF
              </button>
            </div>
          </div>
        </div>
      )}
      {!loading && !error && batches.length > 0 && <PaginationControls />}
    </div>
  );
};

export default BatchListView;
