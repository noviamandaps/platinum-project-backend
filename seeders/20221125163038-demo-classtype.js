"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "ClassTypes",
      [
        {
          type: "Business",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "Economy",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ClassTypes", null, {});
  },
};
