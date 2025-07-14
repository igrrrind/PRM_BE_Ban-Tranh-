'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Order belongsTo User
      Order.belongsTo(models.User, { foreignKey: 'userID' });
      // Order hasOne Payment
      Order.hasOne(models.Payment, { foreignKey: 'orderID' });
      // Order hasMany OrderItem
      Order.hasMany(models.OrderItem, { foreignKey: 'orderID' });
    }
  }
  Order.init({
    userID: DataTypes.INTEGER,
    paymentMethod: DataTypes.STRING,
    billingAddress: DataTypes.STRING,
    orderStatus: DataTypes.STRING,
    orderDate: DataTypes.DATE,
    total: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};