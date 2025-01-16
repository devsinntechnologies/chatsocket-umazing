// module.exports = (sequelize, DataTypes) => {
//   const Message = sequelize.define(
//     'Message',
//     {
//       message_id: {
//         type: DataTypes.STRING,
//         primaryKey: true,
//         allowNull: false,
//       },
//       room_id: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         references: {
//           model: 'ChatRooms',
//           key: 'room_id',
//         },
//       },
//       sender_id: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         references: {
//           model: 'Users',
//           key: 'user_id',
//         },
//       },
//       receiver_id: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         references: {
//           model: 'Users',
//           key: 'user_id',
//         },
//       },
//       message_text: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       timestamp: {
//         type: DataTypes.DATE,
//         defaultValue: DataTypes.NOW,
//       },
//       read: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//       },
//     },
//     {
//       timestamps: false,
//     }
//   );

//   Message.associate = (models) => {
//     // A Message belongs to a ChatRoom
//     Message.belongsTo(models.ChatRoom, {
//       foreignKey: 'room_id',
//       as: 'room',
//     });

//     // A Message is sent by a User
//     Message.belongsTo(models.User, {
//       foreignKey: 'sender_id',
//       as: 'sender',
//     });

//     Message.belongsTo(models.User, {
//       foreignKey: 'receiver_id',
//       as: 'receiver',
//   });
//   };

//   return Message;
// };
const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('Message', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    message_text: DataTypes.STRING,
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
  });

  return User;
};
