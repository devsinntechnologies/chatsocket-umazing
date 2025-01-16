// db/index.js
const { Sequelize } = require('sequelize');
const ChatRoomModel = require('../models/ChatRoom');
const MessageModel = require('../models/Message');
const UserModel = require('../models/User');
const sequelize = new Sequelize('umazing', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection established.');
  })
  .catch((error) => {
    console.log('Error: ' + error);
  });

const ChatRoom = ChatRoomModel(sequelize, Sequelize);
const Message = MessageModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);



// Define Associations
// ChatRoom.hasMany(Message);
// Message.belongsTo(ChatRoom);
// User.hasMany(ChatRoom, { as: 'UserId1', foreignKey: 'UserId' });
// User.hasMany(ChatRoom, { as: 'UserId2', foreignKey: 'UserId' });
// ChatRoom.belongsTo(User, { as: 'ParentCategory', foreignKey: 'CategoryId' })

// Define Associations

// ChatRooms and Users (UserId1 and UserId2 represent foreign keys to Users)
ChatRoom.belongsTo(User, {
    as: 'User1', // Alias for the first user
    foreignKey: 'UserId1',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  ChatRoom.belongsTo(User, {
    as: 'User2', // Alias for the second user
    foreignKey: 'UserId2',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  
  // ChatRooms and Messages
  ChatRoom.hasMany(Message, {
    foreignKey: 'RoomId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Message.belongsTo(ChatRoom, {
    foreignKey: 'RoomId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  
  // Messages and Users (Sender and Receiver)
  Message.belongsTo(User, {
    as: 'Sender',
    foreignKey: 'SenderId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Message.belongsTo(User, {
    as: 'Receiver',
    foreignKey: 'ReceiverId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  
  // Users and Messages (Optional: Define reverse associations if needed)
  User.hasMany(Message, {
    as: 'SentMessages',
    foreignKey: 'SenderId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  User.hasMany(Message, {
    as: 'ReceivedMessages',
    foreignKey: 'ReceiverId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
module.exports = {
Message,
User,
sequelize,
ChatRoom,
};
