const {
  Conversation,
  ConversationMember,
  Message,
  User,
  MessageRead,
  Sequelize,
} = require('../models');
const { Op } = require('sequelize');
const baseURL = process.env.BASE_URL || 'https://192.168.0.102:3000';
exports.CreateConversation = async (
  type,
  title,
  created_by,
  last_message_at = null
) => {
  try {
    // Validate the `type`
    const validTypes = ['private', 'group'];
    if (!validTypes.includes(type)) {
      return { success: false, message: 'Invalid conversation type' };
    }

    // Create the new conversation
    const newConversation = await Conversation.create({
      type,
      title,
      created_by,
      created_at: new Date(),
      updated_at: new Date(),
      last_message_at,
    });

    // Return the newly created conversation
    return { success: true, conversation: newConversation };
  } catch (error) {
    // Handle any errors
    console.error('Error creating conversation:', error);
    return {
      success: false,
      message: 'An error occurred while creating the conversation',
    };
  }
};
exports.GetUserConversations = async (userId) => {
  // console.log('userId', userId);
  try {
    if (!userId) {
      return {
        success: false,
        message: 'User ID is required',
      };
    }

    const queryConfig = {
      include: [
        // Include current user's membership information
        {
          model: ConversationMember,
          as: 'ConversationMembers',
          where: {
            user_id: userId,
            left_at: null,
          },
          required: true,
        },
        // Include other members and their user information
        {
          model: ConversationMember,
          as: 'ConversationMembers',
          where: {
            user_id: { [Op.ne]: userId },
            left_at: null,
          },
          // Important: Change the include structure to properly join with User model
          include: {
            model: User,
            attributes: ['user_id', 'user_name', 'avatar_link', 'email'],
          },
          required: false,
        },
        // Include latest message with sender information
        {
          model: Message,
          separate: true,
          limit: 1,
          order: [['sent_at', 'DESC']],
          where: {
            deleted_at: null,
          },
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['user_id', 'user_name', 'avatar_link', 'email'],
            },
          ],
        },
      ],
      order: [['last_message_at', 'DESC']],
    };

    const conversations = await Conversation.findAll(queryConfig);

    // Format the response data
    const formattedConversations = conversations.map((conv) => {
      const conversation = conv.toJSON();
      const lastMessage = conversation.Messages?.[0];

      return {
        id: conversation.id,
        type: conversation.type,
        title: conversation.title,
        created_at: conversation.created_at,
        last_message: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              type: lastMessage.type,
              sent_at: lastMessage.sent_at,
              sender: lastMessage.sender
                ? {
                    user_id: lastMessage.sender.user_id,
                    username: lastMessage.sender.user_name,
                    avatar: lastMessage.sender.avatar_link,
                    email: lastMessage.sender.email,
                  }
                : null,
            }
          : null,
        // Updated member mapping to match new structure
        members:
          conversation.ConversationMembers?.map((member) => ({
            user_id: member.User.user_id,
            username: member.User.user_name,
            avatar: member.User.avatar_link,
            role: member.role,
            joined_at: member.joined_at,
          })) || [],
      };
    });

    return {
      success: true,
      data: formattedConversations,
    };
  } catch (error) {
    console.error('Error getting user conversations:', error);
    return {
      success: false,
      message: 'An error occurred while fetching conversations',
    };
  }
};
exports.GetUserConversationsV2 = async (userId) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: 'User ID is required',
      };
    }

    // Get all conversation IDs where the user is an active member
    const userConversations = await ConversationMember.findAll({
      where: {
        user_id: userId,
        left_at: null,
      },
      attributes: ['conversation_id'],
    });

    const conversationIds = userConversations.map(
      (conv) => conv.conversation_id
    );

    // Get all messages that haven't been read by the user
    const unreadMessageCounts = await Message.findAll({
      attributes: [
        'conversation_id',
        [Sequelize.fn('COUNT', Sequelize.col('Message.id')), 'unread_count'],
      ],
      where: {
        conversation_id: conversationIds,
        sender_id: { [Op.ne]: userId },
        deleted_at: null,
        sent_at: {
          [Op.gt]: Sequelize.literal(
            "(SELECT COALESCE(MAX(read_at), '1970-01-01') FROM MessageReads WHERE user_id = :userId AND message_id = Message.id)"
          ),
        },
      },
      group: ['conversation_id'],
      replacements: { userId },
    });

    // Create a map of conversation_id to unread count
    const unreadCountsMap = unreadMessageCounts.reduce((acc, item) => {
      acc[item.conversation_id] = Math.min(
        parseInt(item.get('unread_count')),
        9
      );
      return acc;
    }, {});

    // Get full conversation details
    const queryConfig = {
      where: {
        id: conversationIds,
      },
      include: [
        // Include all active members
        {
          model: ConversationMember,
          as: 'ConversationMembers',
          where: {
            left_at: null,
          },
          include: {
            model: User,
            attributes: [
              'user_id',
              'user_name',
              'avatar_link',
              'last_login',
              'email',
            ],
          },
        },
        // Include latest message
        {
          model: Message,
          separate: true,
          limit: 1,
          order: [['sent_at', 'DESC']],
          where: {
            deleted_at: null,
          },
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['user_id', 'user_name', 'avatar_link', 'last_login'],
            },
          ],
        },
      ],
      order: [['last_message_at', 'DESC']],
    };

    const conversations = await Conversation.findAll(queryConfig);

    // Format the response data
    const formattedConversations = conversations.map((conv) => {
      const conversation = conv.toJSON();
      const lastMessage = conversation.Messages?.[0];
      const otherMembers = conversation.ConversationMembers.filter(
        (member) => member.User.user_id !== userId
      );

      return {
        id: conversation.id,
        type: conversation.type,
        title:
          conversation.type === 'private' &&
          !conversation.title &&
          otherMembers[0]
            ? otherMembers[0].User.user_name
            : conversation.title,
        created_at: conversation.created_at,
        unread_count: unreadCountsMap[conversation.id] || 0,
        last_message: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              type: lastMessage.type,
              sent_at: lastMessage.sent_at,
              sender: lastMessage.sender
                ? {
                    user_id: lastMessage.sender.user_id,
                    username: lastMessage.sender.user_name,
                    avatar: lastMessage.sender.avatar_link,
                    last_login: lastMessage.sender.last_login,
                  }
                : null,
            }
          : null,
        members: conversation.ConversationMembers.map((member) => ({
          user_id: member.User.user_id,
          username: member.User.user_name,
          avatar: `${baseURL}${member.User.avatar_link}`,
          role: member.role,
          joined_at: member.joined_at,
          is_current_user: member.User.user_id === userId,
        })),
        other_members: otherMembers.map((member) => ({
          user_id: member.User.user_id,
          username: member.User.user_name,
          avatar: `${baseURL}${member.User.avatar_link}`,
          last_login: member.User.last_login,
          email: member.User.email,
        })),
      };
    });

    return {
      success: true,
      data: formattedConversations,
    };
  } catch (error) {
    console.error('Error getting user conversations:', error);
    return {
      success: false,
      message: 'An error occurred while fetching conversations',
    };
  }
};
