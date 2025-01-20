import React, { useState } from 'react';
import Input from '../../../common/Input';

const ShippingFee = () => {
  const [shippingData, setShippingData] = useState({
    min_distance: '',
    max_distance: '',
    fee: '',
  });

  const [errors, setErrors] = useState({
    min_distance: '',
    max_distance: '',
    fee: '',
  });

  const validateField = (field, value) => {
    switch (field) {
      case 'min_distance':
        if (!value) return 'Khoảng cách tối thiểu không được để trống';
        if (value < 0) return 'Khoảng cách tối thiểu phải lớn hơn hoặc bằng 0';
        return '';

      case 'max_distance':
        if (!value) return 'Khoảng cách tối đa không được để trống';
        if (parseInt(value) <= parseInt(shippingData.min_distance))
          return 'Khoảng cách tối đa phải lớn hơn khoảng cách tối thiểu';
        return '';

      case 'fee':
        if (!value) return 'Phí vận chuyển không được để trống';
        if (value < 0) return 'Phí vận chuyển phải lớn hơn hoặc bằng 0';
        return '';

      default:
        return '';
    }
  };

  const handleInputChange = (field) => (value) => {
    setShippingData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  const validateForm = () => {
    const newErrors = {
      min_distance: validateField('min_distance', shippingData.min_distance),
      max_distance: validateField('max_distance', shippingData.max_distance),
      fee: validateField('fee', shippingData.fee),
    };
    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Form Data:', shippingData);
      // Gọi API để lưu dữ liệu
    } else {
      console.log('Form has errors');
    }
  };

  return (
    <div className='max-w-3xl mx-auto p-6 space-y-6'>
      <h2 className='text-2xl font-bold mb-6'>Cấu hình phí vận chuyển</h2>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input
            labelText='Khoảng cách tối thiểu (km)'
            typeInput='number'
            placeholder='Nhập khoảng cách tối thiểu'
            inputValue={handleInputChange('min_distance')}
            error={errors.min_distance}
          />

          <Input
            labelText='Khoảng cách tối đa (km)'
            typeInput='number'
            placeholder='Nhập khoảng cách tối đa'
            inputValue={handleInputChange('max_distance')}
            error={errors.max_distance}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Input
            labelText='Phí vận chuyển (VNĐ)'
            typeInput='number'
            placeholder='Nhập phí vận chuyển'
            inputValue={handleInputChange('fee')}
            error={errors.fee}
          />
        </div>

        <div className='flex justify-end'>
          <button
            type='submit'
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Lưu cấu hình
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingFee;
