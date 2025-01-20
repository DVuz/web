import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import TableFilters from '../TableFilters';
import {
  ActionTooltip,
  InfoTooltip,
  DeleteModal,
  EditModal,
} from './ManufacturerComponents';
import {
  getAllManufacturers,
  deleteManufacturer,
  updateManufacturer,
} from '../../../../services/getApi';

const ManufacturerList = () => {
  const [manufacturers, setManufacturers] = useState([]);
  const [filteredManufacturers, setFilteredManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    manufacturer: null,
  });
  const [editModal, setEditModal] = useState({
    show: false,
    manufacturer: null,
  });
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async () => {
    try {
      setLoading(true);
      const response = await getAllManufacturers();
      if (response.success) {
        setManufacturers(response.manufacturers);
        setFilteredManufacturers(response.manufacturers);
      } else {
        setError('Failed to fetch manufacturers');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch manufacturers');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    const filtered = manufacturers.filter((manufacturer) => {
      // Search filter
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        manufacturer.name?.toLowerCase().includes(searchLower) ||
        manufacturer.email?.toLowerCase().includes(searchLower) ||
        manufacturer.country?.toLowerCase().includes(searchLower) ||
        manufacturer.phone?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'active'
          ? manufacturer.is_active
          : !manufacturer.is_active);

      // Date filter
      let matchesDate = true;
      if (filters.dateRange !== 'all') {
        const createdDate = new Date(manufacturer.created_at);
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

      // Country filter (additional filter)
      const matchesCountry =
        !filters.country ||
        filters.country === 'all' ||
        manufacturer.country === filters.country;

      return matchesSearch && matchesStatus && matchesDate && matchesCountry;
    });

    setFilteredManufacturers(filtered);
  };

  const handleDelete = async () => {
    if (!deleteModal.manufacturer) return;

    try {
      await deleteManufacturer(deleteModal.manufacturer.manufacturer_id);
      setDeleteModal({ show: false, manufacturer: null });
      fetchManufacturers();
    } catch (error) {
      console.error('Failed to delete manufacturer:', error);
    }
  };

  const handleEdit = async (formData) => {
    try {
      await updateManufacturer(
        editModal.manufacturer.manufacturer_id,
        formData
      );
      setEditModal({ show: false, manufacturer: null });
      fetchManufacturers();
    } catch (error) {
      console.error('Failed to edit manufacturer:', error);
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

  if (loading) return <div className='p-4'>Loading manufacturers...</div>;
  if (error) return <div className='p-4 text-red-500'>{error}</div>;

  const filterConfig = {
    searchPlaceholder: 'Search manufacturers by name, email, country...',
    additionalFilters: [
      {
        key: 'country',
        label: 'Country',
        type: 'select',
        options: [
          { value: 'all', label: 'All Countries' },
          { value: 'USA', label: 'United States' },
          { value: 'China', label: 'China' },
          { value: 'Japan', label: 'Japan' },
          { value: 'Germany', label: 'Germany' },
          { value: 'Other', label: 'Other' },
        ],
        defaultValue: 'all',
      },
    ],
  };

  return (
    <div className='mx-auto p-4 w-full'>
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold'>Manufacturers</h2>
          <Link
            to='/admin/manufacturer/create'
            className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Add Manufacturer
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
                <th className='p-4 text-left border-b'>Logo</th>
                <th className='p-4 text-left border-b'>Name</th>

                <th className='p-4 text-left border-b'>Phone</th>
                <th className='p-4 text-left border-b'>Email</th>
                <th className='p-4 text-left border-b'>Products</th>
                <th className='p-4 text-left border-b'>Status</th>
                <th className='p-4 text-left border-b'>Created</th>
                <th className='p-4 text-left border-b'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredManufacturers.map((manufacturer) => (
                <tr
                  key={manufacturer.manufacturer_id}
                  className='border-b hover:bg-gray-50'
                >
                  <td
                    className='p-4'
                    onMouseMove={(e) =>
                      handleMouseMove(e, manufacturer, 'manufacturer_id')
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    {manufacturer.manufacturer_id}
                  </td>
                  <td className='p-4'>
                    <img
                      // src={`${import.meta.env.VITE_BACKEND_URL}${manufacturer.logo_url}`}
                      src={`${import.meta.env.VITE_BACKEND_URL}${manufacturer.logo_url}`}
                      alt={manufacturer.name}
                      className='w-12 h-12 object-cover rounded'
                    />
                  </td>
                  <td
                    className='p-4'
                    onMouseMove={(e) =>
                      handleMouseMove(e, manufacturer, 'name')
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    {manufacturer.manufacturer_name}
                  </td>

                  <td className='p-4'>{manufacturer.phone_number}</td>
                  <td className='p-4'>{manufacturer.email}</td>
                  <td className='p-4'>{manufacturer.product_count || 0}</td>
                  <td className='p-4'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        manufacturer.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {manufacturer.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className='p-4'>
                    {new Date(manufacturer.created_at).toLocaleDateString()}
                  </td>
                  <td className='p-4'>
                    <div className='flex gap-2'>
                      <ActionTooltip text='Edit'>
                        <button
                          onClick={() =>
                            setEditModal({ show: true, manufacturer })
                          }
                          className='p-1.5 text-blue-600 hover:bg-blue-50 rounded'
                        >
                          <Edit2 className='w-4 h-4' />
                        </button>
                      </ActionTooltip>
                      <ActionTooltip text='Delete'>
                        <button
                          onClick={() =>
                            setDeleteModal({ show: true, manufacturer })
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
        onClose={() => setDeleteModal({ show: false, manufacturer: null })}
        onConfirm={handleDelete}
        manufacturerName={deleteModal.manufacturer?.name}
      />

      <EditModal
        show={editModal.show}
        onClose={() => setEditModal({ show: false, manufacturer: null })}
        manufacturer={editModal.manufacturer}
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
    'manufacturer_id',
    'name',
    'country',
    'phone',
    'email',
    'logo_url',
  ];
  return tooltipColumns.includes(columnKey);
};

export default ManufacturerList;
