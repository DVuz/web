import React, { useEffect } from 'react';
import MessageList from '../../shared/Messenger/MessageList';
import MessageContent from '../../shared/Messenger/MessageContent';
import userAuth from '../../../hooks/useAuth';
import { useChat } from '../../../contexts/ChatProvider';
import { useSocket } from '../../../contexts/SocketContext';

const Messenger = () => {
  const {
    conversations,
    selectedConversation,
    messages,
    hasMore,
    isLoading,
    selectConversation,
    loadMessages,
    lastMessageId,
    fetchConversations
  } = useChat();
  const { user } = userAuth();
  const { socket } = useSocket();

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation?.id) {
      loadMessages(selectedConversation.id, null, user?.accessToken);
    }
  }, [selectedConversation?.id]);

  useEffect(() => {
    if (!socket) return;

    socket.on('message:received', async ({ conversationId, message }) => {
      // Reload conversations list to get updated last messages
      await fetchConversations();
      
      // If the message is for the current conversation, reload messages
      if (selectedConversation?.id === conversationId) {
        loadMessages(conversationId, null, user?.accessToken);
      }
    });

    return () => {
      socket.off('message:received');
    };
  }, [socket, selectedConversation?.id, loadMessages, fetchConversations]);

  return (
    <div className='flex items-stretch gap-6 p-6 mt-6 dark:bg-bgDiv rounded-3xl'>
      <MessageList
        conversations={conversations}
        onSelectConversation={(conversationId) => 
          selectConversation(conversationId, user?.accessToken)
        }
        selectedConversationId={selectedConversation?.id}
        userid={user?.decodedToken.id}
        accessToken={user?.accessToken}
      />
      <MessageContent
        messages={messages}
        selectedConversation={selectedConversation}
        userid={user?.decodedToken.id}
        onLoadMore={() =>
          loadMessages(
            selectedConversation.id,
            lastMessageId,
            user?.accessToken
          )
        }
        hasMore={hasMore}
        isLoading={isLoading}
        accessToken={user?.accessToken}
      />
    </div>
  );
};

export default Messenger; 