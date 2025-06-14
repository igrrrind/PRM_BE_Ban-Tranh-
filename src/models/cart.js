'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Cart belongsTo User
      Cart.belongsTo(models.User, { foreignKey: 'UserID' });
      // Cart hasMany CartItem
      Cart.hasMany(models.CartItem, { foreignKey: 'CartID' });
      // Cart hasOne Order
      Cart.hasOne(models.Order, { foreignKey: 'CartID' });
    }
  }
  Cart.init({
    UserID: DataTypes.INTEGER,
    TotalPrice: DataTypes.FLOAT,
    Status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};