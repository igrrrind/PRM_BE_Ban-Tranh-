'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // ChatMessage belongsTo User
      ChatMessage.belongsTo(models.User, { foreignKey: 'userID' });
    }
  }
  ChatMessage.init({
    userID: DataTypes.INTEGER,
    message: DataTypes.STRING,
    sentAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ChatMessage',
  });
  return ChatMessage;
};