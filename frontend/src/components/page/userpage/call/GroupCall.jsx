import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mic,
  Camera,
  Users,
  MicOff,
  VideoOff,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const GroupCall = () => {
  const [focusedUser, setFocusedUser] = useState(0);
  const [callTime, setCallTime] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [activityTimeout, setActivityTimeout] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const USERS_PER_PAGE = 5;

  // Sample users data
  const users = [
    {
      id: 1,
      name: 'John Doe',
      avatar: 'https://192.168.0.102:3000/api/media/test/b.jpg',
    },
    {
      id: 2,
      name: 'Alice Smith',
      avatar: 'https://192.168.0.102:3000/api/media/test/b.jpg',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      avatar: 'https://192.168.0.102:3000/api/media/test/b.jpg',
    },
    {
      id: 4,
      name: 'Emma Wilson',
      avatar: 'https://192.168.0.102:3000/api/media/test/b.jpg',
    },
    {
      id: 5,
      name: 'Michael Brown',
      avatar: 'https://192.168.0.102:3000/api/media/test/b.jpg',
    },
    {
      id: 6,
      name: 'Sophia Davis',
      avatar: 'https://192.168.0.102:3000/api/media/test/b.jpg',
    },
    {
      id: 7,
      name: 'William Garcia',
      avatar: 'https://192.168.0.102:3000/api/media/test/b.jpg',
    },
    {
      id: 8,
      name: 'Olivia Martinez',
      avatar: 'https://192.168.0.102:3000/api/media/test/b.jpg',
    },
    {
      id: 9,
      name: 'James Anderson',
      avatar: 'https://192.168.0.102:3000/api/media/test/b.jpg',
    },
    {
      id: 10,
      name: 'Isabella Thomas',
      avatar: 'https://192.168.0.102:3000/api/media/test/b.jpg',
    },
    {
      id: 11,
      name: 'Ethan Jackson',
      avatar: 'https://192.168.0.102:3000/api/media/test/b.jpg',
    },
    {
      id: 12,
      name: 'Charlotte White',
      avatar: 'https://192.168.0.102:3000/api/media/test/b.jpg',
    },
  ];

  const totalPages = Math.ceil((users.length - 1) / USERS_PER_PAGE);

  // Get visible users for current page, excluding focused user
  const getVisibleUsers = () => {
    const otherUsers = users.filter((_, index) => index !== focusedUser);
    const start = currentPage * USERS_PER_PAGE;
    return otherUsers.slice(start, start + USERS_PER_PAGE);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startHideTimer = () => {
    if (activityTimeout) {
      clearTimeout(activityTimeout);
    }
    setShowControls(true);
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    setActivityTimeout(timeout);
  };

  const handleUserActivity = () => {
    startHideTimer();
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCallTime((prev) => prev + 1);
    }, 1000);

    window.addEventListener('mousedown', handleUserActivity);
    startHideTimer();

    return () => {
      clearInterval(timer);
      window.removeEventListener('mousedown', handleUserActivity);
      if (activityTimeout) clearTimeout(activityTimeout);
    };
  }, []);

  const handleUserClick = (index) => {
    setFocusedUser(index);
  };

  const handleEndCall = () => {
    window.close();
  };

  const NoVideoPlaceholder = ({ userName }) => (
    <div className='w-full h-full bg-gray-800 flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-16 h-16 rounded-full bg-gray-700 mx-auto mb-2 flex items-center justify-center'>
          <VideoOff size={32} className='text-gray-400' />
        </div>
        <p className='text-gray-400'>{userName}'s camera is off</p>
      </div>
    </div>
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className='fixed inset-0'>
      <div className='h-full w-full flex flex-col bg-gray-900 p-6'>
        {/* Main video section - 2/3 height */}
        <div className='h-3/4 w-5/6 relative mx-auto rounded-3xl overflow-hidden'>
          {users[focusedUser] && (
            <video
              className='w-full h-full object-cover rounded-3xl'
              src='https://192.168.0.102:3000/api/media/video/pt.mp4'
              autoPlay
              muted
              loop
              controls
            />
          )}

          {/* User info overlay */}
          {showControls && (
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center transition-opacity duration-300'>
              <div className='flex flex-col items-center mb-8'>
                <div className='w-36 h-36 rounded-full bg-gray-700 mb-4 overflow-hidden'>
                  <img
                    src={users[focusedUser].avatar}
                    alt={users[focusedUser].name}
                    className='w-full h-full object-cover'
                  />
                </div>
                <h2 className='text-white text-2xl font-semibold'>
                  {users[focusedUser].name}
                </h2>
                <p className='text-gray-400 mt-2'>In call</p>
              </div>
            </div>
          )}

          {/* Self video */}
          <div className='absolute top-4 right-4 w-48 h-36 rounded-lg overflow-hidden bg-gray-800'>
            {isVideoOn ? (
              <video
                className='w-full h-full object-cover'
                src='https://192.168.0.102:3000/api/media/video/music.mp4'
                autoPlay
                muted
                loop
              />
            ) : (
              <NoVideoPlaceholder userName='You' />
            )}
            <div className='absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded'>
              You
            </div>
            {!isMicOn && (
              <div className='absolute bottom-2 right-2 bg-black/50 p-1 rounded-full'>
                <MicOff size={16} className='text-red-500' />
              </div>
            )}
          </div>

          {/* Call info */}
          {showControls && (
            <div className='absolute top-4 left-4 flex space-x-4 transition-opacity duration-300'>
              <div className='bg-black/50 text-white px-3 py-1 rounded-full'>
                Participants: {users.length}
              </div>
              <div className='bg-black/50 text-white px-3 py-1 rounded-full'>
                {formatTime(callTime)}
              </div>
            </div>
          )}
        </div>

        {/* Bottom section - 1/3 height */}
        <div className='h-1/4 bg-gray-900 flex flex-col'>
          {/* User carousel with navigation */}
          <div className='flex-1 p-4 flex items-center justify-center space-x-4'>
            {/* Previous button */}
            <button
              className={`p-2 rounded-full ${currentPage === 0 ? 'bg-gray-800 text-gray-600' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              onClick={handlePrevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft size={24} />
            </button>

            {/* User videos */}
            <div className='flex space-x-4 h-full overflow-hidden'>
              {getVisibleUsers().map((user, index) => (
                <div
                  key={user.id}
                  className='relative w-28 h-28 rounded-lg overflow-hidden bg-gray-800 cursor-pointer hover:ring-2 hover:ring-blue-500 flex-shrink-0'
                  onClick={() => handleUserClick(users.indexOf(user))}
                >
                  <video
                    className='w-full h-full object-cover'
                    src='https://192.168.0.102:3000/api/media/video/pt.mp4'
                    autoPlay
                    muted
                    loop
                  />
                  <div className='absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded'>
                    {user.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Next button */}
            <button
              className={`p-2 rounded-full ${currentPage === totalPages - 1 ? 'bg-gray-800 text-gray-600' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Controls */}
          <div className='h-20 flex items-center justify-center space-x-6 border-t border-gray-800'>
            <button
              className={`p-4 rounded-full ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            <button
              className={`p-4 rounded-full ${isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Camera size={24} /> : <VideoOff size={24} />}
            </button>
            <button
              className='p-4 rounded-full bg-red-500 hover:bg-red-600 text-white'
              onClick={handleEndCall}
            >
              <Phone size={24} />
            </button>
            <button className='p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white'>
              <Users size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCall;
