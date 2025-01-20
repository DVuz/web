import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getAllWarehouses,
  deleteWarehouse,
  updateWarehouse,
} from '../../../../services/getApi';
import TableFilters from '../TableFilters';
import {
  ActionTooltip,
  InfoTooltip,
  DeleteModal,
  EditModal,
} from './WarehouseComponents';

const WarehouseList = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    warehouse: null,
  });
  const [editModal, setEditModal] = useState({ show: false, warehouse: null });
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const backendURl = import.meta.VITE_BACKEND_URL;

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const response = await getAllWarehouses();
      if (response.success) {
        setWarehouses(response.warehouses);
        setFilteredWarehouses(response.warehouses);
      } else {
        setError('Failed to fetch warehouses');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    const filtered = warehouses.filter((warehouse) => {
      // Search filter
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        warehouse.name?.toLowerCase().includes(searchLower) ||
        warehouse.email?.toLowerCase().includes(searchLower) ||
        warehouse.address?.toLowerCase().includes(searchLower) ||
        warehouse.phone?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'active'
          ? warehouse.is_active
          : !warehouse.is_active);

      // Date filter
      let matchesDate = true;
      if (filters.dateRange !== 'all') {
        const createdDate = new Date(warehouse.created_at);
        const today = new Date();

        switch (filters.dateRange) {
          case 'today':
            matchesDate = createdDate.toDateString() === today.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(today.setDate(today.getDate() - 7));
            matchesDate = createdDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
            matchesDate = createdDate >= monthAgo;
            break;
          case 'custom':
            const startDate = filters.startDate
              ? new Date(filters.startDate)
              : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;
            if (startDate && endDate) {
              matchesDate = createdDate >= startDate && createdDate <= endDate;
            }
            break;
          default:
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    setFilteredWarehouses(filtered);
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

  if (loading) return <div className='p-4'>Loading warehouses...</div>;
  if (error) return <div className='p-4 text-red-500'>{error}</div>;

  const filterConfig = {
    searchPlaceholder: 'Search warehouses by name, email, address...',
    // additionalFilters: [
    //   {
    //     key: 'warehouseType',
    //     label: 'Warehouse Type',
    //     type: 'select',
    //     options: [
    //       { value: 'all', label: 'All Types' },
    //       { value: 'retail', label: 'Retail' },
    //       { value: 'wholesale', label: 'Wholesale' },
    //       { value: 'distribution', label: 'Distribution' }
    //     ],
    //     defaultValue: 'all'
    //   }
    // ]
  };

  return (
    <div className='mx-auto p-4 w-full'>
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold'>Warehouses</h2>
          <Link
            to='/admin/warehouse/create'
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Add Warehouse
          </Link>
        </div>

        <TableFilters
          onFilterChange={handleFilterChange}
          filterConfig={filterConfig}
        />

        <div className='overflow-x-auto mt-6'>
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
                  <td className='p-4'>
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${warehouse.image_url}`}
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

export default WarehouseList;
