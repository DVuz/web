import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '../../../common';

const ProductDetail = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  const sampleProduct = {
    id: 1,
    product_code: 'FS-2024-001',
    product_name_vn: 'Ghế Sofa Da Cao Cấp Milano',
    main_image: 'https://192.168.0.102:3000/api/media/test/a.jpg',
    sub_image: JSON.stringify([
      'https://192.168.0.102:3000/api/media/test/a.jpg',
      'https://192.168.0.102:3000/api/media/test/a.jpg',
      'https://192.168.0.102:3000/api/media/test/a.jpg',
    ]),
    length: 220,
    width: 95,
    height: 85,
    material_vn: 'Da bò tự nhiên cao cấp, Khung gỗ tự nhiên',
    description_vn: `<p>Ghế Sofa Da Cao Cấp Milano là sự kết hợp hoàn hảo giữa thiết kế hiện đại và chất liệu cao cấp. 
      Với khung gỗ tự nhiên được tuyển chọn kỹ càng và bọc da bò thật 100%, sản phẩm mang đến sự sang trọng và đẳng cấp cho không gian sống của bạn.</p>
      <p>Điểm nổi bật:</p>
      <ul>
        <li>Thiết kế theo phong cách Ý hiện đại</li>
        <li>Đệm ngồi và tựa lưng được làm từ mút D40 cao cấp</li>
        <li>Khả năng chống mài mòn và bền màu tuyệt vời</li>
        <li>Trang bị hệ thống giảm chấn hiện đại</li>
        <li>Khả năng chống thấm và dễ dàng vệ sinh</li>
      </ul>`,
    origin_vn: 'Italia',
    color_vn: 'Nâu Cognac',
    detail_description: [
      {
        id: 1,
        images: [
          'https://192.168.0.102:3000/api/media/test/a.jpg',
          'https://192.168.0.102:3000/api/media/test/a.jpg',
        ],
        titleVi: 'Chất liệu & Kết cấu',
        contentVi: `<p>Ghế được làm từ da bò tự nhiên nhập khẩu từ Ý, được thuộc theo công nghệ hiện đại nhất. 
          Bề mặt da mềm mại, có độ đàn hồi cao và khả năng chống thấm nước tốt.</p>
          <p>Khung ghế được làm từ gỗ tự nhiên đã qua xử lý chống mối mọt, đảm bảo độ bền trên 10 năm sử dụng.</p>
          <p>Đặc điểm nổi bật:</p>
          <ul>
            <li>Da bò tự nhiên 100% nhập khẩu từ Ý</li>
            <li>Độ dày da: 1.4-1.6mm</li>
            <li>Khung gỗ tự nhiên đã qua xử lý chống mối mọt</li>
            <li>Mút đệm D40 cao cấp</li>
            <li>Hệ thống giảm chấn cao cấp</li>
          </ul>`,
      },
      {
        id: 2,
        images: [
          'https://192.168.0.102:3000/api/media/test/a.jpg',
          'https://192.168.0.102:3000/api/media/test/a.jpg',
        ],
        titleVi: 'Thông số kỹ thuật',
        contentVi: `<p>Thông số chi tiết:</p>
          <ul>
            <li>Kích thước tổng thể: D220 x R95 x C85 cm</li>
            <li>Chiều cao mặt ngồi: 42cm</li>
            <li>Chiều sâu mặt ngồi: 60cm</li>
            <li>Độ cứng đệm: Trung bình</li>
            <li>Tải trọng tối đa: 300kg</li>
            <li>Tuổi thọ khung: >10 năm</li>
            <li>Bảo hành: 5 năm cho khung, 2 năm cho da và phụ kiện</li>
          </ul>`,
      },
      {
        id: 3,
        titleVi: 'Hướng dẫn mua hàng',
        contentVi: `<p>Quý khách có thể đặt mua sản phẩm thông qua các hình thức sau:</p>
          <p><strong>1. Mua hàng trực tiếp tại showroom:</strong></p>
          <ul>
            <li>Showroom 1: 123 Nguyễn Văn Linh, Q.7, TP.HCM</li>
            <li>Showroom 2: 456 Lê Văn Lương, Q.Thanh Xuân, Hà Nội</li>
            <li>Thời gian mở cửa: 8:00 - 21:00 các ngày trong tuần</li>
          </ul>
          <p><strong>2. Đặt hàng online:</strong></p>
          <ul>
            <li>Đặt hàng qua website: Chọn "Mua ngay" hoặc "Thêm vào giỏ hàng"</li>
            <li>Đặt hàng qua hotline: 1900 1234</li>
            <li>Đặt hàng qua Zalo/Messenger: 0901 234 567</li>
          </ul>
          <p><strong>3. Phương thức thanh toán:</strong></p>
          <ul>
            <li>Thanh toán tiền mặt khi nhận hàng (COD)</li>
            <li>Chuyển khoản ngân hàng</li>
            <li>Thanh toán qua thẻ tín dụng/ghi nợ</li>
            <li>Trả góp 0% qua thẻ tín dụng</li>
          </ul>
          <p><strong>4. Chính sách giao hàng:</strong></p>
          <ul>
            <li>Miễn phí giao hàng trong bán kính 20km</li>
            <li>Thời gian giao hàng: 3-5 ngày làm việc</li>
            <li>Đội ngũ giao hàng chuyên nghiệp, có bảo hiểm hàng hóa</li>
          </ul>`,
      },
    ],
  };

  const allImages = [
    sampleProduct.main_image,
    ...JSON.parse(sampleProduct.sub_image),
  ];

  const ImageNavButton = ({ direction, onClick }) => (
    <button
      onClick={onClick}
      className='absolute top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all hover:scale-105 z-10'
      style={{ [direction]: '1rem' }}
    >
      {direction === 'left' ? (
        <ChevronLeft size={20} />
      ) : (
        <ChevronRight size={20} />
      )}
    </button>
  );

  const SpecificationCard = ({ title, value }) => (
    <div className='bg-gray-50 p-4 rounded-lg hover:shadow-sm transition-shadow'>
      <h3 className='text-sm font-medium text-gray-500 mb-1'>{title}</h3>
      <p className='text-base font-semibold text-gray-900'>{value}</p>
    </div>
  );

  return (
    <div className=''>
      <div className=' mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Main Content */}
        <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
          <div className='grid grid-cols-5 gap-8 p-6'>
            {/* Image Gallery - 2/5 width */}
            <div className='col-span-2 space-y-4'>
              <div className='aspect-square relative rounded-lg overflow-hidden bg-gray-50'>
                <img
                  src={allImages[currentImageIndex]}
                  alt={sampleProduct.product_name_vn}
                  className='w-full h-full object-cover'
                />
                <ImageNavButton
                  direction='left'
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev - 1 + allImages.length) % allImages.length
                    )
                  }
                />
                <ImageNavButton
                  direction='right'
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev + 1) % allImages.length
                    )
                  }
                />
              </div>
              <div className='grid grid-cols-6 gap-2'>
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-md overflow-hidden transition-all ${
                      currentImageIndex === index
                        ? 'ring-2 ring-blue-500 shadow-sm'
                        : 'hover:ring-2 hover:ring-blue-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info - 3/5 width */}
            <div className='col-span-3 space-y-6'>
              <div>
                <h1 className='text-2xl lg:text-3xl font-bold text-gray-900 mb-3'>
                  {sampleProduct.product_name_vn}
                </h1>
                <div className='flex items-center gap-3 text-gray-600'>
                  <span className='bg-gray-100 px-3 py-1 rounded-full text-sm font-medium'>
                    Mã SP: {sampleProduct.product_code}
                  </span>
                  <div className='flex items-center gap-2'>
                    <button className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                      <Heart size={18} />
                    </button>
                    <button className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <SpecificationCard
                  title='Kích thước'
                  value={`${sampleProduct.length} × ${sampleProduct.width} × ${sampleProduct.height} cm`}
                />
                <SpecificationCard
                  title='Xuất xứ'
                  value={sampleProduct.origin_vn}
                />
                <SpecificationCard
                  title='Màu sắc'
                  value={sampleProduct.color_vn}
                />
                <SpecificationCard
                  title='Chất liệu'
                  value={sampleProduct.material_vn}
                />
              </div>

              <div className='flex gap-3 pt-4'>
                <button className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2'>
                  <ShoppingCart size={18} />
                  Mua ngay
                </button>
                <button className='flex-1 border border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 hover:border-blue-200 transition-colors'>
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className='border-t border-gray-200'>
            <div className='flex border-b border-gray-200'>
              {[
                { id: 'description', label: 'Mô tả sản phẩm' },
                { id: 'details', label: 'Chi tiết sản phẩm' },
                { id: 'guide', label: 'Hướng dẫn mua hàng' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className='absolute bottom-0 left-0 w-full h-0.5 bg-blue-600'></span>
                  )}
                </button>
              ))}
            </div>

            <div className='p-8'>
              {activeTab === 'description' && (
                <div
                  className='prose max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: sampleProduct.description_vn,
                  }}
                />
              )}

              {activeTab === 'details' && (
                <div className='space-y-12'>
                  {sampleProduct.detail_description
                    .slice(0, 2)
                    .map((detail, index) => (
                      <div key={index} className='space-y-6'>
                        <h3 className='text-2xl font-bold text-gray-900'>
                          {detail.titleVi}
                        </h3>
                        <div className='grid grid-cols-2 gap-6 max-w-3xl mx-auto'>
                          {detail.images.map((img, imgIndex) => (
                            <div
                              key={imgIndex}
                              className='rounded-xl overflow-hidden shadow-lg'
                            >
                              <img
                                src={img}
                                alt={`Detail ${imgIndex + 1}`}
                                className=''
                              />
                            </div>
                          ))}
                        </div>
                        <div
                          className='prose max-w-none'
                          dangerouslySetInnerHTML={{ __html: detail.contentVi }}
                        />
                      </div>
                    ))}
                </div>
              )}

              {activeTab === 'guide' && (
                <div className='space-y-6'>
                  <div
                    className='prose max-w-none'
                    dangerouslySetInnerHTML={{
                      __html: sampleProduct.detail_description.find(
                        (d) => d.titleVi === 'Hướng dẫn mua hàng'
                      )?.contentVi,
                    }}
                  />

                  {/* Quick Contact Section */}
                  <div className='mt-8 bg-blue-50 rounded-xl p-6'>
                    <h4 className='text-xl font-semibold text-blue-900 mb-4'>
                      Liên hệ nhanh
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='bg-white rounded-lg p-4 shadow-sm'>
                        <p className='font-medium text-gray-900'>
                          Tư vấn bán hàng
                        </p>
                        <p className='text-blue-600 font-semibold'>1900 1234</p>
                      </div>
                      <div className='bg-white rounded-lg p-4 shadow-sm'>
                        <p className='font-medium text-gray-900'>
                          Hỗ trợ kỹ thuật
                        </p>
                        <p className='text-blue-600 font-semibold'>
                          0901 234 567
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Warranty Info */}
                  <div className='bg-green-50 rounded-xl p-6 mt-6'>
                    <h4 className='text-xl font-semibold text-green-900 mb-4'>
                      Chế độ bảo hành
                    </h4>
                    <ul className='space-y-2 text-green-800'>
                      <li className='flex items-center gap-2'>
                        <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                        Bảo hành khung sản phẩm 5 năm
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                        Bảo hành da và phụ kiện 2 năm
                      </li>
                      <li className='flex items-center gap-2'>
                        <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                        Bảo trì miễn phí trọn đời
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
