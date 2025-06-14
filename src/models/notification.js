'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Notification belongsTo User
      Notification.belongsTo(models.User, { foreignKey: 'UserID' });
    }
  }
  Notification.init({
    UserID: DataTypes.INTEGER,
    Message: DataTypes.STRING,
    IsRead: DataTypes.BOOLEAN,
    CreatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};