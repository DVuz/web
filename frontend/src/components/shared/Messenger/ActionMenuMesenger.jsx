import React, { useState } from 'react';
import { FaRegUserCircle, FaBellSlash } from 'react-icons/fa';
import SharedMediaSection from './SharedMediaSection';

const ActionMenuMessenger = ({ otherUser, conversationId, accessToken }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const handleToggle = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className='w-5/12 max-h-[850px] flex flex-col space-y-4 mx-auto py-4 shadow-lg rounded-lg'>
      {/* User Info */}
      <div className='space-y-6'>
        <div className='flex flex-col items-center space-y-2'>
          <img
            src='https://192.168.0.102:3000/api/media/test/a.jpg'
            alt='User Avatar'
            className='w-28 h-28 rounded-full object-cover cursor-pointer hover:scale-105'
          />
          <div className='font-bold  text-gray-400'>
            <p className='text-md'>{otherUser.user_name}</p>
            <p className='text-sm'>{otherUser.last_login}</p>
          </div>
        </div>

        <div className='flex justify-evenly items-center gap-6 w-full px-4'>
          <div className='flex flex-col items-center space-y-1'>
            <div className='rounded-full bg-gray-700 p-2'>
              <FaRegUserCircle className='text-2xl text-white cursor-pointer hover:scale-125 hover:text-yellow-400' />
            </div>
            <p className='text-xs'>View Profile</p>
          </div>

          <div className='flex flex-col items-center space-y-1'>
            <div className='rounded-full bg-gray-700 p-2'>
              <FaBellSlash className='text-2xl text-white cursor-pointer hover:scale-125 hover:text-yellow-400' />
            </div>
            <p className='text-xs'>Turn on</p>
          </div>
        </div>
      </div>

      {/* File and Media */}
      <div className='space-y-2'>
        <div>
          <h3 className='font-bold text-lg p-2'>File and Media</h3>
        </div>

        <div className='space-y-2'>
          <SharedMediaSection
            title='Images'
            type='image'
            isExpanded={expandedSection === 'images'}
            onToggle={() => handleToggle('images')}
            onClose={() => setExpandedSection(null)}
            conversationId={conversationId}
            accessToken={accessToken}
          />

          <SharedMediaSection
            title='Videos'
            type='video'
            isExpanded={expandedSection === 'videos'}
            onToggle={() => handleToggle('videos')}
            onClose={() => setExpandedSection(null)}
            conversationId={conversationId}
            accessToken={accessToken}
          />

          <SharedMediaSection
            title='Files'
            type='file'
            isExpanded={expandedSection === 'files'}
            onToggle={() => handleToggle('files')}
            onClose={() => setExpandedSection(null)}
            conversationId={conversationId}
            accessToken={accessToken}
          />
        </div>
      </div>
    </div>
  );
};

export default ActionMenuMessenger;
