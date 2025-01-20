import React, { useState, useRef, useCallback } from 'react';
import {
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaPlayCircle,
  FaImage,
  FaVideo,
  FaFile,
  FaChevronLeft,
  FaChevronRight,
  FaDownload,
} from 'react-icons/fa';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { useSharedMedia } from './useSharedMedia';

const SharedMediaSection = ({
  title,
  type,
  isExpanded,
  onToggle,
  onClose,
  conversationId,
  accessToken,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const { media, loading, error, hasMore, loadMore } = useSharedMedia(
    conversationId,
    type,
    accessToken
  );

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  const EmptyState = ({ type }) => {
    const emptyStateConfig = {
      image: {
        icon: <FaImage className='text-4xl text-gray-400' />,
        message: 'No images to display',
      },
      video: {
        icon: <FaVideo className='text-4xl text-gray-400' />,
        message: 'No videos available',
      },
      file: {
        icon: <FaFile className='text-4xl text-gray-400' />,
        message: 'No files shared yet',
      },
    };

    return (
      <div className='flex flex-col items-center justify-center py-8 text-gray-500'>
        {emptyStateConfig[type].icon}
        <p className='mt-2 text-sm'>{emptyStateConfig[type].message}</p>
      </div>
    );
  };

  const handlePrev = () => {
    const currentIndex = media.indexOf(selectedItem);
    if (currentIndex > 0) {
      setSelectedItem(media[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    const currentIndex = media.indexOf(selectedItem);
    if (currentIndex < media.length - 1) {
      setSelectedItem(media[currentIndex + 1]);
    }
  };

  const handleDownload = async (url, filename) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'application/pdf':
        return '/src/assets/FileIcon/pdf.png';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return '/src/assets/FileIcon/docx.png';
      case 'application/vnd.ms-powerpoint':
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return '/src/assets/FileIcon/pptx.png';
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return '/src/assets/FileIcon/xlsx.png';
      case 'audio/mpeg':
      case 'audio/wav':
      case 'audio/ogg':
        return '/src/assets/FileIcon/music.png';
      default:
        return '/src/assets/FileIcon/docx.png';
    }
  };

  const truncateFileName = (name) => {
    if (name.length <= 25) return name;
    const extension = name.split('.').pop();
    const nameWithoutExt = name.slice(0, -(extension.length + 1));
    if (nameWithoutExt.length <= 22) return name;
    return `${nameWithoutExt.slice(0, 22)}...${extension ? `.${extension}` : ''}`;
  };

  const renderMediaContent = (item, index) => {
    const isLastElement = index === media.length - 1;
    const ref = isLastElement ? lastElementRef : null;

    if (type === 'image') {
      return (
        <div
          ref={ref}
          key={`${item.message_id}-${index}`}
          className='relative w-24 h-24 group'
          onClick={() => setSelectedItem(item)}
        >
          <img
            src={item.url}
            alt={`Image ${index + 1}`}
            className='w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90'
          />
          <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity'>
            {new Date(item.sent_at).toLocaleDateString()}
          </div>
        </div>
      );
    }

    if (type === 'video') {
      return (
        <div
          ref={ref}
          key={`${item.message_id}-${index}`}
          className='relative w-24 h-24 group cursor-pointer'
          onClick={() => setSelectedItem(item)}
        >
          <video
            src={item.url}
            className='w-full h-full object-cover rounded-lg'
          />
          <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 rounded-lg'>
            <FaPlayCircle className='text-white text-3xl group-hover:scale-110 transition-transform' />
          </div>
          <span className='absolute bottom-1 right-1 text-xs text-white bg-black bg-opacity-50 px-1 rounded'>
            {item.duration}
          </span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        key={`${item.message_id}-${index}`}
        className='flex items-center p-3 space-x-3 bg-white rounded-lg shadow-2xl dark:bg-[#042f2c] mb-2'
      >
        <img
          src={getFileIcon(item.type)}
          alt='File icon'
          className='w-10 h-10 object-contain'
        />

        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium text-gray-900 truncate dark:text-white'>
            {truncateFileName(item.name)}
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {item.size}
          </p>
        </div>

        <button
          onClick={() => handleDownload(item.url, item.name)}
          className='p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200'
          title='Download file'
        >
          <MdOutlineCloudDownload className='w-6 h-6' />
        </button>
      </div>
    );
  };

  const renderSelectedMedia = () => {
    if (!selectedItem) return null;

    return (
      <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-30 w-2/3 h-2/3 m-auto rounded-3xl'>
        <div className='w-full h-full flex justify-center items-center p-4'>
          {type === 'image' ? (
            <img
              src={selectedItem.url}
              alt='Selected'
              className='w-full h-full object-contain rounded-3xl'
            />
          ) : (
            <video
              src={selectedItem.url}
              controls
              autoPlay
              className='w-full h-full object-contain'
            />
          )}
          <div
            className='absolute top-4 right-4 text-white text-xl cursor-pointer'
            onClick={() => setSelectedItem(null)}
          >
            <FaTimes />
          </div>
          <div
            className='absolute left-4 top-1/2 transform -translate-y-1/2 text-white cursor-pointer'
            onClick={handlePrev}
          >
            <FaChevronLeft />
          </div>
          <div
            className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white cursor-pointer'
            onClick={handleNext}
          >
            <FaChevronRight />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='border rounded-lg'>
      <div
        onClick={onToggle}
        className='flex justify-between items-center p-4 cursor-pointer hover:bg-[#042f2c] transition-colors'
      >
        <h4 className='font-semibold text-md'>{title}</h4>
        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {isExpanded && (
        <div className='relative'>
          <div className='absolute top-2 right-4 z-20'>
            <FaTimes
              className='cursor-pointer hover:text-red-500'
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            />
          </div>

          {error ? (
            <div className='text-red-500 text-center py-4'>{error}</div>
          ) : media.length === 0 && !loading ? (
            <EmptyState type={type} />
          ) : (
            <div
              className={`p-4 max-h-[320px] overflow-y-auto custom-scrollbar ${
                type === 'file' ? '' : 'grid grid-cols-3 gap-4'
              }`}
            >
              {media.map((item, index) => renderMediaContent(item, index))}
              {loading && (
                <div className='col-span-3 text-center py-4'>
                  Loading more {type}s...
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {renderSelectedMedia()}
    </div>
  );
};

export default SharedMediaSection;
