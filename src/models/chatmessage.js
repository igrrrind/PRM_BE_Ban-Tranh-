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
      ChatMessage.belongsTo(models.User, { foreignKey: 'UserID' });
    }
  }
  ChatMessage.init({
    ChatMessageID: DataTypes.INTEGER,
    UserID: DataTypes.INTEGER,
    Message: DataTypes.STRING,
    SentAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ChatMessage',
  });
  return ChatMessage;
};