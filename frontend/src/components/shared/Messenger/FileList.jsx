import React from 'react';
import { FaTimes } from 'react-icons/fa';

const FileList = ({ isExpanded, onClose }) => {
  const files = Array(10).fill(null);
  const displayFiles = files.slice(0, 3); // Always show only 3 files

  return (
    <div>
      <h4 className='font-semibold text-md p-2'>Files</h4>
      <div className='p-2'>
        {displayFiles.map((_, index) => (
          <div key={index} className='p-2 hover:bg-gray-100 rounded-lg'>
            <p className='text-gray-500'>File {index + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
