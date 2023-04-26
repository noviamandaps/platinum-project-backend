'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Passanger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Passanger.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    age: DataTypes.INTEGER,
    identityType: DataTypes.STRING,
    identityNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Passanger',
  });
  return Passanger;
};