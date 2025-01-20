import React from 'react';

export const OrderConfirmationModal = ({ 
  isOpen, 
  onClose, 
  orderDetails, 
  onConfirm,
  formatPrice 
}) => {
  if (!isOpen || !orderDetails) return null;

  const { 
    selectedItems, 
    addressData, 
    shippingMethod, 
    shippingFee,
    subtotal,
    total,
    distance,
    duration
  } = orderDetails;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="border-b pb-4">
            <h2 className="text-2xl font-semibold">Xác nhận đơn hàng</h2>
            <p className="text-gray-500 mt-1">Vui lòng kiểm tra lại thông tin đơn hàng của bạn</p>
          </div>

          {/* Shipping Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Thông tin nhận hàng</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><span className="font-medium">Người nhận:</span> {addressData.recipientName}</p>
              <p><span className="font-medium">Số điện thoại:</span> {addressData.phoneNumber}</p>
              <p><span className="font-medium">Địa chỉ:</span> {addressData.exact_address}</p>
              <p><span className="font-medium">Khoảng cách:</span> {distance.toFixed(1)}km</p>
              <p><span className="font-medium">Thời gian dự kiến:</span> {duration}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Sản phẩm</h3>
            <div className="space-y-3">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.product.main_image} 
                      alt={item.product.product_name__en}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.product.product_name__en}</p>
                      <p className="text-sm text-gray-500">{item.product.product_name_vn}</p>
                      <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                    <p className="text-sm text-gray-500">{formatPrice(item.product.price)} / sản phẩm</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng tiền hàng</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phương thức vận chuyển</span>
              <span className="font-medium">
                {shippingMethod === 'standard' ? 'Giao hàng tiêu chuẩn' : 'Giao hàng nhanh'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="font-medium">{formatPrice(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-3 border-t">
              <span>Tổng thanh toán</span>
              <span className="text-blue-600">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Phương thức thanh toán</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-4 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Xác nhận đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;