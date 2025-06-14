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
      Order.belongsTo(models.Cart, { foreignKey: 'CartID' });
      // Order belongsTo User
      Order.belongsTo(models.User, { foreignKey: 'UserID' });
      // Order hasOne Payment
      Order.hasOne(models.Payment, { foreignKey: 'OrderID' });
    }
  }
  Order.init({
    CartID: DataTypes.INTEGER,
    UserID: DataTypes.INTEGER,
    PaymentMethod: DataTypes.STRING,
    BillingAddress: DataTypes.STRING,
    OrderStatus: DataTypes.STRING,
    OrderDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};