import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// Component hiển thị hiệu ứng typing
const TypingEffect = ({ text, speed, typingStopped }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (typingStopped) return; // Nếu dừng typing thì không làm gì

    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }

    // Khi typing hoàn thành, đợi một chút rồi xóa và viết lại
    if (index === text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText('');
        setIndex(0);
      }, 2000); // Đợi 2 giây trước khi reset

      return () => clearTimeout(timeout);
    }
  }, [index, text, speed, typingStopped]);

  return <span>{displayedText}</span>;
};

const SearchInput = ({ searchValue }) => {
  const [inputValue, setInputValue] = useState(''); // Giá trị của input
  const [isTyping, setIsTyping] = useState(false); // Kiểm tra người dùng có đang nhập không

  const placeholderText = 'Nhập email của bạn';

  const handleInputChange = (e) => {
    const input = e.target.value;
    setInputValue(input);
    // searchValue(input); // Gửi giá trị input về component cha
    setIsTyping(input.length > 0); // Nếu có chữ => người dùng đang nhập
  };

  const handleFocus = () => {
    setIsTyping(true); // Khi focus vào input
  };

  const handleBlur = () => {
    if (inputValue === '') {
      setIsTyping(false); // Khi blur mà input trống
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchValue(inputValue); // Thực hiện tìm kiếm khi nhấn nút
  };

  return (
    <form onSubmit={handleSubmit} className='relative'>
      <label
        htmlFor='default-search'
        className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'
      >
        Search
      </label>
      <div className='relative'>
        <input
          type='search'
          id='default-search'
          className='block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-darkBg dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500'
          placeholder='' // Không cần placeholder vì dùng TypingEffect
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {/* Render hiệu ứng typing */}
        {!isTyping && inputValue === '' && (
          <div className='absolute inset-y-0 start-10 flex items-center text-gray-500 pointer-events-none dark:text-gray-400'>
            <TypingEffect
              text={placeholderText}
              speed={100}
              typingStopped={isTyping}
            />
          </div>
        )}
        <button
          type='submit'
          className='text-white absolute end-2.5 bottom-2.5 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  );
};

// PropTypes validation
SearchInput.propTypes = {
  searchValue: PropTypes.func.isRequired, // Callback function for updating input value in parent
};

export default SearchInput;
