"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Flights",
      [
        {
          departureAirport: 1,
          arrivalAirport: 2,
          departureDate: "2022-09-30",
          arrivalDate: "2022-10-02",
          departureTime: "23:05:59",
          arrivalTime: "07:09:20",
          planeId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departureAirport: 2,
          arrivalAirport: 1,
          departureDate: "2022-10-04",
          arrivalDate: "2022-10-07",
          departureTime: "23:05:59",
          arrivalTime: "07:09:20",
          planeId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departureAirport: 4,
          arrivalAirport: 5,
          departureDate: "2022-09-30",
          arrivalDate: "2022-10-02",
          departureTime: "23:05:59",
          arrivalTime: "07:09:20",
          planeId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departureAirport: 5,
          arrivalAirport: 4,
          departureDate: "2022-10-04",
          arrivalDate: "2022-10-07",
          departureTime: "23:05:59",
          arrivalTime: "07:09:20",
          planeId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Flights", null, {});
  },
};
