const { User, ChatRoom, Message } = require("../db/index");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken"); // Ensure you have this installed: npm install jsonwebtoken

// Get all chat rooms for logged-in user
const getUserChatRooms = async (req, res) => {
  try {
    const userId = req.user.id;

    const chatRooms = await ChatRoom.findAll({
      where: {
        [Op.or]: [{ UserId1: userId }, { UserId2: userId }],
      },
      include: [
        {
          model: User,
          as: "User1", // Alias for user_1
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "User2", // Alias for user_2
          attributes: ["id", "name", "email"],
        },
        {
          model: Message,
          as: "Messages",
          attributes: [
            "message_text",
            "SenderId",
            "ReceiverId",
            "timestamp",
            "read",
          ],
        },
      ],
    });

    // Format the chat rooms
    const formattedRooms = chatRooms.map((room) => {
      // Determine the other user in the chat room
      const otherUser = room.User1.id === userId ? room.User2 : room.User1;

      // Count unread messages for the logged-in user
      const unreadCount = room.Messages.filter(
        (message) => message.read === false && message.ReceiverId === userId
      ).length;

      // Find the last message in the chat room
      const lastMessage = room.Messages.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      )[0];

      return {
        roomId: room.id,
        roomName: otherUser ? `${otherUser.name}` : "Unknown",
        receiver: {
          id: otherUser.id,
          name: otherUser.name,
          email: otherUser.email,
        },
        unreadMessages: unreadCount,
        lastMessage: lastMessage
          ? {
              content: lastMessage.message_text,
              timestamp: lastMessage.timestamp,
            }
          : null,
      };
    });

    res.status(200).json({ success: true, data: formattedRooms });
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch chat rooms" });
  }
};

// Get all chats in a specific chat room
const getAllChatsInChatRoom = async (req, res) => {
  const userId = req.user.id;
  try {
    const { id: chatRoomId } = req.params;

    // Determine user IDs from chatRoomId
    const [user1, user2] = chatRoomId.split('-').map(String);
    const receiverId = user1 === userId ? user2 : user1;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Unable to determine the receiver ID.",
      });
    }

    // Fetch receiver details
    const receiver = await User.findOne({
      where: { id: receiverId },
      attributes: ["id", "name", "email"],
    });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found.",
      });
    }

    // Fetch messages in the chat room
    const messages = await Message.findAll({
      where: { RoomId: chatRoomId },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "Receiver",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["timestamp", "ASC"]],
    });

    // Format messages for response
    const formattedMessages = messages.map((message) => ({
      id: message.id,
      content: message.message_text,
      timestamp: message.timestamp,
      sender: {
        id: message.Sender.id,
        name: message.Sender.name,
      },
      receiver: {
        id: message.Receiver.id,
        name: message.Receiver.name,
      },
      isRead: message.read,
    }));

    res.status(200).json({
      success: true,
      data: {
        receiver: {
          id: receiver.id,
          name: receiver.name,
        },
        messages: formattedMessages,
      },
    });
  } catch (error) {
    console.error("Error fetching chats in room:", error);
    res.status(500).json({ success: false, message: "Failed to fetch chats in room" });
  }
};


// Send a message
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id; // Assume the sender is authenticated
    const { receiverId, content } = req.body;

    console.log({ senderId, receiverId, content });

    // Find or create the chat room
    let room = await ChatRoom.findOne({
      where: {
        [Op.or]: [
          { UserId1: senderId, UserId2: receiverId },
          { UserId1: receiverId, UserId2: senderId },
        ],
      },
      include: [
        {
          model: User,
          as: "User1", // Alias for user_1
          attributes: ["id", "name", "email"],
        },
        {
          model: User,
          as: "User2", // Alias for user_2
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // If the room doesn't exist, create it
    if (!room) {
      room = await ChatRoom.create({
        id: `${senderId}-${receiverId}`, // Unique ID for the room
        UserId1: senderId,
        UserId2: receiverId,
      });
    }

    // Create the message
    const message = await Message.create({
      id: `msg-${Date.now()}`, // Example unique ID
      RoomId: room.id,
      SenderId: senderId,
      ReceiverId: receiverId,
      message_text: content,
    });

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

module.exports = {
  getUserChatRooms,
  getAllChatsInChatRoom,
  sendMessage,
};
