import React, { useState } from 'react';
import Input from '../../../common/Input';
import { Calendar } from 'lucide-react';
import CheckBox from '../../../common/Checkbox';
const ProductPricing = ({ onPriceChange, error }) => {
  const [priceData, setPriceData] = useState({
    price: '',
    effective_date: new Date().toISOString().slice(0, 16),
    valid_until_date: '',
    price_change_reason: '',
    is_active: true,
  });

  const handleInputChange = (field) => (value) => {
    const updatedPriceData = {
      ...priceData,
      [field]: value,
    };
    setPriceData(updatedPriceData);
    onPriceChange(updatedPriceData);
  };
  console.log('priceError', error);

  return (
    <div className='bg-white rounded-lg shadow p-6 h-fit'>
      <h2 className='text-lg font-semibold text-gray-700 border-b pb-2 mb-6'>
        Product Pricing
      </h2>

      <div className='space-y-6'>
        {/* Giá sản phẩm */}
        <div>
          <Input
            labelText='Price'
            typeInput='number'
            value={priceData.price}
            inputValue={handleInputChange('price')}
            placeholder='Enter price'
            step='0.01'
            min='0'
            error={error?.price}
          />
        </div>

        {/* Ngày có hiệu lực */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Effective Date and Time
          </label>
          <div className='relative'>
            <input
              type='datetime-local'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={priceData.effective_date}
              onChange={(e) =>
                handleInputChange('effective_date')(e.target.value)
              }
              min={new Date().toISOString().slice(0, 16)}
            />
            <Calendar className='absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none' />
          </div>
          {error?.effective_date && (
            <p className='text-xs text-red-600 dark:text-red-400'>
              {error.effective_date}
            </p>
          )}
        </div>

        {/* Ngày kết thúc */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Valid Until Date and Time (Optional)
          </label>
          <div className='relative'>
            <input
              type='datetime-local'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={priceData.valid_until_date}
              onChange={(e) =>
                handleInputChange('valid_until_date')(e.target.value)
              }
              min={priceData.effective_date}
            />
            <Calendar className='absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none' />
          </div>
          {error?.valid_until_date && (
            <p className='text-xs text-red-600 dark:text-red-400'>
              {error.valid_until_date}
            </p>
          )}
        </div>

        {/* Lý do thay đổi giá */}
        <div>
          <Input
            labelText='Price Change Reason (Optional)'
            typeInput='text'
            value={priceData.price_change_reason}
            inputValue={handleInputChange('price_change_reason')}
            placeholder='Enter reason for price change'
            error={error?.price_change_reason}
          />
        </div>

        {/* Trạng thái */}
        <div className='mt-4'>
          <CheckBox
            label='Active'
            checked={priceData.is_active}
            handleCheckboxChange={() =>
              handleInputChange('is_active')(!priceData.is_active)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPricing;
