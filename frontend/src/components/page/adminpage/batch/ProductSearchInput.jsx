import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import debounce from 'lodash/debounce';

const ProductSearchInput = ({
  label,
  error,
  onSelect,
  products,
  selectedProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Debounced search function
  const debouncedSearch = debounce((term) => {
    if (!term.trim()) {
      setFilteredProducts([]);
      return;
    }

    const searchResults = products.filter(
      (product) =>
        product.product_code.toLowerCase().includes(term.toLowerCase()) ||
        product.product_name_vn.toLowerCase().includes(term.toLowerCase()) ||
        product.product_name__en.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredProducts(searchResults);
  }, 500);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);
    debouncedSearch(value);
  };

  // Handle product selection
  const handleProductSelect = (product) => {
    onSelect(product);
    setSearchTerm(product.product_name_vn); // Set input to Vietnamese name
    setShowDropdown(false);
  };

  // Update search term when selected product changes
  useEffect(() => {
    if (selectedProduct) {
      setSearchTerm(selectedProduct.product_name_vn || '');
    }
  }, [selectedProduct]);

  return (
    <div className='space-y-1 relative'>
      <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
        {label}
      </label>

      <div className='relative'>
        <input
          type='text'
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          placeholder='Nhập tên hoặc mã sản phẩm'
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-10
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
          `}
        />
        <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
      </div>

      {error && <p className='text-sm text-red-600'>{error}</p>}

      {/* Search Results Dropdown */}
      {showDropdown && filteredProducts.length > 0 && (
        <div className='absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border rounded-lg shadow-lg max-h-60 overflow-y-auto'>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductSelect(product)}
              className='p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b last:border-b-0'
            >
              <div className='flex items-start gap-3'>
                {/* Product Image */}
                <div className='flex-shrink-0 w-12 h-12'>
                  <img
                    src={product.main_image}
                    alt={product.product_name_vn}
                    className='w-full h-full object-cover rounded'
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://192.168.0.102:3000/api/uploads/manufacturers/manufacturer_1736027747656-145488137.webp'; // Add your placeholder image path
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className='flex-1'>
                  <div className='font-medium text-gray-900 dark:text-white'>
                    {product.product_name_vn}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    Mã SP: {product.product_code}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSearchInput;
