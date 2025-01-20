import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Smile, Send, X, Image, Paperclip, Phone, Video } from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import { useChat } from '../../../contexts/ChatProvider';
import { formatDistanceToNow } from 'date-fns';
import vi from 'date-fns/locale/vi';
import { useLocation } from 'react-router-dom';

// Constants
const EMOJI_CATEGORIES = {
  recent: ['😊', '👋', '👍', '❤️', '🙏'],
  emotions: ['😀', '😅', '🤣', '😇', '😍'],
  gestures: ['👍', '👌', '👏', '🙌', '✌️'],
  symbols: ['❤️', '💖', '💕', '💝', '💫'],
};

const SCROLL_THRESHOLD = 100;

// Helper Components
const EmojiPicker = ({ onEmojiSelect }) => (
  <div className='absolute bottom-full mb-2 right-0 bg-white rounded-xl shadow-xl p-4 border border-gray-100 w-72'>
    <div className='space-y-3'>
      {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
        <div key={category}>
          <div className='text-xs text-gray-500 mb-1 capitalize'>
            {category}
          </div>
          <div className='grid grid-cols-5 gap-1.5'>
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => onEmojiSelect(emoji)}
                className='w-9 h-9 hover:bg-gray-100 rounded-lg flex items-center justify-center text-xl transition-colors'
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MessageBubble = ({ message, isOwn, showAvatar = true }) => (
  <div
    className={`flex items-end space-x-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
  >
    {!isOwn && showAvatar && (
      <div className='w-6 h-6 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0'>
        <span className='text-xs'>S</span>
      </div>
    )}

    <div className={`max-w-[85%] group ${isOwn ? 'order-1' : 'order-2'}`}>
      <div
        className={`rounded-2xl px-4 py-2.5 ${
          isOwn
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
            : 'bg-white shadow-sm border border-gray-100 text-gray-700'
        }`}
      >
        <p className='text-sm leading-relaxed whitespace-pre-wrap break-words'>
          {message.content}
        </p>
        <span
          className={`text-[11px] mt-1 block ${
            isOwn ? 'text-blue-100' : 'text-gray-400'
          }`}
        >
          {formatDistanceToNow(new Date(message.sent_at), {
            addSuffix: true,
            locale: vi,
          })}
        </span>
      </div>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className='flex justify-center py-4'>
    <div className='w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin' />
  </div>
);

const ChatHeader = ({ onClose }) => (
  <div className='px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600'>
    <div className='flex items-center justify-between'>
      <div className='flex items-center space-x-4'>
        <div className='relative'>
          <div className='w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm'>
            <span className='text-xl'>💬</span>
          </div>
          <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white' />
        </div>
        <div>
          <h3 className='font-medium text-white'>Hỗ trợ khách hàng</h3>
          <p className='text-xs text-blue-100'>Trực tuyến</p>
        </div>
      </div>
      <div className='flex items-center space-x-2'>
        <button className='text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors'>
          <Phone className='w-5 h-5' />
        </button>
        <button className='text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors'>
          <Video className='w-5 h-5' />
        </button>
        <button
          onClick={onClose}
          className='text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors'
        >
          <X className='w-5 h-5' />
        </button>
      </div>
    </div>
  </div>
);

const ChatInput = ({ onSend, value, onChange, onKeyPress, inputRef }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <div className='p-4 bg-white border-t border-gray-100'>
      <form onSubmit={onSend} className='relative'>
        <div className='flex space-x-2'>
          <div className='flex-1 flex items-center space-x-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 focus-within:border-blue-200 focus-within:bg-white transition-colors duration-200'>
            <button
              type='button'
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <Smile className='w-5 h-5' />
            </button>

            <input
              ref={inputRef}
              type='text'
              value={value}
              onChange={onChange}
              onKeyPress={onKeyPress}
              placeholder='Nhập tin nhắn...'
              className='flex-1 bg-transparent focus:outline-none text-sm placeholder-gray-400'
            />

            <div className='flex space-x-1'>
              <button
                type='button'
                className='text-gray-400 hover:text-gray-600 transition-colors p-1'
              >
                <Image className='w-5 h-5' />
              </button>
              <button
                type='button'
                className='text-gray-400 hover:text-gray-600 transition-colors p-1'
              >
                <Paperclip className='w-5 h-5' />
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={!value.trim()}
            className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
              value.trim()
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className='w-5 h-5' />
          </button>
        </div>

        {showEmojiPicker && (
          <EmojiPicker
            onEmojiSelect={(emoji) => {
              onChange({ target: { value: value + emoji } });
              setShowEmojiPicker(false);
            }}
          />
        )}
      </form>
    </div>
  );
};

// Main Component
const ChatWidget = () => {
  const location = useLocation();
  const shouldHideWidget =
    location.pathname.includes('video_call') ||
    location.pathname.includes('messenger');
  if (shouldHideWidget) {
    return null;
  }
  const { user } = useAuth();
  const {
    conversations,
    messages,
    isWidgetOpen,
    loadMessages,
    handleNewMessage,
    setIsWidgetOpen,
    setWidgetConversation,
    lastMessageId,
    hasMore,
    isLoading,
  } = useChat();

  const [newMessage, setNewMessage] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const loadingRef = useRef(null);
  const observerRef = useRef(null);

  const sortedMessages = [...messages].sort((a, b) => a.id - b.id);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, []);

  // Modified initialization effect
  useEffect(() => {
    const initializeChat = async () => {
      if (conversations.length > 0 && isInitialLoad) {
        try {
          setWidgetConversation(conversations[0]);
          await loadMessages(conversations[0].id, null, user?.accessToken);
          requestAnimationFrame(scrollToBottom);
        } catch (error) {
          console.error('Failed to initialize chat:', error);
        } finally {
          setIsInitialLoad(false);
        }
      }
    };

    initializeChat();
  }, [
    conversations,
    user?.accessToken,
    isInitialLoad,
    loadMessages,
    setWidgetConversation,
    scrollToBottom,
  ]);

  // Intersection Observer setup
  useEffect(() => {
    const options = {
      root: messagesContainerRef.current,
      rootMargin: '50px 0px 0px 0px',
      threshold: 0,
    };

    const handleIntersection = (entries) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        hasMore &&
        !isLoading &&
        conversations[0]?.id
      ) {
        const currentScrollHeight = messagesContainerRef.current.scrollHeight;
        const currentScrollTop = messagesContainerRef.current.scrollTop;

        loadMessages(conversations[0].id, lastMessageId, user?.accessToken)
          .then(() => {
            requestAnimationFrame(() => {
              if (messagesContainerRef.current) {
                const newScrollHeight =
                  messagesContainerRef.current.scrollHeight;
                const scrollOffset = newScrollHeight - currentScrollHeight;
                messagesContainerRef.current.scrollTop =
                  currentScrollTop + scrollOffset;
              }
            });
          })
          .catch((error) => {
            console.error('Error loading messages:', error);
          });
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [
    hasMore,
    isLoading,
    conversations,
    lastMessageId,
    user?.accessToken,
    loadMessages,
  ]);

  // Effect for new messages and widget open
  useEffect(() => {
    if (isWidgetOpen && messages.length > 0 && !isLoading) {
      const container = messagesContainerRef.current;
      if (!container) return;

      const isScrolledToBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;

      // if (isScrolledToBottom) {
      //   requestAnimationFrame(scrollToBottom);
      // }
      requestAnimationFrame(scrollToBottom);
    }
  }, [isWidgetOpen, messages.length, isLoading, scrollToBottom]);

  const handleSend = async (e) => {
    e.preventDefault();
    const messageContent = newMessage.trim();

    if (!messageContent || !conversations[0]?.id) return;

    try {
      const messageData = {
        content: messageContent,
        type: 'text',
        conversation_id: conversations[0].id,
        sender_id: user?.id,
        sent_at: new Date().toISOString(),
      };

      setNewMessage('');
      await handleNewMessage(messageData, conversations[0].id);
      inputRef.current?.focus();
      requestAnimationFrame(scrollToBottom);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (!isWidgetOpen) {
    return (
      <button
        onClick={() => setIsWidgetOpen(true)}
        className='fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 
                   rounded-full flex items-center justify-center hover:shadow-lg transform 
                   hover:scale-105 transition-all duration-200 shadow-md'
      >
        <div className='relative'>
          <svg
            className='w-6 h-6 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
            />
          </svg>
          {messages.length > 0 && (
            <span className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse' />
          )}
        </div>
      </button>
    );
  }

  return (
    <div className='fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100'>
      <ChatHeader onClose={() => setIsWidgetOpen(false)} />

      <div
        ref={messagesContainerRef}
        className='flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gradient-to-b from-gray-50 to-white'
        style={{ scrollbarWidth: 'thin' }}
      >
        <div ref={loadingRef} className='h-px' />{' '}
        {/* Loading trigger element */}
        {isLoading && <LoadingSpinner />}
        {sortedMessages.map((message, index) => {
          const isOwn = message.sender_id === user?.id;
          const showAvatar =
            index === 0 ||
            sortedMessages[index - 1]?.sender_id !== message.sender_id;

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={isOwn}
              showAvatar={showAvatar}
            />
          );
        })}
      </div>

      <ChatInput
        onSend={handleSend}
        value={newMessage}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        inputRef={inputRef}
      />
    </div>
  );
};
export default ChatWidget;
