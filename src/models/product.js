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
      Product.belongsTo(models.Category, { foreignKey: 'CategoryID' });
      // Product hasMany CartItem
      Product.hasMany(models.CartItem, { foreignKey: 'ProductID' });
    }
  }
  Product.init({
    ProductName: DataTypes.STRING,
    BriefDescription: DataTypes.STRING,
    FullDescription: DataTypes.TEXT,
    TechnicalSpecifications: DataTypes.TEXT,
    Price: DataTypes.FLOAT,
    ImageURL: DataTypes.STRING,
    CategoryID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};