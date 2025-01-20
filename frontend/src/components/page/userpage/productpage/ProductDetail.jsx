import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ShoppingCart,
  Loader2,
  Check,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';
import Toast from '../../../common/ToastDemo';
import { useCart } from '../../../../contexts/CartProvider';

const ProductDetail = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('details');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [toast, setToast] = useState(null);
  const { productName } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://192.168.0.102:3000/api/products/name/${productName}`
        );
        const result = await response.json();
        if (result.success) {
          setProduct(result.data);
          if (user) {
            checkCartStatus(result.data.id);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productName, user]);
  const checkCartStatus = async (productId) => {
    if (!user) return;

    try {
      const response = await fetch(
        `https://192.168.0.102:3000/api/carts/user/${user.decodedToken.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      console.log(productId);

      if (data.success) {
        const cartItem = data.cartItems.find(
          (item) => item.product_id === productId
        );

        if (cartItem) {
          setInCart(true);
          setCartQuantity(cartItem.quantity);
        }
      }
    } catch (error) {
      console.error('Error checking cart status:', error);
    }
  };
  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader2 className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  if (!product) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        Product not found
      </div>
    );
  }

  const allImages = [product.main_image, ...JSON.parse(product.sub_image)];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const ImageNavButton = ({ direction, onClick }) => (
    <button
      onClick={onClick}
      className='absolute top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition-all hover:scale-105 z-10'
      style={{ [direction]: '0.5rem' }}
    >
      {direction === 'left' ? (
        <ChevronLeft size={16} />
      ) : (
        <ChevronRight size={16} />
      )}
    </button>
  );

  const SpecificationItem = ({ title, value }) => (
    <div className='flex justify-between items-center py-2 border-b border-gray-100 last:border-0'>
      <span className='text-sm text-gray-600'>{title}</span>
      <span className='text-sm font-medium text-gray-900'>{value}</span>
    </div>
  );

  const showToast = (message, type = 'success', description = '') => {
    setToast({ message, type, description });
  };

  const handleAddToCart = async () => {
    if (!user) {
      showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng', 'error');
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product.id);

    if (result.success) {
      setInCart(true);
      setCartQuantity((prev) => prev + 1);
      showToast('Đã thêm sản phẩm vào giỏ hàng', 'success');
    } else {
      showToast(
        result.message || 'Có lỗi xảy ra khi thêm vào giỏ hàng',
        'error'
      );
    }
    setAddingToCart(false);
  };
  const CartButton = () => {
    if (inCart) {
      return (
        <button
          className='flex-1 border border-green-200 bg-green-50 text-green-700 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2'
          disabled
        >
          <Check size={16} />
          Đã có trong giỏ hàng ({cartQuantity})
        </button>
      );
    }

    return (
      <button
        onClick={handleAddToCart}
        disabled={addingToCart}
        className='flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {addingToCart ? (
          <>
            <Loader2 size={16} className='animate-spin' />
            Đang thêm...
          </>
        ) : (
          <>
            <ShoppingCart size={16} />
            Thêm vào giỏ
          </>
        )}
      </button>
    );
  };
  return (
    <div className=' px-4 py-6'>
      {toast && (
        <div className='fixed top-4 right-4 z-50'>
          <Toast {...toast} onClose={() => setToast(null)} />
        </div>
      )}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <div className='grid grid-cols-12 gap-6 p-4 max-w-6xl mx-auto'>
          {/* Image Gallery - Reduced size */}
          <div className='col-span-5'>
            <div className='aspect-square relative rounded-lg overflow-hidden bg-gray-50'>
              <img
                src={`https://192.168.0.102:3000${allImages[currentImageIndex]}`}
                alt={product.product_name_vn}
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
                  setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
                }
              />
            </div>
            <div className='grid grid-cols-5 gap-2 mt-2'>
              {allImages.slice(0, 5).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-md overflow-hidden ${
                    currentImageIndex === index
                      ? 'ring-2 ring-blue-500'
                      : 'hover:ring-2 hover:ring-blue-200 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={`https://192.168.0.102:3000${img}`}
                    alt={`Thumbnail ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info - More compact layout */}
          <div className='col-span-7 space-y-4'>
            <div>
              <h1 className='text-xl font-bold text-gray-900 mb-2'>
                {product.product_name_vn}
              </h1>
              <div className='flex items-center gap-2 text-gray-600 mb-3'>
                <span className='text-sm bg-gray-100 px-2 py-0.5 rounded-full'>
                  Mã SP: {product.product_code}
                </span>
                <button className='p-1.5 hover:bg-gray-100 rounded-full'>
                  <Heart size={16} />
                </button>
                <button className='p-1.5 hover:bg-gray-100 rounded-full'>
                  <Share2 size={16} />
                </button>
              </div>
              <p className='text-xl font-bold text-blue-600'>
                {formatPrice(product.price)}
              </p>
            </div>

            <div className='bg-gray-50 rounded-lg p-3 space-y-2'>
              <SpecificationItem
                title='Kích thước'
                value={`${product.length} × ${product.width} × ${product.height} cm`}
              />
              <SpecificationItem title='Xuất xứ' value={product.origin_vn} />
              <SpecificationItem title='Màu sắc' value={product.color_vn} />
              <SpecificationItem
                title='Chất liệu'
                value={product.material_vn}
              />
              <SpecificationItem title='Tình trạng' value='Còn hàng' />
            </div>

            <div className='bg-gray-50 rounded-lg p-3'>
              <h3 className='text-sm font-medium text-gray-900 mb-2'>
                Mô tả sản phẩm
              </h3>
              <div className='prose prose-sm max-w-none'>
                <div
                  dangerouslySetInnerHTML={{ __html: product.description_vn }}
                />
              </div>
            </div>

            <div className='bg-green-50 rounded-lg p-3'>
              <h3 className='text-sm font-medium text-green-900 mb-1'>
                Bảo hành
              </h3>
              <p className='text-sm text-green-800'>
                Thời gian bảo hành: {product.warranty_period} tháng
              </p>
            </div>
            <div className='flex gap-3 pt-2'>
              <button className='flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2'>
                <ShoppingCart size={16} />
                Mua ngay
              </button>
              <CartButton />
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className='border-t border-gray-200'>
          <div className='flex border-b border-gray-200'>
            {[
              { id: 'details', label: 'Chi tiết sản phẩm' },
              { id: 'purchase', label: 'Hướng dẫn mua hàng' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
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

          <div className='p-6'>
            {activeTab === 'details' && (
              <div className='space-y-8'>
                {product.detail_description.map((detail, index) => (
                  <div key={index} className='space-y-4'>
                    <h3 className='text-xl font-bold text-gray-900'>
                      {detail.titleVi}
                    </h3>
                    {detail.images?.length > 0 && (
                      <div className='grid grid-cols-2 gap-4 max-w-2xl mx-auto'>
                        {detail.images.map((img, imgIndex) => (
                          <div
                            key={imgIndex}
                            className='rounded-lg overflow-hidden shadow-sm'
                          >
                            <img
                              src={img}
                              alt={`Detail ${imgIndex + 1}`}
                              className='w-full h-full object-cover'
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <div
                      className='prose max-w-none'
                      dangerouslySetInnerHTML={{ __html: detail.contentVi }}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'purchase' && (
              <div className='space-y-6'>
                <div className='prose max-w-none'>
                  <h3>Hướng Dẫn Đặt Hàng Trên Website</h3>
                  <ol className='list-decimal space-y-4'>
                    <li>
                      <strong>Truy cập website:</strong> Tìm kiếm và lựa chọn
                      sản phẩm mà bạn muốn mua.
                    </li>
                    <li>
                      <strong>Chọn sản phẩm:</strong> Nhấn vào sản phẩm để xem
                      chi tiết. Một pop-up sẽ hiện ra với các lựa chọn:
                      <ul className='list-disc ml-6 space-y-2'>
                        <li>
                          <strong>Tiếp tục mua hàng:</strong> Nhấn{' '}
                          <em>Tiếp tục mua hàng</em> để thêm sản phẩm khác vào
                          giỏ.
                        </li>
                        <li>
                          <strong>Xem giỏ hàng:</strong> Nhấn{' '}
                          <em>Xem giỏ hàng</em> để cập nhật hoặc kiểm tra các
                          sản phẩm đã chọn.
                        </li>
                        <li>
                          <strong>Đặt hàng và thanh toán:</strong> Nhấn{' '}
                          <em>Đặt hàng và thanh toán</em> để tiến hành mua ngay.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>Thông tin tài khoản:</strong> Chọn phương thức phù
                      hợp:
                      <ul className='list-disc ml-6 space-y-2'>
                        <li>
                          <strong>Đã có tài khoản:</strong> Đăng nhập bằng email
                          và mật khẩu.
                        </li>
                        <li>
                          <strong>Đăng ký tài khoản:</strong> Điền thông tin cá
                          nhân để tạo tài khoản và theo dõi đơn hàng.
                        </li>
                        <li>
                          <strong>Mua không cần tài khoản:</strong> Nhấn{' '}
                          <em>Đặt hàng không cần tài khoản</em>.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong>Điền thông tin đơn hàng:</strong> Cung cấp thông
                      tin cá nhân, địa chỉ nhận hàng, chọn hình thức thanh toán
                      và vận chuyển.
                    </li>
                    <li>
                      <strong>Xác nhận đơn hàng:</strong> Kiểm tra lại thông
                      tin, thêm ghi chú (nếu cần), sau đó nhấn{' '}
                      <em>Gửi đơn hàng</em>.
                    </li>
                    <li>
                      <strong>Liên hệ xác nhận:</strong> Sau khi gửi đơn hàng,
                      chúng tôi sẽ gọi điện để xác nhận thông tin và địa chỉ của
                      bạn.
                    </li>
                  </ol>
                </div>

                <div className='bg-blue-50 rounded-lg p-4'>
                  <h4 className='text-lg font-semibold text-blue-900 mb-3'>
                    Liên hệ tư vấn
                  </h4>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='bg-white rounded-lg p-3 shadow-sm'>
                      <p className='text-sm font-medium text-gray-900'>
                        Tư vấn bán hàng
                      </p>
                      <p className='text-blue-600 font-semibold'>1900 1234</p>
                    </div>
                    <div className='bg-white rounded-lg p-3 shadow-sm'>
                      <p className='text-sm font-medium text-gray-900'>
                        Hỗ trợ kỹ thuật
                      </p>
                      <p className='text-blue-600 font-semibold'>
                        0901 234 567
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
