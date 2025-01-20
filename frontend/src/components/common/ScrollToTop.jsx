import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // hoặc 'auto' nếu bạn muốn cuộn ngay lập tức
    });
  }, [location.pathname]); // Chạy effect khi đường dẫn thay đổi

  return null;
};

export default ScrollToTop;
