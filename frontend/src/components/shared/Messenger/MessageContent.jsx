import React, { useState, useMemo } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import MessageListContext from './MessageListContext';
import ChatRoom from './ChatRoom';
import ActionMenuMesenger from './ActionMenuMesenger';
import CallButton from '../CallMessenger/CallButton';
import formatLastLogin from '../../../utils/formatLastLogin';

const MessageContent = ({
  selectedConversation,
  messages,
  userid,
  onLoadMore,
  hasMore,
  isLoading,
  accessToken,
}) => {
  console.log('selectedConversation 22', selectedConversation);
  const [isOpenActionMenu, setIsOpenActionMenu] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  console.log('selectedConversation', selectedConversation);

  const otherUser = useMemo(() => {
    if (!selectedConversation?.other_members || !userid) return {};
    const otherMember = selectedConversation.other_members[0];
    if (!otherMember) return {};
    console.log('otherMember2', otherMember);
    return {
      user_id: otherMember.user_id,
      user_name: otherMember.username,
      avatar_url: otherMember.avatar,
      role: otherMember.role,
      last_login: formatLastLogin(otherMember.last_login),
      email: otherMember.email,
    };
  }, [selectedConversation?.other_members, userid]);
  console.log('22', selectedConversation);

  const handleToggleActionMenu = () => {
    setIsOpenActionMenu((prevState) => !prevState);
  };

  if (!selectedConversation) {
    return (
      <div className='w-full flex justify-center items-center'>
        <p className='text-gray-500'>
          Select a conversation to start messaging
        </p>
      </div>
    );
  }
  // const isNewConversation = selectedConversation.startsWith('new-') || messages.length === 0;
  return (
    <div className='w-full flex gap-4'>
      <div className='w-full border-2 border-[#042f2c] rounded-3xl flex flex-col h-[850px]'>
        <div className='flex items-center justify-between bg-[#dbeafe] dark:bg-[#042f2c] p-4 rounded-t-3xl'>
          <div className='flex items-center space-x-4'>
            <img
              src={`${otherUser.avatar_url || '/default-avatar.jpg'}`}
              alt={otherUser.user_name || 'User avatar'}
              className='object-cover w-12 h-12 rounded-full'
            />
            <div className='ml-4'>
              <h1 className='text-xl font-bold'>
                {otherUser.user_name || 'Unknown User'}
              </h1>
              <p className='text-sm font-semibold text-gray-400'>
                {otherUser.last_login
                  ? `Last seen ${otherUser.last_login}`
                  : ''}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-10 text-3xl font-bold'>
            <IoSearchOutline className='cursor-pointer hover:scale-125' />
            <CallButton receiverEmail={otherUser.email} />
            <PiDotsThreeOutlineVerticalFill
              className='cursor-pointer hover:scale-125'
              onClick={handleToggleActionMenu}
            />
          </div>
        </div>

        <MessageListContext
          messages={messages}
          currentUserId={userid}
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          otherUserEmail={otherUser.email}
          otherUserName={otherUser.user_name}
          otherAvatarUrl={otherUser.avatar_url}
        />

        <div className='p-4'>
          <ChatRoom
            conversationId={selectedConversation.id}
            receiverEmail={otherUser.email}
            senderId={userid}
            last_message={selectedConversation.last_message}
            accessToken={accessToken}
          />
        </div>
      </div>

      {isOpenActionMenu && (
        <ActionMenuMesenger
          otherUser={otherUser}
          conversationId={selectedConversation.id}
          accessToken={accessToken}
        />
      )}
    </div>
  );
};

export default MessageContent;
