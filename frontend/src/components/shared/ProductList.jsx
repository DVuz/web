// ProductList.jsx
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Pagination from '../common/Pagination';
import ProductCard from './ProductCard';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [itemsPerPage, setItemsPerPage] = useState(10); // Show 10 items by default

  // Giả lập dữ liệu sản phẩm với nhiều mẫu hơn
  useEffect(() => {
    // Trong thực tế, đây sẽ là API call
    const mockProducts = Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      name: `Bàn giám đốc ${index + 1}`,
      dimensions: '2000x1000x800 mm',
      price: Math.floor(Math.random() * 9000000) + 1000000,
      originalPrice: Math.floor(Math.random() * 15000000) + 10000000,
      image: '/api/placeholder/400/320',
    }));
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Xử lý tìm kiếm và lọc
  useEffect(() => {
    let results = products;

    // Tìm kiếm theo tên
    if (searchTerm) {
      results = results.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo giá
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

  // Xử lý phân trang
  const handlePageChange = (page, newItemsPerPage) => {
    setCurrentPage(page);
    if (newItemsPerPage !== itemsPerPage) {
      setItemsPerPage(newItemsPerPage);
    }
  };

  // Tính toán sản phẩm hiển thị trên trang hiện tại
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header với thanh tìm kiếm và bộ lọc */}
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

      {/* Hiển thị tổng số sản phẩm và kết quả lọc */}
      <div className='mb-4 text-gray-600'>
        Hiển thị {indexOfFirstProduct + 1}-
        {Math.min(indexOfLastProduct, filteredProducts.length)} của{' '}
        {filteredProducts.length} sản phẩm
      </div>

      {/* Grid sản phẩm - 5 sản phẩm một hàng */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Phân trang */}
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
