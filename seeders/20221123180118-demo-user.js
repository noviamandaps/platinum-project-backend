"use strict";
const bcrypt = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstname: "admin",
          lastname: "saja",
          gender: "Laki-laki",
          email: "admin@gmail.com",
          phone: "0896789203",
          birthdate: "1999-09-30",
          pictures: "",
          password: await bcrypt.hash("123456", 10),
          role_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "buyer",
          lastname: "saja",
          gender: "Laki-laki",
          email: "buyer@gmail.com",
          phone: "0896789203",
          birthdate: "2001-09-20",
          pictures: "",
          password: await bcrypt.hash("123456", 10),
          role_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Users",
      { email: { [Op.in]: emails } },
      {}
    );
  },
};
