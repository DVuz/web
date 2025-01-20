import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Pagination from '../../../common/Pagination';
import ProductCard from '../../../shared/ProductCard';
import useAuth from '../../../../hooks/useAuth';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [favorites, setFavorites] = useState(new Set());
  const { user } = useAuth();

  const apiUrl = 'https://192.168.0.102:3000';

  // Fetch products and favorites
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch(`${apiUrl}/api/get_all_products`);
        const productsResult = await productsResponse.json();

        // Fetch favorites only if user exists and is logged in
        if (user?.decodedToken?.id) {
          try {
            const favoritesResponse = await fetch(
              `${apiUrl}/api/favorites/${user.decodedToken.id}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              }
            );
            if (favoritesResponse.ok) {
              const favoritesData = await favoritesResponse.json();
              const userFavorites = new Set(
                favoritesData.favorites.map((fav) => fav.product_id)
              );
              setFavorites(userFavorites);
            }
          } catch (error) {
            console.error('Error fetching favorites:', error);
            // Continue execution even if favorites fetch fails
          }
        }

        if (productsResult.success) {
          setProducts(productsResult.data);
          setFilteredProducts(productsResult.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, [user?.decodedToken?.id]); // Changed dependency to more specific path

  // Rest of the filtering logic remains the same
  useEffect(() => {
    let results = products;

    if (searchTerm) {
      results = results.filter(
        (product) =>
          product.product_name_vn
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.product_name__en
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-5m':
          results = results.filter((product) => product.price < 5000000);
          break;
        case '5m-10m':
          results = results.filter(
            (product) => product.price >= 5000000 && product.price <= 10000000
          );
          break;
        case 'over-10m':
          results = results.filter((product) => product.price > 10000000);
          break;
        default:
          break;
      }
    }

    setFilteredProducts(results);
    setCurrentPage(1);
  }, [searchTerm, priceRange, products]);

  // Pagination handler stays the same
  const handlePageChange = (page, newItemsPerPage) => {
    setCurrentPage(page);
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
    }
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Transform product data with favorite status
  const transformProductData = (product) => ({
    id: product.id,
    name: product.product_name_vn,
    name_en: product.product_name__en,
    dimensions: `${product.length}x${product.width}x${product.height} mm`,
    price: product.price,
    originalPrice: product.original_price,
    image: `${product.main_image}`,
    material: product.material_vn,
    color: product.color_vn,
    discountPercent: product.discount_percent || 20,
    isFavorite: favorites.has(product.id),
  });

  // Handle favorite update only if user exists
  const handleFavoriteUpdate = (productId, isFavorite) => {
    if (!user?.decodedToken?.id) {
      // Handle case when user is not logged in (e.g., show login prompt)
      console.log('User must be logged in to add favorites');
      return;
    }

    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (isFavorite) {
        newFavorites.add(productId);
      } else {
        newFavorites.delete(productId);
      }
      return newFavorites;
    });
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4'>
        <div className='flex items-center border-2 rounded-lg p-2 w-full md:w-96'>
          <Search className='text-gray-400 mr-2' size={24} />
          <input
            type='text'
            placeholder='Tìm kiếm sản phẩm...'
            className='w-full outline-none'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className='border-2 rounded-lg p-2'
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          <option value='all'>Tất cả giá</option>
          <option value='under-5m'>Dưới 5 triệu</option>
          <option value='5m-10m'>5 - 10 triệu</option>
          <option value='over-10m'>Trên 10 triệu</option>
        </select>
      </div>

      <div className='mb-4 text-gray-600'>
        Hiển thị {indexOfFirstProduct + 1}-
        {Math.min(indexOfLastProduct, filteredProducts.length)} của{' '}
        {filteredProducts.length} sản phẩm
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {currentProducts.map((product) => (
        <ProductCard
            key={product.id}
            product={transformProductData(product)}
            onFavoriteUpdate={handleFavoriteUpdate}
          />
        ))}
      </div>

      <div className='mt-8'>
        <Pagination
          totalItems={filteredProducts.length}
          itemsPerPageOptions={[
            '10 / trang',
            '20 / trang',
            '30 / trang',
            '50 / trang',
          ]}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default ProductList;
