// module.exports = (sequelize, DataTypes) => {
//   const ChatRoom = sequelize.define(
//     'ChatRoom',
//     {
//       room_id: {
//         type: DataTypes.STRING,
//         primaryKey: true,
//         allowNull: false,
//       },
//       user_1_id: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         references: {
//           model: 'Users',
//           key: 'user_id',
//         },
//       },
//       user_2_id: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         references: {
//           model: 'Users',
//           key: 'user_id',
//         },
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

//   // ChatRoom.associate = (models) => {
//   //   // A ChatRoom can have many Messages
//   //   ChatRoom.hasMany(models.Message, {
//   //     foreignKey: 'room_id',
//   //     as: 'messages',
//   //   });

//   //   // A ChatRoom is associated with two Users (user_1 and user_2)
//   //   ChatRoom.belongsTo(models.User, {
//   //     foreignKey: 'user_1_id',
//   //     as: 'user1',
//   //   });

//   //   ChatRoom.belongsTo(models.User, {
//   //     foreignKey: 'user_2_id',
//   //     as: 'user2',
//   //   });
//   // };

//   return ChatRoom;
// };
const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const ChatRoom = sequelize.define('ChatRoom', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  });

  return ChatRoom;
};
