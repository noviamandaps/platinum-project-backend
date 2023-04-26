'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PassangerBooking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PassangerBooking.init({
    idPassanger: DataTypes.INTEGER,
    idBooking: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PassangerBooking',
  });
  return PassangerBooking;
};