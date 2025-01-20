import React, { useState } from 'react';
import {
  PlusCircle,
  Package,
  Settings,
  Users,
  BarChart3,
  Search,
} from 'lucide-react';

const AdminDashboard = () => {
  const [products] = useState([
    { id: 1, name: 'Product 1', price: 99.99, stock: 150, status: 'In Stock' },
    { id: 2, name: 'Product 2', price: 149.99, stock: 75, status: 'Low Stock' },
    {
      id: 3,
      name: 'Product 3',
      price: 199.99,
      stock: 0,
      status: 'Out of Stock',
    },
  ]);

  const stats = [
    { label: 'Total Products', value: '324', icon: Package },
    { label: 'Total Users', value: '2,454', icon: Users },
    { label: 'Total Sales', value: '$12,454', icon: BarChart3 },
  ];

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar */}
      <div className='w-64 bg-white shadow-lg'>
        <div className='p-4'>
          <h1 className='text-xl font-bold text-gray-800'>Admin Panel</h1>
        </div>
        <nav className='mt-4'>
          <a
            href='#'
            className='flex items-center px-4 py-3 bg-blue-50 text-blue-700'
          >
            <Package className='w-5 h-5 mr-3' />
            Products
          </a>
          <a
            href='#'
            className='flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50'
          >
            <Users className='w-5 h-5 mr-3' />
            Users
          </a>
          <a
            href='#'
            className='flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50'
          >
            <Settings className='w-5 h-5 mr-3' />
            Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className='flex-1 overflow-auto'>
        <div className='p-8'>
          {/* Header */}
          <div className='flex justify-between items-center mb-8'>
            <h1 className='text-2xl font-bold text-gray-800'>
              Products Management
            </h1>
            <button className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
              <PlusCircle className='w-5 h-5 mr-2' />
              Add Product
            </button>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            {stats.map((stat, index) => (
              <div key={index} className='bg-white p-6 rounded-lg shadow'>
                <div className='flex items-center'>
                  <div className='p-3 bg-blue-50 rounded-lg'>
                    <stat.icon className='w-6 h-6 text-blue-600' />
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-sm font-medium text-gray-500'>
                      {stat.label}
                    </h3>
                    <p className='text-2xl font-semibold text-gray-900'>
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className='relative mb-6'>
            <input
              type='text'
              placeholder='Search products...'
              className='w-full pl-10 pr-4 py-2 border rounded-lg'
            />
            <Search className='w-5 h-5 text-gray-400 absolute left-3 top-2.5' />
          </div>

          {/* Products Table */}
          <div className='bg-white rounded-lg shadow'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    ID
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Product Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Price
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Stock
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {products.map((product) => (
                  <tr key={product.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 text-sm text-gray-500'>
                      #{product.id}
                    </td>
                    <td className='px-6 py-4 text-sm font-medium text-gray-900'>
                      {product.name}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500'>
                      ${product.price}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500'>
                      {product.stock}
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          product.status === 'In Stock'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'Low Stock'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500'>
                      <button className='text-blue-600 hover:text-blue-900 mr-3'>
                        Edit
                      </button>
                      <button className='text-red-600 hover:text-red-900'>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
