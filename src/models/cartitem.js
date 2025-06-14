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
      CartItem.belongsTo(models.Cart, { foreignKey: 'cartID' });
      // CartItem belongsTo Product
      CartItem.belongsTo(models.Product, { foreignKey: 'productID' });
    }
  }
  CartItem.init({
    cartID: DataTypes.INTEGER,
    productID: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};