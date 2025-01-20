import React from 'react';
import { FaTimes } from 'react-icons/fa';

const VideoGallery = ({ isExpanded, onClose }) => {
  const videos = Array(12).fill(null);
  const displayVideos = videos.slice(0, 6); // Always show only 6 videos

  return (
    <div>
      <h4 className='font-semibold text-md p-2'>Videos</h4>
      <div className='grid grid-cols-3 gap-4 p-4'>
        {displayVideos.map((_, index) => (
          <div
            key={index}
            className='w-20 h-20 bg-gray-300 flex items-center justify-center rounded-lg'
          >
            <span className='text-sm font-medium text-gray-500'>
              Video {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;
