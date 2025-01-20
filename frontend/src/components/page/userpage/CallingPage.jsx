import React from 'react';
import { Phone, Mic, Camera, Users } from 'lucide-react';

const GroupCall = () => {
  return (
    <div className='fixed inset-0 bg-black'>
      <div className='h-full w-full p-4 grid grid-cols-2 md:grid-cols-3 gap-4'>
        {/* Grid của các videos */}
        <div className='relative rounded-lg overflow-hidden bg-gray-800'>
          <video className='w-full h-full object-cover' />
          <div className='absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded'>
            User 1
          </div>
        </div>
        <div className='relative rounded-lg overflow-hidden bg-gray-800'>
          <video className='w-full h-full object-cover' />
          <div className='absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded'>
            User 2
          </div>
        </div>
        <div className='relative rounded-lg overflow-hidden bg-gray-800'>
          <video className='w-full h-full object-cover' />
          <div className='absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded'>
            User 3
          </div>
        </div>

        {/* Video của bạn */}
        <div className='absolute top-4 right-4 w-48 h-36 rounded-lg overflow-hidden bg-gray-800'>
          <video className='w-full h-full object-cover' />
          <div className='absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded'>
            You
          </div>
        </div>

        {/* Controls cho group call */}
        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4'>
          <button className='p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white'>
            <Mic size={24} />
          </button>
          <button className='p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white'>
            <Camera size={24} />
          </button>
          <button className='p-4 rounded-full bg-red-500 hover:bg-red-600 text-white'>
            <Phone size={24} />
          </button>
          <button className='p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white'>
            <Users size={24} />
          </button>
        </div>

        {/* Participants count */}
        <div className='absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full'>
          Participants: 4
        </div>
      </div>
    </div>
  );
};
export default GroupCall;
