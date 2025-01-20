import React, { useState, useEffect, useRef } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi'; // Thư viện icon
import Docx from '../../assets/FileIcon/docx.png';
import PDF from '../../assets/FileIcon/pdf.png';
import PPT from '../../assets/FileIcon/pptx.png';
import XLSX from '../../assets/FileIcon/xlsx.png';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { FaRegTrashCan } from 'react-icons/fa6';

const FileItem = ({ fileName, fileSize }) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOptionsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative flex items-center p-2 border shadow-md rounded-xl w-96'>
      {/* Icon file XLSX */}
      <img src={XLSX} alt='XLSX Icon' className='w-8 h-8' />
      {/* Tên file và kích thước */}
      <div className='flex-grow ml-4'>
        <p className='text-lg font-semibold'>{fileName}</p>
        <p className='text-sm text-gray-500'>{fileSize}</p>
      </div>
      {/* Dấu ba chấm */}
      <FiMoreHorizontal
        className='ml-4 text-gray-500 cursor-pointer hover:text-gray-700'
        onClick={toggleOptions}
      />
      {/* Hiển thị các tùy chọn khi nhấn vào dấu ba chấm */}
      {isOptionsOpen && (
        <div
          ref={menuRef}
          className='absolute w-40 p-2 mt-2 bg-white border shadow-md rounded-xl right-6 top-10 dark:bg-darkBg'
        >
          <button className='flex items-center w-full px-4 py-2 mb-2 text-left dark:text-white hover:bg-gray-200 rounded-xl hover:dark:bg-slate-800'>
            <MdOutlineCloudUpload className='mr-2 text-xl' /> Download
          </button>
          <button className='flex items-center w-full px-4 py-2 text-left text-red-500 dark:text-red-500 hover:bg-gray-200 rounded-xl hover:dark:bg-slate-800'>
            <FaRegTrashCan className='mr-2 text-xl' /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default FileItem;
