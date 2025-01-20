import React, { useState, useEffect, useMemo } from 'react';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  CreditCard, 
  ArrowLeft, 
  Package, 
  Loader2 
} from 'lucide-react';
import { useCart } from '../../../../contexts/CartProvider';
import Checkbox from '../../../common/Checkbox';
import CustomerAddressForm from './CustomerAddressForm';
import { getShippingFees } from '../../../../services/getApi';
import { OrderConfirmationModal } from './OrderConfirmationModal';

const CartList = () => {
  // Cart context
  const { cartItems, loading: cartLoading, updateQuantity, removeItem } = useCart();

  // State management
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [addressData, setAddressData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Shipping state
  const [shippingState, setShippingState] = useState({
    method: 'standard',
    fees: null,
    baseShippingFee: 0,
    distance: null,
    distanceMatrix: null,
    loading: false,
    error: null
  });

  // Environment variables
  const localAddress = import.meta.env.VITE_LOCAL_ADDRESS;
  const googleMapsApiKey2 = import.meta.env.VITE_GOOGLE_MAPS_API_KEY2;

  // Fetch shipping fees on mount
  useEffect(() => {
    const fetchShippingFees = async () => {
      try {
        const response = await getShippingFees();
        setShippingState(prev => ({ ...prev, fees: response.fees }));
      } catch (error) {
        setShippingState(prev => ({ ...prev, error: 'Error fetching shipping fees' }));
        console.error('Error fetching shipping fees:', error);
      }
    };
    fetchShippingFees();
  }, []);

  // Calculate distance when address changes
  useEffect(() => {
    if (!addressData?.exact_address || !shippingState.fees) return;
    console.log('Calculating distance...');
    const debounceTimer = setTimeout(async () => {
      setShippingState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const cleanedAddress = addressData.exact_address
          .replace(/(Phường|Quận|Thành phố)\s+/g, "")
          .trim();
        
        const response = await fetch(
          `https://maps.gomaps.pro/maps/api/distancematrix/json?units=metric&origins=${
            (localAddress)
          }&destinations=${
            encodeURIComponent(cleanedAddress)
          }&key=${googleMapsApiKey2}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch distance data');
        }
        
        const data = await response.json();
        
        if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
          const distanceInKm = data.rows[0].elements[0].distance.value / 1000;
          
          const applicableFee = shippingState.fees.find(fee => 
            distanceInKm >= fee.min_distance && distanceInKm < fee.max_distance
          );
          
          setShippingState(prev => ({
            ...prev,
            distanceMatrix: data,
            distance: distanceInKm,
            baseShippingFee: applicableFee?.fee || 0,
            loading: false
          }));
        }
      } catch (error) {
        setShippingState(prev => ({
          ...prev,
          loading: false,
          error: 'Error calculating distance'
        }));
        console.error('Error calculating distance:', error);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [addressData?.exact_address, shippingState.fees, localAddress, googleMapsApiKey2]);

  // Memoized calculations
  const getShippingRate = useMemo(() => {
    const expressShippingSurcharge = 200000;
    return {
      standard: { 
        price: shippingState.baseShippingFee, 
        days: '3-5', 
        label: 'Giao hàng tiêu chuẩn' 
      },
      express: { 
        price: shippingState.baseShippingFee + expressShippingSurcharge, 
        days: '1-2', 
        label: 'Giao hàng nhanh' 
      },
    };
  }, [shippingState.baseShippingFee]);

  const calculateSubtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => 
        selectedItems.has(item.id) 
          ? sum + item.product.price * item.quantity 
          : sum,
      0
    );
  }, [cartItems, selectedItems]);

  const calculateTotal = useMemo(() => {
    return calculateSubtotal + getShippingRate[shippingState.method].price;
  }, [calculateSubtotal, getShippingRate, shippingState.method]);

  // Event handlers
  const handleUpdateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    const result = await updateQuantity(cartId, newQuantity);
    if (!result.success) {
      console.error('Failed to update quantity:', result.error);
    }
  };

  const handleRemoveItem = async (cartId) => {
    const result = await removeItem(cartId);
    if (result.success) {
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartId);
        return newSet;
      });
    } else {
      console.error('Failed to remove item:', result.error);
    }
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.size === cartItems.length
        ? new Set()
        : new Set(cartItems.map(item => item.id))
    );
  };

  const handleToggleItem = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      prev.has(itemId) ? newSet.delete(itemId) : newSet.add(itemId);
      return newSet;
    });
  };

  const handleCheckout = () => {
    const selectedItemsList = cartItems.filter(item => selectedItems.has(item.id));
    
    setOrderDetails({
      selectedItems: selectedItemsList,
      addressData,
      shippingMethod: shippingState.method,
      shippingFee: getShippingRate[shippingState.method].price,
      subtotal: calculateSubtotal,
      total: calculateTotal,
      distance: shippingState.distance,
      // duration: shippingState.distanceMatrix?.rows[0]?.elements[0]?.duration?.text || ''
      duration: "5-7 ngày"
    });
    
    setIsModalOpen(true);
  };

  const handleConfirmOrder = () => {
    // Handle order confirmation logic here
    console.log('Order confirmed:', orderDetails);
    setIsModalOpen(false);
  };

  // Format price helper
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Loading state
  if (cartLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="bg-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
          <ShoppingCart className="w-8 h-8 text-blue-500" />
        </div>
        <h3 className="mt-6 text-xl font-medium">Giỏ hàng trống</h3>
        <p className="mt-2 text-gray-500">
          Hãy khám phá các sản phẩm của chúng tôi!
        </p>
        <button className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  // Main cart view
  return (
    <div className="w-full mx-auto p-6 space-y-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Giỏ hàng</h1>
          <p className="text-gray-500 mt-1">
            {cartItems.length} sản phẩm trong giỏ hàng
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left column - Cart items */}
        <div className="flex-1 space-y-4">
          {/* Select all checkbox */}
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <Checkbox 
              label="Chọn tất cả sản phẩm" 
              checked={selectedItems.size === cartItems.length}
              onChange={handleSelectAll}
            />
          </div>

          {/* Cart items list */}
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center gap-6">
                <Checkbox
                  checked={selectedItems.has(item.id)}
                  onChange={() => handleToggleItem(item.id)}
                />

                <div className="relative">
                  <img
                    src={item.product.main_image}
                    alt={item.product.product_name__en}
                    className="w-28 h-28 object-cover rounded-lg bg-gray-50"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-lg">
                        {item.product.product_name__en}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.product.product_name_vn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm px-2 py-1 bg-gray-100 rounded text-gray-600">
                      {item.product.product_code}
                    </span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-semibold text-blue-600">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({formatPrice(item.product.price)} mỗi sản phẩm)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-1.5 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-50 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-50 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right column - Address and Summary */}
        <div className="w-96 space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
          {/* Address Form */}
          <CustomerAddressForm onAddressChange={setAddressData} />

          {/* Order Summary */}
          <div className="sticky top-6 bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="text-lg font-semibold">Tổng đơn hàng</h3>
              <Package className="w-5 h-5 text-gray-400" />
            </div>

            {/* Loading State */}
            {shippingState.loading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2">Đang tính phí vận chuyển...</span>
              </div>
            )}

            {/* Error State */}
            {shippingState.error && (
              <div className="text-red-500 p-4">
                Lỗi: {shippingState.error}
              </div>
            )}

            {/* Shipping Method Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Phương thức vận chuyển {shippingState.distance ? `(${shippingState.distance.toFixed(1)}km)` : ''}
              </label>
              <div className="space-y-3">
                {Object.entries(getShippingRate).map(([key, { label, price, days }]) => (
                  <label
                    key={key}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                      shippingState.method === key
                        ? 'bg-blue-50 border-blue-200'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={key}
                      checked={shippingState.method === key}
                      onChange={(e) => setShippingState(prev => ({
                        ...prev,
                        method: e.target.value
                      }))}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{label}</span>
                        <span className="font-medium">
                          {formatPrice(price)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {days} ngày làm việc
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Summary Details */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tổng tiền hàng</span>
                <span className="font-medium">
                  {formatPrice(calculateSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-medium">
                  {formatPrice(getShippingRate[shippingState.method].price)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-3 border-t">
                <span>Tổng thanh toán</span>
                <span className="text-blue-600">{formatPrice(calculateTotal)}</span>
              </div>
            </div>

            {/* Distance and Duration Info */}
            {shippingState.distanceMatrix?.status === 'OK' && (
              <div className="space-y-2 pt-4 border-t text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Khoảng cách:</span>
                  <span>{shippingState.distanceMatrix.rows[0].elements[0].distance.text}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thời gian dự kiến:</span>
                  <span>{shippingState.distanceMatrix.rows[0].elements[0].duration.text}</span>
                </div>
              </div>
            )}

            {/* Checkout Button */}
            <button
              disabled={
                selectedItems.size === 0 || 
                !addressData?.city || 
                !addressData?.recipientName || 
                !addressData?.phoneNumber ||
                shippingState.loading
              }
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={handleCheckout}
            >
              <CreditCard className="w-5 h-5" />
              {selectedItems.size === 0
                ? 'Vui lòng chọn sản phẩm'
                : !addressData?.city || !addressData?.recipientName || !addressData?.phoneNumber
                ? 'Vui lòng điền đầy đủ thông tin giao hàng'
                : shippingState.loading
                ? 'Đang tính phí vận chuyển...'
                : `Thanh toán (${selectedItems.size} sản phẩm)`}
            </button>

            {/* Support Section */}
            <div className="text-center border-t pt-4">
              <p className="text-sm text-gray-500 mb-2">
                Cần hỗ trợ?
              </p>
              <div className="space-y-2">
                <button className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1 mx-auto">
                  <span>Hotline: 1900 xxxx</span>
                </button>
                <button className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1 mx-auto">
                  <span>Email: support@example.com</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderDetails={orderDetails}
        onConfirm={handleConfirmOrder}
        formatPrice={formatPrice}
      />
    </div>
  );
};

export default CartList;