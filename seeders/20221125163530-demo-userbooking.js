"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "UserBookings",
      [
        {
          user_id: 1,
          booking_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 2,
          booking_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("UserBookings", null, {});
  },
};
