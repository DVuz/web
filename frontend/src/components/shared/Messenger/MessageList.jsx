import React, { useState, useEffect } from 'react';
import { Segment, SearchInput } from '../../common';
import PersonalMessage from '../PersonalMessage';
import { IoSearchSharp, IoCloseSharp } from 'react-icons/io5';
import { searchUsers } from '../../../services/getApi';

const MessageList = ({
  conversations,
  onSelectConversation,
  selectedConversationId,
  userid,
  accessToken,
}) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [hasSearchTerm, setHasSearchTerm] = useState(false);
  console.log('conversations', conversations);
  const handleConversationSelect = async (conversationId) => {
    onSelectConversation(conversationId, accessToken);
  };
  
  const handleSearchClick = () => {
    setIsSearchActive(true);
    setSearchResults([]);
    setSearchError(null);
    setHasSearchTerm(false);
  };

  const handleCancelSearch = () => {
    setIsSearchActive(false);
    setSearchResults([]);
    setSearchError(null);
    setHasSearchTerm(false);
  };

  const handleSearch = async (searchTerm) => {
    setHasSearchTerm(searchTerm.trim().length > 0);

    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);
      const response = await searchUsers(searchTerm, accessToken);
      setSearchResults(response.data);
    } catch (error) {
      setSearchError('Không thể tìm kiếm người dùng. Vui lòng thử lại sau.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const findExistingConversation = (userId) => {
    return conversations.find((conv) =>
      conv.other_members.some((member) => member.user_id === userId)
    );
  };
  useEffect(() => {
    if(!conversations) return;  
  }, [conversations]);
  const handleUserSelect = (userInfo) => {
    const existingConversation = findExistingConversation(userInfo.user_id);

    if (existingConversation) {
      // If conversation exists, select it
      onSelectConversation(existingConversation.id);
    } else {
      // If no conversation exists, show alert
      const newConversationData = {
        // Gộp tất cả thông tin vào id (có thể sử dụng một định dạng chuỗi)
        id: `new-${userInfo.user_id}-${userInfo.user_name}-${userInfo.email}-${userInfo.last_login}`,
        other_members: [
          {
            user_id: userInfo.user_id, // Có thể vẫn giữ thông tin user_id trong other_members để dễ quản lý
            username: userInfo.user_name,
            avatar: userInfo.avatar_link,
            last_login: userInfo.last_login,
            email: userInfo.email,
          },
        ],
        messages: [],
        isNew: true, // Đánh dấu cuộc trò chuyện mới
        last_message: null, // Thông tin về tin nhắn cuối cùng
      };
      onSelectConversation(newConversationData.id);
    }

    // Clear search after selection
    setIsSearchActive(false);
    setSearchResults([]);
  };

  const renderSearchResults = () => {
    if (searchError) {
      return <div className='p-4 text-red-500 text-center'>{searchError}</div>;
    }

    if (isSearching) {
      return (
        <div className='p-4 text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
        </div>
      );
    }

    if (searchResults.length === 0 && hasSearchTerm) {
      return (
        <div className='p-4 text-gray-500 text-center'>
          Không tìm thấy người dùng
        </div>
      );
    }

    return (
      searchResults.length > 0 && (
        <div className='space-y-2'>
          {searchResults.map((result) => (
            <div
              key={result.user_info.user_id}
              className='p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer'
              onClick={() =>
                handleUserSelect(result.user_info, result.last_interaction)
              }
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <img
                    src={result.user_info.avatar_link}
                    alt={result.user_info.user_name}
                    className='w-10 h-10 rounded-full'
                  />
                  <div>
                    <div className='font-medium'>
                      {result.user_info.user_name}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {result.last_interaction ? (
                        <span>
                          {result.last_interaction.message_content ||
                            'Bắt đầu cuộc trò chuyện'}
                        </span>
                      ) : (
                        <span className='text-blue-500'>
                          Chưa có cuộc trò chuyện
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    );
  };

  return (
    <div className='w-1/3 overflow-hidden h-[850px] relative shadow-xl p-4'>
      <div className='flex items-center justify-between'>
        <h1
          className={`text-3xl font-bold cursor-pointer ${
            isSearchActive ? 'hidden' : 'text-mainYellow'
          }`}
        >
          Chat
        </h1>

        {!isSearchActive && (
          <div
            onClick={handleSearchClick}
            className='p-1.5 rounded-full cursor-pointer hover:scale-125 transform transition duration-300'
          >
            <IoSearchSharp className='text-2xl font-bold animate-pulse' />
          </div>
        )}
      </div>

      {isSearchActive && (
        <div className='relative'>
          <SearchInput
            onSearch={handleSearch}
            placeholder='Bạn đang cần tìm ai?'
            textColor='text-black'
          />
          <div
            onClick={handleCancelSearch}
            className='absolute z-10 p-2 text-xl font-bold rounded-full cursor-pointer bg-slate-500 top-2 right-2 text-mainYellow'
          >
            <IoCloseSharp />
          </div>
          {(searchResults.length > 0 ||
            isSearching ||
            (searchResults.length === 0 && hasSearchTerm)) && (
            <div className='mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-y-auto max-h-[400px]'>
              {renderSearchResults()}
            </div>
          )}
        </div>
      )}

      <div className='mx-auto mt-4'>
        <Segment />
      </div>

      <div className='mt-6 space-y-2 overflow-y-auto max-h-[calc(100vh-240px)] flex-1'>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => handleConversationSelect(conversation.id)}
            className={`cursor-pointer rounded-lg ${
              selectedConversationId === conversation.id
                ? 'bg-gray-100 dark:bg-gray-700'
                : ''
            }`}
          >
            <PersonalMessage
              lastMessage={conversation.last_message}
              members={conversation.other_members}
              currentUserId={userid}
              unreadCount={conversation.unread_count}
            />
          </div>
        ))}
      </div>

      <div className='absolute z-30 bottom-2 right-6'>
        <button className='flex items-center justify-center w-10 h-10 text-white bg-green-500 rounded-full shadow-lg'>
          <span className='text-2xl font-bold'>+</span>
        </button>
      </div>
    </div>
  );
};

export default MessageList;
