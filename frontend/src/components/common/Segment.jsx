import React, { useState } from 'react';

const Segment = () => {
  const [activeSegment, setActiveSegment] = useState('Personal');

  const handleSegmentChange = (segment) => {
    setActiveSegment(segment);
  };

  return (
    <div className='flex items-center justify-center p-2 mx-auto rounded-2xl w-80'>
      <div className='flex justify-around w-full max-w-md px-4 py-2 space-x-2 border border-gray-300 shadow-xl rounded-2xl'>
        <div
          onClick={() => handleSegmentChange('Personal')}
          className={`w-1/2 p-2 text-center transition duration-300 rounded-2xl cursor-pointer 
            ${activeSegment === 'Personal' ? 'bg-green-800 text-white' : 'text-gray-400 hover:text-green-500'}
          `}
        >
          <h2 className='font-bold text-md'>Personal</h2>
        </div>
        <div
          onClick={() => handleSegmentChange('Group')}
          className={`w-1/2 p-2 text-center transition duration-300 rounded-2xl cursor-pointer 
            ${activeSegment === 'Group' ? 'bg-green-800 text-white' : 'text-gray-400 hover:text-green-500'}
          `}
        >
          <h2 className='font-bold text-md'>Group</h2>
        </div>
      </div>
    </div>
  );
};

export default Segment;
