import React, { useState, useMemo } from 'react';
import {
  Package,
  Search,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Calendar,
  CreditCard,
  MapPin,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

// Constants for order status
const ORDER_STATUS = {
  ORDERED: 'ordered',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Status configuration with icons and styles
const STATUS_CONFIG = {
  [ORDER_STATUS.ORDERED]: {
    color: 'text-blue-600 bg-blue-50',
    icon: Package,
    text: 'Đã đặt hàng',
  },
  [ORDER_STATUS.CONFIRMED]: {
    color: 'text-yellow-600 bg-yellow-50',
    icon: Clock,
    text: 'Đã xác nhận',
  },
  [ORDER_STATUS.PROCESSING]: {
    color: 'text-purple-600 bg-purple-50',
    icon: Package,
    text: 'Đang xử lý',
  },
  [ORDER_STATUS.SHIPPING]: {
    color: 'text-indigo-600 bg-indigo-50',
    icon: Truck,
    text: 'Đang giao hàng',
  },
  [ORDER_STATUS.DELIVERED]: {
    color: 'text-green-600 bg-green-50',
    icon: CheckCircle,
    text: 'Đã giao hàng',
  },
  [ORDER_STATUS.CANCELLED]: {
    color: 'text-red-600 bg-red-50',
    icon: AlertCircle,
    text: 'Đã hủy',
  },
};

// Utility functions for formatting
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

const CustomerOrders = () => {
  // Sample order data
  const [orders] = useState([
    {
      id: 'DH123456789',
      orderDate: '2024-01-08T10:30:00',
      status: ORDER_STATUS.DELIVERED,
      items: [
        {
          id: 1,
          name: 'Ghế Gỗ Hiện Đại',
          quantity: 2,
          price: 1500000,
          image: '/api/placeholder/80/80',
        },
        {
          id: 2,
          name: 'Bàn Ăn',
          quantity: 1,
          price: 3000000,
          image: '/api/placeholder/80/80',
        },
      ],
      total: 6000000,
      shippingAddress: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
      paymentMethod: 'COD',
      paymentStatus: 'paid',
      estimatedDelivery: '2024-01-10T15:30:00',
      timeline: [
        {
          time: '2024-01-08T10:30:00',
          status: ORDER_STATUS.ORDERED,
          description: 'Đặt hàng thành công',
        },
        {
          time: '2024-01-08T14:20:00',
          status: ORDER_STATUS.CONFIRMED,
          description: 'Đã xác nhận đơn hàng',
        },
        {
          time: '2024-01-09T08:15:00',
          status: ORDER_STATUS.PROCESSING,
          description: 'Đang chuẩn bị hàng',
        },
        {
          time: '2024-01-10T09:30:00',
          status: ORDER_STATUS.SHIPPING,
          description: 'Đang giao hàng',
        },
        {
          time: '2024-01-10T15:30:00',
          status: ORDER_STATUS.DELIVERED,
          description: 'Giao hàng thành công',
        },
      ],
    },
  ]);

  // State management
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Filtered orders based on active tab and search term
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === 'all' || order.status === activeTab;
      const matchesSearch = order.id
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  ); // Component definitions
  const OrderHeader = () => (
    <div className='mb-8'>
      <h1 className='text-2xl font-bold text-gray-900'>Đơn hàng của tôi</h1>
      <p className='mt-1 text-gray-500'>Theo dõi và quản lý đơn hàng của bạn</p>
    </div>
  );

  const OrderTabs = () => {
    const tabs = [
      { id: 'all', label: 'Tất cả', count: orders.length },
      {
        id: 'processing',
        label: 'Đang xử lý',
        count: orders.filter((o) =>
          [
            ORDER_STATUS.ORDERED,
            ORDER_STATUS.CONFIRMED,
            ORDER_STATUS.PROCESSING,
          ].includes(o.status)
        ).length,
      },
      {
        id: 'shipping',
        label: 'Đang giao',
        count: orders.filter((o) => o.status === ORDER_STATUS.SHIPPING).length,
      },
      {
        id: 'delivered',
        label: 'Đã giao',
        count: orders.filter((o) => o.status === ORDER_STATUS.DELIVERED).length,
      },
      {
        id: 'cancelled',
        label: 'Đã hủy',
        count: orders.filter((o) => o.status === ORDER_STATUS.CANCELLED).length,
      },
    ];

    return (
      <div className='border-b mb-6'>
        <nav className='flex -mb-px overflow-x-auto'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className='ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs'>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>
    );
  };

  const SearchBar = () => (
    <div className='mb-6'>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
        <input
          type='text'
          placeholder='Tìm kiếm đơn hàng theo mã đơn...'
          className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );

  const OrderCard = ({ order }) => {
    const isExpanded = expandedOrders.has(order.id);
    const statusConfig = STATUS_CONFIG[order.status];

    const toggleExpand = () => {
      setExpandedOrders((prev) => {
        const newSet = new Set(prev);
        if (isExpanded) {
          newSet.delete(order.id);
        } else {
          newSet.add(order.id);
        }
        return newSet;
      });
    };

    return (
      <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
        {/* Order Summary */}
        <div
          className='p-6 cursor-pointer hover:bg-gray-50 transition-colors'
          onClick={toggleExpand}
        >
          <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
            <div className='flex-1'>
              <div className='flex items-center gap-3'>
                <div>
                  <div className='font-medium text-gray-900'>
                    Đơn hàng {order.id}
                  </div>
                  <div className='text-sm text-gray-500'>
                    {formatDate(order.orderDate)}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusConfig.color}`}
                >
                  {React.createElement(statusConfig.icon, {
                    className: 'w-4 h-4',
                  })}
                  {statusConfig.text}
                </span>
              </div>
            </div>

            <div className='text-right'>
              <div className='font-semibold text-lg text-gray-900'>
                {formatCurrency(order.total)}
              </div>
              <div className='text-sm text-gray-500'>
                {order.items.length} sản phẩm
              </div>
            </div>

            <button
              className='p-1 hover:bg-gray-100 rounded'
              onClick={toggleExpand}
            >
              {isExpanded ? (
                <ChevronDown className='w-5 h-5 text-gray-400' />
              ) : (
                <ChevronRight className='w-5 h-5 text-gray-400' />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className='border-t px-6 py-4'>
            {/* Product List */}
            <div className='mb-6'>
              <h4 className='font-medium text-gray-900 mb-4'>
                Chi tiết sản phẩm
              </h4>
              <div className='space-y-4'>
                {order.items.map((item) => (
                  <div key={item.id} className='flex items-center gap-4'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-20 h-20 rounded-lg object-cover'
                    />
                    <div className='flex-1'>
                      <div className='font-medium text-gray-900'>
                        {item.name}
                      </div>
                      <div className='text-sm text-gray-500'>
                        Số lượng: {item.quantity}
                      </div>
                      <div className='text-sm font-medium text-gray-900'>
                        {formatCurrency(item.price)}
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-medium text-gray-900'>
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Info */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
              <div>
                <h4 className='font-medium text-gray-900 mb-4'>
                  Thông tin giao hàng
                </h4>
                <div className='space-y-3 text-sm'>
                  <div className='flex items-start gap-2'>
                    <MapPin className='w-4 h-4 text-gray-400 mt-0.5' />
                    <div>
                      <div className='text-gray-500'>Địa chỉ giao hàng:</div>
                      <div className='font-medium text-gray-900'>
                        {order.shippingAddress}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-start gap-2'>
                    <Calendar className='w-4 h-4 text-gray-400 mt-0.5' />
                    <div>
                      <div className='text-gray-500'>Ngày giao dự kiến:</div>
                      <div className='font-medium text-gray-900'>
                        {formatDate(order.estimatedDelivery)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className='font-medium text-gray-900 mb-4'>
                  Thông tin thanh toán
                </h4>
                <div className='space-y-3 text-sm'>
                  <div className='flex items-start gap-2'>
                    <CreditCard className='w-4 h-4 text-gray-400 mt-0.5' />
                    <div>
                      <div className='text-gray-500'>
                        Phương thức thanh toán:
                      </div>
                      <div className='font-medium text-gray-900'>
                        {order.paymentMethod}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-start gap-2'>
                    <FileText className='w-4 h-4 text-gray-400 mt-0.5' />
                    <div>
                      <div className='text-gray-500'>
                        Trạng thái thanh toán:
                      </div>
                      <div className='font-medium text-gray-900'>
                        {order.paymentStatus === 'paid'
                          ? 'Đã thanh toán'
                          : 'Chưa thanh toán'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className='font-medium text-gray-900 mb-4'>
                Theo dõi đơn hàng
              </h4>
              <div className='space-y-4'>
                {order.timeline.map((event, index) => (
                  <div key={index} className='flex items-start gap-4'>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center
                      ${index === 0 ? 'bg-blue-50' : 'bg-gray-50'}`}
                    >
                      {React.createElement(STATUS_CONFIG[event.status].icon, {
                        className: `w-4 h-4 ${index === 0 ? 'text-blue-600' : 'text-gray-400'}`,
                      })}
                    </div>
                    <div>
                      <div className='font-medium text-gray-900'>
                        {event.description}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {formatDate(event.time)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className='mt-6 flex flex-wrap gap-3'>
              <button className='px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2'>
                <Download className='w-4 h-4' />
                Tải hóa đơn
              </button>
              <button className='px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2'>
                <ExternalLink className='w-4 h-4' />
                Xem chi tiết
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
      <OrderHeader />
      <OrderTabs />
      <SearchBar />

      {currentOrders.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          Không tìm thấy đơn hàng nào
        </div>
      ) : (
        <div className='space-y-4'>
          {currentOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {filteredOrders.length > ordersPerPage && (
        <div className='mt-6 flex items-center justify-between'>
          <div className='text-sm text-gray-500'>
            Hiển thị {(currentPage - 1) * ordersPerPage + 1} -{' '}
            {Math.min(currentPage * ordersPerPage, filteredOrders.length)} trong
            số {filteredOrders.length} đơn hàng
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className='p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ArrowLeft className='w-5 h-5' />
            </button>
            <button
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage >= totalPages}
              className='p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <ArrowRight className='w-5 h-5' />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
