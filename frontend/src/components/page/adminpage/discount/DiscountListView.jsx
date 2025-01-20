import { useState } from 'react';
import {
  Plus,
  FileDown,
  Search,
  Filter,
  Package,
  Edit2,
  Trash2,
  ChevronRight,
  X,
} from 'lucide-react';

const DiscountListView = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    target_type: '',
    date_from: '',
    date_to: '',
  });

  // Mock data - replace with API call
  const discounts = [
    {
      discount_id: 1,
      discount_code: 'SUMMER2024',
      discount_name: 'Summer Sale',
      discount_type: 'percentage',
      discount_value: 10,
      min_order_amount: 100000,
      max_discount_value: 50000,
      start_date: '2024-06-01',
      end_date: '2024-08-31',
      status: 'active',
      target_type: 'public',
      usage_limit: 100,
      products: [
        { id: 1, name: 'Product 1', price: 100000 },
        { id: 2, name: 'Product 2', price: 200000 },
      ],
      categories: [
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ],
    },
    // Add more mock data...
  ];

  const handleViewDetail = (discount) => {
    setSelectedDiscount(discount);
    setShowDetail(true);
  };

  const handleAddDiscount = () => {
    // Navigate to add discount form
  };

  const handleExportCSV = () => {
    // Export CSV logic
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='flex-1 p-8 bg-gray-50'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold'>Danh Sách Mã Giảm Giá</h2>
          <div className='flex space-x-3'>
            <button
              onClick={handleAddDiscount}
              className='flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'
            >
              <Plus className='w-4 h-4 mr-2' />
              Thêm Mã Giảm Giá
            </button>
            <button
              onClick={handleExportCSV}
              className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            >
              <FileDown className='w-4 h-4 mr-2' />
              Xuất CSV
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4'>
          <div className='flex-1 relative'>
            <input
              type='text'
              placeholder='Tìm kiếm theo mã hoặc tên...'
              className='w-full pl-10 pr-4 py-2 border rounded-lg'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className='w-5 h-5 text-gray-400 absolute left-3 top-2.5' />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50'
          >
            <Filter className='w-4 h-4 mr-2' />
            Bộ lọc
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg'>
            <select
              className='border rounded-lg px-3 py-2'
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value=''>Tất cả trạng thái</option>
              <option value='active'>Đang hoạt động</option>
              <option value='inactive'>Không hoạt động</option>
            </select>

            <select
              className='border rounded-lg px-3 py-2'
              value={filters.target_type}
              onChange={(e) =>
                setFilters({ ...filters, target_type: e.target.value })
              }
            >
              <option value=''>Tất cả đối tượng</option>
              <option value='public'>Công khai</option>
              <option value='private'>Riêng tư</option>
              <option value='specific_users'>Người dùng cụ thể</option>
            </select>

            <input
              type='date'
              className='border rounded-lg px-3 py-2'
              value={filters.date_from}
              onChange={(e) =>
                setFilters({ ...filters, date_from: e.target.value })
              }
              placeholder='Từ ngày'
            />

            <input
              type='date'
              className='border rounded-lg px-3 py-2'
              value={filters.date_to}
              onChange={(e) =>
                setFilters({ ...filters, date_to: e.target.value })
              }
              placeholder='Đến ngày'
            />
          </div>
        )}

        {/* Main Table */}
        <div className='overflow-x-auto bg-white rounded-lg shadow'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Mã giảm giá
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Tên
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Loại
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Giá trị
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Thời gian
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  Trạng thái
                </th>
                <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase'>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {discounts.map((discount) => (
                <tr key={discount.discount_id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {discount.discount_code}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {discount.discount_name}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {discount.discount_type === 'percentage'
                        ? 'Phần trăm'
                        : 'Số tiền cố định'}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {discount.discount_type === 'percentage'
                        ? `${discount.discount_value}%`
                        : `${discount.discount_value.toLocaleString()} VNĐ`}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {new Date(discount.start_date).toLocaleDateString(
                        'vi-VN'
                      )}
                      {discount.end_date &&
                        ` - ${new Date(discount.end_date).toLocaleDateString('vi-VN')}`}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(discount.status)}`}
                    >
                      {discount.status === 'active'
                        ? 'Đang hoạt động'
                        : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    <div className='flex justify-center space-x-2'>
                      <button
                        onClick={() => handleViewDetail(discount)}
                        className='text-blue-600 hover:text-blue-900'
                        title='Xem chi tiết'
                      >
                        <ChevronRight className='h-5 w-5' />
                      </button>
                      <button
                        onClick={() => handleEdit(discount)}
                        className='text-yellow-600 hover:text-yellow-900'
                        title='Chỉnh sửa'
                      >
                        <Edit2 className='h-5 w-5' />
                      </button>
                      <button
                        onClick={() => handleDelete(discount.discount_id)}
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
        {showDetail && selectedDiscount && (
          <div className='fixed inset-0  overflow-y-auto h-full w-full'>
            <div className='relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-xl font-bold'>
                  Chi tiết mã giảm giá: {selectedDiscount.discount_code}
                </h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className='text-gray-400 hover:text-gray-600'
                >
                  <X className='h-6 w-6' />
                </button>
              </div>

              {/* Discount Details */}
              <div className='grid grid-cols-2 gap-4 mb-6'>
                <div>
                  <p className='text-sm text-gray-600'>Tên mã giảm giá:</p>
                  <p className='font-medium'>
                    {selectedDiscount.discount_name}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Loại giảm giá:</p>
                  <p className='font-medium'>
                    {selectedDiscount.discount_type === 'percentage'
                      ? 'Phần trăm'
                      : 'Số tiền cố định'}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Giá trị giảm:</p>
                  <p className='font-medium'>
                    {selectedDiscount.discount_type === 'percentage'
                      ? `${selectedDiscount.discount_value}%`
                      : `${selectedDiscount.discount_value.toLocaleString()} VNĐ`}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Đơn hàng tối thiểu:</p>
                  <p className='font-medium'>
                    {selectedDiscount.min_order_amount.toLocaleString()} VNĐ
                  </p>
                </div>
              </div>

              {/* Products List */}
              {selectedDiscount.products.length > 0 && (
                <div className='mt-4'>
                  <h4 className='font-medium mb-2'>Sản phẩm áp dụng</h4>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                            ID
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                            Tên sản phẩm
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                            Giá
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {selectedDiscount.products.map((product) => (
                          <tr key={product.id}>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {product.id}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {product.name}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {product.price.toLocaleString()} VNĐ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Categories List */}
              {selectedDiscount.categories.length > 0 && (
                <div className='mt-4'>
                  <h4 className='font-medium mb-2'>Danh mục áp dụng</h4>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                            ID
                          </th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                            Tên danh mục
                          </th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {selectedDiscount.categories.map((category) => (
                          <tr key={category.id}>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {category.id}
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                              {category.name}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountListView;
