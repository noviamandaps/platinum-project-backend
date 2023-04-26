"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Flight.init(
    {
      departureAirport: DataTypes.INTEGER,
      arrivalAirport: DataTypes.INTEGER,
      departureDate: DataTypes.DATE,
      arrivalDate: DataTypes.DATE,
      departureTime: DataTypes.TIME,
      arrivalTime: DataTypes.TIME,
      planeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Flight",
    }
  );
  return Flight;
};
