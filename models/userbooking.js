'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserBooking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserBooking.init({
    user_id: DataTypes.INTEGER,
    booking_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserBooking',
  });
  return UserBooking;
};