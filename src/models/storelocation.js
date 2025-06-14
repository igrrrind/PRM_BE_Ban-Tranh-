'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StoreLocation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StoreLocation.init({
    Latitude: DataTypes.FLOAT,
    Longitude: DataTypes.FLOAT,
    Address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StoreLocation',
  });
  return StoreLocation;
};