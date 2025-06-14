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
      // Order belongsTo Cart
      Order.belongsTo(models.Cart, { foreignKey: 'cartID' });
      // Order belongsTo User
      Order.belongsTo(models.User, { foreignKey: 'userID' });
      // Order hasOne Payment
      Order.hasOne(models.Payment, { foreignKey: 'orderID' });
    }
  }
  Order.init({
    cartID: DataTypes.INTEGER,
    userID: DataTypes.INTEGER,
    paymentMethod: DataTypes.STRING,
    billingAddress: DataTypes.STRING,
    orderStatus: DataTypes.STRING,
    orderDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};