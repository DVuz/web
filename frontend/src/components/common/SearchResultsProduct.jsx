import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const SearchResultsDropdown = ({ results, onSelectProduct, onClose }) => {
  const { language } = useLanguage();
  const isVietnamese = language === 'vi';
  const navigate = useNavigate();

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

  const handleCardClick = (product) => {
    const seoUrl = createSeoUrl(product?.product_name_vn);
    navigate(`/productDetail/${seoUrl}`);
    if (onSelectProduct) {
      onSelectProduct(product);
    }
    if (onClose) {
      onClose();
    }
  };
  // If no results, don't render the dropdown
  if (results && results.products && results.products.length === 0) {
    return (
      <div className="absolute z-50 w-[400px] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="p-4 text-center text-gray-500">
          Không có sản phẩm
        </div>
      </div>
    );
  }

  return (
    <div className="absolute z-50 w-[400px] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
{results?.products?.map((product) => (
          <div
            key={product.id}
            onClick={() => handleCardClick(product)}
            className="group cursor-pointer"
          >
            <div className="flex gap-4 p-4 hover:bg-gray-50 transition-all duration-200">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={product.main_image}
                  alt={product.product_name_en}
                  className="w-16 h-16 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200"
                />
              </div>

              {/* Product Information */}
              <div className="flex-1 min-w-0">
                <div className="space-y-1.5">
                  {/* Product Name */}
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
                    {isVietnamese ? product.product_name_vn : product.product_name_en}
                  </h3>
                  
                  {/* Secondary Language Name */}
                  <p className="text-xs text-gray-500 truncate">
                    {isVietnamese ? product.product_name_en : product.product_name_vn}
                  </p>

                  {/* Price and Material Section */}
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-2">
                      {/* Price in VND */}
                      <span className="text-sm font-medium text-blue-600">
                        {isVietnamese ? (
                          new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }).format(product.price)
                        ) : (
                          new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(product.price / 24500)
                        )}
                      </span>
                      
                      {/* Show VND equivalent for English */}
                      {!isVietnamese && (
                        <span className="text-xs text-gray-500">
                          ≈ {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'VND',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }).format(product.price)}
                        </span>
                      )}
                    </div>
                    
                    {/* Material */}
                    <span className="text-xs text-gray-600">
                      {isVietnamese ? product.material_vn : product.material}
                    </span>
                  </div>

                  {/* Dimensions */}
                  <div className="text-xs text-gray-500 pt-1 border-t border-gray-50">
                    {isVietnamese ? 'Kích thước:' : 'Dimensions:'}{' '}
                    {product.length}x{product.width}x{product.height}mm
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SearchResultsDropdown;