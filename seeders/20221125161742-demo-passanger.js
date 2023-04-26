"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Passangers",
      [
        {
          firstname: "FIrman",
          lastname: "Perdana",
          email: "firman@gmail.com",
          age: 20,
          identityType: "KTP",
          identityNumber: "123124123124",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Irvan",
          lastname: "Wijaya",
          email: "irvan@gmail.com",
          age: 20,
          identityType: "KTP",
          identityNumber: "123124123124",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Hendri",
          lastname: "Permana",
          email: "hendri@gmail.com",
          age: 20,
          identityType: "KTP",
          identityNumber: "123124123124",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Dewa",
          lastname: "Biara",
          email: "biara@gmail.com",
          age: 20,
          identityType: "KTP",
          identityNumber: "123124123124",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Passangers", null, {});
  },
};
