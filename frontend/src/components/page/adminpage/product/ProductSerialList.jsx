import React, { useState } from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';

// Mock data
const mockProductSerials = [
  {
    serial_id: 1,
    product_id: 101,
    serial_number: 'SN2024001001',
    batch_id: 1,
    sold: false,
    sold_date: null,
    warranty_start_date: null,
    warranty_end_date: null,
    current_warehouse_id: 1,
    status: 'in_stock',
    created_at: new Date('2024-01-15'),
    product: {
      name: 'iPhone 15 Pro Max',
    },
  },
  {
    serial_id: 2,
    product_id: 101,
    serial_number: 'SN2024001002',
    batch_id: 1,
    sold: true,
    sold_date: new Date('2024-02-01'),
    warranty_start_date: new Date('2024-02-01'),
    warranty_end_date: new Date('2025-02-01'),
    current_warehouse_id: 1,
    status: 'sold',
    created_at: new Date('2024-01-15'),
    product: {
      name: 'iPhone 15 Pro Max',
    },
  },
  {
    serial_id: 3,
    product_id: 102,
    serial_number: 'SN2024002001',
    batch_id: 2,
    sold: false,
    sold_date: null,
    warranty_start_date: null,
    warranty_end_date: null,
    current_warehouse_id: 2,
    status: 'defective',
    created_at: new Date('2024-01-20'),
    product: {
      name: 'Samsung Galaxy S24 Ultra',
    },
  },
  {
    serial_id: 4,
    product_id: 102,
    serial_number: 'SN2024002002',
    batch_id: 2,
    sold: false,
    sold_date: null,
    warranty_start_date: null,
    warranty_end_date: null,
    current_warehouse_id: 1,
    status: 'in_transit',
    created_at: new Date('2024-01-20'),
    product: {
      name: 'Samsung Galaxy S24 Ultra',
    },
  },
];

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'in_stock':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'sold':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'defective':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'in_transit':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'in_stock':
      return 'Trong kho';
    case 'sold':
      return 'Đã bán';
    case 'defective':
      return 'Lỗi';
    case 'in_transit':
      return 'Đang vận chuyển';
    default:
      return 'Không xác định';
  }
};

const ProductSerialList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = mockProductSerials.filter((serial) => {
    const matchesSearch =
      serial.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serial.product.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || serial.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleView = (serial) => {
    console.log('View serial:', serial);
  };

  const handleEdit = (serial) => {
    console.log('Edit serial:', serial);
  };

  const handleDelete = (serial) => {
    console.log('Delete serial:', serial);
  };

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
        {/* Header Section */}
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Danh sách Serial sản phẩm
          </h2>
          <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
            Thêm Serial mới
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className='flex gap-4 mb-6'>
          <div className='flex-1'>
            <input
              type='text'
              placeholder='Tìm kiếm theo số serial hoặc tên sản phẩm...'
              className='w-full p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className='p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value='all'>Tất cả trạng thái</option>
            <option value='in_stock'>Trong kho</option>
            <option value='sold'>Đã bán</option>
            <option value='defective'>Lỗi</option>
            <option value='in_transit'>Đang vận chuyển</option>
          </select>
        </div>

        {/* Table Section */}
        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-gray-50 dark:bg-gray-700'>
                <th className='p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200 border-b'>
                  ID
                </th>
                <th className='p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200 border-b'>
                  Số Serial
                </th>
                <th className='p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200 border-b'>
                  Sản phẩm
                </th>
                <th className='p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200 border-b'>
                  Trạng thái
                </th>
                <th className='p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200 border-b'>
                  Ngày bán
                </th>
                <th className='p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200 border-b'>
                  Bảo hành đến
                </th>
                <th className='p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200 border-b'>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((serial) => (
                <tr
                  key={serial.serial_id}
                  className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                >
                  <td className='p-4 dark:text-gray-300'>{serial.serial_id}</td>
                  <td className='p-4 dark:text-gray-300'>
                    {serial.serial_number}
                  </td>
                  <td className='p-4 dark:text-gray-300'>
                    {serial.product.name}
                  </td>
                  <td className='p-4'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(serial.status)}`}
                    >
                      {getStatusText(serial.status)}
                    </span>
                  </td>
                  <td className='p-4 dark:text-gray-300'>
                    {serial.sold_date
                      ? new Date(serial.sold_date).toLocaleDateString('vi-VN')
                      : '-'}
                  </td>
                  <td className='p-4 dark:text-gray-300'>
                    {serial.warranty_end_date
                      ? new Date(serial.warranty_end_date).toLocaleDateString(
                          'vi-VN'
                        )
                      : '-'}
                  </td>
                  <td className='p-4'>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleView(serial)}
                        className='p-1.5 text-gray-600 hover:bg-gray-50 rounded-full transition-colors'
                      >
                        <Eye className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleEdit(serial)}
                        className='p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors'
                      >
                        <Edit2 className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleDelete(serial)}
                        className='p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductSerialList;
