const { ChatRoom, Message, User } = require('../db/index');
const { Op } = require('sequelize');

module.exports = (io, socket) => {
  // Event: Send Message
  socket.on("sendMessage", async ({ roomId, receiverId, content }) => {
    try {
      const senderId = socket.user.id; // Assume the sender is authenticated
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
            as: 'User1', // Alias for user_1
            attributes: ['id', 'name', 'email', 'imageUrl'],
          },
          {
            model: User,
            as: 'User2', // Alias for user_2
            attributes: ['id', 'name', 'email', 'imageUrl'],
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

      const sender = await User.findByPk(senderId, {
        attributes: ['id', 'name', 'email', "imageUrl"],
      });
      const receiver = await User.findByPk(receiverId, {
        attributes: ['id', 'name', 'email', "imageUrl"],
      });

      // Prepare the message payload
      const messagePayload = {
        roomId: room.id,
        message: {
          id: message.id,
          content: message.message_text,
          sender: {
            id: sender.id,
            name: sender.name,
            email: sender.email,
            imageUrl: sender.imageUrl,
          },
          receiver: {
            id: receiver.id,
            name: receiver.name,
            email: receiver.email,
            imageUrl: receiver.imageUrl,
          },
          timestamp: message.createdAt,
          isRead: false, // Initially unread
        },
      };

      // Emit to the sender's socket
      socket.emit('receiveMessage', messagePayload);

      // Emit to the receiver's socket if connected
      const receiverSocket = Array.from(io.sockets.sockets.values()).find(
        (s) => s.user && s.user.id === receiverId
      );

      if (receiverSocket) {
        receiverSocket.emit('receiveMessage', messagePayload);

        // Mark the message as read if the receiver is in the room
        if (receiverSocket.rooms.has(room.id)) {
          await Message.update({ read: true }, { where: { id: message.id } });
          messagePayload.message.isRead = true;

          // Notify the sender that the message is read
          socket.emit('messageRead', {
            roomId: room.id,
            messageId: message.id,
          });

          // Notify the receiver's socket about the updated message state
          receiverSocket.emit('messageRead', {
            roomId: room.id,
            messageId: message.id,
          });
        }
      } else {
        console.log(`Receiver with ID ${receiverId} is not connected.`);
      }

      // Emit a "newMessage" event to update room details for both participants
      const updatedRoom = {
        roomId: room.id,
        lastMessage: {
          content: message.message_text,
          timestamp: message.createdAt,
          isRead: messagePayload.message.isRead,
        },
        unreadMessages: room.Messages.filter((m) =>!m.read).length, // Count unread messages in the room
      };

      // Emit to both participants
      socket.emit('newMessage', updatedRoom);
      if (receiverSocket) {
        receiverSocket.emit('newMessage', updatedRoom);
      }

      console.log({ success: true, data: message });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
};
