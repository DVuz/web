import { useState } from 'react';
import Input from '../../../common/Input';

export default function DiscountForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountTarget, setDiscountTarget] = useState('none'); // 'none', 'products', 'categories'
  const [formData, setFormData] = useState({
    discount_code: '',
    discount_name: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_amount: '',
    max_discount_value: '',
    start_date: '',
    end_date: '',
    usage_limit: 1,
    status: 'active',
    target_type: 'public',
    user_restriction: 'all',
    max_uses_per_user: 1,
    description: '',
    selectedProducts: [],
    selectedCategories: [],
  });
  // Simulated data - replace with actual data from your API
  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', price: 100000 },
    { id: 2, name: 'Product 2', price: 200000 },
    // Add more products...
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    // Add more categories...
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.discount_code.trim()) {
      newErrors.discount_code = 'Discount code is required';
    }

    if (!formData.discount_name.trim()) {
      newErrors.discount_name = 'Discount name is required';
    }

    // Discount value validation
    if (!formData.discount_value) {
      newErrors.discount_value = 'Discount value is required';
    } else {
      const discountValue = Number(formData.discount_value);
      if (isNaN(discountValue) || discountValue <= 0) {
        newErrors.discount_value = 'Please enter a valid positive number';
      } else if (
        formData.discount_type === 'percentage' &&
        discountValue > 100
      ) {
        newErrors.discount_value = 'Percentage discount cannot exceed 100%';
      }
    }

    // Date validation
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (
      formData.end_date &&
      new Date(formData.end_date) <= new Date(formData.start_date)
    ) {
      newErrors.end_date = 'End date must be after start date';
    }

    // Usage limit validation
    if (!formData.usage_limit) {
      newErrors.usage_limit = 'Usage limit is required';
    } else if (Number(formData.usage_limit) < 1) {
      newErrors.usage_limit = 'Usage limit must be at least 1';
    }

    // Minimum order amount validation
    if (!formData.min_order_amount) {
      newErrors.min_order_amount = 'Minimum order amount is required';
    } else if (Number(formData.min_order_amount) < 0) {
      newErrors.min_order_amount = 'Minimum order amount cannot be negative';
    }

    // Maximum discount value validation
    if (!formData.max_discount_value) {
      newErrors.max_discount_value = 'Maximum discount value is required';
    } else if (Number(formData.max_discount_value) <= 0) {
      newErrors.max_discount_value =
        'Maximum discount value must be greater than 0';
    }

    // Target validation
    if (
      discountTarget === 'products' &&
      formData.selectedProducts.length === 0
    ) {
      newErrors.selectedProducts = 'Please select at least one product';
    }

    if (
      discountTarget === 'categories' &&
      formData.selectedCategories.length === 0
    ) {
      newErrors.selectedCategories = 'Please select at least one category';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);

    // Log validation results for debugging
    if (Object.keys(newErrors).length > 0) {
      console.log('Form validation failed:', newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Format the data for API submission
      const payload = {
        ...formData,
        discount_value: Number(formData.discount_value),
        min_order_amount: formData.min_order_amount
          ? Number(formData.min_order_amount)
          : null,
        max_discount_value: formData.max_discount_value
          ? Number(formData.max_discount_value)
          : null,
      };

      console.log('Form submitted:', payload);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API delay

      // Reset form after successful submission
      setFormData({
        discount_code: '',
        discount_name: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_amount: '',
        max_discount_value: '',
        start_date: '',
        end_date: '',
        usage_limit: 1,
        status: 'active',
        target_type: 'public',
        user_restriction: 'all',
        max_uses_per_user: 1,
        description: '',
        selectedProducts: [],
        selectedCategories: [],
      });
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleProductSelection = (productId) => {
    setFormData((prev) => {
      const exists = prev.selectedProducts.includes(productId);
      let newSelectedProducts;

      if (exists) {
        newSelectedProducts = prev.selectedProducts.filter(
          (id) => id !== productId
        );
      } else {
        newSelectedProducts = [...prev.selectedProducts, productId];
      }

      return {
        ...prev,
        selectedProducts: newSelectedProducts,
      };
    });
  };

  const handleCategorySelection = (categoryId) => {
    setFormData((prev) => {
      const exists = prev.selectedCategories.includes(categoryId);
      let newSelectedCategories;

      if (exists) {
        newSelectedCategories = prev.selectedCategories.filter(
          (id) => id !== categoryId
        );
      } else {
        newSelectedCategories = [...prev.selectedCategories, categoryId];
      }

      return {
        ...prev,
        selectedCategories: newSelectedCategories,
      };
    });
  };
  const DiscountTargetSection = () => (
    <div>
      <h2 className='text-lg font-semibold text-gray-900 mb-4 pb-2 border-b'>
        Discount Application
      </h2>

      <div className='space-y-4'>
        <div className='flex space-x-4'>
          <button
            type='button'
            onClick={() => setDiscountTarget('none')}
            className={`px-4 py-2 rounded-lg ${
              discountTarget === 'none'
                ? 'bg-blue-100 text-blue-700 border-blue-300'
                : 'bg-gray-100 text-gray-700 border-gray-300'
            } border`}
          >
            Apply to All
          </button>

          <button
            type='button'
            onClick={() => setDiscountTarget('products')}
            className={`px-4 py-2 rounded-lg ${
              discountTarget === 'products'
                ? 'bg-blue-100 text-blue-700 border-blue-300'
                : 'bg-gray-100 text-gray-700 border-gray-300'
            } border`}
          >
            Select Products
          </button>

          <button
            type='button'
            onClick={() => setDiscountTarget('categories')}
            className={`px-4 py-2 rounded-lg ${
              discountTarget === 'categories'
                ? 'bg-blue-100 text-blue-700 border-blue-300'
                : 'bg-gray-100 text-gray-700 border-gray-300'
            } border`}
          >
            Select Categories
          </button>
        </div>

        {(discountTarget === 'products' || discountTarget === 'categories') && (
          <div className='mt-4'>
            <Input
              labelText='Search'
              typeInput='text'
              placeholder={`Search ${discountTarget === 'products' ? 'products' : 'categories'}...`}
              inputValue={setSearchTerm}
            />
          </div>
        )}

        {discountTarget === 'products' && (
          <div className='mt-4 border rounded-lg overflow-hidden'>
            <div className='max-h-96 overflow-y-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50 sticky top-0'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Select
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Product Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {products
                    .filter((product) =>
                      product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((product) => (
                      <tr key={product.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <input
                            type='checkbox'
                            checked={formData.selectedProducts.includes(
                              product.id
                            )}
                            onChange={() => handleProductSelection(product.id)}
                            className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                          />
                        </td>
                        <td className='px-6 py-4'>{product.name}</td>
                        <td className='px-6 py-4'>
                          {product.price.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className='bg-gray-50 px-6 py-3'>
              Selected Products: {formData.selectedProducts.length}
            </div>
          </div>
        )}

        {discountTarget === 'categories' && (
          <div className='mt-4 border rounded-lg overflow-hidden'>
            <div className='max-h-96 overflow-y-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50 sticky top-0'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Select
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                      Category Name
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {categories
                    .filter((category) =>
                      category.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((category) => (
                      <tr key={category.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <input
                            type='checkbox'
                            checked={formData.selectedCategories.includes(
                              category.id
                            )}
                            onChange={() =>
                              handleCategorySelection(category.id)
                            }
                            className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                          />
                        </td>
                        <td className='px-6 py-4'>{category.name}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className='bg-gray-50 px-6 py-3'>
              Selected Categories: {formData.selectedCategories.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  return (
    <div className='flex-1 p-8 bg-gray-50 overflow-y-auto h-full'>
      <div className='max-w-4xl mx-auto'>
        {/* Header Section */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>
            Create New Discount
          </h1>
          <p className='mt-1 text-sm text-gray-600'>
            Set up a new discount campaign for your products or categories.
          </p>
        </div>

        {/* Main Form Card */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
          <div className='p-6'>
            <form onSubmit={handleSubmit} className='space-y-8'>
              {/* Basic Information */}
              <div>
                <h2 className='text-lg font-semibold text-gray-900 mb-4 pb-2 border-b'>
                  Basic Information
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <Input
                    labelText='Discount Code'
                    typeInput='text'
                    placeholder='e.g., SUMMER2024'
                    inputValue={(value) =>
                      setFormData((prev) => ({ ...prev, discount_code: value }))
                    }
                    error={errors.discount_code}
                  />

                  <Input
                    labelText='Discount Name'
                    typeInput='text'
                    placeholder='e.g., Summer Sale 2024'
                    inputValue={(value) =>
                      setFormData((prev) => ({ ...prev, discount_name: value }))
                    }
                    error={errors.discount_name}
                  />

                  <div className='space-y-2'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Discount Type
                    </label>
                    <select
                      value={formData.discount_type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          discount_type: e.target.value,
                        }))
                      }
                      className='mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
                    >
                      <option value='percentage'>Percentage</option>
                      <option value='fixed'>Fixed Amount</option>
                    </select>
                  </div>

                  <Input
                    labelText={
                      formData.discount_type === 'percentage'
                        ? 'Discount Percentage'
                        : 'Discount Amount'
                    }
                    typeInput='number'
                    placeholder={
                      formData.discount_type === 'percentage'
                        ? 'e.g., 10'
                        : 'e.g., 100000'
                    }
                    inputValue={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        discount_value: value,
                      }))
                    }
                    error={errors.discount_value}
                  />
                </div>
              </div>

              {/* Validity Period */}
              <div>
                <h2 className='text-lg font-semibold text-gray-900 mb-4 pb-2 border-b'>
                  Validity Period
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <Input
                    labelText='Start Date'
                    typeInput='datetime-local'
                    inputValue={(value) =>
                      setFormData((prev) => ({ ...prev, start_date: value }))
                    }
                    error={errors.start_date}
                  />

                  <Input
                    labelText='End Date (Optional)'
                    typeInput='datetime-local'
                    inputValue={(value) =>
                      setFormData((prev) => ({ ...prev, end_date: value }))
                    }
                  />
                </div>
              </div>

              {/* Usage Limits */}
              <div>
                <h2 className='text-lg font-semibold text-gray-900 mb-4 pb-2 border-b'>
                  Usage Restrictions
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <Input
                    labelText='Usage Limit'
                    typeInput='number'
                    placeholder='e.g., 100'
                    inputValue={(value) =>
                      setFormData((prev) => ({ ...prev, usage_limit: value }))
                    }
                  />

                  <Input
                    labelText='Max Uses Per User'
                    typeInput='number'
                    placeholder='e.g., 1'
                    inputValue={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        max_uses_per_user: value,
                      }))
                    }
                  />

                  <Input
                    labelText='Minimum Order Amount'
                    typeInput='number'
                    placeholder='e.g., 500000'
                    inputValue={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        min_order_amount: value,
                      }))
                    }
                    error={errors.min_order_amount}
                  />

                  <Input
                    labelText='Maximum Discount Value'
                    typeInput='number'
                    placeholder='e.g., 100000'
                    inputValue={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        max_discount_value: value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Target Settings */}
              <div>
                <h2 className='text-lg font-semibold text-gray-900 mb-4 pb-2 border-b'>
                  Target Settings
                </h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Target Type
                    </label>
                    <select
                      value={formData.target_type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          target_type: e.target.value,
                        }))
                      }
                      className='mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
                    >
                      <option value='public'>Public</option>
                      <option value='private'>Private</option>
                      <option value='specific_users'>Specific Users</option>
                    </select>
                  </div>

                  <div className='space-y-2'>
                    <label className='block text-sm font-medium text-gray-700'>
                      User Restriction
                    </label>
                    <select
                      value={formData.user_restriction}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          user_restriction: e.target.value,
                        }))
                      }
                      className='mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
                    >
                      <option value='all'>All Users</option>
                      <option value='new'>New Users</option>
                      <option value='vip'>VIP Users</option>
                    </select>
                  </div>
                </div>
              </div>

              <DiscountTargetSection />
              {/* Description */}
              <div>
                <Input
                  labelText='Description'
                  typeInput='textarea'
                  placeholder='Enter discount description and terms...'
                  inputValue={(value) =>
                    setFormData((prev) => ({ ...prev, description: value }))
                  }
                />
              </div>

              {/* Form Actions */}
              <div className='flex justify-end space-x-4 pt-4 border-t'>
                <button
                  type='button'
                  className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  onClick={() => {
                    setFormData({
                      discount_code: '',
                      discount_name: '',
                      discount_type: 'percentage',
                      discount_value: '',
                      min_order_amount: '',
                      max_discount_value: '',
                      start_date: '',
                      end_date: '',
                      usage_limit: 1,
                      status: 'active',
                      target_type: 'public',
                      user_restriction: 'all',
                      max_uses_per_user: 1,
                      description: '',
                      selectedProducts: [],
                      selectedCategories: [],
                    });
                    setErrors({});
                  }}
                >
                  Reset Form
                </button>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? 'Creating...' : 'Create Discount'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
