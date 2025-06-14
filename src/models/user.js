'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User hasMany Cart
      User.hasMany(models.Cart, { foreignKey: 'userID' });
      // User hasMany Order
      User.hasMany(models.Order, { foreignKey: 'userID' });
      // User hasMany Notification
      User.hasMany(models.Notification, { foreignKey: 'userID' });
      // User hasMany ChatMessage
      User.hasMany(models.ChatMessage, { foreignKey: 'userID' });
    }
  }
  User.init({
    username: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};