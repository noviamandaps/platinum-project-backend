"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Addresses",
      [
        {
          homeAddress: "Jalan Delitua Pamah",
          city: "Medan",
          province: "Sumatera Utara",
          country: "Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          homeAddress: "Jalan Delitua Pamah 2",
          city: "Medan 2",
          province: "Sumatera Utara 2",
          country: "Indonesia 2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Addresses", null, {});
  },
};
