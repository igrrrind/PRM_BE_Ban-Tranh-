'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Product belongsTo Category
      Product.belongsTo(models.Category, { foreignKey: 'categoryID', as: 'category' });
      // Product hasMany CartItem
      Product.hasMany(models.CartItem, { foreignKey: 'productID' });
    }
  }
  Product.init({
    productName: DataTypes.STRING,
    briefDescription: DataTypes.STRING,
    fullDescription: DataTypes.TEXT,
    technicalSpecifications: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    imageURL: DataTypes.STRING,
    categoryID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};