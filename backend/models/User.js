const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      // autoIncrement: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phoneNo: DataTypes.STRING,
    gender: DataTypes.STRING,
    dob: DataTypes.STRING,
    imageUrl: {
      type: DataTypes.STRING,
      defaultValue: '', 
    },
    isBlock: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, 
    },
    isDelete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, 
    }
  });

  return User;
};
