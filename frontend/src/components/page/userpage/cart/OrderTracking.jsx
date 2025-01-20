import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Phone,
} from 'lucide-react';

const OrderTracking = () => {
  const [order] = useState({
    orderId: 'ORD123456789',
    orderDate: '2024-01-08T10:30:00',
    estimatedDelivery: '2024-01-12T14:00:00',
    currentLocation: 'Kho vận chuyển Quận 7, TP.HCM',
    deliveryAddress: '123 Nguyễn Văn A, Phường 1, Quận 1, TP.HCM',
    deliveryPerson: {
      name: 'Nguyễn Văn Bình',
      phone: '0923456789',
      avatar: '/api/placeholder/48/48',
      transportId: 'GHN123456',
    },
    items: [
      {
        id: 1,
        name: 'Modern Wooden Chair',
        quantity: 2,
        price: 1500000,
        image: '/api/placeholder/120/120',
      },
      {
        id: 2,
        name: 'Dining Table',
        quantity: 1,
        price: 3000000,
        image: '/api/placeholder/120/120',
      },
    ],
    pricing: {
      subtotal: 6000000,
      shippingFee: 150000,
      discount: 500000,
      total: 5650000,
    },
    trackingSteps: [
      {
        status: 'Đã đặt hàng',
        time: '2024-01-08T10:30:00',
        description: 'Đơn hàng đã được xác nhận',
      },
      {
        status: 'Đang chuẩn bị hàng',
        time: '2024-01-09T15:45:00',
        description: 'Đơn hàng đang được đóng gói',
      },
      {
        status: 'Đang vận chuyển',
        time: '2024-01-10T08:20:00',
        description: 'Đơn hàng đã rời kho',
      },
    ],
  });

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getProgressWidth = () => {
    return `${Math.min((order.trackingSteps.length / 5) * 100, 100)}%`;
  };

  const OrderHeader = () => (
    <div className='flex justify-between items-center mb-6'>
      <h1 className='text-2xl font-bold text-gray-800'>Theo dõi đơn hàng</h1>
      <span className='px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium'>
        Mã đơn: {order.orderId}
      </span>
    </div>
  );

  const OrderItems = () => (
    <div className='bg-white rounded-xl shadow-sm p-6'>
      <h2 className='text-xl font-semibold mb-6'>Chi tiết đơn hàng</h2>
      <div className='space-y-4'>
        {order.items.map((item) => (
          <div
            key={item.id}
            className='flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
          >
            <img
              src={item.image}
              alt={item.name}
              className='w-24 h-24 object-cover rounded-lg'
            />
            <div className='flex-1'>
              <h3 className='font-semibold text-lg'>{item.name}</h3>
              <p className='text-gray-500'>Số lượng: {item.quantity}</p>
              <p className='text-blue-600 font-semibold mt-2'>
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}

        <div className='border-t pt-4 space-y-2 mt-4'>
          {[
            { label: 'Tạm tính', value: order.pricing.subtotal },
            { label: 'Phí vận chuyển', value: order.pricing.shippingFee },
            {
              label: 'Giảm giá',
              value: -order.pricing.discount,
              className: 'text-green-600',
            },
          ].map(({ label, value, className }) => (
            <div key={label} className='flex justify-between'>
              <span className={className}>{label}</span>
              <span className={className}>{formatCurrency(value)}</span>
            </div>
          ))}
          <div className='flex justify-between font-semibold text-lg pt-2 border-t mt-2'>
            <span>Tổng cộng</span>
            <span className='text-blue-600'>
              {formatCurrency(order.pricing.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const DeliveryInfo = () => (
    <div className='bg-white rounded-xl shadow-sm p-6'>
      <h2 className='text-xl font-semibold mb-6'>Thông tin vận chuyển</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        {[
          {
            Icon: Clock,
            label: 'Ngày đặt hàng',
            value: formatDate(order.orderDate),
          },
          {
            Icon: Truck,
            label: 'Dự kiến giao hàng',
            value: formatDate(order.estimatedDelivery),
          },
          {
            Icon: MapPin,
            label: 'Vị trí hiện tại',
            value: order.currentLocation,
          },
        ].map(({ Icon, label, value }) => (
          <div
            key={label}
            className='flex items-center gap-4 bg-gray-50 p-4 rounded-lg'
          >
            <Icon className='w-6 h-6 text-blue-500' />
            <div>
              <p className='text-sm text-gray-500'>{label}</p>
              <p className='font-semibold'>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='flex items-center gap-4 bg-blue-50 p-4 rounded-lg'>
        <img
          src={order.deliveryPerson.avatar}
          alt=''
          className='w-12 h-12 rounded-full'
        />
        <div>
          <div className='flex items-center gap-2'>
            <User className='w-4 h-4 text-blue-500' />
            <span className='font-semibold'>{order.deliveryPerson.name}</span>
          </div>
          <div className='flex items-center gap-2 text-gray-600 mt-1'>
            <Phone className='w-4 h-4 text-blue-500' />
            <span>
              {order.deliveryPerson.phone.replace(
                /(\d{4})(\d{3})(\d{3})/,
                '$1 $2 $3'
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const TrackingProgress = () => (
    <div className='bg-white rounded-xl shadow-sm p-6'>
      <h2 className='text-xl font-semibold mb-6'>Tiến trình giao hàng</h2>
      <div className='h-2 bg-gray-100 rounded-full overflow-hidden mb-8'>
        <div
          className='h-full bg-blue-500 rounded-full transition-all duration-500'
          style={{ width: getProgressWidth() }}
        />
      </div>

      <div className='space-y-8'>
        {order.trackingSteps.map((step, index) => (
          <div key={index} className='relative'>
            {index !== order.trackingSteps.length - 1 && (
              <div className='absolute left-4 top-8 w-0.5 h-full bg-gray-200' />
            )}
            <div className='flex items-start group'>
              <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-4 shrink-0 transition-transform group-hover:scale-110'>
                <CheckCircle className='w-5 h-5 text-white' />
              </div>
              <div className='bg-gray-50 p-4 rounded-lg flex-grow'>
                <h3 className='font-semibold'>{step.status}</h3>
                <p className='text-sm text-gray-500 mt-1'>
                  {formatDate(step.time)}
                </p>
                <p className='text-sm text-gray-600 mt-2'>{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className='max-w-5xl mx-auto p-6 space-y-6 bg-gray-50'>
      <OrderHeader />
      <OrderItems />
      <DeliveryInfo />
      <TrackingProgress />
    </div>
  );
};

export default OrderTracking;
