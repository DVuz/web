import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import {
  getAllWarehouses,
  deleteWarehouse,
  updateWarehouse,
} from '../../../../services/getApi';

const ActionTooltip = ({ text, children }) => {
  return (
    <div className='relative group'>
      {children}
      <div
        className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded 
        opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50'
      >
        {text}
        <div className='absolute bottom-0 left-1/2 -translate-x-1/2 -mb-1 border-4 border-t-gray-900 border-x-transparent border-b-transparent' />
      </div>
    </div>
  );
};

const InfoTooltip = ({ data, position }) => {
  if (!position) return null;

  return (
    <div
      className='fixed z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-80'
      style={{
        left: `${position.x + 10}px`,
        top: `${position.y}px`,
        transform: 'translate(0, -50%)',
      }}
    >
      <div className='border-b border-gray-200 dark:border-gray-700 pb-3'>
        <h3 className='font-semibold text-gray-900 dark:text-white'>
          {data.name}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            data.is_active
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {data.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className='mt-3 space-y-2'>
        {data.image_url && (
          <div className='mb-3'>
            <img
              src={data.image_url}
              alt={data.name}
              className='w-full h-32 object-cover rounded-lg'
            />
          </div>
        )}
        <div className='grid grid-cols-2 gap-2 text-sm'>
          <div>
            <p className='text-gray-500 dark:text-gray-400'>ID</p>
            <p className='text-gray-900 dark:text-white'>#{data.id}</p>
          </div>
          <div>
            <p className='text-gray-500 dark:text-gray-400'>Email</p>
            <p className='text-gray-900 dark:text-white'>{data.email}</p>
          </div>
          <div>
            <p className='text-gray-500 dark:text-gray-400'>Phone</p>
            <p className='text-gray-900 dark:text-white'>{data.phone}</p>
          </div>
          <div>
            <p className='text-gray-500 dark:text-gray-400'>Created</p>
            <p className='text-gray-900 dark:text-white'>
              {new Date(data.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className='mt-2'>
          <p className='text-gray-500 dark:text-gray-400'>Address</p>
          <p className='text-gray-900 dark:text-white'>{data.address}</p>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ show, onClose, onConfirm, warehouseName }) => {
  if (!show) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
        <h3 className='text-lg font-semibold mb-4'>Confirm Delete</h3>
        <p className='text-gray-600 mb-6'>
          Are you sure you want to delete warehouse "{warehouseName}"? This
          action cannot be undone.
        </p>
        <div className='flex justify-end gap-4'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-600 border rounded hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Modal with Form
const EditModal = ({ show, onClose, warehouse, onSave }) => {
  const [formData, setFormData] = useState(warehouse || {});
  const [imagePreview, setImagePreview] = useState(
    warehouse?.image_url || null
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (warehouse) {
      setFormData(warehouse);
      setImagePreview(warehouse.image_url);
    }
  }, [warehouse]);

  if (!show) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: 'Image size should not exceed 5MB',
        }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          image: 'Please upload an image file',
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === 'image' && formData[key] instanceof File) {
        formPayload.append('image', formData[key]);
      } else if (key !== 'image_url' && key !== 'image') {
        formPayload.append(key, formData[key]);
      }
    });

    onSave(formPayload);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold'>Edit Warehouse</h3>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Image Upload Section */}
          <div className='mb-6'>
            <label className='block text-sm font-medium mb-2'>
              Warehouse Image
            </label>
            <div className='flex items-center gap-4'>
              <div className='w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50'>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt='Preview'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='text-center p-4'>
                    <p className='text-sm text-gray-500'>No image</p>
                  </div>
                )}
              </div>
              <div className='flex-1'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='hidden'
                  id='warehouse-image'
                />
                <label
                  htmlFor='warehouse-image'
                  className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer'
                >
                  Choose New Image
                </label>
                {errors.image && (
                  <p className='mt-1 text-sm text-red-600'>{errors.image}</p>
                )}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Name</label>
              <input
                type='text'
                value={formData.name || ''}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='w-full p-2 border rounded'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Email</label>
              <input
                type='email'
                value={formData.email || ''}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className='w-full p-2 border rounded'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Phone</label>
              <input
                type='tel'
                value={formData.phone || ''}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className='w-full p-2 border rounded'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Status</label>
              <select
                value={formData.is_active ? 'true' : 'false'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.value === 'true',
                  })
                }
                className='w-full p-2 border rounded'
              >
                <option value='true'>Active</option>
                <option value='false'>Inactive</option>
              </select>
            </div>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium mb-1'>Address</label>
              <textarea
                value={formData.address || ''}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className='w-full p-2 border rounded'
                rows='3'
                required
              />
            </div>
          </div>
          <div className='flex justify-end gap-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-600 border rounded hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const isTooltipColumn = (columnKey) => {
  const tooltipColumns = [
    'id',
    'name',
    'address',
    'phone',
    'email',
    'image_url',
  ];
  return tooltipColumns.includes(columnKey);
};

// Main Component
const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    warehouse: null,
  });
  const [editModal, setEditModal] = useState({ show: false, warehouse: null });
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await getAllWarehouses();
      if (response.success) {
        setWarehouses(response.warehouses);
      } else {
        setError('Failed to fetch warehouses');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.warehouse) return;

    try {
      await deleteWarehouse(deleteModal.warehouse.id);
      setDeleteModal({ show: false, warehouse: null });
      fetchWarehouses();
    } catch (error) {
      console.error('Failed to delete warehouse:', error);
    }
  };

  const handleEdit = async (formData) => {
    try {
      await updateWarehouse(editModal.warehouse.id, formData);
      setEditModal({ show: false, warehouse: null });
      fetchWarehouses();
    } catch (error) {
      console.error('Failed to edit warehouse:', error);
    }
  };

  const handleMouseMove = (event, item, columnKey) => {
    if (isTooltipColumn(columnKey)) {
      setTooltipData(item);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
    setTooltipPosition(null);
  };

  const filteredWarehouses = warehouses.filter((warehouse) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      warehouse.name?.toLowerCase().includes(searchLower) ||
      warehouse.email?.toLowerCase().includes(searchLower) ||
      warehouse.address?.toLowerCase().includes(searchLower) ||
      warehouse.phone?.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'true' ? warehouse.is_active : !warehouse.is_active);

    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className='p-4'>Loading warehouses...</div>;
  if (error) return <div className='p-4 text-red-500'>{error}</div>;

  return (
    <div className='container mx-auto p-4'>
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold'>Warehouses</h2>
          <button className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
            Add Warehouse
          </button>
        </div>

        <div className='flex gap-4 mb-6'>
          <input
            type='text'
            placeholder='Search warehouses...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='flex-1 p-2 border rounded'
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='p-2 border rounded'
          >
            <option value='all'>All Status</option>
            <option value='true'>Active</option>
            <option value='false'>Inactive</option>
          </select>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-gray-50'>
                <th className='p-4 text-left border-b'>ID</th>
                <th className='p-4 text-left border-b'>Image</th>
                <th className='p-4 text-left border-b'>Name</th>
                <th className='p-4 text-left border-b'>Address</th>
                <th className='p-4 text-left border-b'>Phone</th>
                <th className='p-4 text-left border-b'>Email</th>
                <th className='p-4 text-left border-b'>Status</th>
                <th className='p-4 text-left border-b'>Created</th>
                <th className='p-4 text-left border-b'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWarehouses.map((warehouse) => (
                <tr key={warehouse.id} className='border-b hover:bg-gray-50'>
                  <td
                    className='p-4'
                    onMouseMove={(e) => handleMouseMove(e, warehouse, 'id')}
                    onMouseLeave={handleMouseLeave}
                  >
                    {warehouse.id}
                  </td>
                  <td
                    className='p-4'
                    onMouseMove={(e) =>
                      handleMouseMove(e, warehouse, 'image_url')
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    <img
                      src={warehouse.image_url}
                      alt={warehouse.name}
                      className='w-12 h-12 object-cover rounded'
                    />
                  </td>
                  <td
                    className='p-4'
                    onMouseMove={(e) => handleMouseMove(e, warehouse, 'name')}
                    onMouseLeave={handleMouseLeave}
                  >
                    {warehouse.name}
                  </td>
                  <td
                    className='p-4'
                    onMouseMove={(e) =>
                      handleMouseMove(e, warehouse, 'address')
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    {warehouse.address}
                  </td>
                  <td
                    className='p-4'
                    onMouseMove={(e) => handleMouseMove(e, warehouse, 'phone')}
                    onMouseLeave={handleMouseLeave}
                  >
                    {warehouse.phone}
                  </td>
                  <td
                    className='p-4'
                    onMouseMove={(e) => handleMouseMove(e, warehouse, 'email')}
                    onMouseLeave={handleMouseLeave}
                  >
                    {warehouse.email}
                  </td>
                  <td className='p-4'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        warehouse.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {warehouse.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className='p-4'>
                    {new Date(warehouse.created_at).toLocaleDateString()}
                  </td>
                  <td className='p-4'>
                    <div className='flex gap-2'>
                      <ActionTooltip text='Edit'>
                        <button
                          onClick={() =>
                            setEditModal({ show: true, warehouse })
                          }
                          className='p-1.5 text-blue-600 hover:bg-blue-50 rounded'
                        >
                          <Edit2 className='w-4 h-4' />
                        </button>
                      </ActionTooltip>
                      <ActionTooltip text='Delete'>
                        <button
                          onClick={() =>
                            setDeleteModal({ show: true, warehouse })
                          }
                          className='p-1.5 text-red-600 hover:bg-red-50 rounded'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </ActionTooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        show={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, warehouse: null })}
        onConfirm={handleDelete}
        warehouseName={deleteModal.warehouse?.name}
      />

      <EditModal
        show={editModal.show}
        onClose={() => setEditModal({ show: false, warehouse: null })}
        warehouse={editModal.warehouse}
        onSave={handleEdit}
      />

      {tooltipData && tooltipPosition && (
        <InfoTooltip data={tooltipData} position={tooltipPosition} />
      )}
    </div>
  );
};

export default WarehouseList;
