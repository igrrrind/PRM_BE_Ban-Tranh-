'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Payment belongsTo Order
      Payment.belongsTo(models.Order, { foreignKey: 'OrderID' });
    }
  }
  Payment.init({
    OrderID: DataTypes.INTEGER,
    Amount: DataTypes.FLOAT,
    PaymentDate: DataTypes.DATE,
    PaymentStatus: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};