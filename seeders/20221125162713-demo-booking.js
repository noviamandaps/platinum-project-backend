"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Bookings",
      [
        {
          ticket_id_departure: 1,
          ticket_id_return: 2,
          totalPassanger: 3,
          isBooking: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ticket_id_departure: 3,
          ticket_id_return: 4,
          totalPassanger: 5,
          isBooking: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Bookings", null, {});
  },
};
