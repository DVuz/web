import React, { useState } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { FaReply } from 'react-icons/fa6';
import { IoCopy } from 'react-icons/io5';
import { RiDeleteBin5Line } from 'react-icons/ri';
const MessageSetting = ({ sender }) => {
  const [isOpened, setIsOpened] = useState(false);
  const isYouSender = sender === 'You';
  // Thay đổi trạng thái khi nhấn vào icon
  const handleToggle = () => {
    setIsOpened((prev) => !prev);
  };

  return (
    <div className='relative'>
      <div
        className='flex items-center justify-center w-10 h-10 rounded-full cursor-pointer dark:bg-bgGreen'
        onClick={handleToggle}
      >
        <HiDotsHorizontal className='text-white' />
      </div>

      {/* Hiển thị cài đặt khi isOpened là true */}
      {isOpened && (
        <div
          className={`absolute  py-4 bg-white shadow-lg rounded-3xl top-12 dark:bg-bgGreen dark:text-gray-200 ${isYouSender ? 'right-0' : 'left-0'}`}
        >
          {/* Thêm các tùy chọn ở đây */}
          <div className='flex items-center gap-2 px-4 py-1 hover:text-mainYellow'>
            <FaReply className='text-xl' />
            <p className='font-semibold '> Reply</p>
          </div>
          <div className='flex items-center gap-2 px-4 py-1 hover:text-mainYellow'>
            <IoCopy className='text-xl' />
            <p className='font-semibold '> Copy</p>
          </div>
          <div className='flex items-center gap-2 px-4 py-1 hover:text-mainYellow'>
            <RiDeleteBin5Line className='text-xl' />
            <p className='font-semibold '> Delete</p>
          </div>
          <div className='flex items-center gap-2 px-4 py-1 hover:text-mainYellow'>
            <i className='text-xl fa-sharp fa-solid fa-share'></i>
            <p className='font-semibold '> Forward</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageSetting;
