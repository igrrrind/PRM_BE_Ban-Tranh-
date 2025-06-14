'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // CartItem belongsTo Cart
      CartItem.belongsTo(models.Cart, { foreignKey: 'CartID' });
      // CartItem belongsTo Product
      CartItem.belongsTo(models.Product, { foreignKey: 'ProductID' });
    }
  }
  CartItem.init({
    CartID: DataTypes.INTEGER,
    ProductID: DataTypes.INTEGER,
    Quantity: DataTypes.INTEGER,
    Price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};