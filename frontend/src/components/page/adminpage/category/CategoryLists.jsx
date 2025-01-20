import { useState } from 'react';

// Mock data
const mockData = {
  categories: [
    {
      category_id: 1,
      category_name: 'Electronics',
      description: 'All kinds of electronic devices and gadgets',
      image_url: 'https://example.com/electronics.jpg',
      status: 'active',
      display_order: 1,
    },
    {
      category_id: 2,
      category_name: 'Fashion',
      description: 'Clothing, shoes, and accessories',
      image_url: 'https://example.com/fashion.jpg',
      status: 'active',
      display_order: 2,
    },
  ],
  subcategories: [
    {
      subcategory_id: 1,
      subcategory_name: 'Smartphones',
      description: 'Latest smartphones from top brands',
      image_url: 'https://example.com/smartphones.jpg',
      status: 'active',
      display_order: 1,
      category_id: 1,
    },
    {
      subcategory_id: 2,
      subcategory_name: 'Laptops',
      description: 'Portable computers and accessories',
      image_url: 'https://example.com/laptops.jpg',
      status: 'active',
      display_order: 2,
      category_id: 1,
    },
  ],
  productTypes: [
    {
      type_id: 1,
      type_name: 'Flagship Phones',
      description: 'High-end smartphones with premium features',
      image_url: 'https://example.com/flagship.jpg',
      status: 'active',
      display_order: 1,
      subcategory_id: 1,
    },
    {
      type_id: 2,
      type_name: 'Budget Phones',
      description: 'Affordable smartphones with good value',
      image_url: 'https://example.com/budget.jpg',
      status: 'active',
      display_order: 2,
      subcategory_id: 1,
    },
  ],
};

const DataTable = ({ title, data, columns, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredData = data.filter((item) => {
    const matchesSearch = item[columns[1].key]
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8'>
      <h2 className='text-xl font-semibold mb-4 text-gray-800 dark:text-white'>
        {title}
      </h2>

      <div className='flex gap-4 mb-4'>
        <input
          type='text'
          placeholder='Search...'
          className='flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className='p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white'
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value='all'>All Status</option>
          <option value='active'>Active</option>
          <option value='inactive'>Inactive</option>
        </select>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='bg-gray-50 dark:bg-gray-700'>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className='p-3 text-left text-gray-600 dark:text-gray-200 border-b'
                >
                  {column.label}
                </th>
              ))}
              <th className='p-3 text-left text-gray-600 dark:text-gray-200 border-b'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item[columns[0].key]}
                className='border-b border-gray-200 dark:border-gray-700'
              >
                {columns.map((column) => (
                  <td key={column.key} className='p-3 dark:text-gray-300'>
                    {column.key === 'image_url' ? (
                      <img
                        src='/api/placeholder/50/50'
                        alt='placeholder'
                        className='w-10 h-10 rounded object-cover'
                      />
                    ) : column.key === 'status' ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    ) : (
                      item[column.key]
                    )}
                  </td>
                ))}
                <td className='p-3'>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => onEdit(item)}
                      className='px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className='px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600'
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function CategoryLists() {
  const handleEdit = (item) => {
    console.log('Edit item:', item);
  };

  const handleDelete = (item) => {
    console.log('Delete item:', item);
  };

  const categoryColumns = [
    { key: 'category_id', label: 'ID' },
    { key: 'category_name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'image_url', label: 'Image' },
    { key: 'display_order', label: 'Order' },
    { key: 'status', label: 'Status' },
  ];

  const subcategoryColumns = [
    { key: 'subcategory_id', label: 'ID' },
    { key: 'subcategory_name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'image_url', label: 'Image' },
    { key: 'display_order', label: 'Order' },
    { key: 'status', label: 'Status' },
  ];

  const productTypeColumns = [
    { key: 'type_id', label: 'ID' },
    { key: 'type_name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'image_url', label: 'Image' },
    { key: 'display_order', label: 'Order' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      <DataTable
        title='Categories'
        data={mockData.categories}
        columns={categoryColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DataTable
        title='Subcategories'
        data={mockData.subcategories}
        columns={subcategoryColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DataTable
        title='Product Types'
        data={mockData.productTypes}
        columns={productTypeColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
