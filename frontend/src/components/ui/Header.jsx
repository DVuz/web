import { Darkmode } from '../common';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { SearchInput } from '../common';
import { FiUser } from 'react-icons/fi';
import { ShoppingCart } from 'lucide-react';
import UserInfor from '../shared/UserInfor';
import { Link } from 'react-router-dom';
import { useTranslationLoader } from '../../hooks/useTranslationLoader';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartProvider';
import SearchWithTyping from '../common/SearchWithTyping';
import { useLanguage } from '../../contexts/LanguageContext';

const Header = () => {
  useTranslationLoader('header');
  const { t } = useTranslation('header');
  const { user } = useAuth();
  const { cartCount } = useCart();
  const { language } = useLanguage();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Lấy element Top để tính chiều cao của nó
      const topElement = document.querySelector('.top-component');
      if (!topElement) return;

      const topHeight = topElement.offsetHeight;
      const scrollPosition = window.scrollY;

      // Chỉ sticky header khi scroll quá chiều cao của Top component
      setIsSticky(scrollPosition > topHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationLinks = [
    { path: '/', label: 'home' },
    { path: '/about_us', label: 'about_us' },
    { path: '/products', label: 'products' },
    { path: '/articles', label: 'articles' },
    { path: '/address', label: 'address' },
    { path: '/contact', label: 'contact' },
    { path: '/storepolicy', label: 'storepolicy' },
  ];

  const handleSearchResults = (value) => {
    console.log('Search results:', value);
  };

  return (
    <div className={`w-full transition-all duration-300 ${
      isSticky 
        ? 'fixed top-0 left-0 right-0 z-50 shadow-lg bg-[#16512e]/95 backdrop-blur-sm' 
        : 'relative bg-[#16512e]'
    }`}>
      <div className='flex items-center justify-between w-full px-4 py-2 mx-auto max-w-screen-2xl'>
        <div className='flex items-center space-x-4 text-white'>
          <h2 className='text-5xl font-semibold text-yellow-500 cursor-pointer'>
            DDStore
          </h2>
          {navigationLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className='text-lg font-semibold cursor-pointer hover:text-yellow-500'
            >
              {t(link.label)}
            </Link>
          ))}
        </div>

        <div className='flex items-center space-x-4 w-[480px]'>
          <div className='flex-1'>
          <SearchWithTyping 
            apiEndpoint="https://192.168.0.102:3000/api/products"
            placeholder="Tìm kiếm sản phẩm..."
            // onSearchResults={(results) => {
            //   // Optional: Handle results at the parent level if needed
            //   console.log('Search results:', results);
            // }}
            bgColor="bg-white"
            textColor="text-gray-900"
          />
          </div>

          {user ? (
            <UserInfor />
          ) : (
            <Link to='/login'>
              <FiUser className='w-6 h-6 font-bold text-white cursor-pointer hover:text-yellow-500' />
            </Link>
          )}

          <Link to='/cartList' className='relative'>
            <ShoppingCart
              className='w-6 h-6 text-white hover:text-yellow-500 transition-colors'
              strokeWidth={2}
            />
            <div className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
              {cartCount > 99 ? '99+' : cartCount}
            </div>
          </Link>

          <span className='text-white'>|</span>
          <Darkmode />
        </div>
      </div>
    </div>
  );
};

export default Header;