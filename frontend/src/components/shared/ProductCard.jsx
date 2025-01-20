import React, { useState } from 'react';
import { Heart, ShoppingCart, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Toast from '../common/ToastDemo';

const ProductCard = ({ product, onFavoriteUpdate }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();
  const { user } = useAuth();

  const apiUrl = 'https://192.168.0.102:3000';

  const handleToastClose = () => {
    setToast({ show: false, message: '', type: '' });
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const endpoint = product.isFavorite
        ? `${apiUrl}/api/favorites/remove`
        : `${apiUrl}/api/favorites/add`;

      const response = await fetch(endpoint, {
        method: product.isFavorite ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.decodedToken.id,
          product_id: product.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newFavoriteState = !product.isFavorite;
        onFavoriteUpdate(product.id, newFavoriteState);

        setToast({
          show: true,
          message: data.message,
          type: newFavoriteState ? 'success' : 'warning',
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setToast({
        show: true,
        message: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
        type: 'error',
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log('Added to cart');
  };

  const createSeoUrl = (name) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleCardClick = () => {
    const seoUrl = createSeoUrl(product?.name);
    navigate(`/productDetail/${seoUrl}`);
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
      <div
        className='group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-lg cursor-pointer'
        onClick={handleCardClick}
      >
        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <div className='absolute left-0 top-4 z-20'>
            <div className='relative'>
              <div className='bg-red-500 text-white px-4 py-1 rounded-r-lg shadow-md'>
                <span className='font-bold'>-{product.discountPercent}%</span>
              </div>
              <div className='absolute -left-0 -bottom-2 border-l-8 border-t-8 border-transparent border-t-red-700'></div>
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className='absolute right-4 top-4 z-20 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110'
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              product.isFavorite
                ? 'fill-red-500 stroke-red-500'
                : 'stroke-gray-600'
            }`}
          />
        </button>

        {/* Product Image with Hover Overlay */}
        <div className='relative aspect-square overflow-hidden p-2 rounded-2xl'>
          <img
            src={product.image}
            alt={product.name}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-2xl'
          />
          <div className='absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100'>
            <button
              onClick={handleAddToCart}
              className='transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white text-gray-800 px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-gray-100'
            >
              <ShoppingCart className='h-5 w-5' />
              <span className='font-medium'>Thêm vào giỏ</span>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className='p-4'>
          <div className='mb-2 min-h-[48px]'>
            <h3 className='line-clamp-2 text-lg font-semibold text-gray-800 hover:text-green-600 transition-colors'>
              {product.name}
            </h3>
          </div>

          <p className='mb-2 text-sm text-gray-600'>
            Kích thước: {product.dimensions}
          </p>

          <div className='mt-auto space-y-1'>
            {product.originalPrice && (
              <div className='flex items-center gap-2'>
                <p className='text-sm text-gray-500 line-through'>
                  {formatPrice(product.originalPrice)}
                </p>
                <span className='text-xs text-red-500 font-medium'>
                  -{product.discountPercent}%
                </span>
              </div>
            )}
            <p className='text-xl font-bold text-red-500'>
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white rounded-lg p-6 max-w-sm w-full mx-4'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Yêu cầu đăng nhập
              </h3>
              <button
                onClick={handleAuthModalClose}
                className='text-gray-400 hover:text-gray-600 transition-colors'
              >
                <XCircle className='w-5 h-5' />
              </button>
            </div>
            <p className='text-gray-600 mb-6'>
              Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích
            </p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={handleAuthModalClose}
                className='px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors'
              >
                Hủy
              </button>
              <button
                onClick={handleLoginClick}
                className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={handleToastClose}
        />
      )}
    </>
  );
};

export default ProductCard;
