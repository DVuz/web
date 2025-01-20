import React, { useState } from 'react';

// Quantity Control Component (same as before)
const QuantityControl = ({ value, onChange, maxQuantity }) => {
  return (
    <div className='flex items-center border rounded-lg'>
      <button
        className='px-3 py-1 hover:bg-gray-100'
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        -
      </button>
      <input
        type='number'
        min='1'
        max={maxQuantity}
        value={value}
        onChange={(e) =>
          onChange(
            Math.min(maxQuantity, Math.max(1, parseInt(e.target.value) || 1))
          )
        }
        className='w-16 text-center border-x py-1'
      />
      <button
        className='px-3 py-1 hover:bg-gray-100'
        onClick={() => onChange(Math.min(maxQuantity, value + 1))}
      >
        +
      </button>
    </div>
  );
};

// Individual Order Item Component (same as before)
const OrderItem = ({ item, onOrderSingle, onUpdateQuantity }) => {
  const maxQuantity = 10;

  return (
    <div className='border rounded-lg p-4 mb-4 bg-white'>
      <div className='flex items-center'>
        <div className='relative'>
          <img
            src={item.main_image}
            alt={item.product_name__en}
            className='w-20 h-20 object-cover rounded'
          />
          {item.discount > 0 && (
            <span className='absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded'>
              -{item.discount}%
            </span>
          )}
        </div>
        <div className='ml-4 flex-grow'>
          <h3 className='font-semibold'>{item.product_name__en}</h3>
          <p className='text-gray-600'>{item.product_name_vn}</p>
          <div className='flex items-center gap-2'>
            <p className='text-blue-600 font-medium'>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(item.price * (1 - item.discount / 100))}
            </p>
            {item.discount > 0 && (
              <p className='text-gray-400 line-through text-sm'>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(item.price)}
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-col items-end gap-2'>
          <QuantityControl
            value={item.quantity}
            onChange={(newQuantity) => onUpdateQuantity(item.id, newQuantity)}
            maxQuantity={maxQuantity}
          />
          <button
            onClick={() => onOrderSingle(item)}
            className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

// Order Summary Component (previously missing)
const OrderSummary = ({ items, onClose, isMultiOrder }) => {
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    note: '',
  });

  const calculateTotal = (items) => {
    return items.reduce(
      (sum, item) =>
        sum + item.price * (1 - item.discount / 100) * item.quantity,
      0
    );
  };

  const total = calculateTotal(items);
  const shippingFee = 30000;
  const finalTotal = total + shippingFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle order submission
    console.log('Order placed:', {
      items,
      customerInfo,
      subtotal: total,
      shippingFee,
      finalTotal,
    });
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-2xl font-bold'>
              {isMultiOrder ? 'Đặt hàng tất cả' : 'Đặt hàng'}
            </h2>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700'
            >
              ✕
            </button>
          </div>

          <div className='mb-6'>
            <h3 className='font-semibold mb-2'>Sản phẩm đặt mua:</h3>
            {items.map((item) => (
              <div key={item.id} className='flex items-center py-2 border-b'>
                <img
                  src={item.main_image}
                  alt={item.product_name__en}
                  className='w-16 h-16 object-cover rounded'
                />
                <div className='ml-4 flex-grow'>
                  <p className='font-medium'>{item.product_name__en}</p>
                  <p className='text-sm text-gray-600'>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(item.price * (1 - item.discount / 100))}{' '}
                    x {item.quantity}
                  </p>
                  {item.discount > 0 && (
                    <p className='text-xs text-red-500'>
                      Giảm giá {item.discount}%
                    </p>
                  )}
                </div>
                <p className='font-semibold'>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(
                    item.price * (1 - item.discount / 100) * item.quantity
                  )}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Họ và tên
              </label>
              <input
                type='text'
                required
                className='w-full p-2 border rounded'
                value={customerInfo.fullName}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, fullName: e.target.value })
                }
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Số điện thoại
                </label>
                <input
                  type='tel'
                  required
                  className='w-full p-2 border rounded'
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>Email</label>
                <input
                  type='email'
                  required
                  className='w-full p-2 border rounded'
                  value={customerInfo.email}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>
                Địa chỉ giao hàng
              </label>
              <textarea
                required
                className='w-full p-2 border rounded'
                rows='2'
                value={customerInfo.address}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, address: e.target.value })
                }
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Ghi chú</label>
              <textarea
                className='w-full p-2 border rounded'
                rows='2'
                value={customerInfo.note}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, note: e.target.value })
                }
              />
            </div>

            <div className='border-t pt-4'>
              <div className='flex justify-between mb-2'>
                <span>Tạm tính:</span>
                <span>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(total)}
                </span>
              </div>
              <div className='flex justify-between mb-2'>
                <span>Phí vận chuyển:</span>
                <span>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(shippingFee)}
                </span>
              </div>
              <div className='flex justify-between font-bold text-lg'>
                <span>Tổng cộng:</span>
                <span>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(finalTotal)}
                </span>
              </div>
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700'
            >
              Xác nhận đặt hàng
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main Cart Component (same as before)
const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      product_name__en: 'Modern Wooden Chair',
      product_name_vn: 'Ghế gỗ hiện đại',
      price: 1500000,
      quantity: 2,
      main_image: 'https://192.168.0.102:3000/api/media/test/b.jpg',
      discount: 10,
      category: 'Furniture',
    },
    {
      id: 2,
      product_name__en: 'Dining Table',
      product_name_vn: 'Bàn ăn',
      price: 3000000,
      quantity: 1,
      main_image: 'https://192.168.0.102:3000/api/media/test/b.jpg',
      discount: 0,
      category: 'Furniture',
    },
    {
      id: 3,
      product_name__en: 'Luxury Sofa',
      product_name_vn: 'Ghế sofa cao cấp',
      price: 5000000,
      quantity: 1,
      main_image: 'https://192.168.0.102:3000/api/media/test/b.jpg',
      discount: 15,
      category: 'Furniture',
    },
    {
      id: 4,
      product_name__en: 'Desk Lamp',
      product_name_vn: 'Đèn bàn',
      price: 250000,
      quantity: 2,
      main_image: 'https://192.168.0.102:3000/api/media/test/b.jpg',
      discount: 0,
      category: 'Lighting',
    },
    {
      id: 5,
      product_name__en: 'Bedside Table',
      product_name_vn: 'Tủ đầu giường',
      price: 800000,
      quantity: 1,
      main_image: 'https://192.168.0.102:3000/api/media/test/b.jpg',
      discount: 5,
      category: 'Furniture',
    },
  ]);

  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [isMultiOrder, setIsMultiOrder] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    ...new Set(cartItems.map((item) => item.category)),
  ];

  const handleOrderSingle = (item) => {
    setOrderItems([item]);
    setIsMultiOrder(false);
    setShowOrderSummary(true);
  };

  const handleOrderAll = () => {
    const filteredItems =
      selectedCategory === 'All'
        ? cartItems
        : cartItems.filter((item) => item.category === selectedCategory);
    setOrderItems(filteredItems);
    setIsMultiOrder(true);
    setShowOrderSummary(true);
  };

  const updateQuantity = (id, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const filteredItems =
    selectedCategory === 'All'
      ? cartItems
      : cartItems.filter((item) => item.category === selectedCategory);

  const calculateTotal = (items) => {
    return items.reduce(
      (sum, item) =>
        sum + item.price * (1 - item.discount / 100) * item.quantity,
      0
    );
  };

  return (
    <div className=' mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-6'>Giỏ hàng của bạn</h2>

      {cartItems.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>Giỏ hàng trống</div>
      ) : (
        <>
          <div className='mb-4 flex items-center space-x-2'>
            <span className='text-gray-600'>Lọc theo danh mục:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className='space-y-4'>
            {filteredItems.map((item) => (
              <OrderItem
                key={item.id}
                item={item}
                onOrderSingle={handleOrderSingle}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </div>

          <div className='mt-6 border-t pt-4'>
            <div className='flex justify-between items-center mb-4'>
              <span className='text-lg'>
                Tổng tiền ({filteredItems.length} sản phẩm):
              </span>
              <span className='text-xl font-bold text-blue-600'>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(calculateTotal(filteredItems))}
              </span>
            </div>
            <button
              onClick={handleOrderAll}
              className='w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700'
            >
              Đặt hàng{' '}
              {selectedCategory === 'All' ? 'tất cả' : `${selectedCategory}`}
            </button>
          </div>
        </>
      )}

      {showOrderSummary && (
        <OrderSummary
          items={orderItems}
          onClose={() => setShowOrderSummary(false)}
          isMultiOrder={isMultiOrder}
        />
      )}
    </div>
  );
};

export default ShoppingCart;
