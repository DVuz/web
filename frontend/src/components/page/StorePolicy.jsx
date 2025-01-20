import React from 'react';

const StorePolicy = () => {
  const sections = [
    {
      id: 1,
      title: 'Chính sách vận chuyển',
      icon: '🚚',
      policies: [
        'Miễn phí giao hàng cho đơn hàng trong bán kính 5km',
        'Thời gian giao hàng: 2-4 giờ trong ngày với nội thành, 3-5 ngày với các tỉnh thành khác',
        'Đội ngũ giao hàng chuyên nghiệp, có kinh nghiệm lắp đặt đồ gỗ',
        'Không giao hàng vào các ngày Lễ, Tết',
        'Khung giờ giao hàng: 8:00 - 21:00 hàng ngày',
        'Hỗ trợ đổi trả trong vòng 24h nếu sai sót trong quá trình giao hàng',
        'Miễn phí lắp đặt cho tất cả sản phẩm',
        'Đóng gói cẩn thận, an toàn cho vận chuyển đường dài',
      ],
    },
    {
      id: 2,
      title: 'Chính sách bảo hành',
      icon: '🛡️',
      policies: [
        'Bảo hành 24 tháng cho các sản phẩm đồ gỗ',
        'Bảo hành 12 tháng cho phụ kiện đi kèm',
        'Miễn phí sửa chữa trong thời gian bảo hành',
        'Hỗ trợ bảo trì định kỳ 6 tháng/lần',
        'Đổi mới sản phẩm trong 7 ngày nếu phát hiện lỗi từ nhà sản xuất',
      ],
    },
    {
      id: 3,
      title: 'Chính sách đổi trả',
      icon: '🔄',
      policies: [
        'Đổi trả miễn phí trong vòng 7 ngày',
        'Hoàn tiền 100% nếu sản phẩm không đúng mẫu mã, chất lượng',
        'Hỗ trợ đổi mẫu khác trong vòng 30 ngày (chênh lệch giá nếu có)',
        'Miễn phí vận chuyển cho hàng đổi trả do lỗi sản xuất',
        'Bảo hành không áp dụng với các trường hợp hư hỏng do người dùng',
      ],
    },
    {
      id: 4,
      title: 'Chính sách thanh toán',
      icon: '💳',
      policies: [
        'Thanh toán tiền mặt khi nhận hàng (COD)',
        'Chuyển khoản qua ngân hàng',
        'Hỗ trợ trả góp 0% qua thẻ tín dụng',
        'Đặt cọc 30% với đơn hàng trên 10 triệu',
        'Xuất hóa đơn VAT theo yêu cầu',
      ],
    },
  ];

  const shippingRates = [
    { id: 1, range: '0 - 5', price: '15.000' },
    { id: 2, range: '5 - 10', price: '30.000' },
    { id: 3, range: '10 - 20', price: '50.000' },
    { id: 4, range: '20 - 50', price: '100.000' },
    { id: 5, range: '50 - 100', price: '200.000' },
    { id: 6, range: '100 - 200', price: '300.000' },
    { id: 7, range: '200 - 300', price: '500.000' },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4'>
      <div className=' mx-auto'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>DD Store</h1>
          <div className='relative'>
            <div className='absolute w-full h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent top-1/2'></div>
            <span className='relative bg-gradient-to-br from-gray-50 to-gray-100 px-4 text-lg text-gray-600'>
              Chính Sách Cửa Hàng
            </span>
          </div>
        </div>

        {/* Policy Sections */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
          {sections.map((section) => (
            <div
              key={section.id}
              className='bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300'
            >
              <div className='p-6'>
                <div className='flex items-center space-x-4 mb-6'>
                  <span className='text-3xl'>{section.icon}</span>
                  <h2 className='text-xl font-semibold text-gray-800'>
                    {section.title}
                  </h2>
                </div>
                <ul className='space-y-4'>
                  {section.policies.map((policy, idx) => (
                    <li key={idx} className='flex items-start space-x-3'>
                      <span className='w-1.5 h-1.5 rounded-full bg-amber-600 mt-2.5'></span>
                      <span className='text-gray-600 leading-relaxed'>
                        {policy}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Rates */}
        <div className='bg-white rounded-xl shadow-lg p-8 mb-8'>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-2xl font-semibold text-gray-800'>
              Bảng giá vận chuyển
            </h2>
            <span className='text-3xl'>📊</span>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b-2 border-gray-200'>
                  <th className='py-4 px-6 text-left text-gray-700'>
                    Khoảng cách (km)
                  </th>
                  <th className='py-4 px-6 text-right text-gray-700'>
                    Giá (VNĐ)
                  </th>
                </tr>
              </thead>
              <tbody>
                {shippingRates.map((rate, idx) => (
                  <tr
                    key={rate.id}
                    className='border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200'
                  >
                    <td className='py-4 px-6 text-gray-600'>{rate.range}</td>
                    <td className='py-4 px-6 text-right text-gray-600'>
                      {rate.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='mt-6 space-y-2'>
            <p className='text-sm text-gray-500'>* Giá đã bao gồm VAT</p>
            <p className='text-sm text-gray-500'>
              * Giá có thể thay đổi tùy theo kích thước và khối lượng sản phẩm
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className='text-center bg-white rounded-xl shadow-lg p-8'>
          <h3 className='text-xl font-semibold text-gray-800 mb-4'>
            Liên hệ hỗ trợ
          </h3>
          <div className='flex justify-center space-x-8'>
            <div>
              <p className='text-gray-600'>Hotline</p>
              <p className='text-lg font-semibold text-amber-600'>1900 xxxx</p>
            </div>
            <div>
              <p className='text-gray-600'>Email</p>
              <p className='text-lg font-semibold text-amber-600'>
                support@ddstore.com
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='mt-12 text-center text-gray-500'>
          <p>© 2025 DD Store. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  );
};

export default StorePolicy;
