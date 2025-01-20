import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

// Mock data
const mockShippingFees = [
  {
    id: 1,
    min_distance: 0,
    max_distance: 5,
    fee: 15000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    min_distance: 5,
    max_distance: 10,
    fee: 30000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    min_distance: 10,
    max_distance: 20,
    fee: 50000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 4,
    min_distance: 20,
    max_distance: 50,
    fee: 100000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 5,
    min_distance: 50,
    max_distance: 100,
    fee: 200000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 6,
    min_distance: 100,
    max_distance: 200,
    fee: 300000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 7,
    min_distance: 200,
    max_distance: 300,
    fee: 500000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 8,
    min_distance: 300,
    max_distance: 400,
    fee: 700000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 9,
    min_distance: 400,
    max_distance: 500,
    fee: 900000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 10,
    min_distance: 500,
    max_distance: 1000,
    fee: 1900000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 11,
    min_distance: 1000,
    max_distance: 1500,
    fee: 2900000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 12,
    min_distance: 1500,
    max_distance: 2000,
    fee: 3900000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 13,
    min_distance: 2000,
    max_distance: 2500,
    fee: 4900000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 14,
    min_distance: 2500,
    max_distance: 3000,
    fee: 5900000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 15,
    min_distance: 3000,
    max_distance: 3500,
    fee: 6900000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 16,
    min_distance: 3500,
    max_distance: 4000,
    fee: 7900000,
    status: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

const ShippingFeeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = mockShippingFees.filter((fee) => {
    const matchesSearch =
      fee.min_distance.toString().includes(searchTerm) ||
      fee.max_distance.toString().includes(searchTerm) ||
      fee.fee.toString().includes(searchTerm);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && fee.status) ||
      (statusFilter === 'inactive' && !fee.status);

    return matchesSearch && matchesStatus;
  });

  const handleEdit = (fee) => {
    console.log('Edit fee:', fee);
  };

  const handleDelete = (fee) => {
    console.log('Delete fee:', fee);
  };

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6'>
        {/* Header Section */}
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Danh sách phí vận chuyển
          </h2>
          <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
            Thêm phí vận chuyển
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className='flex gap-4 mb-6'>
          <div className='flex-1'>
            <input
              type='text'
              placeholder='Tìm kiếm...'
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
            <option value='active'>Đang hoạt động</option>
            <option value='inactive'>Ngừng hoạt động</option>
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
                  Khoảng cách (km)
                </th>
                <th className='p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200 border-b'>
                  Phí vận chuyển
                </th>
                <th className='p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200 border-b'>
                  Trạng thái
                </th>
                <th className='p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200 border-b'>
                  Ngày tạo
                </th>
                <th className='p-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-200 border-b'>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((fee) => (
                <tr
                  key={fee.id}
                  className='border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                >
                  <td className='p-4 dark:text-gray-300'>{fee.id}</td>
                  <td className='p-4 dark:text-gray-300'>
                    {fee.min_distance} - {fee.max_distance}
                  </td>
                  <td className='p-4 dark:text-gray-300'>
                    {fee.fee.toLocaleString('vi-VN')} VNĐ
                  </td>
                  <td className='p-4'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        fee.status
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {fee.status ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </td>
                  <td className='p-4 dark:text-gray-300'>
                    {new Date(fee.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className='p-4'>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleEdit(fee)}
                        className='p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors'
                      >
                        <Edit2 className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleDelete(fee)}
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

export default ShippingFeeList;
