import React, { useState, useEffect } from 'react';
import { MdContentCopy } from 'react-icons/md';

const QuickCopy = () => {
  const [text, setText] = useState('');
  const [lines, setLines] = useState(() => {
    // Lấy dữ liệu từ localStorage khi khởi tạo component
    const savedLines = localStorage.getItem('copyLines');
    return savedLines ? JSON.parse(savedLines) : [];
  });

  useEffect(() => {
    // Lưu dữ liệu vào localStorage mỗi khi lines thay đổi
    localStorage.setItem('copyLines', JSON.stringify(lines));
  }, [lines]);

  const handleAddLine = () => {
    if (text.trim()) {
      setLines([...lines, text.trim()]);
      setText('');
    }
  };

  const handleRemoveLine = (indexToRemove) => {
    setLines(lines.filter((_, index) => index !== indexToRemove));
  };

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Đã sao chép:', text);
      })
      .catch((err) => {
        console.error('Lỗi sao chép:', err);
      });
  };

  return (
    <div className='p-4 flex items-center justify-center min-h-screen bg-slate-800 text-yellow-400'>
      <div className='w-full max-w-2xl mx-4 bg-slate-700 p-6 rounded-lg shadow-md'>
        <div className='mb-4'>
          <input
            type='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Nhập dòng văn bản...'
            className='border p-2 rounded w-full mb-2 bg-slate-600 text-yellow-400 border-slate-500'
          />
          <button
            onClick={handleAddLine}
            className='bg-blue-500 hover:bg-blue-700 text-yellow-400 font-bold py-2 px-4 rounded w-full'
          >
            Thêm dòng
          </button>
        </div>

        <div>
          {lines.map((line, index) => (
            <div key={index} className='flex items-center mb-2'>
              <code className='p-2 bg-slate-600 rounded flex-grow text-yellow-400'>
                {line}
              </code>
              <button
                onClick={() => handleCopy(line)}
                className='p-2 bg-green-500 hover:bg-green-700 text-yellow-400 rounded ml-2'
              >
                <MdContentCopy />
              </button>
              <button
                onClick={() => handleRemoveLine(index)}
                className='p-2 bg-red-500 hover:bg-red-700 text-yellow-400 rounded ml-2'
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickCopy;
