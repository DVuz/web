import React, { useState } from 'react';

const PurchaseGuidePrivacy = () => {
  const [activeTab, setActiveTab] = useState('purchase');

  return (
    <div className='max-w-4xl mx-auto p-6'>
      {/* Tab Buttons */}
      <div className='flex border-b border-gray-200 mb-6'>
        <button
          onClick={() => setActiveTab('purchase')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'purchase'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Hướng dẫn mua hàng
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-6 py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'privacy'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Chính sách bảo mật
        </button>
      </div>

      {/* Purchase Guide Content */}
      {activeTab === 'purchase' && (
        <div className='space-y-6'>
          <h1 className='text-2xl font-bold text-blue-700 text-center mb-8'>
            Chào mừng Quý khách hàng đến với DDStore!
          </h1>

          <div className='space-y-8'>
            {/* Store Purchase */}
            <section className='space-y-3'>
              <h2 className='text-lg font-bold text-blue-600'>
                CÁCH 1: MUA HÀNG TRỰC TIẾP TẠI CỬA HÀNG
              </h2>
              <p className='font-medium'>
                Hiện tại, cửa hàng DDStore của chúng tôi tọa lạc tại:
                <span className='text-blue-600'>
                  {' '}
                  300m từ chợ chiều Đồng Lâm, Huyện Tiền Hải, Tỉnh Thái Bình
                </span>
              </p>
              <p className='text-gray-700'>
                Cửa hàng DDStore luôn cập nhật các mẫu sản phẩm mới nhất, chất
                lượng tốt nhất để Quý khách có thể trải nghiệm trực tiếp. Với
                không gian thoáng đãng, Quý khách có thể yên tâm đỗ xe miễn phí
                ngay tại khu vực cửa hàng.
              </p>
            </section>

            {/* Phone Purchase */}
            <section className='space-y-3'>
              <h2 className='text-lg font-bold text-blue-600'>
                CÁCH 2: ĐẶT HÀNG QUA ĐIỆN THOẠI
              </h2>
              <p className='text-gray-700'>
                Chúng tôi hỗ trợ đặt hàng qua tổng đài hoạt động từ{' '}
                <span className='font-medium'>8h00 - 22h00 hàng ngày</span>. Quý
                khách chỉ cần liên hệ qua{' '}
                <span className='font-medium'>Hotline: 0868.802.858</span>, nhân
                viên của chúng tôi sẽ tư vấn và hỗ trợ Quý khách một cách nhanh
                chóng, tận tình.
              </p>
            </section>

            {/* Online Purchase */}
            <section className='space-y-3'>
              <h2 className='text-lg font-bold text-blue-600'>
                CÁCH 3: ĐẶT HÀNG QUA WEBSITE
              </h2>
              <div className='space-y-4'>
                <div>
                  <h3 className='font-medium'>Bước 1:</h3>
                  <p>
                    Truy cập website của DDStore và lựa chọn sản phẩm mong muốn.
                  </p>
                </div>
                <div>
                  <h3 className='font-medium'>Bước 2:</h3>
                  <p>
                    Khi chọn sản phẩm, một cửa sổ sẽ hiện ra với các tùy chọn:
                  </p>
                  <ul className='list-disc pl-6 mt-2 space-y-1'>
                    <li>
                      <span className='font-medium'>Tiếp tục mua hàng:</span> Để
                      thêm nhiều sản phẩm khác vào giỏ hàng.
                    </li>
                    <li>
                      <span className='font-medium'>Xem giỏ hàng:</span> Để kiểm
                      tra, chỉnh sửa sản phẩm đã chọn.
                    </li>
                    <li>
                      <span className='font-medium'>
                        Đặt hàng và thanh toán:
                      </span>{' '}
                      Để tiến hành mua sản phẩm ngay.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className='font-medium'>Bước 3:</h3>
                  <p>Cung cấp thông tin tài khoản:</p>
                  <ul className='list-disc pl-6 mt-2 space-y-1'>
                    <li>
                      Nếu đã có tài khoản: Đăng nhập bằng email và mật khẩu.
                    </li>
                    <li>
                      Nếu chưa có tài khoản: Điền thông tin cá nhân để đăng ký.
                    </li>
                    <li>
                      Mua hàng không cần tài khoản: Chọn{' '}
                      <span className='font-medium'>
                        Đặt hàng không cần tài khoản
                      </span>
                      .
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className='font-medium'>Bước 4:</h3>
                  <p>
                    Điền thông tin nhận hàng, chọn hình thức thanh toán và vận
                    chuyển phù hợp.
                  </p>
                </div>
                <div>
                  <h3 className='font-medium'>Bước 5:</h3>
                  <p>
                    Kiểm tra lại đơn hàng, thêm ghi chú (nếu cần) và gửi đơn
                    hàng.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Privacy Policy Content */}
      {activeTab === 'privacy' && (
        <div className='space-y-6'>
          <h1 className='text-2xl font-bold text-blue-700 text-center mb-8'>
            Chính Sách Bảo Mật
          </h1>

          <div className='space-y-2 text-gray-700'>
            <p>
              Cám ơn quý khách đã quan tâm và truy cập vào website. Chúng tôi
              tôn trọng và cam kết sẽ bảo mật những thông tin mang tính riêng tư
              của Quý khách.
            </p>
            <p>
              Chính sách bảo mật sẽ giải thích cách chúng tôi tiếp nhận, sử dụng
              và (trong trường hợp nào đó) tiết lộ thông tin cá nhân của Quý
              khách.
            </p>
            <p>
              Bảo vệ dữ liệu cá nhân và gây dựng được niềm tin cho quý khách là
              vấn đề rất quan trọng với chúng tôi.
            </p>
          </div>

          <div className='space-y-6'>
            <section>
              <h2 className='text-lg font-bold text-blue-600 mb-3'>
                1. Thu thập thông tin cá nhân
              </h2>
              <ul className='list-disc pl-6 space-y-2 text-gray-700'>
                <li>
                  Chúng tôi thu thập, lưu trữ và xử lý thông tin của bạn cho quá
                  trình mua hàng và cho những thông báo sau này liên quan đến
                  đơn hàng.
                </li>
                <li>
                  Chúng tôi sẽ dùng thông tin quý khách đã cung cấp để xử lý đơn
                  đặt hàng, cung cấp các dịch vụ và thông tin yêu cầu thông qua
                  website.
                </li>
                <li>
                  Chúng tôi có thể chuyển tên và địa chỉ cho bên thứ ba để họ
                  giao hàng cho bạn.
                </li>
                <li>
                  Chi tiết đơn đặt hàng của bạn được chúng tôi lưu giữ nhưng vì
                  lí do bảo mật nên chúng tôi không công khai trực tiếp được.
                </li>
              </ul>
            </section>

            <section>
              <h2 className='text-lg font-bold text-blue-600 mb-3'>
                2. Bảo mật
              </h2>
              <ul className='list-disc pl-6 space-y-2 text-gray-700'>
                <li>
                  Chúng tôi có biện pháp thích hợp về kỹ thuật và an ninh để
                  ngăn chặn truy cập trái phép hoặc trái pháp luật hoặc mất mát
                  hoặc tiêu hủy hoặc thiệt hại cho thông tin của bạn.
                </li>
                <li>
                  Chúng tôi khuyên quý khách không nên đưa thông tin chi tiết về
                  việc thanh toán với bất kỳ ai bằng e-mail.
                </li>
                <li>
                  Mọi thông tin giao dịch sẽ được bảo mật nhưng trong trường hợp
                  cơ quan pháp luật yêu cầu, chúng tôi sẽ buộc phải cung cấp
                  những thông tin này cho các cơ quan pháp luật.
                </li>
              </ul>
            </section>

            <section>
              <h2 className='text-lg font-bold text-blue-600 mb-3'>
                3. Quyền lợi khách hàng
              </h2>
              <ul className='list-disc pl-6 space-y-2 text-gray-700'>
                <li>
                  Quý khách có quyền yêu cầu truy cập vào dữ liệu cá nhân của
                  mình, có quyền yêu cầu chúng tôi sửa lại những sai sót trong
                  dữ liệu của bạn mà không mất phí.
                </li>
                <li>
                  Bất cứ lúc nào bạn cũng có quyền yêu cầu chúng tôi ngưng sử
                  dụng dữ liệu cá nhân của bạn cho mục đích tiếp thị.
                </li>
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseGuidePrivacy;
