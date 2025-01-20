import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import debounce from 'lodash/debounce';
import { getAllProducts } from '../../../../services/getApi';
import ManufacturerSelect from './ManufacturerSelect';
import Input from '../../../common/Input';
import { numberToVietnameseWords } from '../../../../utils/numberToVietnameseWords';
import Toast from '../../../common/ToastDemo';

const BatchEntryForm = () => {
  // Data states
  const [warehouseOptions, setWarehouseOptions] = useState([]);
  const [manufacturerOptions, setManufacturerOptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerms, setSearchTerms] = useState({});
  const [activeSearchIndex, setActiveSearchIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amountInWords, setAmountInWords] = useState({
    items: {},
    total: '',
  });
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success',
    description: '',
  });

  // Form states
  const [batchData, setBatchData] = useState({
    batch_name: '',
    warehouse_id: '',
    manufacturer_id: '',
    received_date: '',
    items: [
      {
        product_id: '',
        product_name: '',
        product_code: '',
        quantity: '',
        unit_price: '',
      },
    ],
  });

  const [errors, setErrors] = useState({
    batch_name: '',
    warehouse_id: '',
    manufacturer_id: '',
    received_date: '',
    items: [{ product_id: '', quantity: '', unit_price: '' }],
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const isFormValid = () => {
    // Kiểm tra các trường cơ bản
    if (
      !batchData.batch_name ||
      !batchData.warehouse_id ||
      !batchData.manufacturer_id ||
      !batchData.received_date
    ) {
      return false;
    }

    // Kiểm tra danh sách sản phẩm
    for (const item of batchData.items) {
      if (
        !item.product_id || // Chưa chọn sản phẩm
        !item.quantity ||
        Number(item.quantity) <= 0 ||
        !item.unit_price ||
        Number(item.unit_price) <= 0
      ) {
        return false;
      }
    }

    // Kiểm tra không có lỗi
    if (
      errors.batch_name ||
      errors.warehouse_id ||
      errors.manufacturer_id ||
      errors.received_date
    ) {
      return false;
    }

    for (const itemError of errors.items) {
      if (itemError.product_id || itemError.quantity || itemError.unit_price) {
        return false;
      }
    }

    return true;
  };
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [warehousesRes, manufacturersRes] = await Promise.all([
          fetch('https://192.168.0.102:3000/api/warehouses/get_all_warehouses'),
          fetch('https://192.168.0.102:3000/api/manufacturers'),
        ]);
        const warehousesData = await warehousesRes.json();
        const manufacturersData = await manufacturersRes.json();
        const productsData = await getAllProducts();

        setWarehouseOptions(
          warehousesData.warehouses.map((w) => ({
            value: w.id.toString(),
            label: w.name,
          }))
        );

        setManufacturerOptions(
          manufacturersData.manufacturers.map((m) => ({
            value: m.manufacturer_id.toString(),
            label: m.manufacturer_name,
            logoUrl: m.logo_url,
            address: m.address,
            phone: m.phone_number,
          }))
        );

        // Lưu trữ dữ liệu products từ API
        if (productsData.success && Array.isArray(productsData.data)) {
          setProducts(productsData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Cập nhật hàm lọc sản phẩm
  const getFilteredProducts = (index) => {
    const searchTerm = searchTerms[index] || '';
    if (!searchTerm) return [];

    const lowerSearchTerm = searchTerm.toLowerCase();
    return products
      .filter(
        (product) =>
          product.product_code.toLowerCase().includes(lowerSearchTerm) ||
          product.product_name_vn.toLowerCase().includes(lowerSearchTerm) ||
          product.product_name__en.toLowerCase().includes(lowerSearchTerm)
      )
      .slice(0, 10);
  };

  // Validation function
  const validateField = (field, value) => {
    switch (field) {
      case 'batch_name':
        return !value ? 'Tên lô hàng không được để trống' : '';
      case 'warehouse_id':
        return !value ? 'Vui lòng chọn kho' : '';
      case 'manufacturer_id':
        return !value ? 'Vui lòng chọn nhà sản xuất' : '';
      case 'received_date':
        return !value ? 'Ngày nhận không được để trống' : '';
      case 'product_id':
        return !value ? 'Vui lòng chọn sản phẩm' : '';
      case 'quantity':
        if (!value) return 'Số lượng không được để trống';
        if (isNaN(value) || Number(value) <= 0)
          return 'Số lượng phải lớn hơn 0';
        return '';
      case 'unit_price':
        if (!value) return 'Đơn giá không được để trống';
        if (isNaN(value) || Number(value) <= 0) return 'Đơn giá phải lớn hơn 0';
        return '';
      default:
        return '';
    }
  };

  // Event Handlers
  const handleBatchInputChange = (field) => (e) => {
    const value = e.target.value;
    setBatchData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  const handleProductSearch = debounce((index, value) => {
    setSearchTerms((prev) => ({
      ...prev,
      [index]: value,
    }));
    setActiveSearchIndex(index);
  }, 100);

  const handleProductSelect = (index, product) => {
    // Check if product is already selected in any other row
    const isDuplicate = batchData.items.some(
      (item, idx) => idx !== index && item.product_id === product.id.toString()
    );

    if (isDuplicate) {
      setErrors((prev) => ({
        ...prev,
        items: prev.items.map((item, idx) =>
          idx === index
            ? { ...item, product_id: 'Sản phẩm này đã được chọn' }
            : item
        ),
      }));
      return;
    }

    const newItems = [...batchData.items];
    newItems[index] = {
      ...newItems[index],
      product_id: product.id.toString(),
      product_name: product.product_name_vn,
      product_code: product.product_code,
      main_image: product.main_image,
    };

    setBatchData((prev) => ({
      ...prev,
      items: newItems,
    }));

    setSearchTerms((prev) => ({
      ...prev,
      [index]: '',
    }));
    setActiveSearchIndex(null);
  };

  const handleItemChange = (index, field) => (e) => {
    const value = e.target.value;
    const newItems = [...batchData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    setBatchData((prev) => ({
      ...prev,
      items: newItems,
    }));

    // Cập nhật đọc số cho đơn giá
    if (field === 'unit_price') {
      setAmountInWords((prev) => ({
        ...prev,
        items: {
          ...prev.items,
          [`${index}_price`]: value
            ? numberToVietnameseWords(Number(value))
            : '',
        },
      }));
    }

    // Validate và tính toán tổng
    setErrors((prev) => {
      const newErrors = [...prev.items];
      newErrors[index] = {
        ...newErrors[index],
        [field]: validateField(field, value),
      };
      return {
        ...prev,
        items: newErrors,
      };
    });

    calculateTotals(newItems);
  };
  const calculateTotals = (items) => {
    const totals = items.reduce(
      (acc, item) => {
        const quantity = Number(item.quantity) || 0;
        const unitPrice = Number(item.unit_price) || 0;
        return {
          price: acc.price + quantity * unitPrice,
          products: acc.products + quantity,
        };
      },
      { price: 0, products: 0 }
    );

    setTotalPrice(totals.price);
    setTotalProducts(totals.products);

    // Cập nhật đọc số tổng tiền
    setAmountInWords((prev) => ({
      ...prev,
      total: numberToVietnameseWords(totals.price),
    }));
  };

  const addNewItem = () => {
    const newItem = {
      product_id: '',
      product_name: '',
      product_code: '',
      quantity: '',
      unit_price: '',
    };

    setBatchData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setErrors((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: '', quantity: '', unit_price: '' }],
    }));
  };

  const removeItem = (index) => {
    if (batchData.items.length === 1) return;

    const newItems = batchData.items.filter((_, i) => i !== index);
    setBatchData((prev) => ({
      ...prev,
      items: newItems,
    }));

    setErrors((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));

    // Clean up search state for removed item
    setSearchTerms((prev) => {
      const newTerms = { ...prev };
      delete newTerms[index];
      return newTerms;
    });

    calculateTotals(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://192.168.0.102:3000/api/batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(batchData),
      });
      console.log(batchData);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra khi tạo lô hàng');
      }

      // Hiển thị toast thành công
      setToast({
        show: true,
        message: 'Tạo lô hàng thành công',
        type: 'success',
        description: `Lô hàng "${batchData.batch_name}" đã được tạo`,
      });

      // Reset form
      setBatchData({
        batch_name: '',
        warehouse_id: '',
        manufacturer_id: '',
        received_date: '',
        items: [
          {
            product_id: '',
            product_name: '',
            product_code: '',
            quantity: '',
            unit_price: '',
          },
        ],
      });
      setErrors({
        batch_name: '',
        warehouse_id: '',
        manufacturer_id: '',
        received_date: '',
        items: [{ product_id: '', quantity: '', unit_price: '' }],
      });
      setTotalPrice(0);
      setTotalProducts(0);
      setAmountInWords({ items: {}, total: '' });
    } catch (error) {
      console.error('Error submitting batch:', error);
      // Hiển thị toast thất bại
      setToast({
        show: true,
        message: 'Tạo lô hàng thất bại',
        type: 'error',
        description: error.message || 'Vui lòng thử lại sau',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const clearProductInfo = (index) => {
    const newItems = [...batchData.items];
    newItems[index] = {
      ...newItems[index],
      product_id: '',
      product_name: '',
      product_code: '',
      quantity: '',
      unit_price: '',
    };

    setBatchData((prev) => ({
      ...prev,
      items: newItems,
    }));

    // Reset errors for this item
    setErrors((prev) => ({
      ...prev,
      items: prev.items.map((item, idx) =>
        idx === index ? { product_id: '', quantity: '', unit_price: '' } : item
      ),
    }));

    // Reset search term
    setSearchTerms((prev) => ({
      ...prev,
      [index]: '',
    }));

    // Recalculate totals
    calculateTotals(newItems);
  };

  return (
    <div className='max-w-screen-2xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl mt-4'>
      <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
        Nhập Lô Hàng Mới
      </h2>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input
            labelText='Tên Lô Hàng'
            typeInput='text'
            placeholder='Nhập tên lô hàng'
            value={batchData.batch_name}
            inputValue={(value) => {
              setBatchData((prev) => ({
                ...prev,
                batch_name: value,
              }));
              setErrors((prev) => ({
                ...prev,
                batch_name: validateField('batch_name', value),
              }));
            }}
            error={errors.batch_name}
          />

          <div className='space-y-1'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Chọn Kho
            </label>
            <select
              value={batchData.warehouse_id}
              onChange={handleBatchInputChange('warehouse_id')}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Chọn kho hàng</option>
              {warehouseOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.warehouse_id && (
              <p className='text-sm text-red-600'>{errors.warehouse_id}</p>
            )}
          </div>

          <ManufacturerSelect
            value={batchData.manufacturer_id}
            onChange={handleBatchInputChange('manufacturer_id')}
            options={manufacturerOptions}
            error={errors.manufacturer_id}
          />

          <Input
            labelText='Ngày Nhận'
            typeInput='date'
            value={batchData.received_date}
            inputValue={(value) => {
              setBatchData((prev) => ({
                ...prev,
                received_date: value,
              }));
              setErrors((prev) => ({
                ...prev,
                received_date: validateField('received_date', value),
              }));
            }}
            error={errors.received_date}
          />
        </div>

        <div className='space-y-4'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-md font-semibold text-gray-900 dark:text-white'>
              Danh Sách Sản Phẩm
            </h3>
            <button
              type='button'
              onClick={addNewItem}
              className='flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            >
              <Plus className='w-4 h-4 mr-2' />
              Thêm Sản Phẩm
            </button>
          </div>

          <div className=''>
            <table className='w-full border-collapse'>
              <thead>
                <tr className='bg-gray-50 dark:bg-gray-700 text-sm'>
                  <th className='px-4 py-2 text-left'>STT</th>
                  <th className='px-4 py-2 text-left'>Sản Phẩm</th>
                  <th className='px-4 py-2 text-right'>Số Lượng</th>
                  <th className='px-4 py-2 text-right'>Đơn Giá</th>
                  <th className='px-4 py-2 text-center'>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {batchData.items.map((item, index) => (
                  <tr
                    key={index}
                    className='border-b dark:border-gray-600 align-top'
                  >
                    <td className='px-4 py-2'>{index + 1}</td>
                    <td className='px-4 py-2'>
                      <div className='relative'>
                        {item.product_name ? (
                          <div className='relative'>
                            <div className='flex items-center gap-2'>
                              <div>
                                <img
                                  src={`${import.meta.env.VITE_BACKEND_URL}${item.main_image}`}
                                  alt={item.product_name}
                                  className='w-10 h-10 object-cover rounded-lg'
                                />
                              </div>
                              <div className='mb-2'>
                                <div className='font-medium text-gray-900 dark:text-white'>
                                  {item.product_name}
                                </div>
                                <div className='text-sm text-gray-500'>
                                  Mã SP: {item.product_code}
                                </div>
                              </div>
                            </div>
                            <button
                              type='button'
                              onClick={() => clearProductInfo(index)}
                              className='absolute top-0 right-0 text-gray-400 hover:text-red-600'
                            >
                              <X className='w-4 h-4' />
                            </button>
                          </div>
                        ) : (
                          <Input
                            typeInput='text'
                            placeholder='Tìm kiếm sản phẩm'
                            value={searchTerms[index] || ''}
                            inputValue={(value) =>
                              handleProductSearch(index, value)
                            }
                            error={errors.items[index]?.product_id}
                          />
                        )}

                        {activeSearchIndex === index &&
                          getFilteredProducts(index).length > 0 && (
                            <div className='absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                              {getFilteredProducts(index).map((product) => (
                                <div
                                  key={product.id}
                                  className='p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b last:border-b-0'
                                  onClick={() =>
                                    handleProductSelect(index, product)
                                  }
                                >
                                  <div className='flex flex-col'>
                                    <span className='font-medium text-gray-900 dark:text-white'>
                                      {product.product_name_vn}
                                    </span>
                                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                                      Mã SP: {product.product_code}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </td>
                    <td className='px-4 py-2'>
                      <Input
                        typeInput='number'
                        placeholder='Số lượng'
                        value={item.quantity}
                        inputValue={(value) =>
                          handleItemChange(
                            index,
                            'quantity'
                          )({ target: { value } })
                        }
                        error={errors.items[index]?.quantity}
                      />
                    </td>
                    <td className='px-4 py-2 max-w-64'>
                      <Input
                        typeInput='number'
                        placeholder='Đơn giá'
                        value={item.unit_price}
                        inputValue={(value) =>
                          handleItemChange(
                            index,
                            'unit_price'
                          )({ target: { value } })
                        }
                        error={errors.items[index]?.unit_price}
                      />
                      {item.unit_price && (
                        <div className='text-sm text-gray-500 italic mt-2'>
                          {amountInWords.items[`${index}_price`]}
                        </div>
                      )}
                    </td>
                    <td className='px-4 py-2 text-center'>
                      <button
                        type='button'
                        onClick={() => removeItem(index)}
                        className='text-red-600 hover:text-red-700 disabled:text-gray-400'
                        disabled={batchData.items.length === 1}
                      >
                        <Trash2 className='w-5 h-5' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
          <div className='grid grid-cols-2 gap-4 text-md text-gray-900 dark:text-white'>
            <div className='font-medium'>Tổng Số Lượng:</div>
            <div className='text-right'>{totalProducts.toLocaleString()}</div>
            <div className='font-medium'>Tổng Giá Trị:</div>
            <div className='text-right'>
              <div>{totalPrice.toLocaleString()} VNĐ</div>
              <div className='text-sm text-gray-500 italic mt-1'>
                {amountInWords.total}
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={isSubmitting || !isFormValid()}
            className={`px-6 py-2 text-white rounded-lg transition-colors ${
              isSubmitting || !isFormValid()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Đang Lưu...' : 'Lưu Lô Hàng'}
          </button>
        </div>
        <div className='text-sm text-gray-500 mb-4'>
          <span className='text-red-500'>*</span> Tất cả các trường bắt buộc
          phải nhập
        </div>
      </form>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          description={toast.description}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
};

export default BatchEntryForm;
