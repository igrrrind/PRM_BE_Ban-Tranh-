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
      Cart.belongsTo(models.User, { foreignKey: 'userID' });
      // Cart hasMany CartItem
      Cart.hasMany(models.CartItem, { foreignKey: 'cartID' });
      // Cart hasOne Order (REMOVED: Order no longer references cart)
    }
  }
  Cart.init({
    userID: DataTypes.INTEGER,
    totalPrice: DataTypes.FLOAT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};