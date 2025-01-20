import React, { useState, useMemo } from 'react';
import {
  Package,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  Calendar,
  ArrowDown,
  ArrowUp,
  Download,
  Printer,
  MoreVertical,
  User,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  Share2,
  FileText,
  RefreshCcw,
  Archive,
  Trash2,
  ListFilter,
} from 'lucide-react';

const OrderManagement = () => {
  const [orders] = useState([
    {
      id: 'ORD123456789',
      customerName: 'Nguyễn Văn A',
      customerEmail: 'nguyenvana@email.com',
      customerPhone: '0923456789',
      orderDate: '2024-01-08T10:30:00',
      status: 'delivered',
      priority: 'high',
      items: [
        {
          id: 1,
          name: 'Modern Wooden Chair',
          quantity: 2,
          price: 1500000,
          image: '/api/placeholder/64/64',
        },
        {
          id: 2,
          name: 'Dining Table',
          quantity: 1,
          price: 3000000,
          image: '/api/placeholder/64/64',
        },
      ],
      total: 6000000,
      address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
      paymentMethod: 'COD',
      paymentStatus: 'paid',
      deliveryDate: '2024-01-10T15:30:00',
      notes: 'Giao hàng trong giờ hành chính',
      history: [
        {
          time: '2024-01-08T10:30:00',
          action: 'created',
          description: 'Đơn hàng được tạo',
        },
        {
          time: '2024-01-08T14:20:00',
          action: 'confirmed',
          description: 'Xác nhận đơn hàng',
        },
        {
          time: '2024-01-09T08:15:00',
          action: 'processing',
          description: 'Đang xử lý đơn hàng',
        },
        {
          time: '2024-01-10T09:30:00',
          action: 'shipping',
          description: 'Đang giao hàng',
        },
        {
          time: '2024-01-10T15:30:00',
          action: 'delivered',
          description: 'Đã giao hàng thành công',
        },
      ],
    },
  ]);

  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    search: '',
    sortBy: 'date',
    sortOrder: 'desc',
    advancedFilters: {
      minTotal: '',
      maxTotal: '',
      paymentMethod: 'all',
    },
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [activeTab, setActiveTab] = useState('all');

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

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'text-yellow-600 bg-yellow-50',
        icon: Clock,
        text: 'Chờ xử lý',
      },
      processing: {
        color: 'text-blue-600 bg-blue-50',
        icon: RefreshCcw,
        text: 'Đang xử lý',
      },
      shipping: {
        color: 'text-purple-600 bg-purple-50',
        icon: Truck,
        text: 'Đang giao hàng',
      },
      delivered: {
        color: 'text-green-600 bg-green-50',
        icon: CheckCircle,
        text: 'Đã giao hàng',
      },
      cancelled: {
        color: 'text-red-600 bg-red-50',
        icon: AlertCircle,
        text: 'Đã hủy',
      },
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      low: { color: 'text-gray-600 bg-gray-50', text: 'Thấp' },
      medium: { color: 'text-blue-600 bg-blue-50', text: 'Trung bình' },
      high: { color: 'text-red-600 bg-red-50', text: 'Cao' },
    };
    return configs[priority] || configs.medium;
  };

  const OrderHeader = () => (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-800'>Quản lý đơn hàng</h1>
        <p className='text-gray-500 mt-1'>
          Quản lý và theo dõi tất cả đơn hàng
        </p>
      </div>

      <div className='flex flex-wrap gap-2'>
        <button className='px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium flex items-center gap-2'>
          <Download className='w-4 h-4' />
          Xuất Excel
        </button>
        <button className='px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium flex items-center gap-2'>
          <Printer className='w-4 h-4' />
          In đơn hàng
        </button>
      </div>
    </div>
  );

  const OrderTabs = () => {
    const tabs = [
      { id: 'all', label: 'Tất cả đơn hàng', count: orders.length },
      {
        id: 'pending',
        label: 'Chờ xử lý',
        count: orders.filter((o) => o.status === 'pending').length,
      },
      {
        id: 'processing',
        label: 'Đang xử lý',
        count: orders.filter((o) => o.status === 'processing').length,
      },
      {
        id: 'shipping',
        label: 'Đang giao hàng',
        count: orders.filter((o) => o.status === 'shipping').length,
      },
      {
        id: 'delivered',
        label: 'Đã giao hàng',
        count: orders.filter((o) => o.status === 'delivered').length,
      },
    ];

    return (
      <div className='border-b mb-6'>
        <div className='flex overflow-x-auto'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.label}
              <span className='bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-sm'>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const SearchAndFilters = () => (
    <div className='bg-white rounded-xl shadow-sm p-4 mb-6'>
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex-1'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
              type='text'
              placeholder='Tìm kiếm theo mã đơn, tên hoặc SĐT khách hàng...'
              className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
        </div>

        <div className='flex flex-wrap gap-2'>
          <select
            className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value='all'>Tất cả trạng thái</option>
            <option value='pending'>Chờ xử lý</option>
            <option value='processing'>Đang xử lý</option>
            <option value='shipping'>Đang giao hàng</option>
            <option value='delivered'>Đã giao hàng</option>
            <option value='cancelled'>Đã hủy</option>
          </select>

          <select
            className='px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={filters.dateRange}
            onChange={(e) =>
              setFilters({ ...filters, dateRange: e.target.value })
            }
          >
            <option value='all'>Tất cả thời gian</option>
            <option value='today'>Hôm nay</option>
            <option value='yesterday'>Hôm qua</option>
            <option value='week'>Tuần này</option>
            <option value='month'>Tháng này</option>
          </select>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className='px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2'
          >
            <ListFilter className='w-5 h-5' />
            Bộ lọc nâng cao
            <ChevronDown
              className={`w-4 h-4 transform transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {showAdvancedFilters && (
        <div className='mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Giá trị đơn hàng
            </label>
            <div className='flex gap-2'>
              <input
                type='number'
                placeholder='Từ'
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={filters.advancedFilters.minTotal}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    advancedFilters: {
                      ...filters.advancedFilters,
                      minTotal: e.target.value,
                    },
                  })
                }
              />
              <input
                type='number'
                placeholder='Đến'
                className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={filters.advancedFilters.maxTotal}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    advancedFilters: {
                      ...filters.advancedFilters,
                      maxTotal: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Phương thức thanh toán
            </label>
            <select
              className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={filters.advancedFilters.paymentMethod}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  advancedFilters: {
                    ...filters.advancedFilters,
                    paymentMethod: e.target.value,
                  },
                })
              }
            >
              <option value='all'>Tất cả</option>
              <option value='COD'>COD</option>
              <option value='bank'>Chuyển khoản</option>
              <option value='momo'>Ví Momo</option>
              <option value='vnpay'>VNPay</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Trạng thái thanh toán
            </label>
            <select
              className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={filters.paymentStatus}
              onChange={(e) =>
                setFilters({ ...filters, paymentStatus: e.target.value })
              }
            >
              <option value='all'>Tất cả</option>
              <option value='paid'>Đã thanh toán</option>
              <option value='pending'>Chưa thanh toán</option>
              <option value='failed'>Thanh toán thất bại</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );

  const OrderCard = ({ order }) => {
    const isExpanded = expandedOrders.has(order.id);
    const isSelected = selectedOrders.has(order.id);
    const statusConfig = getStatusConfig(order.status);
    const priorityConfig = getPriorityConfig(order.priority);

    const toggleExpand = () => {
      const newExpanded = new Set(expandedOrders);
      if (isExpanded) {
        newExpanded.delete(order.id);
      } else {
        newExpanded.add(order.id);
      }
      setExpandedOrders(newExpanded);
    };

    const toggleSelect = (e) => {
      e.stopPropagation();
      const newSelected = new Set(selectedOrders);
      if (isSelected) {
        newSelected.delete(order.id);
      } else {
        newSelected.add(order.id);
      }
      setSelectedOrders(newSelected);
    };

    return (
      <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
        {/* Main Order Info */}
        <div
          className='p-6 cursor-pointer hover:bg-gray-50 transition-colors'
          onClick={toggleExpand}
        >
          <div className='flex items-start gap-4'>
            <div className='flex items-center h-6'>
              <input
                type='checkbox'
                checked={isSelected}
                onChange={toggleSelect}
                className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <button
                className='ml-2 text-gray-400 hover:text-gray-600'
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand();
                }}
              >
                {isExpanded ? (
                  <ChevronDown className='w-5 h-5' />
                ) : (
                  <ChevronRight className='w-5 h-5' />
                )}
              </button>
            </div>

            <div className='flex-1 grid grid-cols-1 md:grid-cols-4 gap-4'>
              {/* Order Details */}
              <div className='space-y-1'>
                <div className='font-medium'>{order.customerName}</div>
                <div className='text-sm text-gray-500'>{order.id}</div>
              </div>

              {/* Status and Priority */}
              <div className='flex flex-wrap gap-2'>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusConfig.color}`}
                >
                  {React.createElement(statusConfig.icon, {
                    className: 'w-4 h-4',
                  })}
                  {statusConfig.text}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${priorityConfig.color}`}
                >
                  {priorityConfig.text}
                </span>
              </div>

              {/* Date and Total */}
              <div className='text-sm'>
                <div className='text-gray-500'>Ngày đặt</div>
                <div>{formatDate(order.orderDate)}</div>
              </div>

              <div className='text-right'>
                <div className='text-lg font-semibold text-blue-600'>
                  {formatCurrency(order.total)}
                </div>
                <div className='text-sm text-gray-500'>
                  {order.items.length} sản phẩm
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center'>
              <button className='p-2 hover:bg-gray-100 rounded-lg'>
                <MoreVertical className='w-5 h-5 text-gray-400' />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className='border-t px-6 py-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Customer Information */}
              <div>
                <h4 className='font-medium mb-4'>Thông tin khách hàng</h4>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2 text-sm'>
                    <User className='w-4 h-4 text-gray-400' />
                    <span className='text-gray-600'>Họ tên:</span>
                    <span className='font-medium'>{order.customerName}</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <Mail className='w-4 h-4 text-gray-400' />
                    <span className='text-gray-600'>Email:</span>
                    <span className='font-medium'>{order.customerEmail}</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <Phone className='w-4 h-4 text-gray-400' />
                    <span className='text-gray-600'>Số điện thoại:</span>
                    <span className='font-medium'>{order.customerPhone}</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <MapPin className='w-4 h-4 text-gray-400' />
                    <span className='text-gray-600'>Địa chỉ:</span>
                    <span className='font-medium'>{order.address}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h4 className='font-medium mb-4'>Thông tin thanh toán</h4>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2 text-sm'>
                    <CreditCard className='w-4 h-4 text-gray-400' />
                    <span className='text-gray-600'>Phương thức:</span>
                    <span className='font-medium'>{order.paymentMethod}</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <CheckCircle className='w-4 h-4 text-gray-400' />
                    <span className='text-gray-600'>Trạng thái:</span>
                    <span className='font-medium'>
                      {order.paymentStatus === 'paid'
                        ? 'Đã thanh toán'
                        : order.paymentStatus === 'pending'
                          ? 'Chưa thanh toán'
                          : 'Thanh toán thất bại'}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    <Calendar className='w-4 h-4 text-gray-400' />
                    <span className='text-gray-600'>Ngày giao dự kiến:</span>
                    <span className='font-medium'>
                      {formatDate(order.deliveryDate)}
                    </span>
                  </div>
                  {order.notes && (
                    <div className='flex items-center gap-2 text-sm'>
                      <FileText className='w-4 h-4 text-gray-400' />
                      <span className='text-gray-600'>Ghi chú:</span>
                      <span className='font-medium'>{order.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className='md:col-span-2'>
                <h4 className='font-medium mb-4'>Chi tiết đơn hàng</h4>
                <div className='border rounded-lg overflow-hidden'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Sản phẩm
                        </th>
                        <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Số lượng
                        </th>
                        <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Đơn giá
                        </th>
                        <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {order.items.map((item) => (
                        <tr key={item.id}>
                          <td className='px-6 py-4'>
                            <div className='flex items-center'>
                              <img
                                src={item.image}
                                alt={item.name}
                                className='w-12 h-12 rounded-lg object-cover'
                              />
                              <div className='ml-4'>
                                <div className='font-medium text-gray-900'>
                                  {item.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 text-center'>
                            {item.quantity}
                          </td>
                          <td className='px-6 py-4 text-right'>
                            {formatCurrency(item.price)}
                          </td>
                          <td className='px-6 py-4 text-right font-medium'>
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                      <tr className='bg-gray-50'>
                        <td
                          colSpan='3'
                          className='px-6 py-4 text-right font-medium'
                        >
                          Tổng cộng
                        </td>
                        <td className='px-6 py-4 text-right text-lg font-semibold text-blue-600'>
                          {formatCurrency(order.total)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Timeline */}
              <div className='md:col-span-2'>
                <h4 className='font-medium mb-4'>Lịch sử đơn hàng</h4>
                <div className='space-y-4'>
                  {order.history.map((event, index) => (
                    <div key={index} className='flex items-start gap-4'>
                      <div className='w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center'>
                        <Clock className='w-4 h-4 text-blue-600' />
                      </div>
                      <div className='flex-1'>
                        <div className='font-medium'>{event.description}</div>
                        <div className='text-sm text-gray-500'>
                          {formatDate(event.time)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className=' p-6 bg-gray-50 min-h-screen'>
      <OrderHeader />
      <OrderTabs />
      <SearchAndFilters />
      <div className='space-y-4'>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;
