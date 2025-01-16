const { ChatRoom, Message } = require("../db/index");
const { Op } = require("sequelize");

module.exports = (io, socket) => {
  // Join and open a chat room, handling unread messages
  socket.on("joinChatRoom", async (roomId) => {
    try {
      if (!socket.user || !socket.user.id) {
        return socket.emit("error", { message: "User is not authenticated" });
      }

      const userId = socket.user.id;

      // Join the room
      socket.join(roomId);
      console.log(`User with ID ${userId} joined room ${roomId}`);

      // Fetch unread messages specific to the receiver
      const unreadMessages = await Message.findAll({
        where: {
          RoomId: roomId,
          ReceiverId: userId,
          read: false,
        },
        attributes: ["id", "message_text", "timestamp"],
        order: [["timestamp", "ASC"]],
      });

      // Mark these messages as read
      const messageIds = unreadMessages.map((message) => message.id);
      if (messageIds.length > 0) {
        await Message.update(
          { read: true },
          { where: { id: { [Op.in]: messageIds } } }
        );

        // Emit 'messageRead' for the updated messages
        io.to(roomId).emit("messageRead", {
          roomId,
          userId,
          unreadMessages: 0, // Indicating all messages are read
        });
      }

      // Fetch the last message in the room
      const lastMessage = await Message.findOne({
        where: { RoomId: roomId },
        order: [["timestamp", "DESC"]],
      });

      // Emit updated chat room data to the client
      socket.emit("chatRoomUpdated", {
        roomId,
        unreadMessages: unreadMessages.length(),
        lastMessage: {
          content: lastMessage ? lastMessage.message_text : null,
          image: lastMessage ? lastMessage.image_url : null,
          timestamp: lastMessage ? lastMessage.timestamp : null,
        },
      });

      // Notify all other rooms about the updated unread messages count
      const relatedRooms = await ChatRoom.findAll({
        where: {
          [Op.or]: [{ UserId1: userId }, { UserId2: userId }],
        },
      });

      relatedRooms.forEach(async (room) => {
        const receiverId = room.UserId1 === userId ? room.UserId2 : room.UserId1;

        // Emit to the sender in other rooms
        io.to(room.id).emit("chatRoomUpdated", {
          roomId: room.id,
          unreadMessages: receiverId === userId ? 0 : undefined, // Update for receiver
        });
      });
    } catch (error) {
      console.error("Error in joinChatRoom:", error);
      socket.emit("error", { message: "Failed to join chat room" });
    }
  });

  // Typing event
  socket.on("typing", ({ roomId }) => {
    try {
      const senderId = socket.user.id;
      if (!senderId) throw new Error("Sender ID is not defined");
      socket.to(roomId).emit("typing", { roomId, senderId }); // Notify other clients
    } catch (error) {
      console.error("Error in typing event:", error);
    }
  });

  // Stop typing event
  socket.on("stopTyping", ({ roomId }) => {
    try {
      const senderId = socket.user.id;
      if (!senderId) throw new Error("Sender ID is not defined");
      socket.to(roomId).emit("stopTyping", { roomId, senderId }); // Notify other clients
    } catch (error) {
      console.error("Error in stopTyping event:", error);
    }
  });

  // Mark messages as read
  socket.on("messageRead", async ({ roomId }) => {
    try {
      const userId = socket.user.id;

      // Update only the messages belonging to the receiver as read
      await Message.update(
        { read: true },
        { where: { RoomId: roomId, ReceiverId: userId, read: false } }
      );

      // Notify other clients in the room
      io.to(roomId).emit("messageRead", { roomId, userId });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  });
};
