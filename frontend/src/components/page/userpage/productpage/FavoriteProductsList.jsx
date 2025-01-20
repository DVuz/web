import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';
import { Heart } from 'lucide-react';

const FavoriteProductsList = () => {
  // Giữ nguyên các state và hooks
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const apiUrl = 'https://192.168.0.102:3000';

  // Giữ nguyên các functions useEffect, handleRemoveFavorite, formatPrice, và createSeoUrl
  useEffect(() => {
    console.log('Fetching favorites for user:', user);
    const fetchFavorites = async () => {
      if (!user.decodedToken?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${apiUrl}/api/favorites/${user.decodedToken.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();
        setFavorites(data.favorites);
        setIsLoading(false);
      } catch (error) {
        setError('Có lỗi xảy ra khi tải danh sách yêu thích');
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (productId) => {
    try {
      const response = await fetch(`${apiUrl}/api/favorites/remove`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.decodedToken.id,
          product_id: productId,
        }),
      });

      if (response.ok) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav.product_id !== productId)
        );
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
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

  if (!user) {
    return (
      <div className='max-w-4xl mx-auto mt-4 bg-white rounded-lg shadow-md'>
        <div className='flex flex-col items-center justify-center p-6'>
          <Heart className='w-12 h-12 text-gray-400 mb-3' />
          <h2 className='text-lg font-semibold text-gray-700 mb-2'>
            Vui lòng đăng nhập
          </h2>
          <p className='text-gray-500 text-center'>
            Đăng nhập để xem danh sách sản phẩm yêu thích của bạn
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='w-full max-w-7xl mx-auto mt-4'>
        <div className='flex justify-center items-center h-40'>
          <div className='animate-spin rounded-full h-8 w-8 border-3 border-green-500 border-t-transparent' />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-4xl mx-auto mt-4 bg-white rounded-lg shadow-md'>
        <div className='flex flex-col items-center justify-center p-6'>
          <div className='w-12 h-12 mb-3 text-red-500'>⚠️</div>
          <h2 className='text-lg font-semibold text-gray-700 mb-2'>
            Đã xảy ra lỗi
          </h2>
          <p className='text-gray-500 text-center'>{error}</p>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className='max-w-4xl mx-auto mt-4 bg-white rounded-lg shadow-md'>
        <div className='flex flex-col items-center justify-center p-6'>
          <Heart className='w-12 h-12 text-gray-400 mb-3' />
          <h2 className='text-lg font-semibold text-gray-700 mb-2'>
            Chưa có sản phẩm yêu thích
          </h2>
          <p className='text-gray-500 text-center'>
            Hãy thêm sản phẩm vào danh sách yêu thích của bạn
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-7xl mx-auto px-4 py-6'>
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='p-4 border-b border-gray-200'>
          <h1 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
            <Heart className='w-5 h-5' />
            Sản phẩm yêu thích ({favorites.length})
          </h1>
        </div>

        <div className='p-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {favorites.map((favorite) => (
              <div
                key={favorite.product_id}
                className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
              >
                {/* Ảnh sản phẩm */}
                <div
                  className='relative w-full pt-[100%] cursor-pointer'
                  onClick={() =>
                    navigate(
                      `/productDetail/${createSeoUrl(favorite.product.product_name_vn || favorite.product.product_name__en)}`
                    )
                  }
                >
                  <img
                    src={`${apiUrl}${favorite.product.main_image}`}
                    alt={favorite.product.product_name_vn}
                    className='absolute inset-0 w-full h-full object-cover'
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(favorite.product_id);
                    }}
                    className='absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors'
                  >
                    ✕
                  </button>
                </div>

                {/* Thông tin sản phẩm */}
                <div className='p-3'>
                  <div
                    className='cursor-pointer group'
                    onClick={() =>
                      navigate(
                        `/productDetail/${createSeoUrl(favorite.product.product_name_vn || favorite.product.product_name__en)}`
                      )
                    }
                  >
                    <h3 className='text-sm font-medium text-gray-900 group-hover:text-green-600 line-clamp-2'>
                      {favorite.product.product_name_vn ||
                        favorite.product.product_name__en}
                    </h3>
                    <p className='mt-1 text-md text-gray-500'>
                      Mã SP: {favorite.product.product_code}
                    </p>
                  </div>

                  {/* Thông số kỹ thuật */}
                  <div className='mt-2 space-y-1'>
                    <p className='text-md text-gray-600'>
                      <span className='font-medium'>KT:</span>{' '}
                      {favorite.product.length}x{favorite.product.width}x
                      {favorite.product.height} mm
                    </p>
                    <p className='text-md text-gray-600'>
                      <span className='font-medium'>CL:</span>{' '}
                      {favorite.product.material_vn ||
                        favorite.product.material}
                    </p>
                  </div>

                  {/* Giá và nút thao tác */}
                  <div className='mt-3 flex items-center justify-between'>
                    <div className='text-base font-bold text-red-500'>
                      {formatPrice(favorite.product.price)}
                    </div>
                    <button
                      className='px-3 py-1 bg-green-600 text-white text-md rounded hover:bg-green-700 transition-colors'
                      onClick={() =>
                        navigate(
                          `/productDetail/${createSeoUrl(favorite.product.product_name_vn || favorite.product.product_name__en)}`
                        )
                      }
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteProductsList;
