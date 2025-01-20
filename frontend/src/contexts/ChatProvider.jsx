// contexts/ChatContext.js
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { getConversations, getMessages } from '../services/getApi';
import { useSocket } from './SocketContext';
import axios from 'axios';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // State for both Messenger and ChatWidget
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { socket } = useSocket();

  // Widget specific state
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [widgetConversation, setWidgetConversation] = useState(null);


  const markMessagesAsRead = async (conversationId, messageId, accessToken) => {
    console.log('Marking messages as read:', conversationId, messageId);
    try {
      await axios.post(
        'https://192.168.0.102:3000/api/messages/mark_read/',
        {
          conversation_id: conversationId,
          message_id: messageId
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const res = await getConversations();
      if (res.data?.length > 0) {
        setConversations(res.data);
        // Only set selected conversation if none is selected
        if (!selectedConversation) {
          setSelectedConversation(res.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }, [selectedConversation]);

  // Load messages for a conversation
  const loadMessages = useCallback(
    async (conversationId, lastId = null, accessToken) => {
      if (!conversationId || isLoading) return;

      try {
        setIsLoading(true);
        const res = await getMessages(conversationId, accessToken, lastId);

        if (res.messages?.length > 0) {
          if (lastId) {
            setMessages((prev) => [...prev, ...res.messages]);
          } else {
            setMessages(res.messages);
          }

          const sortedNewMessages = [...res.messages].sort(
            (a, b) => a.id - b.id
          );
          setLastMessageId(sortedNewMessages[0].id);
          setHasMore(res.messages.length === 10);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  // Handle new message
  const handleNewMessage = useCallback(
    async (message, conversationId) => {
      // Update messages if the conversation is selected
      if (selectedConversation?.id === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
  
      // Fetch fresh conversations to ensure we have the latest data
      await fetchConversations();
  
      // Handle widget notifications
      if (!isWidgetOpen && selectedConversation?.id !== conversationId) {
        setUnreadCount((prev) => prev + 1);
        // Auto open widget for new conversations
        if (!widgetConversation) {
          const conversation = conversations.find(
            (c) => c.id === conversationId
          );
          if (conversation) {
            setWidgetConversation(conversation);
            setIsWidgetOpen(true);
          }
        }
      }
    },
    [selectedConversation, isWidgetOpen, conversations, widgetConversation, fetchConversations]
  );

  // Select conversation
  const selectConversation = useCallback(
    async (conversationId, accessToken) => {
      const selected = conversations.find((conv) => conv.id === conversationId);
      if (selected) {
        setSelectedConversation(selected);
        setMessages([]);
        setLastMessageId(null);
        setHasMore(true);

        // If there are unread messages, mark them as read
        if (selected.unread_count > 0 && selected.last_message) {
          await markMessagesAsRead(
            selected.id,
            selected.last_message.id,
            accessToken
          );
          // Update conversations to reflect read status
          await fetchConversations();
        }
      }
    },
    [conversations, fetchConversations]
  );

  // Toggle chat widget
  const toggleWidget = useCallback(() => {
    setIsWidgetOpen((prev) => !prev);
    if (!isWidgetOpen) {
      setUnreadCount(0);
    }
  }, [isWidgetOpen]);

  // Initial fetch of conversations
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const value = {
    // Shared state
    conversations,
    selectedConversation,
    messages,
    hasMore,
    isLoading,
    lastMessageId,

    // Widget specific state
    isWidgetOpen,
    unreadCount,
    widgetConversation,

    // Actions
    selectConversation,
    loadMessages,
    handleNewMessage,
    toggleWidget,
    setWidgetConversation,
    setIsWidgetOpen,

    // Fetch methods
    fetchConversations,
    markMessagesAsRead
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
