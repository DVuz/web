import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Message } from '../../common';
import { useSocket } from '../../../contexts/SocketContext';

const TypingIndicator = ({ avatarUrl }) => {
  return (
    <div className='flex items-center gap-3'>
      {/* Avatar */}
      <div className='w-10 h-10'>
        <img
          src={avatarUrl}
          alt='Avatar'
          className='w-full h-full rounded-full object-cover shadow-md'
        />
      </div>
      {/* Dots */}
      <div className='p-4 max-w-[220px] bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm flex gap-1'>
        <span
          className='w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 opacity-60 animate-typing'
          style={{
            animationDelay: '0ms',
            animationDuration: '1.2s',
          }}
        />
        <span
          className='w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 opacity-60 animate-typing'
          style={{
            animationDelay: '200ms',
            animationDuration: '1.2s',
          }}
        />
        <span
          className='w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 opacity-60 animate-typing'
          style={{
            animationDelay: '400ms',
            animationDuration: '1.2s',
          }}
        />
      </div>
    </div>
  );
};

const MessageListContext = ({
  messages,
  currentUserId,
  onLoadMore,
  hasMore,
  isLoading,
  otherUserEmail,
  otherUserName,
  otherAvatarUrl,
}) => {
  const scrollRef = useRef(null);
  const loadingRef = useRef(null);
  const initialLoadRef = useRef(true);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { socket } = useSocket();
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

  // Handle typing indicator socket events
  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ senderEmail, isTyping }) => {
      console.log('Typing event received:', senderEmail, isTyping);
      if (senderEmail === otherUserEmail) {
        setIsOtherUserTyping(isTyping);
      }
    };

    socket.on('userTyping', handleTyping);

    return () => {
      socket.off('userTyping', handleTyping);
    };
  }, [socket, otherUserEmail]);

  // Intersection Observer callback
  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        hasMore &&
        !isLoading &&
        !initialLoadRef.current
      ) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const options = {
      root: scrollRef.current,
      rootMargin: '50px 0px 0px 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    initialLoadRef.current = false;

    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    if (messages.length === 0) {
      initialLoadRef.current = true;
    }
  }, [messages.length]);

  const getMinutesSinceStartOfDay = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.getHours() * 60 + date.getMinutes();
  };

  const sortedMessages = [...messages].sort((a, b) => b.id - a.id);

  const groupMessages = (messages) => {
    const grouped = [];
    let currentGroup = [];
  
    for (let i = 0; i < messages.length; i++) {
      const currentMessage = messages[i];
      const nextMessage = messages[i + 1];
  
      currentGroup.push(currentMessage);
  
      if (
        !nextMessage ||
        Math.abs(
          getMinutesSinceStartOfDay(currentMessage.sent_at) -
          getMinutesSinceStartOfDay(nextMessage.sent_at)
        ) > 3 ||
        currentMessage.sender_id !== nextMessage?.sender_id ||
        new Date(currentMessage.sent_at).getDate() !==
        new Date(nextMessage.sent_at).getDate()
      ) {
        // Sắp xếp các tin nhắn trong nhóm theo ID từ bé đến lớn
        const sortedGroup = [...currentGroup].sort((a, b) => a.id - b.id);
        grouped.push(sortedGroup);
        currentGroup = [];
      }
    }
  
    return grouped;
  };

  const groupedMessages = groupMessages(sortedMessages);
  console.log('groupedMessages', groupedMessages);

  return (
    <div
      ref={scrollRef}
      className='flex flex-col-reverse flex-1 px-4 overflow-y-auto max-h-[700px]'
    >
      {isOtherUserTyping && (
        <div className='mb-4'>
          <TypingIndicator avatarUrl={otherAvatarUrl} />
        </div>
      )}

      {groupedMessages.map((group, groupIndex) => {
        const isCurrentUser = group[0].sender_id === currentUserId;

        return (
          <div
            key={groupIndex}
            className={`flex flex-col gap-2 mb-4 ${isCurrentUser ? 'items-end' : 'items-start'}`}
          >
            {group.map((message, index) => {
              const isLastMessageInGroup = index === group.length - 1;
              const isDeleted = message.deleted_at !== null;

              const formattedMessage = {
                content: isDeleted ? 'Tin nhắn đã bị xóa' : message.content,
                type: message.type,
                datetime: message.sent_at,
                send: isCurrentUser ? 'You' : 'Other',
                metadata: message.metadata || {},
              };

              return (
                <div
                  key={`${groupIndex}-${index}`}
                  className={`flex items-end gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {!isCurrentUser && (
                    <>
                      {isLastMessageInGroup ? (
                        <img
                          src={`${message.sender.avatar_link || '/default-avatar.jpg'}`}
                          alt='User avatar'
                          className='w-12 h-12 rounded-full'
                        />
                      ) : (
                        <div className='w-12 h-12' />
                      )}
                    </>
                  )}
                  <Message
                    message={formattedMessage}
                    isLastReadMessage={false}
                  />
                </div>
              );
            })}
          </div>
        );
      })}

      <div ref={loadingRef} className='text-center py-2'>
        {isLoading && (
          <span className='text-gray-500'>Loading messages...</span>
        )}
      </div>
    </div>
  );
};

export default MessageListContext;
