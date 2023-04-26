"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Flights", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      departureAirport: {
        type: Sequelize.INTEGER,
      },
      arrivalAirport: {
        type: Sequelize.INTEGER,
      },
      departureDate: {
        type: Sequelize.DATE,
      },
      arrivalDate: {
        type: Sequelize.DATE,
      },
      departureTime: {
        type: Sequelize.TIME,
      },
      arrivalTime: {
        type: Sequelize.TIME,
      },
      planeId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Flights");
  },
};
