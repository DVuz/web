import React from 'react';

const PersonalMessage = ({
  lastMessage,
  members,
  currentUserId,
  unreadCount = 0,
}) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const truncateMessage = (message, maxLength) => {
    if (!message) return 'No messages';
    return message.length > maxLength
      ? `${message.slice(0, maxLength)}...`
      : message;
  };

  const isFromCurrentUser = lastMessage?.sender?.user_id === currentUserId;

  // Format unread count display (max 9)
  const displayUnreadCount = unreadCount > 9 ? '9+' : unreadCount;

  return (
    <div className='flex items-start justify-between p-3 space-x-2 rounded-lg hover:bg-[#dbeafe] cursor-pointer hover:dark:bg-[#4d4c4c] relative'>
      <img
        src={members[0]?.avatar}
        alt='Profile'
        className='w-12 h-12 rounded-full'
      />

      <div className='flex-1'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-bold hover:text-mainYellow'>
            {members[0]?.username || 'Unknown User'}
          </h2>
          <div className='flex items-center space-x-2 text-xs font-bold text-gray-400'>
            <span>{formatTime(lastMessage?.sent_at)}</span>
            {/* Show online status dot only if there are no unread messages */}
            {unreadCount === 0 && (
              <span className='w-2 h-2 bg-blue-500 rounded-full'></span>
            )}
            {/* Show unread count badge if there are unread messages */}
            {unreadCount > 0 && (
              <span className='flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full'>
                {displayUnreadCount}
              </span>
            )}
          </div>
        </div>

        <div className='flex items-start justify-between mt-1 space-x-2'>
          <p
            className={`text-[13px] italic ${unreadCount > 0 ? 'font-semibold text-white' : 'text-gray-100'}`}
          >
            {isFromCurrentUser
              ? `You: ${truncateMessage(lastMessage?.content, 32)}`
              : truncateMessage(lastMessage?.content, 40)}
          </p>
          <img
            src={members[0]?.avatar}
            alt='Message Icon'
            className='w-6 h-6 rounded-full'
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalMessage;
