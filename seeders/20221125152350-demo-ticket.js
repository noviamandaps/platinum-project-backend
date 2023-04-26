"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Tickets",
      [
        {
          flight_id: 1,
          class_id: 1,
          price: 150000,
          country: "Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          flight_id: 2,
          class_id: 2,
          price: 2500000,
          country: "Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          flight_id: 3,
          class_id: 2,
          price: 350000,
          country: "Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          flight_id: 4,
          class_id: 1,
          price: 450000,
          country: "Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tickets", null, {});
  },
};
