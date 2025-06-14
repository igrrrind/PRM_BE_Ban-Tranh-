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
      User.hasMany(models.Cart, { foreignKey: 'UserID' });
      // User hasMany Order
      User.hasMany(models.Order, { foreignKey: 'UserID' });
      // User hasMany Notification
      User.hasMany(models.Notification, { foreignKey: 'UserID' });
      // User hasMany ChatMessage
      User.hasMany(models.ChatMessage, { foreignKey: 'UserID' });
    }
  }
  User.init({
    Username: DataTypes.STRING,
    PasswordHash: DataTypes.STRING,
    Email: DataTypes.STRING,
    PhoneNumber: DataTypes.STRING,
    Address: DataTypes.STRING,
    Role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};